<template>
  <div>
    <div class="mx-auto flex flex-wrap justify-start">
      <div
        v-if="readonly && selectedFiles.length === 0"
        class="dark:text-white"
      >
        -
      </div>
      <template v-else>
        <template
          v-for="(selected_file, selected_file_index) in selectedFiles"
          :key="selected_file.path"
        >
          <div
            v-if="
              isImageFile(selected_file) &&
              fileSelectorShowPreviewForImageFile === true
            "
            class="square-image relative mb-3 w-full rounded bg-white shadow md:mr-[1%] md:mb-[1%] md:w-[19%]"
          >
            <img :src="baseURI + '/' + selected_file.file_path" class="p-1" />
            <div class="absolute top-2 right-2">
              <a
                v-if="
                  !readonly &&
                  (fileSelectorAllowUpdateDelete == true ||
                    (fileSelectorAllowUpdateDelete == false &&
                      typeof data['!id'] === 'undefined') ||
                    (fileSelectorAllowUpdateDelete == false &&
                      typeof data['!id'] !== 'undefined' &&
                      selected_file_index >= initialFileCount))
                "
                v-tooltip
                :title="fileSelectorTooltipDelete"
                class="cursor-pointer rounded border border-light-gray bg-white px-1.5 py-1 text-center text-negative shadow dark:border-negative--dark dark:bg-negative--dark dark:text-white"
                @click.prevent="onFileRemoveClick(selected_file_index)"
              >
                <span class="mdi mdi-delete text-negative-backgroud"></span>
              </a>
              <a
                v-tooltip
                :title="fileSelectorTooltipDownload"
                :href="baseURI + '/' + selected_file.file_path"
                :download="selected_file.filename"
                class="ml-1.5 cursor-pointer rounded border border-light-gray bg-white px-1.5 py-1 text-center text-primary shadow dark:border-primary--dark dark:bg-primary--dark dark:text-white"
              >
                <span class="mdi mdi-download"></span>
              </a>
              <a
                v-if="fileSelectorUpdateMode === 'revision'"
                v-tooltip
                :title="fileSelectorTooltipAddRevision"
                class="ml-1.5 cursor-pointer rounded border border-light-gray bg-primary px-1.5 py-1 text-center text-on-primary shadow dark:border-primary--dark dark:bg-primary--dark dark:text-white"
                @click.prevent="onFileAddRevisionClick(selected_file_index)"
              >
                <span class="mdi mdi-view-grid-plus-outline"></span>
              </a>
            </div>
          </div>
          <div v-else class="w-full pb-2">
            <a :href="baseURI + '/' + selected_file.file_path" target="_blank"
              ><span
                class="mdi"
                :class="getFileIcon(selected_file.filename)"
              ></span>
              {{ selected_file.filename }}</a
            >&nbsp;
            <a
              v-if="
                !readonly &&
                (fileSelectorAllowUpdateDelete == true ||
                  (fileSelectorAllowUpdateDelete == false &&
                    typeof data['!id'] === 'undefined') ||
                  (fileSelectorAllowUpdateDelete == false &&
                    typeof data['!id'] !== 'undefined' &&
                    selected_file_index >= initialFileCount))
              "
              v-tooltip
              :title="fileSelectorTooltipDelete"
              class="cursor-pointer rounded border border-light-gray bg-white px-1.5 py-1 text-center text-negative shadow dark:border-negative--dark dark:bg-negative--dark dark:text-white"
              @click.prevent="onFileRemoveClick(selected_file_index)"
            >
              <span class="mdi mdi-delete text-negative-backgroud"></span>
            </a>
            <a
              v-tooltip
              :title="fileSelectorTooltipDownload"
              :href="baseURI + '/' + selected_file.file_path"
              :download="selected_file.filename"
              class="ml-1.5 cursor-pointer rounded bg-primary px-1.5 py-1 text-center text-on-primary dark:border-primary--dark dark:bg-primary--dark dark:text-white"
            >
              <span class="mdi mdi-download"></span>
            </a>
            <a
              v-if="fileSelectorUpdateMode === 'revision'"
              v-tooltip
              :title="fileSelectorTooltipAddRevision"
              class="ml-1.5 cursor-pointer rounded bg-primary px-1.5 py-1 text-center text-on-primary dark:border-primary--dark dark:bg-primary--dark dark:text-white"
              @click.prevent="onFileAddRevisionClick(selected_file_index)"
            >
              <span class="mdi mdi-view-grid-plus-outline"></span>
            </a>
          </div>
        </template>
      </template>
    </div>
    <button
      v-if="isSelectButtonShown"
      class="rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
      @click="onSelectButtonClick"
    >
      {{ selectButtonLabel }}
    </button>
    <ns-dialog :show="isModalShown" width="50%" @close="isModalShown = false">
      <template #title>
        {{ selectButtonLabel }}
      </template>
      <div>
        <div
          v-if="
            fileSelectorType === 'uploader-browser' ||
            fileSelectorType === 'uploader'
          "
        >
          <input
            ref="file"
            :accept="fileAccept"
            name="files"
            style="display: none"
            type="file"
            multiple
            @change="onUploadFileChange"
          />
          <div
            v-if="fileSelectorType === 'uploader-browser'"
            class="p-2 text-right"
          >
            <button
              v-if="!isUploading"
              :class="{
                'bg-primary dark:bg-primary--dark': !isRefreshing,
                'bg-mid-gray': isRefreshing
              }"
              :disabled="isRefreshing"
              class="rounded px-3 py-2 text-on-primary"
              @click="onRefreshButtonClick"
            >
              <span class="mdi mdi-refresh"></span>
              {{ refreshButtonLabel }}
            </button>
            <button
              v-if="!isUploading"
              class="ml-2 rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
              @click="onUploadButtonClick"
            >
              <span class="mdi mdi-upload"></span> {{ uploadButtonLabel }}
            </button>
            <ns-progress-bar
              v-if="isUploading"
              :progress="uploadProgress"
            ></ns-progress-bar>
            <hr class="mt-2 border-b border-mid-gray" />
          </div>
          <div v-if="fileSelectorType === 'uploader'" class="p-4 text-center">
            <img :src="uploaderImage" class="m-auto w-1/3 pb-4" />
            <button
              v-if="!isUploading"
              class="rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
              @click="onUploadButtonClick"
            >
              <span class="mdi mdi-upload"></span> {{ uploadButtonLabel }}
            </button>
            <ns-progress-bar
              v-if="isUploading"
              :progress="uploadProgress"
            ></ns-progress-bar>
          </div>
        </div>
      </div>
      <div
        v-if="
          fileSelectorType === 'uploader-browser' ||
          fileSelectorType === 'browser'
        "
      >
        <div v-if="fileBrowserPage > 1" class="flex flex-wrap">
          <div
            v-for="(file, file_index) in files"
            :key="file.path"
            class="relative m-[1%] h-0 w-[18%] cursor-pointer rounded-sm border border-mid-gray bg-white bg-cover pb-[18%]"
            :style="{
              'background-image':
                'url(\'' + baseURI + '/' + file.file_path + '\')'
            }"
            @click="onFileClick(file)"
          >
            <div class="absolute top-2 right-2">
              <a
                v-if="fileSelectorAllowDeleteInBrowser"
                class="cursor-pointer rounded border border-light-gray bg-white px-1.5 py-1 text-center shadow"
                @click.stop.prevent="
                  onFileBrowserRemoveButtonClick(file, file_index)
                "
              >
                <span class="mdi mdi-delete text-negative-backgroud"></span>
              </a>
            </div>
          </div>
        </div>
        <div v-if="isRefreshing" class="mx-auto mb-5 mt-1">
          <span class="loader-1"></span>
        </div>
        <div
          v-if="fileBrowserPage <= fileBrowserMaxPage && !isRefreshing"
          class="pb-4 pt-2 text-center"
        >
          <button
            class="rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
            @click="showFiles"
          >
            {{ showMoreButtonLabel }}
          </button>
        </div>
      </div>
    </ns-dialog>
  </div>
