<template>
  <div :class="{ 'h-28': showSelect }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="onSelectElementClick"
    >
      <span class="mdi mdi-plus"></span>Select
    </button>

    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showSelect"
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-auto bg-white p-2 dark:bg-surface--dark-300"
      >
        <div>
          <div>
            <div class="pb-1.5">
              <select
                v-model="selectedContainerIndex"
                class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              >
                <option
                  v-for="(container, container_index) in containers"
                  :key="container"
                  :value="container_index"
                >
                  {{
                    typeof container.name === "undefined" ||
                    container.name === ""
                      ? "Container " + (container_index + 1)
                      : container.name
                  }}
                </option>
              </select>
            </div>
            <div>
              <select
                v-model="selectedField"
                class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              >
                <option
                  v-for="field in fields"
                  :key="field.name"
                  :value="field.name"
                >
                  {{ field.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative"
            @click="cancel"
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
export default {
  name: "FieldPropertySortCollection",
  props: {
    configuration: {
      type: Object,
      default: function () {
        return { source: "" };
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
      fields: [],
      showSelect: false,
      selectedContainerIndex: 0,
      selectedField: null
    };
  },
  methods: {
    cancel: function () {
      const self = this;

      self.showSelect = false;
    },
    initializeItems: function () {
      const self = this;

      if (
        typeof this.properties[this.fieldProperty] !== "undefined" &&
        typeof this.properties[this.fieldProperty].name !== "undefined"
      ) {
        self.selectedField = this.properties[this.fieldProperty].name;
      }

      self.fields.splice(0);

      for (
        let index = 0;
        index < self.containers[self.selectedContainerIndex].rows.length;
        index++
      ) {
        const rows = self.containers[self.selectedContainerIndex].rows[index];

        for (let row_index = 0; row_index < rows.columns.length; row_index++) {
          const column = rows.columns[row_index];

          if (column.type !== "empty") {
            if (typeof column.name !== "undefined" && column.name !== "") {
              if (self.selectedField === null) {
                self.selectedField = column.name;
              }

              self.fields.push(column);
            }
          }
        }
      }
    },
    onSelectElementClick: function () {
      this.initializeItems();

      this.showSelect = true;
    },
    removeSort: function (index) {
      const self = this;

      self.sorts.splice(index, 1);
    },
    save: function () {
      const self = this;
      let selected_field = {};

      self.showSelect = false;

      for (let index = 0; index < self.fields.length; index++) {
        const field = self.fields[index];

        if (field.name == self.selectedField) {
          selected_field = {
            name: field.name,
            element: field.element
          };
        }
      }

      self.$emit(
        "change",
        self.fieldProperty,
        JSON.parse(JSON.stringify(selected_field))
      );
    }
  }
};
</script>
