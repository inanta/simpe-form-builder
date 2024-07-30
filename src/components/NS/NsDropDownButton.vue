<template>
  <button
    v-bind="$attrs"
    ref="dropdown"
    v-closable="closeChildMenu"
    @click="onDropdownClick"
  >
    <slot name="content">Button</slot>
    &nbsp;
    <slot name="caret"><span class="text-xs">&#x25BC;</span></slot>
  </button>
  <Teleport to="body">
    <div v-if="isMenuShown" ref="items" class="z-10">
      <ul
        class="list-none rounded border border-light-gray bg-white shadow dark:border-surface--dark-600 dark:bg-surface--dark-600 dark:text-white"
      >
        <slot></slot>
      </ul>
    </div>
  </Teleport>
</template>

<script>
import NsClosable from "@/directives/NsClosable.js";
import { createPopper } from "@popperjs/core";

export default {
  name: "NsDropDownButton",
  directives: {
    closable: NsClosable
  },
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
        this.$nextTick(function () {
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

          self.popperInstance.update();
        });
      } else {
        if (self.popperInstance !== null) {
          self.popperInstance.destroy();
        }
      }

      self.$emit(self.isMenuShown ? "open" : "close");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
