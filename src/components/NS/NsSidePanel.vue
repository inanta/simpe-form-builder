<template>
  <div data-component="ns-side-panel">
    <Teleport to="body">
      <Transition
        name="ns-side-panel-overlay"
        enter-active-class="animate__animated animate__fadeIn animate__faster"
        leave-active-class="animate__animated animate__fadeOut animate__faster"
      >
        <div
          v-if="isShown"
          class="fixed left-0 top-0 z-10 h-full w-full overflow-auto bg-black/10 backdrop-blur-sm"
          @click="closePanel"
        ></div>
      </Transition>
      <Transition
        name="ns-side-panel"
        enter-active-class="animate__animated animate__slideInRight animate__faster"
        leave-active-class="animate__animated animate__slideOutRight animate__faster"
      >
        <div
          v-if="isShown"
          class="fixed right-0 top-0 z-20 flex h-full w-full flex-col overflow-auto border border-light-gray bg-white shadow-2xl md:w-3/4 dark:border-surface--dark-400 dark:dark:bg-surface--dark-400"
        >
          <div
            class="sticky top-0 z-10 flex bg-white px-4 py-3 shadow dark:bg-surface--dark-600 dark:text-white"
          >
            <button
              class="rounded bg-negative px-2.5 py-1.5 text-on-negative dark:bg-negative--dark"
              @click="onCloseButtonClick"
            >
              <span class="mdi mdi-close"></span>
            </button>
            <div class="w-full pl-3 text-xl font-bold">
              <template v-if="title !== ''">
                <div class="py-1.5">{{ title }}</div></template
              >
              <slot v-else name="title"></slot>
            </div>
          </div>
          <div>
            <slot></slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "",
      immediate: true
    }
  },
  emits: ["close"],
  data: function () {
    return {
      isShown: false
    };
  },
  watch: {
    show: {
      handler: function (value) {
        if (this.isShown !== value) {
          this.isShown = value;

          if (this.isShown === true) {
            document.body.classList.add("overflow-hidden");
          } else {
            document.body.classList.remove("overflow-hidden");
          }
        }
      },
      immediate: true
    }
  },
  unmounted: function () {
    document.body.classList.remove("overflow-hidden");
  },
  methods: {
    closePanel: function () {
      this.$emit("close");
    },
    onCloseButtonClick: function () {
      this.closePanel();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
