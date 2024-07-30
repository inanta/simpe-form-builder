<template>
  <transition
    name="show-panel-transition"
    enter-active-class="animate__animated animate__slideInRight animate__faster"
    leave-active-class="animate__animated animate__slideOutRight animate__faster"
  >
    <div v-if="!hidden" class="mb-2">
      <div
        class="rounded-t bg-primary p-1.5 font-bold text-on-primary dark:bg-primary--dark"
      >
        Filter Elements
      </div>
      <div class="border border-primary dark:border-primary--dark">
        <div
          v-for="column in columns"
          :key="column.name"
          :class="{ 'select-none': column.is_added }"
          :draggable="column.is_added ? 'false' : 'true'"
          class="cursor-move px-2 py-0.5"
          @dragend.self="endDrag"
          @dragstart.self="startDrag($event, column)"
        >
          <div
            :class="{
              'text-light-gray': column.is_added
            }"
          >
            <span class="mdi mdi-database"></span> {{ column.name }}
          </div>
        </div>
      </div>
    </div>
  </transition>
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
    hidden: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    dragstart: null
  },
  data: function () {
    return {};
  },
  methods: {
    startDrag: function (event, element) {
      this.$emit("dragstart", event, {
        element: "filter-text",
        field: element.name,
        "filter-condition": "=",
        type: "filter"
      });
    }
  }
};
</script>
