<template>
  <div class="mb-2">
    <ns-drop-down-list
      v-model="selectedPrimaryCollection"
      :items="collections"
      class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary"
      placeholder="Search Collection You Want To Use"
    ></ns-drop-down-list>
  </div>
  <div class="mb-2">
    <ns-drop-down-list
      v-model="selectedPrimaryCollectionID"
      :items="fields"
      class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary"
      placeholder="Search Collection ID Field You Want To Use"
    ></ns-drop-down-list>
  </div>
</template>

<script>
import NsDropDownList from "@/components/NS/NsDropDownList.vue";
// import ApiBuilder from "@/assets/js/ApiBuilder.js";

export default {
  name: "ConfirmationDialog",
  components: {
    NsDropDownList
  },
  props: {},
  emits: [],
  data: function () {
    return {};
  },
  watch: {
    show: {
      handler: function () {},
      immediate: true
    }
  },
  methods: {}
};
</script>
