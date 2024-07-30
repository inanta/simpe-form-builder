<template>
  <div
    class="rounded-t bg-primary p-1.5 font-bold text-on-primary dark:bg-primary--dark"
  >
    Report Element
  </div>
  <div class="border border-primary dark:border-primary--dark">
    <div
      v-for="(element, index) in htmlElements"
      :key="index"
      class="cursor-move px-2 py-0.5"
      draggable="true"
      @dragstart="startDrag($event, element)"
    >
      <div><i :class="element.icon" class="fas"></i> {{ element.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  emits: {
    dragstart: null
  },
  data: function () {
    return {
      htmlElements: [
        {
          content: "Heading",
          name: "Heading",
          tag: "h1",
          icon: "mdi mdi-format-title"
        },
        {
          name: "Image",
          tag: "img",
          icon: "mdi mdi-image"
        },
        {
          content: "Text",
          name: "Text",
          tag: "p",
          icon: "mdi mdi-alphabetical-variant"
        },
        {
          content: "Horizontal Line",
          name: "Horizontal Line",
          tag: "hr",
          icon: "mdi mdi-minus"
        },
        {
          content: "Table",
          name: "Table",
          tag: "report-table",
          icon: "mdi mdi-table"
        },
        {
          content: "Charts",
          name: "Charts",
          tag: "report-chart",
          icon: "mdi mdi-chart-arc"
        }
      ]
    };
  },
  methods: {
    startDrag: function ($event, element) {
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
