<template>
  <div
    class="flex h-full flex-grow content-center items-center rounded-sm border border-dashed border-primary text-primary"
    @drop.prevent="dropElement"
    @dragover.prevent
  >
    <div class="pointer-events-none mx-auto p-3 text-sm">
      <span class="mdi mdi-arrow-down"></span> Drop
      {{ element == "" || element == null ? "Element" : '"' + element + '"' }}
      Here
    </div>
  </div>
</template>

<script>
export default {
  name: "EmptyColumnPlaceholder",
  props: {
    column: {
      type: Number,
      default: undefined
    },
    container: {
      type: Number,
      default: undefined
    },
    element: {
      type: String,
      default: ""
    },
    isAddInsideRow: {
      type: Boolean,
      default: true
    },
    row: {
      type: Number,
      default: undefined
    }
  },
  emits: {
    "add-element": null
  },
  methods: {
    dropElement: function () {
      this.$emit(
        "add-element",
        this.container,
        this.row,
        this.column,
        undefined,
        this.isAddInsideRow
      );
    }
  }
};
</script>
