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
  createUser: User;
  deleteUser: Scalars['Boolean'];
  forceUserToVerifyPhoneNumber: Scalars['Boolean'];
  loginUser: User;
  logoutUser: Scalars['Boolean'];
  resetPassword: User;
  sendEmailCode: Scalars['Boolean'];
  sendPasswordResetCode: Scalars['Boolean'];
  sendPhoneCode: Scalars['Boolean'];
  useEmailCode: User;
  userSwitchedLanguage: Scalars['Boolean'];
  version: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
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


export type MutationUseEmailCodeArgs = {
  code: Scalars['String'];
};


export type MutationUserSwitchedLanguageArgs = {
  newLanguage: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  findUser?: Maybe<User>;
  getCurrentUser?: Maybe<User>;
  getVersion: Scalars['String'];
};


export type QueryFindUserArgs = {
  uuid: Scalars['String'];
};

export type RegisterUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type SignedUpThrough =
  | 'AIRBANK'
  | 'GOOGLE';

export type User = {
  __typename?: 'User';
  avatarURL?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  email: Scalars['String'];
  id: Scalars['ID'];
  lastActivityAt: Scalars['Time'];
  name: Scalars['String'];
  phoneCode?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
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
  CreateUserInput: CreateUserInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LoginUserInput: LoginUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserInput: RegisterUserInput;
  SignedUpThrough: SignedUpThrough;
  String: ResolverTypeWrapper<Scalars['String']>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateUserInput: CreateUserInput;
  ID: Scalars['ID'];
  JSON: Scalars['JSON'];
  LoginUserInput: LoginUserInput;
  Mutation: {};
  Query: {};
  RegisterUserInput: RegisterUserInput;
  String: Scalars['String'];
  Time: Scalars['Time'];
  User: User;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changePassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  forceUserToVerifyPhoneNumber?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationForceUserToVerifyPhoneNumberArgs, 'token' | 'userId'>>;
  loginUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'data'>>;
  logoutUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  resetPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'newPassword'>>;
  sendEmailCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendEmailCodeArgs, 'email'>>;
  sendPasswordResetCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPasswordResetCodeArgs, 'email'>>;
  sendPhoneCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPhoneCodeArgs, 'phoneCode' | 'phoneNumber'>>;
  useEmailCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUseEmailCodeArgs, 'code'>>;
  userSwitchedLanguage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUserSwitchedLanguageArgs, 'newLanguage'>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  findUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryFindUserArgs, 'uuid'>>;
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
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastActivityAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Time?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

