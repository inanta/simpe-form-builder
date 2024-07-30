<template>
  <div :class="{ 'h-28': showAdd }">
    <button
      class="w-full rounded-sm bg-primary px-0.5 py-1.5 text-xs text-on-primary dark:bg-primary--dark"
      href="javascript:;"
      @click="onAddButtonClick"
    >
      <span class="mdi mdi-plus"></span>Add Validation
    </button>

    <transition
      name="show-add-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAdd"
        class="absolute left-0 top-0 flex h-full w-full flex-col bg-white p-2 dark:bg-surface--dark-300"
      >
        <div>
          <div
            v-if="validations.length === 0"
            class="mb-2 border-b border-primary pb-2 text-center dark:border-primary--dark"
          >
            <div>No validations has been added.</div>
          </div>
          <div v-else>
            <div>
              <div
                v-for="(validation, validation_index) in validations"
                :key="validation_index"
                class="flex"
              >
                <div
                  class="mb-2 mr-2 flex-grow rounded-sm border border-primary px-2 py-1 dark:border-primary--dark"
                >
                  {{ renderValidation(validation) }}
                </div>
                <div>
                  <button
                    class="rounded-full bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
                    @click="removeValidation(validation_index)"
                  >
                    <i class="mdi mdi-minus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button
            class="rounded-full bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="showAddValidation = true"
          >
            <i class="mdi mdi-plus"></i>
          </button>
        </div>

        <div class="pt-2 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="cancel"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="save"
          >
            <span class="mdi mdi-check"></span> Save
          </button>
        </div>
      </div>
    </transition>

    <transition
      name="show-add-filter-transition"
      enter-active-class="animate__animated animate__slideInUp animate__faster"
      leave-active-class="animate__animated animate__slideOutDown animate__faster"
    >
      <div
        v-if="showAddValidation"
        class="overflow-none absolute left-0 top-0 flex h-full w-full flex-col bg-white p-2 dark:bg-surface--dark-300"
      >
        <div class="flex pb-1.5">
          <div class="w-1/3">Type</div>
          <div class="w-2/3">
            <select
              v-model="validationType"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
            >
              <option
                v-for="type in types"
                :key="type.label"
                :value="type.name"
                class="grid grid-cols-2"
              >
                {{ type.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex pb-1.5">
          <div class="w-1/3">Invalid Message</div>
          <div class="w-2/3">
            <textarea
              v-model="invalidMessage"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
            ></textarea>
          </div>
        </div>

        <div
          v-for="(option, index) in options"
          :key="index"
          class="flex pb-1.5"
        >
          <div class="w-1/3">{{ option.label }}</div>
          <div class="w-2/3">
            <input
              v-model="optionsValues[index]"
              class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
              type="text"
            />
          </div>
        </div>

        <div class="pt-1.5 text-center">
          <button
            class="mr-2 rounded-sm bg-negative px-2 py-1 text-on-negative dark:bg-negative--dark"
            @click="showAddValidation = false"
          >
            <span class="mdi mdi-close"></span> Cancel
          </button>
          <button
            class="rounded-sm bg-primary px-2 py-1 text-on-primary dark:bg-primary--dark"
            @click="addValidation"
          >
            <span class="mdi mdi-plus"></span>Add
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    configuration: {
      type: Object,
      default: function () {
        return { source: "" };
      }
    },
    fieldProperty: {
      type: String,
      default: ""
    },
    properties: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  emits: {
    change: null
  },
  data: function () {
    return {
      invalidMessage: "",
      types: [
        {
          label: "Number",
          name: "number",
          message: "This field must be a number"
        },
        {
          label: "Regular Expression",
          name: "regex",
          message: "This field value is not valid"
        },
        {
          label: "Required",
          name: "required",
          message: "This field is required"
        },
        {
          label: "Unique",
          name: "unique",
          message: "This field must be unique, duplicate detected"
        },
        {
          label: "Field Compare",
          name: "field-compare",
          message: "Values for $field_1 and $field_2 should match criteria",
          options: [
            {
              label: "Compare Field",
              name: "compare_field"
            },
            {
              label: "Condition",
              name: "condition"
            }
          ]
        },
        {
          label: "Custom",
          name: "custom",
          message: "Validation failed",
          options: [
            {
              label: "File",
              name: "file"
            },
            {
              label: "Function",
              name: "function"
            }
          ]
        }
      ],
      validationType: "required",
      options: [],
      optionsValues: [],
      validations: [],
      showAdd: false,
      showAddValidation: false
    };
  },
  watch: {
    properties: function () {
      this.showAdd = false;
    },
    validationType: {
      handler: function (value) {
        for (let index = 0; index < this.types.length; index++) {
          const type = this.types[index];

          if (type.name === value) {
            this.invalidMessage = type.message;

            this.options = [];

            if (typeof type.options !== "undefined") {
              for (let index = 0; index < type.options.length; index++) {
                const option = type.options[index];

                this.options.push(option);
              }
            }

            break;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    addValidation: function () {
      const validation = {
        message: this.invalidMessage,
        type: this.validationType
      };

      for (let index = 0; index < this.options.length; index++) {
        const option = this.options[index];

        validation[option.name] = this.optionsValues[index];
      }

      this.validations.push(validation);
      this.showAddValidation = false;

      this.invalidMessage = this.types[2].message;
      this.validationType = this.types[2].name;
    },
    cancel: function () {
      this.showAdd = false;
    },
    initializeItems: function () {
      this.validations = [];

      if (typeof this.properties[this.fieldProperty] !== "undefined") {
        const saved_validations = JSON.parse(
          JSON.stringify(this.properties[this.fieldProperty])
        );

        for (let index = 0; index < saved_validations.length; index++) {
          const validation = saved_validations[index];

          if (typeof validation.type !== "undefined") {
            for (
              let type_index = 0;
              type_index < this.types.length;
              type_index++
            ) {
              const type = this.types[type_index];

              if (validation.type === type.name) {
                this.validations.push(validation);

                break;
              }
            }
          }
        }
      }
    },
    onAddButtonClick: function () {
      this.initializeItems();

      this.showAdd = true;
    },
    removeValidation: function (index) {
      this.validations.splice(index, 1);
    },
    renderValidation: function (validation) {
      for (let index = 0; index < this.types.length; index++) {
        const type = this.types[index];

        if (type.name === validation.type) {
          return type.label + ": " + validation.message;
        }
      }

      return "";
    },
    save: function () {
      this.showAdd = false;

      this.$emit(
        "change",
        this.fieldProperty,
        JSON.parse(JSON.stringify(this.validations))
      );
    }
  }
};
</script>
