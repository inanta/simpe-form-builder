<template>
  <label class="block pb-1 pt-2">
    <div class="pb-1">{{ label }}</div>

    <select
      :size="size"
      :value="value"
      class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
      @input.self="onInput"
    >
      <option
        v-for="(item, index) in computedItems"
        :key="index"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>
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
    items: {
      type: Object,
      default: function () {
        return {};
      }
    },
    label: {
      type: String,
      default: ""
    },
    multiple: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    size: {
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
  computed: {
    computedItems: function () {
      let items = [];
      let source_items = null;

      if (typeof this.items !== "undefined") {
        source_items = this.items;

        if (typeof this.items.value !== "undefined") {
          source_items = this.items.value;
        }

        for (let index = 0; index < source_items.length; index++) {
          const item = source_items[index];

          items.push(item);
        }
      }

      return items;
    }
  },
  mounted: function () {
    this.$emit("input", {
      target: {
        name: this.field + this.filterCondition,
        value: {
          field: this.field,
          condition: this.filterCondition,
          value:
            typeof this.value !== "undefined"
              ? this.value
              : this.computedItems[0]
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
