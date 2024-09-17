export default {
  addOption: function (
    property,
    options,
    configuration = undefined,
    fields = [],
    default_value = ""
  ) {
    this[property] = {
      fields: fields,
      options: options,
      default: default_value,
      configuration: configuration
    };
  },
  removeOption: function (property) {
    delete this[property];
  },
  attrs: {
    options: "FieldPropertyValueCollection",
    configuration: {
      addButtonLabel: "Add Attributes",
      sources: {
        "static-label-value": {
          configuration: {
            label: "Name",
            placeholder: "Name",
            value: "Value"
          }
        }
      }
    }
  },
  checked: {
    fields: ["input"],
    options: "FieldPropertyValueCollectionProperties",
    configuration: {
      source: "items",
      additionalFieldProperties: [
        {
          label: "Is Checked",
          name: "checked",
          value: false,
          options: [
            { label: "No", value: false },
            { label: "Yes", value: true }
          ]
        }
      ],
      addButtonLabel: "Set Checked"
    }
  },
  disabled: {
    fields: ["input", "select", "textarea"],
    options: [
      {
        name: "No",
        value: false
      },
      {
        name: "Yes",
        value: true
      }
    ]
  },
  element: {
    fields: ["h1", "h2", "h3", "h4", "h5", "h6"],
    options: [
      {
        name: "Heading 1",
        value: "h1"
      },
      {
        name: "Heading 2",
        value: "h2"
      },
      {
        name: "Heading 3",
        value: "h3"
      },
      {
        name: "Heading 4",
        value: "h4"
      },
      {
        name: "Heading 5",
        value: "h5"
      },
      {
        name: "Heading 6",
        value: "h6"
      }
    ]
  },
  items: {
    fields: ["select", "filter-drop-down"],
    options: "FieldPropertyValueCollection",
    default: "",
    configuration: {
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
  },
  multiple: {
    fields: ["select"],
    options: [
      {
        name: "False",
        value: false
      },
      {
        name: "True",
        value: true
      }
    ],
    default: false
  },
  readonly: {
    fields: ["input", "select", "textarea"],
    options: [
      {
        name: "No",
        value: false
      },
      {
        name: "Yes",
        value: true
      }
    ]
  },
  rows: {
    fields: ["textarea"],
    default: 2
  },
  size: {
    fields: ["select"],
    default: 1
  },
  style: {
    options: "FieldPropertyStylesCompositor"
  },
  type: {
    fields: ["input"],
    options: [
      {
        name: "Checkbox",
        value: "checkbox"
      },
      {
        name: "Date",
        value: "date"
      },
      {
        name: "Email",
        value: "email"
      },
      {
        name: "File",
        value: "file"
      },
      {
        name: "Number",
        value: "number"
      },
      {
        name: "Password",
        value: "password"
      },
      {
        name: "Range",
        value: "range"
      },
      {
        name: "Radio Button",
        value: "radio"
      },
      {
        name: "Telephone",
        value: "tel"
      },
      {
        name: "Text Box",
        value: "text"
      },
      {
        name: "Time",
        value: "time"
      }
    ],
    default: "text"
  },
  validation: {
    fields: ["input", "textarea"],
    options: "FieldPropertyValidationCollection"
  },
  "dataot-payment-field": {
    fields: ["input"],
    options: [
      { name: "-", value: "" },
      { name: "First Name", value: "billing_first_name" },
      { name: "Last Name", value: "billing_last_name" },
      { name: "Street 1", value: "billing-address-1" },
      { name: "Street 2", value: "billing-address-2" },
      { name: "City", value: "billing-city" },
      { name: "State", value: "billing-address-2" },
      { name: "Country", value: "billing-country" },
      { name: "Postal Code", value: "billing-zip" },
      { name: "Phone", value: "billing_phone" },
      { name: "Email", value: "billing_email" }
    ],
    default: "text"
  }
};
