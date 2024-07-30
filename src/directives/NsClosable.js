export default {
  mounted: function (el, binding) {
    el.handleOutsideClick = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value(event.target);
      }
    };

    document.addEventListener("click", el.handleOutsideClick);
    document.addEventListener("touchstart", el.handleOutsideClick);
  },
  unmounted: function (el) {
    document.removeEventListener("click", el.handleOutsideClick);
    document.removeEventListener("touchstart", el.handleOutsideClick);
  }
};
