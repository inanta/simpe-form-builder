import axios from "axios";
// import qs from "qs";

const baseURI = import.meta.env.VITE_FETCH_BASE_URL;

export default {
  data: function (table, columns, filters, sort, limit) {
    const parameters = {
      columns: columns
    };

    if (typeof filters !== "undefined" && filters !== null) {
      parameters.filters = filters;
    }

    if (typeof sort !== "undefined" && sort !== null) {
      parameters.sort = sort;
    }

    if (typeof limit !== "undefined" && limit !== null) {
      parameters.limit = limit;
    }

    return axios
      .post(baseURI + "/app/api/report/builder/data/" + table, parameters)
      .then(function (data) {
        return data.data;
      });
  },
  delete: async function (reports) {
    let slugs = [];

    for (let index = 0; index < reports.length; index++) {
      const report = reports[index];

      slugs.push(report.slug);
    }
    return axios
      .post(baseURI + "/app/api/report/builder/delete", slugs)
      .then(function (data) {
        return data.data;
      });
  },
  // deleteRecords: async function (app, items) {
  //   for (let index = 0; index < items.length; index++) {
  //     items[index] = items[index][app.pk];
  //   }

  //   return axios
  //     .post(baseURI + "/app/api/report/builder/deleterecords/" + app.slug, {
  //       items
  //     })
  //     .then(function (data) {
  //       return data.data;
  //     });
  // },
  // getColumns: function (slug) {
  //   console.log(slug);
  // },
  getTables: async function (current_table) {
    if (typeof current_table === "undefined") {
      current_table = "";
    }

    return axios
      .get(
        baseURI +
          "/app/api/report/builder/tables" +
          (current_table === "" ? "" : "/" + current_table)
      )
      .then(function (data) {
        return data.data;
      });
  },
  getTableColumns: async function (table) {
    return axios
      .get(baseURI + "/app/api/report/builder/columns/" + table)
      .then(function (data) {
        return data.data;
      });
  },
  get: function (slug, is_included_metadata) {
    return axios
      .get(
        baseURI +
          "/app/api/report/builder/report/" +
          slug +
          (typeof is_included_metadata !== "undefined" &&
          is_included_metadata == true
            ? "?builder=true"
            : "")
      )
      .then(function (data) {
        return data.data;
      });
  },
  getAll: function () {
    return axios
      .get(baseURI + "/app/api/report/builder/reports")
      .then(function (data) {
        return {
          headers: data.data.headers,
          items: data.data.items,
          report_id_column: data.data.report_id_column
        };
      });
  },
  save: function (report) {
    return axios
      .post(baseURI + "/app/api/report/builder/save", {
        report
      })
      .then(function (data) {
        return data.data;
      });
  }
  // getAllRecord(app, parameters = {}) {
  //   const query_string = qs.stringify(parameters);

  //   return axios
  //     .get(
  //       baseURI +
  //         "/app/api/report/builder/records/" +
  //         app +
  //         (query_string === "" ? "" : "?" + query_string)
  //     )
  //     .then(function (data) {
  //       return data.data;
  //     });
  // },
  // getRecord(slug, id) {
  //   return axios
  //     .get(baseURI + "/app/api/report/builder/record/" + slug + "/" + id)
  //     .then(function (data) {
  //       return data.data.record;
  //     });
  // },
  // insertRecord: function (app, data) {
  //   return axios
  //     .post(baseURI + "/app/api/report/builder/saverecord/" + app.slug, data)
  //     .then(function (data) {
  //       return data.data;
  //     });
  // },
  // insertRecords: function (app, data) {
  //   return axios
  //     .post(baseURI + "/app/api/report/builder/saverecords/" + app.slug, data)
  //     .then(function (data) {
  //       return data.data;
  //     });
  // },
  // settings: function (app, settings) {
  //   return axios
  //     .post(baseURI + "/app/api/report/builder/settings/" + app.slug, settings)
  //     .then(function (data) {
  //       return data.data;
  //     });
  // },
  // updateRecord: function (app, data) {
  //   return axios
  //     .post(baseURI + "/app/api/report/builder/updaterecord/" + app.slug, data)
  //     .then(function (data) {
  //       return data.data;
  //     });
  // }
};
