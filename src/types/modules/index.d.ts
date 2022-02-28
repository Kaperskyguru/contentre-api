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

export type Category = {
  __typename?: 'Category';
  color?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['Time'];
};

export type CategoryFiltersInput = {
  terms?: InputMaybe<Scalars['String']>;
};

export type Client = {
  __typename?: 'Client';
  amount?: Maybe<Scalars['Float']>;
  createdAt: Scalars['Time'];
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  paymentType?: Maybe<PaymentType>;
  profile?: Maybe<Scalars['String']>;
  totalContents?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  user?: Maybe<User>;
  website?: Maybe<Scalars['String']>;
};

export type ClientFiltersInput = {
  terms?: InputMaybe<Scalars['String']>;
};

export type Content = {
  __typename?: 'Content';
  amount?: Maybe<Scalars['Float']>;
  category?: Maybe<Category>;
  client?: Maybe<Client>;
  comments?: Maybe<Scalars['Int']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  excerpt: Scalars['String'];
  featuredImage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  interactions?: Maybe<Scalars['Int']>;
  lastUpdated?: Maybe<Scalars['Time']>;
  likes?: Maybe<Scalars['Int']>;
  paymentType?: Maybe<PaymentType>;
  shares?: Maybe<Scalars['Int']>;
  tags?: Maybe<Scalars['JSON']>;
  title: Scalars['String'];
  topics?: Maybe<Array<Scalars['String']>>;
  type: ContentType;
  updatedAt: Scalars['Time'];
  url?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  visibility: VisibilityType;
};

export type ContentFiltersInput = {
  sortBy?: InputMaybe<Scalars['String']>;
  terms?: InputMaybe<Scalars['String']>;
};

export type ContentType =
  | 'AUDIO'
  | 'TEXT'
  | 'VIDEO';

