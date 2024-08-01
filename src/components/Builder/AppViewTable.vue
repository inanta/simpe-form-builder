<template>
  <div class="flex py-3">
    <div class="py-3">
      Show
      <select
        v-model.number="tablePerPage"
        class="appearance-none border border-mid-gray bg-white px-2 py-1 dark:border-surface--dark-400 dark:bg-surface--dark-500 dark:text-on-surface--dark-500"
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
          class="ml-2 h-9 w-9 rounded bg-primary text-on-primary dark:bg-primary--dark"
          @click="isFilterSettingsShown = true"
        >
          <span
            class="mdi"
            :class="{
              'mdi-filter': defaultFilters.length === 0,
              'mdi-filter-check': defaultFilters.length > 0
            }"
          ></span>
        </button>
        <button
          class="ml-2 h-9 w-9 rounded bg-primary text-on-primary dark:bg-primary--dark"
          @click="
            isSearchShown = !isSearchShown;
            $refs.searchText.focus();
          "
        >
          <span class="mdi mdi-magnify"></span>
        </button>
        <input
          ref="searchText"
          v-model="searchText"
          :class="{
            'w-0': !isSearchShown,
            'ml-2 w-auto px-2': isSearchShown
          }"
          class="border-b-2 border-primary py-1 !outline-none transition-all dark:border-primary--dark dark:bg-surface--dark-500"
          :placeholder="messages.search"
          type="search"
          @blur="isSearchShown = searchText !== ''"
        />
        <button
          class="ml-2 h-9 w-9 rounded bg-primary text-on-primary dark:bg-primary--dark"
          @click="isTableSettingsShown = true"
        >
          <span class="mdi mdi-table-cog"></span>
        </button>
      </div>
    </div>
  </div>
  <data-table
    :headers="headers"
    :items="items"
    :is-loading="isLoading"
    :order="order"
    :page="page"
    :per-page="tablePerPage"
    :search="searchText"
    :server-items-length="serverItemsLength"
    :sort="sort"
    @page-change="onDataTablePageChange"
    @search="onDataTableSearch"
    @sorting-change="onDataTableSortChange"
    @table-column-click="onTableRowClick"
  >
    <template #no-data>
      <div v-if="!isLoading" class="mx-auto w-1/3 p-5">
        <div>
          <img src="@/assets/img/undraw_empty_re_opql.svg" />
        </div>
        <div>
          <div class="p-2 text-xl font-bold">
            No data was added yet, click "Add New" button to add data.
          </div>
          <button
            class="ml-2 rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
            @click="$router.push('/app/insert/' + app.slug)"
          >
            <span class="mdi mdi-plus"></span>Add New
          </button>
        </div>
      </div>
      <div v-else class="w-full">
        <ns-progress-bar
          class="!rounded-none !border-0"
          height="0.2rem"
        ></ns-progress-bar>
      </div>
    </template>
    <template #header.!id>
      <div class="text-center">
        <input
          :checked="isCheckedAll"
          type="checkbox"
          @change="$emit('checkAll')"
        />
      </div>
    </template>
    <template #header.action="props">
      <span class="relative inline-block w-full text-center">
        {{ props.header.label }}
      </span>
    </template>
    <template #header._setting>
      <div class="flex">
        <button class="ml-auto" @click="isTableSettingsShown = true">
          <span class="mdi mdi-dots-horizontal mdi-24px"></span>
        </button>
      </div>
    </template>
    <template #item.!id="props">
      <div class="text-center text-2xl">
        <input
          v-if="hasRecordWritePermissions(props.item)"
          v-model="props.item.is_checked"
          type="checkbox"
          @change="checkCheckedAll"
          @click.stop
        />
      </div>
    </template>
    <template #item.actions="props">
      <div v-if="tableActions === 'column'" class="text-center">
        <app-view-item-actions
          :additional-action-buttons="additionalActionButtons"
          :delete="hasDeleteFeature && hasRecordWritePermissions(props.item)"
          :item="props.item"
          :messages="messages"
          :update="hasUpdateFeature && hasRecordWritePermissions(props.item)"
          @edit="$emit('edit', props.item)"
          @delete="
            props.item.is_checked = true;
            $emit('delete', props.item);
          "
        ></app-view-item-actions>
      </div>
    </template>
    <template #item._setting="props">
      <div class="text-2xl">&nbsp;</div>
      <template v-if="tableActions === 'inline'">
        <div
          data-action-buttons
          class="absolute top-0 right-0 hidden h-full w-auto items-center justify-end pr-1 text-right text-on-primary md:pr-16"
        >
          <div
            class="rounded bg-primary py-0.5 px-3 shadow-md dark:bg-primary--dark"
          >
            <app-view-item-actions
              :additional-action-buttons="additionalActionButtons"
              :delete="
                hasDeleteFeature && hasRecordWritePermissions(props.item)
              "
              :messages="messages"
              :item="props.item"
              :update="
                hasUpdateFeature && hasRecordWritePermissions(props.item)
              "
              @edit="$emit('edit', props.item)"
              @delete="
                props.item.is_checked = true;
                $emit('delete', props.item);
              "
            ></app-view-item-actions>
          </div>
        </div>
      </template>
    </template>
  </data-table>
  <app-view-table-filter-settings
    :app="app"
    :default-filters="defaultFilters"
    :headers="headers"
    :show="isFilterSettingsShown"
    @change="$emit('filterChange', $event)"
    @close="isFilterSettingsShown = false"
  ></app-view-table-filter-settings>
  <app-view-table-settings
    :headers="headers"
    :show="isTableSettingsShown"
    @close="isTableSettingsShown = false"
    @save="saveTableViewSettings"
  ></app-view-table-settings>
  <app-view-data
    :id="selectedData['!id']"
    :messages="messages"
    :slug="app.slug"
    :show="isSelectedDataShown"
    :title="firstTableHeaderValue"
    :update="hasUpdateFeature && hasRecordWritePermissions(selectedData)"
    @close="isSelectedDataShown = false"
  ></app-view-data>
