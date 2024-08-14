<template>
  <div>
    <div>
      <div
        v-for="(addedAction, addedActionIndex) in addedActions"
        :key="addedActionIndex"
        class="pb-1"
      >
        <a href="" @click.prevent="onEditActionClick(addedActionIndex)">
          <span class="mdi mdi-square-medium"></span> {{ addedAction.name }}
        </a>
      </div>
    </div>
    <div>
      <button
        v-if="!isAddNewActionFormShown"
        class="w-full border border-dashed border-mid-gray bg-transparent p-2 text-center"
        @click.prevent="onNewActionButtonClick"
      >
        <span class="mdi mdi-plus"></span> Add Action
      </button>
    </div>
    <div
      v-if="isAddNewActionFormShown"
      class="flex flex-col rounded-sm border border-primary p-4 dark:border-primary--dark"
    >
      <h2 class="mb-2 text-lg font-bold">
        {{ formAction == "add" ? "New" : "Edit" }} Action
      </h2>
      <div>
        <div class="mb-1">Name</div>
        <div>
          <input
            v-model="actionName"
            type="text"
            class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
          />
        </div>
      </div>
      <div>
        <div class="mb-1">Action</div>
        <div class="flex space-x-2">
          <div class="flex-grow">
            <ns-drop-down-list
              v-model="action"
              :items="actionTypes"
              placeholder="Source"
              class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
            ></ns-drop-down-list>
          </div>
          <div class="flex-grow">
            <ns-drop-down-list
              v-model="field"
              :items="fields"
              placeholder="Source"
              class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
            ></ns-drop-down-list>
          </div>
        </div>
        <div class="mt-4 flex space-x-2">
          <button
            class="mx-auto w-full rounded-sm bg-negative p-2 text-on-primary dark:bg-negative--dark dark:text-on-negative--dark"
            @click="onCancelAddNewActionClick"
          >
            Cancel
          </button>
          <button
            class="mx-auto w-full rounded-sm bg-primary p-2 text-on-primary dark:bg-primary--dark dark:text-on-primary"
            @click="onSaveActionButtonClick"
          >
            {{ formAction == "add" ? "Add" : "Edit" }} Action
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NsDropDownList from "@/components/NS/NsDropDownList.vue";

export default {
  components: { NsDropDownList },
  props: {
    actions: {
      type: Array,
      default: function () {
        return [];
      }
    },
    event: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array,
      default: function () {
        return [];
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  emits: {
    addAction: null,
    editAction: null
  },
  data: function () {
    return {
      action: "show-field",
      actionID: 0,
      actionName: "",
      actionTypes: [
        {
          label: "Show Field",
          value: "show-field"
        },
        {
          label: "Hide Field",
          value: "hide-field"
        },
        {
          label: "Enable Field",
          value: "enable-field"
        },
        {
          label: "Disable Field",
          value: "disable-field"
        }
      ],
      addedActions: [],
      field: "",
      isAddNewActionFormShown: false,
      formAction: "add"
    };
  },
  watch: {
    actions: {
      handler: function () {
        this.addedActions = [];

        for (let index = 0; index < this.actions.length; index++) {
          const action = this.actions[index];

          if (action.event == this.event) {
            action.id = index;
            this.addedActions.push(action);
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    clearNewActionForm: function () {
      this.action = "show-field";
      this.actionName = "";
      this.field =
        typeof this.fields[0].value !== "undefined" ? this.fields[0].value : "";
    },
    hideNewActionForm: function () {
      this.isAddNewActionFormShown = false;
    },
    onSaveActionButtonClick: function () {
      const event = this.formAction === "add" ? "addAction" : "editAction";

      this.$emit(event, {
        action: this.action,
        event: this.event,
        field: this.field,
        id: this.actionID,
        index: this.index,
        name: this.actionName
      });

      this.hideNewActionForm();
    },
    onEditActionClick: function (index) {
      const selectedAction = this.addedActions[index];

      this.action = selectedAction.action;
      this.actionName = selectedAction.name;
      this.field = selectedAction.field;

      this.formAction = "edit";
      this.actionID = selectedAction.id;
      this.isAddNewActionFormShown = true;
    },
    onNewActionButtonClick: function () {
      this.clearNewActionForm();

      this.formAction = "add";
      this.actionID = 0;
      this.isAddNewActionFormShown = true;
    },
    onCancelAddNewActionClick: function () {
      this.hideNewActionForm();
    }
  }
};
</script>
