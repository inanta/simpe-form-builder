<template>
  <ns-side-panel
    :show="show"
    width="50%"
    title="Custom Settings"
    @close="$emit('close')"
  >
    <div class="p-3">
      <ns-tabs>
        <template
          v-for="(customSetting, customSettingIndex) in configurations.builder
            .customSettings.settings"
          :key="customSetting.label"
        >
          <ns-tab :title="customSetting.label" :order="customSettingIndex">
            <div v-for="field in customSetting.fields" :key="field.name">
              <div v-if="visibilities[field.name]" class="pt-3">
                <div>
                  <label :for="field.name">{{ field.label }}</label>
                </div>
                <div>
                  <native-html
                    :properties="cleanAttributes(field)"
                    :error="false"
                    :value="field.value"
                    @input="onInput"
                  ></native-html>
                </div>
              </div>
            </div>
          </ns-tab>
        </template>
      </ns-tabs>
      <div class="p-2">
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
      type: Array,
      default: function () {
        return [
          {
            name: "",
            value: ""
          }
        ];
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
      internalValues: {},
      visibilities: {}
    };
  },
  computed: {},
  watch: {
    values: {
      handler: function (value) {
        // customSetting in configurations.builder.customSettings.settings
        // this.initializeValue(value);
        const self = this;

        this.iterateSettings(function (field) {
          const saved_value =
            typeof value[field.name] !== "undefined"
              ? value[field.name]
              : typeof field.value !== "undefined"
              ? field.value
              : "";

          // console.log("SV", field);

          self.internalValues[field.name] = saved_value;
          self.visibilities[field.name] = self.isVisible(field);
        });
      },
      immediate: true
    }
  },
  mounted: function () {},
  methods: {
    cleanAttributes: function (field) {
      const cleaned_attributes = {};

      for (const key in field) {
        if (Object.prototype.hasOwnProperty.call(field, key)) {
          const attribute = field[key];

          // console.log(key, attribute);

          if (key === "attributes") {
            for (const attribute_key in attribute) {
              if (
                Object.prototype.hasOwnProperty.call(attribute, attribute_key)
              ) {
                const element = attribute[attribute_key];

                cleaned_attributes[attribute_key] = element;
              }
            }
          } else if (key === "options") {
            cleaned_attributes["items"] = attribute;
          } else {
            cleaned_attributes[key] = attribute;
          }
        }
      }

      return cleaned_attributes;
    },
    /*
    initializeValue: function (value) {
      for (const group_key in configurations.builder.customSettings.settings) {
        if (
          Object.prototype.hasOwnProperty.call(
            configurations.builder.customSettings.settings,
            group_key
          )
        ) {
          const custom_setting =
            configurations.builder.customSettings.settings[group_key];

          // internalValues[custom_setting]

          // console.log("INIT");

          for (const key in custom_setting.fields) {
            if (
              Object.prototype.hasOwnProperty.call(custom_setting.fields, key)
            ) {
              const field = custom_setting.fields[key];
              const saved_value =
                typeof value[field.name] !== "undefined"
                  ? value[field.name]
                  : typeof field.value !== "undefined"
                  ? field.value
                  : "";

              console.log("SV", field);

              this.internalValues[field.name] = saved_value;
              this.visibilities[field.name] = this.isVisible(field);
            }
          }

          // console.log(custom_setting);
        }
      }

      // console.log("inter", this.internalValues);
      // console.log("visib", this.visibilities);
    },
    */
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

          // internalValues[custom_setting]

          // console.log("INIT");

          for (const key in custom_setting.fields) {
            if (
              Object.prototype.hasOwnProperty.call(custom_setting.fields, key)
            ) {
              const field = custom_setting.fields[key];

              callback(field);
              // const saved_value =
              //   typeof value[field.name] !== "undefined"
              //     ? value[field.name]
              //     : typeof field.value !== "undefined"
              //     ? field.value
              //     : "";

              // console.log("SV", field);

              // this.internalValues[field.name] = saved_value;
              // this.visibilities[field.name] = this.isVisible(field);
            }
          }

          // console.log(custom_setting);
        }
      }

      // console.log("inter", this.internalValues);
      // console.log("visib", this.visibilities);
    },
    isVisible: function (field) {
      if (!Array.isArray(field.rules)) {
        return true;
      }

      for (let index = 0; index < field.rules.length; index++) {
        const rule = field.rules[index];

        // console.log(field.name, this.internalValues, rule.name);

        // console.log("rule", rule, rule.name, this.internalValues[rule.name]);

        if (!rule.values.includes(this.internalValues[rule.name])) {
          return false;
        }
      }

      return true;
    },
    onInput: function (event) {
      // console.log(event.target.value);

      const self = this;

      this.internalValues[event.target.name] = event.target.value;

      this.iterateSettings(function (field) {
        self.visibilities[field.name] = self.isVisible(field);
      });

      // this.initializeValue(this.internalValues);

      // this.visibilities = isVisible();
    },
    // onAddButtonClick: function () {
    //   this.internalValues.push({
    //     name: "",
    //     value: ""
    //   });
    // },
    // onRemoveButtonClick: function (index) {
    //   this.internalValues.splice(index, 1);
    // },
    onSaveButtonClick: function () {
      this.$emit("save", this.internalValues);
      this.$emit("close");
    }
  }
};
</script>
