/* global eCrypt */

import axios from "axios";
import alert from "@/assets/js/builder/alert.js";

const baseURI = import.meta.env.VITE_FETCH_BASE_URL;

export default {
  get: function (slug, is_metadata_included) {
    let endpoint =
      (typeof is_metadata_included !== "undefined" &&
      is_metadata_included == true
        ? "/app/api/v1/builder/apps/"
        : "/app/api/v1/apps/") + slug;

    return axios
      .get(baseURI + endpoint, {
        headers: {
          Accept: "*/*",
          Pragma: "no-cache"
        }
      })
      .then(function (data) {
        data.data.columns = data.data.elements;

        return data.data;
      });
  },
  insertRecord: function (app, data) {
    const send = async function (data) {
      for (const key in data["form"]["properties_attributes"]) {
        if (
          Object.prototype.hasOwnProperty.call(
            data["form"]["properties_attributes"],
            key
          )
        ) {
          for (let index = 0; index < app.columns.length; index++) {
            const column = app.columns[index];

            if (
              typeof column.name !== "undefined" &&
              column.name !== "" &&
              column.name === key
            ) {
              if (
                typeof column["dataot-payment-field"] !== "undefined" &&
                column["dataot-payment-field"] !== ""
              ) {
                delete data["form"]["properties_attributes"][
                  column["dataot-payment-field"]
                ];
              } else if (column.element === "payment-summary") {
                delete data["form"]["properties_attributes"][column["name"]];
              }
            }
          }
        }
      }

      return axios
        .post(baseURI + "/api/customizations", data, {
          headers: {
            Accept: "*/*",
            Pragma: "no-cache",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-CSRF-TOKEN": app.custom_settings["authenticity_token"],
            "X-Requested-With": "XMLHttpRequest"
          }
        })
        .then(function (data) {
          window.location.href = app.custom_settings["redirect"];

          return data.data;
        })
        .catch(function (error) {
          console.log("error.response", error.response);

          if (
            typeof error.response.data !== "undefined" &&
            typeof error.response.data.errors !== "undefined" &&
            typeof error.response.data.errors.base &&
            typeof error.response.data.errors.base[0] !== "undefined"
          ) {
            alert("Error", error.response.data.errors.base[0], "error");
          } else {
            alert("Error", error.response.data, "error");
          }

          return error;
        });
    };

    if (document.querySelector('[name="h-captcha-response"]')) {
      if (document.querySelector('[name="h-captcha-response"]').value === "") {
        alert(
          "Error",
          "Please complete the human verification security check",
          "error"
        );

        return Promise.reject(
          new Error("Please complete the human verification security check")
        );
      }
    }

    const new_data = {};
    const eway_encrypt_key =
      typeof document.querySelector("#app").dataset.encKey === "undefined"
        ? ""
        : document.querySelector("#app").dataset.encKey;

    var amount = 'input[name="payment-summary-amount"]';
    var card_name = "input[name=card_holder]";
    var card_num = "input[name=card_number]";
    var card_cvv = "input[name=card_cvv]";
    var card_exp_mm = "[name=card_exp_mm]";
    var card_exp_yy = "[name=card_exp_yy]";

    new_data["form"] = { properties_attributes: {} };
    new_data["form"]["properties_attributes"]["form_label"] = [];

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];

        new_data["form"]["properties_attributes"][key] = element;

        for (let index = 0; index < app.columns.length; index++) {
          const column = app.columns[index];

          if (
            typeof column.name !== "undefined" &&
            column.name !== "" &&
            column.name === key
          ) {
            new_data["form"]["properties_attributes"]["form_label"].push({
              label: column.label,
              name: key
            });

            if (
              typeof column["dataot-payment-field"] !== "undefined" &&
              column["dataot-payment-field"] !== ""
            ) {
              new_data["form"]["properties_attributes"][
                column["dataot-payment-field"]
              ] = element;
            }
          }
        }
      }
    }

    new_data["form"]["properties_attributes"]["form_label"] = JSON.stringify(
      new_data["form"]["properties_attributes"]["form_label"]
    );

    if (document.querySelector(amount)) {
      var card_num_ = document.querySelector(card_num).value
        ? document.querySelector(card_num).value.replace(/\s/g, "")
        : ""; // cleanup for submission
      var card_cvv_ = document.querySelector(card_cvv).value
        ? document.querySelector(card_cvv).value.replace(/\s/g, "")
        : "";

      console.log("Form submit start");

      new_data["form"]["properties_attributes"]["payment_type"] =
        "Booking Payment";

      new_data["ptype"] = "eway";

      if (document.querySelector('[name="h-captcha-response"]')) {
        new_data["h-captcha-response"] = document.querySelector(
          '[name="h-captcha-response"]'
        ).value;
      }

      new_data["authenticity_token"] =
        app.custom_settings["authenticity_token"];
      new_data["form_id"] = app.custom_settings["form_id"];
      new_data["download_expiry"] = app.custom_settings["download_expiry"];
      new_data["resource_id"] = "new";

      new_data["amount"] = document.querySelector(amount).value;
      new_data["payment_method"] = 248;
      new_data["card_holder"] = document.querySelector(card_name).value;
      new_data["card_exp_mm"] = document.querySelector(card_exp_mm).value;
      new_data["card_exp_yy"] = document.querySelector(card_exp_yy).value;
      new_data["eway_card_number"] = eCrypt.encryptValue(
        card_num_,
        eway_encrypt_key
      );
      new_data["eway_card_cvv"] = eCrypt.encryptValue(
        card_cvv_,
        eway_encrypt_key
      );

      return axios
        .post(baseURI + "/api/ooc-form-payments", new_data, {
          headers: {
            Accept: "*/*",
            Pragma: "no-cache",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        })
        .then(function (response) {
          if (
            typeof response.data.error !== "undefined" &&
            response.data.error
          ) {
            if (Array.isArray(response.data.err_message)) {
              alert(
                "Error",
                response.data.err_message.join(". ") + ".",
                "error"
              );
            } else {
              alert("Error", response.data.err_message + ".", "error");
            }

            return response;
          } else {
            new_data["eway_response"] = JSON.stringify(
              response.data.process_payment
            );

            return send(new_data);
          }
        });
    } else {
      if (document.querySelector('[name="h-captcha-response"]')) {
        new_data["h-captcha-response"] = document.querySelector(
          '[name="h-captcha-response"]'
        ).value;
      }

      new_data["authenticity_token"] =
        app.custom_settings["authenticity_token"];
      new_data["form_id"] = app.custom_settings["form_id"];
      new_data["download_expiry"] = app.custom_settings["download_expiry"];
      new_data["resource_id"] = "new";

      return send(new_data);
    }
  }
};
