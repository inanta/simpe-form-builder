<template>
  <div class="relative mx-4 mb-4 overflow-hidden">
    <top-panel
      :table="selectedTable"
      :pk="selectedPrimaryKey"
      :container-type="selectedContainerType"
      :edit="isEdit"
      @columns-change="
        columns = $event;
        clearItems();
      "
      @container-type-change="selectedContainerType = $event"
      @primary-key-change="selectedPrimaryKey = $event"
      @preview="showPreview"
      @save="save"
      @selected-table-change="tableChange"
    ></top-panel>
    <hr class="border-top my-4 border-gray-300" />
    <div class="pb-2">
      <input
        v-model="report.name"
        class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-2xl outline-none"
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
    <div class="flex">
      <template v-for="(container, index) in containers" :key="container.name">
        <div
          v-if="index == selectedContainer"
          class="mr-4 flex-shrink flex-grow"
        >
          <div
            class="rounded border border-gray-300 px-2 py-4"
            @dragenter.self="containerDragEnter(container)"
          >
            <div
              v-for="(row, row_index) in container.rows"
              :key="row_index"
              :class="'grid-cols-' + row.grid"
              class="grid gap-0"
              @dragenter="rowDragEnter($event, row)"
              @dragleave="rowDragLeave($event, row)"
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
                    :row="row_index"
                    @add-element="addElement"
                  ></empty-column-placeholder>
                </div>
                <div v-if="column.type != 'empty'">
                  <builder-report-field
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
                    @focus="setFocus(index, row_index, column_index)"
                    @move-to-row-above="
                      onMoveToRowAbove(index, row_index, column_index, column)
                    "
                    @move-to-row-below="
                      onMoveToRowBelow(index, row_index, column_index, column)
                    "
                    @remove="removeItem(index, row_index, column_index, column)"
                    @select="setSelect(index, row_index, column_index)"
                    @switch-column="onSwitchColumn"
                  ></builder-report-field>
                </div>
              </template>
            </div>
            <div>
              <div
                v-if="
                  (container.rows.length == 1 &&
                    container.rows[0].columns.length == 1) ||
                  (container.rows[container.rows.length - 1].grid > 0 &&
                    container.showEmptyRowPlaceholder)
                "
                class="flex content-center items-center rounded-sm px-2 py-3 text-primary"
              >
                <empty-column-placeholder
                  :container="index"
                  :element="dragColumn.name"
                  @add-element="addElement"
                ></empty-column-placeholder>
              </div>
            </div>
          </div>
        </div>
        <!-- Is table attribute needed? -->
      </template>
      <div class="w-60 flex-shrink-0 flex-grow-0 overflow-hidden text-sm">
        <field-properties-panel
          :containers="containers"
          :table="selectedTable"
          :properties="selectedColumn"
          @change="changeFieldProperties"
          @close="setSelect"
        ></field-properties-panel>
        <filter-element-panel
          :columns="columns"
          :hidden="selectedContainer !== 0"
          @dragstart="startDragElement"
        ></filter-element-panel>
        <div>
          <report-element-panel
            @dragstart="startDragElement"
          ></report-element-panel>
        </div>
      </div>
    </div>
    <app-preview
      :containers="containers"
      :show="isPreviewShown"
      @close="isPreviewShown = false"
    ></app-preview>
  </div>
</template>

<script>
import { useBuilderStore } from "@/stores/builder.js";

import slugify from "slugify";

import FieldPropertiesPanel from "@/components/Builder/Panel/FieldPropertiesPanel.vue";
import ReportElementPanel from "@/components/Builder/Panel/ReportElementPanel.vue";
import FilterElementPanel from "@/components/Builder/Panel/FilterElementPanel.vue";

import TopPanel from "@/components/Builder/TopPanel.vue";
import ContainerTabsViewSwitcher from "@/components/Builder/ContainerTabsViewSwitcher.vue";
import ContainerTabsSettings from "../components/Builder/ContainerTabsSettings.vue";
import EmptyColumnPlaceholder from "@/components/Builder/EmptyColumnPlaceholder.vue";
import BuilderReportField from "@/components/Builder/BuilderReportField.vue";

