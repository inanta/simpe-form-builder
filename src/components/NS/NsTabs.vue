<template>
  <div>
    <div ref="tab-headers-container" class="relative rounded-t-sm">
      <button
        v-for="(tab, tabIndex) in tabs"
        :key="tabIndex"
        ref="tab-headers"
        :class="{
          'font-bold text-primary dark:text-primary--dark':
            tabIndex == selectedIndex,
          'text-mid-gray': tabIndex != selectedIndex,
          tab__selected: tabIndex == selectedIndex
        }"
        class="inline-block px-3 py-2"
        @click="selectTab(tabIndex)"
      >
        {{ tab.title }}
      </button>
      <span
        ref="tab-indicator"
        class="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out dark:bg-primary--dark"
      ></span>
    </div>
    <template v-for="(tab, tabIndex) in tabs" :key="tabIndex">
      <div v-show="selectedIndex == tabIndex">
        <component :is="tab.element"></component>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {},
  data: function () {
    return {
      selectedIndex: 0,
      tabs: []
    };
  },
  mounted: function () {
    const children = this.$slots.default();

    for (let index = 0; index < children.length; index++) {
      const element = children[index];

      if (
        typeof element.type === "object" &&
        typeof element.type.name !== "undefined" &&
        element.type.name === "NsTab"
      ) {
        this.tabs.push({
          title:
            typeof element.props !== "undefined" &&
            element.props !== null &&
            typeof element.props.title !== "undefined"
              ? element.props.title
              : "Tab " + (index + 1),
          element: element,
          order:
            typeof element.props.order !== "undefined"
              ? element.props.order
              : index
        });
      }

      this.tabs.sort(function (a, b) {
        return a.order - b.order;
      });
    }

    if (this.tabs.length > 0) {
      this.$nextTick(function () {
        this.selectTab(0);
      });
    }
  },
  methods: {
    selectTab(index) {
      this.selectedIndex = index;

      const self = this;

      setTimeout(function () {
        const tab_headers_container = self.$refs["tab-headers-container"];

        if (
          typeof tab_headers_container !== "undefined" &&
          tab_headers_container !== null
        ) {
          const tab_header = self.$refs["tab-headers"][index];
          const indicator = self.$refs["tab-indicator"];

          const rect_container = tab_headers_container.getBoundingClientRect();
          const rect = tab_header.getBoundingClientRect();
          const left = Math.round(rect.left - rect_container.left).toString();

          indicator.style.left = left + "px";
          indicator.style.width = tab_header.offsetWidth + "px";
        }
      }, 50);
    }
  }
};
</script>

<style lang="css"></style>
