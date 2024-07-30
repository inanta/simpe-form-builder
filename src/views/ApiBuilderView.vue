<template>
  <div class="mx-4">
    <div class="px-1 py-2 text-2xl font-bold">API Builder</div>
    <div
      class="mb-4 mt-2 rounded-md border border-mid-gray"
      style="box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important"
    >
      <div class="flex border-b border-mid-gray py-3 px-3">
        <div class="my-auto">
          <input
            ref="import"
            style="display: none"
            type="file"
            @change="onImportFileChange"
          />
          <button
            class="rounded bg-primary px-3 py-2 text-on-primary"
            @click="importApp"
          >
            <span class="mdi mdi-import"></span> Import
          </button>
        </div>
        <div class="ml-auto">
          <button
            :disabled="!isItemsChecked"
            :class="{
              'bg-negative': isItemsChecked,
              'bg-mid-gray': !isItemsChecked
            }"
            class="rounded px-3 py-2 text-on-negative"
            @click="deleteSelected"
          >
            <span class="mdi mdi-delete"></span>Delete
          </button>
          <button
            class="ml-2 rounded bg-primary px-3 py-2 text-on-primary"
            @click="onCreateButtonClick"
          >
            <span class="mdi mdi-application-cog"></span> Create
          </button>
        </div>
      </div>
      <div class="px-5 py-3">
        <div class="flex py-3">
          <div class="py-3">
            Show
            <select
              v-model.number="tablePerPage"
              class="appearance-none border border-mid-gray px-2 py-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="100">100</option>
            </select>
            Entries
          </div>
          <div class="ml-auto">
            <div class="relative">
              <button
                class="ml-2 h-9 w-9 rounded bg-primary text-on-primary"
                @click="
                  isSearchShown = !isSearchShown;
                  $refs.searchText.focus();
                "
              >
                <span class="mdi mdi-magnify mdi-24px"></span>
              </button>
              <input
                ref="searchText"
                v-model="searchText"
                :class="{
                  'w-0': !isSearchShown,
                  'ml-2 w-auto px-2': isSearchShown
                }"
                class="border-b-2 border-primary py-1 outline-none transition-all"
                placeholder="Search"
                type="search"
                @blur="isSearchShown = searchText !== ''"
              />
            </div>
          </div>
        </div>
        <data-table
          :headers="headers"
          :items="items"
          :per-page="tablePerPage"
          :search="searchText"
        >
          <template #[tableHeaderID]>
            <div class="text-center">
              <input
                :checked="isCheckedAll"
                type="checkbox"
                @change="checkAll"
              />
            </div>
          </template>
          <template #header.action="props">
            <span class="inline-block w-full text-center">
              {{ props.header.label }}
            </span>
          </template>
          <template #[tableItemID]="props">
            <div class="text-center">
              <input
                v-model="props.item.is_checked"
                type="checkbox"
                @change="checkCheckedAll"
              />
            </div>
          </template>
          <template #item.name="props">
            <a
              href="#"
              @click.prevent="$router.push('/app/view/' + props.item.endpoint)"
              >{{ props.item.name }}</a
            >
          </template>
          <template #item.tags="props">
            {{ props.item.tags.join(", ") }}
          </template>
          <template #item.action="props">
            <div class="text-center">
              <!-- <button
                v-tooltip
                title="View App"
                @click="$router.push('/app/view/' + props.item.endpoint)"
              >
                <span class="mdi mdi-eye mdi-24px"></span>
              </button> -->
              <button
                v-tooltip
                class="ml-2"
                title="Edit API"
                @click="edit(props.item)"
              >
                <span class="mdi mdi-application-edit mdi-24px"></span>
              </button>
              <button
                v-tooltip
                class="ml-2"
                title="Export As JSON"
                @click="exportAsJSON(props.item)"
              >
                <span class="mdi mdi-code-json mdi-24px"></span>
              </button>
              <!-- <button
                v-tooltip
                class="ml-2"
                title="More Settings"
                @click="
                  currentApp = props.item;
                  currentSettings = props.item.settings;
                  isAppSettingsShown = true;
                "
              >
                <span class="mdi mdi-dots-horizontal mdi-24px"></span>
              </button> -->
            </div>
          </template>
        </data-table>
      </div>
    </div>
  </div>
  <ns-dialog
    :show="isAppSettingsShown"
    width="30%"
    @close="isAppSettingsShown = false"
  >
    <template #title><span class="mdi mdi-cog"></span> App Settings</template>
    <div v-if="currentApp !== null" class="p-3">
      <div>
        <h1 class="text-xl text-primary">Messages</h1>
        <div
          v-for="(message, messageKey) in messages"
          :key="messageKey"
          class="pb-1"
        >
          <div class="pb-0.5 font-bold">{{ message }}</div>
          <input
            v-model="messages[messageKey]"
            class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none"
            type="text"
          />
        </div>
      </div>
      <div
        v-for="(setting_group, setting_group_key) in currentApp.settings"
        :key="setting_group_key"
        class="font-bold"
      >
        {{ setting_group.label }}
        <div class="flex flex-col pb-3 pt-2">
          <template v-for="(setting, key) in setting_group.value" :key="key">
            <label class="block w-full py-1">
              {{ setting.label }}
            </label>
            <ns-toggle
              v-if="
                typeof currentSettings[setting_group_key].value[key].value ===
                'boolean'
              "
              v-model="currentSettings[setting_group_key].value[key].value"
            ></ns-toggle>
            <input
              v-else
              v-model="currentSettings[setting_group_key].value[key].value"
              class="w-full rounded-sm border border-mid-gray px-2 py-1"
              type="text"
            />
          </template>
        </div>
      </div>
      <div class="border-t border-mid-gray pb-1 pt-3 text-right">
        <button
          class="rounded bg-primary px-3 py-2 text-on-primary"
          @click="saveAppSettings"
        >
          <span class="mdi mdi-content-save"></span> Save
        </button>
      </div>
    </div>
  </ns-dialog>
