<template>
  <div class="flex flex-col md:flex-row">
    <template v-if="paymentOptionType == 'title-description'">
      <div class="md:pb:0 w-full pb-2 font-bold md:w-3/12">
        <pre class="whitespace-pre-wrap">{{ title }}</pre>
      </div>
      <div class="md:pb:0 w-full pb-2 md:w-4/12">
        <pre class="whitespace-pre-wrap">{{ description }}</pre>
      </div>
    </template>
    <template v-else>
      <div class="md:pb:0 w-full pb-2 font-bold md:w-7/12">
        <img
          v-if="paymentOptionPicture !== ''"
          :src="paymentOptionPicture"
          class="pr-5"
        />
        <div v-else class="text-red-600">Please Add The Picture URL</div>
      </div>
    </template>
    <div class="md:pb:0 ml-auto w-full pb-2 md:w-5/12">
      <div
        v-for="(item, itemIndex) in paymentOptionItems"
        :key="item.name"
        class="mb-1"
      >
        <div class="flex">
          <div class="flex-1 truncate py-2 font-bold">
            {{ item.name }}
          </div>
          <div class="ml-auto flex-1 px-4 py-2 text-right">
            {{ formatPrice(item.price) }}
          </div>
          <div class="flex-1">
            <div class="w-max rounded !border !border-mid-gray">
              <button
                class="!w-9 !border-r px-3 py-1.5 text-base text-black outline-none"
                type="button"
                @click="onMinusButtonClick(itemIndex)"
              >
                -
              </button>
              <input
                v-model="quantity[itemIndex]"
                class="!w-14 appearance-none rounded-sm !border-none bg-white px-3 py-1.5 text-center text-base text-black outline-none focus:border-primary"
                type="text"
                min="0"
              />
              <button
                class="!w-9 !border-l px-3 py-1.5 text-base text-black outline-none"
                type="button"
                @click="onPlusButtonClick(itemIndex)"
              >
                +
              </button>
            </div>
          </div>
          <div class="ml-auto flex-1 px-4 py-2 text-right">
            {{ formatPrice(quantity[itemIndex] * item.price) }}
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import configurations from "@/assets/js/builder/variables/configurations.js";
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

