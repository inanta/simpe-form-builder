<template>
  <ns-side-panel
    :show="show"
    width="50%"
    title="Hidden Fields"
    @close="$emit('close')"
  >
    <div
      v-for="(value, index) in internalValues"
      :key="index"
      class="flex w-full max-w-full space-x-2 px-2 pb-0 pt-2"
    >
      <div class="w-1/3">
        <input
          v-model="internalValues[index]['name']"
          class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary"
          placeholder="Name"
          type="text"
        />
      </div>
      <div class="w-full">
        <input
          v-model="internalValues[index]['value']"
          class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary"
          placeholder="Value"
          type="text"
        />
      </div>
      <div>
        <button
          type="button"
          class="rounded-sm bg-negative px-2.5 py-1.5 text-on-negative dark:bg-negative--dark dark:text-on-negative--dark"
          @click="onRemoveButtonClick(index)"
        >
          <span class="mdi mdi-delete"></span>
        </button>
      </div>
    </div>
    <div class="flex p-2">
      <button
        class="mx-auto h-10 w-10 rounded-full bg-primary p-2 text-on-primary"
        type="button"
        @click="onAddButtonClick"
      >
        <span class="mdi mdi-plus"></span>
      </button>
    </div>
    <div class="p-2">
      <button
        class="mx-auto w-full rounded-sm bg-primary p-2 text-on-primary"
        @click="onSaveButtonClick"
      >
        Save
      </button>
    </div>
  </ns-side-panel>
</template>

<script>
import NsSidePanel from "@/components/NS/NsSidePanel.vue";

export default {
  components: { NsSidePanel },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    values: {
      type: Array,
      default: function () {
        return [
          {
            name: "",
            value: ""
          }
        ];
      }
    }
  },
  emits: {
    close: null,
    save: null
  },
  data() {
    return {
      internalValues: [
        {
          name: "",
          value: ""
        }
      ]
    };
  },
  computed: {},
  watch: {
    values: function (value) {
      this.internalValues = value;

      if (this.internalValues.length === 0) {
        this.internalValues.push({
          name: "",
          label: "",
          source: "built-in",
          value: "current-timestamp",
          on_insert: "0",
          on_update: "0",
          on_view: "0",
          is_visible: "0",
          header_align: "left",
          header_format: "general"
        });
      }
    }
  },
  mounted: function () {},
  methods: {
    onAddButtonClick: function () {
      this.internalValues.push({
        name: "",
        value: ""
      });
    },
    onRemoveButtonClick: function (index) {
      this.internalValues.splice(index, 1);
    },
    onSaveButtonClick: function () {
      this.$emit("save", this.internalValues);
      this.$emit("close");
    }
  }
};
</script>
