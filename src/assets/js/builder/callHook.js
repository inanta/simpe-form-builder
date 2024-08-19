export default function callHook(hooks, name, app) {
  let result = undefined;

  if (typeof hooks[name][app.slug] === "function") {
    result = hooks[name][app.slug](app);
  }

  try {
    if (
      typeof window.$$App !== "undefined" &&
      window.$$App.getHookByName !== "undefined"
    ) {
      let hook = window.$$App.getHookByName(name, app.slug);

      if (typeof hook === "function") {
        result = hook(app);
      }
    }
  } catch (error) {
    console.warn(error);
  }

  return result;
}
