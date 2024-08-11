<template>
  <div>
    <div ref="tableHead" class="overflow-x-auto overflow-y-hidden pb-3">
      <table class="w-full border-collapse" data-component="inline-table">
        <thead v-if="headers.length > 0">
          <tr>
            <th
              v-for="(header, i) in headers"
              :key="i"
              :class="{
                'text-center': header.align === 'center',
                'text-right': header.align === 'right'
              }"
              :style="{
                width:
                  typeof header.width === 'undefined' ? false : header.width
              }"
              class="select-none border-t border-mid-gray px-1 pt-2 text-left align-middle"
            >
              <span class="pl-1.5">{{ header.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in tableItems" :key="i">
            <td
              v-for="(header, j) in headers"
              :key="j"
              :class="{
                'text-center': header.align === 'center',
                'text-right': header.align === 'right'
              }"
              class="border-b border-mid-gray px-2 py-1.5"
            >
              <input
                v-if="header.value !== 'action'"
                v-model="tableItems[i][header.value]"
                :disabled="readonly"
                :readonly="readonly"
                type="text"
                class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary"
                @input="onItemInput"
              />
              <div v-else>
                <button
                  title="Edit"
                  type="button"
                  @click="onDeleteItemClick(i)"
                >
                  <span class="mdi mdi-delete mdi-24px"></span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!readonly" class="flex pt-3">
        <button
          class="mx-auto rounded bg-primary px-3 py-2 text-on-primary"
          type="button"
          @click="onAddNewItemButtonClick"
        >
          {{ addItemLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    addItemLabel: {
      type: String,
      default: "Add"
    },
    defaultRowNumber: {
      type: Number,
      default: 0
    },
    headers: {
      type: Array,
      default: function () {
        return [];
      }
    },
    items: {
      type: Object,
      default: function () {
        return {};
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    input: null
  },
  data: function () {
    return {
      tableItems: [],
      values: []
    };
  },
  watch: {
    items: {
      handler: function (value) {
        this.tableItems = [];

        for (let index = 0; index < value.length; index++) {
          const item = value[index];

          this.tableItems.push(item);
        }

        const remaining_rows = this.defaultRowNumber - this.tableItems.length;

        for (let row_index = 0; row_index < remaining_rows; row_index++) {
          const item = {};

          for (let index = 0; index < this.headers.length; index++) {
            const header = this.headers[index];

            item[header.value] = "";
          }

          this.tableItems.push(item);
        }
      },
      immediate: true
    }
  },
  mounted: function () {},
  methods: {
    onAddNewItemButtonClick: function () {
      const item = {};

      for (let index = 0; index < this.headers.length; index++) {
        const header = this.headers[index];

        item[header.value] = "";
      }

      this.tableItems.push(item);
    },
    onDeleteItemClick: function (index) {
      this.tableItems.splice(index, 1);
    },
    onItemInput: function () {
      const filtered_items = [];

      for (
        let item_index = 0;
        item_index < this.tableItems.length;
        item_index++
      ) {
        const item = JSON.parse(JSON.stringify(this.tableItems[item_index]));
        let is_empty = true;

        for (let index = 0; index < this.headers.length; index++) {
          const header = this.headers[index];

          if (item[header.value] !== "") {
            is_empty = false;

            continue;
          }
        }

        if (!is_empty) {
          filtered_items.push(item);
        }
      }

      this.$emit("input", {
        target: {
          name: this.name,
          value: filtered_items
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
