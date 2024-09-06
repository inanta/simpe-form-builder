<template>
  <div
    class="bg-white text-black dark:bg-surface--dark-100 dark:text-on-surface--dark-100"
  >
    <div class="px-4 pb-4">
      <div class="px-1 py-2 text-2xl font-bold">
        {{ app.name }}
      </div>
      <div
        ref="mainContainer"
        class="mb-4 mt-2 rounded-md border border-light-gray bg-surface-300 shadow-center dark:border-surface--dark-300 dark:bg-surface--dark-300"
      >
        <div
          ref="topButtonsContainer"
          :class="{
            'border-b px-3 py-3':
              hasExportFeature ||
              hasImportFeature ||
              hasDeleteFeature ||
              hasCreateFeature
          }"
          class="flex rounded-t-md border-mid-gray bg-surface-300 dark:border-surface--dark-600 dark:bg-surface--dark-300"
        >
          <div v-if="hasExportFeature || hasImportFeature" class="my-auto">
            <input
              v-if="hasImportFeature"
              ref="import"
              style="display: none"
              type="file"
              @change="parseImportFile"
            />
            <ns-drop-down-button
              class="rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
            >
              <template #content>
                <i class="mdi mdi-swap-vertical"></i>
                {{ messages.import_export }}
              </template>
              <template #caret>
                &nbsp;<i class="mdi mdi-chevron-down"></i>
              </template>
              <ns-drop-down-button-item v-if="hasImportFeature"
                ><a
                  class="inline-block w-full px-3 py-2 text-left"
                  href="#"
                  @click.prevent="importData"
                  ><i class="mdi mdi-import"></i> Import</a
                ></ns-drop-down-button-item
              >
              <ns-drop-down-button-item v-if="hasExportFeature"
                ><a
                  href="#"
                  class="inline-block w-full px-3 py-2 text-left"
                  @click.prevent="exportData($event)"
                  ><i class="mdi mdi-export"></i> Export</a
                ></ns-drop-down-button-item
              >
              <ns-drop-down-button-item v-if="hasImportFeature"
                ><hr
              /></ns-drop-down-button-item>
              <ns-drop-down-button-item v-if="hasImportFeature"
                ><a
                  :href="importDataTemplateString"
                  class="inline-block w-full px-3 py-2 text-left"
                  :download="app.name + '.csv'"
                  ><i class="mdi mdi-download"></i> Download Import Template</a
                ></ns-drop-down-button-item
              >
            </ns-drop-down-button>
          </div>
          <div class="ml-auto">
            <button
              v-if="hasDeleteFeature"
              :disabled="!isItemsChecked"
              :class="{
                'bg-negative dark:bg-negative--dark': isItemsChecked,
                'bg-disabled text-on-disabled dark:bg-disabled--dark dark:text-on-disabled--dark':
                  !isItemsChecked
              }"
              class="ml-2 rounded px-3 py-2 text-on-negative"
              @click="onDeleteButtonClick"
            >
              <span class="mdi mdi-delete"></span>
              <span class="hidden md:inline">{{ messages.delete }}</span>
            </button>

            <button
              v-if="hasCreateFeature"
              class="ml-2 rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
              @click="insert"
            >
              <span class="mdi mdi-plus"></span>
              <span class="hidden md:inline">{{ messages.add }}</span>
            </button>
          </div>
        </div>
        <div v-if="!isError" class="px-5 py-3">
          <app-view-table
            :additional-action-buttons="additionalActionButtons"
            :app="app"
            :default-filters="defaultFilters"
            :headers="headers"
            :items="items"
            :is-loading="isLoading"
            :messages="messages"
            :order="order"
            :page="page"
            :per-page="perPage"
            :search="searchText"
            :server-items-length="serverItemsLength"
            :sort="sort"
            @check-all="checkAll"
            @delete="isDeleteConfirmationShown = true"
            @edit="edit"
            @filter-change="onFilterChange"
            @page-change="onDataTablePageChange"
          ></app-view-table>
        </div>
        <div v-else class="flex flex-col px-5 py-10">
          <img
            class="mx-auto md:w-1/5"
            src="@/assets/img/undraw_void_-3-ggu.svg"
          />
          <div
            class="mx-auto pb-1 pt-5 text-2xl font-bold text-primary dark:text-primary--dark"
          >
            Something Went Wrong
          </div>
          <div class="mx-auto pb-5 text-lg">
            The requested URL was not found.
          </div>
          <div class="mx-auto">
            <a
              class="ml-2 rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
              href="/"
              >Go Back Home</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <confirmation-dialog
    :no-label="messages.no"
    :show="isDeleteConfirmationShown"
    :title="messages.confirmation"
    :yes-label="messages.yes"
    @close="isDeleteConfirmationShown = false"
    @confirm="deleteSelected"
  >
    {{ messages["delete-confirmation"].replace("$count", checkedItems.length) }}
  </confirmation-dialog>
  <app-alert></app-alert>
  <app-insert :show="isInsertShown" @record-saved="onRecordSaved"></app-insert>
  <app-edit
    :id="editID"
    :name="app.slug"
    :show="isEditShown"
    @record-saved="onRecordSaved"
  ></app-edit>
