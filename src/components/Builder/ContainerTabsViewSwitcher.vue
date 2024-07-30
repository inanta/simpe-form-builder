<template>
  <div v-for="(container, index) in containers" :key="container.name">
    <a
      href="#"
      class="mr-2 block rounded-sm bg-primary px-4 py-2 text-on-primary"
      @click.prevent="$emit('activate', index)"
    >
      {{ container.name }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    containers: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  emits: { activate: null }
};
</script>
