<template>
  <div v-if="id != null || builder" v-bind="cleanAttributes(properties)">
    <ns-tabs>
      <ns-tab
        title="Activities"
        :order="activityFeedsDefaultTab === 'activities' ? 0 : 1"
      >
        <div class="py-5 px-3">
          <div class="flex">
            <div>
              <img :src="userPicture" class="h-14 w-14 rounded" />
            </div>
            <div class="w-full pl-2">
              <div class="flex px-2 pb-2">
                <div class="font-bold">
                  <b>{{ user.name }}</b>
                </div>
              </div>
              <div class="px-2 pb-2">
                <rich-text-editor
                  :modules="mentionModule"
                  :value="message"
                  @input="onInput"
                ></rich-text-editor>
                <div>
                  <button
                    class="mt-2 rounded bg-primary px-2.5 py-1.5 text-on-primary dark:bg-primary--dark"
                    type="button"
                    :class="{
                      'bg-primary': !isSending,
                      'bg-mid-gray': isSending
                    }"
                    :disabled="isSending"
                    @click="onSendButtonClick"
                  >
                    <span class="mdi mdi-send"></span>
                    {{ activityFeedsSendButtonLabel }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(grouped_item, grouped_item_index) in groupedItems"
            :key="grouped_item_index"
          >
            <div class="flex items-center p-2">
              <div class="flex-grow">
                <hr class="border-0 border-b border-gray-300" />
              </div>
              <div class="text mx-5 flex-grow-0 text-gray-500 dark:text-white">
                <span class="mdi mdi-calendar"></span> {{ grouped_item_index }}
              </div>
              <div class="flex-grow">
                <hr class="border-0 border-b border-gray-300" />
              </div>
            </div>
            <div
              v-for="(item, index) in grouped_item"
              :key="index"
              class="my-2"
            >
              <div class="flex">
                <div>
                  <img :src="item.picture" class="h-14 w-14 rounded" />
                </div>
                <div class="w-full pl-2">
                  <div class="flex px-2">
                    <div class="font-bold">
                      <b>{{ item.name }}</b>
                    </div>
                    <div class="ml-2">
                      <span class="mdi mdi-clock"></span> {{ item.time }}
                    </div>
                  </div>
                  <div
                    :ref="'activity-' + grouped_item_index"
                    class="px-2 pb-2"
                  >
                    {{
                      renderActivityFeedItem(
                        grouped_item_index,
                        index,
                        item.message
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ns-tab>
      <ns-tab
        title="Files"
        :order="activityFeedsDefaultTab === 'files' ? 0 : 1"
      >
        <div class="py-5 px-3">
          <file-browser :files="files"></file-browser>
        </div>
      </ns-tab>
    </ns-tabs>
  </div>
</template>

<script>
import "quill-mention";
import "quill-mention/dist/quill.mention.css";

import NsTabs from "@/components/NS/NsTabs.vue";
import NsTab from "@/components/NS/NsTab.vue";
import FileBrowser from "@/components/Builder/Element/Component/FileBrowser.vue";
import RichTextEditor from "@/components/Builder/Element/RichTextEditor.vue";

import cleanAttributes from "@/assets/js/builder/cleanAttributes.js";
import alert from "@/assets/js/builder/alert.js";
import postAPI from "@/assets/js/postAPI.js";

import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";

export default {
  components: {
    NsTabs,
    NsTab,
    FileBrowser,
    RichTextEditor
  },
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
    label: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    },
    activityFeedsActivitiesTabLabel: {
      type: String,
      default: "Activities"
    },
    activityFeedsFilesTabLabel: {
      type: String,
      default: "Files"
    },
    activityFeedsSendButtonLabel: {
      type: String,
      default: ""
    },
    activityFeedsDefaultTab: {
      type: String,
      default: "activities"
    },
    activityFeedsOnRecordCreatedMessage: {
      type: String,
      default: ""
    },
    activityFeedsOnRecordDeletedMessage: {
      type: String,
      default: ""
    },
    activityFeedsOnRecordReadMessage: {
      type: String,
      default: ""
    },
    activityFeedsOnRecordUpdatedMessage: {
      type: String,
      default: ""
    },
    activityFeedsDataListMessage: {
      type: String,
      default: ""
    },
    activityFeedsEmptyMessage: {
      type: String,
      default: ""
    },
    activityFeedsFormat: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: function () {
        return {
          activities: [],
          files: [],
          user: { name: "", picture: "", username: "" }
        };
      }
    }
  },
  emits: ["input"],
  data: function () {
    return {
      appSlug: "",
      id: null,
      items: [],
      files: [],
      isSending: false,
      message: "",
      mentionModule: {},
      user: {
        name: "",
        picture: "",
        username: ""
      }
    };
  },
  computed: {
    groupedItems: function () {
      const item = this.items;
      const property = "date";

      return item.reduce(function (acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    },
    userPicture: function () {
      if (this.user.picture === "") {
        return (
          import.meta.env.VITE_FETCH_BASE_URL + "/system/user/picture/anonymous"
        );
      }

      return this.user.picture;
    }
  },
  watch: {
    value: {
      handler: function (value) {
        if (value != null) {
          this.id = value.id;
          this.appSlug = value.app;
          this.user = value.user;
          this.items = value.activities;
          this.files = value.files;

          if (typeof value.id != "undefined") {
            this.$emit("input", {
              target: {
                isInitialValue: true,
                name: this.name,
                value: null
              }
            });
          }
        }
      },
      immediate: true
    }
  },
  mounted: function () {
    const self = this;

    this.mentionModule = {
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        mentionDenotationChars: ["@", "#"],
        source: async function (searchTerm, renderList) {
          const matchedPeople = await self.suggestPeople(searchTerm);

          renderList(matchedPeople);
        }
      }
    };
  },
  methods: {
    cleanAttributes(attributes) {
      return cleanAttributes(attributes);
    },
    onInput: function (input) {
      this.message = input.target.value;
    },
    onSendButtonClick: function () {
      const self = this;

      this.isSending = true;

      const data = {
        app: this.appSlug,
        id: this.id,
        message: this.message
      };

      postAPI("app/api/v1/elements/" + this.appSlug + "/" + this.name, data)
        .then(function (response) {
          if (typeof response.message != "undefined") {
            self.message = "";
            self.items.unshift(response);
          }

          self.isSending = false;
        })
        .catch(function () {
          self.isSending = false;

          alert("Error", "Unable to send the message", "error");
        });
    },
    renderActivityFeedItem: function (grouped_item_index, index, value) {
      this.$nextTick(function () {
        if (this.activityFeedsFormat === "html") {
          this.$refs["activity-" + grouped_item_index][index].innerHTML = value;
        } else {
          this.$refs["activity-" + grouped_item_index][index].innerText = value;
        }
      });
    },
    suggestPeople: function (searchTerm) {
      return postAPI("system/api/users?name=" + searchTerm)
        .then(function (response) {
          const users = [];

          for (let index = 0; index < response.length; index++) {
            const user = response[index];

            users.push({
              id: user.username,
              value: user.name
            });
          }

          return users;
        })
        .catch(function () {
          alert("Error", "Unable to send the message", "error");
        });
    }
  }
};

elementPanelList.addElement(
  "general",
  "Activity Feeds",
  "Activity Feeds",
  "activity-feeds",
  "mdi mdi-timeline-text"
);

fieldProperties["activity-feeds"] = {
  label: {
    label: "Label"
  },
  name: {
    label: "Name"
  },
  "activity-feeds-activities-tab-label": {
    label: "Activities Tab Label"
  },
  "activity-feeds-files-tab-label": {
    label: "Files Tab Label"
  },
  "activity-feeds-tab-label": {
    label: "Send Button Label"
  },
  "activity-feeds-send-button-label": {
    label: "Send Button Label"
  },
  "activity-feeds-default-tab": {
    label: "Default Tab"
  },
  "activity-feeds-record-created-message": {
    label: "Record Created Message",
    type: "textarea"
  },
  "activity-feeds-record-deleted-message": {
    label: "Record Deleted Message",
    type: "textarea"
  },
  "activity-feeds-record-read-message": {
    label: "Record Read Message",
    type: "textarea"
  },
  "activity-feeds-record-updated-message": {
    label: "Record Updated Message",
    type: "textarea"
  },
  "activity-feeds-record-updated-message-data-format": {
    label: "Record Updated Data Message Format",
    type: "textarea"
  },
  "activity-feeds-record-updated-message-data-list-format": {
    label: "Record Updated Data List Message Format",
    type: "textarea"
  },
  "activity-feeds-nested-data-format": {
    label: "Nested Data Message Format",
    type: "textarea"
  },
  "activity-feeds-nested-data-list-format": {
    label: "Nested Data List Message Format",
    type: "textarea"
  },
  "activity-feeds-empty-message": {
    label: "Empty Activity Message",
    type: "textarea"
  },
  "activity-feeds-related-acitivities": {
    label: "Related Activities"
  },
  "activity-feeds-related-record-created-message": {
    label: "Related Record Created Message"
  },
  "activity-feeds-related-record-deleted-message": {
    label: "Related Record Deleted Message"
  },
  "activity-feeds-related-record-updated-message": {
    label: "Related Record Updated Message"
  },
  "activity-feeds-format": {
    label: "Format"
  },
  "activity-feeds-show-unrecognized-activity": {
    label: "Show Unrecognized Activity"
  }
};

fieldPropertyOptions.addOption("activity-feeds-default-tab", [
  {
    name: "Activities",
    value: "activities"
  },
  {
    name: "Files",
    value: "files"
  }
]);

fieldPropertyOptions.addOption(
  "activity-feeds-related-acitivities",
  "FieldPropertyRepeatInput",
  {
    addButtonLabel: "Add Related Activity",
    columns: [
      { name: "app", placeholder: "App" },
      { name: "field", placeholder: "Field" },
      { name: "events", placeholder: "Events" }
    ]
  }
);

fieldPropertyOptions.addOption(
  "activity-feeds-related-record-created-message",
  "FieldPropertyRepeatInput",
  {
    addButtonLabel: "Add Related Activity",
    columns: [
      { name: "app", placeholder: "App" },
      { name: "message", placeholder: "message" }
    ],
    display: "column"
  }
);

fieldPropertyOptions.addOption(
  "activity-feeds-related-record-deleted-message",
  "FieldPropertyRepeatInput",
  {
    addButtonLabel: "Add Related Activity",
    columns: [
      { name: "app", placeholder: "App" },
      { name: "message", placeholder: "message" }
    ],
    display: "column"
  }
);

fieldPropertyOptions.addOption(
  "activity-feeds-related-record-updated-message",
  "FieldPropertyRepeatInput",
  {
    addButtonLabel: "Add Related Activity",
    columns: [
      { name: "app", placeholder: "App" },
      { name: "message", placeholder: "message" }
    ],
    display: "column"
  }
);

fieldPropertyOptions.addOption("activity-feeds-show-unrecognized-activity", [
  {
    name: "No",
    value: false
  },
  {
    name: "Yes",
    value: true
  }
]);
</script>

<style scoped>
.ql-mention-list-container {
  width: 270px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(30, 30, 30, 0.08);
  z-index: 9001;
  overflow: auto;
}

.ql-mention-loading {
  line-height: 44px;
  padding: 0 20px;
  vertical-align: middle;
  font-size: 16px;
}

.ql-mention-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.ql-mention-list-item {
  cursor: pointer;
  line-height: 44px;
  font-size: 16px;
  padding: 0 20px;
  vertical-align: middle;
}

.ql-mention-list-item.disabled {
  cursor: auto;
}

.ql-mention-list-item.selected {
  background-color: #d3e1eb;
  text-decoration: none;
}

:deep(.mention) {
  height: 24px;
  width: 65px;
  border-radius: 6px;
  background-color: #d3e1eb;
  padding: 3px 0;
  margin-right: 2px;
  user-select: all;
}

:deep(.mention > span) {
  margin: 0 3px;
}
</style>
