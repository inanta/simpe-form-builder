<template>
  <div data-component="payment-summary" class="ml-2 border border-mid-gray p-3">
    <div class="heading">{{ paymentSummaryTitle }}</div>
    <div
      v-for="(payment, paymentIndex) in paymentOptions"
      :key="paymentIndex"
      class="flex border-b border-mid-gray py-3"
    >
      <div class="pr-3 font-bold">{{ payment.title }}</div>
      <div class="ml-auto">
        <div
          v-for="(item, itemIndex) in payment.items"
          :key="itemIndex"
          class="mb-1"
        >
          <div class="flex flex-row">
            <div class="mr-auto truncate py-2 font-bold">
              {{ item.name }}
            </div>
            <div class="ml-auto px-4 py-2">{{ formatPrice(item.price) }}</div>
            <div class="">
              <div class="w-max rounded !border !border-mid-gray">
                <button
                  class="!w-9 !border-r px-3 py-1.5 text-base text-black outline-none"
                  type="button"
                  @click="onMinusButtonClick(item)"
                >
                  -
                </button>
                <input
                  v-model="item.quantity"
                  class="!w-16 appearance-none rounded-sm !border-none bg-white px-3 py-1.5 text-center text-base text-black outline-none focus:border-primary"
                  type="text"
                  min="0"
                  readonly
                />
                <button
                  class="!w-9 !border-l px-3 py-1.5 text-base text-black outline-none"
                  type="button"
                  @click="onPlusButtonClick(item)"
                >
                  +
                </button>
              </div>
            </div>
            <div class="px-4 py-2">
              {{ formatPrice(item.quantity * item.price) }}
            </div>
            <div>
              <button
                type="button"
                class="rounded bg-negative px-3 py-2 text-on-negative"
                @click="onRemoveButtonClick(item)"
              >
                <span class="mdi mdi-delete"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex pt-4 text-right font-bold">
      <div class="ml-auto">TOTAL</div>
      <div class="pl-4">{{ formatPrice(total) }}</div>
    </div>
  </div>
</template>

<script>
import configurations from "@/assets/js/builder/variables/configurations.js";
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
// import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
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
    error: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    paymentSummaryTitle: {
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
  emits: ["input"],
  data: function () {
    return {
      paymentOptions: [],
      quantity: []
    };
  },
  computed: {
    total: function () {
      let total = 0;

      for (
        let optionIndex = 0;
        optionIndex < this.paymentOptions.length;
        optionIndex++
      ) {
        const option = this.paymentOptions[optionIndex];

        for (let index = 0; index < option.items.length; index++) {
          const item = option.items[index];

          total += item.quantity * item.price;
        }
      }

      return total;
    }
  },
  watch: {
    data: {
      handler: function (value) {
        const options = [];

        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            if (this.isJSON(value[key])) {
              const data = JSON.parse(value[key]);

              if (Array.isArray(data)) {
                const items = {
                  title: "",
                  items: []
                };

                for (let index = 0; index < data.length; index++) {
                  const item = data[index];

                  if (
                    typeof item.title !== "undefined" &&
                    typeof item.name !== "undefined" &&
                    typeof item.price !== "undefined" &&
                    typeof item.quantity !== "undefined" &&
                    typeof item.total !== "undefined" &&
                    item.quantity > 0
                  ) {
                    items.title = item.title;
                    items.items.push(item);
                  }
                }

                if (items.items.length > 0) {
                  options.push(items);
                }
              }
            }
          }
        }

        this.paymentOptions = options;
      },
      deep: true,
      immediate: true
    }
  },
  mounted: function () {},
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
    onMinusButtonClick: function (item) {
      item = JSON.parse(JSON.stringify(item));
      item.operation = "-";
      item.type = "payment-summary";
      item.id =
        Date.now().toString(36) + Math.random().toString(36).substring(2);

      this.$emit("input", {
        target: {
          name: this.name,
          value: JSON.stringify(item)
        }
      });
    },
    onPlusButtonClick: function (item) {
      item = JSON.parse(JSON.stringify(item));
      item.operation = "+";
      item.type = "payment-summary";
      item.id =
        Date.now().toString(36) + Math.random().toString(36).substring(2);

      this.$emit("input", {
        target: {
          name: this.name,
          value: JSON.stringify(item)
        }
      });
    },
    onRemoveButtonClick: function (item) {
      item = JSON.parse(JSON.stringify(item));
      item.operation = "";
      item.type = "payment-summary";
      item.id =
        Date.now().toString(36) + Math.random().toString(36).substring(2);

      this.$emit("input", {
        target: {
          name: this.name,
          value: JSON.stringify(item)
        }
      });
    },
    isJSON: function (str) {
      try {
        JSON.parse(str);

        return true;
      } catch (e) {
        e;

        return false;
      }
    }
  }
};

elementPanelList.addElement(
  "general",
  "Payment Summary",
  "Payment Summary",
  "payment-summary",
  "mdi mdi-cart-plus"
);

fieldProperties["payment-summary"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "payment-summary-title": {
    label: "Title"
  }
};
</script>
