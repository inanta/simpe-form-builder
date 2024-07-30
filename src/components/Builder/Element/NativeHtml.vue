<template>
  <div
    v-if="
      internalProperties.element === 'input' &&
      internalProperties.type === 'radio'
    "
    class="flex flex-col"
  >
    <label
      v-for="item in cleanAttributeItems(items)"
      :key="item.name"
      :for="internalProperties.name + '_' + item.value"
      ><input
        :id="internalProperties.name + '_' + item.value"
        :checked="item.value === value"
        :name="internalProperties.name"
        :value="item.value"
        class="mr-2"
        type="radio"
        @input="$emit('input', $event)"
      />{{ item.label }}</label
    >
  </div>
  <template
    v-else-if="
      internalProperties.element === 'input' &&
      internalProperties.type === 'checkbox'
    "
  >
    <label :for="internalProperties.name"
      ><input
        :id="internalProperties.name"
        v-bind="cleanAttributes(internalProperties)"
        class="mr-2"
        type="checkbox"
        @input="onInputChecked"
      />{{ internalProperties["checkbox-label"] }}</label
    >
  </template>
  <component
    :is="internalProperties.element"
    v-else
    :class="{
      'border-mid-gray dark:border-surface--dark-500': error,
      'border-negative dark:border-negative--dark': !error
    }"
    :value="value"
    v-bind="cleanAttributes(internalProperties)"
    class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
    @input="$emit('input', $event)"
    @keyup="$emit('keyup', $event)"
  >
    <template v-if="items">
      <component
        :is="item.element"
        v-for="item in cleanAttributeItems(items)"
        :key="item.name"
        :value="item.value"
        >{{ item.label }}</component
      >
    </template>
  </component>
</template>

<script>
import cleanAttributes from "@/assets/js/builder/cleanAttributes.js";

export default {
  inheritAttrs: false,
  props: {
    app: {
      type: Object,
      default: function () {
        return {};
      }
    },
    attributes: {
      type: Object,
      default: function () {
        return {};
      }
    },
    error: {
      type: Boolean,
      default: false
    },
    items: {
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
      return cleanAttributes(attributes);
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
    initializeValue: function () {
      if (
        this.internalProperties.element === "input" &&
        this.internalProperties.type === "checkbox"
      ) {
        if (this.internalProperties["checked-value"] === this.value) {
          this.internalProperties.checked = true;
        } else {
          this.internalProperties.checked = false;
        }
      }
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
