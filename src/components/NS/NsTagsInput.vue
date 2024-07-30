<template>
  <div
    class="ns-tags-item relative inline-block w-full rounded-sm border border-mid-gray px-1 pb-1"
    :class="{ 'pt-1': !hasValues }"
    @click="onClick"
  >
    <div
      v-for="(item, index) in valuesLabel"
      :key="item"
      :class="{
        'animate__animated animate__flash': internalValues[index].focus
      }"
      class="mr-1.5 mt-1 inline-block select-none rounded-sm bg-primary px-2 py-1 text-on-primary"
      @animationend="internalValues[index].focus = false"
    >
      {{ item }}
      <small
        class="ml-1 inline-block h-5 w-5 cursor-pointer rounded-full bg-black/30 p-0 text-center align-text-top"
        @click="onRemoveTagClick(index)"
        >&times;</small
      >
    </div>
    <input
      ref="input"
      v-model="searchText"
      :placeholder="inputPlaceholder"
      :style="{ width: inputWidth }"
      class="border-none py-1 outline-none"
      type="text"
      @blur="onInputBlur"
      @focus="onInputFocus"
      @keydown.delete="onInputDeleteKeyDown"
      @keyup.enter="onInputEnterKeyUp"
    />
  </div>
</template>

<script>
export default {
  name: "NsTagsInput",
  props: {
    description: {
      type: String,
      default: ""
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
    value: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  emits: ["blur", "focus", "change", "input", "itemSelected", "itemClicked"],
  data: function () {
    return {
      inputPlaceholder: "",
      internalValues: [],
      isInputFocused: false,
      searchText: ""
    };
  },
  computed: {
    hasValues: function () {
      return !!this.internalValues.length;
    },
    inputWidth: function () {
      let font_size = 1;
      let font_size_unit = "em";
      let text_length =
        this.searchText.length === 0 ? 1 : this.searchText.length;

      if (typeof this.$refs.input !== "undefined") {
        font_size = this.$refs.input.computedStyleMap().get("font-size").value;
        font_size_unit = this.$refs.input
          .computedStyleMap()
          .get("font-size").unit;
      }

      return text_length * font_size + font_size_unit;
    },
    valuesLabel: function () {
      return this.internalValues.map(function (item) {
        return typeof item === "string" ? item : item.label;
      });
    }
  },
  watch: {
    description: {
      handler: function (value) {
        this.descriptionField = value;
      },
      immediate: true
    },
    placeholder: {
      handler: function (value) {
        this.inputPlaceholder = value;
      },
      immediate: true
    },
    value: {
      handler: function (value) {
        this.internalValues = value;
      },
      immediate: true
    }
  },
  mounted: function () {},
  methods: {
    onClick: function () {
      this.$refs.input.focus();
    },
    onInputBlur: function () {
      this.isInputFocused = false;
    },
    onInputFocus: function () {
      this.isInputFocused = true;
    },
    onInputEnterKeyUp: function () {
      const self = this;

      const added = self.internalValues.filter(function (item) {
        if (item.label === self.searchText) return item;
      });

      if (added.length === 0 && this.searchText !== "") {
        self.internalValues.push({
          label: this.searchText,
          value: this.searchText,
          focus: false
        });

        self.searchText = "";
      } else {
        this.$nextTick(function () {
          added[0].focus = true;
        });
      }
    },
    onInputDeleteKeyDown: function () {
      if (this.searchText === "" && this.internalValues.length > 0) {
        this.internalValues.pop();
      }
    },
    onRemoveTagClick: function (index) {
      this.internalValues.splice(index, 1);
    },
    setItems: function (items) {
      this.internalValues = items || [];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
