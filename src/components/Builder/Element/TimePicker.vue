<template>
  <div v-closable="hideTimePicker">
    <input
      ref="input"
      v-model="timePickerValue"
      class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary"
      type="text"
      @focus="onInputFocus"
    />
    <div
      v-show="isShown"
      ref="dropdown"
      class="z-10 flex overflow-hidden rounded border border-light-gray bg-white p-4 shadow"
    >
      <ns-time-picker
        :format="timePickerFormat"
        :placeholder="placeholder"
        :max-hour="maxHour"
        :max-minute="maxMinute"
        :min-hour="minHour"
        :min-minute="minMinute"
        :minute-interval="minuteInterval"
        @change="onTimePickerChange"
      ></ns-time-picker>
    </div>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import NsClosable from "@/directives/NsClosable.js";

import NsTimePicker from "../../NS/NsTimePicker.vue";

import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import ElementPanelList from "@/assets/js/builder/ElementPanelList.js";

export default {
  directives: {
    closable: NsClosable
  },
  components: {
    NsTimePicker
  },
  props: {
    builder: {
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
    timePickerFormat: {
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
    name: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom-start"
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
    return {
      isShown: false,
      popperInstance: null,
      timePickerValue: ""
    };
  },
  methods: {
    hideTimePicker: function () {
      this.isShown = false;
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
    onTimePickerChange: function (value) {
      this.timePickerValue = value;

      this.$emit("input", {
        target: {
          name: this.name,
          value: value
        }
      });
    }
  }
};

ElementPanelList.addElement(
  "general",
  "Time Picker",
  "Time Picker",
  "time-picker",
  "mdi mdi-clock"
);

FieldProperties["time-picker"] = {
  name: {
    label: "Name"
  },
  timePickerFormat: {
    label: "Format"
  },
  label: {
    label: "Label"
  },
  placeholder: {
    label: "Placeholder"
  }
};
</script>
