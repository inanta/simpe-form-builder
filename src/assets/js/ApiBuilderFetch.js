import axios from "axios";

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
  exportApp: function (app) {
    return axios
      .get(baseURI + "/app/api/builder/export/" + app.slug)
      .then(function (data) {
        return data.data;
      });
  },
  getCollections: async function (current_table) {
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
  getCollectionFields: async function (table) {
    return axios
      .get(baseURI + "/app/api/v1/builder/columns/" + table)
      .then(function (data) {
        return data.data;
      });
  },
  get: function (slug) {
    let endpoint = "/app/api/v1/builder/apis/" + slug;

    return axios.get(baseURI + endpoint).then(function (data) {
      return data.data;
    });
  },
  getAll: function () {
    return axios
      .get(baseURI + "/app/api/v1/builder/apis")
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
  }
};
