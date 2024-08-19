<template>
  <div>
    <!-- <template v-if="builder">
      <div
        class="rounded border border-mid-gray p-3 text-center text-lg font-semibold text-mid-gray shadow-inner"
      >
        Payment section will be displayed here
      </div>
    </template> -->
    <div class="payment-fields">
      <div class="flex flex-col pb-3">
        <label for="username">Full Name (On The Card)</label>
        <input
          type="text"
          name="card_holder"
          placeholder=""
          :class="{
            'border-mid-gray dark:border-surface--dark-500': !error,
            'border-negative dark:border-negative--dark': error
          }"
          class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
        />
      </div>
      <div class="flex flex-col pb-3">
        <label for="cardNumber">Card Number</label>
        <input
          type="text"
          name="card_number"
          placeholder="4444xxxx"
          ooc-cc-format
          :class="{
            'border-mid-gray dark:border-surface--dark-500': !error,
            'border-negative dark:border-negative--dark': error
          }"
          class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
        />
      </div>
      <div class="flex flex-col pb-3">
        <label>Expiration</label>
        <div class="flex flex-row space-x-2">
          <select
            name="card_exp_mm"
            :class="{
              'border-mid-gray dark:border-surface--dark-500': !error,
              'border-negative dark:border-negative--dark': error
            }"
            class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
          >
            <option value="01">January</option>
            <option value="02">Febuary</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            name="card_exp_yy"
            :class="{
              'border-mid-gray dark:border-surface--dark-500': !error,
              'border-negative dark:border-negative--dark': error
            }"
            class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <input
            type="text"
            placeholder="CVV"
            name="card_cvv"
            :class="{
              'border-mid-gray dark:border-surface--dark-500': !error,
              'border-negative dark:border-negative--dark': error
            }"
            class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import configurations from "@/assets/js/builder/variables/configurations.js";
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
    paymentProcessorGateway: {
      type: String,
      default: ""
    }
  },
  data: function () {
    return {
      script: null,
      years: []
    };
  },
  mounted: function () {
    this.script = document.createElement("script");
    this.script.src = "https://secure.ewaypayments.com/scripts/eCrypt.min.js";
    this.script.async = true;
    this.script.defer = true;
    document.head.appendChild(this.script);

    const date = new Date();

    for (
      let index = date.getFullYear();
      index <= date.getFullYear() + 10;
      index++
    ) {
      this.years.push(index);
    }
  },
  beforeUnmount: function () {
    if (this.script) {
      document.head.removeChild(this.script);
    }
  },
  methods: {}
};

elementPanelList.addElement(
  "general",
  "Payment Processor",
  "Payment Processor",
  "payment-processor",
  "mdi mdi-cart-check"
);

fieldProperties["payment-processor"] = {
  label: {
    label: "Label"
  },
  "payment-processor-gateway": {
    label: "Gateway"
  }
};

fieldPropertyOptions.addOption("payment-processor-gateway", [
  {
    name: "Eway",
    value: "eway"
  }
]);
</script>
