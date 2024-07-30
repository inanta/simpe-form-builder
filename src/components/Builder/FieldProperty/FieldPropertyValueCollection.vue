<template>
  <div :style="{ height: addContainerHeight }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="add"
    >
      <span class="mdi mdi-plus"></span>{{ addButtonLabel }}
    </button>
    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        ref="addContainer"
        class="left-0 top-0 flex h-full w-full flex-col bg-white p-2 dark:bg-surface--dark-300"
      >
        <collection-selector
          v-model="value"
          :configuration="configuration"
          @cancel="onCollectionSelectorCancel"
          @save="onCollectionSelectorSave"
        ></collection-selector>
      </div>
    </transition>
  </div>
</template>

<script>
import CollectionSelector from "@/components/Builder/FieldProperty/Element/CollectionSelector.vue";

export default {
  name: "FieldPropertyValueCollection",
  components: {
    CollectionSelector
  },
  props: {
    configuration: {
      type: Object,
      default: function () {
        return {
          addButtonLabel: "Add Items",
          databaseAdditionalFields: [],
          apiEndpointAdditionalFields: [],
          hideLabel: false,
          sources: []
        };
      },
      validator: function (value) {
        if (value.hideLabel === undefined) {
          value.hideLabel = false;
        }

        if (value.databaseAdditionalFields === undefined) {
          value.databaseAdditionalFields = [];
        }

        if (value.apiEndpointAdditionalFields === undefined) {
          value.apiEndpointAdditionalFields = [];
        }

        return value;
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
      value: {}
    };
  },
  computed: {
    addButtonLabel: function () {
      if (typeof this.configuration.addButtonLabel !== "undefined") {
        return this.configuration.addButtonLabel;
      }

      return "Add Items";
    }
  },
  watch: {
    properties: function () {
      this.closeAddItems();
    },
    value: {
      handler: function () {
        this.save();
      },
      deep: true
    }
  },
  mounted: function () {
    this.value = this.properties[this.fieldProperty];
  },
  methods: {
    add: function () {
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
    closeAddItems: function () {
      this.showAdd = false;
      this.addContainerHeight = "auto";
    },
    save: function () {
      this.$emit("change", this.fieldProperty, this.value);
    },
    onCollectionSelectorCancel: function () {
      this.closeAddItems();
    },
    onCollectionSelectorSave: function () {
      this.closeAddItems();
    }
  }
};
</script>
