<template>
  <ns-side-panel
    :show="show"
    width="50%"
    title="Hidden Fields"
    @close="$emit('close')"
  >
    <template v-for="(value, index) in internalValues" :key="index">
      <div
        v-if="!internalValues[index]['is_deleted']"
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
    </template>
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
            "!id": "",
            name: "",
            label: "",
            is_deleted: false
          }
        ];
      }
    }
  },
  emits: {
    close: null,
    save: null
  },
  data: function () {
    return {
      internalValues: [this.createEmptyField()]
    };
  },
  computed: {
    availableFieldCount: function () {
      return this.internalValues.filter(function (item) {
        return item.is_deleted === false;
      }).length;
    }
  },
  watch: {
    values: function (value) {
      this.internalValues = value;

      if (this.internalValues.length === 0) {
        this.internalValues.push(this.createEmptyField());
      }
    }
  },
  methods: {
    createEmptyField: function () {
      return {
        "!id": "",
        name: "",
        label: "",
        is_deleted: false
      };
    },
    onAddButtonClick: function () {
      this.internalValues.push(this.createEmptyField());
    },
    onRemoveButtonClick: function (index) {
      if (this.availableFieldCount === 1) {
        if (this.internalValues[index]["!id"] === "") {
          this.internalValues[index] = this.createEmptyField();
        } else {
          this.internalValues[index].is_deleted = true;
        }
      } else {
        this.internalValues[index].is_deleted = true;
      }

      if (this.availableFieldCount === 0) {
        this.internalValues.push(this.createEmptyField());
      }
    },
    onSaveButtonClick: function () {
      this.$emit("save", this.internalValues);
      this.$emit("close");
    }
  }
};
</script>
