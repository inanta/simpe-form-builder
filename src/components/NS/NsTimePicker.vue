<template>
  <div ref="dropdown" class="flex overflow-hidden rounded">
    <div class="flex">
      <div class="text-center">
        <div class="text-2xl font-bold">
          <button @click="onHourUpButtonClick">
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
          <button @click="onHourDownButtonClick">
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
          <button @click="onMinuteUpButtonClick">
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
          <button @click="onMinuteDownButtonClick">
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
      type: Number,
      default: 23
    },
    maxMinute: {
      type: Number,
      default: 59
    },
    minHour: {
      type: Number,
      default: 0
    },
    minMinute: {
      type: Number,
      default: 0
    },
    minuteInterval: {
      type: Number,
      default: 1
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
      default: "00:00"
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

      if (this.minHour > 0) {
        start_hour = this.minHour;
      }

      if (this.maxHour < 23) {
        end_hour = this.maxHour;
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

      if (this.minMinute > 0) {
        start_minute = this.minMinute;
      }

      if (this.maxMinute < 59) {
        end_minute = this.maxMinute;
      }

      for (
        let minute = start_minute;
        minute <= end_minute;
        minute += this.minuteInterval
      ) {
        minutes.push(
          this.minuteFormat == "MM" || this.minuteFormat == "mm"
            ? minute.toString().padStart(2, "0")
            : minute.toString()
        );
      }

      return minutes;
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
        if (value !== "") {
          const time = value.split(":");

          this.timeValue.hour = time[0];
          this.timeValue.minute = time[1];
        }
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
        if (value !== "") {
          const time = value.split(":");

          this.timeValue.hour = time[0];
          this.timeValue.minute = time[1];
        }
      }
    }
  },
  methods: {
    onHourDownButtonClick: function () {
      let selected_hour = parseInt(this.timeValue.hour) - 1;

      if (isNaN(selected_hour) || selected_hour < 0) {
        selected_hour = 0;
      }

      this.timeValue.hour =
        this.hourFormat == "HH" || this.hourFormat == "hh"
          ? selected_hour.toString().padStart(2, "0")
          : selected_hour.toString();
    },
    onHourUpButtonClick: function () {
      let selected_hour = parseInt(this.timeValue.hour) + 1;
      let max_hour = this.hourFormat == "H" || this.hourFormat == "h" ? 12 : 23;

      if (isNaN(selected_hour) || selected_hour > max_hour) {
        selected_hour = max_hour;
      }

      this.timeValue.hour =
        this.hourFormat == "HH" || this.hourFormat == "hh"
          ? selected_hour.toString().padStart(2, "0")
          : selected_hour.toString();
    },
    onMinuteDownButtonClick: function () {
      let selected_minute = parseInt(this.timeValue.minute) - 1;

      if (isNaN(selected_minute) || selected_minute < 0) {
        selected_minute = 0;
      }

      this.timeValue.minute =
        this.minuteFormat == "MM" || this.minuteFormat == "mm"
          ? selected_minute.toString().padStart(2, "0")
          : selected_minute.toString();
    },
    onMinuteUpButtonClick: function () {
      let selected_minute = parseInt(this.timeValue.minute) + 1;

      if (isNaN(selected_minute) || selected_minute > 59) {
        selected_minute = 59;
      }

      this.timeValue.minute =
        this.minuteFormat == "MM" || this.minuteFormat == "mm"
          ? selected_minute.toString().padStart(2, "0")
          : selected_minute.toString();

      this.$emit("minute-change");
    }
  }
};
</script>

<style scoped></style>
