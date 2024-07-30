<template>
  <div v-if="items.length > 0" class="timeline">
    <ul>
      <li v-for="item in items" :key="item.title">
        <span>{{ item.title }}</span>
        <div class="content">
          <h3>{{ item.subtitle }}</h3>
          <p>
            {{ item.content }}
          </p>
        </div>
      </li>
    </ul>
  </div>
  <div v-else>{{ timelineEmptyPlaceholder }}</div>
</template>

<script>
import FieldProperties from "@/assets/js/builder/FieldProperties.js";
import ElementPanelList from "@/assets/js/builder/ElementPanelList.js";

export default {
  components: {},
  props: {
    label: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    timelineSource: {
      type: [String, Object],
      default: function () {
        return {};
      }
    },
    timelineEndpointHttpMethod: {
      type: String,
      default: "GET"
    },
    timelineJsonPath: {
      type: String,
      default: ""
    },
    timelineTitleProperty: {
      type: String,
      default: ""
    },
    timelineSubtitleProperty: {
      type: String,
      default: ""
    },
    timelineContentProperty: {
      type: String,
      default: ""
    },
    timelineEmptyPlaceholder: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    }
  },
  emits: ["input"],
  data: function () {
    return {
      items: [],
      isLoading: true
    };
  },
  mounted: function () {
    this.reloadData();
  },
  methods: {
    reloadData: async function () {
      const self = this;
      console.log(
        "RELOAD DATA",
        self.timelineSource,
        self.timelineTitleProperty,
        self.timelineSubtitleProperty,
        self.timelineContentProperty
      );

      let data = {
        url: window.location.href
      };

      let url = self.timelineSource;

      if (self.timelineEndpointHttpMethod === "GET") {
        data = new URLSearchParams(data);

        url += "?" + data;
      }

      fetch(url, {
        data: data,
        method: self.timelineEndpointHttpMethod
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          if (self.timelineJsonPath !== "") {
            const paths = self.timelineJsonPath.split(".");

            for (let index = 0; index < paths.length; index++) {
              const path = paths[index];

              response = response[path];
            }
          }

          if (Array.isArray(response)) {
            self.items = response;
          }

          self.isLoading = false;
        });
    }
  }
};

ElementPanelList.addElement(
  "general",
  "Timeline",
  "Timeline",
  "timeline",
  "mdi mdi-timeline"
);

FieldProperties["timeline"] = {
  label: {
    label: "Label"
  },
  "timeline-source": {
    label: "API Endpoint"
  },
  "timeline-endpoint-http-method": {
    label: "Method"
  },
  "timeline-json-path": {
    label: "JSON Path"
  },
  "timeline-title-property": {
    label: "Title Property"
  },
  "timeline-subtitle-property": {
    label: "Sub Title Property"
  },
  "timeline-content-property": {
    label: "Content Property"
  },
  "timeline-empty-placeholder": {
    label: "Empty Placeholder"
  }
};
</script>

<style scoped>
.timeline {
  /* width: 800px; */
  /* background-color: #072736; */
  color: #fff;
  padding: 30px 20px;
  /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); */
}
.timeline ul {
  @apply border-l border-primary;

  list-style-type: none;
  /* border-left: 2px solid #094a68; */
  padding: 10px 5px;
}
.timeline ul li {
  /* @apply ml-2; */
  border-radius: 2px;
  margin-left: 5px;
  padding: 20px 20px;
  position: relative;
  cursor: pointer;
  transition: 0.5s;
}
.timeline ul li span {
  @apply bg-primary;

  display: inline-block;
  /* background-color: #1685b8; */
  border-radius: 25px;
  padding: 2px 5px;
  font-size: 15px;
  text-align: center;
}
.timeline ul li .content h3 {
  @apply font-semibold text-primary;

  /* color: #34ace0; */
  font-size: 17px;
  padding-top: 5px;
}
.timeline ul li .content p {
  @apply text-dark-gray;

  padding: 5px 0px 15px 0px;
  font-size: 15px;
}
.timeline ul li:before {
  @apply bg-dark-gray;

  display: block;
  position: absolute;
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  left: -15px;
  top: 28px;
  transition: 0.5s;
}

.timeline ul li:first-child::before {
  @apply bg-primary;

  animation: flash; /* referring directly to the animation's @keyframe declaration */
  animation-iteration-count: infinite;
  animation-duration: 2s; /* don't forget to set a duration! */
}

.timeline ul li:hover {
  @apply bg-primary;
}
.timeline ul li:hover span {
  @apply bg-white text-primary;
}
.timeline ul li:hover .content h3 {
  @apply text-on-primary;
}
.timeline ul li:hover .content p {
  @apply text-on-primary;
}
.timeline ul li:hover:before {
  @apply bg-primary shadow shadow-primary;
}
</style>
