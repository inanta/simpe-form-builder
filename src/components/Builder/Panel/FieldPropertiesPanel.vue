<template>
  <transition
    name="show-field-properties-transition"
    enter-active-class="animate__animated animate__slideInRight animate__faster"
    leave-active-class="animate__animated animate__slideOutRight animate__faster"
  >
    <div v-if="!isHidden" class="mb-2">
      <div
        class="rounded-t bg-primary p-1.5 font-bold text-on-primary dark:bg-primary--dark"
      >
        <button @click="$emit('toggle')">
          <span class="mdi mdi-arrow-expand-horizontal"></span>
        </button>
        Properties
        <button class="float-right" @click="$emit('close')">
          <span class="mdi mdi-close p-1"></span>
        </button>
      </div>
      <div
        ref="container"
        class="relative overflow-hidden border border-primary py-0.5 text-sm dark:border-surface--dark-300 dark:bg-surface--dark-300 dark:text-white"
      >
        <div class="grid grid-cols-2">
          <div class="truncate px-1 py-0.5">Type</div>
          <div class="px-1 py-1.5">
            {{ elementName }}
          </div>
        </div>
        <template
          v-for="(fieldPropertyValue, fieldProperty) in fieldProperties[
            fieldType
          ]"
          :key="fieldProperty"
        >
          <div
            v-if="
              isPropertyAvailable(fieldProperties[fieldType][fieldProperty])
            "
            class="grid grid-cols-2"
          >
            <div class="truncate px-1 py-0.5">
              {{ fieldProperties[fieldType][fieldProperty]["label"] }}
            </div>
            <div class="px-1 py-0.5">
              <!-- Field Option As Dropdown -->
              <select
                v-if="
                  typeof fieldPropertyOptions[fieldProperty] !== 'undefined' &&
                  typeof fieldPropertyOptions[fieldProperty].options !==
                    'undefined' &&
                  Array.isArray(fieldPropertyOptions[fieldProperty].options)
                "
                class="w-full rounded-sm border border-primary bg-white px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
                @input="setPropertyValue(fieldProperty, $event.target.value)"
              >
                <!-- TODO Change .name to .label -->
                <option
                  v-for="option in fieldPropertyOptions[fieldProperty].options"
                  :key="
                    typeof option.label !== 'undefined'
                      ? option.label
                      : option.name
                  "
                  :selected="getPropertyValue(fieldProperty) == option.value"
                  :value="option.value"
                >
                  {{
                    typeof option.label !== "undefined"
                      ? option.label
                      : option.name
                  }}
                </option>
              </select>
              <!-- Field Option As Custom Vue Component -->
              <template
                v-else-if="
                  typeof fieldPropertyOptions[fieldProperty] !== 'undefined' &&
                  typeof fieldPropertyOptions[fieldProperty].options !==
                    'undefined'
                "
              >
                <component
                  :is="fieldPropertyOptions[fieldProperty].options"
                  :columns="columns"
                  :configuration="
                    fieldPropertyOptions[fieldProperty].configuration
                  "
                  :containers="containers"
                  :field-property="fieldProperty"
                  :properties="properties"
                  :table="table"
                  @change="setPropertyValue"
                  @change-size="onChangeSize"
                ></component>
              </template>
              <!-- Field Option As Text Area -->
              <textarea
                v-else-if="
                  typeof fieldProperties[fieldType][fieldProperty]['type'] !==
                    'undefined' &&
                  fieldProperties[fieldType][fieldProperty]['type'] ===
                    'textarea'
                "
                :placeholder="
                  typeof fieldProperties[fieldType][fieldProperty][
                    'placeholder'
                  ] !== 'undefined'
                    ? fieldProperties[fieldType][fieldProperty]['placeholder']
                    : ''
                "
                :value="getPropertyValue(fieldProperty, 'string', '')"
                class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
                rows="4"
                @input="setPropertyValue(fieldProperty, $event.target.value)"
              ></textarea>
              <!-- Field Option As Text -->
              <input
                v-else
                :placeholder="
                  typeof fieldProperties[fieldType][fieldProperty][
                    'placeholder'
                  ] !== 'undefined'
                    ? fieldProperties[fieldType][fieldProperty]['placeholder']
                    : ''
                "
                :value="getPropertyValue(fieldProperty, 'string', '')"
                class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
                type="text"
                @input="setPropertyValue(fieldProperty, $event.target.value)"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import Components from "@/components/Builder/FieldProperty/index.js";
