export default {
  /* Format 
  "tag / field type": {
    "option name": { label: "label"},
  }
  */
  h1: {
    content: {
      label: "Content"
    }
  },
  input: {
    element: {
      label: "Element Type"
    },
    name: {
      label: "Name"
    },
    label: {
      label: "Label"
    },
    items: {
      label: "Items",
      rules: [
        {
          property: "type",
          values: ["radio"]
        }
      ]
    },
    max: {
      label: "Max",
      rules: [
        {
          property: "type",
          values: ["number", "range"]
        }
      ]
    },
    maxlength: {
      label: "Max Length",
      rules: [
        {
          property: "type",
          values: ["text"]
        }
      ]
    },
    min: {
      label: "Min",
      rules: [
        {
          property: "type",
          values: ["number", "range"]
        }
      ]
    },
    minlength: {
      label: "Min Length",
      rules: [
        {
          property: "type",
          values: ["text"]
        }
      ]
    },
    placeholder: {
      label: "Placeholder"
      // rules: [
      //   {
      //     property: "type",
      //     values: ["email", "number", "password", "tel", "text"]
      //   }
      // ]
    },
    step: {
      label: "Step",
      rules: [
        {
          property: "type",
          values: ["number", "range"]
        }
      ]
    },
    type: {
      label: "Type"
    },
    "checkbox-label": {
      label: "Checkbox Label",
      rules: [
        {
          property: "type",
          values: ["checkbox"]
        }
      ]
    },
    "checked-value": {
      label: "Checkbox Value",
      rules: [
        {
          property: "type",
          values: ["checkbox"]
        }
      ]
    },
    checked: {
      label: "Is Checked",
      rules: [
        {
          property: "type",
          values: ["checkbox"]
        }
      ]
    },
    disabled: {
      label: "Is Disabled"
    },
    readonly: {
      label: "Is Read Only"
    },
    attributes: {
      label: "Attributes"
    },
    validation: {
      label: "Validation"
    }
  },
  p: {
    content: {
      label: "Content"
    }
  },
  select: {
    element: {
      label: "Element Type"
    },
    name: {
      label: "Name"
    },
    label: {
      label: "Label"
    },
    items: {
      label: "Items"
    },
    selected: {
      label: "Default Value"
    },
    multiple: {
      label: "Multiple"
    },
    placeholder: {
      label: "Placeholder"
    },
    size: {
      label: "Size"
    },
    disabled: {
      label: "Is Disabled"
    },
    readonly: {
      label: "Is Read Only"
    },
    attributes: {
      label: "Attributes"
    }
  },
  textarea: {
    element: {
      label: "Element Type"
    },
    name: {
      label: "Name"
    },
    label: {
      label: "Label"
    },
    placeholder: {
      label: "Placeholder"
    },
    rows: {
      label: "Rows"
    },
    disabled: {
      label: "Is Disabled"
    },
    readonly: {
      label: "Is Read Only"
    },
    attributes: {
      label: "Attributes"
    },
    validation: {
      label: "Validation"
    }
  },
  hr: {},

  // "report-table": {
  //   "report-table-title": {
  //     label: "Title"
  //   },
  //   "report-table-source": {
  //     label: "Source"
  //   },
  //   "report-table-filter": {
  //     label: "Static Filters"
  //   },
  //   "report-table-sort": {
  //     label: "Sorts"
  //   },
  //   "report-table-limit": {
  //     label: "Limit",
  //     placeholder: "No Limit"
  //   },
  //   "report-table-empty-items-placeholder": {
  //     label: "Empty Items Placeholder",
  //     placeholder: "No Data"
  //   }
  // },

  "filter-text": {
    "filter-element": {
      label: "Type",
      name: "element"
    },
    label: {
      label: "Label"
    },
    "filter-condition": {
      label: "Condition"
    },
    placeholder: {
      label: "Placeholder"
    },
    value: {
      label: "Default Value"
    }
  },
  "filter-date-range": {
    "filter-element": {
      label: "Type",
      name: "element"
    },
    "date-start-label": {
      label: "Start Label"
    },
    "date-end-label": {
      label: "End Label"
    },
    "date-start-placeholder": {
      label: "Start Placeholder"
    },
    "date-end-placeholder": {
      label: "End Placeholder"
    },
    "date-start-value": {
      label: "Start Value"
    },
    "date-end-value": {
      label: "End Value"
    }
  },
  "filter-drop-down": {
    "filter-element": {
      label: "Type",
      name: "element"
    },
    label: {
      label: "Label"
    },
    items: {
      label: "Items"
    },
    "filter-condition": {
      label: "Condition"
    },
    value: {
      label: "Default Value"
    }
  }
};
