<template>
  <div class="flex h-full w-full bg-primary">
    <div class="m-auto flex h-4/5 w-4/5 flex-col rounded bg-white">
      <div class="flex-grow-0 py-5 text-center">
        <h1 class="text-2xl font-bold">{{ wizardTitle }}</h1>
        <p class="mt-1">{{ wizardDescription }}</p>
      </div>
      <div
        :class="{ 'h-0': currentWizardStep > 0 }"
        class="flex-grow-1 h-full overflow-hidden transition-all duration-500"
      >
        <img
          class="m-auto h-full"
          src="@/assets/img/undraw_choose_re_7d5a.svg"
        />
      </div>
      <div v-if="isLoading" class="flex h-28">
        <div class="m-auto">
          <span class="loader-2 block"></span>
        </div>
      </div>
      <template v-else>
        <div class="flex-grow-0 p-2">
          <div class="mb-2">
            <ns-drop-down-list
              v-model="selectedPrimaryCollection"
              :items="collections"
              class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary"
              placeholder="Search Collection You Want To Use"
            ></ns-drop-down-list>
          </div>
          <div class="mb-2">
            <ns-drop-down-list
              v-model="selectedPrimaryCollectionID"
              :items="fields"
              class="w-full rounded-sm border border-mid-gray px-3 py-1.5 text-base outline-none focus:border-primary"
              placeholder="Search Collection ID Field You Want To Use"
            ></ns-drop-down-list>
          </div>
          <div class="text-center">
            <button
              v-if="currentWizardStep > 0"
              class="rounded bg-negative px-2.5 py-1.5 text-on-negative"
              @click="onBackButtonClick"
            >
              <span class="mdi mdi-arrow-left"></span> Back
            </button>
            <button
              v-if="currentWizardStep < wizardSteps.length - 1"
              class="ml-2 rounded bg-primary px-2.5 py-1.5 text-on-primary"
              @click="onNextButtonClick"
            >
              <span class="mdi mdi-arrow-right"></span> Next
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import NsDropDownList from "@/components/NS/NsDropDownList.vue";
import ApiBuilder from "@/assets/js/ApiBuilder.js";

import "@/assets/css/loaders/2.css";

export default {
  name: "App",
  components: {
    NsDropDownList
  },
  props: {},
  data: function () {
    return {
      api: {
        name: "API"
      },
      //   isEdit: false,
      collections: [],
      currentWizardStep: 0,
      fields: [],
      isLoading: true,
      selectedPrimaryCollection: "",
      selectedPrimaryCollectionID: "",
      wizardSteps: [
        {
          title: "Select Primary Collection",
          description: "Which collection do you want to use?"
        },
        {
          title: "Select Additional Collections",
          description: "Do you want to add additional collections?"
        },
        {
          title: "Select Fields",
          description: "Select fields you want to use"
        },
        {
          title: "Configuration",
          description: "Configure API"
        }
      ]
    };
  },
  computed: {
    wizardDescription: function () {
      if (typeof this.wizardSteps[this.currentWizardStep] !== "undefined") {
        return this.wizardSteps[this.currentWizardStep].description;
      }

      return "";
    },
    wizardTitle: function () {
      if (typeof this.wizardSteps[this.currentWizardStep] !== "undefined") {
        return this.wizardSteps[this.currentWizardStep].title;
      }

      return "";
    }
  },
  watch: {
    selectedPrimaryCollection() {
      this.getCollectionFields();
    }
  },
  mounted: function () {
    const self = this;

    // console.log("PARAMS", self.$route.params);

    ApiBuilder.getCollections().then(function (collections) {
      //   console.log(collections);

      self.collections = collections;

      ApiBuilder.getCollectionFields;

      if (self.$route.params.endpoint !== "") {
        ApiBuilder.get(self.$route.params.endpoint, true).then(function (api) {
          self.api = api;
          self.selectedPrimaryCollection = api.table;

          self.isLoading = false;
        });
      } else {
        self.selectedPrimaryCollection = self.selectedPrimaryCollection =
          collections[0];

        self.isLoading = false;
      }
    });
  },
  methods: {
    getCollectionFields: function () {
      const self = this;

      ApiBuilder.getCollectionFields(this.selectedPrimaryCollection).then(
        function (fields) {
          self.fields = fields;
          self.selectedPrimaryCollectionID = fields[0];
        }
      );
    },
    onBackButtonClick: function () {
      this.currentWizardStep -= 1;
    },
    onNextButtonClick: function () {
      this.currentWizardStep += 1;
    }
  }
};
</script>
