<template>
  <div
    v-for="(row, row_index) in rows"
    :key="row_index"
    class="mb-1 flex"
    :class="{
      'space-x-1': display === 'column',
      'flex-col space-y-1': display === 'row'
    }"
  >
    <div v-for="column in columns" :key="column.name">
      <input
        v-model="row[column.name]"
        :disabled="row_index !== rows.length - 1"
        :placeholder="column.placeholder"
        :readonly="row_index !== rows.length - 1"
        class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
        type="text"
        @input="onInput"
      />
    </div>
    <div
      :class="{
        'text-center': display === 'row'
      }"
    >
      <button
        class="px-2 py-1 text-on-primary"
        :class="{
          'bg-primary': row_index !== 0,
          'bg-mid-gray': row_index === 0,
          'rounded-full': display === 'column',
          'w-full rounded-sm': display === 'row'
        }"
        :disabled="row_index === 0"
        @click="onRemoveRowClick(row_index)"
      >
        <i class="mdi mdi-minus"></i>
      </button>
      <hr v-if="display === 'row'" class="my-2" />
    </div>
  </div>
  <div class="py-2 text-center">
    <button
      class="px-2 py-1 text-on-primary"
      :class="{
        'bg-primary dark:bg-primary--dark': isAbleToAddRow,
        'bg-mid-gray': !isAbleToAddRow,
        'rounded-full': display === 'column',
        'w-full rounded-sm': display === 'row'
      }"
      :disabled="!isAbleToAddRow"
      @click="onAddNewRowClick"
    >
      <i class="mdi mdi-plus"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: function () {
        return [];
      }
    },
    display: {
      type: String,
      default: "column"
    },
    modelValue: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  emits: {
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

      for (const key in this.columns) {
        if (Object.hasOwnProperty.call(this.columns, key)) {
          const column = this.columns[key];

          if (this.rows[this.rows.length - 1][column.name] == "") {
            is_able_to_add = false;
          }
        }
      }

      return is_able_to_add;
    }
  },
  watch: {
    modelValue: {
      handler: function (value) {
        this.rows = JSON.parse(JSON.stringify(value));
      },
      immediate: true
    }
  },
  methods: {
    onAddNewRowClick: function () {
      let can_add_new_row = true;
      let new_row = {};

      for (const key in this.columns) {
        if (Object.hasOwnProperty.call(this.columns, key)) {
          const column = this.columns[key].name;

          if (this.rows[this.rows.length - 1][column] == "") {
            can_add_new_row = false;
            break;
          }

          new_row[column] = "";
        }
      }

      if (can_add_new_row) {
        this.rows.push(new_row);
      }
    },
    onInput: function () {
      this.$emit("update:modelValue", this.rows);
    },
    onRemoveRowClick: function (index) {
      if (index !== 0) {
        this.rows.splice(index, 1);
      }
    }
  }
};
</script>
