import FieldProperties from "@/assets/js/builder/FieldProperties.js";

import fetch from "@/assets/js/ReportBuilderFetch.js";
// import fetch from "@/assets/js/ReportBuilderFetchLocalDB";

export default {
  /* Delete app(s) */
  data: function (table, columns, filter) {
    return fetch.data(table, columns, filter);
  },
  /* Delete app(s) */
  delete: function (apps) {
    return fetch.delete(apps);
  },
  /* Delete app record(s) */
  // deleteRecords: function (app, items) {
  //   return fetch.deleteRecords(app, items);
  // },
  /* Get app table columns list from database */
  getColumns: function (slug) {
    return fetch.getColumns(slug);
  },
  /* Get table list from database */
  getTables: function (current_table) {
    return fetch.getTables(current_table);
  },
  /* Get column list from database table */
  getTableColumns: function (table) {
    return fetch.getTableColumns(table);
  },
  /* Get app by slug */
  get: function (slug, is_included_metadata) {
    return fetch.get(slug, is_included_metadata);
  },
  /* Get all app(s) */
  getAll: function () {
    return fetch.getAll();
  },
  /* Get app record(s) from selected app */
  // getAllRecord: function (app) {
  //   return fetch.getAllRecord(app);
  // },
  // /* Get single record from selected app by id */
  // getRecord: function (slug, id) {
  //   return fetch.getRecord(slug, id);
  // },
  /* Insert new record to app */
  // insertRecord: function (app, data) {
  //   return fetch.insertRecord(app, data);
  // },
  // /* Insert new bulk record to app */
  // insertRecords: function (app, data) {
  //   return fetch.insertRecords(app, data);
  // },
  /* Update existing or insert new app */
  save: function (app) {
    return fetch.save(app);
  },
  /* Update app settings */
  settings: function (app, settings) {
    return fetch.settings(app, settings);
  },
  /* Strip unneeded field properties */
  stripFieldProperties: function (field) {
    let stripped_field = {};

    for (const key in field) {
      if (typeof FieldProperties[field.element][key] !== "undefined") {
        stripped_field[key] = field[key];
      }
    }

    /* Is this needed? Is field automatically has element property? */
    if (typeof stripped_field.element === "undefined") {
      stripped_field.element = field.element;
    }

    if (typeof field.name !== "undefined") {
      stripped_field.name = field.name;
    }

    if (typeof field.field !== "undefined") {
      stripped_field.field = field.field;
    }

    // if (typeof field.db_column_index !== "undefined") {
    //   stripped_field.db_column_index = field.db_column_index;
    // }

    return stripped_field;
  },
  /* Update single record in app */
  updateRecord: function (app, data) {
    return fetch.updateRecord(app, data);
  }
};
