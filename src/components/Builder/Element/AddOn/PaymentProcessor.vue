<template>
  <div>
    <template v-if="builder">
      <div
        class="rounded border border-mid-gray p-3 text-center text-lg font-semibold text-mid-gray shadow-inner"
      >
        Payment section will be displayed here
      </div>
    </template>
  </div>
</template>

<script>
// import configurations from "@/assets/js/builder/variables/configurations.js";
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
// import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

export default {
  inheritAttrs: false,
  props: {
    builder: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {};
  },
  computed: {},
  watch: {},
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
  }
};
</script>
