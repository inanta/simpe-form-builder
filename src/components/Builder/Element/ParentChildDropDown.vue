<template>
  <ns-drop-down-list
    :class="{
      'border-mid-gray dark:border-surface--dark-500': error,
      'border-negative dark:border-negative--dark': !error
    }"
    :items="items"
    :placeholder="placeholder"
    class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
    @change="onInput"
  ></ns-drop-down-list>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";
import postAPI from "@/assets/js/postAPI.js";

import NsDropDownList from "../../NS/NsDropDownList.vue";

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
    error: {
      type: Boolean,
      default: false
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
    parentChildDropDownParentElement: {
      type: Object,
      default: function () {
        return {};
      }
    },
    parentChildDropDownChildSource: {
      type: Object,
      default: function () {
        return {};
      }
    },
    placeholder: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "1"
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ["input"],
  data: function () {
    return {
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
        "data." + self.parentChildDropDownParentElement.name,
        function (value) {
          if (
            typeof self.data[self.parentChildDropDownParentElement.name] !==
            "undefined"
          ) {
            postAPI("app/api/v1/elements/" + this.app.slug + "/" + this.name, {
              parent: value
            })
              .then(function (response) {
                self.items = response.items;

                self.value = self.items[0].value;
                self.$emit("input", {
                  target: {
                    name: self.name,
                    value: self.value
                  }
                });
              })
              .catch(function () {
                console.log("Error", "Unable to get items", "error");
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
  "Parent Child Drop Down",
  "Parent Child Drop Down",
  "parent-child-drop-down",
  "mdi mdi-menu-down"
);

fieldProperties["parent-child-drop-down"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "parent-child-drop-down-parent-element": {
    label: "Parent Element"
  },
  "parent-child-drop-down-child-source": {
    label: "Child Source"
  },
  placeholder: {
    label: "Placeholder"
  },
  readonly: {
    label: "Is Readonly"
  },
  validation: {
    label: "Validation"
  }
};

fieldPropertyOptions.addOption(
  "parent-child-drop-down-parent-element",
  "FieldPropertyElementSelection",
  undefined,
  ["parent-child-drop-down"]
);

fieldPropertyOptions.addOption(
  "parent-child-drop-down-parent-source",
  "FieldPropertyTableColumnSelector",
  {
    additionalFields: [
      {
        label: "Parent Column",
        name: "parent_column"
      },
      {
        label: "Child Column",
        name: "child_column"
      }
    ]
  },
  ["parent-child-drop-down"]
);

fieldPropertyOptions.addOption(
  "parent-child-drop-down-child-source",
  "FieldPropertyTableColumnSelector",
  {
    additionalFields: [
      {
        label: "Parent Column",
        name: "parent_column"
      },
      {
        label: "Label Column",
        name: "label_column"
      },
      {
        label: "Value Column",
        name: "value_column"
      }
    ]
  },
  undefined,
  ["parent-child-drop-down"]
);
</script>
