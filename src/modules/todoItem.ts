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
    todoItems: async () => {
      return await TodoItem.find()
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
      await TodoItem.update(input)

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
        dateCompleted: String
      }

      input CreateTodoItemInput {
        title: String!
      }

      input UpdateTodoItemInput {
        id: ID!
        title: String
        description: String
        notes: String
        isCompleted: Boolean
        dateCreated: String
        dateCompleted: String
      }

      extend type Query {
        todoItem(id: String!): TodoItem
        todoItems: [TodoItem!]!
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
