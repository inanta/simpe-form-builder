<template>
  <div class="overflow-hidden">
    <div
      v-if="users.update.length > 0 || builder"
      class="animate__animated animate__fadeInDown animate__faster"
    >
      <div ref="update-record-text"></div>
    </div>
    <div
      v-if="users.read.length > 0 || builder"
      class="animate__animated animate__fadeInDown animate__faster"
    >
      <div ref="read-record-text"></div>
    </div>
  </div>
</template>

<script>
import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import ElementPanelList from "@/assets/js/builder/ElementPanelList.js";

import getAPI from "@/assets/js/getAPI.js";

export default {
  components: {},
  props: {
    builder: {
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
    activityIndicatorsReadText: {
      type: String,
      default: ""
    },
    activityIndicatorsUpdateText: {
      type: String,
      default: ""
    },
    activityIndicatorsFormat: {
      type: String,
      default: "html"
    },
    value: {
      type: Object,
      default: function () {
        return {
          id: null,
          users: { update: [], read: [] }
        };
      }
    }
  },
  data: function () {
    return {
      id: null,
      timeoutID: null,
      users: {
        read: [],
        update: []
      }
    };
  },
  computed: {
    readRecordText: function () {
      return this.activityIndicatorsReadText.replace("$users", this.readUsers);
    },
    readUsers: function () {
      if (this.builder) {
        return ["User 3", "User 4", "User 5"].join(", ");
      } else {
        if (
          typeof this.value.users !== "undefined" &&
          typeof this.value.users.read !== "undefined"
        ) {
          return this.value.users.read.join(", ");
        }
      }

      return "";
    },
    updateRecordText: function () {
      return this.activityIndicatorsUpdateText.replace(
        "$users",
        this.updateUsers
      );
    },
    updateUsers: function () {
      if (this.builder) {
        return ["User 1", "User 2", "User 3"].join(", ");
      } else {
        if (
          typeof this.users.update !== "undefined" &&
          this.users.update.length > 0
        ) {
          return this.users.update.join(", ");
        }
      }

      return "";
    },
    userPicture: function () {
      if (this.value.user.picture === "") {
        return (
          import.meta.env.VITE_FETCH_BASE_URL + "/system/user/picture/anonymous"
        );
      }

      return this.value.user.picture;
    }
  },
  watch: {
    activityIndicatorsReadText: {
      handler: function () {
        this.$nextTick(function () {
          this.renderReadRecordText();
          this.renderUpdateRecordText();
        });
      },
      immediate: true
    },
    activityIndicatorsUpdateText: {
      handler: function () {
        this.$nextTick(function () {
          this.renderReadRecordText();
          this.renderUpdateRecordText();
        });
      },
      immediate: true
    },
    value: {
      handler: function (value) {
        this.users = value.users;

        this.$nextTick(function () {
          this.renderReadRecordText();
          this.renderUpdateRecordText();
        });

        if (value.id !== null) {
          this.fetch();
        }
      },
      immediate: true
    }
  },
  unmounted: function () {
    clearTimeout(this.timeoutID);
  },
  methods: {
    fetch: function () {
      const self = this;

      self.timeoutID = setTimeout(function () {
        if (self.value.id !== null) {
          getAPI(
            "app/api/v1/elements/" +
              self.value.app +
              "/" +
              self.name +
              "?id=" +
              self.value.id
          )
            .then(function (response) {
              self.users.read = response.users.read;
              self.users.update = response.users.update;

              self.$nextTick(function () {
                self.renderReadRecordText();
                self.renderUpdateRecordText();
              });

              self.fetch();
            })
            .catch(function () {});
        }
      }, 5000);
    },
    renderReadRecordText: function () {
      this.$nextTick(function () {
        if (typeof this.$refs["read-record-text"] !== "undefined") {
          if (this.activityIndicatorsFormat === "html") {
            this.$refs["read-record-text"].innerHTML = this.readRecordText;
          } else {
            this.$refs["read-record-text"].innerText = this.readRecordText;
          }
        }
      });
    },
    renderUpdateRecordText: function () {
      this.$nextTick(function () {
        if (typeof this.$refs["update-record-text"] !== "undefined") {
          if (this.activityIndicatorsFormat === "html") {
            this.$refs["update-record-text"].innerHTML = this.updateRecordText;
          } else {
            this.$refs["update-record-text"].innerText = this.updateRecordText;
          }
        }
      });
    }
  }
};

ElementPanelList.addElement(
  "general",
  "Activity Indicators",
  "Activity Indicators",
  "activity-indicators",
  "mdi mdi-information"
);

FieldProperties["activity-indicators"] = {
  label: {
    label: "Label"
  },
  name: {
    label: "Name"
  },
  "activity-indicators-read-text": {
    label: "Read Record Text",
    type: "textarea"
  },
  "activity-indicators-update-text": {
    label: "Update Record Text",
    type: "textarea"
  },
  "activity-indicators-format": {
    label: "Format"
  }
};
</script>

<style scoped></style>
