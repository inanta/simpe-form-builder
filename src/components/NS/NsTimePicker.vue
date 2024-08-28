<template>
  <div ref="dropdown" class="flex overflow-hidden rounded">
    <div class="flex">
      <div class="text-center">
        <div class="text-2xl font-bold">
          <button type="button" @click="onHourUpButtonClick">
            <span class="mdi mdi-chevron-up"></span>
          </button>
        </div>
        <div>
          <select
            v-model="timeValue.hour"
            class="appearance-none rounded-sm border border-dark-gray px-1 py-0.5 text-lg outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
          >
            <option v-for="hour in hours" :key="hour">
              {{ hour }}
            </option>
          </select>
        </div>
        <div class="text-2xl font-bold">
          <button type="button" @click="onHourDownButtonClick">
            <span class="mdi mdi-chevron-down"></span>
          </button>
        </div>
      </div>
      <div>
        <div class="flex h-full items-center justify-center px-2 text-2xl">
          <div>:</div>
        </div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold">
          <button type="button" @click="onMinuteUpButtonClick">
            <span class="mdi mdi-chevron-up"></span>
          </button>
        </div>
        <div>
          <select
            v-model="timeValue.minute"
            class="border-dark-grey appearance-none rounded-sm border px-1 py-0.5 text-lg outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
            @change="$emit('minute-change')"
          >
            <option v-for="minute in minutes" :key="minute">
              {{ minute }}
            </option>
          </select>
        </div>
        <div class="text-2xl font-bold">
          <button type="button" @click="onMinuteDownButtonClick">
            <span class="mdi mdi-chevron-down"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    format: {
      type: String,
      default: "HH:mm"
    },
    hourPickerLabel: {
      type: String,
      default: "Hour"
    },
    maxHour: {
      type: String,
      default: "23"
    },
    maxMinute: {
      type: String,
      default: "59"
    },
    minHour: {
      type: String,
      default: "0"
    },
    minMinute: {
      type: String,
      default: "0"
    },
    minuteInterval: {
      type: String,
      default: "1"
    },
    minutePickerLabel: {
      type: String,
      default: "Minute"
    },
    modelValue: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["change", "hour-change", "minute-change", "update:modelValue"],
  data: function () {
    return {
      cancelClose: false,
      hourFormat: "",
      minuteFormat: "",
      timeValue: {
        hour: "",
        minute: ""
      }
    };
  },
  computed: {
    hours: function () {
      let hours = [];

      let start_hour = 0;
      let end_hour = this.is24HourFormat ? 23 : 12;

      if (this.validatedMinHour > 0) {
        start_hour = this.validatedMinHour;
      }

      if (this.validatedMaxHour < 23) {
        end_hour = this.validatedMaxHour;
      }

      for (let hour = start_hour; hour <= end_hour; hour++) {
        hours.push(
          this.hourFormat == "HH" || this.hourFormat == "hh"
            ? hour.toString().padStart(2, "0")
            : hour.toString()
        );
      }

      return hours;
    },
    is24HourFormat: function () {
      return this.hourFormat == "HH" || this.hourFormat == "hh";
    },
    minutes: function () {
      let minutes = [];

      let start_minute = 0;
      let end_minute = 59;

      if (this.validatedMinMinute > 0) {
        start_minute = this.validatedMinMinute;
      }

      if (this.validatedMaxMinute < 59) {
        end_minute = this.validatedMaxMinute;
      }

      for (
        let minute = start_minute;
        minute <= end_minute;
        minute += this.validatedMinuteInterval
      ) {
        minutes.push(
          this.minuteFormat == "MM" || this.minuteFormat == "mm"
            ? minute.toString().padStart(2, "0")
            : minute.toString()
        );
      }

      return minutes;
    },
    validatedMaxHour: function () {
      const parsed = parseInt(this.maxHour);

      return isNaN(parsed) ? 23 : parsed;
    },
    validatedMaxMinute: function () {
      const parsed = parseInt(this.maxMinute);

      return isNaN(parsed) ? 59 : parsed;
    },
    validatedMinHour: function () {
      const parsed = parseInt(this.minHour);

      return isNaN(parsed) ? 0 : parsed;
    },
    validatedMinMinute: function () {
      const parsed = parseInt(this.minMinute);

      return isNaN(parsed) ? 0 : parsed;
    },
    validatedMinuteInterval: function () {
      const parsed = parseInt(this.minuteInterval);

      return isNaN(parsed) ? 1 : parsed;
    }
  },
  watch: {
    format: {
      handler: function (value) {
        let format = value.split(":");

        this.hourFormat = format[0];
        this.minuteFormat = format[1];
      },
      immediate: true
    },
    hours: {
      handler: function (value) {
        this.timeValue.hour = value[0];
      },
      immediate: true
    },
    minutes: {
      handler: function (value) {
        this.timeValue.minute = value[0];
      },
      immediate: true
    },
    modelValue: {
      handler: function (value) {
        this.setValue(value);
      },
      immediate: true
    },
    timeValue: {
      handler: function (value) {
        this.$emit("change", value.hour + ":" + value.minute);
        this.$emit("update:modelValue", value.hour + ":" + value.minute);
      },
      deep: true
    },
    value: {
      handler: function (value) {
        this.setValue(value);
      },
      immediate: true
    }
  },
  methods: {
    onHourDownButtonClick: function () {
      let to_index = this.hours.indexOf(this.timeValue.hour) - 1;
      let selected_hour = this.hours[0];

      if (to_index > 0) {
        selected_hour = this.hours[to_index];
      }

      this.timeValue.hour =
        this.hourFormat == "HH" || this.hourFormat == "hh"
          ? selected_hour.toString().padStart(2, "0")
          : selected_hour.toString();
    },
    onHourUpButtonClick: function () {
      let max_index = this.hours.length - 1;
      let to_index = this.hours.indexOf(this.timeValue.hour) + 1;
      let selected_hour = this.hours[max_index];

      if (to_index <= max_index) {
        selected_hour = this.hours[to_index];
      }

      this.timeValue.hour =
        this.hourFormat == "HH" || this.hourFormat == "hh"
          ? selected_hour.toString().padStart(2, "0")
          : selected_hour.toString();
    },
    onMinuteDownButtonClick: function () {
      let to_index = this.minutes.indexOf(this.timeValue.minute) - 1;
      let selected_minute = this.minutes[0];

      if (to_index > 0) {
        selected_minute = this.minutes[to_index];
      }

      this.timeValue.minute =
        this.minuteFormat == "MM" || this.minuteFormat == "mm"
          ? selected_minute.toString().padStart(2, "0")
          : selected_minute.toString();
    },
    onMinuteUpButtonClick: function () {
      let max_index = this.minutes.length - 1;
      let to_index = this.minutes.indexOf(this.timeValue.minute) + 1;
      let selected_minute = this.minutes[max_index];

      if (to_index <= max_index) {
        selected_minute = this.minutes[to_index];
      }

      this.timeValue.minute =
        this.minuteFormat == "MM" || this.minuteFormat == "mm"
          ? selected_minute.toString().padStart(2, "0")
          : selected_minute.toString();

      this.$emit("minute-change");
    },
    setValue: function (value) {
      if (value !== "") {
        const time = value.split(":");

        if (this.timeValue.hour != time[0]) {
          this.timeValue.hour = time[0];
        }

        if (this.timeValue.minute != time[1]) {
          this.timeValue.minute = time[1];
        }
      }
    }
  }
};
</script>
