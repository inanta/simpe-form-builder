export default function (field_logics) {
  for (let index = 0; index < field_logics.length; index++) {
    field_logics[index]();
  }
}
