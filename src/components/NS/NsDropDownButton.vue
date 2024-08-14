<template>
  <div class="inline-block">
    <button
      ref="dropdown"
      v-closable="closeChildMenu"
      v-bind="$attrs"
      @click="onDropdownClick"
    >
      <slot name="content">Button</slot>
      <slot name="caret">&nbsp;<span class="text-xs">&#x25BC;</span></slot>
    </button>
    <Teleport to="body">
      <div v-if="isMenuShown" ref="items" class="z-10">
        <ul
          class="mt-1 list-none rounded border border-light-gray bg-white shadow dark:border-surface--dark-600 dark:bg-surface--dark-600 dark:text-white"
        >
          <slot></slot>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import NsClosable from "@/directives/NsClosable.js";

export default {
  name: "NsDropDownButton",
  directives: {
    closable: NsClosable
  },
  inheritAttrs: false,
  props: {
    placement: {
      type: String,
      default: "bottom-start"
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close", "open"],
  data: function () {
    return {
      isMenuShown: false,
      popperInstance: null
    };
  },
  computed: {
    hasChild: function () {
      return !!this.$slots.default;
    }
  },
  watch: {
    show: function (value) {
      if (typeof value === "string") {
        if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        }
      }

      if (typeof value === "boolean") {
        this.toggleChildMenu(value);
      }
    }
  },
  mounted: function () {},
  methods: {
    closeChildMenu: function () {
      this.toggleChildMenu(false);
    },
    onDropdownClick: function () {
      this.toggleChildMenu();
    },
    toggleChildMenu: function (is_shown) {
      const self = this;

      if (typeof is_shown === "undefined") {
        self.isMenuShown = !self.isMenuShown;
      } else {
        self.isMenuShown = is_shown;
      }

      if (self.isMenuShown) {
        self.$nextTick(function () {
          if (self.popperInstance === null) {
            self.popperInstance = createPopper(
              self.$refs.dropdown,
              self.$refs.items,
              {
                placement: self.placement,
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, 5]
                    }
                  }
                ]
              }
            );
          }

          self.popperInstance.update();
        });
      } else {
        if (self.popperInstance !== null) {
          self.popperInstance.destroy();
          self.popperInstance = null;
        }
      }

      self.$emit(self.isMenuShown ? "open" : "close");
    }
  }
};
</script>
