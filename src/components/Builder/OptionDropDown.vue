<template>
  <label>
    {{ currentLabel }}
    <select
      v-model="selectedValue"
      class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
      @change="change"
    >
      <option v-for="item in items" :key="item">
        {{ item }}
      </option>
    </select>
  </label>
</template>

<script>
export default {
  name: "OptionDropDown",
  props: {
    items: {
      type: Array,
      default: function () {
        return [];
      }
    },
    label: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["optionChange"],
  data: function () {
    return {
      currentLabel: "",
      selectedValue: ""
    };
  },
  watch: {
    label: {
      handler: function (value) {
        this.currentLabel = value;
      },
      immediate: true
    },
    value: {
      handler: function (value) {
        this.selectedValue = value;
      },
      immediate: true
    }
  },
  methods: {
    change: function () {
      this.$emit("optionChange", this.selectedValue);
    }
  }
};
</script>
