<template>
  <div v-closable="hidePicker" :ns-date-time-picker="dateTimePickerID">
    <input
      ref="input"
      v-model="dateTimePickerValue"
      type="text"
      v-bind="$attrs"
      :readonly="readonly"
      :disabled="readonly"
      @focus="onInputFocus"
    />
    <Teleport to="body">
      <div
        v-show="isShown"
        ref="dropdown"
        class="animate__animated animate__fadeIn animate__faster z-20 overflow-hidden rounded border border-light-gray bg-white text-black shadow dark:border-none dark:bg-surface--dark-600 dark:text-on-surface--dark-600"
        :ns-date-time-picker="dateTimePickerID"
      >
        <div
          v-if="datePickerLabel !== ''"
          class="bg-primary p-2 text-center text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
        >
          {{ datePickerLabel }}
        </div>
        <div>
          <ns-calendar
            v-model="datePickerValue"
            :exclude-days="excludedDays"
            :first-day-of-week="firstDayOfWeek"
          ></ns-calendar>
        </div>
        <template v-if="mode == 'date-time-picker'">
          <div
            :class="{ 'p-2': timePickerLabel !== '' }"
            class="border-t border-primary bg-primary text-center text-on-primary dark:border-primary--dark dark:bg-primary--dark"
          >
            {{ timePickerLabel }}
          </div>
          <div class="mx-auto w-max">
            <ns-time-picker
              v-model="timePickerValue"
              :max-hour="maxHour"
              :min-hour="minHour"
              :max-minute="maxMinute"
              :min-minute="minMinute"
              :minute-interval="minuteInterval"
            ></ns-time-picker>
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";

import NsClosable from "@/directives/NsClosable.js";
import NsCalendar from "@/components/NS/NsCalendar.vue";
import NsTimePicker from "@/components/NS/NsTimePicker.vue";

export default {
  directives: {
    closable: NsClosable
  },
  components: {
    NsCalendar,
    NsTimePicker
  },
  inheritAttrs: false,
  props: {
    datePickerLabel: {
      type: String,
      default: ""
    },
    excludeDays: {
      type: Object,
      default: function () {
        return {};
      }
    },
    locale: {
      type: String,
      default: ""
    },
    maxHour: {
      type: String,
      default: ""
    },
    maxMinute: {
      type: String,
      default: ""
    },
    minHour: {
      type: String,
      default: ""
    },
    minMinute: {
      type: String,
      default: ""
    },
    minuteInterval: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: "date-time-picker"
    },
    modelValue: {
      type: String,
      default: ""
    },
    returnValue: {
      type: String,
      default: "timestamp"
    },
    timePickerLabel: {
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
      dateTimePickerID:
        "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      dateTimePickerValue: "",
      firstDayOfWeek: 1,
      isShown: false,
      timePickerValue: ""
    };
  },
  computed: {
    excludedDays: function () {
      const days = [];

      if (
        typeof this.excludeDays.value != "undefined" &&
        Array.isArray(this.excludeDays.value)
      ) {
        for (let index = 0; index < this.excludeDays.value.length; index++) {
          const day = parseInt(this.excludeDays.value[index].value);

          if (!isNaN(day)) {
            days.push(day);
          }
        }
      }

      return days;
    },
    validatedLocale: function () {
      if (this.locale == "") {
        const preferred_locales = navigator.languages;

        return preferred_locales[0];
      }

      return this.locale;
    }
  },
  watch: {
    datePickerValue: {
      handler: function () {
        this.setValue();

        if (this.mode === "date-picker") {
          this.isShown = false;
        }
      },
      immediate: false
    },
    modelValue: {
      handler: function (value) {
        this.setDateTimePickerValue(value);
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
        this.setDateTimePickerValue(value);
      },
      immediate: false
    }
  },
  methods: {
    convertTimestampToDate: function (timestamp, is_microtime = false) {
      if (!is_microtime) {
        timestamp *= 1000;
      }

      return new Date(timestamp);
    },
    convertDateToString: function (date) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      };

      if (this.mode == "date-time-picker") {
        options.hour = "2-digit";
        options.minute = "2-digit";
      }

      return new Intl.DateTimeFormat(this.validatedLocale, options).format(
        date
      );
    },
    hidePicker: function (element) {
      const parent = element.closest(
        '[ns-date-time-picker="' + this.dateTimePickerID + '"]'
      );

      if (parent == null) {
        this.isShown = false;
      }
    },
    setDateTimePickerValue: function (value) {
      if (value !== "") {
        const date = this.convertTimestampToDate(value);

        this.dateTimePickerValue = this.convertDateToString(date);

        let hour = date.getHours();
        let minute = date.getMinutes();

        this.datePickerValue = value;
        this.timePickerValue =
          hour.toString().padStart(2, "0") +
          ":" +
          minute.toString().padStart(2, "0");
      } else {
        this.dateTimePickerValue = "";
      }
    },
    setValue: function () {
      if (this.datePickerValue !== "") {
        const timestamp = this.datePickerValue * 1000;

        const date = new Date(timestamp);
        const time = this.timePickerValue.split(":");

        if (timestamp !== 0) {
          if (this.mode == "date-time-picker") {
            if (typeof time[0] !== "undefined" && time[0] !== "") {
              if (parseInt(time[0]) < parseInt(this.minHour)) {
                time[0] = this.minHour;
              } else if (parseInt(time[0]) > parseInt(this.maxHour)) {
                time[0] = this.maxHour;
              }

              date.setHours(time[0]);
            }

            if (typeof time[1] !== "undefined" && time[1] !== "") {
              if (parseInt(time[1]) < parseInt(this.minMinute)) {
                time[1] = this.minMinute;
              } else if (parseInt(time[1]) > parseInt(this.maxMinute)) {
                time[1] = this.maxMinute;
              }
              date.setMinutes(time[1]);
            }
          }
        }

        let value = date.getTime();
        this.dateTimePickerValue = this.convertDateToString(value);

        if (this.returnValue != "microtimestamp") {
          value = value / 1000;
        }

        this.$emit("input", {
          target: {
            name: this.name,
            value: value.toString()
          }
        });

        this.$emit("update:modelValue", value.toString());
      }
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
    }
  }
};
</script>
