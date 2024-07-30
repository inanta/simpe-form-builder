import { defineStore } from "pinia";

export const useBuilderStore = defineStore("builder", {
  state: function () {
    return { importAppData: {} };
  }
});
