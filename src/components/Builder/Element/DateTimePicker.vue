<template>
  <div v-closable="hidePicker">
    <input
      ref="input"
      v-model="dateTimePickerValue"
      class="w-full rounded-sm border border-mid-gray bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
      type="text"
      :readonly="readonly"
      :disabled="readonly"
      @focus="onInputFocus"
    />
    <div
      v-show="isShown"
      ref="dropdown"
      class="animate__animated animate__fadeIn animate__faster z-10 overflow-hidden rounded border border-light-gray bg-white text-black shadow dark:border-none dark:bg-surface--dark-600 dark:text-on-surface--dark-600"
    >
      <div
        v-if="dateTimePickerDatePickerLabel !== ''"
        class="bg-primary p-2 text-center text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
      >
        {{ dateTimePickerDatePickerLabel }}
      </div>
      <div>
        <ns-calendar
          v-model="datePickerValue"
          :exclude-days="excludeDays"
          :first-day-of-week="firstDayOfWeek"
        ></ns-calendar>
      </div>
      <template v-if="dateTimePickerMode == 'date-time-picker'">
        <div
          :class="{ 'p-2': dateTimePickerTimePickerLabel !== '' }"
          class="border-t border-primary bg-primary text-center text-on-primary dark:border-primary--dark dark:bg-primary--dark"
        >
          {{ dateTimePickerTimePickerLabel }}
        </div>
        <div class="mx-auto w-max">
          <ns-time-picker
            v-model="timePickerValue"
            :max-hour="maxHour"
            :min-hour="minHour"
            :max-minute="maxMinute"
            :min-minute="minMinute"
            :minute-interval="minuteInterval"
            @minute-change="onMinuteChange"
          ></ns-time-picker>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";

import NsClosable from "@/directives/NsClosable.js";
import NsCalendar from "../../NS/NsCalendar.vue";
import NsTimePicker from "../../NS/NsTimePicker.vue";

import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions.js";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

export default {
  directives: {
    closable: NsClosable
  },
  components: {
    NsCalendar,
    NsTimePicker
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
    dateTimePickerTimePickerLabel: {
      type: String,
      default: "0"
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
    modelValue: {
      type: String,
      default: ""
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
  emits: ["input", "update:modelValue"],
  data: function () {
    return {
      datePickerValue: "",
      dateTimePickerValue: "",
      firstDayOfWeek: 1,
      isShown: false,
      timePickerValue: ""
    };
  },
  computed: {
    excludeDays: function () {
      const days = [];

      if (
        typeof this.dateTimePickerExcludeDays.value != "undefined" &&
        Array.isArray(this.dateTimePickerExcludeDays.value)
      ) {
        for (
          let index = 0;
          index < this.dateTimePickerExcludeDays.value.length;
          index++
        ) {
          const day = parseInt(
            this.dateTimePickerExcludeDays.value[index].value
          );

          if (!isNaN(day)) {
            days.push(day);
          }
        }
      }

      return days;
    },
    maxHour: function () {
      const parsed = parseInt(this.dateTimePickerMaxHour);

      return isNaN(parsed) ? 23 : parsed;
    },
    maxMinute: function () {
      const parsed = parseInt(this.dateTimePickerMaxMinute);

      return isNaN(parsed) ? 59 : parsed;
    },
    minHour: function () {
      const parsed = parseInt(this.dateTimePickerMinHour);

      return isNaN(parsed) ? 0 : parsed;
    },
    minMinute: function () {
      const parsed = parseInt(this.dateTimePickerMinMinute);

      return isNaN(parsed) ? 0 : parsed;
    },
    minuteInterval: function () {
      const parsed = parseInt(this.dateTimePickerMinuteInterval);

      return isNaN(parsed) ? 1 : parsed;
    }
  },
  watch: {
    datePickerValue: {
      handler: function () {
        this.setValue();

        if (this.dateTimePickerMode === "date-picker") {
          this.isShown = false;
        }
      },
      immediate: false
    },
    modelValue: {
      handler: function (value) {
        if (value !== "") {
          this.dateTimePickerValue = this.formatDateTime(value);
        }
      },
      immediate: true
    },
    timePickerValue: {
      handler: function () {
        this.setValue();
      },
      immediate: false
    },
    value: {
      handler: function (value) {
        this.dateTimePickerValue = this.formatDateTime(value);
      },
      immediate: false
    }
  },
  methods: {
    formatDateTime: function (unix_timestamp) {
      const timestamp = unix_timestamp * 1000;
      const date = new Date(timestamp);

      let date_time_string = "";

      date_time_string =
        date.getDate().toString().padStart(2, "0") +
        "/" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        date.getFullYear().toString();

      if (this.dateTimePickerMode == "date-time-picker") {
        date_time_string += " ";

        let hour = date.getHours();
        let minute = date.getMinutes();

        if (hour < this.minHour) {
          hour = this.minHour;
        } else if (hour > this.maxHour) {
          hour = this.maxHour;
        }

        if (minute < this.minMinute) {
          minute = this.minMinute;
        } else if (hour > this.maxMinute) {
          minute = this.maxMinute;
        }

        date_time_string +=
          hour.toString().padStart(2, "0") +
          ":" +
          minute.toString().padStart(2, "0");
      }

      return date_time_string;
    },
    hidePicker: function () {
      this.isShown = false;
    },
    setValue: function () {
      const timestamp = this.datePickerValue * 1000;

      const date = new Date(timestamp);
      const time = this.timePickerValue.split(":");

      if (timestamp !== 0) {
        this.dateTimePickerValue =
          date.getDate().toString().padStart(2, "0") +
          "/" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          date.getFullYear().toString();

        if (typeof time[0] !== "undefined" && time[0] !== "") {
          date.setHours(time[0]);

          this.dateTimePickerValue += " " + time[0].toString();
        }

        if (typeof time[1] !== "undefined" && time[1] !== "") {
          date.setMinutes(time[1]);

          this.dateTimePickerValue += ":" + time[1].toString();
        }
      }

      let value = date.getTime();

      if (this.dateTimePickerReturnValue != "microtimestamp") {
        value = value / 1000;
      }

      this.$emit("input", {
        target: {
          name: this.name,
          value: value.toString()
        }
      });

      this.$emit("update:modelValue", value.toString());
    },
    onInputFocus: function () {
      const self = this;

      self.isShown = true;
      self.isHourShown = true;

      self.$nextTick(function () {
        self.popperInstance = createPopper(
          self.$refs.input,
          self.$refs.dropdown,
          {
            placement: self.placement,
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 5]
                }
              },
              {
                name: "flip",
                options: {
                  fallbackPlacements: ["top-start"]
                }
              }
            ]
          }
        );

        self.popperInstance.update();
      });
    },
    onMinuteChange: function () {
      this.isShown = false;
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

<style scoped></style>
