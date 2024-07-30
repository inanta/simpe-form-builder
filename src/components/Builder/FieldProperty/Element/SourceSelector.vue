<template>
  <ns-drop-down-list
    v-show="filteredSources.length > 1"
    v-model="source"
    :items="filteredSources"
    class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
  ></ns-drop-down-list>
</template>

<script>
import NsDropDownList from "@/components/NS/NsDropDownList.vue";

export default {
  components: {
    NsDropDownList
  },
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    sources: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    change: null,
    "update:modelValue": null
  },
  data: function () {
    return {
      source: ""
    };
  },
  computed: {
    filteredSources: function () {
      const sources = [
        {
          label: "Static",
          value: "static"
        },
        {
          label: "Static Label Value Pair",
          value: "static-label-value"
        },
        {
          label: "From Database",
          value: "db"
        },
        {
          label: "API Endpoint",
          value: "api"
        }
      ];

      if (Object.keys(this.sources).length === 0) {
        return sources;
      }

      let filtered_sources = [];

      for (let index = 0; index < sources.length; index++) {
        const source = sources[index];

        if (typeof this.sources[source.value] !== "undefined") {
          filtered_sources.push(source);
        }
      }

      return filtered_sources;
    }
  },
  watch: {
    modelValue: {
      handler: function (value) {
        this.source = value;
      },
      immediate: true
    },
    source: function (value) {
      this.$emit("change", value);
      this.$emit("update:modelValue", value);
    }
  },
  mounted: function () {}
};
</script>
