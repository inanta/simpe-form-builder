<template>
  <div :style="{ height: addContainerHeight }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="onAddButtonClick"
    >
      <span class="mdi mdi-plus"></span>{{ configuration.addButtonLabel }}
    </button>
    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        ref="addContainer"
        class="left-0 top-0 flex h-full w-full flex-col bg-white p-2"
      >
        <repeat-input
          v-model="value"
          :columns="configuration.columns"
          :display="configuration.display"
        ></repeat-input>
        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="onCancelButtonClick"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary"
            @click="onSaveButtonClick"
          >
            <span class="mdi mdi-check"></span> Save
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import RepeatInput from "./Element/RepeatInput.vue";

export default {
  name: "FieldPropertyValueCollection",
  components: {
    RepeatInput
  },
  props: {
    configuration: {
      type: Object,
      default: function () {
        return {
          addButtonLabel: "Add Items",
          columns: [
            {
              name: "label",
              placeholder: "Label"
            },
            {
              name: "value",
              placeholder: "Value"
            }
          ],
          display: "column"
        };
      }
    },
    fieldProperty: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    change: null
  },
  data: function () {
    return {
      addContainerHeight: "auto",
      showAdd: false,
      value: [{}]
    };
  },
  watch: {
    properties: function () {
      this.closeAddItems();
    }
  },
  mounted: function () {
    if (typeof this.properties[this.fieldProperty] !== "undefined") {
      this.value = this.properties[this.fieldProperty];
    }
  },
  methods: {
    onAddButtonClick: function () {
      const self = this;

      self.showAdd = true;

      self.$nextTick(function () {
        self.addContainerHeight = "auto";
        self.$refs.addContainer.classList.remove("absolute");

        this.$nextTick(function () {
          self.addContainerHeight = self.$refs.addContainer.offsetHeight + "px";
          self.$refs.addContainer.classList.add("absolute");
        });
      });
    },
    onCancelButtonClick: function () {
      this.showAdd = false;
      this.addContainerHeight = "auto";
    },
    onSaveButtonClick: function () {
      this.showAdd = false;
      this.addContainerHeight = "auto";

      this.$emit("change", this.fieldProperty, this.value);
    }
  }
};
</script>
