<template>
  <div></div>
</template>

<script>
export default {
  name: "FieldPropertyStyleCompositor",
  components: {
    // NsDateTimePicker
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
      styles: [
        {
          backgroundColor: {
            label: "Background Color",
            type: "color"
          },
          borderColor: {
            label: "Border Color",
            type: "color"
          },
          color: {
            label: "Color",
            type: "color"
          }
        }
      ]
    };
  },
  computed: {},
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
    onInput: function () {}
  }
};
</script>
