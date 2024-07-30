<template>
  <div class="mx-4">
    <div class="px-1 py-2 text-2xl font-bold">
      {{ report.name }}
    </div>
    <div
      class="mb-4 mt-2 rounded-md border border-light-gray px-5 py-3"
      style="box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important"
    >
      <div class="text-right">
        <button
          v-if="selectedContainer !== 0 && containers[0].rows.length > 0"
          class="rounded-sm bg-primary px-3 py-1.5 text-base text-on-primary"
          @click="selectedContainer = 0"
        >
          <span class="mdi mdi-arrow-left"></span> Back
        </button>
        <button
          v-if="selectedContainer < containers.length - 1"
          class="rounded-sm bg-primary px-3 py-1.5 text-base text-on-primary"
          @click="showReport"
        >
          <span class="mdi mdi-file-chart"></span> Show Report
        </button>
      </div>

      <template v-for="(container, index) in containers" :key="container.name">
        <div v-if="index == selectedContainer" class="flex-shrink flex-grow">
          <div class="py-2">
            <div
              v-for="(row, row_index) in container.rows"
              :key="row_index"
              :class="'grid-cols-' + row.columns.length"
              class="grid gap-2"
            >
              <div
                v-for="(column, column_index) in row.columns"
                :key="column_index"
                class="x-p-1"
              >
                <template
                  v-if="
                    ['input', 'select', 'textarea'].includes(column.element)
                  "
                >
                  <label :for="column.name" class="block pb-1 pt-2">
                    {{ column.label }}
                  </label>
                  <component
                    :is="column.element"
                    v-bind="cleanAttributes(column)"
                    class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
                    @input="onInput"
                  >
                    <template v-if="column.items">
                      <component
                        :is="item.element"
                        v-for="item in column.items"
                        :key="item.name"
                        v-bind="item"
                        >{{ item.label }}</component
                      >
                    </template>
                  </component>
                </template>
                <component
                  :is="column.element"
                  v-else
                  v-bind="cleanAttributes(column)"
                  @input="onInput"
                >
                  <template v-if="column.content">{{
                    column.content
                  }}</template>
                </component>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Components from "@/components/Builder/Element/Report/index.js";

import ReportBuilder from "@/assets/js/ReportBuilder.js";

export default {
  components: Components,
  props: {},
  data: function () {
    return {
      report: {},
      containers: [],
      selectedContainer: 0,
      values: {}
    };
  },
  watch: {
    $route(to) {
      this.render(to.params.name);
    }
  },
  mounted: function () {
    this.render(this.$route.params.name);
  },
  methods: {
    cleanAttributes(attributes) {
      const self = this;

      let is_html_element =
        document.createElement(attributes.element).toString() ==
        "[object HTMLElement]";

      if (!is_html_element) {
        let cleaned_attributes = {};

        for (const key in attributes) {
          if (typeof attributes[key] !== "object" && attributes[key] !== "") {
            cleaned_attributes[key] = attributes[key];
          }
        }

        return cleaned_attributes;
      }

      attributes.filters = self.values;

      return attributes;
    },
    onInput: function (event) {
      const self = this;

      /* TODO Input event inside custom component also emit input?  */
      if (event.target.name !== "") {
        self.values[event.target.name] = event.target.value;
      }
    },
    render: function (report_slug) {
      const self = this;

      ReportBuilder.get(report_slug).then(function (report) {
        self.report = report;
        self.containers.splice(0);

        self.containers.push({
          rows: []
        });

        for (let index = 0; index < report.columns.length; index++) {
          const column = report.columns[index];

          if (typeof self.containers[column.container] === "undefined") {
            self.containers[column.container] = {
              rows: []
            };
          }

          if (
            typeof self.containers[column.container].rows[column.row] ===
            "undefined"
          ) {
            self.containers[column.container].rows[column.row] = {
              columns: []
            };
          }

          self.containers[column.container].rows[column.row].columns.push(
            column
          );
        }

        if (self.containers[0].rows.length === 0) {
          self.showReport();
        }
      });
    },
    showReport: function () {
      const self = this;

      self.selectedContainer = 1;
    }
  }
};
</script>
