<template>
  <div :class="{ 'h-28': showAdd }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="add"
    >
      <span class="mdi mdi-plus"></span> {{ addButtonLabel }}
    </button>
    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-auto bg-white p-2 dark:border-surface--dark-300 dark:bg-surface--dark-300"
      >
        <div v-if="hasFields">
          <div
            v-for="field in fields"
            :key="field.name"
            class="grid grid-cols-2"
          >
            <div class="py-0.5 pr-1">{{ field.label }}</div>
            <div class="py-0.5 pr-1">
              <button
                class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
                @click="setColumnProperties(field)"
              >
                Properties
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          Please add one or more fields to
          <b class="font-bold">{{ fieldSourceName }}</b> first.
        </div>
        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="showAdd = false"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            v-if="hasFields"
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
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
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-auto bg-white p-2 dark:border-surface--dark-300 dark:bg-surface--dark-300"
      >
        <div class="flex-grow">
          <div class="pb-2 text-center font-bold">
            {{ currentColumn.label }}
          </div>
          <div class="grid grid-cols-2">
            <div class="py-0.5 pr-1">Name</div>
            <div class="py-0.5 pr-1">
              <input
                :value="currentColumn.name"
                class="w-full cursor-not-allowed rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
                readonly
                type="text"
              />
            </div>
          </div>
          <div
            v-for="property in columnProperties"
            :key="property.name"
            class="grid grid-cols-2"
          >
            <template
              v-if="
                typeof property.validation === 'undefined' ||
                property.validation(currentColumn)
              "
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
                <textarea
                  v-else-if="property.type === 'textarea'"
                  v-model="currentColumn[property.name]"
                  class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
                  rows="5"
                ></textarea>
                <input
                  v-else
                  v-model="currentColumn[property.name]"
                  class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
                  type="text"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="pt-2 text-center">
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary"
            @click="saveAttributes"
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
  name: "FieldPropertyValueCollectionProperties",
  props: {
    configuration: {
      type: Object,
      default: function () {
        return {
          source: "",
          additionalFieldProperties: []
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
    }
  },
  emits: {
    change: null
  },
  data: function () {
    return {
      columnProperties: [],
      currentColumn: {},
      fields: [],
      showAdd: false,
      showColumnProperties: false
    };
  },
  computed: {
    addButtonLabel: function () {
      if (typeof this.configuration.addButtonLabel !== "undefined") {
        return this.configuration.addButtonLabel;
      }

      return "Set Properties";
    },
    additionalFieldProperties: function () {
      const self = this;
      let addditional_column_attributes = [];

      if (typeof self.configuration.additionalFieldProperties !== "undefined") {
        addditional_column_attributes =
          self.configuration.additionalFieldProperties;
      }

      return addditional_column_attributes;
    },
    fieldSourceName: function () {
      return "";
    },
    hasFields: function () {
      return this.fields.length > 0;
    }
  },
  methods: {
    add: function () {
      this.initializeItems();
      this.showAdd = true;
    },
    initializeItems: function () {
      const self = this;

      let current_values = {};

      self.fields = [];

      if (
        typeof self.properties[self.fieldProperty] !== "undefined" &&
        typeof self.properties[self.fieldProperty].length !== "undefined"
      ) {
        for (
          let index = 0;
          index < self.properties[self.fieldProperty].length;
          index++
        ) {
          current_values[self.properties[self.fieldProperty][index].name] =
            JSON.parse(
              JSON.stringify(self.properties[self.fieldProperty][index])
            );
        }
      }

      if (
        typeof self.properties[self.configuration.source] !== "undefined" &&
        typeof self.properties[self.configuration.source]["value"]
      ) {
        for (
          let index = 0;
          index < self.properties[self.configuration.source]["value"].length;
          index++
        ) {
          const element =
            self.properties[self.configuration.source]["value"][index];

          let field = {
            label: element.label,
            name: element.value
          };

          for (const key in element) {
            if (Object.hasOwnProperty.call(element, key)) {
              const attribute = element[key];

              field[key] = attribute;
            }
          }

          if (typeof current_values[field.name] !== "undefined") {
            for (const key in current_values[field.name]) {
              if (Object.hasOwnProperty.call(current_values[field.name], key)) {
                if (key === "name" || key === "label") {
                  continue;
                }

                const value = current_values[field.name][key];

                field[key] = value;
              }
            }
          }

          self.fields.push(field);
        }
      }

      self.columnProperties = [];

      for (
        let index = 0;
        index < self.additionalFieldProperties.length;
        index++
      ) {
        const attribute = self.additionalFieldProperties[index];

        self.columnProperties.push(attribute);
      }
    },
    setColumnProperties: function (column) {
      const self = this;
      let values = {};

      for (let index = 0; index < self.fields.length; index++) {
        const field = self.fields[index];

        if (field.name === column.name) {
          values = JSON.parse(JSON.stringify(field));

          break;
        }
      }

      for (const key in self.columnProperties) {
        if (Object.hasOwnProperty.call(self.columnProperties, key)) {
          const attribute = self.columnProperties[key];

          if (typeof values[attribute.name] !== "undefined") {
            // Set value to recently modified value
            column[attribute.name] = values[attribute.name];
          } else if (
            typeof column[attribute.name] === "undefined" &&
            typeof attribute.value !== "undefined"
          ) {
            // Save value to default value
            column[attribute.name] = attribute.value;
          }
        }
      }

      self.showColumnProperties = true;
      self.currentColumn = column;
    },
    save: function () {
      const self = this;
      const allowed_attributes = ["format", "label", "name", "value"];
      const default_values = {};

      for (
        let index = 0;
        index < self.additionalFieldProperties.length;
        index++
      ) {
        allowed_attributes.push(self.additionalFieldProperties[index].name);
        default_values[self.additionalFieldProperties[index].name] =
          self.additionalFieldProperties[index].value;
      }

      const fields_formats = self.fields.map(function (item) {
        let filtered_item = {};

        for (let index = 0; index < allowed_attributes.length; index++) {
          const allowed_attribute = allowed_attributes[index];

          filtered_item[allowed_attribute] =
            item[allowed_attribute] === undefined
              ? default_values[allowed_attribute]
              : item[allowed_attribute];
        }

        return filtered_item;
      });

      self.showAdd = false;

      self.$emit("change", self.fieldProperty, fields_formats);
    },
    saveAttributes: function () {
      const self = this;

      for (let index = 0; index < self.fields.length; index++) {
        const field = self.fields[index];

        if (field.name === self.currentColumn.name) {
          self.fields[index] = JSON.parse(JSON.stringify(self.currentColumn));
          self.currentColumn = {};

          break;
        }
      }

      self.showColumnProperties = false;
    }
  }
};
</script>
