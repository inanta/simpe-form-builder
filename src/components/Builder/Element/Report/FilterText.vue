<template>
  <label class="block pb-1 pt-2">
    <div class="pb-1">{{ label }}</div>
    <input
      :name="name"
      :placeholder="placeholder"
      type="text"
      :value="value"
      class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
      @input.self="onInput"
    />
  </label>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";

export default {
  props: {
    field: {
      type: String,
      default: ""
    },
    filterCondition: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {};
  },
  mounted: function () {
    this.$emit("input", {
      target: {
        name: this.field + this.filterCondition,
        value: {
          field: this.field,
          condition: this.filterCondition,
          value: typeof this.value !== "undefined" ? this.value : ""
        }
      }
    });
  },
  methods: {
    onInput: function (event) {
      this.$emit("input", {
        target: {
          name: this.field + this.filterCondition,
          value: {
            field: this.field,
            condition: this.filterCondition,
            value: event.target.value
          }
        }
      });
    }
  }
};

fieldProperties["filter-text"] = {
  "filter-element": {
    label: "Type",
    name: "element"
  },
  label: {
    label: "Label"
  },
  "filter-condition": {
    label: "Condition"
  },
  placeholder: {
    label: "Placeholder"
  },
  value: {
    label: "Default Value"
  }
};

fieldPropertyOptions.addOption(
  "filter-element",
  [
    {
      name: "Text",
      value: "filter-text"
    },
    {
      name: "Date Range",
      value: "filter-date-range"
    },
    {
      name: "Drop Down",
      value: "filter-drop-down"
    }
  ],
  undefined,
  // TODO: This can be an issue, we need to do this 3 times in 3 different components
  ["filter-text", "filter-date-range", "filter-drop-down"],
  "filter-text"
);

fieldPropertyOptions.addOption(
  "filter-element",
  [
    { label: "Equals To", value: "=" },
    { label: "Greather Than", value: ">" },
    { label: "Less Than", value: "<" },
    { label: "Greather Than Or Equals To", value: ">=" },
    { label: "Less Than Or Equals To", value: "<=" },
    { label: "Contains", value: "contain" }
  ],
  undefined,
  // TODO: This can be an issue, we need to do this 3 times in 3 different components
  ["filter-text", "filter-drop-down"],
  "="
);
</script>
