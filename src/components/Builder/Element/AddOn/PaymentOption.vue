<template>
  <div class="flex flex-row">
    <template v-if="paymentOptionType == 'title-description'">
      <div class="w-1/3 font-bold">
        <pre class="whitespace-pre-wrap">{{ title }}</pre>
      </div>
      <div class="w-1/3">
        <pre class="whitespace-pre-wrap">{{ description }}</pre>
      </div>
    </template>
    <template v-else>
      <div class="w-2/3 font-bold">
        <img
          v-if="paymentOptionPicture !== ''"
          :src="paymentOptionPicture"
          class="pr-5"
        />
        <div v-else class="text-red-600">Please Add The Picture URL</div>
      </div>
    </template>
    <div class="ml-auto w-1/3">
      <div
        v-for="(item, itemIndex) in paymentOptionItems"
        :key="item.name"
        class="mb-1"
      >
        <div class="flex flex-row">
          <div class="mr-auto py-2 font-bold">
            {{ item.name }}
          </div>
          <div class="ml-auto px-4 py-2">{{ formatPrice(item.price) }}</div>
          <div class="">
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
                class="!w-16 appearance-none rounded-sm !border-none bg-white px-3 py-1.5 text-center text-base text-black outline-none focus:border-primary"
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
          <div class="px-4 py-2">
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
    }
  },
  emits: ["input"],
  data: function () {
    return {
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
