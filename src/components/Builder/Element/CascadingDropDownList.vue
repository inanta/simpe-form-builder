<template>
  <div class="relative">
    <ns-drop-down-list
      v-model="value"
      :items="items"
      :placeholder="placeholder"
      :readonly="readonly"
      class="w-full appearance-none rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
      @change="onInput"
    ></ns-drop-down-list>
    <div
      v-if="isLoading"
      class="absolute top-[calc(50%-0.75rem)] right-2 block"
    >
      <span class="loader-3"></span>
    </div>
  </div>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";
import NsDropDownList from "../../NS/NsDropDownList.vue";

import getAPI from "@/assets/js/getAPI.js";
import "@/assets/css/loaders/3.css";

export default {
  components: { NsDropDownList },
  inheritAttrs: false,
  props: {
    app: {
      type: Object,
      default: function () {
        return {};
      }
    },
    data: {
      type: [Object, Array],
      default: function () {
        return [];
      }
    },
    label: {
      type: String,
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    cascadingDropDownListParentElement: {
      type: Object,
      default: function () {
        return {};
      }
    },
    cascadingDropDownListChildSource: {
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
      default: false
    },
    size: { type: String, default: "1" }
  },
  emits: ["input"],
  data: function () {
    return {
      isLoading: false,
      items: [],
      value: ""
    };
  },
  mounted: function () {
    this.initWatch();
  },
  methods: {
    initWatch: function () {
      const self = this;

      self.$watch(
        "data." + self.cascadingDropDownListParentElement.name,
        function (value) {
          if (
            typeof self.data[self.cascadingDropDownListParentElement.name] !==
              "undefined" &&
            self.data[self.cascadingDropDownListParentElement.name] !== null
          ) {
            self.isLoading = true;
            self.value = "";
            self.items = [];

            getAPI(
              "app/api/v1/elements/" +
                this.app.slug +
                "/" +
                this.name +
                "?id=" +
                value
            ).then(function (response) {
              self.items = [];

              for (let index = 0; index < response.length; index++) {
                const record = response[index];

                self.items.push({
                  label: record.label,
                  value: record.value
                });
              }

              if (
                typeof self.items[0] != "undefined" &&
                self.items[0].value != "undefined"
              ) {
                self.value = self.items[0].value;
                self.$emit("input", {
                  target: {
                    name: self.name,
                    value: self.value
                  }
                });
              }

              self.isLoading = false;
            });
          }
        },
        {
          immediate: true
        }
      );
    },
    onInput: function (value) {
      this.$emit("input", {
        target: {
          name: this.name,
          value: value
        }
      });
    }
  }
};

elementPanelList.addElement(
  "general",
  "Cascading Drop Down List",
  "Cascading Drop Down List",
  "cascading-drop-down-list",
  "mdi mdi-menu-down"
);

fieldProperties["cascading-drop-down-list"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "cascading-drop-down-list-parent-element": {
    label: "Parent Element"
  },
  "cascading-drop-down-list-parent-source": {
    label: "Parent Source"
  },
  "cascading-drop-down-list-child-source": {
    label: "Child Source"
  },
  placeholder: {
    label: "Placeholder"
  },
  readonly: {
    label: "Is Read Only"
  },
  validation: {
    label: "Validation"
  }
};

fieldPropertyOptions.addOption(
  "cascading-drop-down-list-parent-element",
  "FieldPropertyElementSelection"
);

fieldPropertyOptions.addOption(
  "cascading-drop-down-list-parent-source",
  "FieldPropertyTableColumnSelector",
  {
    additionalFields: [
      {
        label: "Label Column",
        name: "label_column"
      },
      {
        label: "Value Column",
        name: "value_column"
      }
    ],
    showColumnsSelector: false
  }
);

fieldPropertyOptions.addOption(
  "cascading-drop-down-list-child-source",
  "FieldPropertyTableColumnSelector",
  {
    additionalFields: [
      {
        label: "Filter Column",
        name: "filter_column"
      },
      {
        label: "Label Column",
        name: "label_column"
      },
      {
        label: "Value Column",
        name: "value_column"
      }
    ],
    showColumnsSelector: false
  }
);
</script>
<style scoped>
.loader-3,
.loader-3:after {
  border-width: 3px !important;
  height: 24px !important;
  width: 24px !important;
}
</style>
