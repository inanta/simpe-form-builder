<template>
  <div>
    <div>
      <textarea
        v-model="values.url"
        placeholder="API Endpoint URL"
        rows="3"
        class="w-full rounded-sm border border-primary px-1 py-0.5 dark:border-surface--dark-500 dark:bg-surface--dark-500"
      ></textarea>
    </div>
    <div class="pb-0.5">
      <div class="py-0.5 font-bold">Method</div>
      <div class="py-0.5">
        <select
          v-model="values.method"
          class="h-full w-full rounded-sm border border-primary p-1 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
        >
          <option
            v-for="method in methods"
            :key="method.name"
            :value="method.name"
          >
            {{ method.label }}
          </option>
        </select>
      </div>
    </div>
    <div class="pb-0.5">
      <div class="py-0.5 font-bold">Response Type</div>
      <div class="py-0.5">
        <select
          v-model="values.response_type"
          class="h-full w-full rounded-sm border border-primary p-1 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
        >
          <option
            v-for="responseType in responseTypes"
            :key="responseType.name"
            :value="responseType.name"
          >
            {{ responseType.label }}
          </option>
        </select>
      </div>
    </div>
    <div v-for="option in options" :key="option.name">
      <div class="pb-0.5 font-bold">{{ option.label }}</div>
      <div class="pb-1">
        <input
          v-model="values[option.name]"
          class="w-full rounded-sm border border-primary px-1 py-0.5 outline-none dark:border-surface--dark-500 dark:bg-surface--dark-500"
          type="text"
          :placeholder="option.placeholder"
        />
      </div>
    </div>
    <hr class="my-3" />
    <div>
      <div class="pb-1">
        <b>Payload</b>
      </div>
    </div>
    <div class="grid grid-cols-2">
      <div class="py-0.5 pr-1">From Fields</div>
      <div class="py-0.5 pl-1">
        <div v-for="field in fields" :key="field.name">
          <div class="py-0.5 pr-1">
            <label>
              <input
                v-model="values.parameters"
                type="checkbox"
                :value="field.name"
              />
              {{ field.label }}
            </label>
          </div>
        </div>
      </div>
      <div class="py-0.5 pr-1">From Query String</div>
      <div class="py-0.5 pl-1">
        <input
          v-model="values.is_include_query_string_in_payload"
          type="checkbox"
        />
      </div>
    </div>
    {{ values }}
  </div>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      default: function () {
        return [];
      }
    },
    modelValue: {
      type: Object,
      default: function () {
        return {};
      }
    },
    options: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  emits: {
    change: null,
    "update:modelValue": null
  },
  data: function () {
    return {
      methods: [
        {
          label: "GET",
          name: "GET"
        },
        {
          label: "POST",
          name: "POST"
        }
      ],
      responseTypes: [
        {
          label: "JSON",
          name: "json"
        },
        {
          label: "Text",
          name: "text"
        }
      ],
      values: {}
    };
  },
  watch: {
    modelValue: {
      handler: function () {
        this.values = this.modelValue;
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
