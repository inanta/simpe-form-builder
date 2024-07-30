import fetch from "@/assets/js/ApiBuilderFetch.js";

export default {
  /* Get table data */
  data: function (parameters) {
    return fetch.data(parameters);
  },
  /* Delete app(s) */
  delete: function (apps) {
    return fetch.delete(apps);
  },
  /* Delete app record(s) */
  deleteRecords: function (app, items) {
    return fetch.deleteRecords(app, items);
  },
  /* Export app */
  exportApp: function (slug) {
    return fetch.exportApp(slug);
  },
  /* Export app record(s) */
  exportRecords: function (app) {
    return fetch.exportRecords(app);
  },
  /* Get table list from database */
  getCollections: function (current_table) {
    return fetch.getCollections(current_table);
  },
  /* Get column list from database table */
  getCollectionFields: function (table) {
    return fetch.getCollectionFields(table);
  },
  /* Get app by slug */
  get: function (slug, is_included_metadata) {
    return fetch.get(slug, is_included_metadata);
  },
  /* Get all app(s) */
  getAll: function () {
    return fetch.getAll();
  },
  /* Update existing or insert new app */
  save: function (app) {
    return fetch.save(app);
  }
};
