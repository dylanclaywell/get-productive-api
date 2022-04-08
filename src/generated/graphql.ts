import { GraphQLResolveInfo } from 'graphql';
import { TodoItemModel, TagModel } from '../models';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateTodoItemInput = {
  dateCreated: DateInput;
  title: Scalars['String'];
};

export type Date = {
  __typename?: 'Date';
  date: Scalars['String'];
  time: Scalars['String'];
  timezone: Scalars['String'];
};

export type DateInput = {
  date: Scalars['String'];
  time: Scalars['String'];
  timezone: Scalars['String'];
};

export type Filters = {
  overrideIncompleteItems?: InputMaybe<Scalars['Boolean']>;
};

export type GetDateInput = {
  date?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
};

export type GetTodoItemsInput = {
  dateCompleted?: InputMaybe<GetDateInput>;
  dateCreated?: InputMaybe<GetDateInput>;
  description?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Filters>;
  id?: InputMaybe<Scalars['ID']>;
  isCompleted?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createTag: Tag;
  createTodoItem: TodoItem;
  deleteTodoItem: Scalars['String'];
  updateTodoItem: TodoItem;
};


export type MutationCreateTagArgs = {
  color: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreateTodoItemArgs = {
  input: CreateTodoItemInput;
};


export type MutationDeleteTodoItemArgs = {
  id: Scalars['String'];
};


export type MutationUpdateTodoItemArgs = {
  input: UpdateTodoItemInput;
};

export type Query = {
  __typename?: 'Query';
  tags: Array<Tag>;
  todoItem?: Maybe<TodoItem>;
  todoItems: Array<TodoItem>;
};


export type QueryTodoItemArgs = {
  id: Scalars['String'];
};


export type QueryTodoItemsArgs = {
  input?: InputMaybe<GetTodoItemsInput>;
};

export type Tag = {
  __typename?: 'Tag';
  color: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type TodoItem = {
  __typename?: 'TodoItem';
  dateCompleted?: Maybe<Date>;
  dateCreated: Date;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isCompleted: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type UpdateTodoItemInput = {
  dateCompleted?: InputMaybe<DateInput>;
  dateCreated?: InputMaybe<DateInput>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isCompleted?: InputMaybe<Scalars['Boolean']>;
  notes?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateTodoItemInput: CreateTodoItemInput;
  Date: ResolverTypeWrapper<Date>;
  DateInput: DateInput;
  Filters: Filters;
  GetDateInput: GetDateInput;
  GetTodoItemsInput: GetTodoItemsInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tag: ResolverTypeWrapper<TagModel>;
  TodoItem: ResolverTypeWrapper<TodoItemModel>;
  UpdateTodoItemInput: UpdateTodoItemInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateTodoItemInput: CreateTodoItemInput;
  Date: Date;
  DateInput: DateInput;
  Filters: Filters;
  GetDateInput: GetDateInput;
  GetTodoItemsInput: GetTodoItemsInput;
  ID: Scalars['ID'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  Tag: TagModel;
  TodoItem: TodoItemModel;
  UpdateTodoItemInput: UpdateTodoItemInput;
};

export type DateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Date'] = ResolversParentTypes['Date']> = {
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timezone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'color' | 'name'>>;
  createTodoItem?: Resolver<ResolversTypes['TodoItem'], ParentType, ContextType, RequireFields<MutationCreateTodoItemArgs, 'input'>>;
  deleteTodoItem?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationDeleteTodoItemArgs, 'id'>>;
  updateTodoItem?: Resolver<ResolversTypes['TodoItem'], ParentType, ContextType, RequireFields<MutationUpdateTodoItemArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  todoItem?: Resolver<Maybe<ResolversTypes['TodoItem']>, ParentType, ContextType, RequireFields<QueryTodoItemArgs, 'id'>>;
  todoItems?: Resolver<Array<ResolversTypes['TodoItem']>, ParentType, ContextType, Partial<QueryTodoItemsArgs>>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TodoItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['TodoItem'] = ResolversParentTypes['TodoItem']> = {
  dateCompleted?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  dateCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: DateResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TodoItem?: TodoItemResolvers<ContextType>;
};

