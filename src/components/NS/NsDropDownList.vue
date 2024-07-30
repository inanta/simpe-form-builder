<template>
  <div>
    <input
      v-bind="$attrs"
      ref="dropdown"
      v-model="searchText"
      :class="$attrs.class"
      :disabled="readonly"
      :placeholder="placeholder"
      :readonly="readonly"
      type="text"
      @blur="onDropDownInputBlur"
      @focus="onDropDownInputFocus"
      @keyup.up="onKeyUpKeyUp"
      @keyup.down="onKeyUpKeyDown"
    />
    <teleport to="body">
      <ul
        v-if="isShown"
        ref="items"
        class="z-30 max-h-40 overflow-scroll rounded border border-mid-gray bg-white text-black shadow dark:border-surface--dark-600 dark:bg-surface--dark-600 dark:text-on-surface--dark-600"
      >
        <li
          v-for="(item, index) in filteredItems"
          :key="item.value"
          :class="{
            'bg-primary text-on-primary dark:bg-primary--dark dark:text-on-primary--dark':
              index === hoveredItemIndex
          }"
          class="cursor-pointer py-1 px-2"
          @mouseover="onDropDownItemMouseOver(index)"
          @click="onDropDownItemClick(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </teleport>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";

export default {
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      default: function () {
        return [];
      }
    },
    modelValue: {
      type: String,
      default: ""
    },
    selected: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ["change", "update:modelValue"],
  data: function () {
    return {
      hoveredItemIndex: -1,
      isShown: false,
      popperInstance: null,
      searchText: "",
      value: ""
    };
  },
  computed: {
    allItems: function () {
      let items = JSON.parse(JSON.stringify(this.items));

      if (!Array.isArray(items)) {
        items = [];
      }

      for (let index = 0; index < items.length; index++) {
        const item = items[index];

        if (typeof item === "string") {
          items[index] = {
            label: item,
            value: item
          };
        }
      }

      return items;
    },
    filteredItems: function () {
      const self = this;

      return this.allItems.filter(function (item) {
        if (typeof item.label === "undefined") {
          return false;
        }

        return item.label.toLowerCase().includes(self.searchText.toLowerCase());
      });
    }
  },
  watch: {
    modelValue: {
      handler: function (value) {
        if (value !== "") {
          this.value = value;
          this.setSelected(value);
        } else {
          this.clearSelected();
        }
      },
      immediate: true
    },
    items: {
      handler: function (value) {
        const self = this;

        if (value.length > 0) {
          let selected_value = [];

          if (self.value !== "") {
            selected_value = value.filter(function (item) {
              return item.value == self.value;
            });
          }

          if (selected_value.length > 0) {
            self.setSelected(self.value);
          } else {
            if (typeof value[0].value !== "undefined") {
              self.setSelected(value[0].value);
            }
          }
        } else {
          self.clearSelected();
        }
      },
      immediate: true
    },
    selected: {
      handler: function (value) {
        if (value !== "") {
          this.value = value;
          this.setSelected(value);
        }
      },
      immediate: true
    }
  },
  methods: {
    clearSelected: function () {
      if (this.searchText != "") {
        this.searchText = "";

        this.$emit("change", "");
        this.$emit("update:modelValue", "");
      }
    },
    onDropDownInputBlur: function () {
      const self = this;

      setTimeout(function () {
        if (self.isShown == true) {
          self.setSelected(self.value);
        }
      }, 250);
    },
    onDropDownInputFocus: function () {
      const self = this;

      if (!self.readonly) {
        self.searchText = "";
        self.isShown = true;

        self.$nextTick(function () {
          self.$refs.items.style.width = self.$refs.dropdown.offsetWidth + "px";

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
                },
                {
                  name: "flip",
                  options: {
                    fallbackPlacements: ["top"]
                  }
                }
              ]
            }
          );

          self.popperInstance.update();
        });
      }
    },
    onDropDownItemClick: function (item) {
      this.setSelected(item.value);
    },
    onDropDownItemMouseOver: function (index) {
      this.hoveredItemIndex = index;
    },
    onKeyUpKeyDown: function () {
      if (this.hoveredItemIndex + 1 > this.hoveredItemIndex.length) {
        this.hoveredItemIndex = this.hoveredItemIndex.length;
      } else {
        this.hoveredItemIndex += 1;
      }
    },
    onKeyUpKeyUp: function () {
      if (this.hoveredItemIndex - 1 < 0) {
        this.hoveredItemIndex = 0;
      } else {
        this.hoveredItemIndex -= 1;
      }
    },
    setSelected: function (value) {
      let items = [];

      this.isShown = false;
      this.hoveredItemIndex = -1;

      if (this.popperInstance !== null) {
        this.popperInstance.destroy();
      }

      items = this.allItems.filter(function (item) {
        return item.value == value;
      });

      if (items.length > 0) {
        const item = items[0];

        this.searchText = item.label;

        if (item.value !== this.value) {
          this.value = item.value;

          this.$emit("change", item.value);
          this.$emit("update:modelValue", item.value);
        }
      }
    }
  }
};
</script>

<style scoped></style>
