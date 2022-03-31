import { createModule, gql } from 'graphql-modules'

import { Resolvers } from '../generated/graphql'
import TodoItem from '../models/TodoItem'

const resolvers: Resolvers = {
  TodoItem: {
    isCompleted: (todoItem) => Boolean(todoItem.isCompleted),
  },
  Query: {
    todoItem: async (root, { id }) => {
      return (await TodoItem.find({ id }))[0]
    },
    todoItems: async (root, { input }) => {
      return await TodoItem.find(
        input
          ? {
              dateCompleted: input.dateCompleted?.date,
              timeCompleted: input.dateCompleted?.time,
              timezoneCompleted: input.dateCompleted?.timezone,
              dateCreated: input.dateCreated?.date,
              timeCreated: input.dateCreated?.time,
              timezoneCreated: input.dateCreated?.timezone,
              description: input.description ?? undefined,
              id: input.id ?? undefined,
              isCompleted: input.isCompleted ?? undefined,
              notes: input.notes ?? undefined,
              title: input.title ?? undefined,
            }
          : undefined
      )
    },
  },
  Mutation: {
    createTodoItem: async (root, { input }) => {
      const id = await TodoItem.create({ title: input.title })

      return (await TodoItem.find({ id }))[0]
    },
    deleteTodoItem: async (root, { id }) => {
      await TodoItem.delete({ id })

      return id
    },
    updateTodoItem: async (root, { input }) => {
      await TodoItem.update({
        description: input?.description,
        id: input?.id,
        isCompleted: input?.isCompleted ? 1 : 0,
        notes: input?.notes,
        dateCompleted: input?.dateCompleted?.date,
        timeCompleted: input?.dateCompleted?.time,
        timezoneCompleted: input?.dateCompleted?.timezone,
        dateCreated: input?.dateCreated?.date,
        timeCreated: input?.dateCreated?.time,
        timezoneCreated: input?.dateCreated?.timezone,
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
      type TodoItem {
        id: ID!
        title: String!
        description: String
        notes: String
        isCompleted: Boolean!
        dateCreated: String!
        timeCreated: String!
        timezoneCreated: String!
        dateCompleted: String
        timeCompleted: String
        timezoneCompleted: String
      }

      input DateInput {
        date: String!
        time: String!
        timezone: String!
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
        dateCreated: DateInput
        dateCompleted: DateInput
      }

      extend type Query {
        todoItem(id: String!): TodoItem
        todoItems(input: GetTodoItemsInput): [TodoItem!]!
      }

      extend type Mutation {
        createTodoItem(input: CreateTodoItemInput!): TodoItem
        deleteTodoItem(id: String!): String!
        updateTodoItem(input: UpdateTodoItemInput!): TodoItem!
      }
    `,
  ],
  resolvers,
})
