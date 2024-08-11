<template>
  <div>
    <template v-if="tableInputType === 'inline'">
      <inline-table
        :add-item-label="tableInputManualAddItemLabel"
        :headers="tableHeaders"
        :items="tableItems"
        :default-row-number="parseInt(tableInputTypeInlineDefaultRowNumber)"
        :readonly="readonly"
        @input="onInlineTableInput"
      ></inline-table>
    </template>
    <template v-else>
      <template v-if="!readonly">
        <div v-if="tableInputSource == 'db'" class="flex pb-3">
          <ns-autocomplete
            ref="autocomplete"
            :items="autocompleteItems"
            :label="autocompleteSearchColumn"
            :placeholder="autocompletePlaceholder"
            style="width: 100%"
            @input="onAutocompleteInput"
            @keyup="onAutocompleteKeyup"
          >
          </ns-autocomplete>
        </div>
        <div v-else class="flex pb-3">
          <button
            class="ml-auto rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
            type="button"
            @click="onAddItemButtonClick"
          >
            {{ tableInputManualAddItemLabel }}
          </button>
        </div>
      </template>
      <data-table
        :headers="tableHeaders"
        :items="rawTableItems(tableItems)"
        :read-only="readonly"
        :search-placeholder="tableInputSearchPlaceholder"
        :show-headers-on-empty="true"
      >
        <template #no-data
          ><span class="mdi mdi-alert"></span>
          {{ tableInputTableEmptyPlaceholder }}</template
        >
        <template #item.action="props">
          <div class="text-center">
            <button
              title="Delete"
              type="button"
              @click="onDeleteTableItemButtonClick(props.item)"
            >
              <span class="mdi mdi-delete mdi-24px"></span>
            </button></div
        ></template>
      </data-table>
      <ns-dialog
        :show="isModalShown"
        width="400px"
        @close="isModalShown = false"
      >
        <template #title>
          {{ modalTitle }}
        </template>
        <div>
          <template v-for="modal_field in modalFields" :key="modal_field.value">
            <div v-if="modal_field.source === 'user'" class="flex px-2 py-1">
              <div class="w-1/4 py-2">{{ modal_field.label }}</div>
              <div class="w-3/4">
                <date-time-picker
                  v-if="
                    modal_field.format == 'date' ||
                    modal_field.format == 'date-time'
                  "
                  ref="fields"
                  v-model="currentTableItem[modal_field.value]"
                  :date-time-picker-mode="
                    modal_field.format == 'date-time'
                      ? 'date-time-picker'
                      : 'date-picker'
                  "
                ></date-time-picker>
                <input
                  v-else
                  ref="fields"
                  v-model="currentTableItem[modal_field.value]"
                  class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
                  type="text"
                  @keyup.enter="onModalAddButtonClick"
                />
              </div>
            </div>
          </template>
          <div class="flex justify-end px-2 py-2">
            <button
              class="rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
              @click="onModalAddButtonClick"
            >
              <i class="mdi mdi-plus"></i> Add
            </button>
          </div>
        </div>
      </ns-dialog>
    </template>
  </div>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

import NsAutocomplete from "@/components/NS/NsAutocomplete.vue";
import NsDialog from "@/components/NS/NsDialog.vue";
import DataTable from "@/components/DataTable.vue";
import InlineTable from "@/components/Builder/Element/InlineTable.vue";
import DateTimePicker from "@/components/Builder/Element/DateTimePicker.vue";

import AppBuilder from "@/assets/js/AppBuilder";

