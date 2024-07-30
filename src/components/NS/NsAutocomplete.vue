<template>
  <div class="ns-autocomplete relative inline-block">
    <input
      v-bind="$attrs"
      ref="input"
      v-model="searchText"
      :placeholder="placeholder"
      class="rounded-sm border border-mid-gray px-3 py-1.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:text-on-surface--dark-500 dark:focus:border-surface--dark-600"
      type="search"
      @blur="onBlur"
      @focus="onFocus"
      @input="inputChange"
      @keydown.down="onKeyDown"
      @keydown.tab="onKeyEnter"
      @keydown.up="onKeyUp"
      @keyup.enter="onKeyEnter"
      @keyup="$emit('keyup', $event)"
    />
    <slot name="loading">
      <div v-if="loading" class="v-autocomplete-loading"></div>
    </slot>
    <div
      v-if="show"
      ref="items"
      class="ns-autocomplete-list max-h-40 overflow-scroll rounded bg-white shadow dark:border-surface--dark-600 dark:bg-surface--dark-600 dark:text-on-surface--dark-600"
      @mouseleave="cursor = -1"
    >
      <div
        v-for="(item, i) in filteredItems"
        :key="i"
        :class="{
          'ns-autocomplete-item-active bg-primary text-on-primary dark:bg-primary--dark':
            i === cursor
        }"
        class="ns-autocomplete-list-item cursor-pointer rounded-sm px-3 py-1.5"
        @click="onClickItem(item)"
        @mouseover="cursor = i"
      >
        <slot :item="item" name="item">
          <div>
            <div class="text-md">{{ item[labelField] }}</div>
            <div class="text-md">
              <small>{{ item[descriptionField] }}</small>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";

export default {
  name: "NsAutocomplete",
  props: {
    description: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      default: function () {
        return [];
      }
    },
    label: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: [
    "blur",
    "focus",
    "change",
    "input",
    "itemSelected",
    "itemClicked",
    "keyup",
    "updateItems"
  ],
  data: function () {
    return {
      cursor: -1,
      descriptionField: "description",
      internalItems: this.items || [],
      labelField: "label",
      popperInstance: null,
      searchText: "",
      showList: false
    };
  },
  computed: {
    filteredItems: function () {
      const self = this;
      let items = [];

      items = self.internalItems.filter(function (item) {
        let result = false;

        if (typeof item[self.labelField] === "undefined") {
          result = true;
        } else if (
          typeof item[self.labelField] !== "undefined" &&
          item[self.labelField]
            .toLowerCase()
            .includes(self.searchText.toLowerCase())
        ) {
          result = true;
        }

        return result;
      });

      return items;
    },
    hasItems: function () {
      return !!this.internalItems.length;
    },
    show: function () {
      return this.showList && this.hasItems;
    }
  },
  watch: {
    description: {
      handler: function (value) {
        if (typeof value !== "undefined" && value !== "") {
          this.descriptionField = value;
        } else {
          this.descriptionField = "description";
        }
      },
      immediate: true
    },
    items: {
      handler: function (value) {
        this.setItems(value);
      },
      immediate: true
    },
    label: {
      handler: function (value) {
        if (typeof value !== "undefined" && value !== "") {
          this.labelField = value;
        } else {
          this.labelField = "label";
        }
      },
      immediate: true
    },
    value: {
      handler: function (value) {
        this.onSelectItem(value);
      },
      immediate: true
    }
  },
  mounted: function () {},
  methods: {
    focus: function () {
      this.$refs.input.focus();
    },
    inputChange: function () {
      this.showList = true;
      this.cursor = -1;

      this.onSelectItem(null, "inputChange");
      this.$emit("change", this.searchText);
    },
    onBlur: function () {
      let self = this;

      setTimeout(function () {
        self.showList = false;
      }, 200);

      this.$emit("blur", this.searchText);
    },
    onClickItem: function (item) {
      this.onSelectItem(item);
      this.$emit("itemClicked", item);
      this.showList = false;
    },
    onFocus: function () {
      const self = this;

      this.showList = true;

      self.$nextTick(function () {
        self.$refs.items.style.width = self.$refs.input.offsetWidth + "px";

        self.popperInstance = createPopper(self.$refs.input, self.$refs.items, {
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
        });

        self.popperInstance.update();
      });

      this.$emit("focus", this.searchText);
    },
    onSelectItem: function (item) {
      if (item && typeof item[this.labelField] !== "undefined") {
        this.searchText = item[this.labelField];
        this.$emit("itemSelected", item);
        this.$emit("input", item);
      }
    },
    onKeyDown: function () {
      if (this.cursor < this.internalItems.length - 1) {
        this.cursor++;
      }
    },
    onKeyEnter: function () {
      if (this.internalItems.length === 1) {
        this.cursor = 0;
      }

      if (this.showList && this.internalItems[this.cursor]) {
        this.onSelectItem(this.internalItems[this.cursor]);
        this.showList = false;
      }
    },
    onKeyUp: function () {
      if (this.cursor > 0) {
        this.cursor--;
      }
    },
    setItems: function (items) {
      this.internalItems = items || [];
    },
    updateItems: function () {
      this.$emit("updateItems", this.searchText);
    }
  }
};
</script>

<style scoped lang="scss"></style>
