<template>
  <div>
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="add"
    >
      <span class="mdi mdi-plus"></span>Add Datasets
    </button>
    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        ref="add-container"
        class="absolute left-0 top-0 flex h-full w-full flex-col bg-white"
      >
        <div class="p-2">
          <repeat-component :value="values" @add="onRepeatComponentAdd">
            <template #default="props">
              <div>
                <button
                  class="mb-1 w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
                  href="javascript:;"
                  @click="isAddDatasetShown[props.index] = true"
                >
                  <span class="mdi mdi-plus"></span>Add Dataset
                </button>
                <input
                  v-model="values[props.index].name"
                  class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-primary--dark"
                  type="text"
                  placeholder="Dataset Name"
                />
                <hr class="border-top mb-1 mt-2 border-gray-300" />
              </div>
              <transition
                name="show-add-transition"
                enter-active-class="animate__animated animate__slideInUp animate__faster"
                leave-active-class="animate__animated animate__slideOutDown animate__faster"
              >
                <div
                  v-if="isAddDatasetShown[props.index]"
                  class="absolute left-0 top-0 flex h-full w-full flex-col bg-white"
                >
                  <collection-selector
                    v-model="values[props.index].value"
                    :configuration="configuration"
                    @cancel="onCollectionSelectorCancel(props.index)"
                    @change-size="onCollectionSelectorChangeSize"
                    @save="onCollectionSelectorSave(props.index)"
                  ></collection-selector>
                </div>
              </transition>
            </template>
          </repeat-component>

          <div class="pt-2 text-center">
            <button
              class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
              @click="onCancelButtonClick"
            >
              <span class="mdi mdi-close"></span> Cancel
            </button>
            <button
              class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
              @click="onSaveButtonClick"
            >
              <span class="mdi mdi-check"></span> Save
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import RepeatComponent from "@/components/Builder/FieldProperty/Element/RepeatComponent.vue";
import CollectionSelector from "@/components/Builder/FieldProperty/Element/CollectionSelector.vue";

export default {
  name: "FieldPropertyValueCollection",
  components: {
    RepeatComponent,
    CollectionSelector
  },
  props: {
    configuration: {
      type: Object,
      default: function () {
        return {
          databaseAdditionalFields: [],
          apiEndpointAdditionalFields: [],
          hideLabel: false
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
    change: null,
    "change-size": null
  },
  data: function () {
    return {
      addContainerHeight: "auto",
      showAdd: false,
      showAddDataset: false,
      isAddDatasetShown: [],
      // value: {},
      values: []
    };
  },
  watch: {
    properties: function () {
      this.closeAddItems();
    },
    values: {
      handler: function (value) {
        this.isAddDatasetShown = [];

        if (Array.isArray(value)) {
          for (let index = 0; index < value.length; index++) {
            this.isAddDatasetShown.push(false);
          }
        } else {
          this.values = [];
          this.isAddDatasetShown.push(false);
        }
      },
      deep: true
    }
  },
  mounted: function () {
    this.values = JSON.parse(
      JSON.stringify(this.properties[this.fieldProperty])
    );
  },
  methods: {
    add: function () {
      const self = this;

      self.showAdd = true;

      this.emitChangeSize();
    },
    closeAddItems: function (index) {
      this.isAddDatasetShown[index] = false;

      this.emitChangeSize();
    },
    emitChangeSize: function (size) {
      this.$nextTick(function () {
        if (typeof size === "undefined") {
          size = {
            height: this.$refs["add-container"].scrollHeight
          };
        }
        this.$emit("change-size", size);
      });
    },
    onCancelButtonClick: function () {
      this.$emit("change-size", { height: "auto" });

      this.showAdd = false;
    },
    onSaveButtonClick: function () {
      this.$emit("change", this.fieldProperty, this.values);
      this.showAdd = false;
      this.emitChangeSize({ height: "auto" });
    },
    onCollectionSelectorCancel: function (index) {
      this.closeAddItems(index);
    },
    onCollectionSelectorChangeSize: function (size) {
      this.$emit("change-size", size);
    },
    onCollectionSelectorSave: function (index) {
      this.closeAddItems(index);
    },
    onRepeatComponentAdd: function () {
      this.$nextTick(function () {
        this.$emit("change-size", {
          height: this.$refs["add-container"].scrollHeight
        });
      });
    }
  }
};
</script>