</template>

<script>
import messages from "@/assets/js/builder/app/messages.js";
import { useBuilderStore } from "@/stores/builder.js";

import DataTable from "@/components/DataTable.vue";
import NsDialog from "@/components/NS/NsDialog.vue";
import NsToggle from "@/components/NS/NsToggle.vue";

import NsTooltip from "@/directives/NsTooltip";
import AppBuilder from "@/assets/js/ApiBuilder";

import { saveAs } from "file-saver";

export default {
  name: "AppBuilderView",
  components: {
    DataTable,
    NsDialog,
    NsToggle
  },
  directives: { tooltip: NsTooltip },
  props: {},
  data: function () {
    return {
      app_id_column: "",
      currentApp: null,
      currentSettings: {},
      headers: [],
      isAppSettingsShown: false,
      isCheckedAll: false,
      isSearchShown: false,
      items: [],
      searchText: "",
      tablePerPage: 15,
      messages: messages
    };
  },
  computed: {
    isItemsChecked: function () {
      const self = this;

      for (let index = 0; index < self.items.length; index++) {
        if (self.items[index].is_checked) {
          return true;
        }
      }

      return false;
    },
    tableHeaderID: function () {
      return "header." + this.app_id_column;
    },
    tableItemID: function () {
      return "item." + this.app_id_column;
    }
  },
  mounted: function () {
    let self = this;

    self.getAll();
  },
  methods: {
    checkAll: function () {
      const self = this;

      self.isCheckedAll = !self.isCheckedAll;

      for (let index = 0; index < self.items.length; index++) {
        self.items[index].is_checked = self.isCheckedAll;
      }
    },
    checkCheckedAll: function () {
      const self = this;
      let is_checked_all = true;

      for (let index = 0; index < self.items.length; index++) {
        if (!self.items[index].is_checked) {
          is_checked_all = false;

          break;
        }
      }

      self.isCheckedAll = is_checked_all;
    },
    deleteSelected: function () {
      const self = this;
      let selected = [];

      for (let index = 0; index < self.items.length; index++) {
        if (self.items[index].is_checked) {
          selected.push(self.items[index]);
        }
      }

      AppBuilder.delete(selected).then(function () {
        self.getAll(self.app);
      });
    },
    edit: function (item) {
      const self = this;

      self.$router.push("/api/builder/build/" + item.endpoint);
    },
    exportAsJSON: function (item) {
      AppBuilder.exportApp(item).then(function (response) {
        let blob = new Blob([JSON.stringify(response, null, 2)], {
          type: "application/json;charset=utf-8"
        });

        saveAs(blob, response.name + ".json");
      });
    },
    getAll: function () {
      let self = this;

      AppBuilder.getAll().then(function (response) {
        self.app_id_column = response.app_id_column;
        self.headers = response.headers;
        self.items = response.items;
      });
    },
    importApp: function () {
      const self = this;

      self.$refs.import.click();
    },
    saveAppSettings: function () {
      const self = this;

      let settings = {};

      for (const group_key in self.currentSettings) {
        if (Object.hasOwnProperty.call(self.currentSettings, group_key)) {
          settings[group_key] = {};

          for (const key in self.currentSettings[group_key].value) {
            if (
              Object.hasOwnProperty.call(
                self.currentSettings[group_key].value,
                key
              )
            ) {
              settings[group_key][key] =
                self.currentSettings[group_key].value[key].value;
            }
          }
        }
      }

      AppBuilder.settings(self.currentApp, settings).then(function () {
        self.getAll();
      });

      self.isAppSettingsShown = false;
    },
    onCreateButtonClick: function () {
      const self = this;

      self.$router.push("/api/builder/build");
    },
    onImportFileChange: function () {
      const self = this;

      if (typeof self.$refs.import.files[0] !== "undefined") {
        const reader = new FileReader();

        reader.addEventListener(
          "load",
          function () {
            const store = useBuilderStore();

            store.importAppData = JSON.parse(reader.result);
            self.build();
          },
          false
        );

        reader.readAsText(self.$refs.import.files[0]);
      }
    }
  }
};
</script>
