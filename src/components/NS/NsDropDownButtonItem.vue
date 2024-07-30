<template>
  <li class="cursor-pointer hover:bg-primary/10">
    <slot>
      <span class="inline-block px-3 py-2">Item</span>
    </slot>
  </li>
</template>

<script>
export default {
  name: "NsDropDownButtonItem"
};
</script>
