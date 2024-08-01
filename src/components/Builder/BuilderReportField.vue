<template>
  <div
    class="relative p-0.5"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
  >
    <div
      class="rounded-sm border p-1"
      :class="{
        'border-primary': isFocused || isSelected,
        'border-dotted': isFocused,
        '!border-dashed': isSelected,
        'border-white': !isFocused && !isSelected
      }"
      @click.self="$emit('select')"
      @mouseenter="$emit('focus')"
      @mouseleave="$emit('blur')"
    >
      <field-tool-bar
        :column="column"
        :column-count="columnCount"
        :row="row"
        :row-count="rowCount"
        :hidden="!isFocused"
        @create-and-move-to-row-above="$emit('createAndMoveToRowAbove')"
        @create-and-move-to-row-below="$emit('createAndMoveToRowBelow')"
        @move-to-row-above="$emit('moveToRowAbove')"
        @move-to-row-below="$emit('moveToRowBelow')"
        @remove="$emit('remove')"
      ></field-tool-bar>
      <report-field
        :builder="true"
        :properties="properties"
        class="pointer-events-none"
        :value="value"
      ></report-field>
    </div>
  </div>
</template>

<script>
import ReportField from "@/components/Builder/ReportField.vue";
import FieldToolBar from "@/components/Builder/FieldToolBar.vue";

import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions.js";

export default {
  components: {
    ReportField,
    FieldToolBar
  },
  props: {
    column: {
      type: Number,
      default: 0
    },
    columnCount: {
      type: Number,
      default: 1
    },
    focus: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    },
    row: {
      type: Number,
      default: 0
    },
    rowCount: {
      type: Number,
      default: 1
    },
    select: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    blur: null,
    createAndMoveToRowAbove: null,
    createAndMoveToRowBelow: null,
    focus: null,
    moveToRowAbove: null,
    moveToRowBelow: null,
    remove: null,
    select: null,
    switchColumn: null
  },
  data: function () {
    return {
      fieldPropertyOptions: fieldPropertyOptions,
      selectedContainer: {},
      selectedContainerIndex: 0,
      value: undefined
    };
  },
  computed: {
    fieldLabel: function () {
      return this.label;
    },
    isFocused: function () {
      return this.focus;
    },
    isSelected: function () {
      return this.select;
    }
  },
  watch: {
    properties: {
      handler: function (value) {
        this.value = undefined;

        if (typeof value.items !== "undefined") {
          if (typeof value.selected !== "undefined" && value.selected !== "") {
            this.value = value.selected;
          } else {
            this.value = value.items.value[0].value;
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getPropertyValue: function (property) {
      if (typeof this.properties[property] !== "undefined") {
        return this.properties[property];
      }

      if (
        typeof this.fieldPropertyOptions[property] !== "undefined" &&
        typeof this.fieldPropertyOptions[property].default !== "undefined"
      ) {
        return this.fieldPropertyOptions[property].default;
      }

      return false;
    },
    getPropertiesValue: function () {
      return this.properties;
    },
    onDragEnter: function () {},
    onDragLeave: function () {},
    onDragOver: function () {
      this.$emit("switchColumn", this.row, this.column);
    }
  }
};
</script>
