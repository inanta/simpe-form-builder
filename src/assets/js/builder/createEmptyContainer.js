import createContainerRow from "@/assets/js/builder/createContainerRow.js";

export default function (container_name = "default") {
  return {
    name: container_name,
    rows: [
      createContainerRow(container_name, 1, [
        {
          type: "empty"
        }
      ])
    ]
  };
}
