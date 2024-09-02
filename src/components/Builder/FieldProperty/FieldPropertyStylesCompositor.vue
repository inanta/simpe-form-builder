<template>
  <!-- <div>
    <div v-for="property, propertyName in styleProperties" :key="propertName"></div>
  </div> -->
  <div :class="{ 'h-28': showAdd }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="add"
    >
      <span class="mdi mdi-plus"></span> Add Style
    </button>

    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-auto bg-white p-2 dark:bg-surface--dark-300"
      >
        <div class="flex-grow">
          <div v-for="(style, key) in styles" :key="key">
            <span class="mdi mdi-check-circle"></span> {{ getStyleLabel(key) }}:
            {{ style }}
          </div>

          <div class="py-0.5 pr-1"><b>Property</b></div>
          <div class="py-0.5">
            <div class="pb-1">
              <ns-drop-down-list
                v-model="selectedStyleProperty"
                :items="styleProperties"
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
                    :value="input.value"
                    class="w-full appearance-none rounded-sm border bg-white px-1 py-0.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
                    @input="onInput($event, inputIndex)"
                  ></native-html>
                </div>
              </div>
              <div class="pt-1 text-center">
                <button
                  class="rounded-full bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
                  @click="addStyle"
                >
                  <i class="mdi mdi-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="showAdd = false"
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
      showAdd: false,
      selectedStyleProperty: "backgroundColor",
      styleProperties: [
        {
          value: "backgroundColor",
          label: "Background Color",
          input: [
            {
              element: "input",
              label: "Color",
              type: "color"
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
              type: "color",
              value: ""
            },
            {
              default: "solid",
              element: "select",
              label: "Style",
              type: "text",
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
              element: "input",
              label: "Color",
              type: "color"
            }
          ]
        },
        {
          value: "borderStyle",
          label: "Border Style",
          input: [
            {
              element: "input",
              label: "Style",
              type: "input"
            }
          ]
        },
        {
          value: "borderWidth",
          label: "Border Width",
          input: [
            {
              element: "input",
              label: "Width",
              type: "input"
            }
          ]
        },
        {
          value: "color",
          label: "Color",
          input: [
            {
              element: "input",
              label: "Color",
              type: "color"
            }
          ]
        },
        {
          value: "margin",
          label: "Margin",
          input: [
            {
              element: "input",
              label: "Margin",
              type: "text"
            }
          ]
        },
        {
          value: "padding",
          label: "Padding",
          input: [
            {
              element: "input",
              label: "Padding",
              type: "text"
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
    properties: {
      handler: function () {
        this.value = this.properties[this.fieldProperty];
      },
      immediate: true
    },
    value: function (value) {
      this.$emit("change", this.fieldProperty, value);
    }
  },
  mounted: function () {},
  methods: {
    add: function () {
      this.initializeItems();

      this.showAdd = true;
    },
    addStyle: function () {
      this.styles[this.selectedStyleProperty] = this.value;
    },
    getStyleLabel: function (value) {
      for (let index = 0; index < this.styleProperties.length; index++) {
        const property = this.styleProperties[index];

        if (property.value === value) {
          return property.label;
        }
      }
    },
    initializeItems: function () {
      this.style = {};
    },
    onInput: function (event, index) {
      this.selectedPropertyInput.input[index].value = event.target.value;

      this.value = this.selectedPropertyInput.input
        .map(function (input) {
          return input.value;
        })
        .join(" ");

      console.log(this.value);
    },
    save: function () {
      this.showAdd = false;

      this.$emit(
        "change",
        this.fieldProperty,
        JSON.parse(JSON.stringify(this.styles))
      );
    }
  }
};
</script>
