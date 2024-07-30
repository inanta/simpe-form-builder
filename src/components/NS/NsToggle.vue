<template>
  <div>
    <label>
      <input v-model="internalChecked" type="checkbox" @change="onChange" />
      <span></span>
    </label>
    <span>{{
      internalChecked ? checkedLabelString : uncheckedLabelString
    }}</span>
  </div>
</template>

<script>
export default {
  name: "NsToggle",
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    checkedLabel: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    uncheckedLabel: {
      type: String,
      default: ""
    },
    value: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  emits: ["update:modelValue"],
  data: function () {
    return {
      checkedLabelString: "Yes",
      internalChecked: false,
      internalLabel: "",
      internalValue: "",
      uncheckedLabelString: "No"
    };
  },
  watch: {
    checked: {
      handler: function (value) {
        this.internalChecked = value;
      },
      immediate: true
    },
    checkedLabel: {
      handler: function (value) {
        this.checkedLabelString = value;
      },
      immediate: true
    },
    label: {
      handler: function (value) {
        this.internalLabel = value;
      },
      immediate: true
    },
    modelValue: {
      handler: function (value) {
        this.internalChecked = value;
      },
      immediate: true
    },
    uncheckedLabel: {
      handler: function (value) {
        this.uncheckedLabelString = value;
      },
      immediate: true
    },
    value: {
      handler: function (value) {
        this.internalValues = value;
      },
      immediate: true
    }
  },
  methods: {
    onChange: function () {
      this.$emit("update:modelValue", this.internalChecked);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  display: inline;
}

div > label {
  display: inline-block;
  height: 1.25rem;
  position: relative;
  vertical-align: middle;
  width: 2rem;
}

div > label > input {
  height: 0;
  opacity: 0;
  width: 0;
}

div > label > span {
  background-color: #ccc;
  border-radius: 1rem;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  transition: 0.4s;
  top: 0;
  -webkit-transition: 0.4s;
}

div > label > span:before {
  background-color: white;
  border-radius: 50%;
  bottom: 0.125rem;
  content: "";
  height: 1rem;
  left: 0.125rem;
  position: absolute;
  transition: 0.4s;
  width: 1rem;
  -webkit-transition: 0.4s;
}

input:checked + span {
  background-color: #2196f3;
}

input:focus + span {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + span:before {
  -webkit-transform: translateX(13px);
  -ms-transform: translateX(13px);
  transform: translateX(13px);
}

div > span {
  font-size: 1rem;
  padding-left: 0.5rem;
  vertical-align: middle;
}
</style>
