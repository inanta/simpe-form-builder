<template>
  <ns-side-panel :show="show" title="Field Logic" @close="$emit('close')">
    <div class="m-2 dark:text-on-surface--dark-100">
      <div
        v-for="(conditionSet, conditionSetIndex) in conditionSets"
        :key="conditionSetIndex"
        class="px-2 pt-1"
      >
        <div>
          <div class="flex space-x-2">
            <a
              href="#"
              @click.prevent="onShowConditionSetsButtonClick(conditionSetIndex)"
            >
              <span
                class="mdi"
                :class="{
                  'mdi-chevron-down-circle':
                    isConditionSetsDetailsShown &&
                    selectedConditionSets == conditionSetIndex,
                  'mdi-chevron-right-circle': !(
                    isConditionSetsDetailsShown &&
                    selectedConditionSets == conditionSetIndex
                  )
                }"
              ></span>
              {{ conditionSet.name }}
            </a>
            <button
              class="border-none bg-transparent"
              @click.prevent="onEditConditionSetButtonClick(conditionSetIndex)"
            >
              <span class="mdi mdi-pencil"></span>
            </button>
          </div>
          <div
            v-if="
              isConditionSetsDetailsShown &&
              selectedConditionSets == conditionSetIndex
            "
            class="mx-2 border-l border-mid-gray pl-3"
          >
            <div class="py-2">
              <div class="text-positive dark:text-positive--dark">
                <span class="mdi mdi-check-circle"></span> ON TRUE
              </div>
              <div class="ml-2 border-l border-mid-gray pl-4">
                <div>
                  <app-builder-field-logic-action
                    :actions="conditionSet.actions"
                    :event="true"
                    :fields="fields"
                    :index="conditionSetIndex"
                    @add-action="onAddAction"
                    @edit-action="onEditAction"
                  ></app-builder-field-logic-action>
                </div>
              </div>
            </div>
            <div class="py-2">
              <div class="text-negative dark:text-negative--dark">
                <span class="mdi mdi-close-circle"></span> ON FALSE
              </div>
              <div class="ml-2 border-l border-mid-gray pl-4">
                <div>
                  <app-builder-field-logic-action
                    :actions="conditionSet.actions"
                    :event="false"
                    :fields="fields"
                    :index="conditionSetIndex"
                    @add-action="onAddAction"
                    @edit-action="onEditAction"
                  ></app-builder-field-logic-action>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isAddNewConditionSetFormShown"
        class="m-2 flex flex-col rounded-sm border border-primary p-4 dark:border-primary--dark dark:text-on-surface--dark-100"
      >
        <h2 class="mb-2 text-lg font-bold">
          {{ formAction === "add" ? "New" : "Edit" }} Condition Set
        </h2>
        <div class="mb-1">Name</div>
        <div>
          <input
            v-model="conditionSetName"
            type="text"
            class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
          />
        </div>
        <hr class="my-4" />
        <table class="mb-2 w-full table-auto overflow-hidden">
          <tr>
            <td>&nbsp;</td>
            <td class="px-1">Field</td>
            <td class="px-1">Operator</td>
            <td class="px-1">Value</td>
            <td>&nbsp;</td>
          </tr>
          <tr
            v-for="(newConditionSet, conditionIndex) in conditions"
            :key="conditionIndex"
          >
            <td
              class="w-0 px-5 py-2 text-center text-xl font-bold text-primary"
            >
              {{ conditionIndex + 1 }}
            </td>
            <td class="px-1">
              <ns-drop-down-list
                v-model="conditions[conditionIndex]['field']"
                :items="fields"
                placeholder="Source"
                class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
              ></ns-drop-down-list>
            </td>
            <td class="px-1">
              <ns-drop-down-list
                v-model="conditions[conditionIndex]['operator']"
                :items="operators"
                placeholder="Source"
                class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
              ></ns-drop-down-list>
            </td>
            <td class="px-1">
              <input
                v-model="conditions[conditionIndex]['value']"
                class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500 dark:focus:border-surface--dark-600"
                type="text"
              />
            </td>
            <td class="w-0 px-1">
              <button
                class="rounded-sm bg-negative px-2 py-1.5 text-on-positive dark:bg-negative--dark dark:text-on-negative--dark"
                :class="{
                  'bg-disabled text-on-disabled dark:!bg-disabled--dark dark:!text-on-disabled--dark':
                    conditionIndex === 0
                }"
                :disabled="conditionIndex === 0"
                @click="onRemoveConditionClick(conditionIndex)"
              >
                <span class="mdi mdi-delete"></span>
              </button>
            </td>
          </tr>
        </table>
        <div>
          <button
            class="w-full border border-dashed border-mid-gray bg-transparent p-2 text-center"
            @click.prevent="onAddNewConditionButtonClick"
          >
            <span class="mdi mdi-plus"></span> Add Condition
          </button>
        </div>
        <div v-if="conditions.length > 1" class="mt-6">
          <div class="mb-1">Operator Between Conditions</div>
          <div>
            <ns-drop-down-list
              v-model="operatorBetweenConditionsValue"
              :items="operatorBetweenConditions"
              placeholder="Select Operator"
              class="w-full appearance-none rounded-sm border px-3 py-1.5 text-base outline-none focus:border-primary dark:border-surface--dark-500 dark:bg-surface--dark-500"
            ></ns-drop-down-list>
          </div>
        </div>

        <div class="mt-4 flex space-x-2">
          <button
            class="mx-auto w-full rounded-sm bg-negative p-2 text-on-primary dark:bg-negative--dark dark:text-on-negative--dark"
            @click="onCancelAddNewConditionSetClick"
          >
            Cancel
          </button>
          <button
            class="mx-auto w-full rounded-sm bg-primary p-2 text-on-primary dark:bg-primary--dark dark:text-on-primary"
            @click="onSaveConditionSetClick"
          >
            {{ formAction == "add" ? "Add" : "Edit" }} Condition Set
          </button>
        </div>
      </div>
      <div class="flex p-2">
        <button
          v-if="!isAddNewConditionSetFormShown"
          class="w-full border border-dashed border-mid-gray bg-transparent p-2"
          @click="onNewConditionSetButtonClick"
        >
          <span class="mdi mdi-plus"></span> Add Condition Set
        </button>
      </div>
      <div class="p-2">
        <button
          class="mx-auto w-full rounded-sm bg-primary p-2 text-on-primary dark:bg-primary--dark dark:text-on-primary"
          @click="onSaveButtonClick"
        >
          Save
        </button>
      </div>
    </div>
  </ns-side-panel>
