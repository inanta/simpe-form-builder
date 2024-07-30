<template>
  <ns-drop-down-list
    v-model="table"
    :items="tables"
    class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
    @xchange="onDropDownChange"
  ></ns-drop-down-list>
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
      table: "",
      tables: []
    };
  },
  watch: {
    modelValue: {
      handler: function (value) {
        this.table = value;
      },
      immediate: true
    },
    table: function (value) {
      this.$emit("change", value);
      this.$emit("update:modelValue", value);
    }
  },
  mounted: function () {
    const self = this;
    const tables = [];

    AppBuilder.getTables().then(function (data) {
      for (let i = 0; i < data.length; i++) {
        const table = data[i];

        tables.push({
          label: table,
          value: table
        });
      }

      self.tables = tables;
    });
  },
  methods: {
    onDropDownChange: function (value) {
      this.$emit("change", value);
    }
  }
};
</script>
