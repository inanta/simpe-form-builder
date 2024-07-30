<template>
  <div ref="container" class="p-2">
    <div v-if="sourceLength !== 1" class="pb-0.5 font-bold">Source</div>
    <div class="pb-1">
      <source-selector v-model="source" :sources="sources"></source-selector>
    </div>
    <div v-if="source == 'static'" class="flex-grow">
      <textarea
        v-model="sourceStatic"
        class="h-full w-full rounded-sm border border-primary p-1 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
        placeholder="Add Items (One Per Line)"
        rows="8"
      ></textarea>
    </div>
    <div v-else-if="source == 'static-label-value'" class="flex-grow">
      <repeat-input
        v-model="sourceStaticLabelValue.values"
        :columns="sourceStaticLabelValue.columns"
      ></repeat-input>
    </div>
    <div v-else-if="source == 'db'" class="flex-grow">
      <div class="pb-0.5 font-bold">Table</div>
      <div class="pb-1">
        <table-selector v-model="sourceDatabase.table"></table-selector>
      </div>

      <column-selector
        v-model="sourceDatabase.columns"
        :table="sourceDatabase.table"
        :options="sourceDatabase.options"
      ></column-selector>

      <div class="pb-0.5 font-bold">Filter</div>
      <div class="pb-1">
        <filter-selector
          v-model="sourceDatabase.filters"
          :table="sourceDatabase.table"
        ></filter-selector>
      </div>

      <div
        v-if="
          typeof databaseAdditionalFields !== 'undefined' &&
          typeof databaseAdditionalFields.length !== 'undefined' &&
          databaseAdditionalFields.length > 0
        "
      >
        <div class="py-0.5">
          <b>Options</b>
        </div>

        <div
          v-for="field in configuration.databaseAdditionalFields"
          :key="field.name"
          class="grid grid-cols-2"
        >
          <div class="py-0.5 pr-1">{{ field.label }}</div>
          <div class="py-0.5 pl-1">
            <column-selector
              v-if="field.type == 'column-selector'"
              :table="sourceDatabase.table"
              :options="[field.name]"
            ></column-selector>
            <input
              v-else-if="field.options === undefined"
              v-model="sourceDatabase.fields[field.name]"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              type="text"
            />
            <select
              v-else
              v-model="sourceDatabase.fields[field.name]"
              class="w-full rounded-sm border border-primary bg-white outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
            >
              <option
                v-for="option in field.options"
                :key="option.name"
                :value="option.name"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="source == 'api'" class="flex-grow">
      <div class="py-0.5">
        <textarea
          v-model="sourceAPI.URL"
          placeholder="API Endpoint URL"
          rows="3"
          class="w-full rounded-sm border border-primary px-1 py-0.5"
        ></textarea>
      </div>
      <div class="grid grid-cols-2">
        <div class="py-0.5 pr-1">Label Property</div>
        <div class="py-0.5 pl-1">
          <input
            v-model="sourceAPI.labelProperty"
            type="text"
            class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none"
          />
        </div>
        <div class="py-0.5 pr-1">Value Property</div>
        <div class="py-0.5 pl-1">
          <input
            v-model="sourceAPI.valueProperty"
            type="text"
            class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none"
          />
        </div>
      </div>
      <div
        v-if="
          typeof apiEndpointAdditionalFields !== 'undefined' &&
          typeof apiEndpointAdditionalFields.length !== 'undefined' &&
          apiEndpointAdditionalFields.length > 0
        "
      >
        <div class="py-0.5">
          <b>Options</b>
        </div>

        <div
          v-for="field in apiEndpointAdditionalFields"
          :key="field.name"
          class="grid grid-cols-2"
        >
          <div class="py-0.5 pr-1">{{ field.label }}</div>
          <div class="py-0.5 pl-1">
            <input
              v-if="field.options === undefined"
              v-model="sourceAPI.fields[field.name]"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none"
              type="text"
            />
            <select
              v-else
              v-model="sourceAPI.fields[field.name]"
              class="w-full rounded-sm border border-primary bg-white outline-none"
            >
              <option
                v-for="option in field.options"
                :key="option.name"
                :value="option.name"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex-grow">
      <input type="text" class="w-full rounded-sm border border-primary" />
    </div>
    <div class="pt-2 text-center">
      <button
        class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
        @click="onCancelButtonClick"
      >
        <span class="mdi mdi-close"></span> Cancel
      </button>
      <button
        class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
        @click="onSaveButtonClick"
      >
        <span class="mdi mdi-check"></span> Save
      </button>
    </div>
  </div>
</template>

<script>
import AppBuilder from "@/assets/js/AppBuilder.js";

import SourceSelector from "@/components/Builder/FieldProperty/Element/SourceSelector.vue";
import TableSelector from "@/components/Builder/FieldProperty/Element/TableSelector.vue";
import ColumnSelector from "@/components/Builder/FieldProperty/Element/ColumnSelector.vue";
import FilterSelector from "@/components/Builder/FieldProperty/Element/FilterSelector.vue";
import RepeatInput from "@/components/Builder/FieldProperty/Element/RepeatInput.vue";

