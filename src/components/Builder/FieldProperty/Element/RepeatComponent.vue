<template>
  <div v-for="(row, row_index) in rows" :key="row_index" class="mb-1 flex">
    <slot :index="row_index"></slot>
    <div class="pl-1.5">
      <button
        class="rounded-full px-2 py-1 text-on-primary"
        :class="{
          'bg-primary': row_index !== 0,
          'bg-mid-gray': row_index === 0
        }"
        :disabled="row_index === 0"
        @click="removeRow(row_index)"
      >
        <i class="mdi mdi-minus"></i>
      </button>
    </div>
  </div>
  <div class="py-2 text-center">
    <button
      class="rounded-full px-2 py-1 text-on-primary"
      :class="{
        'bg-primary': isAbleToAddRow,
        'bg-mid-gray': !isAbleToAddRow
      }"
      :disabled="!isAbleToAddRow"
      @click="onAddRowButtonClick"
    >
      <i class="mdi mdi-plus"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  emits: {
    add: null,
    change: null,
    "update:modelValue": null
  },
  data: function () {
    return {
      rows: []
    };
  },
  computed: {
    isAbleToAddRow: function () {
      let is_able_to_add = true;

      for (const key in this.rows[this.rows.length - 1]) {
        if (Object.hasOwnProperty.call(this.rows[this.rows.length - 1], key)) {
          const column = this.rows[this.rows.length - 1][key];

          if (column == "") {
            is_able_to_add = false;
          }
        }
      }
      return is_able_to_add;
    }
  },
  watch: {
    value: {
      handler: function (values) {
        if (Array.isArray(values) && values.length > 0) {
          for (let index = 0; index < values.length; index++) {
            this.rows.push({});
          }
        } else {
          this.rows.push({});
        }
      },
      immediate: true
    }
  },
  methods: {
    onChange: function () {},
    onAddRowButtonClick: function () {
      this.rows.push({});

      this.$emit("add", this.rows.length);
    },
    removeRow: function (index) {
      if (index !== 0) {
        this.rows.splice(index, 1);
      }
    }
  }
};
</script>
