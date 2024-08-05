<template>
  <div
    class="rounded-t bg-primary p-1.5 font-bold text-on-primary dark:bg-primary--dark"
  >
    <button @click="$emit('toggle')">
      <span class="mdi mdi-arrow-expand-horizontal"></span>
    </button>
    Elements
  </div>
  <div
    class="border border-primary dark:border-surface--dark-300 dark:bg-surface--dark-300 dark:text-white"
  >
    <div
      v-for="(element, index) in htmlElements"
      :key="index"
      class="cursor-move px-2 py-0.5"
      draggable="true"
      @dragend="onDragEnd($event, element)"
      @dragstart="onDragStart($event, element)"
    >
      <div><i :class="element.icon" class="fas"></i> {{ element.name }}</div>
    </div>
  </div>
</template>

<script>
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

export default {
  name: "HtmlElementPanel",
  emits: {
    dragend: null,
    dragstart: null,
    toggle: null
  },
  data: function () {
    return {
      htmlElements: elementPanelList.getElements()
    };
  },
  methods: {
    onDragEnd: function ($event, element) {
      this.$emit("dragend", $event, {
        content: element.content,
        element: element.tag,
        name: element.name,
        type: "html"
      });
    },
    onDragStart: function ($event, element) {
      this.$emit("dragstart", $event, {
        content: element.content,
        element: element.tag,
        name: element.name,
        type: "html"
      });
    }
  }
};
</script>
