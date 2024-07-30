<template>
  <div :class="{ 'xh-40': showAdd }" :style="{ height: addContainerHeight }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="add"
    >
      <span class="mdi mdi-plus"></span> Select Source
    </button>
    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        ref="addContainer"
        class="left-0 top-0 flex h-full w-full flex-col bg-white p-2 dark:bg-surface--dark-300"
      >
        <div class="py-1">
          <select
            v-model="source"
            class="w-full rounded-sm border border-primary bg-white outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
            @change="changeSource"
          >
            <option
              v-for="source_type in sourceTypes"
              :key="source_type.value"
              :value="source_type.value"
            >
              {{ source_type.label }}
            </option>
          </select>
        </div>
        <div v-if="source == 'static'" class="flex-grow">
          <textarea
            v-model="sourceStatic"
            class="h-full w-full rounded-sm border border-primary p-1 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
            placeholder="Type text here"
          ></textarea>
        </div>
        <div v-else-if="source == 'api'" class="flex-grow">
          <http-request-element
            v-model="sourceAPI.values"
            :fields="fields"
            :options="sourceAPI.options"
          ></http-request-element>
        </div>
        <div v-else class="flex-grow">
          <input
            type="text"
            class="w-full rounded-sm border border-primary dark:border-primary--dark"
          />
        </div>
        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="
              addContainerHeight = 'auto';
              showAdd = false;
            "
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="save"
          >
            <span class="mdi mdi-check"></span> Save
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import HttpRequestElement from "./Element/HttpRequestElement.vue";

export default {
  components: {
    HttpRequestElement
  },
  props: {
    configuration: {
      type: Object,
      default: function () {
        return {
          apiEndpointAdditionalFields: [],
          hideLabel: false
        };
      }
    },
    containers: {
      type: Object,
      default: function () {
        return {};
      }
    },
    fieldProperty: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    change: null
  },
  data: function () {
    return {
      addContainerHeight: "auto",
      showAdd: false,
      sourceTypes: [
        {
          label: "Static",
          value: "static"
        },
        {
          label: "API Endpoint",
          value: "api"
        }
      ],
      source: "static",
      sourceStatic: "",
      sourceAPI: {
        options: [
          {
            label: "Response Path",
            name: "json_response_path",
            placeholder: ""
          },
          {
            label: "Loading Placeholder",
            name: "loading_placeholder",
            placeholder: "Loading..."
          }
        ],
        values: {}
      }
    };
  },
  computed: {
    fields: function () {
      let fields = [];

      for (let index = 0; index < this.containers.length; index++) {
        const container = this.containers[index];

        for (
          let row_index = 0;
          row_index < container.rows.length;
          row_index++
        ) {
          const row = container.rows[row_index];

          for (
            let column_index = 0;
            column_index < row.columns.length;
            column_index++
          ) {
            const column = row.columns[column_index];

            if (column.type !== "empty" && typeof column.name !== "undefined") {
              fields.push({
                label: column.label,
                name: column.name
              });
            }
          }
        }
      }

      return fields;
    }
  },
  watch: {
    properties: function () {
      self.addContainerHeight = "auto";
      this.showAdd = false;

      this.initializeItems(true);
    }
  },
  mounted: function () {
    const self = this;

    self.initializeItems(true);
  },
  methods: {
    changeSource: function () {
      this.initializeItems(false);
      this.add();
    },
    initializeItems: function (is_check_source) {
      const self = this;

      if (is_check_source) {
        this.source =
          typeof this.properties[self.fieldProperty] === "undefined" ||
          typeof this.properties[self.fieldProperty].source === "undefined"
            ? "static"
            : this.properties[self.fieldProperty].source;
      }

      switch (this.source) {
        case "api":
          if (
            typeof this.properties[self.fieldProperty] !== "undefined" &&
            typeof this.properties[self.fieldProperty].url !== "undefined"
          ) {
            this.sourceAPI.values = JSON.parse(
              JSON.stringify(this.properties[this.fieldProperty])
            );

            if (Array.isArray(this.sourceAPI.values.json_response_path)) {
              this.sourceAPI.values.json_response_path =
                this.sourceAPI.values.json_response_path.join(".");
            }
          }

          break;
        case "static":
        default:
          if (
            typeof this.properties[self.fieldProperty] !== "undefined" &&
            typeof this.properties[self.fieldProperty].value !== "undefined"
          ) {
            this.sourceStatic = this.properties[self.fieldProperty].value;
          }

          break;
      }
    },
    add: function () {
      const self = this;

      self.showAdd = true;

      self.$nextTick(function () {
        self.addContainerHeight = "auto";
        self.$refs.addContainer.classList.remove("absolute");

        this.$nextTick(function () {
          self.addContainerHeight = self.$refs.addContainer.offsetHeight + "px";
          self.$refs.addContainer.classList.add("absolute");
        });
      });
    },
    save: function () {
      const self = this;
      let value = null;

      self.showAdd = false;
      self.addContainerHeight = "auto";

      switch (this.source) {
        case "api":
          value = [];

          self.sourceAPI.values.json_response_path =
            self.sourceAPI.values.json_response_path.split(".");

          self.$emit(
            "change",
            self.fieldProperty,
            JSON.parse(JSON.stringify(self.sourceAPI.values))
          );

          break;
        case "static":
        default:
          value = self.sourceStatic;

          self.$emit("change", self.fieldProperty, {
            source: self.source,
            value: value
          });

          break;
      }
    }
  }
};
</script>
