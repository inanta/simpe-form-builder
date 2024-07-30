<template>
  <div :class="{ 'h-28': showAdd || showAddFilter }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="onAddButtonClick"
    >
      <span class="mdi mdi-plus"></span>Add Filter
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
            v-if="
              typeof currentFilter.conditions === 'undefined' ||
              currentFilter.conditions.length === 0
            "
            class="mb-2 border-b border-primary pb-2 text-center dark:border-primary--dark"
          >
            <div>No filter has been added.</div>
          </div>
          <div v-else>
            <div class="mb-2">
              <select
                v-model="currentFilter.operator"
                class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-primary--dark"
              >
                <option value="and">AND</option>
                <option value="or">OR</option>
              </select>
            </div>
            <div>
              <div
                v-for="(filter, filter_index) in currentFilter.conditions"
                :key="filter_index"
                class="flex"
              >
                <div
                  v-if="typeof filter.conditions === 'undefined'"
                  class="mb-2 mr-2 flex-grow rounded-sm border border-primary px-2 py-1 dark:border-primary--dark"
                >
                  {{ renderCondition(filter) }}
                </div>
                <div v-else class="mb-2 mr-2 flex-grow rounded-sm">
                  <button
                    class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary"
                    href="javascript:;"
                    @click="viewNestedFilter(filter)"
                  >
                    <i class="fas fa-list"></i> Nested Filter
                  </button>
                </div>
                <div>
                  <button
                    class="rounded-full bg-primary px-2 py-1 text-on-primary"
                    @click="removeFilter(filter_index)"
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
            class="mr-2 rounded-full bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="addNestedFilter"
          >
            <i class="mdi mdi-plus"></i> Nested
          </button>
          <button
            class="rounded-full bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="
              showAdd = false;
              showAddFilter = true;
            "
          >
            <i class="mdi mdi-plus"></i>
          </button>
        </div>

        <div class="pt-2 text-center">
          <button
            v-if="lastFilter.length === 0"
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="cancel"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            v-if="hasSource"
            :x-class="{
              'bg-primary':
                lastFilter.length === 0 || currentFilter.conditions.length > 0,
              'bg-mid-gray':
                lastFilter.length > 0 && currentFilter.conditions.length === 0
            }"
            :x-disabled="
              lastFilter.length > 0 && currentFilter.conditions.length === 0
            "
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="save"
          >
            <span class="mdi mdi-check"></span>
            {{ lastFilter.length === 0 ? "Save" : "Save Nested" }}
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
              v-model="filterColumn"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-primary--dark"
            >
              <option
                v-for="field in fields"
                :key="field"
                :value="field"
                class="grid grid-cols-2"
              >
                {{ field }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2">
          <div class="py-0.5 pr-1">Condition</div>
          <div class="py-0.5 pr-1">
            <select
              v-model="filterCondition"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-primary--dark"
            >
              <option
                v-for="condition in conditions"
                :key="condition.label"
                :value="condition.value"
                class="grid grid-cols-2"
              >
                {{ condition.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2">
          <div class="py-0.5 pr-1">Value</div>
          <div class="py-0.5 pr-1">
            <input
              v-model="filterValue"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-primary--dark"
              type="text"
            />
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
            class="rounded-sm bg-primary px-2 py-1 text-on-primary"
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
  name: "FieldPropertyFilterCollection",
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
      fields: [],
      conditions: [
        { label: "Equals To", value: "=" },
        { label: "Greather Than", value: ">" },
        { label: "Less Than", value: "<" },
        { label: "Greather Than Or Equals To", value: ">=" },
        { label: "Less Than Or Equals To", value: "<=" },
        { label: "Contains", value: "contain" }
      ],
      filterColumn: "",
      filterCondition: "=",
      filterValue: "",
      filters: { operator: "and", conditions: [] },
      lastFilter: [],
      currentFilter: null,
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

      self.currentFilter.conditions.push({
        field: self.filterColumn,
        condition: self.filterCondition,
        value: self.filterValue
      });

      self.showAddFilter = false;
      self.showAdd = true;

      self.filterColumn = self.fields[0];
      self.filterCondition = "=";
      self.filterValue = "";
    },
    addNestedFilter: function () {
      const self = this;

      self.currentFilter.conditions.push({
        operator: "and",
        conditions: []
      });

      self.lastFilter.push(self.currentFilter);

      self.currentFilter =
        self.currentFilter.conditions[self.currentFilter.conditions.length - 1];
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
          self.fields.splice(0);

          for (let i = 0; i < data.length; i++) {
            self.fields.push(data[i]);
          }

          self.filterColumn = self.fields[0];

          self.filters =
            typeof self.properties[self.fieldProperty] === "undefined"
              ? { operator: "and", conditions: [] }
              : JSON.parse(JSON.stringify(self.properties[self.fieldProperty]));

          self.currentFilter = self.filters;
        });
      }
    },
    onAddButtonClick: function () {
      this.initializeItems();

      this.showAdd = true;
    },
    removeFilter: function (index) {
      const self = this;

      self.currentFilter.conditions.splice(index, 1);
    },
    renderCondition: function (condition) {
      const conditions = {
        "=": "Equals To",
        ">": "Greather Than",
        "<": "Less Than",
        ">=": "Greather Than Or Equals",
        "<=": "Less Than Or Equals",
        contains: "Contains"
      };

      if (typeof condition.conditions !== "undefined") {
        return "Nested Conditions";
      }

      let condition_text = condition.field;

      condition_text += " " + conditions[condition.condition];
      condition_text += " " + condition.value;

      return condition_text;
    },
    save: function () {
      const self = this;

      if (self.lastFilter.length > 0) {
        let is_remove_last_condition = false;

        if (self.currentFilter.conditions.length === 0) {
          is_remove_last_condition = true;
        }

        self.currentFilter = self.lastFilter.pop();

        if (is_remove_last_condition) {
          self.currentFilter.conditions.pop();
        }
      } else {
        self.showAdd = false;

        self.$emit(
          "change",
          self.fieldProperty,
          JSON.parse(JSON.stringify(self.filters))
        );
      }
    },
    viewNestedFilter: function (filter) {
      const self = this;

      self.lastFilter.push(self.currentFilter);
      self.currentFilter = filter;
    }
  }
};
</script>
