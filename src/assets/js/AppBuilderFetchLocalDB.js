import DB from "@/assets/js/DB.js";

export default {
  data: async function (table, columns, filter, sort, limit) {
    let index = [];

    for (const key in filter) {
      if (Object.hasOwnProperty.call(filter, key)) {
        index.push(key);
      }
    }

    let data = { records: [] };
    let records = await DB.getAll(table, columns, filter, sort, limit);

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

      result[item._id] = await DB.delete("apps", item._id);
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
      "price_types",
      "payment_types",
      "order_requests",
      "order",
      "order_returns",
      "units",
      "distributors"
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
        "quantity",
        "info"
      ],
      customers: [
        "_id",
        "code",
        "customer_name",
        "price_type_id",
        "address",
        "phone",
        "email",
        "info"
      ],
      employees: ["_id", "code", "employee_name", "info"],
      raw_materials: ["_id", "code", "name", "unit", "info"],
      price_types: ["_id", "code", "price_name", "info"],
      payment_types: ["_id", "code", "name", "info"],
      order_requests: [
        "_id",
        "code",
        "time",
        "employee_id",
        "manufacturing_wages",
        "info"
      ],
      order: [
        "_id",
        "code",
        "time",
        "customer_id",
        "customer_name",
        "customer_phone",
        "price_type_id",
        "payment_type_id",
        "address",
        "sender",
        "discount",
        "info"
      ],
      order_returns: [
        "_id",
        "code",
        "time",
        "customer_id",
        "customer_name",
        "address",
        "info"
      ],
      units: ["_id", "unit_name", "info"],
      distributors: [
        "_id",
        "distributor_code",
        "distributor_name",
        "distributor_address",
        "distributor_phone",
        "distributor_email",
        "distributor_info"
      ]
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
    const app = await DB.get("apps", slug);

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

            if (
              typeof attribute.fields !== "undefined" &&
              typeof attribute.fields.allow_empty !== "undefined" &&
              attribute.fields.allow_empty === true
            ) {
              value.push({
                element: "option", // TODO Static value "option", change this accordingly
                label: "-",
                value: ""
              });
            }

            for (let item_index = 0; item_index < items.length; item_index++) {
              const item = items[item_index];

              value.push({
                element: "option", // TODO Static value "option", change this accordingly
                // label: item.doc[attribute.label_column],
                // value: item.doc[attribute.value_column]
                label: item[attribute.label_column],
                value: item[attribute.value_column]
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
    return DB.getAll("apps").then(function (records) {
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

        // app.doc = app;

        app.action = app.id;
        app.tags = [];

        if (typeof app.settings === "undefined") {
          app.settings = {};
        }

        let ui = {
          label: "UI",
          value: {
            view_buttons: {
              label: "View Buttons",
              value: []
            }
          }
        };

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

        if (typeof app.settings.ui === "undefined") {
          app.settings.ui = ui;
        } else {
          ui.value.view_buttons.value = app.settings.ui.view_buttons;

          app.settings.ui = ui;
        }

        apps.items.push(app);
      }

      return apps;
    });
  },
  save: async function (app) {
    app._id = app.slug;

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
            if (typeof app.related_tables === "undefined") {
              app.related_tables = [];
            }

            app.related_tables.push({
              table: attribute.table,
              join_column_1: column.name,
              join_column_2: attribute.value_column,
              columns: [attribute.label_column]
            });
          }
        }
      }
    }

    return DB.updateOrInsert("apps", app);
  },
  getAllRecord: function (slug) {
    return DB.getAll("apps").then(function (apps) {
      let app = {};

      for (let index = 0; index < apps.length; index++) {
        const current_app = apps[index];

        if (current_app.slug == slug) {
          app = current_app;

          break;
        }
      }

      return DB.getAll(app.table).then(async function (records) {
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

          // TODO What to do if column.name is undefined
          if (typeof column.name !== "undefined") {
            headers.push({
              additional: false,
              align:
                typeof column.align === "undefined" ? "left" : column.align,
              label: column.label,
              format:
                typeof column.format === "undefined"
                  ? "general"
                  : column.format,
              value: column.name,
              visible:
                typeof column.visible === "undefined" ? true : column.visible
            });
          }
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

          if (typeof app.related_tables === "undefined") {
            app.related_tables = [];
          }

          for (
            let related_table_index = 0;
            related_table_index < app.related_tables.length;
            related_table_index++
          ) {
            const table = app.related_tables[related_table_index].table;
            const join_column_1 =
              app.related_tables[related_table_index].join_column_1;
            const columns = app.related_tables[related_table_index].columns;

            if (typeof record[join_column_1] !== "undefined") {
              const related_record = await DB.get(
                table,
                record[join_column_1].toString() // DB _id must be string
              );

              record[join_column_1] = related_record[columns[0]];
            }

            // for (
            //   let column_index = 0;
            //   column_index < columns.length;
            //   column_index++
            // ) {
            //   const column = columns[column_index];

            //   record[column] = related_record[column];
            // }
          }

          items.push(record);
        }

        return { headers: headers, items: items, app: app };
      });
    });
  },
  getRecord: async function (db, id) {
    const app = await DB.get("apps", db);
    let data = await DB.get(app.table, id);

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const datum = data[key];

        for (let index = 0; index < app.columns.length; index++) {
          const column = app.columns[index];

          if (
            key === column.name &&
            column.element === "input" &&
            column.type === "date"
          ) {
            const dt = new Date(datum);
            const date =
              dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

            data[key] = date;
          }
        }
      }
    }

    return data;
  },
  insertRecord: async function (app, data) {
    // data._id = Date.now().toString();

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const datum = data[key];

        for (let index = 0; index < app.columns.length; index++) {
          const column = app.columns[index];

          if (
            key === column.name &&
            column.element === "input" &&
            column.type === "date"
          ) {
            data[key] = Date.parse(datum);
          }
        }
      }
    }

    if (typeof app.related_tables !== "undefined") {
      for (let index = 0; index < app.related_tables.length; index++) {
        const table = app.related_tables[index].table;
        const join_column_1 = app.related_tables[index].join_column_1;
        const columns = app.related_tables[index].columns;

        const record = await DB.get(table, data[join_column_1].toString());

        for (
          let column_index = 0;
          column_index < columns.length;
          column_index++
        ) {
          const column = columns[column_index];

          data[column] = record[column];
        }
      }
    }

    return DB.insert(app.table, data);
  },
  insertRecords: function (app, data) {
    // for (let index = 0; index < data.length; index++) {
    //   data[index]._id = (Date.now() + index).toString();
    // }

    return DB.bulkInsert(app.table, data);
  },
  settings: function (app, settings) {
    const self = this;
    let current_settings = {};

    return self.get(app.slug).then(function (app) {
      if (typeof app.settings !== "undefined") {
        current_settings = app.settings;
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

          current_settings[key] = element;
        }
      }

      app.settings = current_settings;

      return self.save(app);
    });
  },
  updateRecord: async function (app, data) {
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const datum = data[key];

        for (let index = 0; index < app.columns.length; index++) {
          const column = app.columns[index];

          if (
            key === column.name &&
            column.element === "input" &&
            column.type === "date"
          ) {
            data[key] = Date.parse(datum);
          }
        }
      }
    }

    if (typeof app.related_tables !== "undefined") {
      for (let index = 0; index < app.related_tables.length; index++) {
        const table = app.related_tables[index].table;
        const join_column_1 = app.related_tables[index].join_column_1;
        const columns = app.related_tables[index].columns;

        const record = await DB.get(table, data[join_column_1].toString());

        for (
          let column_index = 0;
          column_index < columns.length;
          column_index++
        ) {
          const column = columns[column_index];

          data[column] = record[column];
        }
      }
    }

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

      for (let row_index = 0; row_index < container.rows.length; row_index++) {
        const row = container.rows[row_index];

        for (let index = 0; index < row.columns.length; index++) {
          const column = row.columns[index];

          fields.push(column);
        }
      }

      return fields;
    }
  }
};
