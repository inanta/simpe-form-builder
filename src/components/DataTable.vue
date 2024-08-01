<template>
  <div class="dark:text-on-surface--dark-100">
    <div ref="tableHead" class="overflow-x-auto overflow-y-hidden pb-3">
      <table
        v-if="items.length > 0 || showHeadersOnEmpty"
        class="w-full border-collapse"
        data-component="data-table"
      >
        <thead v-if="filteredHeaders.length > 0">
          <tr>
            <th
              v-for="(header, i) in filteredHeaders"
              :key="i"
              :class="{
                'text-center': header.align === 'center',
                'text-right': header.align === 'right'
              }"
              :style="{
                width:
                  typeof header.width === 'undefined' ? false : header.width
              }"
              class="cursor-pointer select-none border-t border-mid-gray px-1 pt-2 text-left align-middle"
              @click="onHeaderClick(header)"
            >
              <span
                v-if="header.sortable"
                :class="{
                  'rotate-180': header.sortable && header.sort === 'desc',
                  'text-mid-gray': header.sort === ''
                }"
                class="inline-block transition-all hover:text-black"
              >
                <template v-if="header.sort === ''">&#8645;</template>
                <template v-else>&#8595;</template>
              </span>
              <slot :header="header" :name="'header.' + header.value">
                <span class="pl-1.5">{{ header.label }}</span>
              </slot>
              <!-- <span class="float-right">&#9660;</span> -->
            </th>
          </tr>

          <tr class="border-b border-mid-gray">
            <td :colspan="filteredHeaders.length" class="h-1">
              <slot name="loading">
                <Transition
                  name="data-table-progress-bar"
                  enter-active-class="animate__animated animate__fadeIn animate__faster"
                  leave-active-class="animate__animated animate__fadeOut animate__faster"
                >
                  <div v-if="isLoading" c>
                    <ns-progress-bar
                      class="!rounded-none !border-0"
                      height="0.25rem"
                    ></ns-progress-bar>
                  </div>
                </Transition>
              </slot>
            </td>
          </tr>
        </thead>
        <tbody v-if="pagedFilteredItems.length > 0">
          <tr
            v-for="(item, i) in pagedFilteredItems"
            :key="i"
            :class="{
              'hover:bg-primary/10 dark:hover:bg-primary--dark/10': !readOnly,
              'hover:shadow-md': !readOnly
            }"
            class="cursor-pointer"
            @click="$emit('tableRowClick', item)"
          >
            <td
              v-for="(header, j) in filteredHeaders"
              :key="j"
              :class="{
                'text-center': header.align === 'center',
                'text-right': header.align === 'right'
              }"
              class="border-b border-mid-gray px-2 py-1.5"
              @click.self="$emit('tableColumnClick', item)"
            >
              <slot :item="item" :name="'item.' + header.value">
                <template v-if="header.format === 'picture-url'">
                  <img :src="item[header.value]" />
                </template>
                <div
                  v-else-if="header.format === 'html'"
                  :ref="'html-' + i + '-' + j"
                >
                  {{ renderHtml("html-" + i + "-" + j, item[header.value]) }}
                </div>
                <template v-else>
                  {{ formatValue(item[header.value], header.format) }}
                </template>
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td
              :colspan="filteredHeaders.length"
              class="border-b border-mid-gray px-2 py-2 text-center"
            >
              <slot name="no-data">Data not available.</slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center">
        <slot name="no-data">Data not available.</slot>
      </div>
    </div>

    <div class="flex pb-4 pt-1">
      <div v-if="items.length > 0" class="hidden md:block">
        Showing {{ (currentPage - 1) * perPage + 1 }} to
        {{
          serverItemsLength
            ? currentPage * perPage > serverItemsLength
              ? serverItemsLength
              : currentPage * perPage
            : currentPage * perPage > filteredItems.length
            ? filteredItems.length
            : currentPage * perPage
        }}
        of
        {{ serverItemsLength ? serverItemsLength : filteredItems.length }}
      </div>
      <div class="mx-auto md:ml-auto md:mr-0">
        <template v-if="paging.length > 1">
          <template v-for="pagingPage in paging" :key="pagingPage">
            <button
              v-if="pagingPage !== null"
              :class="{
                'bg-primary dark:bg-primary--dark': currentPage != pagingPage,
                'bg-mid-gray dark:bg-disabled--dark dark:text-on-disabled--dark':
                  currentPage == pagingPage
              }"
              :disabled="currentPage == pagingPage"
              class="ml-1 rounded bg-primary px-2 py-1 text-on-primary"
              @click="pageChange(pagingPage)"
            >
              {{ pagingPage }}
            </button>
            <button
              v-else
              class="pointer-events-none ml-1 rounded bg-none px-2 py-1 text-primary dark:text-primary--dark"
              disabled
            >
              ...
            </button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import NsProgressBar from "@/components/NS/NsProgressBar.vue";

