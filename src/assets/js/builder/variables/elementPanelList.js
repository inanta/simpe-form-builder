export default {
  addElement: function (group, content, name, tag, icon, sort = 0) {
    this.elements[group].push({
      content: content,
      icon: icon,
      name: name,
      sort: sort,
      tag: tag
    });
  },
  getElement(tag) {
    for (const key in this.elements) {
      if (Object.hasOwnProperty.call(this.elements, key)) {
        const group = this.elements[key];

        for (let index = 0; index < group.length; index++) {
          const element = group[index];

          if (element.tag === tag) {
            return element;
          } else if (
            typeof element.tags !== "undefined" &&
            element.tags.length > 0 &&
            element.tags.includes(tag)
          ) {
            return element;
          }
        }
      }
    }

    return false;
  },
  getElements: function (group = "general") {
    return this.elements[group];
  },
  elements: {
    general: [
      {
        content: "",
        icon: "mdi mdi-form-textbox",
        name: "Input",
        sort: 0,
        tag: "input"
      },
      {
        content: "",
        icon: "mdi mdi-form-select",
        name: "Drop Down",
        sort: 0,
        tag: "select"
      },
      {
        content: "",
        icon: "mdi mdi-form-textarea",
        name: "Multiline Text Box",
        sort: 0,
        tag: "textarea"
      },
      {
        content: "Heading",
        icon: "mdi mdi-format-title",
        name: "Heading",
        sort: 0,
        tag: "h1",
        tags: ["h1", "h2", "h3", "h4", "h5", "h6"]
      },
      {
        content: "",
        icon: "mdi mdi-minus",
        name: "Horizontal Line",
        sort: 0,
        tag: "hr"
      }
    ]
  }
};
