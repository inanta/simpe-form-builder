<template>
  <div>
    <a
      href="#"
      class="block rounded-sm bg-primary px-4 py-2 text-on-primary"
      @click.prevent="onContainerConfigClick"
    >
      <span class="mdi mdi-pencil"></span>
    </a>
  </div>
  <ns-dialog
    :show="containerConfigModal"
    width="30%"
    @close="containerConfigModal = false"
  >
    <template #title> <span class="mdi mdi-cogs"></span> Containers </template>
    <div class="p-2">
      <div
        v-for="(container, index) in containers"
        :key="container.name"
        class="flex"
      >
        <div class="px-1 py-2">Container {{ index + 1 }} Name</div>
        <div class="flex-grow px-1 py-1">
          <input
            :value="containers[index].name"
            type="text"
            class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none"
            @blur="
              $emit('changeContainerName', {
                index: index,
                value: $event.target.value
              })
            "
          />
        </div>
        <div class="px-1 py-1">
          <button
            class="rounded-sm bg-negative px-2 py-1 text-on-negative"
            @click="$emit('removeContainer', index)"
          >
            <span class="mdi mdi-delete"></span>
          </button>
        </div>
      </div>
      <div class="mt-4 border-t border-mid-gray py-4 text-center">
        <button
          class="rounded-sm bg-primary px-2 py-1 text-on-primary"
          @click="
            $emit('addNewContainer', {
              name: 'default',
              rows: [
                {
                  name: 'default',
                  grid: 0,
                  columns: [{ type: 'empty' }],
                  showEmptyColumn: false
                }
              ]
            })
          "
        >
          <span class="mdi mdi-plus"></span> Add New Container
        </button>
      </div>
    </div>
  </ns-dialog>
</template>

<script>
import NsDialog from "@/components/NS/NsDialog.vue";

export default {
  components: {
    NsDialog
  },
  props: {
    containers: {
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
    addNewContainer: null,
    changeContainerName: null,
    removeContainer: null
  },
  data: function () {
    return {
      containerConfigModal: false
    };
  },
  methods: {
    onContainerConfigClick: function () {
      const self = this;

      self.containerConfigModal = true;
    }
  }
};
</script>