export default {
  components: {
    SourceSelector,
    TableSelector,
    ColumnSelector,
    FilterSelector,
    RepeatInput
  },
  props: {
    configuration: {
      type: Object,
      default: function () {
        return {
          databaseAdditionalFields: [],
          apiEndpointAdditionalFields: [],
          hideLabel: false,
          sources: []
        };
      },
      validator: function (value) {
        if (value.hideLabel === undefined) {
          value.hideLabel = false;
        }

        if (value.databaseAdditionalFields === undefined) {
          value.databaseAdditionalFields = [];
        }

        if (value.apiEndpointAdditionalFields === undefined) {
          value.apiEndpointAdditionalFields = [];
        }

        return value;
      }
    },
    modelValue: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    cancel: null,
    "change-size": null,
    save: null,
    "update:modelValue": null
  },
  data: function () {
    return {
      isInitialized: false,
      showAdd: false,
      source: "static",
      sourceStatic: "",
      sourceStaticLabelValue: {
        columns: [
          { label: "Label", name: "label", placeholder: "Label" },
          { label: "Value", name: "value", placeholder: "Value" }
        ],
        values: [{ label: "", value: "" }]
      },
      sourceDatabase: {
        tables: [],
        table: "",
        options: [
          { label: "Label", name: "labelColumn" },
          { label: "Value", name: "valueColumn" }
        ],
        columns: {},
        fields: {},
        filters: {}
      },
      sourceAPI: {
        URL: "",
        labelProperty: "label",
        valueProperty: "value",
        fields: {}
      },
      collecttionValue: {}
    };
  },
  computed: {
    databaseAdditionalFields: function () {
      const self = this;
      let addditional_items = [];

      if (typeof self.configuration.databaseAdditionalFields !== "undefined") {
        addditional_items = self.configuration.databaseAdditionalFields;
      }

      return addditional_items;
    },
    apiEndpointAdditionalFields: function () {
      const self = this;
      let addditional_items = [];

      if (
        typeof self.configuration.apiEndpointAdditionalFields !== "undefined"
      ) {
        addditional_items = self.configuration.apiEndpointAdditionalFields;
      }

      return addditional_items;
    },
    sources: function () {
      if (typeof this.configuration.sources !== "undefined") {
        return this.configuration.sources;
      }

      return {};
    },
    sourceLength: function () {
      return Object.keys(this.sources).length;
    }
  },
  watch: {
    modelValue: {
      handler: function (value) {
        this.collecttionValue = value;
        this.initializeItems();
      },
      immediate: true
    },
    source: {
      handler: function () {
        this.emitContainerSize();
      }
    }
  },
  mounted: function () {
    if (typeof this.configuration.sources !== "undefined") {
      if (
        typeof this.configuration.sources["static-label-value"] !== "undefined"
      ) {
        this.sourceStaticLabelValue.columns[0].label =
          this.configuration.sources["static-label-value"].configuration.label;
        this.sourceStaticLabelValue.columns[0].placeholder =
          this.configuration.sources[
            "static-label-value"
          ].configuration.placeholder;

        this.sourceStaticLabelValue.columns[1].label =
          this.configuration.sources["static-label-value"].configuration.value;
        this.sourceStaticLabelValue.columns[1].placeholder =
          this.configuration.sources["static-label-value"].configuration.value;
      }
    }
  },
  methods: {
    changeSource: function () {
      this.initializeItems(false);
    },
    changeValue: function () {
      const self = this;

      let value = null;
      let columns = [];
      let collection_value = {};

      switch (this.source) {
        case "db":
          columns
            .concat([
              self.sourceDatabase.columns.labelColumn,
              self.sourceDatabase.columns.valueColumn
            ])
            .concat(
              self.databaseAdditionalFields
                .filter(function (item) {
                  return (
                    typeof item.type !== "undefined" &&
                    item.type === "column-selector"
                  );
                })
                .map(function (item) {
                  if (
                    typeof self.sourceDatabase.fields[item.name] !== "undefined"
                  ) {
                    return self.sourceDatabase.fields[item.name];
                  }
                })
            );

          AppBuilder.data({
            table: self.sourceDatabase.table,
            columns: columns,
            filters: self.sourceDatabase.filters
          }).then(function (data) {
            value = [];

            for (let index = 0; index < data.records.length; index++) {
              value.push({
                label:
                  data.records[index][self.sourceDatabase.columns.labelColumn],
                value:
                  data.records[index][self.sourceDatabase.columns.valueColumn]
              });
            }

            collection_value = {
              fields: JSON.parse(JSON.stringify(self.sourceDatabase.fields)),
              filters: JSON.parse(JSON.stringify(self.sourceDatabase.filters)),
              join_column: self.sourceDatabase.columns.valueColumn,
              label_column: self.sourceDatabase.columns.labelColumn,
              source: self.source,
              table: self.sourceDatabase.table,
              value: value,
              value_column: self.sourceDatabase.columns.valueColumn
            };

            for (
              let index = 0;
              index < self.databaseAdditionalFields.length;
              index++
            ) {
              const field = self.databaseAdditionalFields[index];

              collection_value[field.name] =
                self.sourceDatabase.fields[field.name];
            }

            self.$emit("save", collection_value);
            self.$emit("update:modelValue", collection_value);
          });

          break;
        case "static-label-value":
          value = [];

          for (
            let index = 0;
            index < self.sourceStaticLabelValue.values.length;
            index++
          ) {
            const item = self.sourceStaticLabelValue.values[index];

            if (item.label !== "" && item.value !== "") {
              value.push({
                label: item.label,
                value: item.value
              });
            }
          }

          collection_value = {
            source: self.source,
            value: value
          };

          this.$emit("save", collection_value);
          this.$emit("update:modelValue", collection_value);

          break;
        case "api":
          value = [];

          collection_value = {
            URL: self.sourceAPI.URL,
            fields: JSON.parse(JSON.stringify(self.sourceAPI.fields)),
            label_property: self.sourceAPI.labelProperty,
            source: self.source,
            value: value,
            value_property: self.sourceAPI.valueProperty
          };

          this.$emit("save", collection_value);
          this.$emit("update:modelValue", collection_value);

          break;
        case "static":
        default:
          value = self.sourceStatic
            .split(/\n/)
            .map(function (item) {
              return {
                label: item,
                value: item
              };
            })
            .filter(function (item) {
              if (item.label === "" && item.value === "") {
                return false;
              }

              return true;
            });

          collection_value = {
            source: self.source,
            value: value
          };

          this.$emit("save", collection_value);
          this.$emit("update:modelValue", collection_value);

          break;
      }
    },
    initializeItems: function () {
      const self = this;

      if (!this.isInitialized) {
        self.source =
          self.collecttionValue === null ||
          typeof self.collecttionValue === "undefined" ||
          typeof self.collecttionValue.source === "undefined"
            ? "static"
            : self.collecttionValue.source;
      }

      switch (self.source) {
        case "db":
          if (
            typeof self.collecttionValue !== "undefined" &&
            typeof self.collecttionValue.table !== "undefined"
          ) {
            self.sourceDatabase.table = self.collecttionValue["table"];
            self.sourceDatabase.columns.labelColumn =
              self.collecttionValue.label_column;
            self.sourceDatabase.columns.valueColumn =
              self.collecttionValue.value_column;
            self.sourceDatabase.filters =
              typeof self.collecttionValue.filters !== "undefined"
                ? self.collecttionValue.filters
                : {};

            for (
              let index = 0;
              index < self.databaseAdditionalFields.length;
              index++
            ) {
              const field = self.databaseAdditionalFields[index];

              self.sourceDatabase.fields[field.name] =
                typeof self.collecttionValue[field.name] !== "undefined"
                  ? self.collecttionValue[field.name]
                  : field.default;
            }
          }

          break;
        case "static-label-value":
          if (
            typeof self.collecttionValue !== "undefined" &&
            typeof self.collecttionValue.value !== "undefined"
          ) {
            self.sourceStaticLabelValue.values.splice(0);

            for (
              let index = 0;
              index < self.collecttionValue.value.length;
              index++
            ) {
              const item = self.collecttionValue.value[index];

              self.sourceStaticLabelValue.values.push({
                label: item.label,
                value: item.value
              });
            }
          }

          break;
        case "api":
          if (
            typeof self.collecttionValue !== "undefined" &&
            typeof self.collecttionValue.URL !== "undefined"
          ) {
            self.sourceAPI.URL = self.collecttionValue.URL;
            self.sourceAPI.labelProperty = self.collecttionValue.label_property;
            self.sourceAPI.valueProperty = self.collecttionValue.value_property;
          }

          for (
            let index = 0;
            index < self.apiEndpointAdditionalFields.length;
            index++
          ) {
            const field = self.apiEndpointAdditionalFields[index];

            self.sourceAPI.fields[field.name] =
              self.collecttionValue.fields[field.name];
          }

          break;
        case "static":
        default:
          if (
            self.collecttionValue !== null &&
            typeof self.collecttionValue !== "undefined" &&
            typeof self.collecttionValue.value !== "undefined"
          ) {
            self.sourceStatic = self.collecttionValue.value
              .map(function (item) {
                return item.value;
              })
              .join("\r\n");
          }

          break;
      }

      this.isInitialized = true;

      this.emitContainerSize();
    },
    emitContainerSize: function () {
      this.$nextTick(function () {
        this.$emit("change-size", {
          height: this.$refs["container"].scrollHeight
        });
      });
    },
    onCancelButtonClick: function () {
      this.$emit("cancel");
    },
    onSaveButtonClick: function () {
      this.changeValue();
    }
  }
};
</script>
