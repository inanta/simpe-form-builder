<template>
  <div class="flex flex-row">
    <div class="flex-1 font-bold">
      <img
        v-if="paymentOptionWithImageImage !== ''"
        :src="paymentOptionWithImageImage"
      />
      <div v-else>No Image</div>
    </div>
    <div class="flex-1">
      <div class="flex flex-row">
        <div class="mr-auto flex-1 py-2 font-bold">
          {{ paymentOptionWithImageName }}
        </div>
        <div class="ml-auto flex-1 px-4 py-2">{{ formattedPrice }}</div>
        <div class="flex-1">
          <div class="w-max rounded border">
            <button
              class="w-9 border-r px-3 py-1.5 text-base text-black outline-none"
              @click="onMinusButtonClick"
            >
              -
            </button>
            <input
              v-model="quantity"
              class="w-20 appearance-none rounded-sm border-none bg-white px-3 py-1.5 text-center text-base text-black outline-none focus:border-primary"
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
        <div class="flex-1 px-4 py-2">{{ formattedTotalPrice }}</div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
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
    // paymentOptionDescription: {
    //   type: String,
    //   default: ""
    // },
    paymentOptionWithImageImage: {
      type: String,
      default: ""
    },
    paymentOptionWithImageMax: {
      type: String,
      default: "10"
    },
    paymentOptionWithImageMin: {
      type: String,
      default: "0"
    },
    paymentOptionWithImageName: {
      type: String,
      default: ""
    },
    paymentOptionWithImagePrice: {
      type: String,
      default: ""
    }
    // paymentOptionTitle: {
    //   type: String,
    //   default: ""
    // }
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
  "Payment Option With Image",
  "Payment Option With Image",
  "payment-option-with-image",
  "mdi mdi-cash-multiple"
);

fieldProperties["payment-option-with-image"] = {
  label: {
    label: "Label"
  },
  "payment-option-with-image-title": {
    label: "Title",
    type: "textarea"
  },
  "payment-option-with-image-description": {
    label: "Description",
    type: "textarea"
  },
  "payment-option-with-image-name": {
    label: "Option Name"
  },
  "payment-option-with-image-price": {
    label: "Price"
  },
  "payment-option-with-image-min": {
    label: "Min"
  },
  "payment-option-with-image-max": {
    label: "Max"
  },
  "payment-option-with-image-is-required": {
    label: "Is Required"
  }
};
</script>

<style scoped></style>
