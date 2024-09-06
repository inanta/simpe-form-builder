<template>
  <ns-side-panel :show="show" @close="onSidePanelClose">
    <template #title>
      <div class="flex w-full">
        <div class="py-1.5">{{ title }}</div>
        <div class="ml-auto text-base font-normal">
          <button
            :class="{
              'bg-primary dark:bg-primary--dark': !disableSaveButton,
              'bg-disabled text-on-disabled dark:bg-disabled--dark dark:text-on-disabled--dark':
                disableSaveButton
            }"
            :disable="disableSaveButton"
            class="ml-2 rounded px-3 py-2 text-on-primary"
            @click="onSaveButtonClick"
          >
            <span class="mdi mdi-content-save"></span> {{ messages.save }}
          </button>
        </div>
      </div>
    </template>
    <div v-if="app.container_type === 'Tabs'" class="px-5 pt-3">
      <button
        v-for="(container, index) in containers"
        :key="container.name"
        :class="{
          'border-primary dark:border-primary--dark':
            selectedContainer === index,
          'border-light-gray': selectedContainer !== index
        }"
        class="border-b-4 px-3 py-2 text-primary transition-all dark:text-primary--dark"
        @click="selectedContainer = index"
      >
        {{ container.name }}
      </button>
    </div>
    <div v-if="isLoading" class="py-12">
      <img
        src="@/assets/img/undraw_load_more_re_482p.svg"
        class="mx-auto w-1/6"
      />
      <div
        class="py-5 text-center text-lg text-disabled dark:text-disabled--dark"
      >
        Please hold on while we load your data.
      </div>
      <div class="mx-auto w-1/2">
        <ns-progress-bar
          class="!rounded-none !border-0"
          height="0.25rem"
        ></ns-progress-bar>
      </div>
    </div>
    <form :name="app.slug">
      <template v-for="(container, index) in containers" :key="container.name">
        <div v-show="index == selectedContainer && !isLoading">
          <div :data-app="app.slug" class="px-5 py-3">
            <div
              v-for="(row, row_index) in container.rows"
              :key="row_index"
              class="flex flex-col md:flex-row md:space-x-2"
            >
              <div
                v-for="(column, column_index) in row.columns"
                :key="column_index"
                class="flex-1 overflow-hidden"
              >
                <app-field
                  ref="fields"
                  :app="app"
                  :data="values"
                  :error="errors[column.name]"
                  :properties="column"
                  :show-invalid="showInvalid"
                  :value="values[column.name]"
                  :visible="visibilities[column.name]"
                  @visibility-changed="onVisibilityChanged"
                  @input="onInput"
                  @invalid="onInvalid"
                  @keyup.enter="saveConfirmation"
                  @valid="onValid"
                ></app-field>
              </div>
            </div>
          </div>
        </div>
      </template>
    </form>
  </ns-side-panel>
</template>

<script>
import NsSidePanel from "@/components/NS/NsSidePanel.vue";
import NsProgressBar from "@/components/NS/NsProgressBar.vue";
import AppField from "@/components/Builder/AppField.vue";

import AppBuilder from "@/assets/js/AppBuilder.js";

import callHook from "@/assets/js/builder/callHook.js";
import onInsertPageCancelButtonClick from "@/assets/js/builder/app/hooks/onInsertPageCancelButtonClick.js";
import onInsertPageLoaded from "@/assets/js/builder/app/hooks/onInsertPageLoaded.js";
import onInsertPageValueChanged from "@/assets/js/builder/app/hooks/onInsertPageValueChanged.js";
import onRecordInserted from "@/assets/js/builder/app/hooks/onRecordInserted.js";

import alert from "@/assets/js/builder/alert.js";
import assignValueFromQuery from "@/assets/js/builder/assignValueFromQuery.js";
import checkFieldLogic from "@/assets/js/builder/checkFieldLogic.js";
import executeFieldLogics from "@/assets/js/builder/executeFieldLogics.js";
import executeFieldLogicActions from "@/assets/js/builder/executeFieldLogicActions.js";
import getPropertyValue from "@/assets/js/getPropertyValue.js";
import isAbleToSave from "@/assets/js/builder/isAbleToSave.js";
import onAppInput from "@/assets/js/builder/onAppInput.js";
import scrollFieldIntoView from "@/assets/js/builder/scrollFieldIntoView.js";

