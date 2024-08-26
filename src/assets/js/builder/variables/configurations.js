export default {
  builder: {
    databaseSelection: false,
    hiddenFields: true,
    computedFields: false,
    customSettings: {
      show: true,
      settings: [
        {
          label: "General",
          fields: [
            {
              attributes: {
                type: "text"
              },
              element: "input",
              label: "Redirect URL",
              name: "redirect"
            },
            {
              attributes: {
                min: "0",
                type: "number",
                step: "1"
              },
              element: "input",
              label: "Secure Download",
              name: "download_expiry",
              value: "300"
            }
          ]
        },
        {
          label: "Workflow"
        },
        {
          label: "Autoresponder"
        },
        {
          label: "Spam Protection",
          fields: [
            {
              element: "select",
              label: "Protection Type",
              name: "protection_type",
              options: [
                {
                  label: "-- None --",
                  value: ""
                },
                {
                  label: "hCaptcha",
                  value: "hcaptcha"
                },
                {
                  label: "reCAPTCHA V2",
                  value: "recaptcha_v2"
                },
                {
                  label: "reCAPTCHA V3",
                  value: "recaptcha_v3"
                }
              ],
              value: ""
            },
            {
              attributes: {
                type: "text"
              },
              element: "input",
              label: "Action (for V3 Only)",
              name: "protection_action",
              rules: [
                {
                  name: "protection_type",
                  values: ["recaptcha_v3"]
                }
              ]
            },
            {
              attributes: {
                min: "0",
                max: "1",
                type: "number",
                step: "0.1",
                value: "0"
              },
              element: "input",
              label: "Minimum Score 0-1 (for V3 only)",
              name: "protection_score",
              rules: [
                {
                  name: "protection_type",
                  values: ["recaptcha_v3"]
                }
              ]
            }
          ]
        },
        {
          label: "Webhook",
          fields: [
            {
              attributes: {
                type: "checkbox"
              },
              element: "input",
              label: "Enable Webhook",
              items: [{ label: "Yes", value: "on" }],
              name: "webhook_enabled"
            },
            {
              element: "select",
              label: "Type",
              name: "webhook_type",
              options: [
                {
                  label: "HTTP",
                  value: "HTTP"
                },
                {
                  label: "Internal evaluate code",
                  value: "EVAL"
                }
              ],
              value: "HTTP"
            },
            {
              element: "select",
              label: "Method",
              name: "webhook_method",
              options: [
                {
                  label: "GET",
                  value: "GET"
                },
                {
                  label: "POST",
                  value: "POST"
                }
              ],
              rules: [
                {
                  name: "webhook_type",
                  values: ["HTTP"]
                }
              ],
              value: "GET"
            },
            {
              attributes: {
                type: "text"
              },
              element: "input",
              label: "URL",
              name: "webhook_url",
              rules: [
                {
                  name: "webhook_type",
                  values: ["HTTP"]
                }
              ]
            },
            {
              attributes: {
                type: "checkbox"
              },
              element: "input",
              label: "Send Form Data",
              items: [{ label: "Yes", value: "on" }],
              name: "webhook_send_form_data",
              rules: [
                {
                  name: "webhook_type",
                  values: ["HTTP"]
                }
              ]
            },
            {
              attributes: {
                type: "checkbox"
              },
              element: "input",
              label: "Custom Payload",
              items: [{ label: "Yes", value: "on" }],
              name: "webhook_send_custom_payload",
              rules: [
                {
                  name: "webhook_type",
                  values: ["HTTP"]
                }
              ]
            },
            {
              attributes: {
                rows: 8
              },
              element: "textarea",
              label: "POST Payload (Eval code)",
              name: "webhook_post_payload"
            },
            {
              attributes: {
                type: "text"
              },
              element: "input",
              label: "Content Type Headers",
              name: "webhook_content_type",
              rules: [
                {
                  name: "webhook_type",
                  values: ["HTTP"]
                }
              ]
            }
          ]
        }
      ]
    },
    fieldLogic: false,
    messages: {
      importApp: "Import Full Event"
    },
    rowClickAction: "view",
    showDuplicateButton: true,
    showExportButton: true,
    showMoreButton: false,
    showViewButton: false,
    title: "Form Builder"
  },
  locale: "en-AU",
  currency: "AUD",
  appBuilderFile: "AppBuilderFetch"
};
