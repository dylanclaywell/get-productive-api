export default function nullable<Field>(field: Field) {
  if (field === null) {
    return null
  }

  return field
}
