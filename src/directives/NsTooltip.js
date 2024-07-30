import { createPopper } from "@popperjs/core";

export default {
  mounted: function (el, binding) {
    let tooltip = document.createElement("div");

    if (typeof binding.arg === "undefined") {
      binding.arg = "bottom";
    }

    tooltip.innerText = el.title;

    el.dataset.title = el.title;
    el.title = "";
    el.tooltipElement = tooltip;

    tooltip.classList.add("bg-surface--dark-100/60");
    tooltip.classList.add("dark:bg-surface--dark-100/60");
    tooltip.classList.add("hidden");
    tooltip.classList.add("px-2");
    tooltip.classList.add("py-1");
    tooltip.classList.add("rounded");
    tooltip.classList.add("shadow");
    tooltip.classList.add("text-white");

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