export type CreateCategoryInput = {
  color?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateClientInput = {
  amount?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  paymentType?: InputMaybe<PaymentType>;
  profile?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type CreateContentInput = {
  amount?: InputMaybe<Scalars['Float']>;
  category?: InputMaybe<Scalars['String']>;
  clientId: Scalars['ID'];
  comments?: InputMaybe<Scalars['Int']>;
  content?: InputMaybe<Scalars['String']>;
  excerpt: Scalars['String'];
  likes?: InputMaybe<Scalars['Int']>;
  paymentType?: InputMaybe<PaymentType>;
  shares?: InputMaybe<Scalars['Int']>;
  tags?: InputMaybe<Scalars['JSON']>;
  title: Scalars['String'];
  url?: InputMaybe<Scalars['String']>;
};

export type CreatePortfolioInput = {
  description?: InputMaybe<Scalars['String']>;
  templateId?: InputMaybe<Scalars['ID']>;
  title: Scalars['String'];
  type?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type CreateProfileInput = {
  profileAvatar?: InputMaybe<Scalars['String']>;
  profileLink: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  referrer?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type IndexMetadataResponse = {
  __typename?: 'IndexMetadataResponse';
  commentPercent: Scalars['Float'];
  comments: Scalars['Float'];
  likePercent: Scalars['Float'];
  likes: Scalars['Float'];
  sharePercent: Scalars['Float'];
  shares: Scalars['Float'];
};

export type LoginUserInput = {
  email: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  remember?: InputMaybe<Scalars['Boolean']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: User;
  createCategory: Category;
  createClient: Client;
  createContent?: Maybe<Content>;
  createPortfolio?: Maybe<Portfolio>;
  createUser: User;
  deleteCategory: Scalars['Boolean'];
  deleteClient: Scalars['Boolean'];
  deleteContent: Scalars['Boolean'];
  deletePortfolio: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  loginUser: User;
  logoutUser: Scalars['Boolean'];
  resetPassword: User;
  sendEmailCode: Scalars['Boolean'];
  sendPasswordResetCode: Scalars['Boolean'];
  sendPhoneCode: Scalars['Boolean'];
  updateCategory: Category;
  updateClient: Client;
  updateContent: Content;
  updatePortfolio: Portfolio;
  updateUser: User;
  uploadContent: Content;
  useEmailCode: User;
  usePasswordResetCode: User;
  usePhoneCode: User;
  verifyUsername?: Maybe<Scalars['Boolean']>;
  version: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationCreateContentArgs = {
  input: CreateContentInput;
};


export type MutationCreatePortfolioArgs = {
  input: CreatePortfolioInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteContentArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePortfolioArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  feedback?: InputMaybe<Scalars['String']>;
  oldPassword: Scalars['String'];
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


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID'];
  input: CreateCategoryInput;
};


export type MutationUpdateClientArgs = {
  id: Scalars['ID'];
  input: UpdateClientInput;
};


export type MutationUpdateContentArgs = {
  id: Scalars['ID'];
  input: UpdateContentInput;
};


export type MutationUpdatePortfolioArgs = {
  id: Scalars['ID'];
  input: UpdatePortfolioInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUploadContentArgs = {
  input: UploadContentInput;
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


export type MutationVerifyUsernameArgs = {
  username: Scalars['String'];
};

export type PaymentType =
  | 'ARTICLE'
  | 'MONTHLY'
  | 'ONETIME';

export type Portfolio = {
  __typename?: 'Portfolio';
  createdAt: Scalars['Time'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  templateId: Scalars['ID'];
  title: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  url: Scalars['String'];
  userId?: Maybe<Scalars['ID']>;
};

export type PortfolioFiltersInput = {
  terms?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getCategories: Array<Category>;
  getCategory: Category;
  getClient: Client;
  getClients: Array<Client>;
  getContent: Content;
  getContents: Array<Content>;
  getCurrentUser?: Maybe<User>;
  getIndexMetadata: IndexMetadataResponse;
  getPortfolio: Portfolio;
  getPortfolios: Array<Portfolio>;
  getUser: User;
  getVersion: Scalars['String'];
};


export type QueryGetCategoriesArgs = {
  filters?: InputMaybe<CategoryFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetCategoryArgs = {
  id: Scalars['ID'];
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


export type QueryGetIndexMetadataArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
};


export type QueryGetPortfolioArgs = {
  id: Scalars['ID'];
};


export type QueryGetPortfoliosArgs = {
  filters?: InputMaybe<PortfolioFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetUserArgs = {
  uuid: Scalars['String'];
};

export type RegisterUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type SignedUpThrough =
  | 'CONTENTRE'
  | 'GOOGLE';

export type Tag = {
  __typename?: 'Tag';
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type UpdateClientInput = {
  amount?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  paymentType?: InputMaybe<PaymentType>;
  profile?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type UpdateContentInput = {
  clientId?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdatePortfolioInput = {
  description?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  avatarURL?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstname?: InputMaybe<Scalars['String']>;
  homeAddress?: InputMaybe<Scalars['String']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  lastname?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  portfolio?: InputMaybe<Scalars['String']>;
};

export type UploadContentInput = {
  url: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatarURL?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  clients?: Maybe<Array<Client>>;
  createdAt: Scalars['Time'];
  email: Scalars['String'];
  emailConfirmed: Scalars['Boolean'];
  firstname?: Maybe<Scalars['String']>;
  homeAddress?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  jobTitle?: Maybe<Scalars['String']>;
  lastActivityAt: Scalars['Time'];
  lastname?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  phoneCode?: Maybe<Scalars['String']>;
  phoneConfirmed: Scalars['Boolean'];
  phoneNumber?: Maybe<Scalars['String']>;
  portfolio?: Maybe<Scalars['String']>;
  totalUsersReferred?: Maybe<Scalars['String']>;
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
  Category: ResolverTypeWrapper<Category>;
  CategoryFiltersInput: CategoryFiltersInput;
  Client: ResolverTypeWrapper<Client>;
  ClientFiltersInput: ClientFiltersInput;
  Content: ResolverTypeWrapper<Content>;
  ContentFiltersInput: ContentFiltersInput;
  ContentType: ContentType;
  CreateCategoryInput: CreateCategoryInput;
  CreateClientInput: CreateClientInput;
  CreateContentInput: CreateContentInput;
  CreatePortfolioInput: CreatePortfolioInput;
  CreateProfileInput: CreateProfileInput;
  CreateUserInput: CreateUserInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IndexMetadataResponse: ResolverTypeWrapper<IndexMetadataResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LoginUserInput: LoginUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  PaymentType: PaymentType;
  Portfolio: ResolverTypeWrapper<Portfolio>;
  PortfolioFiltersInput: PortfolioFiltersInput;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserInput: RegisterUserInput;
  SignedUpThrough: SignedUpThrough;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tag: ResolverTypeWrapper<Tag>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  UpdateClientInput: UpdateClientInput;
  UpdateContentInput: UpdateContentInput;
  UpdatePortfolioInput: UpdatePortfolioInput;
  UpdateUserInput: UpdateUserInput;
  UploadContentInput: UploadContentInput;
  User: ResolverTypeWrapper<User>;
  VisibilityType: VisibilityType;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Category: Category;
  CategoryFiltersInput: CategoryFiltersInput;
  Client: Client;
  ClientFiltersInput: ClientFiltersInput;
  Content: Content;
  ContentFiltersInput: ContentFiltersInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateClientInput: CreateClientInput;
  CreateContentInput: CreateContentInput;
  CreatePortfolioInput: CreatePortfolioInput;
  CreateProfileInput: CreateProfileInput;
  CreateUserInput: CreateUserInput;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  IndexMetadataResponse: IndexMetadataResponse;
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  LoginUserInput: LoginUserInput;
  Mutation: {};
  Portfolio: Portfolio;
  PortfolioFiltersInput: PortfolioFiltersInput;
  Query: {};
  RegisterUserInput: RegisterUserInput;
  String: Scalars['String'];
  Tag: Tag;
  Time: Scalars['Time'];
  UpdateClientInput: UpdateClientInput;
  UpdateContentInput: UpdateContentInput;
  UpdatePortfolioInput: UpdatePortfolioInput;
  UpdateUserInput: UpdateUserInput;
  UploadContentInput: UploadContentInput;
  User: User;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = {
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentType?: Resolver<Maybe<ResolversTypes['PaymentType']>, ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalContents?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Content'] = ResolversParentTypes['Content']> = {
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  client?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType>;
  comments?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  excerpt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  featuredImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interactions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  lastUpdated?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>;
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  paymentType?: Resolver<Maybe<ResolversTypes['PaymentType']>, ParentType, ContextType>;
  shares?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  topics?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ContentType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['VisibilityType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexMetadataResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexMetadataResponse'] = ResolversParentTypes['IndexMetadataResponse']> = {
  commentPercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  comments?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  likePercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  likes?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sharePercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shares?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changePassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationCreateClientArgs, 'input'>>;
  createContent?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType, RequireFields<MutationCreateContentArgs, 'input'>>;
  createPortfolio?: Resolver<Maybe<ResolversTypes['Portfolio']>, ParentType, ContextType, RequireFields<MutationCreatePortfolioArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteClient?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteClientArgs, 'id'>>;
  deleteContent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContentArgs, 'id'>>;
  deletePortfolio?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePortfolioArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'oldPassword'>>;
  loginUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'data'>>;
  logoutUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  resetPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'newPassword'>>;
  sendEmailCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendEmailCodeArgs, 'email'>>;
  sendPasswordResetCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPasswordResetCodeArgs, 'email'>>;
  sendPhoneCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPhoneCodeArgs, 'phoneCode' | 'phoneNumber'>>;
  updateCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'id' | 'input'>>;
  updateClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationUpdateClientArgs, 'id' | 'input'>>;
  updateContent?: Resolver<ResolversTypes['Content'], ParentType, ContextType, RequireFields<MutationUpdateContentArgs, 'id' | 'input'>>;
  updatePortfolio?: Resolver<ResolversTypes['Portfolio'], ParentType, ContextType, RequireFields<MutationUpdatePortfolioArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  uploadContent?: Resolver<ResolversTypes['Content'], ParentType, ContextType, RequireFields<MutationUploadContentArgs, 'input'>>;
  useEmailCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUseEmailCodeArgs, 'code'>>;
  usePasswordResetCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUsePasswordResetCodeArgs, 'code' | 'email'>>;
  usePhoneCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUsePhoneCodeArgs, 'code'>>;
  verifyUsername?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVerifyUsernameArgs, 'username'>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type PortfolioResolvers<ContextType = any, ParentType extends ResolversParentTypes['Portfolio'] = ResolversParentTypes['Portfolio']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  templateId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCategories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryGetCategoriesArgs, never>>;
  getCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<QueryGetCategoryArgs, 'id'>>;
  getClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<QueryGetClientArgs, 'id'>>;
  getClients?: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryGetClientsArgs, never>>;
  getContent?: Resolver<ResolversTypes['Content'], ParentType, ContextType, RequireFields<QueryGetContentArgs, 'id'>>;
  getContents?: Resolver<Array<ResolversTypes['Content']>, ParentType, ContextType, RequireFields<QueryGetContentsArgs, never>>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getIndexMetadata?: Resolver<ResolversTypes['IndexMetadataResponse'], ParentType, ContextType, RequireFields<QueryGetIndexMetadataArgs, never>>;
  getPortfolio?: Resolver<ResolversTypes['Portfolio'], ParentType, ContextType, RequireFields<QueryGetPortfolioArgs, 'id'>>;
  getPortfolios?: Resolver<Array<ResolversTypes['Portfolio']>, ParentType, ContextType, RequireFields<QueryGetPortfoliosArgs, never>>;
  getUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryGetUserArgs, 'uuid'>>;
  getVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clients?: Resolver<Maybe<Array<ResolversTypes['Client']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailConfirmed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  firstname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  homeAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastActivityAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  lastname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phoneCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneConfirmed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  portfolio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalUsersReferred?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Category?: CategoryResolvers<ContextType>;
  Client?: ClientResolvers<ContextType>;
  Content?: ContentResolvers<ContextType>;
  IndexMetadataResponse?: IndexMetadataResponseResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Portfolio?: PortfolioResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  Time?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

