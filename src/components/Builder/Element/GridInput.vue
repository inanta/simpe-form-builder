<template>
  <div>
    <div v-if="columns.length == 0 || rows.length == 0">
      Please add columns and rows first.
    </div>
    <table v-else class="w-full">
      <tr v-if="gridInputColumnHeaderTitle !== ''">
        <th
          class="text-left"
          :class="{ 'border border-mid-gray p-2.5': gridInputShowBorder }"
          :colspan="columns.length + 1"
        >
          {{ gridInputColumnHeaderTitle }}
        </th>
      </tr>
      <tr>
        <th
          :class="{ 'border border-mid-gray p-2.5': gridInputShowBorder }"
          class="text-left"
        >
          {{ gridInputRowTitle }}
        </th>
        <th
          v-for="column in columns"
          :key="column.label"
          :class="{ 'border border-mid-gray p-2.5': gridInputShowBorder }"
        >
          {{ column.label }}
        </th>
      </tr>
      <tr v-for="(row, row_index) in rows" :key="row.label">
        <th
          v-if="typeof row.is_header !== 'undefined'"
          :class="{ 'border border-mid-gray p-2.5': gridInputShowBorder }"
          :colspan="columns.length + 1"
          class="text-left"
        >
          {{ row.label }}
        </th>
        <td
          v-else
          :class="{ 'border border-mid-gray p-2.5': gridInputShowBorder }"
          class="text-left"
        >
          {{ row.label }}
        </td>

        <template v-if="typeof row.is_header === 'undefined'">
          <td
            v-for="(column, column_index) in columns"
            :key="column.label"
            :class="{
              'border border-mid-gray p-2.5': gridInputShowBorder,
              'text-center':
                getType(row, column) === 'radio' ||
                getType(row, column) === 'checkbox'
            }"
            class="px-1 py-0.5"
          >
            <input
              v-if="getType(row, column) === 'radio'"
              :checked="gridDataValue(row.value, column_index) !== ''"
              :name="'row' + row_index"
              class="px-2 py-1"
              type="radio"
              :value="column.value"
              :readonly="readonly"
              :disabled="readonly"
              @input="onInput($event, row_index, column_index, row, column)"
            />
            <input
              v-else-if="getType(row, column) === 'checkbox'"
              class="px-2 py-1"
              type="checkbox"
              :checked="gridDataValue(row.value, column_index) !== ''"
              :value="
                gridInputCheckboxValueSource === 'row'
                  ? row.value
                  : column.value
              "
              :readonly="readonly"
              :disabled="readonly"
              @input="onInput($event, row_index, column_index, row, column)"
            />
            <select
              v-else-if="getType(row, column) === 'drop-down'"
              class="w-full rounded-sm border border-mid-gray px-2 py-1 outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
              :readonly="readonly"
              :disabled="readonly"
              @input="onInput($event, row_index, column_index, row, column)"
            >
              <option
                v-for="item in dropDownItems(row, column)"
                :key="item"
                :selected="
                  gridDataValue(row.value, column_index) === item.value
                "
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
            <input
              v-else
              :value="gridData[row.value][column_index]"
              class="w-full rounded-sm border border-mid-gray px-2 py-1 outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
              type="text"
              :readonly="readonly"
              :disabled="readonly"
              @input="onInput($event, row_index, column_index, row, column)"
            />
          </td>
        </template>
      </tr>
    </table>
  </div>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