</template>

<script>
import AppEdit from "@/components/Builder/AppEdit.vue";
import AppInsert from "@/components/Builder/AppInsert.vue";
import AppViewTable from "@/components/Builder/AppViewTable.vue";
import ConfirmationDialog from "@/components/Builder/ConfirmationDialog.vue";
import NsDropDownButton from "@/components/NS/NsDropDownButton.vue";
import NsDropDownButtonItem from "@/components/NS/NsDropDownButtonItem.vue";
import AppAlert from "@/components/Builder/AppAlert.vue";

import NsTooltip from "@/directives/NsTooltip";
import AppBuilder from "@/assets/js/AppBuilder.js";

import Papa from "papaparse";

import callHook from "@/assets/js/builder/callHook.js";
import getMessages from "@/assets/js/builder/getMessages.js";
import getPropertyValue from "@/assets/js/getPropertyValue.js";
import hasFeature from "@/assets/js/builder/hasFeature.js";
import hash from "@/assets/js/hash.js";
import onViewPageLoaded from "@/assets/js/builder/app/hooks/onViewPageLoaded.js";
import onViewPageRenderAdditionalActionButtons from "@/assets/js/builder/app/hooks/onViewPageRenderAdditionalActionButtons.js";

export default {
  name: "AppView",
  components: {
    AppEdit,
    AppInsert,
    AppViewTable,
    ConfirmationDialog,
    NsDropDownButton,
    NsDropDownButtonItem,
    AppAlert
  },
  directives: { tooltip: NsTooltip },
  props: {},
  data: function () {
    return {
      additionalActionButtons: [],
      app: {},
      defaultFilters: [],
      importDataTemplateString: "",
      isError: false,
      isCheckedAll: false,
      isLoading: true,
      editID: "",
      headers: [],
      hooks: { onViewPageLoaded, onViewPageRenderAdditionalActionButtons },
      items: [],
      messages: {},
      order: "",
      page: 1,
      perPage: 15,
      sort: "",
      searchText: "",
      serverItemsLength: 0,
      isDeleteConfirmationShown: false,
      isEditShown: false,
      isInsertShown: false
    };
  },
  computed: {
    checkedItems: function () {
      return this.items.filter(function (item) {
        if (item.is_checked) {
          return true;
        }

        return false;
      });
    },
    hasCreateFeature: function () {
      return hasFeature(this.app, "create");
    },
    hasDeleteFeature: function () {
      return hasFeature(this.app, "delete");
    },
    hasExportFeature: function () {
      return hasFeature(this.app, "export");
    },
    hasImportFeature: function () {
      return hasFeature(this.app, "import");
    },
    isItemsChecked: function () {
      for (let index = 0; index < this.items.length; index++) {
        if (this.items[index].is_checked) {
          return true;
        }
      }

      return false;
    }
  },
  watch: {
    $route: function (to) {
      if (to.path.includes("/app/")) {
        this.initializePage(to.params.action, to.params.id);
      }
    }
  },
  mounted: function () {
    this.render(this.$route.params.name);
    this.initializePage(this.$route.params.action, this.$route.params.id);
  },
  methods: {
    additionalButtonIcon: function (button) {
      let icon = {};

      icon[button.icon] = true;

      return icon;
    },
    checkAll: function () {
      this.isCheckedAll = !this.isCheckedAll;

      for (let index = 0; index < this.items.length; index++) {
        this.items[index].is_checked = this.isCheckedAll;
      }
    },
    deleteSelected: function () {
      const self = this;
      let selected = [];

      for (let index = 0; index < self.items.length; index++) {
        if (self.items[index].is_checked) {
          selected.push(self.items[index]);
        }
      }

      AppBuilder.deleteRecords(self.app, selected).then(function () {
        self.getAllRecords(self.app.slug);
      });
    },
    detail: function (event) {
      console.log(event);
    },
    edit: function (item) {
      this.$router.push(
        "/app/data/" + this.app.slug + "/update/" + item["!id"]
      );
    },
    exportData: function () {
      AppBuilder.exportRecords(this.app);
    },
    getAllRecords: function (
      app,
      page = 1,
      per_page = 15,
      sort = "",
      order = "",
      filter = ""
    ) {
      const self = this;

      let parameters = {
        page: page,
        per_page: per_page
      };

      self.isLoading = true;

      if (self.defaultFilters.length > 0) {
        parameters.filters = self.defaultFilters;
      }

      if (sort !== "") {
        parameters.sort = sort;
      }

      if (order !== "") {
        parameters.order = order;
      }

      if (filter !== "") {
        parameters.search = filter;
      }

      AppBuilder.getAllRecords(app, parameters)
        .then(function (response) {
          self.app = response.app;
          self.app.slug = app;
          self.isError = false;

          for (let index = 0; index < response.items.length; index++) {
            response.items[index].is_checked = false;
          }

          self.messages = getMessages(
            {
              import_export: "Import / Export",
              add: "Add New",
              edit: "Edit",
              delete: "Delete",
              search: "Search",
              yes: "Yes",
              no: "No",
              confirmation: "Confirmation",
              "delete-confirmation":
                "Are you sure want to delete $count selected item" +
                (self.checkedItems.length > 1 ? "s" : "") +
                "?",
              more: "More"
            },
            self.app.settings
          );

          // Checkboxes column for selecting records
          if (typeof self.app.features !== "undefined") {
            if (self.app.features.includes("delete")) {
              response.headers.unshift({
                additional: true,
                align: "center",
                format: "general",
                hideable: false,
                label: "!id",
                searchable: false,
                sortable: false,
                value: "!id",
                visible: true
              });
            }

            const buttons = callHook(
              self.hooks,
              "onViewPageRenderAdditionalActionButtons",
              Object.freeze(JSON.parse(JSON.stringify(self.app)))
            );

            if (typeof buttons !== "undefined") {
              self.additionalActionButtons = buttons;
            } else {
              self.additionalActionButtons = [];
            }

            if (
              (self.app.features.includes("update") ||
                self.app.features.includes("delete") ||
                self.additionalActionButtons.length > 0) &&
              getPropertyValue(
                self.app.settings,
                "ui.page.view.table.actions",
                "column"
              ) === "column"
            ) {
              // Actions (edit, delete, etc.) column
              response.headers.push({
                additional: true,
                align: "center",
                format: "general",
                hideable: false,
                label: "Actions",
                searchable: false,
                sortable: false,
                value: "actions",
                visible: true
              });
            }
          }

          // Settings columns
          response.headers.push({
            additional: true,
            hideable: false,
            label: "...",
            searchable: false,
            sortable: false,
            value: "_settings",
            visible: true
          });

          self.headers = response.headers;
          self.items = response.items;
          self.serverItemsLength = response.items_length;
          self.isLoading = false;

          let columns = self.headers
            .filter(function (item) {
              if (item.additional === false) {
                return true;
              }

              return false;
            })
            .map(function (item) {
              return item.value;
            });

          let data = [];

          for (let index = 0; index < columns.length; index++) {
            data.push("");
          }

          self.importDataTemplateString =
            "data:text/plain;charset=utf-8," +
            encodeURIComponent(
              Papa.unparse(
                {
                  fields: columns,
                  data: [data]
                },
                { delimiter: ";", header: true, quotes: true }
              )
            );

          app = JSON.parse(JSON.stringify(self.app));
          app.$router = self.$router;

          callHook(self.hooks, "onViewPageLoaded", Object.freeze(app));
        })
        .catch(function (error) {
          if (
            typeof error.response.status !== "undefined" &&
            error.response.status === 401
          ) {
            window.location.href = "/";
          }

          self.isError = true;
        });
    },
    importData: function () {
      this.$refs.import.click();
    },
    initializePage: function (action, id) {
      this.isInsertShown = false;
      this.isEditShown = false;
      this.editID = "";

      if (action === "insert") {
        this.isInsertShown = true;
      } else if (action === "update" && id) {
        this.editID = id;
        this.isEditShown = true;
      }
    },
    insert: function () {
      this.$router.push("/app/data/" + this.app.slug + "/insert");
    },
    onDataTablePageChange: async function (
      page,
      per_page,
      sort,
      order,
      filter
    ) {
      const hashed_app_url = await hash(window.location.href);

      this.setLocalStorage(hashed_app_url + "_page", page);
      this.setLocalStorage(hashed_app_url + "_per_page", per_page);
      this.setLocalStorage(hashed_app_url + "_sort", sort);
      this.setLocalStorage(hashed_app_url + "_order", order);

      this.page = page;
      this.perPage = per_page;
      this.sort = sort;
      this.order = order;

      if (typeof this.app.slug !== "undefined") {
        this.getAllRecords(this.app.slug, page, per_page, sort, order, filter);
      }
    },
    onDeleteButtonClick: function () {
      this.isDeleteConfirmationShown = true;
    },
    onFilterChange: function (filter) {
      this.defaultFilters = filter;
      this.getAllRecords(this.app.slug);
    },
    onRecordSaved: function () {
      this.getAllRecords(
        this.app.slug,
        this.page,
        this.perPage,
        this.sort,
        this.order
      );
    },
    parseImportFile: function () {
      const self = this;

      if (typeof self.$refs.import.files[0] !== "undefined") {
        Papa.parse(self.$refs.import.files[0], {
          complete: async function (results) {
            let columns = self.headers
              .filter(function (item) {
                if (item.additional === false) {
                  return true;
                }

                return false;
              })
              .map(function (item) {
                return item.value;
              });

            if (results.meta.fields.join("|") == columns.join("|")) {
              AppBuilder.insertRecords(self.app, results.data).then(
                function () {
                  self.getAllRecords(self.app.slug);
                }
              );
            } else {
              alert("Import file format error.");
            }
          },
          header: true
        });
      }
    },
    render: async function (slug) {
      const hashed_app_url = await hash(window.location.href);

      this.defaultFilters = [];

      if (
        typeof this.$route.query.filters !== "undefined" &&
        Array.isArray(this.$route.query.filters)
      ) {
        for (let index = 0; index < this.$route.query.filters.length; index++) {
          const filter = this.$route.query.filters[index];

          this.defaultFilters.push(filter);
        }
      }

      let page = parseInt(localStorage.getItem(hashed_app_url + "_page"));
      let per_page = parseInt(
        localStorage.getItem(hashed_app_url + "_per_page")
      );
      let sort = localStorage.getItem(hashed_app_url + "_sort");
      let order = localStorage.getItem(hashed_app_url + "_order");

      if (!page) {
        page = 1;
      }

      if (!per_page) {
        per_page = 15;
      }

      this.page = page;
      this.perPage = per_page;
      this.sort = sort;
      this.order = order;

      this.app.slug = slug;
      this.getAllRecords(this.app.slug, page, per_page, sort, order);
    },
    setLocalStorage(key, value) {
      if (typeof value === "undefined" || value === null) {
        value = "";
      }

      localStorage.setItem(key, value);
    }
  }
};
</script>
