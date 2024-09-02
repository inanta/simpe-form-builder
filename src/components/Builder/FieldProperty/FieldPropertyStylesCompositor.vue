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
      <span class="mdi mdi-plus"></span> Add Styles
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
          <div class="py-0.5 pr-1"><b>Property</b></div>
          <div class="py-0.5">
            <ns-drop-down-list
              v-model="selectedStyleProperty"
              :items="styleProperties"
              class="w-full rounded-sm border border-primary bg-white outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
            ></ns-drop-down-list>
            <div>
              <div
                v-for="input in selectedPropertyInput[0].input"
                :key="input.label"
              >
                <div>{{ input.label }}</div>
                <div><input :type="input.type" /></div>
              </div>
              <button
                class="rounded-full bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
                @click="addStyle = true"
              >
                <i class="mdi mdi-plus"></i>
              </button>
            </div>
            <!-- <select
              v-model="selectedColumn"
              class="w-full rounded-sm border border-primary bg-white outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              @change="changeTableColumns"
            >
              <option value="">-</option>
              <option
                v-for="column in availableColumns"
                :key="column.name"
                :value="column.name"
              >
                {{ column.name }}
              </option>
            </select> -->
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

export default {
  name: "FieldPropertyStyleCompositor",
  components: {
    NsDropDownList
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
          type: "color",
          input: [{ label: "Color", type: "color" }]
        },
        {
          value: "borderColor",
          label: "Border Color",
          type: "color",
          input: [{ label: "Color", type: "color" }]
        },
        {
          value: "color",
          label: "Color",
          type: "color",
          input: [{ label: "Color", type: "color" }]
        }
      ]
    };
  },
  computed: {
    selectedPropertyInput: function () {
      const self = this;

      return this.styleProperties.filter(function (value) {
        // console.log(value.value === self.selectedStyleProperty);

        return value.value === self.selectedStyleProperty;
      });
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
    initializeItems: function () {},
    add: function () {
      this.initializeItems();

      this.showAdd = true;
    }
  }
};
</script>
