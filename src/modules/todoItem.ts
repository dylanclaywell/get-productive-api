import { createModule, gql } from 'graphql-modules'

import { Resolvers } from '../generated/graphql'
import { Tag, TodoItem } from '../models'

const resolvers: Resolvers = {
  TodoItem: {
    isCompleted: (todoItem) => Boolean(todoItem.isCompleted),
    dateCompleted: (todoItem) =>
      todoItem.dateCompleted &&
      todoItem.timeCompleted &&
      todoItem.timezoneCompleted
        ? {
            date: todoItem.dateCompleted,
            time: todoItem.timeCompleted,
            timezone: todoItem.timezoneCompleted,
          }
        : null,
    dateCreated: (todoItem) => ({
      date: todoItem.dateCreated,
      time: todoItem.timeCreated,
      timezone: todoItem.timezoneCreated,
    }),
    tags: async (todoItem, {}, { uid }) => {
      const todoItems = await TodoItem.find({
        id: todoItem.id,
        uid,
      })

      if (!todoItems.length) {
        return []
      }

      const item = todoItems[0]

      const tags = []

      for (const tag of item.tags ?? []) {
        const foundTag = (await Tag.find({ id: tag.id, uid }))[0]

        if (foundTag) {
          tags.push(foundTag)
        }
      }

      return tags
    },
  },
  Query: {
    todoItem: async (root, { id }, { uid }) => {
      return (await TodoItem.find({ id, uid }))[0]
    },
    todoItems: async (root, { input }, { uid }) => {
      const {
        dateCompleted,
        dateCreated,
        description,
        filters,
        id,
        isCompleted,
        notes,
        title,
      } = input

      return await TodoItem.find(
        input
          ? {
              uid,
              ...(dateCompleted && {
                dateCompleted: dateCompleted.date ?? undefined,
                timeCompleted: dateCompleted.time ?? undefined,
                timezoneCompleted: dateCompleted.timezone ?? undefined,
              }),
              ...(dateCreated && {
                dateCreated: dateCreated.date ?? undefined,
                timeCreated: dateCreated.time ?? undefined,
                timezoneCreated: dateCreated.timezone ?? undefined,
              }),
              ...(description && { description }),
              ...(id && { id }),
              ...(isCompleted !== null &&
                isCompleted !== undefined && { isCompleted }),
              ...(notes && { notes }),
              ...(title && { title }),
              overrideIncompleteItems:
                filters?.overrideIncompleteItems ?? false,
            }
          : { uid }
      )
    },
  },
  Mutation: {
    createTodoItem: async (root, { input }, { uid }) => {
      const id = await TodoItem.create({
        uid,
        title: input.title,
        dateCreated: input.dateCreated.date,
        timeCreated: input.dateCreated.time,
        timezoneCreated: input.dateCreated.timezone,
      })

      return (await TodoItem.find({ id, uid }))[0]
    },
    deleteTodoItem: async (root, { id }, { uid }) => {
      const todoItem = (await TodoItem.find({ id, uid }))?.[0]

      if (!todoItem) {
        throw new Error('Todo item does not exist')
      }

      if (uid !== todoItem.uid) {
        throw new Error('User does not own todo item')
      }

      await TodoItem.delete({ id })

      return id
    },
    updateTodoItem: async (root, { input }, { uid }) => {
      const {
        dateCompleted,
        dateCreated,
        description,
        id,
        isCompleted,
        notes,
        title,
      } = input
      const todoItem = (await TodoItem.find({ id: input.id, uid }))?.[0]

      if (!todoItem) {
        throw new Error('Todo item does not exist')
      }

      if (uid !== todoItem.uid) {
        throw new Error('User does not own todo item')
      }

      const updateKeys = [
        'dateCompleted',
        'dateCreated',
        'description',
        'id',
        'isCompleted',
        'notes',
        'title',
        'tags',
      ] as const

      const mappedTodoItem = todoItem

      for (const key of updateKeys) {
        const value = input[key]
        if (value !== undefined && value !== null) {
          // Lots of type hacks, probably need to fix this at some point
          if (key === 'dateCompleted') {
            mappedTodoItem.dateCompleted = input.dateCompleted!.date
            mappedTodoItem.timeCompleted = input.dateCompleted!.time
            mappedTodoItem.timezoneCompleted = input.dateCompleted!.timezone
          } else if (key === 'dateCreated') {
            mappedTodoItem.dateCreated = input.dateCreated!.date
            mappedTodoItem.timeCreated = input.dateCreated!.time
            mappedTodoItem.timezoneCreated = input.dateCreated!.timezone
          } else {
            ;(mappedTodoItem[key] as any) = value
          }
        }

        if (value === null) {
          delete mappedTodoItem[key]
        }
      }

      await TodoItem.update({
        ...todoItem,
        ...(dateCompleted && {
          dateCompleted: dateCompleted.date,
          timeCompleted: dateCompleted.time,
          timezoneCompleted: dateCompleted.timezone,
        }),
        ...(dateCreated && {
          dateCreated: dateCreated.date ?? undefined,
          timeCreated: dateCreated.time ?? undefined,
          timezoneCreated: dateCreated.timezone ?? undefined,
        }),
        ...(description && { description }),
        ...(id && { id }),
        ...(isCompleted !== null &&
          isCompleted !== undefined && { isCompleted }),
        ...(notes && { notes }),
        ...(title && { title }),
      })

      return (await TodoItem.find({ id: input.id, uid }))[0]
    },
  },
}

export default createModule({
  id: 'todoItem',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Date {
        date: String!
        time: String!
        timezone: String!
      }

      type TodoItem {
        id: ID!
        title: String!
        description: String
        notes: String
        isCompleted: Boolean!
        dateCreated: Date!
        dateCompleted: Date
        tags: [Tag!]!
      }

      input DateInput {
        date: String!
        time: String!
        timezone: String!
      }

      input GetDateInput {
        date: String
        time: String
        timezone: String
      }

      input Filters {
        overrideIncompleteItems: Boolean
      }

      input CreateTodoItemInput {
        title: String!
        dateCreated: DateInput!
      }

      input TagInput {
        id: ID!
      }

      input UpdateTodoItemInput {
        id: ID!
        title: String
        description: String
        notes: String
        isCompleted: Boolean
        dateCreated: DateInput
        dateCompleted: DateInput
        tags: [TagInput!]
      }

      input GetTodoItemsInput {
        id: ID
        title: String
        description: String
        notes: String
        isCompleted: Boolean
        dateCreated: GetDateInput
        dateCompleted: GetDateInput
        filters: Filters
      }

      extend type Query {
        todoItem(id: String!): TodoItem
        todoItems(input: GetTodoItemsInput!): [TodoItem!]!
      }

      extend type Mutation {
        createTodoItem(input: CreateTodoItemInput!): TodoItem!
        deleteTodoItem(id: String!): String!
        updateTodoItem(input: UpdateTodoItemInput!): TodoItem!
      }
    `,
  ],
  resolvers,
})
