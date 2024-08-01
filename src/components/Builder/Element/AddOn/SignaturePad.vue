<template>
  <div>
    <div
      class="flex rounded-sm border border-dashed border-mid-gray"
      :class="{
        'bg-mid-gray/25 dark:bg-surface--dark-500': savedSignature === '',
        'text-dark-gray dark:text-white': savedSignature === ''
      }"
      :style="{
        height: previewHeight,
        width: previewWidth
      }"
    >
      <div v-if="savedSignature !== ''" class="relative">
        <div class="absolute right-0 top-0 p-2">
          <button
            v-if="!readonly"
            class="rounded-sm bg-negative px-1.5 py-0.5 text-lg text-on-negative dark:bg-negative--dark"
            @click="onClearButtonClick"
          >
            <span class="mdi mdi-delete"></span>
          </button>
        </div>
        <img class="w-full" :src="savedSignature" />
      </div>
      <template v-else>
        <button v-if="!readonly" class="mx-auto" @click="onShowPadButtonClick">
          <span class="mdi mdi-draw"></span> {{ signaturePadPlaceholder }}
        </button>
      </template>
    </div>
    <ns-dialog :show="showPad" :width="dialogWidth" @close="showPad = false">
      <template #title
        ><span class="mdi mdi-draw"></span> {{ computedLabel }}</template
      >
      <div class="flex py-2">
        <div class="relative mx-auto">
          <div class="absolute right-0 top-0 p-1">
            <Transition
              name="data-table-progress-bar"
              enter-active-class="animate__animated animate__fadeIn animate__faster"
              leave-active-class="animate__animated animate__fadeOut animate__faster"
            >
              <button
                v-show="isUploadButtonShown"
                class="rounded bg-primary px-3 py-2 text-sm text-on-primary dark:bg-primary--dark"
                @click="onUploadButtonClick"
              >
                <span class="mdi mdi-upload"></span> {{ uploadButtonCaption }}
              </button>
            </Transition>
            <input
              ref="file"
              accept=".png"
              name="files"
              style="display: none"
              type="file"
              @change="onUploadFileChange"
            />
          </div>
          <div
            class="border border-mid-gray dark:rounded-sm dark:border-surface--dark-500 dark:bg-surface--dark-500"
          >
            <canvas
              ref="pad"
              class="mx-auto rounded-sm"
              :height="signaturePadHeight"
              :width="signaturePadWidth"
            ></canvas>
          </div>
        </div>
      </div>
      <div class="px-2 pb-2 text-center">
        <hr
          class="mb-2 border-t border-mid-gray dark:border-surface--dark-600"
        />
        <button
          class="ml-2 rounded bg-negative px-3 py-2 text-on-negative dark:bg-negative--dark"
          @click="onClearPadButtonClick"
        >
          <span class="mdi mdi-close"></span> {{ clearButtonCaption }}
        </button>
        <button
          class="ml-2 rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
          @click="onSaveButtonClick"
        >
          <span class="mdi mdi-check"></span> {{ saveButtonCaption }}
        </button>
      </div>
    </ns-dialog>
  </div>
</template>

<script>
import SignaturePad from "signature_pad";
import NsDialog from "@/components/NS/NsDialog.vue";

import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";

export default {
  components: {
    NsDialog
  },
  props: {
    error: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    },
    signaturePadClearButtonCaption: {
      type: String,
      default: "Clear"
    },
    signaturePadHeight: {
      type: String,
      default: "300"
    },
    signaturePadPlaceholder: {
      type: String,
      default: "Click here to add signature"
    },
    signaturePadPreviewHeight: {
      type: String,
      default: "300"
    },
    signaturePadPreviewWidth: {
      type: String,
      default: "400"
    },
    signaturePadSaveButtonCaption: {
      type: String,
      default: "Save"
    },
    signaturePadUploadButtonCaption: {
      type: String,
      default: "Upload"
    },
    signaturePadWidth: {
      type: String,
      default: "400"
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {
      isUploadButtonShown: true,
      pad: null,
      savedSignature: "",
      showPad: false
    };
  },
  computed: {
    clearButtonCaption: function () {
      return this.signaturePadClearButtonCaption === ""
        ? "Clear"
        : this.signaturePadClearButtonCaption;
    },
    computedLabel: function () {
      return this.label === "" ? "Add Signature" : this.label;
    },
    dialogWidth: function () {
      return parseInt(this.signaturePadWidth) + 25 + "px";
    },
    previewHeight: function () {
      return this.signaturePadPreviewHeight + "px";
    },
    previewWidth: function () {
      return this.signaturePadPreviewWidth + "px";
    },
    saveButtonCaption: function () {
      return this.signaturePadSaveButtonCaption === ""
        ? "Save"
        : this.signaturePadSaveButtonCaption;
    },
    uploadButtonCaption: function () {
      return this.signaturePadUploadButtonCaption === ""
        ? "Upload"
        : this.signaturePadUploadButtonCaption;
    }
  },
  watch: {
    value: {
      handler: function (value) {
        if (value === null) {
          value = "";
        }

        this.savedSignature = value;
      },
      immediate: true
    }
  },
  mounted: function () {},
  methods: {
    onClearButtonClick: function () {
      this.onClearPadButtonClick();
      this.savedSignature = "";

      this.$emit("input", {
        target: {
          name: this.name,
          value: ""
        }
      });
    },
    onClearPadButtonClick: function () {
      if (this.pad !== null) {
        this.pad.clear();
      }
    },
    onShowPadButtonClick: function () {
      const self = this;

      self.showPad = true;

      self.$nextTick(function () {
        self.pad = new SignaturePad(self.$refs.pad);

        self.pad.addEventListener("beginStroke", function () {
          self.isUploadButtonShown = false;
        });

        self.pad.addEventListener("endStroke", function () {
          self.isUploadButtonShown = true;
        });
      });
    },
    onSaveButtonClick: function () {
      if (this.pad.isEmpty()) {
        alert("Please provide a signature first.");
      } else {
        const dataURL = this.pad.toDataURL();

        this.savedSignature = dataURL;
        this.showPad = false;

        this.$emit("input", {
          target: {
            name: this.name,
            value: dataURL
          }
        });
      }
    },
    onUploadButtonClick: function () {
      const self = this;

      self.$refs.file.click();
    },
    onUploadFileChange: function () {
      const self = this;

      let file = self.$refs.file.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const dataURI = e.target.result;

          self.pad.fromDataURL(dataURI, {
            ratio: 1,
            width: self.signaturePadWidth,
            height: self.signaturePadHeight,
            xOffset: 0,
            yOffset: 0
          });
        };

        reader.readAsDataURL(file);
      }
    }
  }
};

elementPanelList.addElement(
  "general",
  "Signature Pad",
  "Signature Pad",
  "signature-pad",
  "mdi mdi-draw"
);

fieldProperties["signature-pad"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "signature-pad-placeholder": {
    label: "Placeholder"
  },
  "signature-pad-height": {
    label: "Pad Height",
    placeholder: "300"
  },
  "signature-pad-width": {
    label: "Pad Width",
    placeholder: "400"
  },
  "signature-pad-preview-height": {
    label: "Preview Height",
    placeholder: "300"
  },
  "signature-pad-preview-width": {
    label: "Preview Width",
    placeholder: "400"
  },
  readonly: {
    label: "Is Read Only"
  },
  validation: {
    label: "Validation"
  }
};
</script>

<style scoped></style>
