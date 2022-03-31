export type TodoItemModel = {
  id: string
  title: string
  description: string | null
  notes: string | null
  isCompleted: number
  dateCreated: string
  timeCreated: string
  timezoneCreated: string
  dateCompleted: string | null
  timeCompleted: string | null
  timezoneCompleted: string | null
}
