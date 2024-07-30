<template>
  <div
    class="animate__animateds animate__zoomIn animate__faster relative p-0.5"
  >
    <div class="p-1" :class="{}">
      <label v-if="getPropertyValue('element') == 'textarea'">
        <div class="pb-1">{{ fieldLabel }}</div>
        <textarea
          :placeholder="getPropertyValue('placeholder')"
          :rows="getPropertyValue('rows')"
          class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
        ></textarea>
      </label>
      <!-- Dropdown Field -->
      <label v-else-if="getPropertyValue('element') == 'select'">
        <div class="pb-1">{{ fieldLabel }}</div>
        <select
          :multiple="getPropertyValue('multiple')"
          :size="getPropertyValue('size')"
          class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
        >
          <option
            v-for="(item, index) in getPropertyValue('items').value"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </label>
      <!-- Input (Text Box, Password, Check Box, Radio Button) Field -->
      <label v-else-if="getPropertyValue('element') == 'input'">
        <div class="pb-1">{{ fieldLabel }}</div>
        <input
          v-bind="getPropertiesValue()"
          class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
        />
      </label>
      <!-- Other Type Field -->
      <div v-else>
        <component
          v-bind="getPropertiesValue()"
          :is="getPropertyValue('element')"
          :xcontenteditable="getPropertyValue('contenteditable')"
        >
          {{ getPropertyValue("content") }}
        </component>
      </div>
    </div>
  </div>
</template>

<script>
import Components from "@/components/Builder/Element/index.js";
import AddOnComponents from "@/components/Builder/Element/add-on.js";
import NativeHtml from "@/components/Builder/Element/NativeHtml.vue";

Components.NativeHtml = NativeHtml;

for (const key in AddOnComponents) {
  if (Object.hasOwnProperty.call(AddOnComponents, key)) {
    Components[key] = AddOnComponents[key];
  }
}

export default {
  name: "Field",
  components: Components,
  props: {
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {},
  data: function () {
    return {};
  },
  computed: {
    fieldLabel: function () {
      return this.properties.label;
    }
  },
  methods: {
    getPropertyValue: function (property) {
      if (typeof this.properties[property] !== "undefined") {
        return this.properties[property];
      }

      // if (
      //   typeof this.fieldPropertyOptions[property] !== "undefined" &&
      //   typeof this.fieldPropertyOptions[property].default !== "undefined"
      // ) {
      //   return this.fieldPropertyOptions[property].default;
      // }

      return false;
    },
    getPropertiesValue: function () {
      return this.properties;
    }
  }
};
</script>
