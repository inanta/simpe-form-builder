export default function (name = "default", index = 1, columns = []) {
  return {
    columns: columns,
    grid: 0,
    index: index,
    name: name,
    showEmptyColumn: false,
    showNewEmptyRowPlaceholder: false
  };
}
