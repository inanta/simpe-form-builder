<template>
  <div>
    <div v-if="!readonly" class="payment-fields">
      <div
        v-if="paymentProcessorDefineAmount === 'yes'"
        class="!mb-0 flex flex-col pb-3"
      >
        <label for="username">Amount</label>
        <input
          type="number"
          name="amount"
          placeholder=""
          :class="{
            'border-mid-gray dark:border-surface--dark-500': !error,
            'border-negative dark:border-negative--dark': error
          }"
          class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
        />
      </div>
      <div v-else>
        <input type="hidden" :value="paymentProcessorAmount" name="amount" />
      </div>
      <div class="!mb-0 flex flex-col pb-3">
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
      <div class="!mb-0 flex flex-col pb-3">
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
          @input="onCCInput"
        />
      </div>
      <div class="!mb-0 flex flex-col pb-3">
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
    <div v-else>Included with form. Please manually check status.</div>
  </div>
</template>

<script>
/* global cc_format */
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
    error: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    paymentProcessorGateway: {
      type: String,
      default: ""
    },
    paymentProcessorDefineAmount: {
      type: String,
      default: "no"
    },
    paymentProcessorAmount: {
      type: String,
      default: "0"
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      scripts: [],
      years: []
    };
  },
  mounted: function () {
    const baseURI = import.meta.env.VITE_FETCH_BASE_URL;

    const scripts = [
      "https://secure.ewaypayments.com/scripts/eCrypt.min.js",
      baseURI + "/assets/modules/homepage/js/jquery-3.2.1.min.js",
      baseURI + "/assets/modules/ooc_ecommerce/js/ecommerce_common.js",
      baseURI + "/assets/modules/_admin/js/custom/formbuilder/formbuilder.js"
    ];

    for (let index = 0; index < scripts.length; index++) {
      const script = document.createElement("script");

      script.src = scripts[index];
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      this.scripts.push(script);
    }

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
    for (let index = 0; index < this.scripts.length; index++) {
      const script = this.scripts[index];

      document.head.removeChild(script);
    }
  },
  methods: {
    onCCInput: function ($event) {
      let value = $event.target.value.match(/\d/g),
        result = "";

      if (value) {
        result = cc_format(value.join(""));
      }

      $event.target.value = result;
    }
  }
};

elementPanelList.addElement(
  "general",
  "Payment Processor",
  "Payment Processor",
  "payment-processor",
  "mdi mdi-cart-check"
);

fieldProperties["payment-processor"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "payment-processor-gateway": {
    label: "Gateway"
  },
  "payment-processor-define-amount": {
    label: "Allow User Define Amount"
  },
  "payment-processor-amount": {
    label: "Amount"
  }
};

fieldPropertyOptions.addOption("payment-processor-gateway", [
  {
    name: "Eway",
    value: "248"
  }
]);

fieldPropertyOptions.addOption("payment-processor-define-amount", [
  {
    name: "No",
    value: "no"
  },
  {
    name: "Yes",
    value: "yes"
  }
]);
</script>
