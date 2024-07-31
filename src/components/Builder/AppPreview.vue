<template>
  <transition
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__slideInRight animate__faster"
    leave-active-class="animate__animated animate__slideOutRight animate__faster"
  >
    <div
      v-if="isShown"
      class="absolute left-0 top-0 h-full w-full bg-white dark:bg-surface--dark-300 dark:text-on-surface--dark-300"
    >
      <div
        class="grid grid-cols-2 rounded bg-primary px-4 py-1.5 text-lg text-on-primary"
      >
        <div class=""><b>Preview</b></div>
        <div class="text-right">
          <a href="javascript:;" @click="$emit('close')"
            ><span class="mdi mdi-close"></span
          ></a>
        </div>
      </div>
      <hr class="border-top my-4 border-light-gray" />
      <template v-for="(container, index) in containers" :key="container.name">
        <div v-show="index == selectedContainer" class="flex-shrink flex-grow">
          <div class="px-5 py-3">
            <div
              v-for="(row, row_index) in container.rows"
              :key="row_index"
              :class="'grid-cols-' + (row.columns.length - 1)"
              class="grid gap-2"
            >
              <div
                v-for="(column, column_index) in row.columns"
                :key="column_index"
                class="overflow-hidden"
              >
                <template v-if="column.type != 'empty'">
                  <app-field
                    :app="app"
                    :data="values"
                    :properties="column"
                    :show-invalid="showInvalid"
                    @visibility-changed="onVisibilityChanged"
                    @input="onInput"
                    @invalid="onInvalid"
                    @keyup.enter="saveConfirmation"
                    @valid="onValid"
                  ></app-field>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </transition>
</template>

<script>
import AppField from "@/components/Builder/AppField.vue";
// import FieldPreview from "@/components/Builder/FieldPreview.vue";

export default {
  name: "AppPreview",
  components: {
    // FieldPreview
    AppField
  },
  props: {
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
      selectedContainer: 0
    };
  },
  computed: {
    isShown: function () {
      return this.show;
    },
    previewContainers: function () {
      return this.containers;
    }
  },
  methods: {}
};
</script>
