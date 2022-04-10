export interface TodoItemModel {
  id: string
  userId: string
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
  userId: string
  name: string
  color: string
}

export interface UserModel {
  id: string
  uid: string
}

export { default as Tag } from './Tag'
export { default as User } from './User'
export { default as TodoItem } from './TodoItem'
