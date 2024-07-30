<template>
  <div data-component="ns-dialog">
    <Teleport to="body">
      <span ref="md-breakpoint" class="md:hidden"></span>
      <Transition
        name="show-ns-dialog-overlay"
        enter-active-class="animate__animated animate__fadeIn animate__faster"
        leave-active-class="animate__animated animate__fadeOut animate__faster"
      >
        <div
          v-if="isShown"
          class="fixed left-0 top-0 z-50 h-full w-full overflow-hidden bg-black/10 backdrop-blur-sm dark:bg-white/10"
        ></div>
      </Transition>
      <Transition
        name="show-ns-dialog"
        enter-active-class="animate__animated animate__slideInUp animate__faster"
        leave-active-class="animate__animated animate__slideOutDown animate__faster"
      >
        <div
          v-if="isShown"
          class="fixed left-0 top-0 z-50 h-full w-full overflow-auto p-4"
        >
          <div
            :style="{ width: modalWidth }"
            class="top-[10%] z-20 flex w-max flex-col rounded border border-light-gray bg-white shadow dark:border-none dark:bg-surface--dark-600 dark:text-on-surface--dark-600 md:mx-auto md:my-7"
          >
            <div
              v-if="hasTitle"
              class="rounded bg-primary px-3 py-2 text-lg text-on-primary dark:bg-primary--dark"
            >
              <slot name="title"></slot>
              <button class="float-right pt-1" @click="onCloseButtonClick">
                <span class="mdi mdi-close"></span>
              </button>
            </div>
            <div>
              <slot></slot>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ""
    }
  },
  emits: ["close"],
  data: function () {
    return {
      isShown: false,
      modalSize: "300px",
      modalWidth: "max-content"
    };
  },
  computed: {
    hasTitle: function () {
      return typeof this.$slots.title !== "undefined";
    }
  },
  watch: {
    show: {
      handler: function (value) {
        if (this.isShown !== value) {
          this.isShown = value;

          if (this.isShown === true) {
            document.querySelector("body").classList.add("overflow-hidden");
          } else {
            document.querySelector("body").classList.remove("overflow-hidden");
          }
        }
      },
      immediate: true
    },
    size: {
      handler: function (value) {
        this.modalSize = value;
      },
      immediate: true
    },
    width: {
      handler: function (value) {
        this.modalWidth = value;
      },
      immediate: true
    }
  },
  mounted: function () {
    this.calculateWidth();

    window.addEventListener("resize", this.calculateWidth);
  },
  unmounted: function () {
    // TODO: Add uniquie ID to prevent unwanted element to be removed
    document.body.classList.remove("overflow-hidden");
  },
  methods: {
    calculateWidth: function () {
      if (
        typeof this.$refs["md-breakpoint"] !== "undefined" &&
        this.$refs["md-breakpoint"].offsetParent !== null
      ) {
        this.modalWidth = "100%";
      } else {
        this.modalWidth = this.width;
      }
    },
    onCloseButtonClick: function () {
      this.$emit("close");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
