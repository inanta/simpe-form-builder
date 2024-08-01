<template>
  <div
    ref="dropdown"
    v-closable="closeChildMenu"
    class="relative inline-block"
    :title="$attrs.title"
  >
    <button v-bind="$attrs" @click="onButtonClick">
      <slot name="content">Button</slot>
      <slot name="arrow">&nbsp;<span class="text-xs">&#x25BC;</span></slot>
    </button>
    <Teleport to="body">
      <div v-show="isMenuShown" ref="items" class="z-10">
        <ul
          class="mt-1 rounded border border-light-gray bg-white shadow"
          @click="onChildMenuClick"
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
  name: "DropDownButton",
  directives: {
    closable: NsClosable
  },
  inheritAttrs: false,
  props: {
    align: {
      type: String,
      default: "left"
    },
    placement: {
      type: String,
      default: "bottom-start"
    }
  },
  emits: {
    // click: null
  },
  data: function () {
    return {
      isMenuShown: false,
      popperInstance: null
    };
  },
  computed: {
    childMargin: function () {
      const style =
        this.$refs.button.currentStyle ||
        window.getComputedStyle(this.$refs.button);

      return {
        "margin-left": style.marginLeft,
        "margin-right": style.marginRight
      };
    },
    hasChild: function () {
      return !!this.$slots.default;
    }
  },
  methods: {
    closeChildMenu: function () {
      const self = this;

      setTimeout(function () {
        self.isMenuShown = false;
      }, 250);
    },
    onButtonClick: function () {
      this.toggleChildMenu();
    },
    onChildMenuClick: function () {
      this.closeChildMenu();
    },
    toggleChildMenu: function () {
      const self = this;

      self.isMenuShown = !self.isMenuShown;

      if (self.isMenuShown) {
        self.$nextTick(function () {
          if (self.popperInstance === null) {
            self.popperInstance = createPopper(
              self.$refs.dropdown,
              self.$refs.items,
              {
                placement: self.placement
              }
            );
          }

          self.popperInstance.update();
        });
      }
    }
  }
};
</script>

<style scoped></style>