export default {
  components: {
    NsAutocomplete,
    NsDialog,
    DataTable,
    InlineTable,
    DateTimePicker
  },
  inheritAttrs: false,
  props: {
    error: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    tableInputAdditionalField: {
      type: Object,
      default: function () {
        return {};
      }
    },
    tableInputAdditionalFieldFormat: {
      type: Object,
      default: function () {
        return {};
      }
    },
    tableInputHideSearch: {
      type: String,
      default: "0"
    },
    tableInputTypeInlineDefaultRowNumber: {
      type: [Number, String],
      default: 0
    },
    tableInputManualAddItemLabel: {
      type: String,
      default: "Add Item"
    },
    tableInputPlaceholder: {
      type: String,
      default: ""
    },
    tableInputSearchPlaceholder: {
      type: String,
      default: ""
    },
    tableInputSource: {
      type: String,
      default: "db"
    },
    tableInputType: {
      type: String,
      default: "datatable"
    },
    tableInputTable: {
      type: Object,
      default: function () {
        return {};
      }
    },
    tableInputTableActionColumnLabel: {
      type: String,
      default: ""
    },
    tableInputTableEmptyPlaceholder: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: ["input"],
  data: function () {
    return {
      autocompleteChangeDelayHandler: null,
      autocompleteItems: [],
      autocompletePlaceholder: "",
      autocompleteSearchColumn: null,
      autocompleteSelectedItem: {},
      currentTableItem: {},
      field: [],
      isModalShown: false,
      table: [],
      modalFields: [],
      modalTitle: "",
      tableHeaders: [],
      tableItems: []
    };
  },
  computed: {},
  watch: {
    tableInputAdditionalField: {
      handler: function () {
        this.setTableHeaders();
      },
      immediate: true
    },
    tableInputAdditionalFieldFormat: {
      handler: function () {
        this.setTableHeaders();
      },
      immediate: true
    },
    tableInputTable: {
      handler: function () {
        const self = this;

        self.setTableHeaders();
        self.fetchItems();
      },
      immediate: true
    },
    tableInputTableEmptyPlaceholder: {
      handler: function () {},
      immediate: true
    },
    tableInputTableActionColumnLabel: {
      handler: function () {
        this.setTableHeaders();
      },
      immediate: true
    },
    tableInputPlaceholder: {
      handler: function (value) {
        this.autocompletePlaceholder = value;
      },
      immediate: true
    },
    value: function (value) {
      if (!Array.isArray(value)) {
        value = [];
      }

      this.tableItems = JSON.parse(JSON.stringify(value));
    }
  },
  methods: {
    addTableItem: function () {
      const self = this;
      let item = {};

      for (let index = 0; index < self.tableHeaders.length; index++) {
        const header = self.tableHeaders[index];

        if (typeof self.currentTableItem[header.value] !== "undefined") {
          item[header.value] = self.currentTableItem[header.value];
        } else if (typeof header.function !== "undefined") {
          const fn = self.createColumnFunction(header.function);

          item[header.value] = fn(item, self.$attrs.data);
        }
      }

      self.tableItems.push(item);

      self.modalFields = {};
      self.currentTableItem = {};

      this.$emit("input", {
        target: {
          name: this.name,
          value: self.tableItems
        }
      });
    },
    createColumnFunction: function (function_string) {
      return new Function("column", "data", function_string);
    },
    fetchItems: function (search = "") {
      const self = this;
      let filters = null;

      if (
        typeof self.tableInputTable !== "undefined" &&
        typeof self.tableInputTable.columns !== "undefined"
      ) {
        let columns = self.tableInputTable.columns.map(function (item) {
          return item.name;
        });

        if (typeof self.tableInputTable.search_column !== "undefined") {
          self.autocompleteSearchColumn = self.tableInputTable.search_column;
        }

        if (search !== "") {
          filters = {
            operator: "and",
            conditions: [
              {
                condition: "contains",
                field: self.tableInputTable.search_column,
                value: search
              }
            ]
          };
        }

        AppBuilder.data({
          table: self.tableInputTable.table,
          columns: columns,
          filters: filters,
          sort: null,
          limit: 5
        }).then(function (results) {
          self.autocompleteItems = results.records;
        });
      }
    },
    onAddItemButtonClick: function (item) {
      this.shouldShowAddItemModal(item);
    },
    onModalAddButtonClick: function () {
      const self = this;

      self.addTableItem();
      self.isModalShown = false;
    },
    onAutocompleteInput: async function (item) {
      if (typeof item !== "undefined" && item !== null) {
        this.shouldShowAddItemModal(item);
      }
    },
    onAutocompleteKeyup: function (event) {
      const self = this;

      const value = event.target.value;

      self.fetchItems(value);
    },
    onDeleteTableItemButtonClick: function (item) {
      const self = this;

      for (let index = 0; index < this.tableHeaders.length; index++) {
        const header = this.tableHeaders[index];

        if (header.format == "date" || header.format == "date-time") {
          item[header.value] = (item[header.value] / 1000).toString();
        }
      }

      const stringify_item = JSON.stringify(item);

      for (let index = 0; index < self.tableItems.length; index++) {
        const stringify_table_item = JSON.stringify(self.tableItems[index]);

        if (stringify_item == stringify_table_item) {
          self.tableItems.splice(index, 1);

          self.$emit("input", {
            target: {
              name: self.name,
              value: self.tableItems
            }
          });

          break;
        }
      }
    },
    onInlineTableInput: function (event) {
      this.$emit("input", {
        target: {
          name: this.name,
          value: event.target.value
        }
      });
    },
    rawTableItems: function (table_items) {
      if (typeof table_items !== "undefined") {
        let cloned_table_items = JSON.parse(JSON.stringify(table_items));

        for (let index = 0; index < this.tableHeaders.length; index++) {
          const header = this.tableHeaders[index];

          if (
            header.source == "user" &&
            (header.format == "date" || header.format == "date-time")
          ) {
            for (
              let table_item_index = 0;
              table_item_index < cloned_table_items.length;
              table_item_index++
            ) {
              cloned_table_items[table_item_index][header.value] =
                parseInt(cloned_table_items[table_item_index][header.value]) *
                1000;

              if (isNaN(cloned_table_items[table_item_index][header.value])) {
                cloned_table_items[table_item_index][header.value] = null;
              }
            }
          }
        }

        return cloned_table_items;
      }

      return [];
    },
    shouldShowAddItemModal: function (item) {
      const self = this;

      let additional_fields = self.tableHeaders.filter(function (item) {
        return item.additional === true && item.source === "user";
      });

      if (typeof item !== "undefined") {
        self.currentTableItem = JSON.parse(JSON.stringify(item));
      }

      let modal_title = "";

      if (typeof item[self.autocompleteSearchColumn] !== "undefined") {
        modal_title = item[self.autocompleteSearchColumn];
      } else if (self.tableInputManualAddItemLabel !== "") {
        modal_title = self.tableInputManualAddItemLabel;
      }

      if (typeof item !== "undefined" && item !== null) {
        if (additional_fields.length > 0) {
          self.modalTitle = modal_title;
          self.modalFields = additional_fields;
          self.isModalShown = true;
        } else {
          self.addTableItem();
        }
      }

      self.$nextTick(function () {
        if (
          typeof self.$refs.fields !== "undefined" &&
          typeof self.$refs.fields[0] !== "undefined"
        ) {
          self.$refs.fields[0].focus();
        }
      });
    },
    setTableHeaders: function () {
      const self = this;

      self.tableHeaders.splice(0);

      if (self.$attrs.builder) {
        self.tableItems[0] = {};
      }

      if (typeof this.tableInputTable !== "undefined") {
        let columns = [];

        if (
          typeof this.tableInputTable.columns !== "undefined" &&
          Array.isArray(this.tableInputTable.columns)
        ) {
          columns = this.tableInputTable.columns;
        }

        for (let index = 0; index < columns.length; index++) {
          const column = columns[index];

          self.tableHeaders.push({
            additional: false,
            align: typeof column.align === "undefined" ? "left" : column.align,
            format:
              typeof column.format === "undefined" ? "general" : column.format,
            label:
              typeof column.alias === "undefined" ? column.name : column.alias,
            value: column.name,
            visible:
              typeof column.visible === "undefined" ? "general" : column.visible
          });

          if (self.$attrs.builder) {
            self.tableItems[0][column.name] = "-";
          }
        }
      }

      if (typeof this.tableInputAdditionalField !== "undefined") {
        let additional_columns = [];

        if (
          typeof this.tableInputAdditionalField.value !== "undefined" &&
          Array.isArray(this.tableInputAdditionalField.value)
        ) {
          additional_columns = this.tableInputAdditionalField.value;
        } else {
          additional_columns = this.tableInputAdditionalField;
        }

        additional_columns = JSON.parse(JSON.stringify(additional_columns));

        for (let index = 0; index < additional_columns.length; index++) {
          const column = additional_columns[index];

          if (
            typeof this.tableInputAdditionalFieldFormat !== "undefined" &&
            typeof this.tableInputAdditionalFieldFormat[index] !== "undefined"
          ) {
            for (const key in this.tableInputAdditionalFieldFormat[index]) {
              if (key === "name" || key === "label") {
                continue;
              }

              if (
                Object.hasOwnProperty.call(
                  this.tableInputAdditionalFieldFormat[index],
                  key
                )
              ) {
                column[key] = this.tableInputAdditionalFieldFormat[index][key];
              }
            }
          }

          self.tableHeaders.push({
            additional: true,
            align: typeof column.align === "undefined" ? "left" : column.align,
            format:
              typeof column.format === "undefined" ? "general" : column.format,
            function:
              typeof column.function === "undefined"
                ? "general"
                : column.function,
            label: column.label,
            source: column.source,
            value: column.value
          });

          if (self.$attrs.builder) {
            self.tableItems[0][column.value] = "-";
          }
        }
      }

      if (!self.readonly) {
        self.tableHeaders.push({
          additional: true,
          align: "center",
          label: self.tableInputTableActionColumnLabel,
          sortable: false,
          value: "action"
        });
      }
    }
  }
};

elementPanelList.addElement(
  "general",
  "Table Input",
  "Table Input",
  "table-input",
  "mdi mdi-table"
);

fieldProperties["table-input"] = {
  label: {
    label: "Label"
  },
  name: {
    label: "Name"
  },
  "table-input-type": {
    label: "Type"
  },
  "table-input-source": {
    label: "Source"
  },
  "table-input-manual-add-item-label": {
    label: "Add Item Label"
  },
  "table-input-target-table": {
    label: "Save To Table"
  },
  "table-input-placeholder": {
    label: "Placeholder",
    rules: [
      {
        property: "table-input-source",
        values: ["db"]
      }
    ]
  },
  "table-input-hide-search": {
    label: "Hide Search",
    rules: [
      {
        property: "table-input-source",
        values: ["db"]
      }
    ]
  },
  "table-input-search-placeholder": {
    label: "Search Placeholder",
    rules: [
      {
        property: "table-input-source",
        values: ["db"]
      }
    ]
  },
  "table-input-table": {
    label: "Table & Columns",
    rules: [
      {
        property: "table-input-source",
        values: ["db"]
      }
    ]
  },
  "table-input-additional-field": {
    label: "Additional Field"
  },
  "table-input-additional-field-format": {
    label: "Additional Field Format"
  },
  "table-input-table-action-column-label": {
    label: "Action Column Label"
  },
  "table-input-table-empty-placeholder": {
    label: "Empty Table Placeholder"
  },
  "table-input-type-inline-default-row-number": {
    label: "Type Inline Default Row Number"
  },
  readonly: {
    label: "Is Read Only"
  },
  validation: {
    label: "Validation"
  }
};

fieldPropertyOptions.addOption("table-input-type", [
  {
    name: "Data Table",
    value: "datatable"
  },
  {
    name: "Inline",
    value: "inline"
  }
]);

fieldPropertyOptions.addOption("table-input-source", [
  {
    name: "User Defined",
    value: "user"
  },
  {
    name: "Database",
    value: "db"
  }
]);

fieldPropertyOptions.addOption(
  "table-input-target-table",
  "FieldPropertyTableColumnSelector",
  {
    additionalColumnAttributes: [
      {
        label: "Format",
        name: "format",
        value: "general",
        options: [
          { label: "Currency", value: "currency" },
          { label: "General", value: "general" },
          { label: "Date", value: "date" },
          { label: "Number", value: "number" }
        ]
      }
    ],
    additionalFields: [
      {
        label: "Join Column",
        name: "join_column"
      }
    ]
  },
  ["table-input"],
  ""
);

fieldPropertyOptions.addOption("table-input-hide-search", [
  {
    name: "No",
    value: false
  },
  {
    name: "Yes",
    value: true
  }
]);

fieldPropertyOptions.addOption(
  "table-input-table",
  "FieldPropertyTableColumnSelector",
  {
    additionalColumnAttributes: [
      {
        label: "Format",
        name: "format",
        value: "general",
        options: [
          { label: "Currency", value: "currency" },
          { label: "General", value: "general" },
          { label: "Date", value: "date" },
          { label: "Number", value: "number" }
        ]
      },
      {
        label: "Align",
        name: "align",
        value: "left",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" }
        ]
      },
      {
        label: "Visible",
        name: "visible",
        value: true,
        options: [
          { label: "True", value: true },
          { label: "False", value: false }
        ]
      }
    ],
    additionalFields: [
      {
        label: "Primary Key",
        name: "primary_key"
      },
      {
        label: "Search Column",
        name: "search_column"
      }
    ],
    showColumnsSelector: true
  },
  ["table-input"],
  ""
);

fieldPropertyOptions.addOption(
  "table-input-additional-field",
  "FieldPropertyValueCollection",
  undefined,
  ["table-input"],
  ""
);

fieldPropertyOptions.addOption(
  "table-input-additional-field-format",
  "FieldPropertyValueCollectionFormat",
  {
    source: "table-input-additional-field",
    additionalFieldProperties: [
      {
        label: "Align",
        name: "align",
        value: "left",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" }
        ]
      },
      {
        label: "Source",
        name: "source",
        value: "user",
        options: [
          { label: "User Input", value: "user" },
          {
            label: "Function",
            value: "function",
            fields: [{ label: "Function", name: "function", type: "textarea" }]
          },
          { label: "Webhook", value: "webhook" }
        ]
      },
      {
        label: "Function",
        name: "function",
        value: "",
        type: "textarea",
        validation: function (properties) {
          if (
            typeof properties !== "undefined" &&
            typeof properties.source !== "undefined" &&
            properties.source === "function"
          ) {
            return true;
          }

          return false;
        }
      }
    ]
  },
  ["table-input"],
  ""
);
</script>
