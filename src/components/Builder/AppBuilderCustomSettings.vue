<template>
  <ns-side-panel
    :show="show"
    width="50%"
    title="Settings"
    @close="$emit('close')"
  >
    <div class="p-3">
      <ns-tabs>
        <template
          v-for="(customSetting, customSettingIndex) in settings"
          :key="customSetting.label"
        >
          <ns-tab :title="customSetting.label" :order="customSettingIndex">
            <div
              class="border border-x-0 border-b-mid-gray border-t-primary pb-3 dark:border-b-mid-gray--dark dark:border-t-primary--dark"
            >
              <template
                v-if="
                  typeof customSetting.fields !== 'undefined' &&
                  typeof customSetting.fields.length !== 'undefined'
                "
              >
                <div v-for="field in customSetting.fields" :key="field.name">
                  <div v-if="visibilities[field.name]" class="pt-3">
                    <div class="pb-1">
                      <label :for="field.name">{{ field.label }}</label>
                    </div>
                    <div>
                      <native-html
                        :properties="field"
                        :error="false"
                        :value="internalValues[field.name]"
                        @input="onInput"
                      ></native-html>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="flex p-3">
                  <img
                    src="@/assets/img/undraw_blank_canvas_re_2hwy.svg"
                    class="mx-auto w-1/4"
                  />
                </div>
              </template>
            </div>
          </ns-tab>
        </template>
      </ns-tabs>
      <div class="pt-3">
        <button
          class="mx-auto w-full rounded-sm bg-primary p-2 text-on-primary"
          @click="onSaveButtonClick"
        >
          Save
        </button>
      </div>
    </div>
  </ns-side-panel>
</template>

<script>
import NsSidePanel from "@/components/NS/NsSidePanel.vue";
import NsTabs from "@/components/NS/NsTabs.vue";
import NsTab from "@/components/NS/NsTab.vue";
import NativeHtml from "@/components/Builder/Element/NativeHtml.vue";

import configurations from "@/assets/js/builder/variables/configurations";
import getAPI from "@/assets/js/getAPI.js";

export default {
  components: {
    NsSidePanel,
    NsTabs,
    NsTab,
    NativeHtml
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    values: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    close: null,
    save: null
  },
  data: function () {
    return {
      configurations: configurations,
      // settings: [],
      internalValues: {},
      visibilities: {}
    };
  },
  computed: {
    settings: function () {
      const composed_settings = [];

      for (
        let index = 0;
        index < configurations.builder.customSettings.settings.length;
        index++
      ) {
        const settings = {
          label: configurations.builder.customSettings.settings[index].label,
          fields: []
        };

        for (
          let field_index = 0;
          field_index <
          configurations.builder.customSettings.settings[index].fields.length;
          field_index++
        ) {
          const field = this.cleanAttributes(
            configurations.builder.customSettings.settings[index].fields[
              field_index
            ]
          );

          settings.fields.push(field);
        }

        // this.settings.push(settings);
        composed_settings.push(settings);
      }

      return composed_settings;
    }
  },
  watch: {
    values: {
      handler: function (value) {
        const self = this;

        this.iterateSettings(function (field) {
          const saved_value =
            typeof value[field.name] !== "undefined"
              ? value[field.name]
              : typeof field.value !== "undefined"
                ? field.value
                : "";

          self.internalValues[field.name] = saved_value;
          self.visibilities[field.name] = self.isVisible(field);
        });
      },
      immediate: true
    }
  },
  mounted: async function () {
    // this.initialize();
  },
  methods: {
    cleanAttributes: async function (field) {
      const cleaned_attributes = {};

      for (const key in field) {
        if (Object.prototype.hasOwnProperty.call(field, key)) {
          const attribute = field[key];

          if (key === "attributes") {
            for (const attribute_key in attribute) {
              if (
                Object.prototype.hasOwnProperty.call(attribute, attribute_key)
              ) {
                const element = attribute[attribute_key];

                cleaned_attributes[attribute_key] = element;
              }
            }
          } else if (key === "items") {
            if (
              typeof attribute.source !== "undefined" &&
              attribute.source === "static"
            ) {
              cleaned_attributes["items"] = attribute.values;
            } else if (
              typeof attribute.source !== "undefined" &&
              attribute.source === "api"
            ) {
              const response = await getAPI(attribute.url);
              // cleaned_attributes["items"] = attribute.handler(response);

              // getAPI;

              // console.log(response);

              cleaned_attributes["items"] = attribute.handler(response);

              // console.log(cleaned_attributes);

              // cleaned_attributes["items"] = [
              //   {
              //     label: "",
              //     value: ""
              //   }
              // ];
            } else {
              // cleaned_attributes["items"] = [];

              cleaned_attributes["items"] = [
                {
                  label: "",
                  value: ""
                }
              ];
            }
          } else {
            cleaned_attributes[key] = attribute;
          }
        }
      }

      console.log(cleaned_attributes);

      return cleaned_attributes;
    },
    initialize: function () {
      for (
        let index = 0;
        index < configurations.builder.customSettings.settings.length;
        index++
      ) {
        const settings = {
          label: configurations.builder.customSettings.settings[index].label,
          fields: []
        };

        for (
          let field_index = 0;
          field_index <
          configurations.builder.customSettings.settings[index].fields.length;
          field_index++
        ) {
          const field = this.cleanAttributes(
            configurations.builder.customSettings.settings[index].fields[
              field_index
            ]
          );

          settings.fields.push(field);
        }

        this.settings.push(settings);
      }
    },
    iterateSettings: function (callback) {
      for (const group_key in configurations.builder.customSettings.settings) {
        if (
          Object.prototype.hasOwnProperty.call(
            configurations.builder.customSettings.settings,
            group_key
          )
        ) {
          const custom_setting =
            configurations.builder.customSettings.settings[group_key];

          for (const key in custom_setting.fields) {
            if (
              Object.prototype.hasOwnProperty.call(custom_setting.fields, key)
            ) {
              const field = custom_setting.fields[key];

              callback(field);
            }
          }
        }
      }
    },
    isVisible: function (field) {
      if (!Array.isArray(field.rules)) {
        return true;
      }

      for (let index = 0; index < field.rules.length; index++) {
        const rule = field.rules[index];

        if (!rule.values.includes(this.internalValues[rule.name])) {
          return false;
        }
      }

      return true;
    },
    onInput: function (event) {
      const self = this;

      this.internalValues[event.target.name] = event.target.value;

      console.log(event.target.value);

      this.iterateSettings(function (field) {
        self.visibilities[field.name] = self.isVisible(field);
      });
    },
    onSaveButtonClick: function () {
      this.$emit("save", JSON.parse(JSON.stringify(this.internalValues)));
      this.$emit("close");
    }
  }
};
</script>