export default {
  components: {
    NsProgressBar
  },
  props: {
    headers: {
      type: Array,
      default: function () {
        return [];
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object,
      default: function () {
        return {};
      }
    },
    order: {
      type: String,
      default: ""
    },
    page: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 15
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    sort: {
      type: String,
      default: ""
    },
    search: {
      type: String,
      default: ""
    },
    searchPlaceholder: {
      type: String,
      default: "Search"
    },
    serverItemsLength: {
      type: Number,
      default: undefined
    },
    showHeadersOnEmpty: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    pageChange: null,
    search: null,
    sortingChange: null,
    tableColumnClick: null,
    tableRowClick: null
  },
  data: function () {
    return {
      // cursor: -1,
      filteredHeaders: [],
      internalItems: [],
      currentSortColumn: null,
      currentPage: 1,
      currentPerPage: 15,
      // perPage: 15,
      searchText: "",
      searchTimeoutHandler: null,
      // showList: false,
      tableHeadTopPosition: 0,
      totalPage: 1
    };
  },
  computed: {
    hasItems: function () {
      return !!this.internalItems.length;
    },
    filteredItems: function () {
      const self = this;
      let items = self.internalItems;

      if (this.serverItemsLength) {
        return self.internalItems;
      }

      items = self.internalItems.filter(function (item) {
        let result = false;

        for (let index = 0; index < self.filteredHeaders.length; index++) {
          let header = self.filteredHeaders[index];

          if (
            typeof item[header.value] === "undefined" ||
            item[header.value] == null
          ) {
            item[header.value] = "";
          }

          if (typeof header.searchable !== "undefined" && header.searchable) {
            if (
              item[header.value]
                .toString()
                .toLowerCase()
                .includes(self.searchText.toLowerCase())
            ) {
              result = true;

              break;
            }
          }
        }

        return result;
      });

      if (self.currentSortColumn !== null) {
        items.sort(function (a, b) {
          if (self.currentSortColumn.sort === "asc") {
            return a[self.currentSortColumn.value] >
              b[self.currentSortColumn.value] ===
              true
              ? 1
              : -1;
          } else {
            return a[self.currentSortColumn.value] <
              b[self.currentSortColumn.value] ===
              true
              ? 1
              : -1;
          }
        });
      }

      return items;
    },
    pagedFilteredItems: function () {
      const self = this;

      if (self.serverItemsLength) {
        return self.filteredItems;
      }

      return self.filteredItems.slice(
        (self.currentPage - 1) * self.currentPerPage,
        self.currentPage * self.currentPerPage
      );
    },
    paging: function () {
      const self = this;
      const max_left_right = 3;

      const max_page = self.serverItemsLength
        ? Math.ceil(self.serverItemsLength / self.currentPerPage)
        : Math.ceil(self.filteredItems.length / self.currentPerPage);

      let pages = [];

      let start_page =
        self.currentPage - max_left_right < 1
          ? 1
          : self.currentPage - max_left_right;
      let end_page =
        self.currentPage + max_left_right > max_page
          ? max_page
          : self.currentPage + max_left_right;

      let remaining_page = max_left_right * 2 - (end_page - start_page);

      if (remaining_page > 0 && start_page !== 1) {
        for (let index = 0; index < remaining_page; index++) {
          if (start_page - 1 > 1) {
            start_page -= 1;
          }
        }
      }

      if (remaining_page > 0 && end_page !== max_page) {
        for (let index = 0; index < remaining_page; index++) {
          if (end_page + 1 < max_page) {
            end_page += 1;
          }
        }
      }

      if (start_page !== 1) {
        pages.push(1);

        if (start_page != 2) {
          pages.push(null);
        }
      }

      let index;

      for (index = start_page; index <= end_page; index++) {
        pages.push(index);
      }

      if (end_page !== max_page) {
        if (index != max_page) {
          pages.push(null);
        }

        pages.push(max_page);
      }

      return pages;
    }
  },
  watch: {
    items: {
      handler: function (value) {
        this.setItems(value);
      },
      immediate: true
    },
    headers: {
      handler: function (value) {
        const self = this;

        self.filteredHeaders.splice(0);

        for (let index = 0; index < value.length; index++) {
          const header = JSON.parse(JSON.stringify(value[index]));

          if (
            self.currentSortColumn !== null &&
            header.value === self.currentSortColumn.value
          ) {
            header.sort = self.currentSortColumn.sort;
          }

          if (typeof header.sortable === "undefined") {
            header.sortable = true;
          }

          if (typeof header.searchable === "undefined") {
            header.searchable = true;
          }

          if (
            typeof header.sort === "undefined" ||
            (header.sort !== "asc" && header.sort !== "desc")
          ) {
            header.sort = "";
          }

          if (
            typeof header.visible === "undefined" ||
            (typeof header.visible !== "undefined" && header.visible)
          ) {
            self.filteredHeaders.push(header);
          }
        }
      },
      deep: true,
      immediate: true
    },
    order: {
      handler: function (value) {
        if (value !== "") {
          if (this.currentSortColumn == null) {
            this.currentSortColumn = {};
          }

          this.currentSortColumn.sort = value;
        }
      },
      immediate: true
    },
    page: {
      handler: function (value) {
        this.currentPage = value;
      },
      immediate: false
    },
    perPage: {
      handler: function (value) {
        this.currentPerPage = value;
        this.pageChange(1);
      },
      immediate: false
    },
    search: {
      handler: function (value) {
        this.searchText = value;
      },
      immediate: true
    },
    searchText: {
      handler: function () {
        const self = this;

        let sort = "",
          order = "";

        if (self.searchTimeoutHandler !== null) {
          clearTimeout(self.searchTimeoutHandler);
        }

        if (self.currentSortColumn !== null) {
          sort = self.currentSortColumn.value;
          order = self.currentSortColumn.sort;
        }

        self.currentPage = 1;

        self.searchTimeoutHandler = setTimeout(function () {
          self.$emit(
            "search",
            self.searchText,
            1,
            self.currentPerPage,
            sort,
            order
          );
        }, 500);
      },
      immediate: false
    },
    sort: {
      handler: function (value) {
        if (this.currentSortColumn == null) {
          this.currentSortColumn = {};
        }

        this.currentSortColumn.value = value;
      },
      immediate: true
    }
  },
  mounted: function () {
    const self = this;

    self.tableHeadTopPosition =
      self.$refs.tableHead.getBoundingClientRect().top;
  },
  methods: {
    formatValue: function (value, format) {
      if (format === "number" || format === "currency") {
        value = Number(value);

        if (isNaN(value)) {
          value = 0;
        }
      }

      if (format === "date") {
        if (value === undefined || value === null || value === "") {
          return "-";
        }

        if (typeof value === "string") {
          value = parseInt(value);
        }

        const dt = new Date(value);

        return (
          dt.getDate().toString().padStart(2, "0") +
          "/" +
          (dt.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          dt.getFullYear()
        );
      } else if (format === "date-time") {
        if (value === undefined || value === null) {
          return "-";
        }

        const dt = new Date(value);

        return (
          dt.getDate().toString().padStart(2, "0") +
          "/" +
          (dt.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          dt.getFullYear() +
          " " +
          dt.getHours().toString().padStart(2, "0") +
          ":" +
          dt.getMinutes().toString().padStart(2, "0") +
          ":" +
          dt.getSeconds().toString().padStart(2, "0")
        );
      } else if (format === "number") {
        return Intl.NumberFormat("id-ID").format(value);
      } else if (format === "currency") {
        return Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR"
        }).format(value);
      }

      return value;
    },
    renderHtml: function (ref, html) {
      this.$nextTick(function () {
        this.$refs[ref][0].innerHTML = html;
      });
    },
    setItems: function (items) {
      if (!Array.isArray(this.internalItems)) {
        this.internalItems = [];
      }

      this.internalItems.splice(0);

      for (let index = 0; index < items.length; index++) {
        this.internalItems.push(items[index]);
      }
    },
    onHeaderClick: function (clicked_header) {
      const self = this;

      let sort = "",
        order = "";

      if (clicked_header.sortable) {
        self.currentSortColumn = null;

        for (let index = 0; index < self.filteredHeaders.length; index++) {
          if (self.filteredHeaders[index].value === clicked_header.value) {
            self.filteredHeaders[index].sort =
              self.filteredHeaders[index].sort === "desc"
                ? ""
                : self.filteredHeaders[index].sort === ""
                ? "asc"
                : "desc";

            if (self.filteredHeaders[index].sort !== "") {
              self.currentSortColumn = self.filteredHeaders[index];
            }
          } else {
            self.filteredHeaders[index].sort = "";
          }
        }

        if (self.currentSortColumn !== null) {
          sort = self.currentSortColumn.value;
          order = self.currentSortColumn.sort;
        }

        self.$emit(
          "sortingChange",
          sort,
          order,
          self.currentPage,
          self.currentPerPage,
          this.searchText
        );
      }
    },
    pageChange: function (page) {
      const self = this;

      if (self.$refs.tableHead !== undefined) {
        window.scrollTo({
          top: self.tableHeadTopPosition,
          behavior: "smooth"
        });
      }

      if (self.serverItemsLength !== undefined) {
        self.currentPage = page;

        let sort = "";
        let order = "";

        if (self.currentSortColumn !== null) {
          sort = self.currentSortColumn.value;
          order = self.currentSortColumn.sort;
        }

        self.$emit(
          "pageChange",
          page,
          self.currentPerPage,
          sort,
          order,
          self.searchText
        );
      } else {
        self.currentPage = page;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
