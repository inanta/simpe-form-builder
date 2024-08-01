<template>
  <ns-drop-down-list
    :items="items"
    :placeholder="placeholder"
    class="w-full appearance-none rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary"
    @change="onInput"
  ></ns-drop-down-list>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";
import NsDropDownList from "../../NS/NsDropDownList.vue";

import AppBuilder from "@/assets/js/AppBuilder.js";

export default {
  components: { NsDropDownList },
  inheritAttrs: false,
  props: {
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
    parentChildDropDownListParentElement: {
      type: Object,
      default: function () {
        return {};
      }
    },
    parentChildDropDownListChildSource: {
      type: Object,
      default: function () {
        return {};
      }
    },
    placeholder: {
      type: String,
      default: ""
    },
    size: { type: String, default: "1" }
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

      console.log(
        "self.parentChildDropDownListParentElement.name",
        self.parentChildDropDownListParentElement.name
      );

      self.$watch(
        "data." + self.parentChildDropDownListParentElement.name,
        function (value) {
          if (
            typeof self.data[self.parentChildDropDownListParentElement.name] !==
            "undefined"
          ) {
            AppBuilder.data({
              table: self.parentChildDropDownListChildSource.table,
              columns: self.parentChildDropDownListChildSource.columns.map(
                function (item) {
                  return item.name;
                }
              ),
              filters: {
                operator: "and",
                conditions: [
                  {
                    field:
                      self.parentChildDropDownListChildSource.parent_column,
                    condition: "=",
                    value: value
                  }
                ]
              }
            }).then(function (results) {
              self.items.splice(0);

              for (let index = 0; index < results.records.length; index++) {
                const record = results.records[index];

                self.items.push({
                  label:
                    record[
                      self.parentChildDropDownListChildSource.label_column
                    ],
                  value:
                    record[self.parentChildDropDownListChildSource.value_column]
                });
              }

              self.value = self.items[0].value;
              self.$emit("input", {
                target: {
                  name: self.name,
                  value: self.value
                }
              });
            });
          }
        },
        {
          immediate: true
        }
      );
      // }
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
  "Parent Child Drop Down List",
  "Parent Child Drop Down List",
  "parent-child-drop-down-list",
  "mdi mdi-menu-down"
);

fieldProperties["parent-child-drop-down-list"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "parent-child-drop-down-list-parent-element": {
    label: "Parent Element"
  },
  "parent-child-drop-down-list-child-source": {
    label: "Child Source"
  },
  placeholder: {
    label: "Placeholder"
  }
};

fieldPropertyOptions.addOption(
  "parent-child-drop-down-list-parent-element",
  "FieldPropertyElementSelection"
);

fieldPropertyOptions.addOption(
  "parent-child-drop-down-list-child-source",
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
  }
);
</script>
