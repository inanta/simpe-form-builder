<template>
  <div class="relative mx-4 mb-4">
    <top-panel
      @import="importApp"
      @preview="showPreview"
      @save="save"
    ></top-panel>
    <hr class="border-top my-4 border-gray-300" />
    <div class="pb-2">
      <input
        v-model="app.name"
        class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-2xl outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:text-surface-500"
        type="text"
      />
    </div>
    <div v-if="selectedContainerType === 'Tabs'" class="flex pb-2">
      <container-tabs-view-switcher
        :containers="containers"
        @activate="selectedContainer = $event"
      ></container-tabs-view-switcher>
      <container-tabs-settings
        :containers="containers"
        @add-new-container="containers.push($event)"
        @change-container-name="containers[$event.index].name = $event.value"
        @remove-container="containers.splice($event, 1)"
      ></container-tabs-settings>
    </div>
    <div ref="mainContainer" class="flex">
      <div class="flex-grow">
        <div>
          <!-- <div class="flex px-4 pb-2">
            <button
              class="ml-auto rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
              @click="onViewLogicButtonClick"
            >
              <span class="mdi mdi-source-branch"></span> View Logic
            </button>
          </div> -->
          <form :name="slugifiedAppName">
            <template
              v-for="(container, index) in containers"
              :key="container.name"
            >
              <div
                v-if="index == selectedContainer"
                class="mr-4 flex-shrink flex-grow"
              >
                <div
                  class="rounded border border-mid-gray px-2 py-4 dark:border-surface--dark-300 dark:bg-surface--dark-300 dark:text-on-surface--dark-300"
                  @dragenter.self="onContainerDragEnter(container)"
                >
                  <template
                    v-for="(row, row_index) in container.rows"
                    :key="row_index"
                  >
                    <div
                      :class="'grid-cols-' + row.grid"
                      class="grid gap-0"
                      @dragover.prevent
                    >
                      <template
                        v-for="(column, column_index) in row.columns"
                        :key="column_index"
                      >
                        <div
                          v-if="column.type == 'empty' && row.showEmptyColumn"
                          class="flex content-center items-center rounded-sm px-2 py-1 text-primary"
                        >
                          <empty-column-placeholder
                            :column="column_index"
                            :container="index"
                            :element="dragColumn.name"
                            :is-add-inside-row="true"
                            :row="row_index"
                            @add-element="addElement"
                          ></empty-column-placeholder>
                        </div>
                        <div v-if="column.type != 'empty'">
                          <builder-app-field
                            :builder="true"
                            :column="column_index"
                            :column-count="row.columns.length"
                            :focus="column.is_focused"
                            :label="column.label"
                            :properties="column"
                            :row="row_index"
                            :row-count="container.rows.length"
                            :select="column.is_selected"
                            @blur="setFocus()"
                            @copy-code="onCopyCode(column)"
                            @create-and-move-to-row-above="
                              onCreateAndMoveToRowAbove(
                                index,
                                row_index,
                                column_index,
                                column
                              )
                            "
                            @create-and-move-to-row-below="
                              onCreateAndMoveToRowBelow(
                                index,
                                row_index,
                                column_index,
                                column
                              )
                            "
                            @create-logic="
                              onCreateLogic(index, row_index, column_index)
                            "
                            @duplicate="
                              onDuplicate(index, row_index, column_index)
                            "
                            @focus="setFocus(index, row_index, column_index)"
                            @move-to-row-above="
                              onMoveToRowAbove(
                                index,
                                row_index,
                                column_index,
                                column
                              )
                            "
                            @move-to-row-below="
                              onMoveToRowBelow(
                                index,
                                row_index,
                                column_index,
                                column
                              )
                            "
                            @remove="
                              onRemoveItem(index, row_index, column_index)
                            "
                            @select="setSelect(index, row_index, column_index)"
                            @switch-column="onSwitchColumn"
                          ></builder-app-field>
                        </div>
                      </template>
                    </div>
                    <div
                      class="px-2"
                      :class="{
                        'h-1': !row.showNewEmptyRowPlaceholder && row.grid != 0
                      }"
                      @dragenter="onNewRowDragEnter(row)"
                    >
                      <template
                        v-if="
                          row.showNewEmptyRowPlaceholder ||
                          (row_index == 0 && row.grid == 0)
                        "
                      >
                        <empty-column-placeholder
                          :column="0"
                          :container="index"
                          :element="dragColumn.name"
                          :is-add-inside-row="row.grid == 0 ? true : false"
                          :row="row_index"
                          @add-element="addElement"
                        ></empty-column-placeholder>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
              <!-- Is table attribute needed? -->
            </template>
          </form>
        </div>
      </div>
      <div
        ref="panelContainer"
        class="h-max flex-shrink-0 flex-grow-0 overflow-hidden text-sm transition-all"
        :class="{ 'w-60': isPanelToggled, 'w-96': !isPanelToggled }"
      >
        <field-properties-panel
          :columns="columns"
          :containers="containers"
          :table="selectedTable"
          :properties="selectedColumn"
          @change="changeFieldProperties"
          @close="setSelect"
          @toggle="isPanelToggled = !isPanelToggled"
        ></field-properties-panel>
        <div>
          <html-element-panel
            @dragstart="onDragStart"
            @dragend="onDragEnd"
            @toggle="isPanelToggled = !isPanelToggled"
          ></html-element-panel>
        </div>
        <!-- <div class="py-3">
          <button
            class="w-full rounded-sm bg-primary p-2 text-on-primary"
            @click="isComputedFieldSidePanelShown = true"
          >
            Computed Fields
          </button>
        </div> -->
      </div>
    </div>
    <app-preview
      :containers="containers"
      :show="isPreviewShown"
      @close="isPreviewShown = false"
    ></app-preview>
    <app-alert></app-alert>
  </div>
  <app-builder-computed-fields
    :show="isComputedFieldSidePanelShown"
    :values="app['computed_fields']"
    @close="isComputedFieldSidePanelShown = false"
    @save="onComputedFieldsSave"
  ></app-builder-computed-fields>
  <app-builder-field-logic
    :app="app"
    :show="isFieldLogicSidePanelShown"
    @close="isFieldLogicSidePanelShown = false"
    @save="onFieldLogicSave"
  ></app-builder-field-logic>
