<template>
  <transition
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__fadeInDown animate__faster"
    leave-active-class="animate__animated animate__fadeOutUp animate__faster"
  >
    <div v-show="visible" class="py-1.5">
      <label
        v-if="fieldLabel !== ''"
        :for="properties.name"
        class="block truncate pb-1.5 text-base font-semibold text-black dark:text-on-surface--dark-100"
      >
        {{ fieldLabel }}
      </label>
      <native-html
        v-if="getHtmlElements(true).includes(properties.element)"
        ref="fields"
        :error="validateError === '' || !showInvalidMessage"
        :items="properties.items"
        :value="value"
        :properties="properties"
        @input="onInput"
        @keyup.enter="onKeyUp"
      >
      </native-html>
      <component
        :is="properties.element"
        v-else
        ref="fields"
        :app="app"
        :builder="builder"
        :data="data"
        :error="validateError === '' || !showInvalidMessage"
        :properties="properties"
        :value="value"
        v-bind="properties"
        @input="onInput"
      >
        <template v-if="properties.content">{{ properties.content }}</template>
      </component>
      <div
        v-if="validateError !== '' && showInvalidMessage"
        class="overflow-hidden text-negative dark:text-negative--dark"
      >
        <div class="animate__animated animate__fadeInDown">
          <span class="mdi mdi-alert"></span> {{ validateError }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Components from "@/components/Builder/Element/index.js";
import AddOnComponents from "@/components/Builder/Element/add-on.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions.js";
import validateField from "@/assets/js/builder/validateField.js";
import NativeHtml from "@/components/Builder/Element/NativeHtml.vue";

Components.NativeHtml = NativeHtml;

for (const key in AddOnComponents) {
  if (Object.hasOwnProperty.call(AddOnComponents, key)) {
    Components[key] = AddOnComponents[key];
  }
}

export default {
  components: Components,
  props: {
    app: {
      type: Object,
      default: function () {
        return {};
      }
    },
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
    error: {
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
    showInvalid: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Object],
      default: undefined
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    input: null,
    invalid: null,
    keyup: null,
    valid: null,
    visibilityChanged: null
  },
  data: function () {
    return {
      fieldPropertyOptions: fieldPropertyOptions,
      htmlElements: [
        { tag: "input", hasValidation: true },
        { tag: "select", hasValidation: true },
        { tag: "textarea", hasValidation: true },
        { tag: "h1", hasValidation: false },
        { tag: "p", hasValidation: false },
        { tag: "hr", hasValidation: false }
      ],
      showInvalidMessage: false,
      validateError: ""
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
  watch: {
    error: {
      handler: function (value) {
        if (typeof value[0] !== "undefined" && value[0] !== "") {
          this.validateError = value[0];
        }
      },
      immediate: true
    },
    showInvalid: {
      handler: function (value) {
        this.showInvalidMessage = value;
      },
      immediate: true
    },
    value: {
      handler: function (value) {
        this.validateValue(value, this.data);
      },
      immediate: true
    },
    visible: {
      handler: function (value) {
        if (typeof this.properties.name !== "undefined") {
          this.$emit("visibilityChanged", this.properties.name, value);
        }
      },
      immediate: false
    }
  },
  methods: {
    getHtmlElements: function (validation = null) {
      if (validation !== null) {
        return this.htmlElements
          .filter(function (item) {
            return item.hasValidation === validation;
          })
          .map(function (item) {
            return item.tag;
          });
      }

      return this.htmlElements.map(function (item) {
        return item.tag;
      });
    },
    onInput: function (event) {
      const self = this;

      if (event.target.name !== "") {
        self.validateError = validateField(
          self.properties.validation,
          event.target.value,
          self.data
        );

        if (self.validateError !== "") {
          self.showInvalidMessage = true;
          self.$emit("invalid", event.target.name);
        } else {
          self.$emit("valid", event.target.name);
        }

        self.$emit(
          "input",
          event.target.name,
          event.target.value,
          typeof event.target.isInitialValue !== "undefined"
            ? event.target.isInitialValue
            : false
        );
      }
    },
    onKeyUp: function (event) {
      this.$emit("keyup", event);
    },
    validateValue: function (value, data) {
      const self = this;

      if (typeof self.properties.name !== "undefined") {
        self.validateError = validateField(
          self.properties.validation,
          value,
          data
        );

        if (self.validateError !== "") {
          self.$emit("invalid", self.properties.name);
        } else {
          self.$emit("valid", self.properties.name);
        }
      }
    }
  }
};
</script>
