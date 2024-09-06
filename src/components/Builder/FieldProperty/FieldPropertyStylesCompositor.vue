<template>
  <div :class="{ 'h-28': isAddShown }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="onAddButtonClick"
    >
      <span class="mdi mdi-plus"></span> Add Style
    </button>
    <transition
      name="show-add-style-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="isAddShown"
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-auto bg-white p-2 dark:bg-surface--dark-300"
      >
        <div class="flex-grow">
          <template v-if="Object.keys(styles).length > 0">
            <div v-for="(style, key) in styles" :key="key" class="py-0.5">
              <div class="flex">
                <div class="pr-1">
                  <button
                    type="button"
                    class="mr-1 h-5 w-5 rounded-full bg-negative text-on-negative dark:bg-negative--dark dark:text-on-negative--dark"
                    @click="onRemoveStyle(key)"
                  >
                    <span class="mdi mdi-minus"></span>
                  </button>
                </div>
                <div>
                  <div class="font-bold">{{ getStyleLabel(key) }}</div>
                  <div>
                    {{ style }}
                    <button type="button" @click="onEditButtonClick(key)">
                      <span class="mdi mdi-pencil"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>This element has no CSS styling applied.</template>
          <div class="pt-1 text-center">
            <button
              class="h-7 w-7 rounded-full bg-primary text-on-primary dark:bg-primary--dark"
              @click="onShowAddStyleButtonClick"
            >
              <i class="mdi mdi-plus"></i>
            </button>
          </div>
        </div>

        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="isAddShown = false"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="save"
          >
            <span class="mdi mdi-check"></span> Save
          </button>
        </div>
      </div>
    </transition>
    <transition
      name="show-add-style-property-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="isAddStyleShown"
        class="overflow-none absolute left-0 top-0 flex h-full w-full flex-col bg-white p-2 dark:bg-surface--dark-300"
      >
        <div class="py-0.5 pr-1"><b>Property</b></div>
        <div class="py-0.5">
          <div class="pb-1">
            <ns-drop-down-list
              v-model="selectedStyleProperty"
              :items="styleProperties"
              :readonly="isEdit"
              class="w-full rounded-sm border border-primary bg-white px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
            ></ns-drop-down-list>
          </div>
          <div>
            <div
              v-for="(input, inputIndex) in selectedPropertyInput.input"
              :key="input.label"
              class="pb-1"
            >
              <div v-if="selectedPropertyInput.input.length > 1">
                {{ input.label }}
              </div>
              <div>
                <native-html
                  :properties="input"
                  :error="false"
                  :placeholder="input.placeholder"
                  :value="input.value === '' ? input.default : input.value"
                  class="w-full appearance-none rounded-sm border bg-white px-1 py-0.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
                  @input="onInput($event, inputIndex)"
                ></native-html>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-1.5 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="isAddStyleShown = false"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="onAddStyleButtonClick"
          >
            <span class="mdi mdi-plus"></span>Add
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import NsDropDownList from "@/components/NS/NsDropDownList.vue";
import NativeHtml from "@/components/Builder/Element/NativeHtml.vue";