export default {
  props: {
    gridInputAdditionalColumns: {
      type: Object,
      default: function () {
        return {};
      }
    },
    gridInputAdditionalColumnsDropDownItems: {
      type: Object,
      default: function () {
        return {};
      }
    },
    gridInputAdditionalColumnsType: {
      type: String,
      default: ""
    },
    gridInputAdditionalRows: {
      type: Object,
      default: function () {
        return {};
      }
    },
    gridInputAdditionalRowsDropDownItems: {
      type: Object,
      default: function () {
        return {};
      }
    },
    gridInputAdditionalRowsType: {
      type: String,
      default: ""
    },
    gridInputCheckboxValueSource: {
      type: String,
      default: "column"
    },
    gridInputColumnHeaderTitle: {
      type: String,
      default: ""
    },
    gridInputColumnTitle: {
      type: String,
      default: ""
    },
    gridInputColumns: {
      type: Object,
      default: function () {
        return {};
      }
    },
    gridInputDropDownItems: {
      type: Object,
      default: function () {
        return {};
      }
    },
    gridInputRows: {
      type: Object,
      default: function () {
        return {};
      }
    },
    gridInputRowTitle: {
      type: String,
      default: ""
    },
    gridInputShowBorder: {
      type: String,
      default: "0"
    },
    gridInputType: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
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
      gridColumns: [],
      gridData: {},
      gridRows: []
    };
  },
  computed: {
    additionalColumnsCount: function () {
      return this.columns.filter(function (item) {
        return item.additional;
      }).length;
    },
    columns: function () {
      const self = this;

      let columns = [];
      let additional_columns = [];

      if (typeof self.gridInputColumns !== "undefined") {
        if (
          typeof self.gridInputColumns.value !== "undefined" &&
          Array.isArray(self.gridInputColumns.value)
        ) {
          columns = self.gridInputColumns.value;
        } else if (Array.isArray(self.gridInputColumns)) {
          columns = self.gridInputColumns;
        }

        columns = columns.map(function (column) {
          return {
            additional: false,
            label: column.label,
            value: column.value,
            type: self.gridInputType
          };
        });
      }

      if (typeof self.gridInputAdditionalColumns !== "undefined") {
        if (
          typeof self.gridInputAdditionalColumns.value !== "undefined" &&
          Array.isArray(self.gridInputAdditionalColumns.value)
        ) {
          additional_columns = self.gridInputAdditionalColumns.value;
        } else if (Array.isArray(self.gridInputAdditionalColumns)) {
          additional_columns = self.gridInputAdditionalColumns;
        }

        additional_columns = additional_columns.map(function (column) {
          return {
            additional: true,
            label: column.label,
            value: column.value,
            type: self.gridInputAdditionalColumnsType
          };
        });
      }

      columns = columns.concat(additional_columns);

      return columns;
    },
    rows: function () {
      const self = this;

      let group_by = [];
      let rows = [];
      let additional_rows = [];

      if (typeof self.gridInputRows !== "undefined") {
        let rows_value = [];

        if (
          typeof self.gridInputRows.value !== "undefined" &&
          Array.isArray(self.gridInputRows.value)
        ) {
          rows_value = self.gridInputRows.value;
        } else if (Array.isArray(self.gridInputRows)) {
          rows_value = self.gridInputRows;
        }

        for (let index = 0; index < rows_value.length; index++) {
          const row_value = rows_value[index];

          if (
            typeof row_value.group_by !== "undefined" &&
            row_value.group_by !== "" &&
            row_value.group_by !== null
          ) {
            if (!group_by.includes(row_value.group_by)) {
              group_by.push(row_value.group_by);

              rows.push({
                is_header: true,
                label: row_value.group_by
              });
            }
          }

          rows.push({
            additional: false,
            label: row_value.label,
            value: row_value.value
          });
        }
      }

      if (typeof self.gridInputAdditionalRows !== "undefined") {
        if (
          typeof self.gridInputAdditionalRows.value !== "undefined" &&
          Array.isArray(self.gridInputAdditionalRows.value)
        ) {
          additional_rows = self.gridInputAdditionalRows.value;
        } else if (Array.isArray(self.gridInputAdditionalRows)) {
          additional_rows = self.gridInputAdditionalRows;
        }

        additional_rows = additional_rows.map(function (row) {
          return {
            additional: true,
            label: row.label,
            value: row.value,
            type: self.gridInputAdditionalRowsType
          };
        });
      }

      rows = rows.concat(additional_rows);

      return rows;
    }
  },
  watch: {
    gridInputColumns: {
      handler: function (value) {
        this.gridColumns = value;
        this.initGridData();
      },
      immediate: true
    },
    gridInputRows: {
      handler: function (value) {
        this.gridRows = value;
        this.initGridData();
      },
      immediate: true
    },
    value: {
      handler: function (value) {
        const self = this;

        for (let row_index = 0; row_index < self.rows.length; row_index++) {
          const row = self.rows[row_index];

          if (typeof row.value !== "undefined") {
            for (
              let column_index = 0;
              column_index < self.columns.length;
              column_index++
            ) {
              if (
                typeof value[row.value] !== "undefined" &&
                typeof value[row.value][column_index] !== "undefined"
              ) {
                self.gridData[row.value][column_index] =
                  value[row.value][column_index];
              } else {
                self.gridData[row.value][column_index] = "";
              }
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    dropDownItems: function (row, column) {
      const self = this;
      let item_source = null;

      if (!column.additional && !row.additional) {
        item_source = self.gridInputDropDownItems;
      } else if (column.additional && !row.additional) {
        item_source = self.gridInputAdditionalColumnsDropDownItems;
      } else if (row.additional && !column.additional) {
        item_source = self.gridInputAdditionalRowsDropDownItems;
      } else {
        item_source = self.gridInputAdditionalColumnsDropDownItems;
      }

      if (typeof item_source.value !== "undefined") {
        return item_source.value;
      }

      return item_source;
    },
    getType: function (row, column) {
      if (row.additional && column.additional) {
        return column.type;
      } else if (row.additional) {
        return row.type;
      }

      return column.type;
    },
    gridDataValue(row, column) {
      const self = this;
      if (
        typeof self.gridData[row] !== "undefined" &&
        typeof self.gridData[row][column] !== "undefined"
      ) {
        return self.gridData[row][column];
      }

      return "";
    },
    initGridData: function () {
      const self = this;
      this.gridData = {};

      for (let row_index = 0; row_index < this.rows.length; row_index++) {
        const row = self.rows[row_index];

        if (typeof row.value === "undefined") {
          continue;
        }

        this.gridData[row.value] = [];

        for (
          let column_index = 0;
          column_index < this.columns.length;
          column_index++
        ) {
          const column = self.columns[column_index];

          if (!column.additional && !row.additional) {
            if (self.gridInputType === "drop-down") {
              this.gridData[row.value].push(
                this.dropDownItems(row, column)[0].value
              );
            } else {
              this.gridData[row.value].push("");
            }
          } else if (column.additional && !row.additional) {
            if (self.gridInputAdditionalColumnsType === "drop-down") {
              this.gridData[row.value].push(
                this.dropDownItems(row, column)[0].value
              );
            } else {
              this.gridData[row.value].push("");
            }
          } else if (row.additional && !column.additional) {
            if (self.gridInputAdditionalRowsType === "drop-down") {
              this.gridData[row.value].push(
                this.dropDownItems(row, column)[0].value
              );
            } else {
              this.gridData[row.value].push("");
            }
          } else {
            if (self.gridInputAdditionalColumnsType === "drop-down") {
              this.gridData[row.value].push(
                this.dropDownItems(row, column)[0].value
              );
            } else {
              this.gridData[row.value].push("");
            }
          }
        }
      }
    },
    onInput: function (event, row_index, column_index, row, column) {
      const self = this;

      let value = event.target.value;

      if (!column.additional && !row.additional) {
        if (self.gridInputType === "radio") {
          for (
            let index = 0;
            index < self.columns.length - self.additionalColumnsCount;
            index++
          ) {
            self.gridData[row.value][index] = "";
          }
        } else if (self.gridInputType === "checkbox") {
          if (!event.target.checked) {
            value = "";
          }
        }
      } else if (column.additional && !row.additional) {
        if (self.gridInputAdditionalColumnsType === "radio") {
          for (
            let index = self.columns.length - self.additionalColumnsCount;
            index < self.columns.length;
            index++
          ) {
            self.gridData[row.value][index] = "";
          }
        } else if (self.gridInputAdditionalColumnsType === "checkbox") {
          if (!event.target.checked) {
            value = "";
          }
        }
      } else if (row.additional && !column.additional) {
        if (self.gridInputAdditionalRowsType === "radio") {
          for (
            let index = 0;
            index < self.columns.length - self.additionalColumnsCount;
            index++
          ) {
            self.gridData[row.value][index] = "";
          }
        } else if (self.gridInputAdditionalRowsType === "checkbox") {
          if (!event.target.checked) {
            value = "";
          }
        }
      } else {
        if (self.gridInputAdditionalColumnsType === "radio") {
          for (
            let index = self.columns.length - self.additionalColumnsCount;
            index < self.columns.length;
            index++
          ) {
            self.gridData[row.value][index] = "";
          }
        } else if (self.gridInputAdditionalColumnsType === "checkbox") {
          if (!event.target.checked) {
            value = "";
          }
        }
      }

      self.gridData[row.value][column_index] = value;

      self.$emit("input", {
        target: {
          name: self.name,
          value: self.gridData
        }
      });
    }
  }
};

elementPanelList.addElement(
  "general",
  "Grid",
  "Grid",
  "grid-input",
  "mdi mdi-grid"
);

fieldProperties["grid-input"] = {
  label: {
    label: "Label"
  },
  name: {
    label: "Name"
  },
  "grid-input-rows": {
    label: "Rows"
  },
  "grid-input-columns": {
    label: "Columns"
  },
  "grid-input-type": {
    label: "Type"
  },
  "grid-input-row-title": {
    label: "Row Title"
  },
  "grid-input-column-header-title": {
    label: "Column Header Title"
  },
  "grid-input-column-title": {
    label: "Column Title"
  },
  "grid-input-drop-down-items": {
    label: "Drop Down Items",
    rules: [
      {
        property: "grid-input-type",
        values: ["drop-down"]
      }
    ]
  },
  "grid-input-additional-rows": {
    label: "Additional Rows"
  },
  "grid-input-additional-rows-type": {
    label: "Additional Rows Type"
  },
  "grid-input-additional-rows-drop-down-items": {
    label: "Drop Down Items",
    rules: [
      {
        property: "grid-input-additional-rows-type",
        values: ["drop-down"]
      }
    ]
  },
  "grid-input-additional-columns": {
    label: "Additional Columns"
  },
  "grid-input-additional-columns-type": {
    label: "Additional Columns Type"
  },
  "grid-input-additional-columns-drop-down-items": {
    label: "Drop Down Items",
    rules: [
      {
        property: "grid-input-additional-columns-type",
        values: ["drop-down"]
      }
    ]
  },
  "grid-input-show-border": {
    label: "Show Border"
  },
  "grid-input-checkbox-value-source": {
    label: "Checkbox Value Source"
  },
  readonly: {
    label: "Is Read Only"
  }
};

fieldPropertyOptions.addOption(
  "grid-input-rows",
  "FieldPropertyValueCollection",
  {
    databaseAdditionalFields: [
      {
        label: "Group By",
        name: "group_by",
        default: "",
        type: "column-selector"
      }
    ]
  },
  ["grid-input"]
);

fieldPropertyOptions.addOption(
  "grid-input-columns",
  "FieldPropertyValueCollection",
  undefined,
  ["grid-input"]
);

fieldPropertyOptions.addOption(
  "grid-input-type",
  [
    {
      name: "Checkbox",
      value: "checkbox"
    },
    {
      name: "Multiple Choice",
      value: "radio"
    },
    {
      name: "Text",
      value: "text"
    },
    {
      name: "Drop-down",
      value: "drop-down"
    }
  ],
  undefined,
  ["grid-input"],
  "radio"
);

fieldPropertyOptions.addOption(
  "grid-input-drop-down-items",
  "FieldPropertyValueCollection",
  undefined,
  ["grid-input"]
);

fieldPropertyOptions.addOption(
  "grid-input-additional-rows",
  "FieldPropertyValueCollection",
  undefined,
  ["grid-input"]
);

fieldPropertyOptions.addOption(
  "grid-input-additional-rows-type",
  [
    {
      name: "Checkbox",
      value: "checkbox"
    },
    {
      name: "Multiple Choice",
      value: "radio"
    },
    {
      name: "Text",
      value: "text"
    },
    {
      name: "Drop-down",
      value: "drop-down"
    }
  ],
  undefined,
  ["grid-input"],
  "radio"
);

fieldPropertyOptions.addOption(
  "grid-input-additional-rows-drop-down-items",
  "FieldPropertyValueCollection",
  undefined,
  ["grid-input"]
);

fieldPropertyOptions.addOption(
  "grid-input-additional-columns",
  "FieldPropertyValueCollection",
  undefined,
  ["grid-input"]
);

fieldPropertyOptions.addOption(
  "grid-input-additional-columns-type",
  [
    {
      name: "Checkbox",
      value: "checkbox"
    },
    {
      name: "Multiple Choice",
      value: "radio"
    },
    {
      name: "Text",
      value: "text"
    },
    {
      name: "Drop-down",
      value: "drop-down"
    }
  ],
  undefined,
  ["grid-input"],
  "radio"
);

fieldPropertyOptions.addOption(
  "grid-input-additional-columns-drop-down-items",
  "FieldPropertyValueCollection",
  undefined,
  ["grid-input"]
);

fieldPropertyOptions.addOption("grid-input-show-border", [
  {
    name: "No",
    value: false
  },
  {
    name: "Yes",
    value: true
  }
]);

fieldPropertyOptions.addOption("grid-input-checkbox-value-source", [
  {
    name: "Column",
    value: "column"
  },
  {
    name: "Row",
    value: "row"
  }
]);

fieldPropertyOptions.addOption("readonly", [
  {
    name: "No",
    value: false
  },
  {
    name: "Yes",
    value: true
  }
]);
</script>
