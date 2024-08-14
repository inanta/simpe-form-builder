<template>
  <div>
    <ns-date-time-picker
      v-model="value"
      class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
      :mode="mode"
    ></ns-date-time-picker>
  </div>
</template>

<script>
import NsDateTimePicker from "@/components/NS/NsDateTimePicker.vue";

export default {
  name: "FieldPropertyDateTimeSelection",
  components: {
    NsDateTimePicker
  },
  props: {
    configuration: {
      type: Object,
      default: function () {
        return {
          mode: "date-picker"
        };
      }
    },
    fieldProperty: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    change: null
  },
  data: function () {
    return {
      value: ""
    };
  },
  computed: {
    mode: function () {
      if (typeof this.configuration.mode !== "undefined") {
        return this.configuration.mode;
      }

      return "date-picker";
    }
  },
  watch: {
    properties: {
      handler: function () {
        this.value = this.properties[this.fieldProperty];
      },
      immediate: true
    },
    value: function (value) {
      this.$emit("change", this.fieldProperty, value);
    }
  },
  mounted: function () {},
  methods: {
    onInput: function () {
      console.log("input", this.value);
    }
  }
};
</script>
