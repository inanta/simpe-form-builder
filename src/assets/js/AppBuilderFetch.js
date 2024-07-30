import axios from "axios";
import qs from "qs";

const baseURI = import.meta.env.VITE_FETCH_BASE_URL;

export default {
  data: function (parameters) {
    const fetch_parameters = {
      columns: parameters.columns
    };

    if (
      typeof parameters.filters !== "undefined" &&
      parameters.filters !== null
    ) {
      fetch_parameters.filters = parameters.filters;
    }

    if (
      typeof parameters.group_by !== "undefined" &&
      parameters.group_by !== null
    ) {
      fetch_parameters.group_by = parameters.group_by;
    }

    if (typeof parameters.sort !== "undefined" && parameters.sort !== null) {
      fetch_parameters.sort = parameters.sort;
    }

    if (typeof parameters.limit !== "undefined" && parameters.limit !== null) {
      fetch_parameters.limit = parameters.limit;
    }

    return axios
      .post(
        baseURI + "/app/api/builder/data/" + parameters.table,
        fetch_parameters
      )
      .then(function (data) {
        return data.data;
      });
  },
  delete: async function (apps) {
    let slugs = [];

    for (let index = 0; index < apps.length; index++) {
      const app = apps[index];

      slugs.push(app.slug);
    }
    return axios
      .post(baseURI + "/app/api/builder/delete", slugs)
      .then(function (data) {
        return data.data;
      });
  },
  deleteRecords: async function (app, items) {
    for (let index = 0; index < items.length; index++) {
      items[index] = items[index]["!id"];
    }

    return axios
      .delete(baseURI + "/app/api/v1/records/" + app.slug, {
        data: items
      })
      .then(function (data) {
        return data.data;
      });
  },
  exportApp: function (app) {
    return axios
      .get(baseURI + "/app/api/v1/builder/export/" + app.slug)
      .then(function (data) {
        return data.data;
      });
  },
  exportRecords: function (app) {
    document.location.href = baseURI + "/app/api/v1/data/export/" + app.slug;
  },
  getColumns: function (slug) {
    console.log(slug);
  },
  getTables: async function (current_table) {
    if (typeof current_table === "undefined") {
      current_table = "";
    }

    return axios
      .get(
        baseURI +
          "/app/api/v1/builder/tables" +
          (current_table === "" ? "" : "/" + current_table)
      )
      .then(function (data) {
        return data.data;
      });
  },
  getTableColumns: async function (table) {
    if (table.trim() === "")
      return new Promise(function (resolve) {
        resolve([]);
      });

    return axios
      .get(baseURI + "/app/api/v1/builder/columns/" + table)
      .then(function (data) {
        return data.data;
      });
  },
  get: function (slug, is_metadata_included) {
    let endpoint =
      (typeof is_metadata_included !== "undefined" &&
      is_metadata_included == true
        ? "/app/api/v1/builder/apps/"
        : "/app/api/v1/apps/") + slug;

    return axios.get(baseURI + endpoint).then(function (data) {
      return data.data;
    });
  },
  getAll: function () {
    return axios
      .get(baseURI + "/app/api/v1/builder/apps")
      .then(function (data) {
        return {
          headers: data.data.headers,
          items: data.data.items,
          app_id_column: data.data.app_id_column
        };
      });
  },
  save: function (app) {
    return axios
      .post(baseURI + "/app/api/builder/save", {
        app
      })
      .then(function (data) {
        return data.data;
      });
  },
  getAllRecords(app, parameters = {}) {
    const query_string = qs.stringify(parameters);

    return axios
      .get(
        baseURI +
          "/app/api/v1/records/" +
          app +
          (query_string === "" ? "" : "?" + query_string)
      )
      .then(function (data) {
        return data.data;
      });
  },
  getRecord(slug, id, options = {}) {
    const query_string = qs.stringify(options);

    return axios
      .get(
        baseURI +
          "/app/api/v1/records/" +
          slug +
          "/" +
          id +
          (query_string === "" ? "" : "?" + query_string)
      )
      .then(function (data) {
        return data.data.record;
      });
  },
  insertRecord: function (app, data) {
    return axios
      .post(baseURI + "/app/api/v1/records/" + app.slug, data)
      .then(function (data) {
        return data.data;
      });
  },
  insertRecords: function (app, data) {
    return axios
      .post(baseURI + "/app/api/builder/saverecords/" + app.slug, data)
      .then(function (data) {
        return data.data;
      });
  },
  settings: function (app, settings) {
    return axios
      .post(baseURI + "/app/api/v1/apps/settings/" + app.slug, settings)
      .then(function (data) {
        return data.data;
      });
  },
  updateRecord: function (app, data) {
    return axios
      .patch(
        baseURI + "/app/api/v1/records/" + app.slug + "/" + data["!id"],
        data
      )
      .then(function (data) {
        return data.data;
      });
  }
};
