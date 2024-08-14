<template>
  <div class="mx-4">
    <div class="flex py-2">
      <div class="my-auto text-xl font-bold">Report Builder</div>
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
          <i class="fa fa-trash"></i> Delete
        </button>
        <button
          class="ml-2 rounded bg-primary px-3 py-2 text-on-primary"
          @click="build"
        >
          <i class="fa fa-shapes"></i> Create
        </button>
      </div>
    </div>
    <div
      class="mb-4 mt-2 rounded-md border border-light-gray px-5 py-3"
      style="box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15) !important"
    >
      <data-table :headers="headers" :items="items" :search="searchText">
        <template #search>
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
        </template>
        <template #[tableHeaderID]>
          <div class="text-center">
            <input :checked="isCheckedAll" type="checkbox" @change="checkAll" />
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
            @click.prevent="$router.push('/report/view/' + props.item.slug)"
            >{{ props.item.name }}</a
          >
        </template>
        <template #item.tags="props">
          {{ props.item.tags.join(", ") }}
        </template>
        <template #item.action="props">
          <div class="text-center">
            <button
              v-tooltip
              title="View Report"
              @click="$router.push('/report/view/' + props.item.slug)"
            >
              <span class="mdi mdi-eye mdi-24px"></span>
            </button>
            <button
              v-tooltip
              class="ml-2"
              title="Edit Report"
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
            <button
              v-tooltip
              class="ml-2"
              :title="
                props.item.is_read_only ? 'Set Read And Write' : 'Set Read Only'
              "
              @click="toggleReadOnly(props.item)"
            >
              <span
                :class="{
                  'mdi-lock': !props.item.is_read_only,
                  'mdi-lock-open': props.item.is_read_only
                }"
                class="mdi mdi-lock mdi-24px"
              ></span>
            </button>
            <button
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
            </button>
          </div>
        </template>
      </data-table>
    </div>
  </div>
  <ns-dialog
    :show="isAppSettingsShown"
    size="30%"
    @close="isAppSettingsShown = false"
  >
    <template #title><i class="fa fa-cog"></i> App Settings</template>
    <div v-if="currentApp !== null" class="p-3">
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
          <i class="fa fa-save"></i> Save
        </button>
      </div>
    </div>
  </ns-dialog>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import NsDialog from "@/components/NS/NsDialog.vue";
import NsToggle from "@/components/NS/NsToggle.vue";

import NsTooltip from "@/directives/NsTooltip";

import ReportBuilder from "@/assets/js/ReportBuilder.js";

import { saveAs } from "file-saver";

export default {
  name: "ReportBuilderView",
  components: {
    DataTable,
    NsDialog,
    NsToggle
  },
  directives: { tooltip: NsTooltip },
  props: {},
  data: function () {
    return {
      isAppSettingsShown: false,
      isCheckedAll: false,
      headers: [],
      items: [],
      report_id_column: "id",
      searchText: "",
      isSearchShown: false,

      currentApp: null,
      currentSettings: {}
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
      return "header." + this.report_id_column;
    },
    tableItemID: function () {
      return "item." + this.report_id_column;
    }
    // appSettings: function () {
    //   if (typeof this.items[this.selectedItem] !== "undefined") {
    //     return {
    //       settings: []
    //       // webhooks: this.items[this.selectedItem]["webhooks"]
    //     };
    //   }

    //   return [];
    // }
  },
  mounted: function () {
    let self = this;

    self.getAll();
  },
  methods: {
    build: function () {
      const self = this;

      self.$router.push("/report/builder/build");
    },
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

      ReportBuilder.delete(selected).then(function () {
        self.getAll();
      });
    },
    edit: function (item) {
      const self = this;

      self.$router.push("/report/builder/build/" + item.slug);
    },
    exportAsJSON: function (item) {
      let cloned_item = JSON.parse(JSON.stringify(item));

      delete cloned_item._rev;
      delete cloned_item.settings;

      let blob = new Blob([JSON.stringify(cloned_item)], {
        type: "application/json;charset=utf-8"
      });

      saveAs(blob, cloned_item.name + ".json");
    },
    getAll: function () {
      let self = this;

      ReportBuilder.getAll().then(function (response) {
        self.report_id_column = response.report_id_column;
        self.headers = response.headers;
        self.items = response.items;
      });
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

      ReportBuilder.settings(self.currentApp, settings).then(function () {
        self.getAll();
      });

      self.isAppSettingsShown = false;
    }
    // toggleReadOnly: function (app) {
    //   const self = this;
    //   const is_read_only = !app.is_read_only;

    //   ReportBuilder.settings(app, { is_read_only: is_read_only }).then(
    //     function () {
    //       self.getAll();
    //     }
    //   );
    // }
  }
};
</script>
