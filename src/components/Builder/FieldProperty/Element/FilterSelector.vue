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
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-auto bg-white p-2 dark:bg-surface--dark-300"
      >
        <div
          v-if="
            typeof currentFilter.conditions === 'undefined' ||
            currentFilter.conditions.length === 0
          "
          class="mb-2 border-b border-primary pb-2 text-center"
        >
          <div>No filter has been added.</div>
        </div>
        <div v-else>
          <div class="mb-2">
            <select
              v-model="currentFilter.operator"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none"
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
                ref="filter-condition"
                class="mb-2 mr-2 w-full break-all rounded-sm border border-primary px-2 py-1"
              ></div>
              <div v-else class="mb-2 mr-2 flex-grow rounded-sm">
                <button
                  class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
                  href="javascript:;"
                  @click="viewNestedFilter(filter)"
                >
                  <i class="fas fa-list"></i> Nested Filter
                </button>
              </div>
              <div>
                <button
                  class="rounded-full bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
                  @click="removeFilter(filter_index)"
                >
                  <i class="mdi mdi-minus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
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
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-auto bg-white p-2 dark:bg-surface--dark-300"
      >
        <div class="grid grid-cols-2">
          <div class="py-0.5 pr-1">Column</div>
          <div class="py-0.5 pr-1">
            <select
              v-model="filterColumn"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none"
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
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none"
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
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none"
              type="text"
            />
          </div>
        </div>
        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-white"
            @click="showAddFilter = false"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
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
  props: {
    table: {
      type: String,
      default: ""
    },
    modelValue: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    save: null,
    "update:modelValue": null
  },
  data: function () {
    return {
      fields: [],
      conditions: [
        { label: "Equals To", value: "=" },
        { label: "Not Equals To", value: "!=" },
        { label: "Greather Than", value: ">" },
        { label: "Less Than", value: "<" },
        { label: "Greather Than Or Equals To", value: ">=" },
        { label: "Less Than Or Equals To", value: "<=" },
        { label: "Contains", value: "contain" }
      ],
      filterSelectorValue: {},
      filterColumn: "",
      filterCondition: "=",
      filterValue: "",
      filters: { operator: "and", conditions: [] },
      lastFilter: [],
      currentFilter: { operator: "and", conditions: [] },
      showAdd: false,
      showAddFilter: false
    };
  },
  watch: {
    currentFilter: {
      handler: function (value) {
        console.log("CV", value);
      }
    },
    modelValue: {
      handler: function (value) {
        this.filterSelectorValue = value;
      },
      immediate: true
    }
  },
  mounted: function () {
    this.initializeItems();
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

      self.renderCondition();
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

      AppBuilder.getTableColumns(self.table).then(function (data) {
        self.fields.splice(0);

        for (let i = 0; i < data.length; i++) {
          self.fields.push(data[i]);
        }

        self.filterColumn = self.fields[0];

        self.filters =
          typeof self.filterSelectorValue.operator === "undefined"
            ? { operator: "and", conditions: [] }
            : JSON.parse(JSON.stringify(self.filterSelectorValue));

        self.currentFilter = self.filters;
      });
    },
    onAddButtonClick: function () {
      const self = this;
      this.showAdd = true;

      self.renderCondition();
    },
    removeFilter: function (index) {
      const self = this;

      self.currentFilter.conditions.splice(index, 1);
    },
    renderCondition: function () {
      const self = this;

      // TODO: Change this to use class property
      const conditions = {
        "=": "Equals To",
        "!=": "Not Equals To",
        ">": "Greather Than",
        "<": "Less Than",
        ">=": "Greather Than Or Equals",
        "<=": "Less Than Or Equals",
        contains: "Contains"
      };

      self.$nextTick(function () {
        for (
          let index = 0;
          index < self.currentFilter.conditions.length;
          index++
        ) {
          const condition = self.currentFilter.conditions[index];

          self.$refs["filter-condition"][index].innerHTML = `${condition.field} 
          <span class="text-primary">${
            conditions[condition.condition]
          }</span> ${condition.value}`;
        }
      });
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

        this.$emit("save", JSON.parse(JSON.stringify(self.filters)));
        this.$emit(
          "update:modelValue",
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
