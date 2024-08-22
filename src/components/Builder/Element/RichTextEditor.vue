<template>
  <div>
    <div ref="editor"></div>
  </div>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

import Quill from "quill/dist/quill.js";
import "quill/dist/quill.snow.css";

export default {
  props: {
    builder: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: function () {
        return {};
      }
    },
    label: {
      type: String,
      default: ""
    },
    modules: {
      type: Object,
      default: function () {
        return {};
      }
    },
    placeholder: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      value: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {
      editor: null
    };
  },
  watch: {
    placeholder: {
      handler: function (value) {
        if (this.editor !== null && value !== this.editor.root.innerHTML) {
          this.editor.root.dataset.placeholder = value;
          this.editor.root.setAttribute("data-placeholder", value);
        }
      },
      immediate: false
    },
    value: {
      handler: function (value) {
        if (this.editor !== null && value !== this.editor.root.innerHTML) {
          const delta = this.editor.clipboard.convert(value);

          this.editor.setContents(delta);
        }
      },
      immediate: false
    }
  },
  mounted: function () {
    const self = this;

    const modules = {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }]
      ]
    };

    self.editor = new Quill(self.$refs.editor, {
      modules: Object.assign({}, modules, self.modules),
      theme: "snow",
      placeholder: this.placeholder,
      readOnly: !(this.builder || this.readonly)
    });

    if (self.value != "") {
      self.editor.clipboard.dangerouslyPasteHTML(self.value);
    }

    self.editor.on("text-change", function () {
      self.$emit("input", {
        target: {
          name: self.name,
          value: self.editor.root.innerHTML
        }
      });
    });
  }
};

elementPanelList.addElement(
  "general",
  "Rich Text",
  "Rich Text",
  "rich-text-editor",
  "mdi mdi-format-font"
);

fieldProperties["rich-text-editor"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  placeholder: {
    label: "Placeholder"
  },
  value: {
    label: "Value"
  },
  readonly: {
    label: "Is Read Only"
  },
  attrs: {
    label: "Attributes"
  },
  validation: {
    label: "Validation"
  }
};
</script>

<style scoped>
:deep(.ql-toolbar.ql-snow) {
  @apply rounded-t-sm dark:border-surface--dark-600 dark:bg-surface--dark-600;
}

:deep(.ql-stroke) {
  @apply dark:stroke-on-surface--dark-100;
}

:deep(.ql-fill) {
  @apply dark:fill-on-surface--dark-100;
}

:deep(.ql-editor) {
  @apply dark:border-surface--dark-500 dark:!bg-surface--dark-500;
}

:deep(.ql-container.ql-snow) {
  @apply rounded-b-sm dark:border-surface--dark-500;
}
</style>