import AddOnComponents from "@/components/Builder/FieldProperty/add-on.js";

import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions.js";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

for (const key in AddOnComponents) {
  if (Object.hasOwnProperty.call(AddOnComponents, key)) {
    Components[key] = AddOnComponents[key];
  }
}

export default {
  name: "FieldPropertiesPanel",
  components: Components,
  props: {
    containers: {
      type: Object,
      default: function () {
        return {};
      }
    },
    columns: {
      type: Array,
      default: function () {
        return [];
      }
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
    change: null,
    close: null,
    toggle: null
  },
  data: function () {
    return {
      fieldProperties: fieldProperties,
      fieldPropertyOptions: fieldPropertyOptions,
      currentFieldProperties: {}
    };
  },
  computed: {
    isHidden: function () {
      return typeof this.properties.element === "undefined" ? true : false;
    },
    fieldType: function () {
      return typeof this.fieldProperties[
        this.currentFieldProperties.element
      ] === "undefined"
        ? "p"
        : this.currentFieldProperties.element;
    },
    elementName: function () {
      const element = elementPanelList.getElement(this.properties.element);

      if (element) {
        return element.name;
      }

      return "";
    }
  },
  watch: {
    properties: {
      handler: function (value) {
        // this.fieldPropertyOptions.addOption(
        //   "name",
        //   "FieldPropertyColumnSelector"
        // );

        // if (
        //   ["input", "select", "textarea", "drop-down-list"].includes(
        //     value.element
        //   )
        // ) {
        //   this.fieldPropertyOptions.addOption(
        //     "name",
        //     "FieldPropertyColumnSelector"
        //   );
        // } else {
        //   this.fieldPropertyOptions.removeOption("name");
        // }

        this.currentFieldProperties = value;
      },
      immediate: true
    }
  },
  methods: {
    isPropertyAvailable: function (property) {
      const self = this;

      if (!Array.isArray(property.rules)) {
        return true;
      }

      for (let index = 0; index < property.rules.length; index++) {
        const rule = property.rules[index];

        if (!rule.values.includes(self.properties[rule.property])) {
          return false;
        }
      }

      return true;
    },
    getPropertyValue: function (property, type, mismatch_type_default_value) {
      if (
        typeof this.fieldProperties[this.currentFieldProperties.element][
          property
        ].name !== "undefined"
      ) {
        property =
          this.fieldProperties[this.currentFieldProperties.element][property]
            .name;
      }

      if (typeof this.properties[property] !== "undefined") {
        if (
          typeof this.properties[property] === type ||
          typeof type === "undefined"
        ) {
          return this.properties[property];
        } else if (
          typeof this.properties[property] !== type &&
          typeof mismatch_type_default_value !== "undefined"
        ) {
          return mismatch_type_default_value;
        }
      }

      if (
        typeof this.fieldPropertyOptions[property] !== "undefined" &&
        typeof this.fieldPropertyOptions[property].default !== "undefined"
      ) {
        return this.fieldPropertyOptions[property].default;
      }

      return "";
    },
    setPropertyValue: function (property, value) {
      if (
        typeof this.fieldProperties[this.currentFieldProperties.element][
          property
        ].name !== "undefined"
      ) {
        property =
          this.fieldProperties[this.currentFieldProperties.element][property]
            .name;
      }

      if (value === "true" || value === "false") {
        if (value === "true") {
          value = true;
        } else {
          value = false;
        }
      }

      this.$emit("change", property, value);
    },
    onChangeSize: function (size) {
      this.$refs.container.style.height =
        size.height !== "auto" ? size.height + "px" : size.height;
    }
  }
};
</script>
