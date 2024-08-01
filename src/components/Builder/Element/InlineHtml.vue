<template>
  <div ref="html"></div>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

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

elementPanelList.addElement(
  "general",
  "HTML",
  "HTML",
  "inline-html",
  "mdi mdi-xml"
);

fieldProperties["inline-html"] = {
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
