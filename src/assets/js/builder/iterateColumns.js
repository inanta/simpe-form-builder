export default function (
  containers,
  callback,
  row_callback,
  container_callback
) {
  for (
    let container_index = 0;
    container_index < containers.length;
    container_index++
  ) {
    const container = containers[container_index];

    for (let row_index = 0; row_index < container.rows.length; row_index++) {
      const row = container.rows[row_index];

      for (
        let column_index = 0;
        column_index < row.columns.length;
        column_index++
      ) {
        const column = row.columns[column_index];

        callback(container_index, row_index, column_index, column, row);
      }

      if (typeof row_callback === "function") {
        row_callback(container_index, row_index, row);
      }
    }

    if (typeof container_callback === "function") {
      container_callback(container_index, container);
    }
  }
}
