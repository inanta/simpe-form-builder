<template>
  <ns-side-panel :show="isShown" @close="$emit('close')">
    <template #title>
      <div class="flex w-full">
        <div class="py-1.5">{{ title }}</div>
        <div class="ml-auto text-base font-normal">
          <button
            v-if="update"
            class="rounded bg-primary px-2.5 py-1.5 text-on-primary dark:bg-primary--dark"
            @click="onEditButttonClick"
          >
            <span class="mdi mdi-pencil"></span> {{ messages.edit }}
          </button>
        </div>
      </div>
    </template>
    <div class="dark:text-on-surface--dark-100">
      <template v-for="(container, index) in containers" :key="container.name">
        <div v-show="index == selectedContainer" class="flex-shrink flex-grow">
          <div class="px-5 py-3">
            <div
              v-for="(row, row_index) in container.rows"
              :key="row_index"
              :class="'grid-cols-' + row.columns.length"
              class="grid gap-2"
            >
              <div
                v-for="(column, column_index) in row.columns"
                :key="column_index"
              >
                <app-field
                  :app="app"
                  :data="values"
                  :properties="column"
                  :value="values[column.name]"
                  @input="onInput"
                ></app-field>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </ns-side-panel>
</template>

<script>
import NsSidePanel from "@/components/NS/NsSidePanel.vue";
import AppField from "@/components/Builder/AppField.vue";

import AppBuilder from "@/assets/js/AppBuilder.js";
import onAppInput from "@/assets/js/builder/onAppInput.js";

export default {
  components: {
    NsSidePanel,
    AppField
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    messages: {
      type: Object,
      default: function () {
        return {};
      }
    },
    slug: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: null
  },
  data: function () {
    return {
      containers: [],
      isFetching: false,
      isShown: false,
      selectedContainer: 0,
      values: {}
    };
  },
  watch: {
    id: function () {
      this.render(this.slug, this.id);
    },
    show: function (value) {
      this.isShown = value;

      if (this.isShown === true) {
        this.render(this.slug, this.id);
      }
    }
  },
  mounted: function () {},
  methods: {
    onInput: function (name, value) {
      onAppInput(this.app, this.values, name, value);
    },
    render: function (app_slug, id) {
      const self = this;

      self.values = {};

      if (self.isFetching === false) {
        self.isFetching = true;

        AppBuilder.get(app_slug).then(function (app) {
          self.app = JSON.parse(JSON.stringify(app));
          self.containers.splice(0);

          for (let index = 0; index < app.columns.length; index++) {
            const column = app.columns[index];

            if (typeof self.containers[column.container] === "undefined") {
              self.containers[column.container] = {
                name: app.containers[column.container].name,
                rows: []
              };
            }

            if (
              typeof self.containers[column.container].rows[column.row] ===
              "undefined"
            ) {
              self.containers[column.container].rows[column.row] = {
                columns: []
              };
            }

            column.readonly = true;
            column.disabled = true;

            self.containers[column.container].rows[column.row].columns.push(
              column
            );
          }

          if (
            typeof app.hidden_fields !== "undefined" &&
            Array.isArray(app.hidden_fields)
          ) {
            for (let index = 0; index < app.hidden_fields.length; index++) {
              const field = app.hidden_fields[index];

              self.values[field.name] = field.value;
            }
          }

          AppBuilder.getRecord(app.slug, id).then(function (record) {
            for (const key in record) {
              self.values[key] = record[key];
            }
            app.values = self.values;

            self.isFetching = false;
          });
        });
      }
    },
    onEditButttonClick: function () {
      this.$router.push("/app/edit/" + this.app.slug + "/" + this.id);
    }
  }
};
</script>
