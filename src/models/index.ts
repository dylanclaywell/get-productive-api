export interface TodoItemModel {
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

export interface TagModel {
  id: string
  name: string
  color: string
}

export { default as Tag } from './Tag'
export { default as TodoItem } from './TodoItem'
