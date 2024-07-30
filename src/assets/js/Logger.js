import DB from "@/assets/js/DB.js";

const verbose = true;

DB.sync("logs");

export default {
  log: function (message, type) {
    const date = new Date();

    if (typeof type === "undefined") {
      type = "default";
    }

    const log_message = {
      _id: date.toISOString(),
      type: type,
      message: message
    };

    if (verbose) {
      console.log(log_message.message, log_message.type);
    }

    DB.insert("logs", log_message);
  },
  getAll: function () {
    return DB.getAll("logs");
  }
};
