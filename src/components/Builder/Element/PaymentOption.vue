<template>
  <div class="flex flex-row">
    <template v-if="paymentOptionType == 'title-description'">
      <div class="w-1/3 font-bold">
        <pre>{{ paymentOptionTitle }}</pre>
      </div>
      <div class="w-1/3">
        <pre>{{ paymentOptionDescription }}</pre>
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
      <div class="flex flex-row">
        <div class="mr-auto py-2 font-bold">
          {{ paymentOptionName }}
        </div>
        <div class="ml-auto px-4 py-2">{{ formattedPrice }}</div>
        <div class="">
          <div class="w-max rounded border">
            <button
              class="w-9 border-r px-3 py-1.5 text-base text-black outline-none"
              @click="onMinusButtonClick"
            >
              -
            </button>
            <input
              v-model="quantity"
              class="w-16 appearance-none rounded-sm border-none bg-white px-3 py-1.5 text-center text-base text-black outline-none focus:border-primary"
              type="text"
              min="0"
            />
            <button
              class="w-9 border-l px-3 py-1.5 text-base text-black outline-none"
              @click="onPlusButtonClick"
            >
              +
            </button>
          </div>
        </div>
        <div class="px-4 py-2">{{ formattedTotalPrice }}</div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
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
    label: {
      type: String,
      default: ""
    },
    paymentOptionDescription: {
      type: String,
      default: ""
    },
    paymentOptionMax: {
      type: String,
      default: "999"
    },
    paymentOptionMin: {
      type: String,
      default: "0"
    },
    paymentOptionName: {
      type: String,
      default: ""
    },
    paymentOptionPicture: {
      type: String,
      default: ""
    },
    paymentOptionPrice: {
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
  data: function () {
    return {
      quantity: 0
    };
  },
  computed: {
    formattedPrice: function () {
      return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD"
      }).format(this.paymentOptionPrice);
    },
    formattedTotalPrice: function () {
      return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD"
      }).format(this.paymentOptionPrice * this.quantity);
    }
  },
  mounted: function () {},
  methods: {
    onMinusButtonClick: function () {
      if (this.quantity - 1 < 0) {
        this.quantity = 0;
      } else {
        this.quantity -= 1;
      }
    },
    onPlusButtonClick: function () {
      if (this.quantity + 1 > this.paymentOptionMax) {
        this.quantity = this.paymentOptionMax;
      } else {
        this.quantity += 1;
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
  label: {
    label: "Label"
  },
  "payment-option-type": {
    label: "Type"
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
  "payment-option-name": {
    label: "Option Name"
  },
  "payment-option-price": {
    label: "Price"
  },
  "payment-option-min": {
    label: "Min"
  },
  "payment-option-max": {
    label: "Max"
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
</script>
