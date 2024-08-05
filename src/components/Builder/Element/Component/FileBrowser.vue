<template>
  <div class="flex" :class="{ 'flex-col': view == 'list' }">
    <div v-if="files.length == 0">
      <span class="mdi mdi-file-question"></span>
      No files have been uploaded yet.
    </div>
    <div v-else>
      <div v-for="(file, file_index) in files" :key="file_index">
        <a :href="baseURI + '/' + file.file_path" :download="file.filename">
          <div class="text-lg">
            <span class="mdi" :class="getFileIcon(file.file_path)"></span>
            {{ file.filename }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  inheritAttrs: false,
  props: {
    files: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  emits: ["input"],
  data: function () {
    return {
      baseURI: import.meta.env.VITE_FETCH_BASE_URL,
      isImagePreviewShown: false,
      view: "list"
    };
  },
  computed: {},
  methods: {
    imagePreviewShownStyle: function (file) {
      if (this.isImagePreviewShown) {
        return {
          "background-image":
            "url('" + this.baseURI + "/" + file.file_path + "')"
        };
      }
      return {};
    },

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

      if (typeof file !== "undefined") {
        const file_ext = file.split(".").pop();
        const icon = {};

        if (typeof file_ext_mapping[file_ext] !== "undefined") {
          icon[file_ext_mapping[file_ext]] = true;

          return icon;
        }
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
          //self.files.splice(file_index, 1);
          console.log(file_index);
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
    }
  }
};
</script>

<style>
.mdi::before {
}
</style>
