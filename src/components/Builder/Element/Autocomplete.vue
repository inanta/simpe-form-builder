<template>
  <div>
    <ns-autocomplete
      ref="autocomplete"
      :items="autocompleteItems"
      style="width: 100%"
      @item-selected="onAutocompleteItemSelected"
      @keyup="onAutocompleteKeyUp"
    >
      <template #item="{ item }">
        <div>
          <div class="text-md">
            <b>{{ item.label }}</b>
          </div>
          <div class="text-md">
            {{ item.description }}
          </div>
        </div>
      </template>
    </ns-autocomplete>
    <ns-progress-bar
      v-if="isLoading"
      height="0.3rem"
      class="!rounded-none !border-0"
    ></ns-progress-bar>
  </div>
</template>

<script>
import NsAutocomplete from "@/components/NS/NsAutocomplete.vue";
import NsProgressBar from "@/components/NS/NsProgressBar.vue";

import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions";
import elementPanelList from "@/assets/js/builder/variables/elementPanelList.js";
import AppBuilder from "@/assets/js/AppBuilder.js";

export default {
  components: {
    NsAutocomplete,
    NsProgressBar
  },
  props: {
    label: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    autocompleteSource: {
      type: Object,
      default: function () {
        return {};
      }
    },
    value: {
      type: [String, Object],
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {
      autocompleteItems: [],
      keyUpTimeoutHandler: null,
      isLoading: false
    };
  },
  mounted: function () {},
  methods: {
    onAutocompleteKeyUp: function (event) {
      const self = this;

      if (self.keyUpTimeoutHandler !== null) {
        clearTimeout(self.keyUpTimeoutHandler);
      }

      self.isLoading = true;

      self.keyUpTimeoutHandler = setTimeout(function () {
        self.keyUpTimeoutHandler = null;

        if (self.autocompleteSource.source === "db") {
          const columns = [];

          columns.push(self.autocompleteSource.label_column);
          columns.push(self.autocompleteSource.value_column);

          AppBuilder.data({
            table: self.autocompleteSource.table,
            columns: columns,
            filters: {
              operator: "and",
              conditions: [
                {
                  field: self.autocompleteSource.label_column,
                  condition: "contains",
                  value: event.target.value
                }
              ]
            },
            sort: self.autocompleteSource.label_column,
            limit: 5
          }).then(function (response) {
            self.autocompleteItems.splice(0);

            for (let index = 0; index < response.records.length; index++) {
              const item = response.records[index];

              self.autocompleteItems.push({
                label: item[self.autocompleteSource.label_column],
                value: item[self.autocompleteSource.value_column]
              });
            }

            self.isLoading = false;
          });
        } else if (self.autocompleteSource.source === "api") {
          fetch(
            self.autocompleteSource.URL +
              "?" +
              self.autocompleteSource.fields.search_parameter +
              "=" +
              event.target.value
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (response) {
              if (!response.error) {
                self.autocompleteItems.splice(0);

                for (let index = 0; index < response.results.length; index++) {
                  const item = response.results[index];

                  self.autocompleteItems.push({
                    label: item[self.autocompleteSource.label_property],
                    value: item[self.autocompleteSource.value_property],
                    description:
                      item[self.autocompleteSource.fields.description_property]
                  });
                }
              }

              self.isLoading = false;
            });
          ////
        }
      }, 250);
    },
    onAutocompleteItemSelected: function (event) {
      this.$emit("input", {
        target: {
          name: this.name,
          value: event.value
        }
      });
    }
  }
};

elementPanelList.addElement(
  "general",
  "Autocomplete",
  "Autocomplete",
  "autocomplete",
  "mdi mdi-list-box"
);

fieldProperties["autocomplete"] = {
  label: {
    label: "Label"
  },
  name: {
    label: "Name"
  },
  "autocomplete-source": {
    label: "Items"
  }
};

fieldPropertyOptions.addOption(
  "autocomplete-source",
  "FieldPropertyValueCollection",
  {
    apiEndpointAdditionalFields: [
      {
        label: "Description Property",
        name: "description_property"
      },
      {
        label: "Search Parameter",
        name: "search_parameter"
      }
    ]
  },
  ["autocomplete"]
);
</script>
