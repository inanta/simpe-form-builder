<template>
  <div class="w-max overflow-hidden rounded-lg p-2">
    <div>
      <div class="flex">
        <div>
          <button
            class="text-2xl"
            type="button"
            @click="onPreviousYearButtonClick"
          >
            <span class="mdi mdi-chevron-double-left"></span>
          </button>
        </div>
        <div>
          <button
            class="text-2xl"
            type="button"
            @click="onPreviousMonthButtonClick"
          >
            <span class="mdi mdi-chevron-left"></span>
          </button>
        </div>
        <div class="grow text-center text-lg">
          {{ currentMonth }} {{ currentYear }}
        </div>
        <div>
          <button
            type="button"
            class="text-2xl"
            @click="onNextMonthButtonClick"
          >
            <span class="mdi mdi-chevron-right"></span>
          </button>
        </div>
        <div>
          <button type="button" class="text-2xl" @click="onNextYearButtonClick">
            <span class="mdi mdi-chevron-double-right"></span>
          </button>
        </div>
      </div>
      <div class="p-2">
        <div class="flex">
          <div
            v-for="(weekDay, weekDayIndex) in shortWeekDays"
            :key="weekDayIndex"
            :class="{
              'text-disabled dark:text-disabled--dark': weekDay.disabled
            }"
            class="h-8 w-8 text-center"
          >
            {{ weekDay.label }}
          </div>
        </div>
        <div
          v-for="(week, weekIndex) in calendar"
          :key="weekIndex"
          class="flex"
        >
          <div
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            :class="{
              '!border-primary dark:!border-primary--dark': day.today,
              'dark:text-on-primary-dark border border-primary bg-primary text-on-primary dark:border-primary--dark dark:bg-primary--dark':
                day.selected,
              'cursor-pointer hover:border-primary dark:hover:border-primary--dark':
                day.value !== '',
              'cursor-not-allowed text-disabled dark:text-on-disabled--dark':
                day.disabled && day.value !== ''
            }"
            class="h-8 w-8 rounded-full border-2 border-white text-center dark:border-surface--dark-600"
            @click="onDayClick(day)"
          >
            <div class="h-7 w-7 leading-7">
              {{ day.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    excludeDays: {
      type: Array,
      default: function () {
        return [];
      }
    },
    firstDayOfWeek: {
      type: Number,
      default: 0
    },
    modelValue: {
      type: String,
      default: ""
    }
  },
  emits: ["change", "update:modelValue"],
  data: function () {
    return {
      date: new Date(),
      today: new Date(),
      months: [],
      shortBaseWeekDays: [],
      baseWeekDays: [],
      value: 0
    };
  },
  computed: {
    calendar: function () {
      const calendar = [];

      let start_day = this.date.getDay() - this.firstDayOfWeek;
      let day = 1;

      if (start_day < 0) {
        start_day = start_day + 7;
      }

      for (let week = 0; week < this.numberOfWeeks; week++) {
        const current_week = [];

        for (let day_of_week = 0; day_of_week < 7; day_of_week++) {
          let real_day_of_week = day_of_week + this.firstDayOfWeek;

          if (real_day_of_week > 6) {
            real_day_of_week -= 7;
          }

          if (
            (week === 0 && day_of_week < start_day) ||
            day > this.numberOfDays
          ) {
            current_week.push({
              disabled: true,
              selected: false,
              today: false,
              value: ""
            });
          } else {
            current_week.push({
              disabled: this.excludeDays.includes(real_day_of_week),
              selected:
                this.value.getFullYear() == this.date.getFullYear() &&
                this.value.getMonth() == this.date.getMonth() &&
                this.value.getDate() == day,
              today:
                this.today.getFullYear() == this.date.getFullYear() &&
                this.today.getMonth() == this.date.getMonth() &&
                this.today.getDate() == day,
              value: day
            });

            day += 1;
          }
        }

        calendar.push(current_week);
      }

      return calendar;
    },
    currentMonth: function () {
      return this.months[this.date.getMonth()];
    },
    currentYear: function () {
      return this.date.getFullYear();
    },
    numberOfWeeks: function () {
      let number_of_week = Math.ceil(
        (this.date.getDay() + this.numberOfDays) / 7
      );

      if (this.date.getDay() - this.firstDayOfWeek < 0) {
        number_of_week += 1;
      }

      return number_of_week;
    },
    numberOfDays: function () {
      return new Date(
        this.date.getFullYear(),
        this.date.getMonth() + 1,
        0
      ).getDate();
    },
    weekDays: function () {
      const week_days =
        this.baseWeekDays.length == 0 ? [""] : [...this.baseWeekDays];

      for (let index = 0; index < this.firstDayOfWeek; index++) {
        week_days.push(week_days.shift());
      }

      return week_days;
    },
    shortWeekDays: function () {
      const week_days =
        this.baseWeekDays.length == 0 ? [""] : [...this.shortBaseWeekDays];

      for (let index = 0; index < this.firstDayOfWeek; index++) {
        week_days.push(week_days.shift());
      }

      return week_days;
    }
  },
  watch: {
    modelValue: {
      handler: function (value) {
        if (value !== "") {
          this.value = new Date(value * 1000);
        } else {
          this.value = new Date();
        }
      },
      immediate: true
    }
  },
  mounted: function () {
    const preferredLocales = navigator.languages;
    const currentLocale = preferredLocales[0];
    const now = new Date();

    let dateFormatter = null;

    this.date = new Date(now.getFullYear(), now.getMonth());

    let weekDaysFormatter = new Intl.DateTimeFormat(currentLocale, {
      weekday: "long"
    });

    let shortWeekDaysFormatter = new Intl.DateTimeFormat(currentLocale, {
      weekday: "narrow"
    });

    for (let i = 4; i < 11; i++) {
      const date = new Date(Date.UTC(1970, 0, i));

      this.baseWeekDays.push({
        label: weekDaysFormatter.format(date),
        disabled: this.excludeDays.includes(i - 4)
      });

      this.shortBaseWeekDays.push({
        label: shortWeekDaysFormatter.format(date),
        disabled: this.excludeDays.includes(i - 4)
      });
    }

    dateFormatter = new Intl.DateTimeFormat(currentLocale, {
      month: "long"
    });

    for (let i = 0; i < 12; i++) {
      const date = new Date(Date.UTC(1970, i, 1));
      const monthName = dateFormatter.format(date);
      this.months.push(monthName);
    }
  },
  methods: {
    onDayClick: function (date) {
      if (date.value != "" && !date.disabled) {
        this.value = new Date(
          this.date.getFullYear(),
          this.date.getMonth(),
          date.value
        );

        this.$emit("change", (this.value.getTime() / 1000).toString());
        this.$emit(
          "update:modelValue",
          (this.value.getTime() / 1000).toString()
        );
      }
    },
    onNextMonthButtonClick: function () {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1);
    },
    onNextYearButtonClick: function () {
      this.date = new Date(this.date.getFullYear() + 1, this.date.getMonth());
    },
    onPreviousMonthButtonClick: function () {
      this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1);
    },
    onPreviousYearButtonClick: function () {
      this.date = new Date(this.date.getFullYear() - 1, this.date.getMonth());
    }
  }
};
</script>
