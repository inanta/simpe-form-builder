import DB from "@/assets/js/DB.js";

export default {
  data: async function (table, columns, filter, sort) {
    let index = [];

    for (const key in filter) {
      if (Object.hasOwnProperty.call(filter, key)) {
        index.push(key);
      }
    }

    let data = { records: [] };
    let records = await DB.getAll(table, columns, filter, sort);

    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      let row = {};

      for (
        let column_index = 0;
        column_index < columns.length;
        column_index++
      ) {
        const column = columns[column_index];

        // TODO Remove this checking later
        if (typeof record.doc !== "undefined") {
          row[column] = record.doc[column];
        } else {
          row[column] = record[column];
        }
      }

      data.records.push(row);
    }

    return data;
  },
  delete: async function (apps) {
    let results = [];

    for (let index = 0; index < apps.length; index++) {
      const item = apps[index];
      const result = {};

      result[item._id] = await DB.delete("reports", item._id);
      results.push(result);
    }

    return results;
  },
  deleteRecords: async function (app, items) {
    let results = [];

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const result = {};

      result[item._id] = await DB.delete(app.table, item._id);
      results.push(result);
    }

    return results;
  },
  getColumns: async function (slug) {
    const app = await this.get(slug);

    return this.getTableColumns(app.table);
  },
  getTables: async function (current_table) {
    let tables = [
      "apps",
      "logs",
      "users",
      "products",
      "customers",
      "employees",
      "raw_materials",
      "payment_types",
      "order_requests"
    ];

    if (typeof current_table !== "undefined") {
      if (tables.includes(current_table)) {
        return [current_table];
      }
    }

    return tables;
  },
  getTableColumns: async function (table) {
    let columns = {
      apps: ["_id", "name", "table", "slug", "containers"],
      logs: ["_id", "type", "message"],
      users: ["_id", "fullname", "username", "password", "email", "info"],
      products: [
        "_id",
        "code",
        "product_name",
        "price",
        "manufacturing_wages",
        "price_alt_1",
        "price_alt_2",
        "price_alt_3",
        "info"
      ],
      customers: ["_id", "code", "name", "address", "phone", "email", "info"],
      employees: ["_id", "code", "name", "info"],
      raw_materials: ["_id", "code", "name", "unit", "info"],
      payment_types: ["_id", "code", "name", "info"],
      order_requests: ["_id", "code", "time", "employee", "info"]
    };

    if (typeof columns[table] !== "undefined") {
      return columns[table];
    }

    return [];
  },
  // fetchData: function (table, label_column, value_column, callback) {
  //   const baseURI =
  //     "https://labs.8daysproject.com/backend/index.php/page/admin/service/page/appbuilderdata/" +
  //     table +
  //     "/" +
  //     label_column +
  //     "/" +
  //     value_column;

  //   axios
  //     .get(baseURI)
  //     .then((result) => {
  //       callback(result.data);
  //     })
  //     .catch(function () {
  //       callback(["column_1", "column_2", "column_3", "column_4", "column_5"]);
  //     });
  // },
  get: async function (slug, is_included_metadata) {
    const app = await DB.get("reports", slug);

    for (let index = 0; index < app.columns.length; index++) {
      const column = app.columns[index];

      for (const key in column) {
        if (Object.hasOwnProperty.call(column, key)) {
          const attribute = column[key];

          if (
            typeof attribute === "object" &&
            typeof attribute.source !== "undefined" &&
            attribute.source === "db"
          ) {
            let items = await DB.getAll(attribute.table);
            let value = [];

            for (let item_index = 0; item_index < items.length; item_index++) {
              const item = items[item_index];

              value.push({
                element: "option", // TODO Static value "option", change this accordingly
                label: item.doc[attribute.label_column],
                value: item.doc[attribute.value_column]
              });
            }

            if (
              typeof is_included_metadata === "undefined" ||
              (typeof is_included_metadata !== "undefined" &&
                is_included_metadata === false)
            ) {
              app.columns[index][key] = value;
            } else {
              app.columns[index][key].value = value;
            }
          }
        }
      }
    }

    return app;
  },
  getAll: function () {
    return DB.getAll("reports").then(function (records) {
      console.log("RECS", records);
      let apps = {
        headers: [
          {
            label: "",
            value: "id",
            searchable: false,
            sortable: false,
            visible: true
          },
          {
            label: "Name",
            value: "name",
            searchable: true,
            sortable: true,
            visible: true
          },
          {
            label: "Slug",
            value: "slug",
            searchable: true,
            sortable: true,
            visible: true
          },
          {
            label: "Tags",
            value: "tags",
            searchable: false,
            sortable: false,
            visible: true
          },
          {
            label: "Description",
            value: "info",
            searchable: false,
            sortable: false,
            visible: true
          },
          {
            label: "Action",
            value: "action",
            searchable: false,
            sortable: false,
            visible: true
          }
        ],
        items: [],
        app_id_column: "id"
      };

      for (let index = 0; index < records.length; index++) {
        const app = records[index];

        app.action = app.id;
        app.tags = [];

        if (typeof app.settings === "undefined") {
          app.settings = {};
        }

        let features = {
          label: "Features",
          value: {
            import: {
              label: "Import",
              value: false
            },
            export: {
              label: "Export",
              value: false
            }
          }
        };

        let webhooks = {
          label: "Webhooks",
          value: {
            insert: {
              label: "Insert",
              value: ""
            },
            retrieve: {
              label: "Retrieve",
              value: ""
            },
            update: {
              label: "Update",
              value: ""
            }
          }
        };

        if (typeof app.settings.webhooks === "undefined") {
          app.settings.webhooks = webhooks;
        } else {
          webhooks.value.insert.value = app.settings.webhooks.insert;
          webhooks.value.retrieve.value = app.settings.webhooks.retrieve;
          webhooks.value.update.value = app.settings.webhooks.update;

          app.settings.webhooks = webhooks;
        }

        if (typeof app.settings.features === "undefined") {
          app.settings.features = features;
        } else {
          features.value.import.value = app.settings.features.import;
          features.value.export.value = app.settings.features.export;

          app.settings.features = features;
        }

        apps.items.push(app);
      }

      return apps;
    });
  },
  save: function (report) {
    report._id = report.slug;

    return DB.updateOrInsert("reports", report);
  },
  getAllRecord(slug) {
    return DB.getAll("reports").then(function (apps) {
      let app = {};

      for (let index = 0; index < apps.length; index++) {
        const current_app = apps[index];

        if (current_app.slug == slug) {
          app = current_app;

          break;
        }
      }

      return DB.getAll(app.table).then(function (records) {
        let headers = [
          {
            additional: true,
            hideable: false,
            label: "_id",
            searchable: false,
            sortable: false,
            value: "_id",
            visible: true
          }
        ];
        let items = [];

        for (let index = 0; index < app.columns.length; index++) {
          const column = app.columns[index];

          headers.push({
            additional: false,
            align: typeof column.align === "undefined" ? "left" : column.align,
            label: column.label,
            format:
              typeof column.format === "undefined" ? "general" : column.format,
            value: column.name,
            visible:
              typeof column.visible === "undefined" ? true : column.visible
          });
        }

        headers.push({
          additional: true,
          hideable: false,
          label: "Action",
          sortable: false,
          value: "action",
          visible: true
        });

        for (let index = 0; index < records.length; index++) {
          const record = records[index];

          items.push(record);
        }

        return { headers: headers, items: items, app: app };
      });
    });
  },
  getRecord: async function (db, id) {
    const app = await DB.get("reports", db);

    return DB.get(app.table, id);
  },
  insertRecord: function (app, data) {
    data._id = Date.now().toString();

    return DB.insert(app.table, data);
  },
  insertRecords: function (app, data) {
    for (let index = 0; index < data.length; index++) {
      data[index]._id = (Date.now() + index).toString();
    }

    return DB.bulkInsert(app.table, data);
  },
  settings: function (app, settings) {
    const self = this;
    let current_settings = {};

    return self.get(app.slug).then(function (app) {
      if (typeof app.settings !== "undefined") {
        current_settings = app.settings;
      }

      if (typeof settings.is_read_only !== "undefined") {
        app.is_read_only = settings.is_read_only;
      }

      if (typeof settings.headers !== "undefined") {
        for (
          let header_index = 0;
          header_index < settings.headers.length;
          header_index++
        ) {
          const header = settings.headers[header_index];

          for (let index = 0; index < app.columns.length; index++) {
            const column = app.columns[index];

            if (column.name == header.value) {
              column.align =
                typeof header.align === "undefined" ? "left" : header.align;
              column.format =
                typeof header.format === "undefined"
                  ? "general"
                  : header.format;
              column.visible = header.visible;
            }
          }
        }

        current_settings.headers = settings.headers;
      }

      for (const key in settings) {
        if (Object.hasOwnProperty.call(settings, key)) {
          const element = settings[key];

          if (key === "is_read_only") continue;

          current_settings[key] = element;
        }
      }

      app.settings = current_settings;

      return self.save(app);
    });
  },
  updateRecord: function (app, data) {
    return DB.update(app.table, data);
  },
  _getFields: function (app) {
    let fields = [];

    for (
      let container_index = 0;
      container_index < app.containers.length;
      container_index++
    ) {
      const container = app.containers[container_index];

      // app.containers[container_index] = {
      //   name: container.name,
      //   rows: []
      // };

      for (let row_index = 0; row_index < container.rows.length; row_index++) {
        const row = container.rows[row_index];

        // app.containers[container_index]["rows"][row_index] = {
        //   name: row.name,
        //   grid: row.grid,
        //   columns: []
        // };

        for (let index = 0; index < row.columns.length; index++) {
          const column = row.columns[index];

          fields.push(column);
        }
      }

      return fields;
    }
  }
};
