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
    fields: ["input", "select", "textarea"],
    options: [
      {
        name: "Input",
        value: "input"
      },
      {
        name: "Select",
        value: "select"
      },
      {
        name: "Multiline Text Box",
        value: "textarea"
      }
    ],
    default: "input"
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

  "parent-child-drop-down-parent-element": {
    fields: ["parent-child-drop-down"],
    options: "FieldPropertyElementSelection",
    default: ""
  },
  "parent-child-drop-down-parent-source": {
    fields: ["parent-child-drop-down"],
    options: "FieldPropertyTableColumnSelector",
    default: "",
    configuration: {
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
    }
  },
  "parent-child-drop-down-child-source": {
    fields: ["parent-child-drop-down"],
    options: "FieldPropertyTableColumnSelector",
    default: "",
    configuration: {
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
  },

  "grid-input-rows": {
    fields: ["grid-input"],
    options: "FieldPropertyValueCollection",
    default: "",
    configuration: {
      databaseAdditionalFields: [
        {
          label: "Group By",
          name: "group_by",
          default: "",
          type: "column-selector"
        }
      ]
    }
  },
  "grid-input-columns": {
    fields: ["grid-input"],
    options: "FieldPropertyValueCollection",
    default: ""
  },
  "grid-input-type": {
    fields: ["grid-input"],
    options: [
      {
        name: "Checkbox",
        value: "checkbox"
      },
      {
        name: "Multiple Choice",
        value: "radio"
      },
      {
        name: "Text",
        value: "text"
      },
      {
        name: "Drop-down",
        value: "drop-down"
      }
    ],
    default: "radio"
  },
  "grid-input-drop-down-items": {
    fields: ["grid-input"],
    options: "FieldPropertyValueCollection",
    default: ""
  },
  "grid-input-additional-rows": {
    fields: ["grid-input"],
    options: "FieldPropertyValueCollection",
    default: ""
  },
  "grid-input-additional-rows-type": {
    fields: ["grid-input"],
    options: [
      {
        name: "Checkbox",
        value: "checkbox"
      },
      {
        name: "Multiple Choice",
        value: "radio"
      },
      {
        name: "Text",
        value: "text"
      },
      {
        name: "Drop-down",
        value: "drop-down"
      }
    ],
    default: "radio"
  },
  "grid-input-additional-rows-drop-down-items": {
    fields: ["grid-input"],
    options: "FieldPropertyValueCollection",
    default: ""
  },
  "grid-input-additional-columns": {
    fields: ["grid-input"],
    options: "FieldPropertyValueCollection",
    default: ""
  },
  "grid-input-additional-columns-type": {
    fields: ["grid-input"],
    options: [
      {
        name: "Checkbox",
        value: "checkbox"
      },
      {
        name: "Multiple Choice",
        value: "radio"
      },
      {
        name: "Text",
        value: "text"
      },
      {
        name: "Drop-down",
        value: "drop-down"
      }
    ],
    default: "radio"
  },
  "grid-input-additional-columns-drop-down-items": {
    fields: ["grid-input"],
    options: "FieldPropertyValueCollection",
    default: ""
  },

  /* One To Many Input */
  "one-to-many-input-additional-field": {
    fields: ["one-to-many-input"],
    options: "FieldPropertyValueCollection",
    default: ""
    // configuration: {
    //   hideLabel: true
    // }
  },
  "one-to-many-input-target-table": {
    fields: ["one-to-many-input"],
    options: "FieldPropertyTableColumnSelector",
    default: "",
    configuration: {
      additionalColumnAttributes: [
        {
          label: "Format",
          name: "format",
          value: "general",
          options: [
            { label: "Currency", value: "currency" },
            { label: "General", value: "general" },
            { label: "Date", value: "date" },
            { label: "Number", value: "number" }
          ]
        }
      ],
      additionalFields: [
        {
          label: "Join Column",
          name: "join_column"
        }
      ]
    }
  },
  "one-to-many-input-table": {
    fields: ["one-to-many-input"],
    options: "FieldPropertyTableColumnSelector",
    default: "",
    configuration: {
      additionalColumnAttributes: [
        {
          label: "Format",
          name: "format",
          value: "general",
          options: [
            { label: "Currency", value: "currency" },
            { label: "General", value: "general" },
            { label: "Date", value: "date" },
            { label: "Number", value: "number" }
          ]
        },
        {
          label: "Align",
          name: "align",
          value: "left",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ]
        },
        {
          label: "Visible",
          name: "visible",
          value: true,
          options: [
            { label: "True", value: true },
            { label: "False", value: false }
          ]
        }
      ],
      additionalFields: [
        {
          label: "Primary Key",
          name: "primary_key"
        },
        {
          label: "Search Column",
          name: "search_column"
        }
      ]
    }
  },
  "one-to-many-input-additional-field-format": {
    fields: ["one-to-many-input"],
    options: "FieldPropertyValueCollectionFormat",
    default: "",
    configuration: {
      source: "one-to-many-input-additional-field",
      additionalFieldProperties: [
        {
          label: "Align",
          name: "align",
          value: "left",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ]
        },
        {
          label: "Source",
          name: "source",
          value: "user",
          options: [
            { label: "User Input", value: "user" },
            {
              label: "Function",
              value: "function",
              fields: [
                { label: "Function", name: "function", type: "textarea" }
              ]
            },
            // { label: "Column", value: "column" },
            { label: "Webhook", value: "webhook" }
          ]
        },
        {
          label: "Function",
          name: "function",
          value: "",
          type: "textarea",
          validation: function (properties) {
            if (
              typeof properties !== "undefined" &&
              typeof properties.source !== "undefined" &&
              properties.source === "function"
            ) {
              return true;
            }

            return false;
          }
        }
      ]
    }
  },

  /* Table Input */
  "table-input-additional-field": {
    fields: ["table-input"],
    options: "FieldPropertyValueCollection",
    default: ""
    // configuration: {
    //   hideLabel: true
    // }
  },
  "table-input-target-table": {
    fields: ["table-input"],
    options: "FieldPropertyTableColumnSelector",
    default: "",
    configuration: {
      additionalColumnAttributes: [
        {
          label: "Format",
          name: "format",
          value: "general",
          options: [
            { label: "Currency", value: "currency" },
            { label: "General", value: "general" },
            { label: "Date", value: "date" },
            { label: "Number", value: "number" }
          ]
        }
      ],
      additionalFields: [
        {
          label: "Join Column",
          name: "join_column"
        }
      ]
    }
  },
  "table-input-table": {
    fields: ["table-input"],
    options: "FieldPropertyTableColumnSelector",
    default: "",
    configuration: {
      additionalColumnAttributes: [
        {
          label: "Format",
          name: "format",
          value: "general",
          options: [
            { label: "Currency", value: "currency" },
            { label: "General", value: "general" },
            { label: "Date", value: "date" },
            { label: "Number", value: "number" }
          ]
        },
        {
          label: "Align",
          name: "align",
          value: "left",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ]
        },
        {
          label: "Visible",
          name: "visible",
          value: true,
          options: [
            { label: "True", value: true },
            { label: "False", value: false }
          ]
        }
      ],
      additionalFields: [
        {
          label: "Primary Key",
          name: "primary_key"
        },
        {
          label: "Search Column",
          name: "search_column"
        }
      ],
      showColumnsSelector: true
    }
  },
  "table-input-additional-field-format": {
    fields: ["table-input"],
    options: "FieldPropertyValueCollectionFormat",
    default: "",
    configuration: {
      source: "table-input-additional-field",
      additionalFieldProperties: [
        {
          label: "Align",
          name: "align",
          value: "left",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ]
        },
        {
          label: "Source",
          name: "source",
          value: "user",
          options: [
            { label: "User Input", value: "user" },
            {
              label: "Function",
              value: "function",
              fields: [
                { label: "Function", name: "function", type: "textarea" }
              ]
            },
            // { label: "Column", value: "column" },
            { label: "Webhook", value: "webhook" }
          ]
        },
        {
          label: "Function",
          name: "function",
          value: "",
          type: "textarea",
          validation: function (properties) {
            if (
              typeof properties !== "undefined" &&
              typeof properties.source !== "undefined" &&
              properties.source === "function"
            ) {
              return true;
            }

            return false;
          }
        }
      ]
    }
  },

  /* Inline Text */
  // "inline-text-content": {
  //   fields: ["inline-text"],
  //   options: "FieldPropertyValueCollection"
  // },
  /* Inline Text */

  /* File Selector */
  /*
  "file-selector-type": {
    fields: ["file-selector"],
    options: [
      {
        name: "Uploader & Browser",
        value: "uploader-browser"
      },
      {
        name: "Browser Only",
        value: "browser"
      },
      {
        name: "Uploader Only",
        value: "uploader"
      }
    ],
    default: "uploader-browser"
  },
  "file-selector-return-type": {
    fields: ["file-selector"],
    options: [
      {
        name: "Object",
        value: "object"
      },
      {
        name: "Comma-separated String",
        value: "comma-separated-string"
      }
    ],
    default: "object"
  },
  "file-selector-max-allowed": {
    fields: ["file-selector"],
    default: ""
  },
  "file-selector-allowed-file-type": {
    fields: ["file-selector"],
    options: "FieldPropertyValueCollection",
    default: ""
  },
  */

  /* Autocomplete */
  "autocomplete-source": {
    fields: ["autocomplete"],
    options: "FieldPropertyValueCollection",
    default: "",
    configuration: {
      apiEndpointAdditionalFields: [
        {
          label: "Description Property",
          name: "description_property"
        },
        {
          label: "Search Parameter",
          name: "search_parameter"
        }
      ]
    }
  },

  /* Report Table */
  "report-table-source": {
    fields: ["report-table"],
    options: "FieldPropertyTableColumnSelector",
    default: "",
    configuration: {
      additionalColumnAttributes: [
        {
          label: "Format",
          name: "format",
          value: "general",
          options: [
            { label: "Currency", value: "currency" },
            { label: "General", value: "general" },
            { label: "Date", value: "date" },
            { label: "Number", value: "number" }
          ]
        },
        {
          label: "Align",
          name: "align",
          value: "left",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ]
        }
      ]
    }
  },
  "report-table-filter": {
    fields: ["report-table"],
    options: "FieldPropertyFilterCollection",
    configuration: {
      source: "report-table-source"
    }
  },
  "report-table-sort": {
    fields: ["report-table"],
    options: "FieldPropertySortCollection",
    configuration: {
      source: "report-table-source"
    }
  },

  /* Filter Element */
  "filter-element": {
    fields: ["filter-text", "filter-date-range", "filter-drop-down"],
    options: [
      {
        name: "Text",
        value: "filter-text"
      },
      {
        name: "Date Range",
        value: "filter-date-range"
      },
      {
        name: "Drop Down",
        value: "filter-drop-down"
      }
    ],
    default: "filter-text"
  },
  "filter-condition": {
    fields: ["filter-text", "filter-drop-down"],
    options: [
      { label: "Equals To", value: "=" },
      { label: "Greather Than", value: ">" },
      { label: "Less Than", value: "<" },
      { label: "Greather Than Or Equals To", value: ">=" },
      { label: "Less Than Or Equals To", value: "<=" },
      { label: "Contains", value: "contain" }
    ],
    default: "="
  }
};
