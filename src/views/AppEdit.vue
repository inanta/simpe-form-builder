<template>
  <div
    class="bg-white text-black dark:bg-surface--dark-100 dark:text-on-surface--dark-100"
  >
    <div class="px-4 pb-4">
      <div class="flex py-2">
        <div class="my-auto text-xl font-bold">{{ app.name }}</div>
      </div>
      <div
        ref="mainContainer"
        class="relative mb-4 mt-2 rounded-md border border-light-gray bg-white shadow-center dark:border-surface--dark-300 dark:bg-surface--dark-300 dark:shadow-none"
      >
        <div
          ref="topButtonsContainer"
          class="flex rounded-t-md border-b border-mid-gray bg-white px-3 py-3 dark:border-surface--dark-600 dark:bg-surface--dark-300"
        >
          <div>
            <button
              v-for="button in additionalButtons"
              :key="button.name"
              class="ml-2 rounded bg-primary px-3 py-2 text-on-primary dark:bg-primary--dark"
              @click="button.onClick"
            >
              <span :class="button.icon"></span> {{ button.label }}
            </button>
          </div>
          <div class="ml-auto">
            <button
              :class="{
                'bg-negative dark:bg-negative--dark': !disableCancelButton,
                'bg-disabled text-on-disabled dark:bg-disabled--dark dark:text-on-disabled--dark':
                  disableCancelButton
              }"
              :disable="disableCancelButton"
              class="rounded px-3 py-2 text-on-negative"
              @click="onCancelButtonClick"
            >
              <span class="mdi mdi-close"></span> {{ messages.cancel }}
            </button>
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
        <form :name="app.slug">
          <template
            v-for="(container, index) in containers"
            :key="container.name"
          >
            <div
              v-show="index == selectedContainer"
              class="flex-shrink flex-grow"
            >
              <div :data-app="app.slug" class="px-5 py-3">
                <div
                  v-for="(row, row_index) in container.rows"
                  :key="row_index"
                  :class="'grid-cols-' + row.columns.length"
                  class="grid gap-2"
                >
                  <div
                    v-for="(column, column_index) in row.columns"
                    :key="column_index"
                    class="overflow-hidden"
                  >
                    <app-field
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
      </div>
    </div>
  </div>
  <confirmation-dialog
    :show="isChangesMadeConfirmationShown"
    @close="isChangesMadeConfirmationShown = false"
    @confirm="cancel"
    >Any unsaved changes will be lost? Are you sure?
  </confirmation-dialog>
  <confirmation-dialog
    :show="isSaveConfirmationShown"
    @close="isSaveConfirmationShown = false"
    @confirm="onSaveButtonClick"
    >Do you want to save the data?
  </confirmation-dialog>
  <app-alert></app-alert>
</template>

<script>
import AppField from "@/components/Builder/AppField.vue";
import ConfirmationDialog from "@/components/Builder/ConfirmationDialog.vue";
import AppAlert from "@/components/Builder/AppAlert.vue";

import AppBuilder from "@/assets/js/AppBuilder.js";

import callHook from "@/assets/js/builder/callHook.js";
import onEditPageCancelButtonClick from "@/assets/js/builder/app/hooks/onEditPageCancelButtonClick.js";
import onEditPageLoaded from "@/assets/js/builder/app/hooks/onEditPageLoaded.js";
import onEditPageValueChanged from "@/assets/js/builder/app/hooks/onEditPageValueChanged.js";
import onRecordEdited from "@/assets/js/builder/app/hooks/onRecordEdited.js";

import assignValueFromQuery from "../assets/js/builder/assignValueFromQuery.js";
import checkFieldLogic from "../assets/js/builder/checkFieldLogic.js";
import executeFieldLogics from "../assets/js/builder/executeFieldLogics.js";
import executeFieldLogicActions from "../assets/js/builder/executeFieldLogicActions.js";
import getPropertyValue from "@/assets/js/getPropertyValue.js";
import isAbleToSave from "../assets/js/builder/isAbleToSave.js";
import onAppInput from "../assets/js/builder/onAppInput.js";
import onAppWindowScroll from "../assets/js/builder/onAppWindowScroll.js";

export default {
  components: {
    AppField,
    ConfirmationDialog,
    AppAlert
  },
  props: {},
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
        onEditPageCancelButtonClick,
        onEditPageLoaded,
        onEditPageValueChanged,
        onRecordEdited
      },
      isValuesValid: {},
      isSaveConfirmationShown: false,
      isChangesMade: false,
      isChangesMadeConfirmationShown: false,
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
    $route(to) {
      this.render(to.params.name);
    }
  },
  mounted: function () {
    assignValueFromQuery(this.$route, this.values);

    this.render(this.$route.params.name, this.$route.params.id);

    window.addEventListener("scroll", this.onWindowScroll);
  },
  unmounted: function () {
    window.removeEventListener("scroll", this.onWindowScroll);
  },
  methods: {
    cancel: function () {
      const self = this;
      const app = JSON.parse(JSON.stringify(self.app));

      app.$router = self.$router;

      const hook_result = callHook(
        self.hooks,
        "onEditPageCancelButtonClick",
        Object.freeze(app)
      );

      if (hook_result === undefined || hook_result === true) {
        self.$router.push("/app/view/" + self.app.slug);
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

      callHook(this.hooks, "onEditPageValueChanged", app);
    },
    onInvalid: function (name) {
      this.isValuesValid[name] = false;
    },
    onSaveButtonClick: function () {
      const self = this;

      if (self.isAbleToSave) {
        self.disableCancelButton = true;
        self.disableSaveButton = true;

        AppBuilder.updateRecord(self.app, self.values)
          .then(function (result) {
            if (result) {
              const app = JSON.parse(JSON.stringify(self.app));

              app.result = result;
              app.values = self.values;
              app.$router = self.$router;

              const hook_result = callHook(self.hooks, "onRecordEdited", app);

              if (hook_result === undefined || hook_result === true) {
                self.$router.push("/app/view/" + self.app.slug);
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
        self.showInvalid = true;
      }
    },
    onValid: function (name) {
      this.isValuesValid[name] = true;
    },
    onWindowScroll: function () {
      onAppWindowScroll(this);
    },
    render: function (app_slug, id) {
      const self = this;

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

          if (typeof column.name !== "undefined") {
            self.errors[column.name] = [];
            self.visibilities[column.name] = true;
          }

          self.containers[column.container].rows[column.row].columns.push(
            column
          );
        }

        for (let index = 0; index < app.hidden_fields.length; index++) {
          const field = app.hidden_fields[index];

          self.values[field.name] = field.value;
        }

        AppBuilder.getRecord(app.slug, id, { event: "update" })
          .then(function (record) {
            for (const key in record) {
              self.values[key] = record[key];
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

                  if (
                    typeof self.fieldLogics[condition.field] === "undefined"
                  ) {
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

            callHook(self.hooks, "onEditPageLoaded", Object.freeze(app));
          })
          .catch(function (e) {
            let title = "Error";
            let message = "Something went wrong!";

            if (e.response.status === 404) {
              message = "Data not found.";
            }

            const alert = new CustomEvent("app:alert", {
              detail: {
                title: title,
                icon: "error",
                message: message
              }
            });

            document.dispatchEvent(alert);
          });
      });
    },

    saveConfirmation: function () {
      const self = this;

      self.isSaveConfirmationShown = true;
    }
  }
};
</script>