</template>

<script>
import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import FieldPropertyOptions from "@/assets/js/builder/FieldPropertyOptions";
import ElementPanelList from "@/assets/js/builder/ElementPanelList.js";

import NsTooltip from "@/directives/NsTooltip";
import NsDialog from "@/components/NS/NsDialog.vue";
import NsProgressBar from "@/components/NS/NsProgressBar.vue";

import getAPI from "@/assets/js/getAPI.js";

import uploaderImage from "@/assets/img/undraw_upload_re_pasx.svg";
import "@/assets/css/loaders/1.css";

export default {
  components: {
    NsDialog,
    NsProgressBar
  },
  directives: { tooltip: NsTooltip },
  inheritAttrs: false,
  props: {
    app: {
      type: Object,
      default: function () {
        return {};
      }
    },
    builder: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Object, Array],
      default: function () {
        return [];
      }
    },
    fileSelectorAllowDeleteInBrowser: {
      type: Boolean,
      default: false
    },
    fileSelectorAllowUpdateAdd: {
      type: Boolean,
      default: true
    },
    fileSelectorAllowUpdateDelete: {
      type: Boolean,
      default: true
    },
    fileSelectorAllowedFileType: {
      type: Object,
      default: function () {
        return {};
      }
    },
    fileSelectorGroup: {
      type: String,
      default: ""
    },
    fileSelectorMaxAllowed: {
      type: [Number, String],
      default: ""
    },
    fileSelectorRenameFile: {
      type: String,
      default: ""
    },
    fileSelectorRefreshButtonLabel: {
      type: String,
      default: "Refresh"
    },
    fileSelectorReturnType: {
      type: String,
      default: "object"
    },
    fileSelectorSelectButtonLabel: {
      type: String,
      default: "Select"
    },
    fileSelectorShowMoreButtonLabel: {
      type: String,
      default: "Show More..."
    },
    fileSelectorShowPreviewForImageFile: {
      type: Boolean,
      default: true
    },
    fileSelectorTooltipAddRevision: {
      type: String,
      default: "Add A Revision"
    },
    fileSelectorTooltipDelete: {
      type: String,
      default: "Delete"
    },
    fileSelectorTooltipDownload: {
      type: String,
      default: "Download"
    },
    fileSelectorType: {
      type: String,
      default: "uploader-browser"
    },
    fileSelectorUpdateMode: {
      type: String,
      default: "alter"
    },
    fileSelectorUploadButtonLabel: {
      type: String,
      default: "Upload"
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
    value: {
      type: [Object, String],
      default: function () {
        return {};
      }
    }
  },
  emits: ["input"],
  data: function () {
    return {
      baseURI: import.meta.env.VITE_FETCH_BASE_URL,

      fileBrowserPage: 1,
      fileBrowserMaxPage: 1,
      files: [],
      filesTotal: 0,
      isUploading: false,
      isModalShown: false,
      isRefreshing: false,
      initialFileCount: 0,
      modalTitle: "",
      selectedFiles: [],
      selectedFileIndex: -1,
      uploaderImage: uploaderImage,
      uploadProgress: 0
    };
  },
  computed: {
    fileAccept: function () {
      const self = this;

      let file_types = [];

      for (
        let index = 0;
        index < self.fileSelectorAllowedFileType.length;
        index++
      ) {
        const file_type = self.fileSelectorAllowedFileType[index];

        file_types.push(file_type.value);
      }

      return file_types.join(",");
    },
    isSelectButtonShown: function () {
      if (this.builder || typeof this.data["!id"] === "undefined") {
        return true;
      }

      return (
        (this.selectedFiles.length < this.fileSelectorMaxAllowed ||
          this.fileSelectorMaxAllowed == "") &&
        this.fileSelectorAllowUpdateAdd == true &&
        this.fileSelectorUpdateMode == "alter" &&
        !this.readonly
      );
    },
    refreshButtonLabel: function () {
      return this.fileSelectorRefreshButtonLabel === undefined ||
        this.fileSelectorRefreshButtonLabel === ""
        ? "Refresh"
        : this.fileSelectorRefreshButtonLabel;
    },
    selectButtonLabel: function () {
      return this.fileSelectorSelectButtonLabel === undefined ||
        this.fileSelectorSelectButtonLabel === ""
        ? "Select"
        : this.fileSelectorSelectButtonLabel;
    },
    showMoreButtonLabel: function () {
      return this.fileSelectorShowMoreButtonLabel === undefined ||
        this.fileSelectorShowMoreButtonLabel === ""
        ? "Show More..."
        : this.fileSelectorShowMoreButtonLabel;
    },
    uploadButtonLabel: function () {
      return this.fileSelectorUploadButtonLabel === undefined ||
        this.fileSelectorUploadButtonLabel === ""
        ? "Upload"
        : this.fileSelectorUploadButtonLabel;
    }
  },
  watch: {
    value: {
      handler: function (value) {
        this.selectedFiles.splice(0);

        if (typeof value === "string") {
          let values = value.split(",");

          for (let index = 0; index < values.length; index++) {
            const value = values[index];

            const is_added = this.selectedFiles.filter(function (item) {
              return item.file_path === value ? true : false;
            });

            if (value !== "" && is_added.length === 0) {
              this.selectedFiles.push({
                filename: value.split("/").pop(),
                file_path: value
              });
            }
          }
        } else {
          for (let index = 0; index < value.length; index++) {
            const file = value[index];

            this.selectedFiles.push(file);
          }
        }

        if (this.initialFileCount === 0) {
          this.initialFileCount = this.selectedFiles.length;
        }
      },
      immediate: true
    }
  },
  methods: {
    getFileIcon: function (file) {
      const file_ext_mapping = {
        jpg: "mdi-file-image",
        jpeg: "mdi-file-image",
        png: "mdi-file-image",
        gif: "mdi-file-image",
        svg: "mdi-file-image",
        pdf: "mdi-file-document",
        doc: "mdi-file-document",
        docx: "mdi-file-document"
      };

      const file_ext = file.split(".").pop();
      const icon = {};

      if (typeof file_ext_mapping[file_ext] !== "undefined") {
        icon[file_ext_mapping[file_ext]] = true;

        return icon;
      }

      return {
        "mdi-file": true
      };
    },
    isImageFile: function (file) {
      let file_ext = file.filename.split(".").pop();

      return ["jpg", "jpeg", "gif", "png", "webp"].includes(
        file_ext.toLowerCase()
      );
    },
    onFileAddRevisionClick: function (index) {
      this.selectedFileIndex = index;
      this.fileBrowserPage = 1;
      this.showFiles();
      this.isModalShown = true;
    },
    onFileBrowserRemoveButtonClick: function (file, file_index) {
      const self = this;

      fetch(
        self.baseURI +
          "/app/api/v1/file/delete/" +
          self.app.slug +
          "/" +
          self.name +
          "/" +
          file.file_path.split("/").pop()
      )
        .then(function (response) {
          return response.json();
        })
        .then(function () {
          self.files.splice(file_index, 1);
        });
    },
    onFileClick: function (file) {
      this.isModalShown = false;

      if (this.selectedFileIndex === -1) {
        this.selectedFiles.push(file);
      } else {
        this.selectedFiles[this.selectedFileIndex] = file;
      }

      this.selectFile();
    },
    onFileRemoveClick: function (index) {
      const self = this;

      self.selectedFiles.splice(index, 1);
      self.selectFile();
    },
    onRefreshButtonClick: function () {
      this.fileBrowserPage = 1;
      this.showFiles();
    },
    onSelectButtonClick: function () {
      this.selectedFileIndex = -1;
      this.fileBrowserPage = 1;
      this.showFiles();
      this.isModalShown = true;
    },
    onUploadButtonClick: function () {
      this.$refs.file.click();
    },
    onUploadFileChange: function () {
      const self = this;

      let xhr = new XMLHttpRequest();
      let files = self.$refs.file.files;

      self.uploadProgress = 0;
      self.isUploading = true;

      xhr.upload.onprogress = function (event) {
        self.uploadProgress = event.loaded / event.total;
      };

      xhr.upload.onerror = function () {
        self.uploadProgress = 0;
        self.isUploading = false;
      };

      xhr.onload = function (event) {
        self.uploadProgress = 0;
        self.isUploading = false;

        if (self.fileSelectorType === "uploader") {
          let response = JSON.parse(event.target.response);

          for (let index = 0; index < response.files.length; index++) {
            const file = response.files[index];

            if (self.selectedFileIndex === -1) {
              self.selectedFiles.push(file);
            } else {
              self.selectedFiles[self.selectedFileIndex] = file;
            }
          }
          self.isModalShown = false;

          self.selectFile();
        } else {
          self.fileBrowserPage = 1;
          self.showFiles();
        }
      };

      let form_data = new FormData();

      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        form_data.append("files[]", file);
      }

      form_data.append("!id", self.data["!id"]);

      xhr.open(
        "POST",
        self.baseURI + "/app/api/v1/elements/" + self.app.slug + "/" + self.name
      );
      xhr.send(form_data);
    },
    selectFile: function () {
      const self = this;

      let value = null;

      if (self.fileSelectorReturnType === "object") {
        value = JSON.parse(JSON.stringify(this.selectedFiles));
      } else {
        let files_path = [];

        for (let index = 0; index < self.selectedFiles.length; index++) {
          const file = self.selectedFiles[index];

          files_path.push(file.file_path);
        }

        if (files_path.length > 0) {
          value = files_path.join(",");
        } else {
          value = "";
        }
      }

      self.$emit("input", {
        target: {
          name: self.name,
          value: value
        }
      });
    },
    showFiles: function () {
      const self = this;
      const page = self.fileBrowserPage;

      self.isRefreshing = true;

      getAPI(
        "app/api/v1/elements/" +
          self.app.slug +
          "/" +
          self.name +
          "?page=" +
          page +
          "&per_page=15"
      ).then(function (response) {
        if (!response.error) {
          if (page === 1) {
            self.files.splice(0);
          }

          for (let index = 0; index < response.files.length; index++) {
            const file = response.files[index];

            self.files.push(file);
          }

          self.filesTotal = response.total;
          self.fileBrowserPage += 1;
          self.fileBrowserMaxPage = Math.ceil(response.total / 15);
          self.isRefreshing = false;
        }
      });
    }
  }
};

