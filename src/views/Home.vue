<template>
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">{{ appName }}</h1>
    <div class="d-none d-sm-inline-block">
      <button class="btn btn-danger shadow-sm" type="button">
        <span class="fa fa-trash"></span> Delete
      </button>
      <router-link
        :to="{ path: '/insert' }"
        class="NS-Hyperlink btn btn-primary shadow-sm"
        ><span class="fa fa-plus"></span> Insert</router-link
      >
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/Theme/HelloWorld.vue";
// import axios from "axios";

export default {
  name: "Home",
  components: {
    // HelloWorld,
  },
  data: function () {
    return {
      appName: "App Name"
    };
  },
  computed: {},
  mounted: function () {},
  methods: {}
};
</script>
