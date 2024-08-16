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
      :for="internalProperties.name + '_' + item.value"
      ><input
        :id="internalProperties.name + '_' + item.value"
        :checked="
          typeof internalProperties.checked != 'undefined' &&
          typeof internalProperties.checked[itemIndex] !== 'undefined' &&
          internalProperties.checked[itemIndex].checked
        "
        :name="
          internalProperties.name +
          (internalProperties.type === 'checkbox' ? '[]' : '')
        "
        :value="item.value"
        :type="internalProperties.type"
        class="mr-2"
        @input="$emit('input', $event)"
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
    class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
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
      console.log("value changed");
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
    initializeValue: function () {},
    itemElement(element, item) {
      if (typeof item.element !== "undefined" && item.element !== "") {
        return item.element;
      }

      return element === "select" ? "option" : "";
    },
    onInputChecked: function ($event) {
      if ($event.target.checked) {
        this.$emit("input", {
          target: {
            name: this.properties.name,
            value: this.properties.value
          }
        });
      } else {
        this.$emit("input", {
          target: {
            name: this.properties.name,
            value: false
          }
        });
      }
    }
  }
};
</script>
