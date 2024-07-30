<template>
  <label class="block pb-1 pt-2">
    <div class="pb-1">{{ label }}</div>

    <input
      :name="name"
      :placeholder="placeholder"
      type="text"
      :value="value"
      class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
      @input.self="onInput"
    />
  </label>
</template>

<script>
export default {
  props: {
    field: {
      type: String,
      default: ""
    },
    filterCondition: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
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
    return {};
  },
  mounted: function () {
    this.$emit("input", {
      target: {
        name: this.field + this.filterCondition,
        value: {
          field: this.field,
          condition: this.filterCondition,
          value: typeof this.value !== "undefined" ? this.value : ""
        }
      }
    });
  },
  methods: {
    onInput: function (event) {
      this.$emit("input", {
        target: {
          name: this.field + this.filterCondition,
          value: {
            field: this.field,
            condition: this.filterCondition,
            value: event.target.value
          }
        }
      });
    }
  }
};
</script>
