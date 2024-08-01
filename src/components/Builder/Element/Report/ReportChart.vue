<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import fieldProperties from "@/assets/js/builder/variables/fieldProperties.js";
import fieldPropertyOptions from "@/assets/js/builder/variables/fieldPropertyOptions.js";

import delay from "@/assets/js/delay.js";

let chart_object = [];

export default {
  props: {
    filters: {
      type: Object,
      default: function () {
        return {};
      }
    },
    reportChartDatasets: {
      type: Array,
      default: function () {
        return [];
      }
    },
    reportChartTitle: {
      type: String,
      default: ""
    },
    reportChartType: {
      type: String,
      default: "pie"
    },
    name: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {
      animating: true,
      // chartObject: null,
      items: [],
      uid: ""
    };
  },
  computed: {},
  watch: {
    report: function () {
      this.initialize();
    },
    reportChartDatasets: {
      handler: function () {
        this.initialize();
      },
      deep: true
    },
    reportChartTitle: function () {
      this.initialize();
    },
    reportChartType: function () {
      this.initialize();
    }
  },
  mounted: function () {
    this.uid = Date.now() + "_" + Math.floor(Math.random() * 1000);

    this.initialize();
  },
  methods: {
    initialize: function () {
      const self = this;

      self.animating = true;

      console.log("INIT");

      delay(
        "fetch_chart_" + this.uid,
        function () {
          if (typeof self.reportChartDatasets !== "undefined") {
            let datasets = [];
            let labels = [];

            for (
              let index = 0;
              index < self.reportChartDatasets.length;
              index++
            ) {
              const dataset =
                typeof self.reportChartDatasets[index].value !== "undefined"
                  ? JSON.parse(
                      JSON.stringify(self.reportChartDatasets[index].value)
                    )
                  : JSON.parse(JSON.stringify(self.reportChartDatasets[index]));

              if (index === 0) {
                labels = dataset.map(function (item) {
                  return item.label;
                });
              }

              datasets.push({
                name: "AXXX",
                data: dataset.map(function (item) {
                  return item.value;
                })
              });
            }

            console.log("LABELS", labels);
            console.log("DATASET", datasets);

            if (typeof chart_object[self.uid] !== "undefined") {
              chart_object[self.uid].destroy();

              self.$nextTick(function () {
                chart_object[self.uid] = new Chart(self.$refs.chart, {
                  type: self.reportChartType,
                  data: {
                    labels: labels,
                    datasets: datasets
                  }
                });
              });
            } else {
              self.$nextTick(function () {
                chart_object[self.uid] = new Chart(self.$refs.chart, {
                  type: self.reportChartType,
                  data: {
                    labels: labels,
                    datasets: datasets
                  }
                });
              });
            }
          }
        },
        500
      );
    }
  }
};

fieldProperties["report-chart"] = {
  name: {
    label: "Name"
  },
  label: {
    label: "Label"
  },
  "report-chart-type": {
    label: "Type"
  },
  "report-chart-title": {
    label: "Title"
  },
  "report-chart-datasets": {
    label: "Datasets"
  }
};

fieldPropertyOptions.addOption("report-chart-type", [
  {
    name: "Bar",
    value: "bar"
  },
  {
    name: "Bubble",
    value: "bubble"
  },
  {
    name: "Doughnut",
    value: "doughnut"
  },
  {
    name: "Line",
    value: "line"
  },
  {
    name: "Polar Area",
    value: "polarArea"
  },
  {
    name: "Radar",
    value: "radar"
  },
  {
    name: "Scatter",
    value: "scatter"
  },

  {
    name: "Pie",
    value: "pie"
  }
]);

fieldPropertyOptions.addOption(
  "report-chart-datasets",
  "FieldPropertyValueCollections"
);
</script>

<style scoped></style>
