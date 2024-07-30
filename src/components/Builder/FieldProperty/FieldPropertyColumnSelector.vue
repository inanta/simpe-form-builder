<template>
  <div :class="{ 'h-28': showAdd }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="add"
    >
      <span class="mdi mdi-plus"></span> Select
    </button>

    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        class="absolute left-0 top-0 flex h-full w-full flex-col overflow-auto bg-white p-2 dark:bg-surface--dark-300"
      >
        <div class="flex-grow">
          <div class="py-0.5 pr-1"><b>Column</b></div>
          <div class="py-0.5">
            <select
              v-model="selectedColumn"
              class="w-full rounded-sm border border-primary bg-white outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              @change="changeTableColumns"
            >
              <option value="">-</option>
              <option
                v-for="column in availableColumns"
                :key="column.name"
                :value="column.name"
              >
                {{ column.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="showAdd = false"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="save"
          >
            <span class="mdi mdi-check"></span> Save
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: function () {
        return [];
      }
    },
    configuration: {
      type: Object,
      default: function () {
        return {
          additionalFields: [],
          additionalColumnAttributes: []
        };
      }
    },
    fieldProperty: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    change: null
  },
  data: function () {
    return {
      currentColumn: null,
      selectedColumn: "",
      showAdd: false
    };
  },
  computed: {
    availableColumns: function () {
      const available_columns = [];

      if (
        typeof this.properties[this.fieldProperty] !== "undefined" &&
        this.properties[this.fieldProperty] !== ""
      ) {
        available_columns.push({ name: this.properties[this.fieldProperty] });
      }

      for (let index = 0; index < this.columns.length; index++) {
        const column = this.columns[index];

        if (!column.is_added) {
          available_columns.push(column);
        }
      }

      return available_columns;
    }
  },
  watch: {
    properties: function () {
      this.showAdd = false;
    }
  },
  mounted: function () {
    this.initializeItems();
  },
  methods: {
    initializeItems: function () {
      this.selectedColumn = "";

      if (typeof this.properties[this.fieldProperty] !== "undefined") {
        this.selectedColumn = this.properties[this.fieldProperty];
      }
    },
    add: function () {
      this.initializeItems();

      this.showAdd = true;
    },
    save: function () {
      this.showAdd = false;
      this.$emit("change", this.fieldProperty, this.selectedColumn);
    }
  }
};
</script>