export default {
  inheritAttrs: false,
  props: {
    builder: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: function () {
        return {};
      }
    },
    name: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    paymentOptionDescription: {
      type: String,
      default: ""
    },
    paymentOptionEndDate: {
      type: String,
      default: ""
    },
    paymentOptionItems: {
      type: Array,
      default: function () {
        return [
          {
            name: "Per",
            price: "0"
          }
        ];
      }
    },
    paymentOptionMax: {
      type: String,
      default: "999"
    },
    paymentOptionMin: {
      type: String,
      default: "0"
    },
    paymentOptionPicture: {
      type: String,
      default: ""
    },
    paymentOptionStartDate: {
      type: String,
      default: ""
    },
    paymentOptionTitle: {
      type: String,
      default: ""
    },
    paymentOptionType: {
      type: String,
      default: "title-description"
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ["input"],
  data: function () {
    return {
      lastWatchChangesID: null,
      quantity: []
    };
  },
  computed: {
    title: function () {
      if (this.paymentOptionTitle === "" && this.builder) {
        return "Title";
      }

      return this.paymentOptionTitle;
    },
    description: function () {
      if (this.paymentOptionDescription === "" && this.builder) {
        return "Description";
      }

      return this.paymentOptionDescription;
    },
    maxQuantity: function () {
      let max = 999;

      if (
        this.paymentOptionMax !== "" &&
        Number.isFinite(this.paymentOptionMax)
      ) {
        max = Number.parseFloat(this.paymentOptionMax);
      }

      return max;
    },
    minQuantity: function () {
      let min = 0;

      if (
        this.paymentOptionMin !== "" &&
        Number.isFinite(this.paymentOptionMin)
      ) {
        min = Number.parseFloat(this.paymentOptionMin);
      }

      return min;
    }
  },
  watch: {
    data: {
      handler: function (value) {
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            let field = value[key];

            if (this.isJSON(field)) {
              field = JSON.parse(field);

              if (
                field !== null &&
                typeof field.type !== "undefined" &&
                field.type == "payment-summary" &&
                field.title === this.paymentOptionTitle &&
                field.id !== this.lastWatchChangesID
              ) {
                this.lastWatchChangesID = field.id;

                for (
                  let index = 0;
                  index < this.paymentOptionItems.length;
                  index++
                ) {
                  const item = this.paymentOptionItems[index];

                  if (item.name === field.name) {
                    if (field.operation === "+") {
                      this.onPlusButtonClick(index);
                    } else if (field.operation === "-") {
                      this.onMinusButtonClick(index);
                    } else if (field.operation === "") {
                      this.quantity[index] = 0;
                    }

                    break;
                  }
                }
              }
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    paymentOptionItems: {
      handler: function (values) {
        for (let index = 0; index < values.length; index++) {
          this.quantity[index] = 0;
        }
      },
      immediate: true
    },
    quantity: {
      handler: function (values) {
        const composed_values = [];

        for (let index = 0; index < this.paymentOptionItems.length; index++) {
          const item = this.paymentOptionItems[index];

          composed_values.push({
            title: this.title,
            name: item.name,
            price: item.price,
            quantity: values[index],
            total: values[index] * item.price
          });
        }

        this.$emit("input", {
          target: {
            name: this.name,
            value: JSON.stringify(composed_values)
          }
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    formatPrice: function (price) {
      if (isNaN(price)) {
        price = 0;
      }

      return new Intl.NumberFormat(configurations.locale, {
        style: "currency",
        currency: configurations.currency
      }).format(price);
    },
    isJSON: function (str) {
      try {
        JSON.parse(str);

        return true;
      } catch (e) {
        e;

        return false;
      }
    },
    onMinusButtonClick: function (index) {
      if (this.quantity[index] - 1 < this.minQuantity) {
        this.quantity[index] = this.minQuantity;
      } else {
        this.quantity[index] -= 1;
      }
    },
    onPlusButtonClick: function (index) {
      if (this.quantity[index] + 1 > this.maxQuantity) {
        this.quantity[index] = this.maxQuantity;
      } else {
        this.quantity[index] += 1;
      }
    }
  }
};

elementPanelList.addElement(
  "general",
  "Payment Option",
  "Payment Option",
  "payment-option",
  "mdi mdi-cash-multiple"
);

fieldProperties["payment-option"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "payment-option-type": {
    label: "Type",
    default: "title-description"
  },
  "payment-option-title": {
    label: "Title",
    type: "textarea",
    rules: [
      {
        property: "payment-option-type",
        values: ["title-description"]
      }
    ]
  },
  "payment-option-description": {
    label: "Description",
    type: "textarea",
    rules: [
      {
        property: "payment-option-type",
        values: ["title-description"]
      }
    ]
  },
  "payment-option-picture": {
    label: "Picture",
    rules: [
      {
        property: "payment-option-type",
        values: ["picture"]
      }
    ]
  },
  "payment-option-items": {
    label: "Items"
  },
  "payment-option-min": {
    label: "Min"
  },
  "payment-option-max": {
    label: "Max"
  },
  "payment-option-start-date": {
    label: "Start Date"
  },
  "payment-option-end-date": {
    label: "End Date"
  },
  "payment-option-is-required": {
    label: "Is Required"
  }
};

fieldPropertyOptions.addOption("payment-option-type", [
  {
    name: "Title & Description",
    value: "title-description"
  },
  {
    name: "Picture",
    value: "picture"
  }
]);

fieldPropertyOptions.addOption(
  "payment-option-items",
  "FieldPropertyRepeatInput",
  {
    addButtonLabel: "Add Items",
    columns: [
      { name: "name", placeholder: "Name" },
      { name: "price", placeholder: "Price" }
    ],
    display: "column"
  }
);

fieldPropertyOptions.addOption(
  "payment-option-picture",
  "FieldPropertyUppyUploader"
);

fieldPropertyOptions.addOption(
  "payment-option-start-date",
  "FieldPropertyDateTimeSelection"
);

fieldPropertyOptions.addOption(
  "payment-option-end-date",
  "FieldPropertyDateTimeSelection"
);

fieldPropertyOptions.addOption("payment-option-is-required", [
  {
    name: "No",
    value: false
  },
  {
    name: "Yes",
    value: true
  }
]);
</script>
