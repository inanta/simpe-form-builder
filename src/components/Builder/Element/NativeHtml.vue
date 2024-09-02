<template>
  <div
    v-if="
      internalProperties.element === 'input' &&
      (internalProperties.type === 'radio' ||
        internalProperties.type === 'checkbox')
    "
    class="flex flex-col"
  >
    <label
      v-for="(item, itemIndex) in cleanAttributeItems(properties.items)"
      :key="item.name"
    >
      <input
        :checked="
          (internalProperties.type === 'checkbox' &&
            typeof internalProperties.checked != 'undefined' &&
            typeof internalProperties.checked[itemIndex] !== 'undefined' &&
            internalProperties.checked[itemIndex].checked) ||
          (internalProperties.type === 'radio' && item.value === value)
        "
        :name="
          internalProperties.name +
          (internalProperties.type === 'checkbox' ? '[]' : '')
        "
        :value="item.value"
        :type="internalProperties.type"
        class="mr-2"
        @change="onInputChecked($event, itemIndex)"
      />{{ item.label }}
    </label>
  </div>
  <component
    :is="internalProperties.element"
    v-else-if="
      internalProperties.element === 'input' ||
      internalProperties.element === 'select' ||
      internalProperties.element == 'textarea'
    "
    :class="{
      'border-mid-gray dark:border-surface--dark-500': !error,
      'border-negative dark:border-negative--dark': error
    }"
    :name="internalProperties.name"
    :value="value"
    v-bind="cleanAttributes(internalProperties)"
    @input="$emit('input', $event)"
    @keyup="$emit('keyup', $event)"
  >
    <template v-if="properties.items">
      <component
        :is="itemElement(internalProperties.element, item)"
        v-for="item in cleanAttributeItems(properties.items)"
        :key="item.name"
        :value="item.value"
        >{{ item.label }}</component
      >
    </template>
  </component>
  <component
    :is="internalProperties.element"
    v-else-if="
      properties.items || (properties.content && properties.content !== '')
    "
    v-bind="cleanAttributes(internalProperties)"
    :style="internalProperties.style"
  >
    <template v-if="properties.items">
      <component
        :is="itemElement(internalProperties.element, item)"
        v-for="item in cleanAttributeItems(properties.items)"
        :key="item.name"
        :value="item.value"
        >{{ item.label }}</component
      >
    </template>
    <template v-else-if="properties.content">
      {{ properties.content }}
    </template>
  </component>
  <component
    :is="internalProperties.element"
    v-else
    v-bind="cleanAttributes(internalProperties)"
    :style="internalProperties.style"
  />
</template>

<script>
import cleanAttributes from "@/assets/js/builder/cleanAttributes.js";

export default {
  inheritAttrs: false,
  props: {
    error: {
      type: Boolean,
      default: false
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["input", "keyup"],
  data: function () {
    return {
      internalProperties: {}
    };
  },
  watch: {
    properties: {
      handler: function (value) {
        this.internalProperties = value;
      },
      immediate: true
    },
    value: function () {
      this.initializeValue();
    }
  },
  mounted: function () {
    this.initializeValue();
  },
  methods: {
    cleanAttributes(attributes) {
      const cleaned_attributes = cleanAttributes(attributes, [
        "disabled",
        "max",
        "min",
        "multiple",
        "placeholder",
        "readonly",
        "rows",
        "size",
        "step",
        "type"
      ]);

      if (typeof attributes.validation !== "undefined") {
        for (let index = 0; index < attributes.validation.length; index++) {
          const validation = attributes.validation[index];

          if (validation.type === "required") {
            cleaned_attributes.required = true;
          } else if (validation.type === "regex") {
            cleaned_attributes.pattern = validation.pattern;
            cleaned_attributes.title = validation.message;
          }
        }
      }

      for (const key in this.$attrs) {
        if (Object.prototype.hasOwnProperty.call(this.$attrs, key)) {
          const attribute = this.$attrs[key];

          cleaned_attributes[key] = attribute;
        }
      }

      console.log(cleaned_attributes);

      return cleaned_attributes;
    },
    cleanAttributeItems(items) {
      if (typeof items !== "undefined") {
        if (Array.isArray(items)) {
          return items;
        } else if (
          typeof items.value !== "undefined" &&
          Array.isArray(items.value)
        ) {
          return items.value;
        }
      }

      return [];
    },
    initializeValue: function () {
      if (
        this.internalProperties.element === "input" &&
        this.internalProperties.type === "checkbox"
      ) {
        const items =
          typeof this.properties.items.value !== "undefined"
            ? this.properties.items.value
            : this.properties.items;

        if (typeof this.internalProperties.checked === "undefined") {
          this.internalProperties.checked = [];

          for (let index = 0; index < items.length; index++) {
            const item = items[index];

            this.internalProperties.checked[index] = {};
            this.internalProperties.checked[index].value = item.value;
            this.internalProperties.checked[index].checked = false;
          }
        }
      } else if (
        (this.internalProperties.element === "input" &&
          this.internalProperties.type === "radio") ||
        this.internalProperties.element === "select"
      ) {
        if (this.value == "") {
          const items =
            typeof this.properties.items.value !== "undefined"
              ? this.properties.items.value
              : this.properties.items;

          this.$emit("input", {
            target: {
              name: this.properties.name,
              value: items[0].value,
              isInitialValue: true
            }
          });
        }
      }
    },
    itemElement(element, item) {
      if (typeof item.element !== "undefined" && item.element !== "") {
        return item.element;
      }

      return element === "select" ? "option" : "";
    },
    onInputChecked: function ($event, item_index) {
      if (this.internalProperties.type === "checkbox") {
        const values = [];

        this.internalProperties.checked[item_index].checked = $event.target
          .checked
          ? true
          : false;

        const items =
          typeof this.properties.items.value !== "undefined"
            ? this.properties.items.value
            : this.properties.items;

        for (let index = 0; index < items.length; index++) {
          if (this.internalProperties.checked[index].checked) {
            values.push(this.internalProperties.checked[index].value);
          }
        }

        this.$emit("input", {
          target: {
            name: this.properties.name,
            value: values
          }
        });
      } else if (this.internalProperties.type === "radio") {
        this.$emit("input", {
          target: {
            name: this.properties.name,
            value: $event.target.value
          }
        });
      }
    }
  }
};
</script>
