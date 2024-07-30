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
      <template
        v-for="(container, index) in previewContainers"
        :key="container.name"
      >
        <div v-if="index == selectedContainer" class="flex-shrink flex-grow">
          <div class="">
            <div
              v-for="(row, row_index) in container.rows"
              :key="row_index"
              :class="'grid-cols-' + row.grid"
              class="grid gap-0"
            >
              <template
                v-for="(column, column_index) in row.columns"
                :key="column_index"
              >
                <div v-if="column.type != 'empty'">
                  <field-preview :properties="column"></field-preview>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  </transition>
</template>

<script>
import FieldPreview from "@/components/Builder/FieldPreview.vue";

export default {
  name: "AppPreview",
  components: {
    FieldPreview
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