</template>

<script>
import { useBuilderStore } from "@/stores/builder.js";

// import { saveAs } from "file-saver";
import slugify from "slugify";

import FieldPropertiesPanel from "@/components/Builder/Panel/FieldPropertiesPanel.vue";
import HtmlElementPanel from "@/components/Builder/Panel/HtmlElementPanel.vue";

import TopPanel from "@/components/Builder/TopPanel.vue";
import ContainerTabsViewSwitcher from "@/components/Builder/ContainerTabsViewSwitcher.vue";
import ContainerTabsSettings from "../components/Builder/ContainerTabsSettings.vue";
import EmptyColumnPlaceholder from "@/components/Builder/EmptyColumnPlaceholder.vue";
import BuilderAppField from "@/components/Builder/BuilderAppField.vue";
import AppAlert from "@/components/Builder/AppAlert.vue";
import AppBuilderComputedFields from "@/components/Builder/AppBuilderComputedFields.vue";
import AppBuilderFieldLogic from "@/components/Builder/AppBuilderFieldLogic.vue";

import AppPreview from "@/components/Builder/AppPreview.vue";
import AppBuilder from "@/assets/js/AppBuilder";

import createEmptyContainer from "@/assets/js/builder/createEmptyContainer.js";
import createContainerRow from "@/assets/js/builder/createContainerRow.js";
import fixRow from "@/assets/js/builder/fixRow.js";
import iterateColumns from "@/assets/js/builder/iterateColumns.js";
import alert from "@/assets/js/builder/alert.js";

