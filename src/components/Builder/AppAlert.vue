<template>
  <ns-dialog :show="isAlertShown" :width="width" @close="isAlertShown = false">
    <div class="flex flex-col px-5 py-5">
      <div class="mx-auto text-6xl">
        <template v-if="icon !== ''">
          <div class="animate__animated animate__tada animate__repeat-3">
            <span
              :class="{
                'mdi mdi-check-circle-outline': icon == 'success',
                'mdi mdi-alert-circle-outline': icon == 'error',
                'mdi mdi-help-circle-outline': icon == 'question'
              }"
            ></span>
          </div>
        </template>
      </div>
      <div class="mx-auto py-6 text-xl font-bold">{{ message }}</div>
      <div class="mx-auto">
        <button
          class="rounded bg-primary px-3 py-2 text-on-primary"
          @click="isAlertShown = false"
        >
          {{ closeButtonCaption }}
        </button>
      </div>
    </div>
  </ns-dialog>
</template>

<script>
import NsDialog from "@/components/NS/NsDialog.vue";

export default {
  components: {
    NsDialog
  },
  data: function () {
    return {
      closeButtonCaption: "OK",
      icon: "",
      iconMapping: {},
      isAlertShown: false,
      message: "Alert",
      title: "",
      width: "50%"
    };
  },
  mounted: function () {
    document.addEventListener("app:alert", this.showAlert);
  },
  unmounted: function () {
    document.removeEventListener("app:alert", this.showAlert);
  },
  methods: {
    showAlert: function (event) {
      const self = this;

      if (typeof event.detail.title !== "undefined") {
        self.title = event.detail.title;
      }

      if (typeof event.detail.icon !== "undefined") {
        self.icon = event.detail.icon;
      }

      if (typeof event.detail.message !== "undefined") {
        self.message = event.detail.message;
      }

      if (typeof event.detail.closeButtonCaption !== "undefined") {
        self.closeButtonCaption = event.detail.closeButtonCaption;
      }

      if (typeof event.detail.width !== "undefined") {
        self.width = event.detail.width;
      }

      self.isAlertShown = true;
    }
  }
};
</script>