import AppPreview from "@/components/Builder/AppPreview.vue";
import ReportBuilder from "@/assets/js/ReportBuilder.js";

import createEmptyContainer from "@/assets/js/builder/createEmptyContainer.js";
import createContainerRow from "@/assets/js/builder/createContainerRow.js";
import fixRow from "@/assets/js/builder/fixRow.js";
import iterateColumns from "@/assets/js/builder/iterateColumns.js";

export default {
  name: "App",
  components: {
    BuilderReportField,
    TopPanel,
    ContainerTabsViewSwitcher,
    ContainerTabsSettings,
    EmptyColumnPlaceholder,
    FieldPropertiesPanel,
    ReportElementPanel,
    AppPreview,
    FilterElementPanel
  },
  props: {},
  data: function () {
    return {
      report: { name: "", table: "" },
      containerConfigModal: false,
      isEdit: false,
      selectedTable: null,
      columns: [],
      selectedContainerType: "Tabs",
      selectedPrimaryKey: "-",
      containers: [],
      selectedContainer: 0,
      selectedColumn: {},
      dragColumn: {},
      isPreviewShown: false
    };
  },
  computed: {},
  mounted: function () {
    const self = this;

    if (self.$route.params.name !== "") {
      ReportBuilder.get(self.$route.params.name, true).then(function (report) {
        self.report = report;
        self.isEdit = true; // Not working
        self.selectedTable = report.table;
        self.selectedPrimaryKey = report.pk;
        // self.selectedContainerType = report.container_type;
      });
    } else {
      const store = useBuilderStore();

      if (typeof store.importAppData.name !== "undefined") {
        const app = store.importAppData;
        store.importAppData = {};

        self.report = app;
        self.isEdit = true; // Not working
        self.selectedTable = app.table;
        self.selectedPrimaryKey = app.pk;
      } else {
        self.isEdit = false; // Not working
        self.selectedTable = "";
      }
    }
  },
  methods: {
    startDrag: function ($event, index) {
      this.dragColumn = {
        index: index,
        name: this.columns[index].name,
        type: "db"
      };
    },
    endDrag: function () {
      this.dragColumn = {};

      this.removeEmptyPlaceholder();

      // check later
      this.containers[this.selectedContainer].showEmptyRowPlaceholder = false;

      // remove later
      // this.selectedDatabaseColumn = null;
    },
    startDragElement: function ($event, element) {
      this.dragColumn = element;
    },
    containerDragEnter: function (container) {
      container.showEmptyRowPlaceholder = true;
      this.removeEmptyPlaceholder();
    },
    containerDragLeave: function (container) {
      container.showEmptyRowPlaceholder = false;
    },
    rowDragEnter: function ($event, row) {
      console.log("row enter", row.grid);
    },
    rowDragLeave: function ($event, row) {
      console.log("row leave", row);
      row.showEmptyRowPlaceholder = false;
    },
    addElement: function (container_index, row, column, saved_element) {
      console.log("ADD ELEMENT", row, column, this.dragColumn.type);

      const container = this.containers[container_index];

      let element = {
        is_focused: false,
        is_selected: false
      };

      if (this.dragColumn.type == "db") {
        const index = this.dragColumn.index;

        if (typeof saved_element === "undefined") {
          element.db_column_index = index;
          element.element = "input";
          element.label = this.columns[index].name;
          element.name = this.columns[index].name;
          element.placeholder = "";
          element.type = "text";
        } else {
          element = saved_element;
        }

        this.columns.splice(index, 1, {
          name: this.columns[index].name,
          is_added: true
        });
      } else {
        if (typeof saved_element === "undefined") {
          // element.element = this.dragColumn.element;
          // element.content = this.dragColumn.content;
          // element.contenteditable = "true";

          for (const key in this.dragColumn) {
            if (Object.hasOwnProperty.call(this.dragColumn, key)) {
              const property = this.dragColumn[key];

              element[key] = property;
            }
          }
        } else {
          console.log("SAVED EL", saved_element);
          element = saved_element;
        }
      }

      if (typeof row !== "undefined" && typeof column !== "undefined") {
        container.rows[row].columns.splice(column, 0, element);

        container.rows[row].showEmptyColumn = false;
      } else {
        /* Remove first row if first row is empty  */
        if (container.rows[0].grid == 0) {
          container.rows.pop();
        }

        /* Create new row and add element */
        container.rows.push(
          createContainerRow("default", container.rows.length, [element])
        );

        container.showEmptyRowPlaceholder = false;
      }

      this.removeEmptyPlaceholder();

      // console.log("drop end", this.containers);
    },
    onCreateAndMoveToRowAbove: function (container, row, column, item) {
      let removed_item = this.removeItem(container, row, column, item)[0];

      removed_item.row -= 1;
      removed_item.column = 0;

      this.containers[container].rows.splice(
        row,
        0,
        createContainerRow("default", row, [removed_item])
      );

      fixRow(this.containers[container].rows);
    },
    onCreateAndMoveToRowBelow: function (container, row, column, item) {
      let removed_item = this.removeItem(container, row, column, item)[0];

      removed_item.row += 1;
      removed_item.column = 0;

      this.containers[container].rows.splice(
        row + 1,
        0,
        createContainerRow("default", row, [removed_item])
      );

      fixRow(this.containers[container].rows);
    },
    onMoveToRowAbove: function (container, row, column, item) {
      let removed_item = this.removeItem(container, row, column, item)[0];

      removed_item.row -= 1;
      removed_item.column =
        this.containers[container].rows[row - 1].columns.length - 1;

      this.containers[container].rows[row - 1].columns.push(removed_item);
      this.containers[container].rows[row - 1].grid += 1;

      fixRow(this.containers[container].rows);
    },
    onMoveToRowBelow: function (container, row, column, item) {
      let removed_item = this.removeItem(container, row, column, item)[0];

      removed_item.row += 1;
      removed_item.column =
        this.containers[container].rows[row - 1].columns.length - 1;

      this.containers[container].rows[row + 1].columns.push(removed_item);
      this.containers[container].rows[row + 1].grid += 1;

      fixRow(this.containers[container].rows);
    },
    onSwitchColumn: function (row_index, column_index) {
      const container = this.containers[this.selectedContainer];
      const row = this.containers[this.selectedContainer].rows[row_index];
      const column = row.columns[column_index];

      if (typeof this.dragColumn.name === "undefined") {
        return;
      }

      this.setFocus();

      row.showEmptyColumn = true;
      row.grid = row.columns.length;

      if (column.type !== "empty") {
        container.showEmptyRowPlaceholder = false;

        /* Remove empty column placeholder */
        this.removeEmptyPlaceholder(row_index);

        /* Move empty column placeholder */
        row.columns.splice(column_index, 0, {
          type: "empty"
        });
      }
    },
    columnDragLeave: function ($event, row, column) {
      this.removeEmptyPlaceholder();

      console.log("leaved", column, $event, row.columns.length);
    },
    removeItem: function (container, row, column, item) {
      if (
        this.selectedColumn ===
        this.containers[container].rows[row].columns[column]
      ) {
        this.selectedColumn = {};
      }

      let removed_item = this.containers[container].rows[row].columns.splice(
        column,
        1
      );

      /* Remove row if no column */
      if (
        this.containers[container].rows[row].columns.length === 1 &&
        this.containers[container].rows.length != 1
      ) {
        this.containers[container].rows.splice(row, 1);
        this.containers[container].showEmptyRowPlaceholder = false;
        // console.log(this.containers[container].rows[row]);

        // shiftRowUp(this.containers[container].rows, row);
        fixRow(this.containers[container].rows);
      } else {
        this.containers[container].rows[row].grid =
          this.containers[container].rows[row].columns.length - 1;
      }

      if (typeof item.db_column_index !== "undefined") {
        for (let index = 0; index < this.columns.length; index++) {
          const current_item = this.columns[index];

          if (current_item.name === item.name) {
            this.columns.splice(index, 1, {
              name: this.columns[index].name,
              is_added: false
            });

            break;
          }
        }
      }

      return removed_item;
    },
    clearItems: function () {
      const self = this;

      console.log("ITEM CLEAR", self.isEdit);

      // Optimize this
      if (!this.isEdit) {
        this.selectedColumn = {};

        this.containers.splice(
          0,
          2,
          {
            label: "Filters Container",
            name: "Filters Container",
            rows: [
              {
                name: "default",
                grid: 0,
                columns: [
                  {
                    type: "empty"
                  }
                ],
                showEmptyColumn: false
              }
            ]
          },
          {
            label: "Report Container",
            name: "Report Container",
            rows: [
              {
                name: "default",
                grid: 0,
                columns: [
                  {
                    type: "empty"
                  }
                ],
                showEmptyColumn: false
              }
            ]
          }
        );
      } else {
        if (
          typeof self.report.containers !== "undefined" &&
          Array.isArray(self.report.containers)
        ) {
          for (let index = 0; index < self.report.containers.length; index++) {
            const container = self.report.containers[index];

            self.containers.push(createEmptyContainer(container.name));
          }
        }

        for (let index = 0; index < self.report.columns.length; index++) {
          const column = self.report.columns[index];

          column.container = parseInt(column.container);
          column.row = parseInt(column.row);
          column.column = parseInt(column.column);

          if (typeof self.containers[column.container] === "undefined") {
            self.containers[column.container] = {
              name:
                typeof self.report.containers[column.container] !==
                  "undefined" &&
                typeof self.report.containers[column.container].name !==
                  "undefined"
                  ? self.report.containers[column.container].name
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

          if (typeof column.db_column_index !== "undefined") {
            self.dragColumn.type = "db";

            for (
              let current_column_index = 0;
              current_column_index < self.columns.length;
              current_column_index++
            ) {
              const current_column = self.columns[current_column_index];

              if (column.name === current_column.name) {
                self.dragColumn = {
                  index: current_column_index,
                  name: column.name,
                  type: "db"
                };

                self.selectedContainer = column.container;
                self.addElement(
                  column.container,
                  column.row,
                  column.column,
                  column
                );

                break;
              }
            }
          } else {
            console.log("ELSE", column);

            self.dragColumn = {
              content: column.content, //  TODO Is this needed?
              element: column.element,
              name: column.name,
              type: "html" //  TODO Is this needed?
            };

            // self.dragColumn.content = "Grid";
            // self.dragColumn.element = "grid-input";
            // self.dragColumn.name = "Grid";
            // self.dragColumn.type = "html";

            self.addElement(
              column.container,
              column.row,
              column.column,
              column
            );
          }
        }
      }
    },
    removeEmptyPlaceholder: function (skip_row_index) {
      let self = this;

      iterateColumns(
        self.containers,
        function (container_index, row_index, column_index, column, row) {
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
        self.report.name = result.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      }
    },
    save: function () {
      const self = this;

      let containers = [];
      let rows = [];
      let columns = [];

      let report = {
        name: self.report.name,
        slug: slugify(self.report.name, { lower: true }),
        table: self.selectedTable,
        pk: self.selectedPrimaryKey,
        container_type: self.selectedContainerType
      };

      iterateColumns(
        self.containers,
        function (container_index, row_index, column_index, column) {
          if (column.type !== "empty") {
            let saved_column = ReportBuilder.stripFieldProperties(column);

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

      report.containers = containers;
      report.rows = rows;
      report.columns = columns;

      ReportBuilder.save(report).then(function () {
        self.$router.push("/report/builder/view");
      });
    }
  }
};
</script>
