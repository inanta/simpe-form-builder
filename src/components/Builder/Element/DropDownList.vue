<template>
  <ns-drop-down-list
    :items="allItems"
    :placeholder="placeholder"
    :readonly="readonly"
    :selected="selected"
    class="w-full rounded-sm border border-mid-gray bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:border-surface--dark-400 dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
    @change="onDropDownItemChange"
  ></ns-drop-down-list>
</template>

<script>
import NsDropDownList from "../../NS/NsDropDownList.vue";

import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import ElementPanelList from "@/assets/js/builder/ElementPanelList.js";
import FieldPropertyOptions from "@/assets/js/builder/FieldPropertyOptions";

export default {
  components: {
    NsDropDownList
  },
  props: {
    builder: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    dropDownListItems: {
      type: Object,
      default: function () {
        return {};
      }
    },
    dropDownListSelected: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: function () {
        return {};
      }
    },
    name: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {
      isInitialValue: true
    };
  },
  computed: {
    allItems: function () {
      const self = this;

      let items =
        self.dropDownListItems !== null &&
        typeof self.dropDownListItems.value !== "undefined"
          ? JSON.parse(JSON.stringify(this.dropDownListItems.value))
          : JSON.parse(JSON.stringify(this.dropDownListItems));

      if (!Array.isArray(items)) {
        items = [];
      }

      return items;
    },
    selected: function () {
      return this.value !== "" ? this.value : this.dropDownListSelected;
    }
  },
  watch: {},
  methods: {
    onDropDownItemChange: function (value) {
      this.$emit("input", {
        target: {
          name: this.name,
          value: value,
          isInitialValue: this.isInitialValue
        }
      });

      if (this.isInitialValue == true) {
        this.isInitialValue = false;
      }
    }
  }
};

ElementPanelList.addElement(
  "general",
  "Drop Down List",
  "Drop Down List",
  "drop-down-list",
  "mdi mdi-arrow-down-drop-circle"
);

FieldProperties["drop-down-list"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  readonly: {
    label: "Is Read Only"
  },
  "drop-down-list-items": {
    label: "Items"
  },
  "drop-down-list-selected": {
    label: "Default Value"
  },
  placeholder: {
    label: "Placeholder"
  },
  validation: {
    label: "Validation"
  }
};

FieldPropertyOptions.addOption(
  "drop-down-list-items",
  "FieldPropertyValueCollection",
  {
    databaseAdditionalFields: [
      {
        label: "Allow Empty",
        name: "allow_empty",
        default: false,
        options: [
          {
            label: "No",
            name: false
          },
          {
            label: "Yes",
            name: true
          }
        ]
      }
    ]
  }
);
</script>

<style scoped></style>