</template>

<script>
import NsSidePanel from "@/components/NS/NsSidePanel.vue";
import NsDropDownList from "@/components/NS/NsDropDownList.vue";
import AppBuilderFieldLogicAction from "@/components/Builder/AppBuilderFieldLogicAction.vue";

import iterateColumns from "@/assets/js/builder/iterateColumns.js";

export default {
  components: { NsSidePanel, NsDropDownList, AppBuilderFieldLogicAction },
  props: {
    containers: {
      type: Array,
      default: function () {
        return [];
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    values: {
      type: Array,
      default: function () {
        return [
          {
            name: "",
            conditions: [],
            operatorBetweenConditions: "and"
          }
        ];
      }
    }
  },
  emits: {
    close: null,
    save: null
  },
  data: function () {
    return {
      actions: [],
      conditionSetID: 0,
      conditionSets: [],
      conditionSetName: "",
      formAction: "add",
      isAddNewConditionSetFormShown: false,
      isConditionSetsDetailsShown: false,
      conditions: [
        {
          field: "",
          operator: "equals",
          value: ""
        }
      ],
      operatorBetweenConditions: [
        { label: "All Conditions", value: "and" },
        { label: "Any Condition", value: "or" }
      ],
      operatorBetweenConditionsValue: "",
      selectedConditionSets: 0
    };
  },
  computed: {
    fields: function () {
      const fields = [];

      iterateColumns(
        this.containers,
        function (container_index, row_index, column_index, column) {
          if (column.type !== "empty") {
            let label = "";

            if (typeof column.label !== "undefined" && column.label !== "") {
              label = column.label;
            }

            if (typeof column.name !== "undefined" && column.name !== "") {
              if (label != "") {
                label += " (" + column.name + ")";
              }
            }

            if (label !== "") {
              fields.push({
                label: label,
                value: column.name
              });
            }
          }
        }
      );

      return fields;
    },
    operators: function () {
      return [
        {
          label: "Equals",
          value: "eq"
        },
        {
          label: "Not Equals",
          value: "neq"
        },
        {
          label: "Less Than",
          value: "lt"
        },
        {
          label: "Greater Than",
          value: "gt"
        }
      ];
    }
  },
  mounted: function () {},
  methods: {
    clearNewConditionSetForm: function () {
      this.conditionSetName = "";
      this.conditions = [];
      this.conditions.push({
        field: "field",
        operator: "eq",
        value: ""
      });
    },
    hideNewConditionSeForm: function () {
      this.isAddNewConditionSetFormShown = false;
    },
    onAddAction: function (value) {
      if (typeof this.conditionSets[value.index].actions === "undefined") {
        this.conditionSets[value.index].actions = [];
      }

      delete value.id;
      this.conditionSets[value.index].actions.push(value);
    },
    onAddNewConditionButtonClick: function () {
      this.conditions.push({
        field: "field",
        operator: "eq",
        value: ""
      });
    },
    onCancelAddNewConditionSetClick: function () {
      this.hideNewConditionSeForm();
    },
    onEditConditionSetButtonClick: function (index) {
      const selectedConditionSet = this.conditionSets[index];

      this.formAction = "edit";
      this.conditionSetID = index;

      this.isConditionSetsDetailsShown = false;
      this.isAddNewConditionSetFormShown = true;

      this.conditionSetName = selectedConditionSet.name;
      this.operatorBetweenConditionsValue = selectedConditionSet.operator;
      this.conditions = selectedConditionSet.conditions;
    },
    onEditAction: function (value) {
      const id = value.id;
      delete value.id;

      this.conditionSets[value.index].actions.splice(id, 1, value);
    },
    onNewConditionSetButtonClick: function () {
      this.clearNewConditionSetForm();

      this.formAction = "add";
      this.conditionSetID = 0;

      this.isConditionSetsDetailsShown = false;
      this.isAddNewConditionSetFormShown = true;
    },
    onSaveConditionSetClick: function () {
      if (this.formAction === "add") {
        this.conditionSets.push({
          name: this.conditionSetName,
          actions: [],
          conditions: this.conditions,
          operator: this.operatorBetweenConditionsValue
        });
      } else {
        this.conditionSets.splice(this.conditionSetID, 1, {
          name: this.conditionSetName,
          conditions: this.conditions,
          actions: this.conditionSets[this.conditionSetID].actions,
          operator: this.operatorBetweenConditionsValue
        });
      }

      this.selectedConditionSets = this.conditionSets.length - 1;
      this.isConditionSetsDetailsShown = true;

      this.hideNewConditionSeForm();
    },
    onShowConditionSetsButtonClick: function (index) {
      if (this.selectedConditionSets == index) {
        this.isConditionSetsDetailsShown = !this.isConditionSetsDetailsShown;
      } else {
        this.isConditionSetsDetailsShown = true;
      }

      this.selectedConditionSets = index;
    },
    onRemoveConditionClick: function (index) {
      this.conditions.splice(index, 1);
    },
    onSaveButtonClick: function () {
      this.$emit("save", this.conditionSets);
      this.$emit("close");
    }
  }
};
</script>
