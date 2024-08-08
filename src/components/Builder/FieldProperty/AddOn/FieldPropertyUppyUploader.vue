<template>
  <div>
    <button
      ref="trigger"
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      @click="upload"
    >
      <span class="mdi mdi-plus"></span> Select File
    </button>
    <div ref="target"></div>
  </div>
</template>

<script>
/* global Uppy */

export default {
  name: "FieldPropertyUppyUploader",
  props: {
    fieldProperty: {
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
  emits: {
    change: null
  },
  data: function () {
    return {
      value: {}
    };
  },
  computed: {
    addButtonLabel: function () {
      if (typeof this.configuration.addButtonLabel !== "undefined") {
        return this.configuration.addButtonLabel;
      }

      return "Add Items";
    }
  },
  watch: {
    properties: function () {
      this.value = this.properties[this.fieldProperty];
    }
  },
  mounted: function () {
    this.value = this.properties[this.fieldProperty];

    this.init();
  },
  methods: {
    init: function () {
      const maxFileSize = 10 * 1048576,
        maxFiles = 1,
        uploadFolder = "modules/_admin/uploads";

      var t =
        uploadFolder == "assets" ? "assets_presign_url" : "upload_presign_url";
      var t_register =
        uploadFolder == "assets" ? "assets_create" : "upload_create";
      var config = {
        autoProceed: false,
        restrictions: {
          maxFileSize: maxFileSize,
          maxNumberOfFiles: maxFiles
        }
      };

      var allowedFiles = ["image/*"];
      if (allowedFiles != "") {
        config.restrictions.allowedFileTypes = allowedFiles;
      }

      const token = document
        .querySelector('[name="csrf"]')
        .getAttribute("content");

      var fieldID = "uppy-uploader";

      const self = this;

      const baseURI = import.meta.env.VITE_FETCH_BASE_URL;
      const preSignedURL = baseURI + "/appii/upload/fe/get_presigned_url";

      Uppy.Core(config)
        .use(Uppy.Dashboard, {
          id: fieldID,
          inline: false,
          note: "Up to " + maxFiles + " files, " + 10 + "MB each",
          width: "100%",
          height: 350,
          target: self.$refs.target,
          trigger: self.$refs.trigger,
          replaceTargetContent: true,
          browserBackButtonClose: true
        })
        .use(Uppy.AwsS3, {
          getUploadParameters: function (file) {
            console.log("uploading");
            return fetch(preSignedURL, {
              method: "POST",
              headers: {
                "X-CSRF-Token": token,
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                t: t,
                file_name: file.name.toLowerCase(),
                file_extension: file.extension,
                file_type: file.meta.type,
                upload_time: file.progress.uploadStarted,
                upload_path: "modules/_admin/uploads"
              })
            })
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                return {
                  method: uploadFolder == "assets" ? "PUT" : "POST",
                  url:
                    uploadFolder == "assets"
                      ? data.presign.urls[0].upload_url
                      : data.presign.upload_url,
                  fields: data.presign.upload_url_payload
                };
              });
          }
        })
        .on("upload-success", function () {})
        .on("complete", function (result) {
          result.successful.map(function (response) {
            return fetch("/appii/upload/fe/create", {
              method: "POST",
              headers: {
                "X-CSRF-Token": token,
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                t: t_register,
                file_upload_url: response.uploadURL,
                file_type: response.type,
                file_name: response.name.toLowerCase(),
                folder: uploadFolder,
                expires_in: 300
              })
            })
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                data = data[0] != undefined ? data[0] : data;

                self.$emit("change", self.fieldProperty, data.url);
              });
          });
        });
    },
    upload: function () {}
  }
};
</script>
