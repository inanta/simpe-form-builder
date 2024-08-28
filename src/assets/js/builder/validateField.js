export default function validateField(rules, value, data) {
  const validation_rules = {
    required: function (value) {
      if (value !== undefined && value != "" && value !== null) {
        return true;
      }

      return false;
    },
    number: function (value) {
      const regex = new RegExp(/^\d+$/);

      return regex.test(value);
    },
    regex: function (value, rule) {
      if (value !== "" && typeof rule.pattern !== "undefined") {
        const regex = new RegExp(rule.pattern);

        return regex.test(value);
      }

      return true;
    },
    "field-compare": function (value, rule, data) {
      if (
        typeof value !== "undefined" &&
        typeof rule.compare_field !== "undefined" &&
        typeof data !== "undefined" &&
        typeof data[rule.compare_field] !== "undefined" &&
        data[rule.compare_field] != value
      ) {
        return true;
      }

      return false;
    }
  };

  let error_message = "";

  if (Array.isArray(rules)) {
    for (let index = 0; index < rules.length; index++) {
      const validation = rules[index];

      if (typeof validation_rules[validation.type] !== "undefined") {
        if (!validation_rules[validation.type](value, validation, data)) {
          error_message = validation.message;
        }
      }
    }
  }

  return error_message;
}