export default {
  name: "FieldPropertyStyleCompositor",
  components: {
    NsDropDownList,
    NativeHtml
  },
  props: {
    // configuration: {
    //   type: Object,
    //   default: function () {
    //     return {
    //       mode: "date-picker"
    //     };
    //   }
    // },
    fieldProperty: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    change: null
  },
  data: function () {
    return {
      isAddShown: false,
      isAddStyleShown: false,
      isEdit: false,
      selectedStyleProperty: "backgroundColor",
      styleProperties: [
        {
          value: "backgroundColor",
          label: "Background Color",
          input: [
            {
              default: "#000000",
              element: "input",
              label: "Color",
              placeholder: "",
              type: "color",
              value: ""
            }
          ]
        },
        {
          value: "border",
          label: "Border",
          input: [
            {
              default: "#000000",
              element: "input",
              label: "Color",
              placeholder: "",
              type: "color",
              value: ""
            },
            {
              default: "solid",
              element: "select",
              label: "Style",
              value: "",
              items: [
                {
                  label: "Solid",
                  value: "solid"
                },
                {
                  label: "Dashed",
                  value: "dashed"
                },
                {
                  label: "Dotted",
                  value: "dotted"
                },
                {
                  label: "Double",
                  value: "double"
                },
                {
                  label: "Hidden",
                  value: "hidden"
                },
                {
                  label: "Groove",
                  value: "groove"
                },
                {
                  label: "Inset",
                  value: "inset"
                },
                {
                  label: "None",
                  value: "none"
                },
                {
                  label: "Outset",
                  value: "outset"
                },
                {
                  label: "Ridge",
                  value: "ridge"
                }
              ]
            },
            {
              default: "1px",
              element: "input",
              label: "Width",
              placeholder: "",
              type: "text",
              value: ""
            }
          ]
        },
        {
          value: "borderColor",
          label: "Border Color",
          input: [
            {
              default: "#000000",
              element: "input",
              label: "Color",
              placeholder: "",
              type: "color",
              value: ""
            }
          ]
        },
        {
          value: "borderStyle",
          label: "Border Style",
          input: [
            {
              default: "solid",
              element: "input",
              label: "Style",
              placeholder: "",
              type: "input",
              value: ""
            }
          ]
        },
        {
          value: "borderWidth",
          label: "Border Width",
          input: [
            {
              default: "#000000",
              element: "input",
              label: "Width",
              placeholder: "Enter size (e.g., 16px, 1.5em, 2rem)",
              type: "input",
              value: ""
            }
          ]
        },
        {
          value: "color",
          label: "Color",
          input: [
            {
              default: "#000000",
              element: "input",
              label: "Color",
              placeholder: "",
              type: "color",
              value: ""
            }
          ]
        },
        {
          value: "margin",
          label: "Margin",
          input: [
            {
              default: "0",
              element: "input",
              label: "Margin",
              placeholder: "Enter size (e.g., 16px, 1.5em, 2rem)",
              type: "text",
              value: ""
            }
          ]
        },
        {
          value: "padding",
          label: "Padding",
          input: [
            {
              default: "0",
              element: "input",
              label: "Padding",
              placeholder: "Enter size (e.g., 16px, 1.5em, 2rem)",
              type: "text",
              value: ""
            }
          ]
        }
      ],
      styles: {},
      value: ""
    };
  },
  computed: {
    selectedPropertyInput: function () {
      const self = this;
      const selected = this.styleProperties.filter(function (value) {
        return value.value === self.selectedStyleProperty;
      });

      return selected[0];
    },
    dropDownItems: function () {
      const items = [];

      for (let index = 0; index < this.styleProperties.length; index++) {
        const element = this.styleProperties[index];

        items.push({
          label: element
        });
      }

      return items;
    }
  },
  watch: {
    properties: function () {
      this.isAddStyleShown = false;
      this.isAddShown = false;
    }
  },
  mounted: function () {},
  methods: {
    getStyleLabel: function (value) {
      for (let index = 0; index < this.styleProperties.length; index++) {
        const property = this.styleProperties[index];

        if (property.value === value) {
          return property.label;
        }
      }
    },
    initializeItems: function () {
      this.styles = {};

      if (typeof this.properties[this.fieldProperty] !== "undefined") {
        const saved_styles = JSON.parse(
          JSON.stringify(this.properties[this.fieldProperty])
        );

        for (const key in saved_styles) {
          if (Object.prototype.hasOwnProperty.call(saved_styles, key)) {
            this.styles[key] = saved_styles[key];
            this.selectedStyleProperty = key;

            const values = saved_styles[key].split(" ");

            for (
              let index = 0;
              index < this.selectedPropertyInput.input.length;
              index++
            ) {
              const input = this.selectedPropertyInput.input[index];

              if (typeof values[index] !== "undefined") {
                input.value = values[index];
              }
            }
          }
        }
      }
    },
    onAddButtonClick: function () {
      this.initializeItems();

      this.isAddShown = true;
    },
    onAddStyleButtonClick: function () {
      this.value = this.selectedPropertyInput.input
        .map(function (input) {
          return input.value === "" ? input.default : input.value;
        })
        .join(" ");

      this.styles[this.selectedStyleProperty] = this.value;
      this.isAddStyleShown = false;
    },
    onInput: function (event, index) {
      this.selectedPropertyInput.input[index].value = event.target.value;
    },
    onEditButtonClick: function (style) {
      this.isEdit = true;
      this.selectedStyleProperty = style;
      this.isAddStyleShown = true;
    },
    onRemoveStyle: function (style) {
      delete this.styles[style];
    },
    onShowAddStyleButtonClick: function () {
      this.isEdit = false;
      this.isAddStyleShown = true;
    },
    save: function () {
      this.isAddShown = false;

      this.$emit(
        "change",
        this.fieldProperty,
        JSON.parse(JSON.stringify(this.styles))
      );
    }
  }
};
</script>
