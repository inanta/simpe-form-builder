<template>
  <ns-date-time-picker
    v-model="dateTimePickerValue"
    :date-picker-label="dateTimePickerDatePickerLabel"
    :exclude-days="dateTimePickerExcludeDays"
    :locale="dateTimePickerLocale"
    :max-hour="dateTimePickerMaxHour"
    :max-minute="dateTimePickerMaxMinute"
    :min-hour="dateTimePickerMinHour"
    :min-minute="dateTimePickerMinMinute"
    :minute-interval="dateTimePickerMinuteInterval"
    :mode="dateTimePickerMode"
    :return-value="dateTimePickerReturnValue"
    :time-picker-label="dateTimePickerTimePickerLabel"
    :placement="placement"
    :readonly="readonly"
    :value="value"
    class="w-full rounded-sm border border-mid-gray bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
  ></ns-date-time-picker>
</template>

<script>
import NsDateTimePicker from "@/components/NS/NsDateTimePicker.vue";

import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions.js";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

export default {
  components: {
    NsDateTimePicker
  },
  props: {
    builder: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: function () {
        return {};
      }
    },
    dateTimePickerDatePickerLabel: {
      type: String,
      default: ""
    },
    dateTimePickerExcludeDays: {
      type: Object,
      default: function () {
        return {};
      }
    },
    dateTimePickerLocale: {
      type: String,
      default: ""
    },
    dateTimePickerTimePickerLabel: {
      type: String,
      default: ""
    },
    dateTimePickerMaxHour: {
      type: String,
      default: ""
    },
    dateTimePickerMaxMinute: {
      type: String,
      default: ""
    },
    dateTimePickerMinHour: {
      type: String,
      default: ""
    },
    dateTimePickerMinMinute: {
      type: String,
      default: ""
    },
    dateTimePickerMinuteInterval: {
      type: String,
      default: ""
    },
    dateTimePickerMode: {
      type: String,
      default: "date-time-picker"
    },
    dateTimePickerReturnValue: {
      type: String,
      default: "timestamp"
    },
    name: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {
      dateTimePickerValue: ""
    };
  },
  watch: {
    dateTimePickerValue: {
      handler: function (value) {
        this.$emit("input", {
          target: {
            name: this.name,
            value: value.toString()
          }
        });
      }
    },
    value: {
      handler: function (value) {
        this.dateTimePickerValue = value;
      },
      immediate: false
    }
  }
};

elementPanelList.addElement(
  "general",
  "Date Time Picker",
  "Date Time Picker",
  "date-time-picker",
  "mdi mdi-calendar"
);

fieldProperties["date-time-picker"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "date-time-picker-date-picker-label": {
    label: "Date Picker Label"
  },
  "date-time-picker-exclude-days": {
    label: "Exclude Days"
  },
  "date-time-picker-mode": {
    label: "Mode"
  },
  "date-time-picker-time-picker-label": {
    label: "Time Picker Label"
  },
  "date-time-picker-max-hour": {
    label: "Max Hour"
  },
  "date-time-picker-max-minute": {
    label: "Max Minute"
  },
  "date-time-picker-min-hour": {
    label: "Min Hour"
  },
  "date-time-picker-min-minute": {
    label: "Min Minute"
  },
  "date-time-picker-minute-interval": {
    label: "Minute Interval"
  },
  readonly: {
    label: "Is Read Only"
  },
  validation: {
    label: "Validation"
  }
};

fieldPropertyOptions.addOption(
  "date-time-picker-exclude-days",
  "FieldPropertyValueCollection"
);

fieldPropertyOptions.addOption("date-time-picker-mode", [
  {
    name: "Date Time Picker",
    value: "date-time-picker"
  },
  {
    name: "Date Picker Only",
    value: "date-picker"
  }
]);
</script>
