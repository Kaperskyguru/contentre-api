/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** Time custom scalar type */
  Time: any;
};

export type Client = {
  __typename?: 'Client';
  authorsLink?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  updatedAt: Scalars['Time'];
  website?: Maybe<Scalars['String']>;
};

export type ClientFiltersInput = {
  terms?: InputMaybe<Scalars['String']>;
};

export type Content = {
  __typename?: 'Content';
  client?: Maybe<Client>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  excerpt: Scalars['String'];
  featuredImage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastUpdated?: Maybe<Scalars['Time']>;
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  topics?: Maybe<Array<Scalars['String']>>;
  type?: Maybe<ContentType>;
  updatedAt: Scalars['Time'];
  url: Scalars['String'];
  visibility: VisibilityType;
};

export type ContentFiltersInput = {
  terms?: InputMaybe<Scalars['String']>;
};

export type ContentType =
  | 'AUDIO'
  | 'TEXT'
  | 'VIDEO';

export type CreateClientInput = {
  authorsLink?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  website?: InputMaybe<Scalars['String']>;
};

export type CreateContentInput = {
  clientId: Scalars['ID'];
  url?: InputMaybe<Scalars['String']>;
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type LoginUserInput = {
  email: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  remember?: InputMaybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: User;
  createClient: Client;
  createContent?: Maybe<Content>;
  createUser: User;
  deleteClient: Scalars['Boolean'];
  deleteContent: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  forceUserToVerifyPhoneNumber: Scalars['Boolean'];
  loginUser: User;
  logoutUser: Scalars['Boolean'];
  resetPassword: User;
  sendEmailCode: Scalars['Boolean'];
  sendPasswordResetCode: Scalars['Boolean'];
  sendPhoneCode: Scalars['Boolean'];
  updateClient: Client;
  useEmailCode: User;
  usePasswordResetCode: User;
  usePhoneCode: User;
  userSwitchedLanguage: Scalars['Boolean'];
  version: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationCreateContentArgs = {
  input: CreateContentInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteContentArgs = {
  id: Scalars['ID'];
};


export type MutationForceUserToVerifyPhoneNumberArgs = {
  token: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationLoginUserArgs = {
  data: LoginUserInput;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
};


export type MutationSendEmailCodeArgs = {
  email: Scalars['String'];
};


export type MutationSendPasswordResetCodeArgs = {
  email: Scalars['String'];
};


export type MutationSendPhoneCodeArgs = {
  phoneCode: Scalars['String'];
  phoneNumber: Scalars['String'];
};


export type MutationUpdateClientArgs = {
  id: Scalars['ID'];
  input: UpdateClientInput;
};


export type MutationUseEmailCodeArgs = {
  code: Scalars['String'];
};


export type MutationUsePasswordResetCodeArgs = {
  code: Scalars['String'];
  email: Scalars['String'];
};


export type MutationUsePhoneCodeArgs = {
  code: Scalars['String'];
};


export type MutationUserSwitchedLanguageArgs = {
  newLanguage: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  findUser?: Maybe<User>;
  getClient: Client;
  getClients: Array<Client>;
  getContent: Content;
  getContents: Array<Content>;
  getCurrentUser?: Maybe<User>;
  getVersion: Scalars['String'];
};


export type QueryFindUserArgs = {
  uuid: Scalars['String'];
};


export type QueryGetClientArgs = {
  id: Scalars['ID'];
};


export type QueryGetClientsArgs = {
  filters?: InputMaybe<ClientFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetContentArgs = {
  id: Scalars['ID'];
};


export type QueryGetContentsArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type RegisterUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateClientInput = {
  authorsLink: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  avatarURL?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  email: Scalars['String'];
  emailConfirmed: Scalars['Boolean'];
  id: Scalars['ID'];
  lastActivityAt: Scalars['Time'];
  name: Scalars['String'];
  phoneCode?: Maybe<Scalars['String']>;
  phoneConfirmed: Scalars['Boolean'];
  phoneNumber?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  username?: Maybe<Scalars['String']>;
};

export type VisibilityType =
  | 'DELETED'
  | 'DRAFT'
  | 'PUBLISHED';



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
  Client: ResolverTypeWrapper<Client>;
  ClientFiltersInput: ClientFiltersInput;
  Content: ResolverTypeWrapper<Content>;
  ContentFiltersInput: ContentFiltersInput;
  ContentType: ContentType;
  CreateClientInput: CreateClientInput;
  CreateContentInput: CreateContentInput;
  CreateUserInput: CreateUserInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LoginUserInput: LoginUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserInput: RegisterUserInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  UpdateClientInput: UpdateClientInput;
  User: ResolverTypeWrapper<User>;
  VisibilityType: VisibilityType;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Client: Client;
  ClientFiltersInput: ClientFiltersInput;
  Content: Content;
  ContentFiltersInput: ContentFiltersInput;
  CreateClientInput: CreateClientInput;
  CreateContentInput: CreateContentInput;
  CreateUserInput: CreateUserInput;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  LoginUserInput: LoginUserInput;
  Mutation: {};
  Query: {};
  RegisterUserInput: RegisterUserInput;
  String: Scalars['String'];
  Time: Scalars['Time'];
  UpdateClientInput: UpdateClientInput;
  User: User;
};

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = {
  authorsLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Content'] = ResolversParentTypes['Content']> = {
  client?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  excerpt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  featuredImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastUpdated?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  topics?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['ContentType']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['VisibilityType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changePassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>>;
  createClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationCreateClientArgs, 'input'>>;
  createContent?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType, RequireFields<MutationCreateContentArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteClient?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteClientArgs, 'id'>>;
  deleteContent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContentArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  forceUserToVerifyPhoneNumber?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationForceUserToVerifyPhoneNumberArgs, 'token' | 'userId'>>;
  loginUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'data'>>;
  logoutUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  resetPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'newPassword'>>;
  sendEmailCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendEmailCodeArgs, 'email'>>;
  sendPasswordResetCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPasswordResetCodeArgs, 'email'>>;
  sendPhoneCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPhoneCodeArgs, 'phoneCode' | 'phoneNumber'>>;
  updateClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationUpdateClientArgs, 'id' | 'input'>>;
  useEmailCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUseEmailCodeArgs, 'code'>>;
  usePasswordResetCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUsePasswordResetCodeArgs, 'code' | 'email'>>;
  usePhoneCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUsePhoneCodeArgs, 'code'>>;
  userSwitchedLanguage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUserSwitchedLanguageArgs, 'newLanguage'>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  findUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindUserArgs, 'uuid'>>;
  getClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<QueryGetClientArgs, 'id'>>;
  getClients?: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryGetClientsArgs, never>>;
  getContent?: Resolver<ResolversTypes['Content'], ParentType, ContextType, RequireFields<QueryGetContentArgs, 'id'>>;
  getContents?: Resolver<Array<ResolversTypes['Content']>, ParentType, ContextType, RequireFields<QueryGetContentsArgs, never>>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailConfirmed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastActivityAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneConfirmed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Client?: ClientResolvers<ContextType>;
  Content?: ContentResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Time?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