</template>

<script>
import { toRaw } from "vue";

import NsProgressBar from "@/components/NS/NsProgressBar.vue";
import DataTable from "@/components/DataTable.vue";

import AppViewTableFilterSettings from "@/components/Builder/AppViewTableFilterSettings.vue";
import AppViewTableSettings from "@/components/Builder/AppViewTableSettings.vue";
import AppViewData from "@/components/Builder/AppViewData.vue";
import AppViewItemActions from "@/components/Builder/AppViewItemActions.vue";

import AppBuilder from "@/assets/js/AppBuilder.js";

import getPropertyValue from "@/assets/js/getPropertyValue.js";

export default {
  name: "Field",
  components: {
    NsProgressBar,
    DataTable,

    AppViewTableSettings,
    AppViewTableFilterSettings,
    AppViewData,
    AppViewItemActions
  },
  props: {
    additionalActionButtons: {
      type: Array,
      default: function () {
        return [];
      }
    },
    app: {
      type: Object,
      default: function () {
        return {};
      }
    },
    defaultFilters: {
      type: Array,
      default: function () {
        return [];
      }
    },
    headers: {
      type: Array,
      default: function () {
        return [];
      }
    },
    items: {
      type: Array,
      default: function () {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    messages: {
      type: Object,
      default: function () {
        return {};
      }
    },
    order: {
      type: String,
      default: ""
    },
    page: {
      type: Number,
      default: undefined
    },
    perPage: {
      type: Number,
      default: undefined
    },
    search: {
      type: String,
      default: ""
    },
    serverItemsLength: {
      type: Number,
      default: undefined
    },
    sort: {
      type: String,
      default: ""
    }
  },
  emits: {
    checkAll: null,
    edit: null,
    filterChange: null,
    delete: null,
    pageChange: null
  },
  data: function () {
    return {
      additionalButtons: [],
      features: [],
      filters: [],
      isSearchShown: false,
      isFilterSettingsShown: false,
      isSelectedDataShown: false,
      isTableSettingsShown: false,
      searchText: "",
      selectedFilterIndex: -1,
      selectedData: {},
      tablePerPage: 15
    };
  },
  computed: {
    firstTableHeaderValue: function () {
      for (const key in this.headers) {
        if (Object.hasOwnProperty.call(this.headers, key)) {
          const header = this.headers[key];

          if (header.additional == false && header.visible == true) {
            return this.selectedData[header.value];
          }
        }
      }

      return "";
    },
    hasUpdateFeature: function () {
      const app = toRaw(this.app);

      if (typeof app.features !== "undefined") {
        return app.features.includes("update");
      }

      return false;
    },
    hasDeleteFeature: function () {
      const app = toRaw(this.app);

      if (typeof app.features !== "undefined") {
        return app.features.includes("delete");
      }

      return false;
    },
    isAppInitialized: function () {
      return typeof this.app.slug !== "undefined";
    },
    isCheckedAll: function () {
      const self = this;

      for (let index = 0; index < self.items.length; index++) {
        if (!self.items[index].is_checked) {
          return false;
        }
      }

      return true;
    },
    tableActions: function () {
      return getPropertyValue(
        this.app.settings,
        "ui.page.view.table.actions",
        "column"
      );
    }
  },
  watch: {
    perPage: {
      handler: function (value) {
        this.tablePerPage = value;
      },
      immediate: false
    },
    search: {
      handler: function (value) {
        this.searchText = value;
      },
      immediate: false
    }
  },
  mounted: function () {},
  methods: {
    hasRecordWritePermissions(item) {
      if (typeof item["!permissions"] === "undefined") {
        return false;
      }

      return item["!permissions"][1] == "w" || item["!permissions"][2] == "w";
    },
    onDataTablePageChange: function (page, per_page, sort, order, filter) {
      this.$emit("pageChange", page, per_page, sort, order, filter);
    },
    onDataTableSearch: function (filter, page, per_page, sort, order) {
      this.$emit("pageChange", page, per_page, sort, order, filter);
    },
    onDataTableSortChange: function (sort, order, page, per_page, filter) {
      this.$emit("pageChange", page, per_page, sort, order, filter);
    },
    onTableRowClick: function (item) {
      let action = getPropertyValue(
        this.app.settings,
        "ui.page.view.item_click_action",
        "view"
      );

      if (action === "view") {
        this.selectedData = item;
        this.isSelectedDataShown = true;
      } else {
        this.$router.push("/app/edit/" + this.app.slug + "/" + item["!id"]);
      }
    },
    saveTableViewSettings: function () {
      const self = this;
      let headers = [];

      for (let index = 0; index < self.headers.length; index++) {
        const header = self.headers[index];

        if (typeof header.hideable === "undefined" || header.hideable == true) {
          headers.push({
            align: header.align,
            format: header.format,
            value: header.target !== "" ? header.target : header.value,
            visible: header.visible
          });
        }
      }

      AppBuilder.settings(self.app, { headers: headers });

      self.isTableSettingsShown = false;
    }
  }
};
</script>

<style scoped lang="scss">
:deep([data-component="data-table"] tbody tr) {
  overflow: hidden !important;
  position: relative;
}

@media (min-width: 768px) {
  [data-component="data-table"] tbody tr:hover [data-action-buttons] {
    display: flex;
  }
}
</style>
