export interface TodoItemTable {
  id: string
  title: string
  description: string | null
  notes: string | null
  is_completed: number
  date_created: string
  date_completed: string | null
}
