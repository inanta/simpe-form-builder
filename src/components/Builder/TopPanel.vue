<template>
  <div class="mt-3 dark:text-on-surface--dark-100">
    <div class="flex w-full">
      <button
        class="rounded-sm bg-primary py-2 px-4 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
        @click="onImportButtonClick"
      >
        <span class="mdi mdi-import"></span> Import
      </button>
      <button
        v-if="configurations.builder.databaseSelection"
        class="mr-auto ml-2 rounded-sm bg-primary py-2 px-4 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
        @click="isDatabaseSelectionShown = true"
      >
        <span class="mdi mdi-database-cog"></span> Selected Database:
        {{ selectedTable }}
      </button>
      <button
        class="ml-auto rounded-sm bg-primary py-2 px-4 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
        @click="$emit('preview')"
      >
        <span class="mdi mdi-eye"></span> Preview
      </button>

      <button
        class="ml-2 rounded-sm bg-primary py-2 px-4 text-on-primary dark:bg-primary--dark dark:text-on-primary--dark"
        @click="$emit('save')"
      >
        <span class="mdi mdi-content-save"></span> Save
      </button>
    </div>
    <input
      ref="import"
      style="display: none"
      type="file"
      @change="onImportFileChange"
    />
    <ns-dialog
      v-if="configurations.builder.databaseSelection"
      :show="isDatabaseSelectionShown"
      @close="isDatabaseSelectionShown = false"
    >
      <template #title>Select Database</template>
      <div class="p-5">
        <div class="flex space-x-2">
          <ns-drop-down-list
            v-model="selectedTable"
            class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
            :items="tables"
            @change="onCurrentTableChanged"
          ></ns-drop-down-list>
          <ns-drop-down-list
            v-model="selectedPrimaryKey"
            class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
            :items="databaseColumnNames"
            @change="onChangePrimaryKey"
          ></ns-drop-down-list>
          <ns-drop-down-list
            v-model="selectedContainerType"
            class="w-full appearance-none rounded-sm border bg-white px-3 py-1.5 text-base text-black outline-none focus:border-primary dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
            :items="containerTypes"
            @change="onChangeContainerType"
          ></ns-drop-down-list>
        </div>
      </div>
    </ns-dialog>
  </div>
</template>

<script>
import NsDropDownList from "@/components/NS/NsDropDownList.vue";
import NsDialog from "@/components/NS/NsDialog.vue";

import configurations from "@/assets/js/builder/variables/configurations.js";
import AppBuilder from "@/assets/js/AppBuilder.js";

export default {
  name: "TopPanel",
  components: { NsDropDownList, NsDialog },
  props: {
    containerType: {
      type: String,
      default: "Single Container"
    },
    edit: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    table: {
      type: String,
      default: ""
    },
    pk: {
      type: String,
      default: ""
    }
  },
  emits: {
    columnsChange: null,
    containerTypeChange: null,
    import: null,
    preview: null,
    primaryKeyChange: null,
    save: null,
    selectedTableChange: null,
    tablesChange: null
  },
  data: function () {
    return {
      tables: [],
      selectedTable: "",
      columns: [],
      configurations: configurations,
      isDatabaseSelectionShown: false,
      selectedPrimaryKey: "-",
      containerTypes: ["Single Container", "Tabs", "Accordion"],
      selectedContainerType: "Single Container",
      containers: [],
      selectedContainer: 0
    };
  },
  computed: {
    databaseColumnNames: function () {
      let columns = ["-"];

      this.columns.forEach(function (element) {
        columns.push(element.name);
      });

      return columns;
    }
  },
  watch: {
    containerType: {
      handler: function (value) {
        this.selectedContainerType = value;
      },
      immediate: false
    },
    table: {
      handler: function (value) {
        this.selectedTable = value;

        if (this.tables.length === 0) {
          this.getTables(value);
        }
      },
      immediate: false
    },
    pk: {
      handler: function (value) {
        this.selectedPrimaryKey = value;
      },
      immediate: false
    }
  },
  mounted: function () {},
  methods: {
    getTables: function (current_table) {
      const self = this;

      AppBuilder.getTables(current_table).then(function (data) {
        self.tables.splice(0);

        self.tables.push("-");

        for (let i = 0; i < data.length; i++) {
          const table = data[i];
          self.tables.push(table);
        }

        if (data.length > 0) {
          self.selectedTable = data[0];
          self.$emit("selectedTableChange", data[0]);
        }

        self.getTableColumns();

        self.$emit("tablesChange", self.tables);
      });
    },
    getTableColumns: function () {
      const self = this;

      if (self.selectedTable === "-") {
        self.$emit("columnsChange", []);
      } else {
        AppBuilder.getTableColumns(self.selectedTable).then(function (data) {
          self.columns.splice(0);

          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            self.columns.push({ name: element, is_added: false });
          }

          if (self.selectedPrimaryKey === "") {
            self.selectedPrimaryKey = "-";
          }

          self.$emit("columnsChange", self.columns);
        });
      }
    },
    onChangePrimaryKey: function (value) {
      const self = this;

      self.$emit("primaryKeyChange", value);
    },
    onChangeContainerType: function (value) {
      const self = this;

      self.$emit("containerTypeChange", value);
    },
    onCurrentTableChanged: function (value) {
      const self = this;

      self.selectedTable = value;
      self.getTableColumns();

      self.$emit("selectedTableChange", value);
    },
    onImportButtonClick: function () {
      this.$refs.import.click();
    },
    onImportFileChange: function () {
      const self = this;

      if (typeof self.$refs.import.files[0] !== "undefined") {
        const reader = new FileReader();

        reader.addEventListener(
          "load",
          function () {
            const app = JSON.parse(reader.result);

            app.columns = app.elements;

            self.$emit("import", app);
          },
          false
        );

        reader.readAsText(self.$refs.import.files[0]);
      }
    }
  }
};
</script>
