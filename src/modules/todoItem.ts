import { createModule, gql } from 'graphql-modules'

import { Resolvers, DateInput } from '../generated/graphql'
import { Tag, TodoItem } from '../models'
import nullable from '../utils/nullable'

function nullableDateInput(
  dateInput: DateInput | null | undefined,
  key: keyof DateInput
) {
  if (dateInput === null) {
    return null
  }

  if (dateInput?.[key] === null) {
    return null
  }

  return dateInput?.[key]
}

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
    tags: (todoItem) => {
      return Tag.findByTodoItemId(todoItem.id)
    },
  },
  Query: {
    todoItem: async (root, { id }) => {
      return (await TodoItem.find({ id }))[0]
    },
    todoItems: async (root, { input }) => {
      return await TodoItem.find(
        input
          ? {
              dateCompleted: input.dateCompleted?.date ?? undefined,
              timeCompleted: input.dateCompleted?.time ?? undefined,
              timezoneCompleted: input.dateCompleted?.timezone ?? undefined,
              dateCreated: input.dateCreated?.date ?? undefined,
              timeCreated: input.dateCreated?.time ?? undefined,
              timezoneCreated: input.dateCreated?.timezone ?? undefined,
              description: input.description ?? undefined,
              id: input.id ?? undefined,
              isCompleted:
                input.isCompleted === null || input.isCompleted === undefined
                  ? undefined
                  : input.isCompleted
                  ? 1
                  : 0,
              notes: input.notes ?? undefined,
              title: input.title ?? undefined,
              overrideIncompleteItems:
                input.filters?.overrideIncompleteItems ?? false,
            }
          : undefined
      )
    },
  },
  Mutation: {
    createTodoItem: async (root, { input }) => {
      const id = await TodoItem.create({
        title: input.title,
        dateCreated: input.dateCreated.date,
        timeCreated: input.dateCreated.time,
        timezoneCreated: input.dateCreated.timezone,
      })

      return (await TodoItem.find({ id }))[0]
    },
    deleteTodoItem: async (root, { id }) => {
      await TodoItem.delete({ id })

      return id
    },
    updateTodoItem: async (root, { input }) => {
      await TodoItem.update({
        description: nullable(input.description),
        id: input.id,
        isCompleted:
          input.isCompleted !== undefined
            ? input.isCompleted
              ? 1
              : 0
            : undefined,
        notes: nullable(input.notes),
        dateCompleted: nullableDateInput(input.dateCompleted, 'date'),
        timeCompleted: nullableDateInput(input.dateCompleted, 'time'),
        timezoneCompleted: nullableDateInput(input.dateCompleted, 'timezone'),
        dateCreated: input.dateCreated?.date,
        timeCreated: input.dateCreated?.time,
        timezoneCreated: input.dateCreated?.timezone,
      })

      return (await TodoItem.find({ id: input.id }))[0]
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

      input UpdateTodoItemInput {
        id: ID!
        title: String
        description: String
        notes: String
        isCompleted: Boolean
        dateCreated: DateInput
        dateCompleted: DateInput
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
        todoItems(input: GetTodoItemsInput): [TodoItem!]!
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
