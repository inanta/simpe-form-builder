<template>
  <div>
    <button
      v-if="hasUpdateFeature"
      v-tooltip
      :title="messages.edit"
      @click.stop="$emit('edit', item)"
    >
      <span class="mdi mdi-pencil text-2xl"></span>
    </button>
    <button
      v-if="hasDeleteFeature"
      v-tooltip
      class="ml-2"
      :title="messages.delete"
      @click.stop="$emit('delete', item)"
    >
      <span class="mdi mdi-delete mdi-24px"></span>
    </button>
    <ns-drop-down-button
      v-if="additionalActionButtons.length > 0"
      v-tooltip
      align="right"
      placement="bottom-end"
      :title="messages.more"
    >
      <template #content>
        <span class="mdi mdi-dots-vertical mdi-24px"></span>
      </template>
      <template #caret><span></span></template>
      <ns-drop-down-button-item
        v-for="button in additionalActionButtons"
        :key="button"
      >
        <button
          class="inline-block w-full whitespace-nowrap px-3 py-2 text-left"
          @click="onAdditionalActionButtonClick(button, item)"
        >
          <span v-if="button.icon" :class="button.icon"></span>
          {{ button.label }}
        </button>
      </ns-drop-down-button-item>
    </ns-drop-down-button>
  </div>
</template>

<script>
import NsTooltip from "@/directives/NsTooltip";

import NsDropDownButton from "@/components/NS/NsDropDownButton.vue";
import NsDropDownButtonItem from "@/components/NS/NsDropDownButtonItem.vue";

export default {
  components: {
    NsDropDownButton,
    NsDropDownButtonItem
  },
  directives: { tooltip: NsTooltip },
  props: {
    additionalActionButtons: {
      type: Array,
      default: function () {
        return [];
      }
    },
    delete: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: function () {
        return {};
      }
    },
    messages: {
      type: Object,
      default: function () {
        return {};
      }
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    delete: null,
    edit: null
  },
  data: function () {
    return {
      containers: [],
      isFetching: false,
      isShown: false,
      selectedContainer: 0,
      values: {}
    };
  },
  computed: {
    hasDeleteFeature: function () {
      return this.delete;
    },
    hasUpdateFeature: function () {
      return this.update;
    }
  },
  mounted: function () {},
  methods: {
    onAdditionalActionButtonClick: function (button, item) {
      if (typeof button.function === "function") {
        button.function(item, this);
      }
    }
  }
};
</script>
