<template>
  <div class="mb-2 mt-2">
    <!-- <div class="col-span-2" :class="{ 'col-span-4': selectedTable === '-' }">
      <option-drop-down
        :items="tables"
        :value="selectedTable"
        label="Table"
        @option-change="currentTableChanged"
      ></option-drop-down>
    </div>
    <div v-if="selectedTable !== '-'" class="col-span-2">
      <option-drop-down
        :items="databaseColumnNames"
        :value="selectedPrimaryKey"
        label="Primary Key"
        @option-change="changePrimaryKey"
      ></option-drop-down>
    </div>
    <div class="col-span-2">
      <option-drop-down
        :items="containerTypes"
        :value="selectedContainerType"
        label="Container Type"
        @option-change="changeContainerType"
      ></option-drop-down>
    </div>
    <div class="flex items-end">
      <div class="w-full">
        <button
          class="w-full rounded-sm bg-primary p-2 text-on-primary"
          @click="$emit('preview')"
        >
          Preview
        </button>
      </div>
    </div> -->
    <div class="flex">
      <button
        class="ml-auto rounded-sm bg-primary p-2 text-on-primary"
        @click="$emit('save')"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
// import OptionDropDown from "@/components/Builder/OptionDropDown.vue";

import AppBuilder from "@/assets/js/AppBuilder.js";

export default {
  name: "TopPanel",
  // components: { OptionDropDown },
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
    // edit: {
    //   handler: function (value) {
    //     console.log("waTCH is edit", value);
    //     // this.selectedPrimaryKey = value;
    //   },
    //   immediate: false
    // },
    containerType: {
      handler: function (value) {
        this.selectedContainerType = value;
      },
      immediate: false
    },
    table: {
      handler: function (value) {
        // console.log("WATCHED TABLE", value, this.edit);
        this.selectedTable = value;

        // if (value === "") {

        // }

        if (this.tables.length === 0) {
          this.getTables(value);
        }

        // if (value !== "") {
        // if (value !== "" && this.selectedTable !== value) {
        //   this.getTableColumns();
        // }

        // if (value === "") {
        //   this.getTables(true);
        // } else {
        //   this.getTables(false);
        // }
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
    currentTableChanged: function (value) {
      const self = this;

      self.selectedTable = value;
      self.getTableColumns();

      self.$emit("selectedTableChange", value);
    },
    changePrimaryKey: function (value) {
      const self = this;

      self.$emit("primaryKeyChange", value);
    },
    changeContainerType: function (value) {
      const self = this;

      self.$emit("containerTypeChange", value);
    }
  }
};
</script>
