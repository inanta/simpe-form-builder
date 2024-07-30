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
    }
  }
};
</script>

<style lang="css"></style>
