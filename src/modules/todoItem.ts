import { createModule, gql } from 'graphql-modules'
import TodoItem from '../models/TodoItem'
import { TodoItem as TodoItemTableType } from '../types/todoItems'

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

      extend type Query {
        todoItem(id: String!): TodoItem
        todoItems: [TodoItem!]!
      }

      extend type Mutation {
        createTodoItem(input: CreateTodoItemInput!): TodoItem
      }
    `,
  ],
  resolvers: {
    TodoItem: {
      isCompleted: (todoItem: TodoItemTableType) =>
        Boolean(todoItem.isCompleted),
    },
    Query: {
      todoItem: async (root: any, { id }: { id: string }) => {
        return (await TodoItem.find({ id }))[0]
      },
      todoItems: async () => {
        return await TodoItem.find()
      },
    },
    Mutation: {
      createTodoItem: async (
        root: any,
        { input }: { input: { title: string } }
      ) => {
        await TodoItem.create({ title: input.title })
      },
    },
  },
})
