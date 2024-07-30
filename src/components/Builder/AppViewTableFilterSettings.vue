<template>
  <ns-side-panel :show="show" width="50%" @close="$emit('close')">
    <template #title>
      <div class="flex w-full">
        <div class="py-1.5"><span class="mdi mdi-filter"></span> Filters</div>
        <div class="ml-auto text-base font-normal">
          <button
            class="rounded bg-primary px-2.5 py-1.5 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
            @click="onSaveButttonClick"
          >
            <span class="mdi mdi-check"></span> {{ messages.save }}
          </button>
        </div>
      </div>
    </template>
    <div class="p-3 dark:text-on-surface--dark-600">
      <div class="flex space-x-3">
        <div class="w-full">
          <template v-if="filters.length === 0">
            <div class="mx-auto mb-3 w-1/3">
              <img src="@/assets/img/undraw_blank_canvas_re_2hwy.svg" />
            </div>
          </template>
          <template v-else>
            <div
              v-for="(selectedFilter, selectedFilterIndex) in filters"
              :key="selectedFilterIndex"
              class="flex w-full space-x-2"
            >
              <div class="flex w-full space-x-2 pb-2">
                <div class="w-2/5">
                  <ns-drop-down-list
                    v-model="selectedFilter.name"
                    :items="filteredHeaders"
                    class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
                    @change="changeHeader(selectedFilterIndex)"
                  ></ns-drop-down-list>
                </div>
                <div class="w-1/5">
                  <ns-drop-down-list
                    v-model="selectedFilter.operator"
                    :items="databaseConditions"
                    :selected="selectedFilter.operator"
                    class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
                  ></ns-drop-down-list>
                </div>
                <div class="w-2/5">
                  <date-time-picker
                    v-if="
                      getInputType(selectedFilter.name) == 'date' ||
                      getInputType(selectedFilter.name) == 'date-time'
                    "
                    v-model="selectedFilter.value"
                    :date-time-picker-mode="
                      getInputType(selectedFilter.name) == 'date-time'
                        ? 'date-time-picker'
                        : 'date-picker'
                    "
                  ></date-time-picker>
                  <input
                    v-else
                    v-model="selectedFilter.value"
                    class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
                    type="text"
                  />
                </div>
              </div>
              <div>
                <button
                  class="rounded bg-negative px-2.5 py-1.5 text-on-negative dark:bg-negative--dark dark:text-on-negative--dark"
                  @click="onRemoveButtonClick(selectedFilterIndex)"
                >
                  <span class="mdi mdi-close"></span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="text-center">
        <button
          class="rounded bg-primary px-2.5 py-1.5 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
          @click="onAddButtonClick"
        >
          <span class="mdi mdi-plus"></span> {{ messages.add }}
        </button>
      </div>
    </div>
  </ns-side-panel>
</template>

<script>
import NsSidePanel from "@/components/NS/NsSidePanel.vue";
import NsDropDownList from "@/components/NS/NsDropDownList.vue";
import DateTimePicker from "@/components/Builder/Element/DateTimePicker.vue";

import NsTooltip from "@/directives/NsTooltip";
import AppBuilder from "@/assets/js/AppBuilder.js";

import databaseConditions from "@/assets/js/builder/variables/databaseConditions.js";
import databaseConditionMapper from "@/assets/js/builder/databaseConditionMapper.js";
import getPropertyValue from "@/assets/js/getPropertyValue.js";

export default {
  name: "Field",
  components: {
    NsSidePanel,
    NsDropDownList,
    DateTimePicker
  },
  directives: { tooltip: NsTooltip },
  props: {
    app: {
      type: Object,
      default: function () {
        return {};
      }
    },
    defaultFilters: {
      type: Array,
      default: function () {
        return [];
      }
    },
    headers: {
      type: Array,
      default: function () {
        return [];
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    change: null,
    close: null
  },
  data: function () {
    return {
      appFields: [],
      databaseConditions: databaseConditions,
      filters: [],
      messages: {}
    };
  },
  computed: {
    filteredHeaders: function () {
      let headers = [];

      for (let index = 0; index < this.headers.length; index++) {
        const header = this.headers[index];

        if (header.searchable === true && header.label !== "") {
          headers.push(header);
        }
      }

      return headers;
    }
  },
  watch: {
    show: {
      handler: function (value) {
        const self = this;

        this.messages = {
          add: getPropertyValue(
            this.app.settings,
            "ui.page.messages.add",
            "Add New"
          ),
          contains: getPropertyValue(
            this.app.settings,
            "ui.page.messages.contains",
            "Contains"
          ),
          eq: getPropertyValue(
            this.app.settings,
            "ui.page.messages.eq",
            "Equals"
          ),
          gt: getPropertyValue(
            this.app.settings,
            "ui.page.messages.gt",
            "Greater Than"
          ),
          gte: getPropertyValue(
            this.app.settings,
            "ui.page.messages.gte",
            "Greater Than Or Equals"
          ),
          lt: getPropertyValue(
            this.app.settings,
            "ui.page.messages.lt",
            "Less Than"
          ),
          lte: getPropertyValue(
            this.app.settings,
            "ui.page.messages.lte",
            "Less Than Or Equals"
          ),
          neq: getPropertyValue(
            this.app.settings,
            "ui.page.messages.neq",
            "Not Equals"
          ),
          save: getPropertyValue(
            this.app.settings,
            "ui.page.messages.save",
            "Save"
          )
        };

        for (let index = 0; index < databaseConditions.length; index++) {
          databaseConditions[index].label =
            this.messages[databaseConditions[index].value];
        }

        if (
          this.appFields.length === 0 &&
          typeof this.app.slug !== "undefined"
        ) {
          AppBuilder.get(this.app.slug).then(function (app) {
            self.appFields = app.columns;
          });
        }

        if (value === true) {
          this.filters = [];

          for (let index = 0; index < this.defaultFilters.length; index++) {
            const filter = this.defaultFilters[index];

            for (const name in filter.conditions) {
              if (Object.hasOwnProperty.call(filter.conditions, name)) {
                const conditions = filter.conditions[name];

                for (const operator in conditions) {
                  if (Object.hasOwnProperty.call(conditions, operator)) {
                    const value = conditions[operator];

                    this.filters.push({
                      name: name,
                      label: databaseConditionMapper(operator),
                      operator: operator,
                      value: value
                    });
                  }
                }
              }
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted: function () {},
  methods: {
    changeHeader: function (index) {
      this.filters[index].value = "";
    },
    getInputType: function (name) {
      for (let index = 0; index < this.headers.length; index++) {
        const header = this.headers[index];

        if (header.value === name) {
          return header.format;
        }
      }
    },
    onAddButtonClick: function () {
      this.filters.push({});
    },
    onRemoveButtonClick: function (index) {
      this.filters.splice(index, 1);
    },
    onSaveButttonClick: function () {
      let conditions = {
        operator: "and",
        conditions: {}
      };

      for (let index = 0; index < this.filters.length; index++) {
        const filter = this.filters[index];

        if (typeof conditions.conditions[filter.name] === "undefined") {
          conditions.conditions[filter.name] = {};
        }

        conditions.conditions[filter.name][filter.operator] = filter.value;
      }

      this.$emit("change", [conditions]);
      this.$emit("close");
    }
  }
};
</script>
