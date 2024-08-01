<template>
  <div class="flex">
    <div class="flex-grow pr-1">
      <label class="block pb-1 pt-2">
        <div class="pb-1">{{ dateStartLabel }}</div>

        <input
          ref="date-start"
          :placeholder="dateStartPlaceholder"
          :value="dateStartValue"
          type="date"
          class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
          @input.self="onInput"
        />
      </label>
    </div>
    <div class="flex-grow pl-1">
      <label class="block pb-1 pt-2">
        <div class="pb-1">{{ dateEndLabel }}</div>

        <input
          ref="date-end"
          :placeholder="dateEndPlaceholder"
          :value="dateEndValue"
          type="date"
          class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
          @input.self="onInput"
        />
      </label>
    </div>
  </div>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";

export default {
  props: {
    field: {
      type: String,
      default: ""
    },
    dateEndLabel: {
      type: String,
      default: ""
    },
    dateStartLabel: {
      type: String,
      default: ""
    },
    dateEndPlaceholder: {
      type: String,
      default: ""
    },
    dateStartPlaceholder: {
      type: String,
      default: ""
    },
    dateEndValue: {
      type: String,
      default: ""
    },
    dateStartValue: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {};
  },
  methods: {
    onInput: function () {
      let time_start = Date.parse(this.$refs["date-start"].value);
      let time_end = Date.parse(this.$refs["date-end"].value);

      const dt_start = new Date(time_start);
      const dt_end = new Date(time_end);

      dt_start.setUTCHours(0, 0, 0, 0);
      dt_end.setUTCHours(23, 59, 59, 999);

      time_start = dt_start.getTime();
      time_end = dt_end.getTime();

      this.$emit("input", {
        target: {
          name: this.field + ">&&<",
          value: {
            conditions: [
              {
                field: this.field,
                condition: ">=",
                value: isNaN(time_start) ? 0 : time_start
              },
              {
                field: this.field,
                condition: "<=",
                value: isNaN(time_end) ? 0 : time_end
              }
            ],
            operator: "and"
          }
        }
      });
    }
  }
};

fieldProperties["filter-date-range"] = {
  "filter-element": {
    label: "Type",
    name: "element"
  },
  "date-start-label": {
    label: "Start Label"
  },
  "date-end-label": {
    label: "End Label"
  },
  "date-start-placeholder": {
    label: "Start Placeholder"
  },
  "date-end-placeholder": {
    label: "End Placeholder"
  },
  "date-start-value": {
    label: "Start Value"
  },
  "date-end-value": {
    label: "End Value"
  }
};
</script>