ElementPanelList.addElement(
  "general",
  "File Selector",
  "File Selector",
  "file-selector",
  "mdi mdi-image"
);

FieldProperties["file-selector"] = {
  label: {
    label: "Label"
  },
  name: {
    label: "Name"
  },
  "file-selector-type": {
    label: "Type"
  },
  "file-selector-return-type": {
    label: "Return Type"
  },
  "file-selector-max-allowed": {
    label: "Maximum Allowed",
    placeholder: "No Limit"
  },
  "file-selector-group": {
    label: "File Group"
  },
  "file-selector-allowed-file-type": {
    label: "Allowed File Type"
  },
  "file-selector-show-preview-for-image-file": {
    label: "Show Preview For Image File"
  },
  "file-selector-allow-delete-in-browser": {
    label: "Allow Delete In Browser"
  },
  "file-selector-select-button-label": {
    label: "Select Button Label"
  },
  "file-selector-upload-button-label": {
    label: "Upload Button Label"
  },
  "file-selector-refresh-button-label": {
    label: "Refresh Button Label"
  },
  "file-selector-show-more-button-label": {
    label: "Show More Button Label"
  },
  "file-selector-rename-files": {
    label: "Rename Files"
  },
  "file-selector-update-mode": {
    label: "Update Mode"
  },
  "file-selector-allow-update-add": {
    label: "Allow Add On Edit"
  },
  "file-selector-allow-update-delete": {
    label: "Allow Delete On Edit"
  },
  "file-selector-tooltip-add-revision": {
    label: "Add A Revision Tooltip"
  },
  "file-selector-tooltip-delete": {
    label: "Delete Tooltip"
  },
  readonly: {
    label: "Is Read Only"
  },
  validation: {
    label: "Validation"
  }
};

