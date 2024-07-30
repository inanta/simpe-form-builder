<template>
  <div>
    <component
      :is="properties.element"
      v-if="['input', 'select', 'textarea'].includes(properties.element)"
      ref="fields"
      :value="value"
      v-bind="cleanAttributes(properties)"
      class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
      @input="onInput"
      @keyup.enter="onKeyUp"
    >
      <template v-if="properties.items">
        <component
          :is="item.element"
          v-for="item in cleanAttributeItems(properties.items)"
          :key="item.name"
          v-bind="item"
          >{{ item.label }}</component
        >
      </template>
    </component>
    <component
      :is="properties.element"
      v-else
      ref="fields"
      :builder="builder"
      :data="data"
      :value="value"
      v-bind="cleanAttributes(properties)"
      @input="onInput"
    >
      <template v-if="properties.content">{{ properties.content }}</template>
    </component>
  </div>
</template>

<script>
import Components from "@/components/Builder/Element/Report/index.js";
import FieldPropertyOptions from "@/assets/js/builder/FieldPropertyOptions.js";

export default {
  name: "Field",
  components: Components,
  props: {
    builder: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: function () {
        return {};
      }
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    },
    value: {
      type: [String, Number, Object],
      default: undefined
    }
  },
  emits: {
    input: null,
    keyup: null
  },
  data: function () {
    return {
      fieldPropertyOptions: FieldPropertyOptions
    };
  },
  computed: {
    fieldLabel: function () {
      if (
        typeof this.properties.label !== "undefined" &&
        this.properties.label !== ""
      ) {
        return this.properties.label;
      }

      return "";
    }
  },
  methods: {
    cleanAttributes(attributes) {
      const is_html_element = ["input", "select", "textarea", "h1", "p", "hr"];

      if (is_html_element.includes(attributes.element)) {
        let cleaned_attributes = {};

        for (const key in attributes) {
          // TODO Clean this later
          if (key === "type" && attributes.element !== "input") {
            continue;
          }

          if (typeof attributes[key] !== "object" && attributes[key] !== "") {
            cleaned_attributes[key] = attributes[key];
          }
        }

        return cleaned_attributes;
      }

      return attributes;
    },
    cleanAttributeItems(items) {
      if (Array.isArray(items)) {
        return items;
      } else if (
        typeof items.value !== "undefined" &&
        Array.isArray(items.value)
      ) {
        return items.value;
      }

      return [];
    },
    onInput: function (event) {
      if (event.target.name !== "") {
        this.$emit("input", event.target.name, event.target.value);
      }
    },
    onKeyUp: function (event) {
      this.$emit("keyup", event);
    }
  }
};
</script>
