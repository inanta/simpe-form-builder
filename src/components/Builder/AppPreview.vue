<template>
  <ns-side-panel :show="isShown" @close="$emit('close')">
    <template #title>
      <div class="flex w-full">
        <div class="py-1.5">Preview</div>
      </div>
    </template>
    <div>
      <form :name="app.slug">
        <template
          v-for="(container, index) in previewContainers"
          :key="container.name"
        >
          <div v-show="index == selectedContainer">
            <div :data-app="app.slug" class="px-5 py-3">
              <div
                v-for="(row, row_index) in container.rows"
                :key="row_index"
                class="flex flex-col md:flex-row md:space-x-2"
              >
                <div
                  v-for="(column, column_index) in row.columns"
                  :key="column_index"
                  class="flex-1 overflow-hidden"
                >
                  <app-field
                    :app="app"
                    :data="values"
                    :properties="column"
                    :show-invalid="showInvalid"
                    @visibility-changed="onVisibilityChanged"
                    @input="onInput"
                    @invalid="onInvalid"
                    @valid="onValid"
                  ></app-field>
                </div>
              </div>
            </div>
          </div>
        </template>
      </form>
    </div>
  </ns-side-panel>
</template>

<script>
import NsSidePanel from "@/components/NS/NsSidePanel.vue";
import AppField from "@/components/Builder/AppField.vue";

import iterateColumns from "@/assets/js/builder/iterateColumns.js";
import onAppInput from "@/assets/js/builder/onAppInput.js";

export default {
  components: {
    NsSidePanel,
    AppField
  },
  props: {
    app: {
      type: Object,
      default: function () {
        return {};
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    containers: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: ["close"],
  data: function () {
    return {
      fieldLogics: {},
      hooks: {},
      isValuesValid: {},
      messages: {},
      selectedContainer: 0,
      showInvalid: false,
      values: {},
      visibilities: {}
    };
  },
  computed: {
    isShown: function () {
      return this.show;
    },
    previewContainers: function () {
      const containers = JSON.parse(JSON.stringify(this.containers));

      iterateColumns(
        containers,
        function (container_index, row_index, column_index, column) {
          if (column.type === "empty") {
            containers[container_index]["rows"][row_index]["columns"].pop();
          }
        }
      );

      return containers;
    }
  },
  methods: {
    onInput: function (name, value, is_initial_value = false) {
      onAppInput(this.app, this.values, name, value);

      if (!is_initial_value) {
        this.isChangesMade = true;
      }

      // callHook(this.hooks, "onInsertPageValueChanged", app);
    },
    onInvalid: function (name) {
      this.isValuesValid[name] = false;
    },
    onValid: function () {},
    onVisibilityChanged: function () {}
  }
};
</script>
