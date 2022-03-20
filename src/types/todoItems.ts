export interface TodoItem {
  id: string
  title: string
  description: string | null
  notes: string | null
  isCompleted: number
  dateCreated: string
  dateCompleted: string | null
}
