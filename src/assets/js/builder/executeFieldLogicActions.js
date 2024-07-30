export default function (actions, event, visibles) {
  for (let index = 0; index < actions.length; index++) {
    const action = actions[index];

    if (action.event === event) {
      if (action.action === "show-field") {
        visibles[action.field] = true;
      } else if (action.action === "hide-field") {
        visibles[action.field] = false;
      }
    }
  }
}
