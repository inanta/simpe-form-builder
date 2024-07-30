<template>
  <span v-if="savedContent === '' && builder === true" class="text-gray-500"
    >Empty Text</span
  >
  <span v-else class="dark:text-white">{{ savedContent }}</span>
</template>

<script>
import delay from "@/assets/js/delay.js";

import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import ElementPanelList from "@/assets/js/builder/ElementPanelList.js";
import FieldPropertyOptions from "@/assets/js/builder/FieldPropertyOptions";

export default {
  props: {
    app: {
      type: Object,
      default: function () {
        return {};
      }
    },
    builder: {
      type: Boolean,
      default: false
    },
    column: {
      type: Number,
      default: 0
    },
    container: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: function () {
        return {};
      }
    },
    inlineTextContent: {
      type: [Object, String],
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    row: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      api: {
        parameters: {}
      },
      savedContent: "",
      unwatchers: []
    };
  },
  watch: {
    inlineTextContent: {
      handler: function (value) {
        if (typeof value === "string") {
          this.savedContent = value;
        } else if (value.source === "static") {
          this.savedContent = value.value;
        } else if (value.source == "api") {
          const self = this;

          let current_unwatcher = null;

          while ((current_unwatcher = this.unwatchers.pop())) {
            current_unwatcher();
          }

          for (let index = 0; index < value.parameters.length; index++) {
            const parameter = value.parameters[index];

            this.api.parameters[parameter] = "";

            let unwatcher = this.$watch(
              "data." + parameter,
              function (parameter_value) {
                if (typeof parameter_value !== "undefined") {
                  self.api.parameters[parameter] = parameter_value;
                }

                self.fetch();
              },
              {
                immediate: true
              }
            );

            this.unwatchers.push(unwatcher);
          }

          if (value.parameters.length === 0) {
            self.fetch();
          }
        }
      },
      immediate: true
    }
  },
  mounted: function () {},
  methods: {
    fetch: function () {
      const self = this;
      const api = JSON.parse(JSON.stringify(this.inlineTextContent));

      self.savedContent =
        typeof self.inlineTextContent.loading_placeholder === "undefined" ||
        self.inlineTextContent.loading_placeholder === ""
          ? "Loading..."
          : self.inlineTextContent.loading_placeholder;

      if (self.inlineTextContent.is_include_query_string_in_payload) {
        for (const key in self.$route.query) {
          if (Object.hasOwnProperty.call(self.$route.query, key)) {
            const data = self.$route.query[key];

            self.api.parameters[key] = data;
          }
        }
      }

      delay(
        "fetch_" +
          api.url +
          "_" +
          self.container +
          "_" +
          self.row +
          "_" +
          self.column,
        function () {
          let url = api.url;
          let options = {
            method: api.method
          };

          if (api.method === "GET") {
            const qs = new URLSearchParams(self.api.parameters);

            if (qs.toString() !== "") {
              url += "?" + qs;
            }
          } else if (api.method === "POST") {
            let form_data = new FormData();

            for (const key in self.api.parameters) {
              if (Object.hasOwnProperty.call(self.api.parameters, key)) {
                const data = self.api.parameters[key];

                form_data.append(key, data);
              }
            }

            form_data.append("_referer", window.location);

            options.body = form_data;
          }

          fetch(url, options).then(function (response) {
            if (response.status === 200) {
              if (api.response_type === "json") {
                response.json().then(function (response) {
                  let target_property = response;

                  if (
                    typeof api.json_response_path !== "undefined" &&
                    typeof api.json_response_path.length !== "undefined"
                  ) {
                    for (
                      let index = 0;
                      index < api.json_response_path.length;
                      index++
                    ) {
                      target_property =
                        target_property[api.json_response_path[index]];
                    }

                    self.savedContent = target_property;
                  } else {
                    self.savedContent = "";
                  }
                });
              } else {
                response.text().then(function (text) {
                  self.savedContent = text;
                });
              }
            }
          });
        },
        500
      );
    }
  }
};

ElementPanelList.addElement(
  "general",
  "Text",
  "Text",
  "inline-text",
  "mdi mdi-format-text"
);

FieldProperties["inline-text"] = {
  label: {
    label: "Label"
  },
  "inline-text-content": {
    label: "Content"
  }
};

FieldPropertyOptions.addOption(
  "inline-text-content",
  "FieldPropertyValueSource"
);
</script>

<style scoped></style>
