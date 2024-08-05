<template>
  <slot></slot>
</template>

<script>
export default {
  name: "NsTab",
  props: {
    title: {
      type: String,
      default: "Tab"
    },
    order: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="css"></style>