FieldPropertyOptions.addOption("file-selector-type", [
  {
    name: "Uploader & Browser",
    value: "uploader-browser"
  },
  {
    name: "Browser Only",
    value: "browser"
  },
  {
    name: "Uploader Only",
    value: "uploader"
  }
]);

FieldPropertyOptions.addOption("file-selector-return-type", [
  {
    name: "Object",
    value: "object"
  },
  {
    name: "Comma-separated String",
    value: "comma-separated-string"
  }
]);

FieldPropertyOptions.addOption(
  "file-selector-show-preview-for-image-file",
  [
    {
      name: "Yes",
      value: true
    },
    {
      name: "No",
      value: false
    }
  ],
  undefined,
  [],
  true
);

FieldPropertyOptions.addOption(
  "file-selector-allowed-file-type",
  "FieldPropertyValueCollection"
);

FieldPropertyOptions.addOption("file-selector-allow-delete-in-browser", [
  {
    name: "Yes",
    value: true
  },
  {
    name: "No",
    value: false
  }
]);

FieldPropertyOptions.addOption("file-selector-update-mode", [
  {
    name: "Alter",
    value: "alter"
  },
  {
    name: "As Revision",
    value: "revision"
  }
]);

FieldPropertyOptions.addOption(
  "file-selector-allow-update-add",
  [
    {
      name: "No",
      value: false
    },
    {
      name: "Yes",
      value: true
    }
  ],
  undefined,
  [],
  true
);

FieldPropertyOptions.addOption(
  "file-selector-allow-update-delete",
  [
    {
      name: "No",
      value: false
    },
    {
      name: "Yes",
      value: true
    }
  ],
  undefined,
  [],
  true
);
</script>
<style scoped>
.square-image {
  position: relative;
}

.square-image::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.square-image img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}
</style>
