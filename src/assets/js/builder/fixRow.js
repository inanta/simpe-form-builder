export default function fixRow(rows) {
  let row_counter = 0;

  for (let row_index = 0; row_index < rows.length; row_index++) {
    const row = rows[row_counter];

    if (
      row.columns.length === 0 ||
      (row.columns.length === 1 && row.columns[0].type === "empty")
    ) {
      rows.splice(row_counter, 1);

      continue;
    }

    for (
      let column_index = 0;
      column_index < row.columns.length;
      column_index++
    ) {
      const column = row.columns[column_index];

      column.column = column_index;
      column.row = row_counter;
    }

    row.grid = row.columns.length - 1;
    row_counter++;
  }
}
