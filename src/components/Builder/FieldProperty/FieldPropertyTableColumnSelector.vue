<template>
  <div :class="{ 'h-28': showAdd }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="add"
    >
      <span class="mdi mdi-plus"></span>Select
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
        <div class="flex-grow">
          <div class="py-0.5 pr-1"><b>Table</b></div>
          <div class="py-0.5">
            <select
              v-model="sourceDatabase.table"
              class="w-full rounded-sm border border-primary bg-white outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              @change="changeTableColumns"
            >
              <option
                v-for="source_table in sourceDatabase.tables"
                :key="source_table"
                :value="source_table"
              >
                {{ source_table }}
              </option>
            </select>
          </div>
          <div v-if="configuration.showColumnsSelector">
            <div class="py-0.5 pr-1"><b>Columns</b></div>
            <div
              v-for="column in sourceDatabase.columns"
              :key="column"
              class="grid grid-cols-2"
            >
              <div class="py-0.5 pr-1">
                <label class="block truncate">
                  <input
                    v-model="column.checked"
                    type="checkbox"
                    :value="column"
                  />
                  {{ column.name }}
                </label>
              </div>
              <div class="py-0.5">
                <button
                  :class="{
                    'bg-primary': column.checked,
                    'bg-disabled text-on-disabled dark:bg-disabled--dark dark:text-on-disabled--dark':
                      !column.checked
                  }"
                  :disabled="!column.checked"
                  class="w-full rounded-sm px-0.5 py-1.5 text-xs text-on-primary"
                  @click="setColumnProperties(column)"
                >
                  Properties
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            typeof additionalFields !== 'undefined' &&
            typeof additionalFields.length !== 'undefined' &&
            additionalFields.length > 0
          "
        >
          <div class="py-0.5 pr-1">
            <b>Column Options</b>
          </div>

          <div
            v-for="field in configuration.additionalFields"
            :key="field.name"
            class="grid grid-cols-2"
          >
            <div class="py-0.5 pr-1">{{ field.label }}</div>
            <div class="py-0.5 pr-1">
              <select
                v-model="field.value"
                class="w-full rounded-sm border border-primary bg-white outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              >
                <option
                  v-for="column in sourceDatabase.columns"
                  :key="column.name"
                  :value="column.name"
                >
                  {{ column.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="showAdd = false"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            class="rounded-sm bg-primary px-2 py-1 text-white dark:bg-primary--dark"
            @click="save"
          >
            <span class="mdi mdi-check"></span> Save
          </button>
        </div>
      </div>
    </transition>

    <transition
      name="show-column-setting-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showColumnProperties"
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-scroll bg-white p-2 dark:border-surface--dark-300 dark:bg-surface--dark-300"
      >
        <div class="flex-grow">
          <div
            v-for="property in columnProperties"
            :key="property.name"
            class="grid grid-cols-2"
          >
            <div class="py-0.5 pr-1">{{ property.label }}</div>
            <div class="py-0.5 pr-1">
              <select
                v-if="property.options"
                v-model="currentColumn[property.name]"
                class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              >
                <option
                  v-for="option in property.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <input
                v-else
                v-model="currentColumn[property.name]"
                class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
                type="text"
              />
            </div>
          </div>
        </div>
        <div class="pt-2 text-center">
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary"
            @click="showColumnProperties = false"
          >
            <span class="mdi mdi-check"></span> Save
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AppBuilder from "@/assets/js/AppBuilder.js";

export default {
  name: "FieldPropertyTableColumnSelector",
  props: {
    configuration: {
      type: Object,
      default: function () {
        return {
          additionalFields: [],
          additionalColumnAttributes: [],
          showColumnsSelector: true
        };
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
    },
    table: {
      type: String,
      default: ""
    }
  },
  emits: {
    change: null
  },
  data: function () {
    return {
      columnProperties: [
        {
          label: "Alias",
          name: "alias"
        }
      ],
      currentColumn: null,
      showAdd: false,

      showColumnProperties: false,

      sourceDatabase: {
        tables: [],
        table: "",
        columns: [],
        labelColumn: "",
        valueColumn: ""
      }
    };
  },
  computed: {
    additionalColumnAttributes: function () {
      const self = this;
      let addditional_column_attributes = [];

      if (
        typeof self.configuration.additionalColumnAttributes !== "undefined"
      ) {
        addditional_column_attributes =
          self.configuration.additionalColumnAttributes;
      }

      return addditional_column_attributes;
    },
    additionalFields: function () {
      const self = this;
      let addditional_items = [];

      if (typeof self.configuration.additionalFields !== "undefined") {
        addditional_items = self.configuration.additionalFields;
      }

      return addditional_items;
    }
  },
  mounted: function () {
    this.initializeItems(true);
  },
  methods: {
    setColumnProperties: function (column) {
      const self = this;

      for (const key in self.columnProperties) {
        if (Object.hasOwnProperty.call(self.columnProperties, key)) {
          const attribute = self.columnProperties[key];

          if (
            typeof column[attribute.name] === "undefined" &&
            typeof attribute.value !== "undefined"
          ) {
            if (typeof column[attribute.name] === "undefined") {
              column[attribute.name] = attribute.value;
            }
          }
        }
      }

      self.showColumnProperties = true;
      self.currentColumn = column;
    },
    initializeItems: function (is_check_source) {
      const self = this;

      if (is_check_source) {
        if (
          typeof this.properties[self.fieldProperty] !== "undefined" &&
          typeof this.properties[self.fieldProperty].table !== "undefined"
        ) {
          this.sourceDatabase.table =
            this.properties[this.fieldProperty]["table"];
        }

        AppBuilder.getTables().then(function (data) {
          self.sourceDatabase.tables.splice(0);

          for (let i = 0; i < data.length; i++) {
            const table = data[i];

            // TODO Why we have this checking?
            // if (table != self.table) {
            self.sourceDatabase.tables.push(table);
            // }
          }

          if (self.sourceDatabase.table === "") {
            self.sourceDatabase.table = self.sourceDatabase.tables[0];
          }

          self.changeTableColumns();
        });

        for (let index = 0; index < self.additionalFields.length; index++) {
          const field = self.additionalFields[index];

          if (
            typeof self.properties[self.fieldProperty] !== "undefined" &&
            typeof self.properties[self.fieldProperty][field.name] !==
              "undefined"
          ) {
            field.value = self.properties[self.fieldProperty][field.name];
          }
        }

        self.columnProperties.splice(1);

        for (
          let index = 0;
          index < self.additionalColumnAttributes.length;
          index++
        ) {
          const attribute = self.additionalColumnAttributes[index];

          self.columnProperties.push(attribute);
        }
      }
    },
    changeTableColumns: function () {
      const self = this;

      AppBuilder.getTableColumns(self.sourceDatabase.table).then(
        function (data) {
          self.sourceDatabase.columns.splice(0);

          for (let i = 0; i < data.length; i++) {
            let current_column = [];

            if (
              typeof self.properties[self.fieldProperty] !== "undefined" &&
              typeof self.properties[self.fieldProperty].columns !== "undefined"
            ) {
              current_column = self.properties[
                self.fieldProperty
              ].columns.filter(function (item) {
                return item.name == data[i];
              });
            }

            if (current_column.length === 1) {
              // self.sourceDatabase.columns.push({
              //   alias: current_column[0].alias,
              //   checked: true,
              //   name: current_column[0].name
              // });

              self.sourceDatabase.columns.push(
                Object.assign({}, current_column[0])
              );

              // console.log(current_column[0]);
            } else {
              self.sourceDatabase.columns.push({
                alias: data[i],
                checked: false,
                name: data[i]
              });
            }
          }
        }
      );
    },
    add: function () {
      this.showAdd = true;
    },
    save: function () {
      const self = this;

      let columns = [];
      let value = {};

      self.showAdd = false;

      for (let index = 0; index < self.sourceDatabase.columns.length; index++) {
        const column = self.sourceDatabase.columns[index];

        if (column.checked) {
          columns.push(Object.assign({}, column));
        }
      }

      value.source = "db";
      value.table = self.sourceDatabase.table;
      value.columns = columns;

      for (let index = 0; index < self.additionalFields.length; index++) {
        const field = self.additionalFields[index];

        value[field.name] = field.value;
      }

      self.$emit("change", self.fieldProperty, value);
    }
  }
};
</script>
