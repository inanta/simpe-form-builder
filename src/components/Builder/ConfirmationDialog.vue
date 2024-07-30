<template>
  <ns-dialog :show="isDialogShown" width="30%" @close="$emit('close')">
    <template #title
      ><span class="mdi mdi-help-circle"></span> {{ title }}</template
    >
    <div class="p-3 text-center">
      <slot>Confirm?</slot>
    </div>
    <div class="p-3 text-center">
      <button
        ref="cancel-confirm-button"
        class="rounded bg-negative px-3 py-2 text-on-negative dark:bg-negative--dark"
        @click="$emit('close')"
        @keyup.right="$refs['save-confirm-button'].focus()"
      >
        <span class="mdi mdi-close"></span> {{ noLabel }}
      </button>
      <button
        ref="save-confirm-button"
        class="ml-2 rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
        @click="
          $emit('confirm');
          $emit('close');
        "
        @keyup.left="$refs['cancel-confirm-button'].focus()"
      >
        <span class="mdi mdi-check"></span> {{ yesLabel }}
      </button>
    </div>
  </ns-dialog>
</template>

<script>
import NsDialog from "../NS/NsDialog.vue";

export default {
  name: "ConfirmationDialog",
  components: {
    NsDialog
  },
  props: {
    message: {
      type: String,
      default: ""
    },
    noLabel: {
      type: String,
      default: "No"
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "Confirmation"
    },
    yesLabel: {
      type: String,
      default: "Yes"
    }
  },
  emits: ["close", "confirm"],
  data: function () {
    return {
      isDialogShown: false
    };
  },
  watch: {
    show: {
      handler: function (value) {
        const self = this;

        self.isDialogShown = value;

        if (value) {
          self.$nextTick(function () {
            self.$refs["cancel-confirm-button"].focus();
          });
        }
      },
      immediate: true
    }
  },
  methods: {}
};
</script>
