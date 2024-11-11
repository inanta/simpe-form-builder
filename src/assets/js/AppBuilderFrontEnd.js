import fetch from "@/assets/js/AppBuilderFetchFrontEnd.js";

export default {
  /* Get app by slug */
  get: function (slug, is_included_metadata) {
    return fetch.get(slug, is_included_metadata);
  },
  /* Insert new record to app */
  insertRecord: function (app, data) {
    return fetch.insertRecord(app, data);
  }
};
