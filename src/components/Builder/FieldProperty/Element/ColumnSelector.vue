<template>
  <template v-for="option in options" :key="option.name">
    <div class="pb-0.5 font-bold">{{ option.label }}</div>
    <div class="pb-1">
      <ns-drop-down-list
        v-model="column[option.name]"
        :items="columns"
        class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
      ></ns-drop-down-list>
    </div>
  </template>
</template>

<script>
import NsDropDownList from "@/components/NS/NsDropDownList.vue";
import AppBuilder from "@/assets/js/AppBuilder.js";

export default {
  components: {
    NsDropDownList
  },
  props: {
    modelValue: {
      type: Object,
      default: function () {
        return {};
      }
    },
    options: {
      type: Array,
      default: function () {
        [];
      }
    },
    table: {
      type: String,
      default: ""
    }
  },
  emits: {
    change: null,
    "update:modelValue": null
  },
  data: function () {
    return {
      column: {},
      columns: []
    };
  },
  watch: {
    column: {
      handler: function (value) {
        this.$emit("change", value);
        this.$emit("update:modelValue", value);
      },
      immediate: true,
      deep: true
    },
    modelValue: {
      handler: function (value) {
        for (let index = 0; index < this.options.length; index++) {
          const option = this.options[index];

          this.column[option.name] = value[option.name];
        }
      },
      immediate: true,
      deep: true
    },
    table: {
      handler: function () {
        this.fetchTableColumns();
      },
      immediate: true
    }
  },
  methods: {
    fetchTableColumns: function () {
      const self = this;
      const columns = [];

      AppBuilder.getTableColumns(self.table).then(function (data) {
        columns.push({
          label: "-",
          value: ""
        });

        for (let i = 0; i < data.length; i++) {
          columns.push({
            label: data[i],
            value: data[i]
          });
        }

        self.columns = columns;
      });
    }
  }
};
</script>
