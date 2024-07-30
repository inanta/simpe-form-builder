<template>
  <ns-drop-down-list
    :items="items"
    :placeholder="placeholder"
    class="w-full appearance-none rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary"
    @change="onInput"
  ></ns-drop-down-list>
</template>

<script>
import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import ElementPanelList from "@/assets/js/builder/ElementPanelList.js";
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

      self.$watch(
        "data." + self.parentChildDropDownParentElement.name,
        function (value) {
          if (
            typeof self.data[self.parentChildDropDownParentElement.name] !==
            "undefined"
          ) {
            AppBuilder.data({
              table: self.parentChildDropDownChildSource.table,
              columns: self.parentChildDropDownChildSource.columns.map(
                function (item) {
                  return item.name;
                }
              ),
              filters: {
                operator: "and",
                conditions: [
                  {
                    field: self.parentChildDropDownChildSource.parent_column,
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
                    record[self.parentChildDropDownChildSource.label_column],
                  value:
                    record[self.parentChildDropDownChildSource.value_column]
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

ElementPanelList.addElement(
  "general",
  "Parent Child Drop Down",
  "Parent Child Drop Down",
  "parent-child-drop-down",
  "mdi mdi-menu-down"
);

FieldProperties["parent-child-drop-down"] = {
  element: {
    label: "Element Type"
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
  }
};
</script>
