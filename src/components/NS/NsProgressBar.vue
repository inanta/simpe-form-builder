<template>
  <div
    class="relative overflow-hidden rounded-sm border border-primary dark:border-primary--dark"
    :style="{ height: height }"
  >
    <div
      :style="{ height: height, width: progressValue }"
      class="absolute bg-primary transition-all duration-1000 dark:bg-primary--dark"
      :class="{ indeterminate: progress === undefined }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "NsProgressBar",
  props: {
    height: {
      type: String,
      default: "0.75rem"
    },
    progress: {
      type: Number,
      default: undefined
    }
  },
  data: function () {
    return {
      inputPlaceholder: "",
      internalValues: [],
      isInputFocused: false,
      searchText: ""
    };
  },
  computed: {
    progressValue: function () {
      const self = this;

      if (self.progress === undefined) {
        return 0;
      }

      return self.progress * 100 + "%";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.indeterminate {
  animation: indeterminateBar 3s linear infinite;
}

@keyframes indeterminateBar {
  0% {
    left: 0%;
    opacity: 0;
    right: 100%;
    width: 0%;
  }
  10% {
    left: 0%;
    opacity: 1;
    right: 75%;
    width: 50%;
  }
  40% {
    left: 75%;
    opacity: 1;
    right: 0%;
    width: 50%;
  }
  50% {
    left: 100%;
    opacity: 0;
    right: 0%;
    width: 0%;
  }
  60% {
    left: 75%;
    opacity: 1;
    right: 0%;
    width: 50%;
  }
  90% {
    left: 0%;
    opacity: 1;
    right: 75%;
    width: 50%;
  }
  100% {
    left: 0%;
    opacity: 0;
    right: 100%;
    width: 0%;
  }
}
</style>
