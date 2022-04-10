export interface TodoItemModel {
  id: string
  uid: string
  title: string
  description?: string
  notes?: string
  isCompleted: boolean
  dateCreated: string
  timeCreated: string
  timezoneCreated: string
  dateCompleted?: string
  timeCompleted?: string
  timezoneCompleted?: string
}

export interface TagModel {
  id: string
  name: string
  color: string
}

export interface UserModel {
  id: string
  uid: string
}

export { default as Tag } from './Tag'
export { default as TodoItem } from './TodoItem'