export default {
  components: {
    NsSidePanel,
    NsProgressBar,
    AppField
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    close: null,
    recordSaved: null
  },
  data: function () {
    return {
      app: {},
      additionalButtons: [],
      containers: [],
      disableCancelButton: false,
      disableSaveButton: false,
      errors: {},
      fieldLogics: {},
      hooks: {
        onInsertPageCancelButtonClick,
        onInsertPageLoaded,
        onInsertPageValueChanged,
        onRecordInserted
      },
      isValuesValid: {},
      isSaveConfirmationShown: false,
      isChangesMade: false,
      isChangesMadeConfirmationShown: false,
      isLoading: true,
      isShown: false,
      messages: {},
      selectedContainer: 0,
      showInvalid: false,
      values: {},
      visibilities: {}
    };
  },
  computed: {
    isAbleToSave: function () {
      return isAbleToSave(this.isValuesValid);
    }
  },
  watch: {
    $route: function (to) {
      this.render(to.params.name);
    }
  },
  mounted: function () {
    assignValueFromQuery(this.$route, this.values);

    this.render(this.$route.params.name);
  },
  methods: {
    cancel: function () {
      const self = this;
      const app = JSON.parse(JSON.stringify(self.app));

      app.$router = self.$router;

      const hook_result = callHook(
        self.hooks,
        "onInsertPageCancelButtonClick",
        Object.freeze(app)
      );

      if (hook_result === undefined || hook_result === true) {
        self.$router.push("/app/data/" + self.app.slug);
      }
    },
    onCancelButtonClick: function () {
      if (this.isChangesMade) {
        this.isChangesMadeConfirmationShown = true;
      } else {
        this.cancel();
      }
    },
    onVisibilityChanged: function (name) {
      if (typeof this.fieldLogics[name] !== "undefined") {
        executeFieldLogics(this.fieldLogics[name]);
      }
    },
    onInput: function (name, value, is_initial_value = false) {
      const app = onAppInput(this.app, this.values, name, value);

      if (!is_initial_value) {
        this.isChangesMade = true;
      }

      callHook(this.hooks, "onInsertPageValueChanged", app);
    },
    onInvalid: function (name) {
      this.isValuesValid[name] = false;
    },
    onSaveButtonClick: function () {
      const self = this;

      if (self.isAbleToSave.status) {
        self.disableCancelButton = true;
        self.disableSaveButton = true;

        AppBuilder.insertRecord(self.app, self.values)
          .then(function (result) {
            if (result) {
              const app = JSON.parse(JSON.stringify(self.app));

              app.result = result;
              app.values = self.values;
              app.$router = self.$router;

              const hook_result = callHook(self.hooks, "onRecordInserted", app);

              if (hook_result === undefined || hook_result === true) {
                self.$emit("recordSaved");
                self.$router.push("/app/data/" + self.$route.params.name);
              }

              self.disableCancelButton = false;
              self.disableSaveButton = false;
            }
          })
          .catch(function (error) {
            if (
              typeof error.response.status !== "undefined" &&
              error.response.status === 401
            ) {
              window.location.href = "/";
            } else if (typeof error.response.data.errors !== "undefined") {
              self.errors = error.response.data.errors;
              self.showInvalid = true;
            }

            self.disableCancelButton = false;
            self.disableSaveButton = false;
          });
      } else {
        scrollFieldIntoView(this.$refs["fields"], self.isAbleToSave.name);

        self.showInvalid = true;
      }
    },
    onSidePanelClose: function () {
      this.$router.push("/app/data/" + this.$route.params.name);
    },
    onValid: function (name) {
      this.isValuesValid[name] = true;
    },
    render: function (app_slug) {
      const self = this;

      AppBuilder.get(app_slug)
        .then(function (app) {
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

            if (typeof column.name !== "undefined") {
              self.errors[column.name] = [];
              self.visibilities[column.name] = true;
            }

            self.containers[column.container].rows[column.row].columns.push(
              column
            );
          }

          if (typeof app.hidden_fields !== "undefined") {
            for (let index = 0; index < app.hidden_fields.length; index++) {
              const field = app.hidden_fields[index];

              self.values[field.name] = field.value;
            }
          }

          self.$nextTick(function () {
            if (
              typeof self.$refs.fields !== "undefined" &&
              typeof self.$refs.fields[0] !== "undefined" &&
              typeof self.$refs.fields[0].focus === "function"
            ) {
              self.$refs.fields[0].focus();
            }
          });

          app.additionalButtons = self.additionalButtons;
          app.values = self.values;

          self.messages = {
            cancel: getPropertyValue(
              self.app.settings,
              "ui.page.messages.cancel",
              "Cancel"
            ),
            save: getPropertyValue(
              self.app.settings,
              "ui.page.messages.save",
              "Save"
            )
          };

          if (typeof app.field_logics !== "undefined") {
            for (
              let field_logic_index = 0;
              field_logic_index < app.field_logics.length;
              field_logic_index++
            ) {
              const field_logic = app.field_logics[field_logic_index];

              for (
                let condition_index = 0;
                condition_index < field_logic.conditions.length;
                condition_index++
              ) {
                const condition = field_logic.conditions[condition_index];

                if (typeof self.fieldLogics[condition.field] === "undefined") {
                  self.fieldLogics[condition.field] = [];
                }

                self.fieldLogics[condition.field].push(function () {
                  const field_logic_result = checkFieldLogic(
                    field_logic.operator,
                    field_logic.conditions,
                    self.values
                  );

                  executeFieldLogicActions(
                    field_logic.actions,
                    field_logic_result,
                    self.visibilities
                  );
                });
              }
            }

            for (const key in self.fieldLogics) {
              if (Object.hasOwnProperty.call(self.fieldLogics, key)) {
                self.$watch(
                  "values." + key,
                  function () {
                    executeFieldLogics(self.fieldLogics[key]);
                  },
                  {
                    immediate: true
                  }
                );
              }
            }
          }

          self.isLoading = false;

          callHook(self.hooks, "onInsertPageLoaded", Object.freeze(app));
        })
        .catch(function (e) {
          let title = "Error";
          let message = "Something went wrong!";

          if (e.response.status === 404) {
            message = "Not found.";
          }

          alert(title, message, "error");
        });
    },
    saveConfirmation: function () {
      const self = this;

      self.isSaveConfirmationShown = true;
    }
  }
};
</script>
