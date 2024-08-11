<template>
  <ns-side-panel :show="show" width="50%" @close="$emit('close')">
    <template #title>
      <div class="flex w-full">
        <div class="py-1.5">
          <span class="mdi mdi-cog"></span> Table Settings
        </div>
        <div class="ml-auto text-base font-normal">
          <button
            class="rounded bg-primary px-3 py-2 text-on-primary"
            @click="onSaveButttonClick"
          >
            <span class="mdi mdi-content-save"></span> Save
          </button>
        </div>
      </div>
    </template>
    <div class="p-3 dark:text-on-surface--dark-600">
      <div class="flex flex-col pb-3 pt-2">
        <div class="table">
          <div class="table-row font-bold">
            <div class="table-cell p-0.5">Column</div>
            <div class="table-cell p-0.5">Visibility</div>
            <div class="table-cell p-0.5">Alignment</div>
            <div class="table-cell p-0.5">Type</div>
          </div>
          <template v-for="header in filteredHeaders" :key="header.value">
            <div class="table-row">
              <div class="table-cell p-0.5">
                {{ header.label !== "" ? header.label : header.value }}
              </div>
              <div class="table-cell p-0.5">
                <ns-toggle
                  v-model="header.visible"
                  checked-label="Show"
                  unchecked-label="Hide"
                ></ns-toggle>
              </div>
              <div class="table-cell p-0.5">
                <select
                  v-model="header.align"
                  class="w-full appearance-none rounded-sm border px-1.5 py-1 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div class="table-cell p-0.5">
                <select
                  v-model="header.format"
                  class="w-full appearance-none rounded-sm border px-1.5 py-1 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
                >
                  <option value="currency">Currency</option>
                  <option value="date">Date</option>
                  <option value="date-time">Date Time</option>
                  <option value="general">General</option>
                  <option value="number">Number</option>
                  <option value="picture-url">Picture URL</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </ns-side-panel>
</template>

<script>
import NsSidePanel from "@/components/NS/NsSidePanel.vue";
import NsToggle from "@/components/NS/NsToggle.vue";

import NsTooltip from "@/directives/NsTooltip";

export default {
  name: "Field",
  components: {
    NsSidePanel,
    NsToggle
  },
  directives: { tooltip: NsTooltip },
  props: {
    headers: {
      type: Array,
      default: function () {
        return [];
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: null,
    save: null
  },
  data: function () {
    return {};
  },
  computed: {
    filteredHeaders: function () {
      return this.headers.filter(function (item) {
        if (
          (typeof item.hideable !== "undefined" && item.hideable == false) ||
          item.value[0] === "!"
        ) {
          return false;
        }

        return true;
      });
    }
  },
  methods: {
    onSaveButttonClick: function () {
      this.$emit("save");
    }
  }
};
</script>
