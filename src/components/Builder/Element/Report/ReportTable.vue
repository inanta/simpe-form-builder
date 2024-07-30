<template>
  <div>
    <h1 v-if="reportTableTitle" class="p-4 text-center text-2xl">
      {{ reportTableTitle }}
    </h1>
    <table v-if="columns.length > 0" class="w-full">
      <thead>
        <tr class="bg-primary">
          <th
            v-for="(column, index) in columns"
            :key="column.name"
            :class="{
              'rounded-tl': index === 0,
              'rounded-tr': index === columns.length - 1,
              'text-left': column.align === 'left',
              'text-center': column.align === 'center',
              'text-right': column.align === 'right'
            }"
            class=""
          >
            {{ column.alias }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="items.length > 0">
          <tr v-for="(item, index) in items" :key="item.name">
            <td
              v-for="column in columns"
              :key="column.name"
              :class="{
                'border-b-2 border-primary': index === items.length - 1,
                'text-left': column.align === 'left',
                'text-center': column.align === 'center',
                'text-right': column.align === 'right'
              }"
              class=""
            >
              {{ formatValue(item[column.name], column.format) }}
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td class="text-center" :colspan="columns.length">
              {{ reportTableEmptyItemsPlaceholder }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-else>Please Select Table And Columns First.</div>
  </div>
</template>

<script>
import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import AppBuilder from "@/assets/js/AppBuilder";

export default {
  props: {
    filters: {
      type: Object,
      default: function () {
        return {};
      }
    },
    reportTableEmptyItemsPlaceholder: {
      type: String,
      default: "No Data"
    },
    reportTableFilter: {
      type: Object,
      default: function () {
        return {};
      }
    },
    reportTableLimit: {
      type: String,
      default: ""
    },
    reportTableSort: {
      type: Object,
      default: function () {
        return {};
      }
    },
    reportTableSource: {
      type: Object,
      default: function () {
        return {};
      }
    },
    reportTableTitle: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {
      items: []
    };
  },
  computed: {
    columns: function () {
      let columns = [];

      if (typeof this.reportTableSource !== "undefined") {
        if (
          typeof this.reportTableSource.columns !== "undefined" &&
          Array.isArray(this.reportTableSource.columns)
        ) {
          columns = this.reportTableSource.columns;
        }
      }

      return columns;
    }
  },
  watch: {
    report: function () {
      this.initializeItems();
    },
    reportTableFilter: function () {
      this.initializeItems();
    },
    reportTableLimit: function () {
      this.initializeItems();
    },
    reportTableSort: function () {
      this.initializeItems();
    },
    reportTableSource: function () {
      this.initializeItems();
    },
    reportTableTitle: function () {
      this.initializeItems();
    }
  },
  mounted: function () {
    this.initializeItems();
  },
  methods: {
    formatValue: function (value, format) {
      if (format === "number" || format === "currency") {
        value = Number(value);

        if (isNaN(value)) {
          value = 0;
        }
      }

      if (format === "date") {
        const dt = new Date(value);

        return (
          dt.getFullYear() +
          "-" +
          (dt.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          dt.getDate().toString().padStart(2, "0")
        );
      } else if (format === "date-time") {
        const dt = new Date(value);

        return (
          dt.getFullYear() +
          "-" +
          (dt.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          dt.getDate().toString().padStart(2, "0") +
          " " +
          dt.getHours().toString().padStart(2, "0") +
          ":" +
          dt.getMinutes().toString().padStart(2, "0") +
          ":" +
          dt.getSeconds().toString().padStart(2, "0")
        );
      } else if (format === "number") {
        return Intl.NumberFormat("id-ID").format(value);
      } else if (format === "currency") {
        return Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR"
        }).format(value);
      }

      return value;
    },
    initializeItems: async function () {
      const self = this;

      let filters = JSON.parse(JSON.stringify(self.reportTableFilter));

      if (typeof self.filters !== "undefined") {
        if (typeof filters === "undefined") {
          filters = {};
        }

        if (typeof filters.operator === "undefined") {
          filters = { operator: "and" };
        }

        if (typeof filters.conditions === "undefined") {
          filters.conditions = [];
        }

        for (const key in self.filters) {
          if (Object.hasOwnProperty.call(self.filters, key)) {
            const filter = self.filters[key];

            if (typeof filter.field !== "undefined") {
              filters.conditions.push(filter);
            }
          }
        }
      }

      if (
        typeof self.reportTableSource !== "undefined" &&
        typeof self.reportTableSource.table !== "undefined"
      ) {
        let columns = self.reportTableSource.columns.map(function (item) {
          return item.name;
        });

        let items = await AppBuilder.data({
          table: self.reportTableSource.table,
          columns: columns,
          filters: filters,
          sort: self.reportTableSort,
          limit:
            isNaN(self.reportTableLimit) || self.reportTableLimit === ""
              ? undefined
              : Number(self.reportTableLimit)
        });

        self.items = items.records;
      }
    }
  }
};

FieldProperties["report-table"] = {
  "report-table-title": {
    label: "Title"
  },
  "report-table-source": {
    label: "Source"
  },
  "report-table-filter": {
    label: "Static Filters"
  },
  "report-table-sort": {
    label: "Sorts"
  },
  "report-table-limit": {
    label: "Limit",
    placeholder: "No Limit"
  },
  "report-table-empty-items-placeholder": {
    label: "Empty Items Placeholder",
    placeholder: "No Data"
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

table thead tr {
  color: #ffffff;
  text-align: left;
}

table th,
table td {
  padding: 12px 15px;
}

table tbody tr {
  border-bottom: thin solid #dddddd;
}

table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
</style>
