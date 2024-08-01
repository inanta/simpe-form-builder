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
    class: {
      label: "Class"
    },
    disabled: {
      label: "Is Disabled"
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
  },
  p: {
    content: {
      label: "Content"
    }
  },
  select: {
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
    class: {
      label: "Class"
    },
    disabled: {
      label: "Is Disabled"
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
  },
  textarea: {
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
    class: {
      label: "Class"
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
  },
  hr: {
    class: {
      label: "Class"
    },
    attrs: {
      label: "Attributes"
    }
  }
};
