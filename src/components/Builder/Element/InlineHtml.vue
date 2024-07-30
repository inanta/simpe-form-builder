<template>
  <div ref="html"></div>
</template>

<script>
import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import ElementPanelList from "@/assets/js/builder/ElementPanelList.js";
// import FieldPropertyOptions from "@/assets/js/builder/FieldPropertyOptions";

export default {
  props: {
    builder: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    inlineHtmlContent: {
      type: String,
      default: ""
    }
  },
  data: function () {
    return {
      savedContent: ""
    };
  },
  watch: {
    inlineHtmlContent: {
      handler: function (value) {
        if (typeof value === "undefined") {
          value = '<span style="color: #eee"><Empty HTML/span>';
        }

        this.changeInnerHtml(value);
      },
      immediate: true
    }
  },
  mounted: function () {
    this.changeInnerHtml(this.inlineHtmlContent);
  },
  methods: {
    changeInnerHtml: function (value) {
      if (typeof this.$refs.html !== "undefined") {
        this.$refs.html.innerHTML = value;
      }
    }
  }
};

ElementPanelList.addElement(
  "general",
  "HTML",
  "HTML",
  "inline-html",
  "mdi mdi-xml"
);

FieldProperties["inline-html"] = {
  label: {
    label: "Label"
  },
  "inline-html-content": {
    label: "Content",
    type: "textarea"
  }
};
</script>

<style scoped></style>
