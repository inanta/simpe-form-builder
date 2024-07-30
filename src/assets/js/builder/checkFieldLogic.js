export default function (operator, conditions, values) {
  let result = false;

  for (let index = 0; index < conditions.length; index++) {
    const condition = conditions[index];

    if (condition.operator === "eq") {
      if (values[condition.field] === condition.value) {
        result = true;
      } else {
        result = false;
      }
    } else if (condition.operator === "neq") {
      if (values[condition.field] !== condition.value) {
        result = true;
      } else {
        result = false;
      }
    } else if (condition.operator === "lt" || condition.operator === "gt") {
      const field_value = parseInt(values[condition.field]);
      const condition_value = parseInt(condition.value);

      if (
        !isNaN(field_value) &&
        !isNaN(condition_value) &&
        ((condition.operator === "gt" && field_value > condition_value) ||
          (condition.operator === "lt" && field_value < condition_value))
      ) {
        result = true;
      } else {
        result = false;
      }
    }

    if (result === true && operator === "or") {
      return true;
    } else if (result === false && operator === "and") {
      return false;
    }
  }

  return result;
}
