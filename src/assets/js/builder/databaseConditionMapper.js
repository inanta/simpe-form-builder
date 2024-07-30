export default function (operator) {
  const conditions = {
    "=": "Equals To",
    eq: "Equals To",
    "!=": "Not Equals To",
    neq: "Not Equals To",
    ">": "Greather Than",
    gt: "Greather Than",
    "<": "Less Than",
    lt: "Less Than",
    ">=": "Greather Than Or Equals",
    gte: "Greather Than Or Equals",
    "<=": "Less Than Or Equals",
    lte: "Less Than Or Equals",
    contains: "Contains"
  };

  if (typeof conditions[operator] !== "undefined") {
    return conditions[operator];
  }

  return false;
}