export default {
  name: "App",
  components: {
    AppBuilderComputedFields,
    AppBuilderFieldLogic,
    BuilderAppField,
    TopPanel,
    ContainerTabsViewSwitcher,
    ContainerTabsSettings,
    EmptyColumnPlaceholder,
    FieldPropertiesPanel,
    HtmlElementPanel,
    AppPreview,
    AppAlert
  },
  props: {},
  data: function () {
    return {
      app: { name: "App Name" },
      containerConfigModal: false,
      isEdit: false,
      selectedTable: null,
      columns: [],
      selectedContainerType: "Single Container",
      selectedPrimaryKey: "-",
      containers: [],
      selectedContainer: 0,
      selectedColumn: {},
      dragColumn: {},
      isPreviewShown: false,
      isComputedFieldSidePanelShown: false,
      isFieldLogicSidePanelShown: false,
      isPanelToggled: true
    };
  },
  computed: {
    slugifiedAppName: function () {
      return slugify(this.app.name, { lower: true });
    }
  },
  mounted: function () {
    const self = this;

    if (
      self.$route.params.name !== "" &&
      self.$route.params.name !== undefined
    ) {
      AppBuilder.get(self.$route.params.name, true).then(function (app) {
        self.app = app;
        self.isEdit = true; // Not working
        self.selectedTable = app.table;
        self.selectedPrimaryKey = app.pk;
        self.selectedContainerType = app.container_type;

        self.clearItems();
      });
    } else {
      const store = useBuilderStore();

      if (typeof store.importAppData.name !== "undefined") {
        const app = store.importAppData;
        store.importAppData = {};

        self.app = app;
        self.isEdit = true; // Not working
        self.selectedTable = app.table;
        self.selectedPrimaryKey = app.pk;
      } else {
        self.isEdit = false; // Not working
        self.selectedTable = "";
      }
    }

    self.clearItems();

    document.addEventListener("keydown", self.onKeyDown);
    window.addEventListener("scroll", this.onWindowScroll);
  },
  unmounted: function () {
    document.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  methods: {
    addElement: function (
      container_index,
      row,
      column,
      saved_element,
      is_add_inside_row
    ) {
      const container = this.containers[container_index];

      let element = {
        is_focused: false,
        is_selected: false
      };

      if (typeof saved_element === "undefined") {
        element.element = this.dragColumn.element;
        element.content = this.dragColumn.content;
      } else {
        element = saved_element;
      }

      const element_index = this.columns.findIndex(function (item) {
        return item.name === element.name;
      });

      if (element_index !== -1) {
        this.columns[element_index].is_added = true;
      }

      if (typeof row !== "undefined" && typeof column !== "undefined") {
        if (!is_add_inside_row) {
          container.rows.splice(
            row + 1,
            0,
            createContainerRow("default", 1, [element])
          );
        } else {
          container.rows[row].columns.splice(column, 0, element);
        }
      } else {
        /* Remove first row if first row is empty  */
        if (container.rows[0].grid == 0) {
          container.rows.pop();
        }

        /* Create new row and add element */
        container.rows.push(
          createContainerRow("default", container.rows.length, [element])
        );
      }

      this.removeEmptyPlaceholder();
    },
    importApp: function (app) {
      this.app = app;
      this.isEdit = true;
      this.selectedTable = app.table;
      this.selectedPrimaryKey = app.pk;

      this.clearItems();
    },
    onComputedFieldsSave: function (value) {
      this.app["computed_fields"] = value;
    },
    onContainerDragEnter: function () {
      this.removeEmptyPlaceholder();
    },
    onCopyCode: function (column) {
      const copied_column = JSON.parse(JSON.stringify(column));

      delete copied_column.container;
      delete copied_column.column;
      delete copied_column.row;
      delete copied_column.is_focused;

      navigator.clipboard
        .writeText(JSON.stringify(copied_column))
        .then(() => {
          alert(
            "Builder",
            'Element "' +
              copied_column.element +
              '" copied to clipboard successfully',
            "success"
          );
        })
        .catch(() => {
          alert("Builder", "Unable to copy text to clipboard", "error");
        });
    },
    onCreateAndMoveToRowAbove: function (container, row, column) {
      let removed_item = this.removeItem(container, row, column)[0];

      this.containers[container].rows.splice(
        row,
        0,
        createContainerRow("default", row, [
          removed_item,
          {
            type: "empty"
          }
        ])
      );

      fixRow(this.containers[container].rows);
    },
    onCreateAndMoveToRowBelow: function (container, row, column) {
      let removed_item = this.removeItem(container, row, column)[0];

      this.containers[container].rows.splice(
        row + 1,
        0,
        createContainerRow("default", row, [
          removed_item,
          {
            type: "empty"
          }
        ])
      );

      fixRow(this.containers[container].rows);
    },
    onCreateLogic: function (container, row, column) {
      this.isFieldLogicSidePanelShown = true;
      console.log("Create Logic", container, row, column);
    },
    onDragEnd: function () {
      this.dragColumn = {};

      this.removeEmptyPlaceholder();
    },
    onDragStart: function ($event, element) {
      this.dragColumn = element;
    },
    onDuplicate: function (container, row, column) {
      let item = JSON.parse(
        JSON.stringify(this.containers[container].rows[row].columns[column])
      );

      item.is_focused = false;
      item.row += 1;
      item.column = 0;

      if (typeof item.name !== "undefined") {
        let name_parts = item.name.split("_");
        let counter = parseInt(name_parts[name_parts.length - 1]);
        let base_name = "";
        let columns_name = [];

        if (isNaN(counter)) {
          counter = 0;
          base_name = name_parts.join("_");
        } else {
          name_parts.pop();
          base_name = name_parts.join("_");
        }

        counter += 1;

        iterateColumns(
          this.containers,
          function (container_index, row_index, column_index, column) {
            if (typeof column.name !== "undefined") {
              columns_name.push(column.name);
            }
          }
        );

        while (columns_name.includes(base_name + "_" + counter)) {
          counter++;
        }

        item.name = base_name + "_" + counter;
      }

      this.containers[container].rows.splice(
        row + 1,
        0,
        createContainerRow("default", row + 1, [item])
      );

      fixRow(this.containers[container].rows);
    },
    onFieldLogicSave: function (value) {
      this.app["field_logics"] = value;
    },
    onKeyDown: function (event) {
      const self = this;

      if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        navigator.clipboard
          .readText()
          .then((clipboardText) => {
            console.log(clipboardText);
            try {
              const field = JSON.parse(clipboardText);

              if (typeof field.element !== "undefined") {
                self.addElement(
                  self.selectedContainer,
                  undefined,
                  undefined,
                  field,
                  true
                );
              }
            } catch (err) {
              console.log("Error parsing element", err);
            }
          })
          .catch((err) => {
            console.error("Unable to read from clipboard", err);
          });
      } else if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        if (
          event.target.tagName !== "INPUT" &&
          event.target.tagName !== "TEXTAREA"
        ) {
          if (typeof this.selectedColumn.element !== "undefined") {
            this.onCopyCode(this.selectedColumn);
          } else {
            alert(
              "Builder",
              "You must choose an element to copy before proceeding",
              "error"
            );
          }
        }
      }
    },
    onMoveToRowAbove: function (container, row, column) {
      let removed_item = this.removeItem(container, row, column)[0];

      this.containers[container].rows[row - 1].columns.splice(
        this.containers[container].rows[row - 1].columns.length - 1,
        0,
        removed_item
      );

      fixRow(this.containers[container].rows);
    },
    onMoveToRowBelow: function (container, row, column, item) {
      let removed_item = this.removeItem(container, row, column, item)[0];

      this.containers[container].rows[row + 1].columns.splice(
        this.containers[container].rows[row + 1].columns.length - 1,
        0,
        removed_item
      );

      fixRow(this.containers[container].rows);
    },
    onNewRowDragEnter: function (row) {
      this.removeEmptyPlaceholder();

      row.showNewEmptyRowPlaceholder = true;
    },
    onRemoveItem: function (container, row, column) {
      this.removeItem(container, row, column);

      fixRow(this.containers[container].rows);
    },
    onSwitchColumn: function (row_index, column_index) {
      const row = this.containers[this.selectedContainer].rows[row_index];
      const column = row.columns[column_index];

      if (typeof this.dragColumn.name === "undefined") {
        return;
      }

      this.setFocus();

      row.showEmptyColumn = true;
      row.grid = row.columns.length;

      if (column.type !== "empty") {
        row.showNewEmptyRowPlaceholder = false;

        /* Remove empty column placeholder */
        this.removeEmptyPlaceholder(row_index);

        /* Move empty column placeholder */
        row.columns.splice(column_index, 0, {
          type: "empty"
        });
      }
    },
    onViewLogicButtonClick: function () {
      this.isFieldLogicSidePanelShown = true;
    },
    onWindowScroll: function () {
      if (window.scrollY > this.$refs.mainContainer.offsetTop) {
        this.$refs.panelContainer.classList.add("sticky");
        this.$refs.panelContainer.classList.add("top-2");
        this.$refs.panelContainer.classList.add("z-10");
      } else {
        this.$refs.panelContainer.classList.remove("sticky");
        this.$refs.panelContainer.classList.remove("top-2");
        this.$refs.panelContainer.classList.remove("z-10");
      }
    },
    columnDragLeave: function ($event, row, column) {
      this.removeEmptyPlaceholder();

      $event;
      row;
      column;
    },
    removeItem: function (container, row, column) {
      if (
        this.selectedColumn ===
        this.containers[container].rows[row].columns[column]
      ) {
        this.selectedColumn = {};
      }

      let removed_item = JSON.parse(
        JSON.stringify(
          this.containers[container].rows[row].columns.splice(column, 1)
        )
      );

      return removed_item;
    },
    clearItems: function () {
      const self = this;

      // Optimize this
      if (!this.isEdit) {
        this.selectedColumn = {};

        this.containers.splice(0, 1, createEmptyContainer());
      } else {
        if (
          typeof self.app.containers !== "undefined" &&
          Array.isArray(self.app.containers)
        ) {
          self.containers = [];

          for (let index = 0; index < self.app.containers.length; index++) {
            const container = self.app.containers[index];

            self.containers.push(createEmptyContainer(container.name));
          }
        }

        for (let index = 0; index < self.app.columns.length; index++) {
          const column = self.app.columns[index];

          column.container = parseInt(column.container);
          column.row = parseInt(column.row);
          column.column = parseInt(column.column);

          if (typeof self.containers[column.container] === "undefined") {
            self.containers[column.container] = {
              name:
                typeof self.app.containers[column.container] !== "undefined" &&
                typeof self.app.containers[column.container].name !==
                  "undefined"
                  ? self.app.containers[column.container].name
                  : "default",
              rows: []
            };
          }

          if (
            typeof self.containers[column.container].rows[column.row] ==
            "undefined"
          ) {
            self.containers[column.container].rows[column.row] =
              createContainerRow();
          }

          self.dragColumn = {
            content: column.content, //  TODO Is this needed?
            element: column.element,
            name: column.name,
            type: "html" //  TODO Is this needed?
          };

          self.addElement(
            column.container,
            column.row,
            column.column,
            column,
            true
          );
        }
      }
    },
    removeEmptyPlaceholder: function (skip_row_index) {
      let self = this;

      iterateColumns(
        self.containers,
        function (container_index, row_index, column_index, column, row) {
          row.showNewEmptyRowPlaceholder = false;

          if (column.type == "empty") {
            row.columns.splice(column_index, 1);
          }
        },
        function (container_index, row_index, row) {
          if (row_index != skip_row_index) {
            row.columns.push({
              type: "empty"
            });

            row.grid = row.columns.length - 1;
            row.showEmptyColumn = false;
          }
        }
      );
    },
    setSelect: function (set_container = -1, set_row = -1, set_column = -1) {
      let self = this;

      if (set_container == -1 && set_row == -1 && set_column == -1) {
        self.selectedColumn = {};
      }

      iterateColumns(
        self.containers,
        function (container_index, row_index, column_index, column) {
          if (
            container_index == set_container &&
            row_index == set_row &&
            column_index == set_column
          ) {
            column.is_selected = !column.is_selected;

            if (column.is_selected) {
              self.selectedColumn = column;
            } else {
              self.selectedColumn = {};
            }
          } else {
            column.is_selected = false;
          }
        }
      );
    },
    setFocus: function (set_container = -1, set_row = -1, set_column = -1) {
      const self = this;

      iterateColumns(
        self.containers,
        function (container_index, row_index, column_index, column) {
          if (
            container_index == set_container &&
            row_index == set_row &&
            column_index == set_column
          ) {
            column.is_focused = true;
          } else {
            column.is_focused = false;
          }
        }
      );
    },
    changeFieldProperties: function (property, value) {
      this.selectedColumn[property] = value;
    },
    showPreview: function () {
      this.isPreviewShown = true;
    },
    tableChange: function (table_name) {
      const self = this;
      const result = table_name.replace(/[-, _]/g, " ");

      self.selectedTable = table_name;

      if (!self.isEdit) {
        self.app.name = result.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
    },
    save: function () {
      const self = this;

      let containers = [];
      let rows = [];
      let columns = [];

      let app = {
        name: self.app.name,
        slug: self.slugifiedAppName,
        table: self.selectedTable,
        pk: self.selectedPrimaryKey,
        container_type: self.selectedContainerType
      };

      iterateColumns(
        self.containers,
        function (container_index, row_index, column_index, column) {
          if (column.type !== "empty") {
            let saved_column = AppBuilder.stripFieldProperties(column);

            saved_column.container = container_index;
            saved_column.row = row_index;
            saved_column.column = column_index;

            columns.push(saved_column);
          }
        },
        function (container_index, row_index, row) {
          rows.push({ name: row.name });
        },
        function (container_index, container) {
          containers.push({
            name: container.name
          });
        }
      );

      app.containers = containers;
      app.rows = rows;
      app.elements = columns;
      app.computed_fields = self.app.computed_fields;
      app.field_logics = self.app.field_logics;
      app = JSON.parse(JSON.stringify(app));

      // let blob = new Blob([JSON.stringify(app, null, 2)], {
      //   type: "application/json;charset=utf-8"
      // });

      // saveAs(blob, app.name + ".json");

      AppBuilder.save(app).then(function () {
        self.$router.push("/app/builder/view");
      });
    }
  }
};
</script>
