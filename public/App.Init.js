(function () {
  const $App = { Hooks: {} };

  function getHookByName(name, slug) {
    if (
      typeof $App.Hooks[name] !== "undefined" &&
      typeof $App.Hooks[name][slug]
    ) {
      return $App.Hooks[name][slug];
    }

    return false;
  }

  function getHooks() {
    return $App.Hooks;
  }

  function setHooks($Hooks) {
    $App.Hooks = $Hooks;
  }

  function setInstance($Instance) {
    $App.Instance = $Instance;
  }

  function getInstance() {
    return $App.Instance;
  }

  window.$$App = {
    getHookByName: getHookByName,
    getHooks: getHooks,
    setHooks: setHooks,
    getInstance: getInstance,
    setInstance: setInstance
  };
})();
