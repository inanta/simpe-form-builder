<template>
  <div v-if="!isHidden" class="absolute right-0 top-0 z-10 p-1.5 text-xs">
    <button
      v-tooltip
      class="ml-1 inline-block h-6 w-6 rounded bg-negative p-1 text-center dark:bg-negative--dark"
      title="Remove"
      type="button"
      @click="$emit('remove')"
      @dragstart.prevent
    >
      <span class="mdi mdi-close text-on-negative"></span>
    </button>
    <button
      v-tooltip
      class="ml-1 inline-block h-6 w-6 rounded bg-primary p-1 text-center dark:bg-primary--dark"
      title="Copy Element Code"
      type="button"
      @click="$emit('copyCode')"
    >
      <span class="mdi mdi-code-json text-on-primary"></span>
    </button>
    <button
      v-tooltip
      class="ml-1 inline-block h-6 w-6 rounded bg-primary p-1 text-center dark:bg-primary--dark"
      title="Duplicate"
      type="button"
      @click="$emit('duplicate')"
    >
      <span class="mdi mdi-content-duplicate text-on-primary"></span>
    </button>
    <button
      v-if="row !== 0"
      v-tooltip
      class="ml-1 inline-block h-6 w-6 rounded bg-primary p-1 text-center dark:bg-primary--dark"
      title="Move To Row Above"
      type="button"
      @click="$emit('moveToRowAbove')"
    >
      <span class="mdi mdi-arrow-collapse-up text-on-primary"></span>
    </button>
    <button
      v-if="row !== rowCount - 1"
      v-tooltip
      class="ml-1 inline-block h-6 w-6 rounded bg-primary p-1 text-center dark:bg-primary--dark"
      title="Move To Row Below"
      type="button"
      @click="$emit('moveToRowBelow')"
    >
      <span class="mdi mdi-arrow-collapse-down text-on-primary"></span>
    </button>
    <button
      v-if="columnCount > 2"
      v-tooltip
      class="ml-1 inline-block h-6 w-6 rounded bg-primary p-1 text-center dark:bg-primary--dark"
      title="Create And Move To Row Above"
      type="button"
      @click="$emit('createAndMoveToRowAbove')"
    >
      <span class="mdi mdi-arrow-expand-up text-on-primary"></span>
    </button>
    <button
      v-if="columnCount > 2"
      v-tooltip
      class="ml-1 inline-block h-6 w-6 rounded bg-primary p-1 text-center dark:bg-primary--dark"
      title="Create And Move To Row Below"
      type="button"
      @click="$emit('createAndMoveToRowBelow')"
    >
      <span class="mdi mdi-arrow-expand-down text-on-primary"></span>
    </button>
  </div>
</template>

<script>
import NsTooltip from "@/directives/NsTooltip";

export default {
  name: "FieldTooBar",
  directives: { tooltip: NsTooltip },
  props: {
    column: {
      type: Number,
      default: 0
    },
    columnCount: {
      type: Number,
      default: 1
    },
    row: {
      type: Number,
      default: 0
    },
    rowCount: {
      type: Number,
      default: 1
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    copyCode: null,
    createAndMoveToRowAbove: null,
    createAndMoveToRowBelow: null,
    createLogic: null,
    duplicate: null,
    moveToRowAbove: null,
    moveToRowBelow: null,
    remove: null
  },
  computed: {
    isHidden: function () {
      return this.hidden;
    }
  }
};
</script>
