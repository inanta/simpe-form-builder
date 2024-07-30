<template>
  <div :class="{ 'h-28': showAdd }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="onAddButtonClick"
    >
      <span class="mdi mdi-plus"></span>Add Sort
    </button>

    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-scroll bg-white p-2"
      >
        <div v-if="hasSource">
          <div
            v-if="sorts.length === 0"
            class="mb-2 border-b border-primary pb-2 text-center dark:border-primary--dark"
          >
            <div>No sort has been added.</div>
          </div>
          <div v-else>
            <div>
              <div
                v-for="(sort, sort_index) in sorts"
                :key="sort_index"
                class="flex"
              >
                <div
                  class="mb-2 mr-2 flex-grow rounded-sm border border-primary px-2 py-1 dark:border-primary--dark"
                >
                  {{ renderSort(sort) }}
                </div>
                <div>
                  <button
                    class="rounded-full bg-primary px-2 py-1 text-on-primary"
                    @click="removeSort(sort_index)"
                  >
                    <i class="mdi mdi-minus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center">Please select table first.</div>

        <div class="text-center">
          <button
            class="rounded-full bg-primary px-2 py-1 text-on-primary"
            @click="showAddFilter = true"
          >
            <i class="mdi mdi-plus"></i>
          </button>
        </div>

        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="cancel"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            v-if="hasSource"
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="save"
          >
            <span class="mdi mdi-check"></span> Save
          </button>
        </div>
      </div>
    </transition>

    <transition
      name="show-add-filter-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAddFilter"
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-scroll bg-white p-2"
      >
        <div class="grid grid-cols-2">
          <div class="py-0.5 pr-1">Column</div>
          <div class="py-0.5 pr-1">
            <select
              v-model="sortColumn"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-primary--dark"
            >
              <option
                v-for="column in columns"
                :key="column"
                :value="column"
                class="grid grid-cols-2"
              >
                {{ column }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2">
          <div class="py-0.5 pr-1">Type</div>
          <div class="py-0.5 pr-1">
            <select
              v-model="sortType"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-primary--dark"
            >
              <option
                v-for="type in types"
                :key="type.label"
                :value="type.value"
                class="grid grid-cols-2"
              >
                {{ type.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative"
            @click="showAddFilter = false"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            v-if="hasSource"
            class="rounded-sm bg-primary px-2 py-1 text-white"
            @click="addFilter"
          >
            <span class="mdi mdi-plus"></span>Add
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AppBuilder from "@/assets/js/AppBuilder.js";

export default {
  name: "FieldPropertySortCollection",
  props: {
    configuration: {
      type: Object,
      default: function () {
        return { source: "" };
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
      columns: [],
      types: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" }
      ],
      sortColumn: "",
      sortType: "asc",
      sorts: [],
      showAdd: false,
      showAddFilter: false
    };
  },
  computed: {
    hasSource: function () {
      return (
        typeof this.properties[this.configuration.source] !== "undefined" &&
        typeof this.properties[this.configuration.source]["table"] !==
          "undefined"
      );
    }
  },
  methods: {
    addFilter: function () {
      const self = this;

      self.sorts.push({
        column: self.sortColumn,
        type: self.sortType
      });

      self.showAddFilter = false;

      self.sortColumn = self.columns[0];
      self.sortType = "asc";
    },
    cancel: function () {
      const self = this;

      self.showAdd = false;
    },
    initializeItems: function () {
      const self = this;

      if (self.hasSource) {
        AppBuilder.getTableColumns(
          self.properties[self.configuration.source]["table"]
        ).then(function (data) {
          self.columns.splice(0);

          for (let i = 0; i < data.length; i++) {
            self.columns.push(data[i]);
          }

          self.sortColumn = self.columns[0];

          self.sorts =
            typeof self.properties[self.fieldProperty] === "undefined"
              ? []
              : JSON.parse(JSON.stringify(self.properties[self.fieldProperty]));
        });
      }
    },
    onAddButtonClick: function () {
      this.initializeItems();

      this.showAdd = true;
    },
    removeSort: function (index) {
      const self = this;

      self.sorts.splice(index, 1);
    },
    renderSort: function (sort) {
      const sorts = {
        asc: "Ascending",
        desc: "Descending"
      };

      let sort_text = sort.column;

      sort_text += " " + sorts[sort.type];

      return sort_text;
    },
    save: function () {
      const self = this;

      self.showAdd = false;

      self.$emit(
        "change",
        self.fieldProperty,
        JSON.parse(JSON.stringify(self.sorts))
      );
    }
  }
};
</script>
