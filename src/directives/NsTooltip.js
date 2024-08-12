import { createPopper } from "@popperjs/core";

export default {
  mounted: function (el, binding) {
    function addClasses(element, classes) {
      for (let index = 0; index < classes.length; index++) {
        element.classList.add(classes[index]);
      }
    }

    let tooltip = document.createElement("div");

    if (typeof binding.arg === "undefined") {
      binding.arg = "bottom";
    }

    tooltip.innerText = el.title;

    el.dataset.title = el.title;
    el.title = "";
    el.tooltipElement = tooltip;

    addClasses(tooltip, [
      "bg-surface--dark-100/70",
      "dark:bg-surface--dark-100/70",
      "hidden",
      "px-2",
      "py-1",
      "rounded",
      "shadow",
      "text-white",
      "z-10"
    ]);

    document.body.appendChild(tooltip);

    let popperInstance = createPopper(el, tooltip, {
      placement: binding.arg,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 5]
          }
        }
      ]
    });

    el.addEventListener("mouseover", function () {
      tooltip.classList.remove("hidden");
      tooltip.classList.add("inline-block");

      popperInstance.update();
    });

    el.addEventListener("mouseout", function () {
      tooltip.classList.remove("inline-block");
      tooltip.classList.add("hidden");
    });
  },
  unmounted: function (el) {
    document.body.removeChild(el.tooltipElement);
  }
};
