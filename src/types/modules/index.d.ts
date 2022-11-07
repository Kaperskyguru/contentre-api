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

export type AllPortfolioFiltersInput = {
  skills?: InputMaybe<Array<Scalars['String']>>;
  specialism?: InputMaybe<Array<Scalars['String']>>;
  terms?: InputMaybe<Scalars['String']>;
};

export type AllPortfoliosResponse = {
  __typename?: 'AllPortfoliosResponse';
  meta: Meta;
  portfolios: Array<Portfolio>;
};

export type App = {
  __typename?: 'App';
  app?: Maybe<Integration>;
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  isActivated?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  secret?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
};

export type AppData = {
  action: Scalars['String'];
  canonicalUrl?: InputMaybe<Scalars['String']>;
  contentFormat?: InputMaybe<Format>;
  contentId?: InputMaybe<Scalars['Int']>;
  contentStatus?: InputMaybe<StatusType>;
  hostname?: InputMaybe<Scalars['String']>;
  notifyFollowers?: InputMaybe<Scalars['Boolean']>;
  page?: InputMaybe<Scalars['Int']>;
  per_page?: InputMaybe<Scalars['Int']>;
  publishedStatus?: InputMaybe<StatusType>;
  slug?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type AppFiltersInput = {
  terms?: InputMaybe<Scalars['String']>;
};

export type AppInput = {
  data: AppData;
  name: Scalars['String'];
};

export type AppResponse = {
  __typename?: 'AppResponse';
  apps: Array<Integration>;
  meta: Meta;
};

export type AppStatus =
  | 'draft'
  | 'public'
  | 'unlisted';

export type Apps = {
  medium?: InputMaybe<Medium>;
};

export type BoxStats = {
  __typename?: 'BoxStats';
  amount?: Maybe<Scalars['Float']>;
  amountPercent?: Maybe<Scalars['Float']>;
  amountPercentStat?: Maybe<Scalars['Float']>;
  clientPercent: Scalars['Float'];
  contentPercent: Scalars['Float'];
  currentInteractions: Scalars['Int'];
  interactionPercent: Scalars['Float'];
  totalClients: Scalars['Int'];
  totalContents: Scalars['Int'];
};

export type Category = {
  __typename?: 'Category';
  color?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  name: Scalars['String'];
  totalAmount?: Maybe<Scalars['String']>;
  totalContents?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  userId?: Maybe<Scalars['ID']>;
};

export type CategoryFiltersInput = {
  categories?: InputMaybe<Array<Scalars['String']>>;
  categoryIds?: InputMaybe<Array<Scalars['ID']>>;
  clients?: InputMaybe<Array<Scalars['String']>>;
  daily?: InputMaybe<Scalars['Boolean']>;
  duration?: InputMaybe<Scalars['Int']>;
  fromAmount?: InputMaybe<Scalars['Float']>;
  fromDate?: InputMaybe<Scalars['String']>;
  sortBy?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  terms?: InputMaybe<Scalars['String']>;
  toAmount?: InputMaybe<Scalars['Float']>;
  toDate?: InputMaybe<Scalars['String']>;
  topicIds?: InputMaybe<Array<Scalars['ID']>>;
  topics?: InputMaybe<Array<Scalars['String']>>;
};

export type CategoryResponse = {
  __typename?: 'CategoryResponse';
  categories: Array<Category>;
  meta: Meta;
};

export type Chart = {
  __typename?: 'Chart';
  current: Array<Scalars['Float']>;
  last: Array<Scalars['Float']>;
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
  status?: Maybe<Scalars['String']>;
  totalAmount?: Maybe<Scalars['Float']>;
  totalContents?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  user?: Maybe<User>;
  visibility?: Maybe<Visibility>;
  website?: Maybe<Scalars['String']>;
};

export type ClientFiltersInput = {
  categories?: InputMaybe<Array<Scalars['String']>>;
  categoryIds?: InputMaybe<Array<Scalars['ID']>>;
  daily?: InputMaybe<Scalars['Boolean']>;
  duration?: InputMaybe<Scalars['Int']>;
  fromAmount?: InputMaybe<Scalars['Float']>;
  fromDate?: InputMaybe<Scalars['String']>;
  sortBy?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  terms?: InputMaybe<Scalars['String']>;
  toAmount?: InputMaybe<Scalars['Float']>;
  toDate?: InputMaybe<Scalars['String']>;
  topicIds?: InputMaybe<Array<Scalars['ID']>>;
  topics?: InputMaybe<Array<Scalars['String']>>;
};

export type ClientResponse = {
  __typename?: 'ClientResponse';
  clients: Array<Client>;
  meta: Meta;
};

export type ConnectedAppResponse = {
  __typename?: 'ConnectedAppResponse';
  apps: Array<App>;
  meta: Meta;
};

export type Contact = {
  __typename?: 'Contact';
  address?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
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
  publishedDate?: Maybe<Scalars['Time']>;
  shares?: Maybe<Scalars['Int']>;
  status?: Maybe<StatusType>;
  tags?: Maybe<Scalars['JSON']>;
  title: Scalars['String'];
  topics?: Maybe<Scalars['JSON']>;
  type: ContentType;
  updatedAt: Scalars['Time'];
  url?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  visibility: Visibility;
};

export type ContentFiltersInput = {
  categories?: InputMaybe<Array<Scalars['String']>>;
  categoryIds?: InputMaybe<Array<Scalars['ID']>>;
  clients?: InputMaybe<Array<Scalars['String']>>;
  daily?: InputMaybe<Scalars['Boolean']>;
  duration?: InputMaybe<Scalars['Int']>;
  fromAmount?: InputMaybe<Scalars['Float']>;
  fromDate?: InputMaybe<Scalars['String']>;
  sortBy?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  terms?: InputMaybe<Scalars['String']>;
  toAmount?: InputMaybe<Scalars['Float']>;
  toDate?: InputMaybe<Scalars['String']>;
  topicIds?: InputMaybe<Array<Scalars['ID']>>;
  topics?: InputMaybe<Array<Scalars['String']>>;
};

export type ContentResponse = {
  __typename?: 'ContentResponse';
  contents: Array<Content>;
  meta: Meta;
};

export type ContentType =
  | 'AUDIO'
  | 'TEXT'
  | 'VIDEO';

export type ConvertContentInput = {
  amount?: InputMaybe<Scalars['Float']>;
  apps?: InputMaybe<Apps>;
  category?: InputMaybe<Scalars['String']>;
  clientId?: InputMaybe<Scalars['ID']>;
  comments?: InputMaybe<Scalars['Int']>;
  content?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  featuredImage?: InputMaybe<Scalars['String']>;
  likes?: InputMaybe<Scalars['Int']>;
  noteId?: InputMaybe<Scalars['ID']>;
  paymentType?: InputMaybe<PaymentType>;
  shares?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<StatusType>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  topics?: InputMaybe<Array<Scalars['String']>>;
  url?: InputMaybe<Scalars['String']>;
  visibility?: InputMaybe<Visibility>;
};

export type Country = {
  __typename?: 'Country';
  code: Scalars['String'];
  name: Scalars['String'];
};

export type CountryInput = {
  code: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
};

export type CreateAppInput = {
  key?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  token?: InputMaybe<Scalars['String']>;
};

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
  apps?: InputMaybe<Apps>;
  category?: InputMaybe<Scalars['String']>;
  clientId?: InputMaybe<Scalars['ID']>;
  comments?: InputMaybe<Scalars['Int']>;
  content?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  featuredImage?: InputMaybe<Scalars['String']>;
  likes?: InputMaybe<Scalars['Int']>;
  noteId?: InputMaybe<Scalars['ID']>;
  paymentType?: InputMaybe<PaymentType>;
  shares?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<StatusType>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  topics?: InputMaybe<Array<Scalars['String']>>;
  url?: InputMaybe<Scalars['String']>;
  visibility?: InputMaybe<Visibility>;
};

export type CreateMediaInput = {
  title?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type CreateMultipleMediaInput = {
  media: Array<CreateMediaInput>;
};

export type CreateNoteInput = {
  content: Scalars['String'];
  notebookId?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CreateNotebookInput = {
  name: Scalars['String'];
};

export type CreatePortfolioInput = {
  categoryId?: InputMaybe<Scalars['ID']>;
  clientId?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  googleAnalyticId?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  shouldCustomize?: InputMaybe<Scalars['Boolean']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  templateId?: InputMaybe<Scalars['ID']>;
  title: Scalars['String'];
  topics?: InputMaybe<Array<Scalars['String']>>;
};

export type CreateProfileInput = {
  profileAvatar?: InputMaybe<Scalars['String']>;
  profileLink: Scalars['String'];
};

export type CreateSocialInput = {
  icon?: InputMaybe<Scalars['String']>;
  link: Scalars['String'];
  name: Scalars['String'];
};

export type CreateTagInput = {
  name: Scalars['String'];
};

export type CreateTeamInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type CreateTopicInput = {
  name: Scalars['String'];
};

export type CreateUserInput = {
  analyticsSource?: InputMaybe<Scalars['String']>;
  analyticsSourceData?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  language?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  password: Scalars['String'];
  referrer?: InputMaybe<Scalars['String']>;
  signedUpThrough?: InputMaybe<SignedUpThrough>;
  source?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type CreateUserTemplateInput = {
  categoryId?: InputMaybe<Scalars['ID']>;
  clientId?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  templateId?: InputMaybe<Scalars['ID']>;
  title: Scalars['String'];
  url?: InputMaybe<Scalars['String']>;
};

export type DeleteBulkCategoryInput = {
  ids: Array<Scalars['ID']>;
};

export type DeleteBulkClientInput = {
  ids: Array<Scalars['ID']>;
};

export type DeleteBulkContentInput = {
  ids: Array<Scalars['ID']>;
};

export type DeleteBulkNoteInput = {
  ids: Array<Scalars['ID']>;
};

export type DeleteBulkNotebookInput = {
  ids: Array<Scalars['ID']>;
};

export type DeleteBulkTagInput = {
  ids: Array<Scalars['ID']>;
};

export type DeleteBulkTopicInput = {
  ids: Array<Scalars['ID']>;
};

export type Feature = {
  __typename?: 'Feature';
  feature: Scalars['String'];
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type Format =
  | 'HTML'
  | 'MARKDOWN';

export type IndexMetadataResponse = {
  __typename?: 'IndexMetadataResponse';
  box?: Maybe<BoxStats>;
  revenue?: Maybe<RevenueChart>;
};

export type Integration = {
  __typename?: 'Integration';
  createdAt: Scalars['Time'];
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  website?: Maybe<Scalars['String']>;
};

export type InviteFriendsInput = {
  emails: Array<Scalars['String']>;
};

export type LegalEntityInput = {
  countryCode?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type LoginUserInput = {
  email: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  remember?: InputMaybe<Scalars['Boolean']>;
};

export type Media = {
  __typename?: 'Media';
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  url: Scalars['String'];
};

export type MediaFiltersInput = {
  categories?: InputMaybe<Array<Scalars['String']>>;
  categoryIds?: InputMaybe<Array<Scalars['ID']>>;
  clients?: InputMaybe<Array<Scalars['String']>>;
  daily?: InputMaybe<Scalars['Boolean']>;
  duration?: InputMaybe<Scalars['Int']>;
  fromAmount?: InputMaybe<Scalars['Float']>;
  fromDate?: InputMaybe<Scalars['String']>;
  sortBy?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  terms?: InputMaybe<Scalars['String']>;
  toAmount?: InputMaybe<Scalars['Float']>;
  toDate?: InputMaybe<Scalars['String']>;
  topicIds?: InputMaybe<Array<Scalars['ID']>>;
  topics?: InputMaybe<Array<Scalars['String']>>;
};

export type MediaResponse = {
  __typename?: 'MediaResponse';
  media: Array<Media>;
  meta: Meta;
};

export type Medium = {
  canonicalUrl?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  contentFormat?: InputMaybe<Format>;
  notifyFollowers?: InputMaybe<Scalars['Boolean']>;
  publishedStatus?: InputMaybe<AppStatus>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  title?: InputMaybe<Scalars['String']>;
};

export type Member = {
  __typename?: 'Member';
  avatarURL?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  email: Scalars['String'];
  id: Scalars['ID'];
  lastActivityAt: Scalars['Time'];
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  role: MemberRole;
  team?: Maybe<Team>;
  updatedAt: Scalars['Time'];
  username?: Maybe<Scalars['String']>;
};

export type MemberRole =
  | 'ADMIN'
  | 'MEMBER';

export type Meta = {
  __typename?: 'Meta';
  netTotal?: Maybe<Scalars['Int']>;
  total: Scalars['Int'];
  totalUsers?: Maybe<Scalars['Int']>;
};

export type Metadata = {
  __typename?: 'Metadata';
  client: Client;
  excerpt: Scalars['String'];
  image: Scalars['String'];
  publishedDate?: Maybe<Scalars['Time']>;
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: User;
  convertNoteContent?: Maybe<Content>;
  createCategory: Category;
  createClient: Client;
  createConnectedApp?: Maybe<App>;
  createContent?: Maybe<Content>;
  createMedia?: Maybe<Media>;
  createMultipleMedia: Array<Media>;
  createNote?: Maybe<Note>;
  createNotebook?: Maybe<Notebook>;
  createPortfolio?: Maybe<Portfolio>;
  createSocial?: Maybe<Social>;
  createTag?: Maybe<Tag>;
  createTeam: Team;
  createTopic?: Maybe<Topic>;
  createUser: User;
  deleteBulkCategory: Scalars['Boolean'];
  deleteBulkClient: Scalars['Boolean'];
  deleteBulkContent: Scalars['Boolean'];
  deleteBulkNote: Scalars['Boolean'];
  deleteBulkNotebook: Scalars['Boolean'];
  deleteBulkTag: Scalars['Boolean'];
  deleteBulkTopic: Scalars['Boolean'];
  deleteCategory: Scalars['Boolean'];
  deleteClient: Scalars['Boolean'];
  deleteConnectedApp: Scalars['Boolean'];
  deleteContent: Scalars['Boolean'];
  deleteMedia: Scalars['Boolean'];
  deleteNote: Scalars['Boolean'];
  deleteNotebook: Scalars['Boolean'];
  deletePortfolio: Scalars['Boolean'];
  deleteSocial: Scalars['Boolean'];
  deleteTag: Scalars['Boolean'];
  deleteTeam: User;
  deleteTopic: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  inviteFriends: Scalars['Boolean'];
  loginUser: User;
  logoutUser: Scalars['Boolean'];
  pullMultipleContent?: Maybe<Array<Content>>;
  removeContentTag?: Maybe<Content>;
  resetPassword: User;
  sendEmailCode: Scalars['Boolean'];
  sendPasswordResetCode: Scalars['Boolean'];
  sendPhoneCode: Scalars['Boolean'];
  sendSegment: Scalars['Boolean'];
  switchTeam: Team;
  updateActiveTeam: Team;
  updateCategory: Category;
  updateClient: Client;
  updateConnectedApp: App;
  updateContent: Content;
  updateMedia: Media;
  updateNote: Note;
  updateNotebook: Notebook;
  updatePortfolio: Portfolio;
  updateSocial: Social;
  updateTag: Tag;
  updateTopic: Topic;
  updateUser: User;
  updateUserTemplate: UserTemplate;
  uploadContent: Content;
  uploadMultipleContent: Array<Content>;
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


export type MutationConvertNoteContentArgs = {
  id: Scalars['ID'];
  input: ConvertContentInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationCreateConnectedAppArgs = {
  input: CreateAppInput;
};


export type MutationCreateContentArgs = {
  input: CreateContentInput;
};


export type MutationCreateMediaArgs = {
  input: CreateMediaInput;
};


export type MutationCreateMultipleMediaArgs = {
  input: CreateMultipleMediaInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationCreateNotebookArgs = {
  input: CreateNotebookInput;
};


export type MutationCreatePortfolioArgs = {
  input: CreatePortfolioInput;
};


export type MutationCreateSocialArgs = {
  input: CreateSocialInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationCreateTopicArgs = {
  input: CreateTopicInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteBulkCategoryArgs = {
  input: DeleteBulkCategoryInput;
};


export type MutationDeleteBulkClientArgs = {
  input: DeleteBulkClientInput;
};


export type MutationDeleteBulkContentArgs = {
  input: DeleteBulkContentInput;
};


export type MutationDeleteBulkNoteArgs = {
  input: DeleteBulkNoteInput;
};


export type MutationDeleteBulkNotebookArgs = {
  input: DeleteBulkNotebookInput;
};


export type MutationDeleteBulkTagArgs = {
  input: DeleteBulkTagInput;
};


export type MutationDeleteBulkTopicArgs = {
  input: DeleteBulkTopicInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteConnectedAppArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteContentArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteMediaArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteNotebookArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePortfolioArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSocialArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTeamArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteTopicArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  feedback?: InputMaybe<Scalars['String']>;
  oldPassword: Scalars['String'];
};


export type MutationInviteFriendsArgs = {
  data: InviteFriendsInput;
};


export type MutationLoginUserArgs = {
  data: LoginUserInput;
};


export type MutationPullMultipleContentArgs = {
  input: PullContentInput;
};


export type MutationRemoveContentTagArgs = {
  id: Scalars['ID'];
  tags?: InputMaybe<Array<Scalars['String']>>;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
};


export type MutationSendEmailCodeArgs = {
  email: Scalars['String'];
  template?: InputMaybe<Scalars['String']>;
};


export type MutationSendPasswordResetCodeArgs = {
  email: Scalars['String'];
};


export type MutationSendPhoneCodeArgs = {
  phoneCode: Scalars['String'];
  phoneNumber: Scalars['String'];
};


export type MutationSendSegmentArgs = {
  input: SendSegmentInput;
};


export type MutationSwitchTeamArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateActiveTeamArgs = {
  input: TeamInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID'];
  input: UpdateCategoryInput;
};


export type MutationUpdateClientArgs = {
  id: Scalars['ID'];
  input: UpdateClientInput;
};


export type MutationUpdateConnectedAppArgs = {
  id: Scalars['ID'];
  input: UpdateAppInput;
};


export type MutationUpdateContentArgs = {
  id: Scalars['ID'];
  input: UpdateContentInput;
};


export type MutationUpdateMediaArgs = {
  id: Scalars['ID'];
  input: UpdateMediaInput;
};


export type MutationUpdateNoteArgs = {
  id: Scalars['ID'];
  input: UpdateNoteInput;
};


export type MutationUpdateNotebookArgs = {
  id: Scalars['ID'];
  input: UpdateNotebookInput;
};


export type MutationUpdatePortfolioArgs = {
  id: Scalars['ID'];
  input: UpdatePortfolioInput;
};


export type MutationUpdateSocialArgs = {
  id: Scalars['ID'];
  input: UpdateSocialInput;
};


export type MutationUpdateTagArgs = {
  id: Scalars['ID'];
  input: UpdateTagInput;
};


export type MutationUpdateTopicArgs = {
  id: Scalars['ID'];
  input: UpdateTopicInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserTemplateArgs = {
  id: Scalars['ID'];
  input: UpdateUserTemplateInput;
};


export type MutationUploadContentArgs = {
  input: UploadContentInput;
};


export type MutationUploadMultipleContentArgs = {
  input: UploadMultipleContentInput;
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

export type Note = {
  __typename?: 'Note';
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  id?: Maybe<Scalars['ID']>;
  link?: Maybe<Scalars['String']>;
  notebookId?: Maybe<Scalars['ID']>;
  shareLink?: Maybe<Scalars['String']>;
  shareable?: Maybe<Scalars['Boolean']>;
  teamId?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  userId?: Maybe<Scalars['ID']>;
};

export type NoteFiltersInput = {
  all?: InputMaybe<Scalars['Boolean']>;
  fromDate?: InputMaybe<Scalars['String']>;
  notebookId?: InputMaybe<Scalars['ID']>;
  sortBy?: InputMaybe<Scalars['String']>;
  terms?: InputMaybe<Scalars['String']>;
  toDate?: InputMaybe<Scalars['String']>;
};

export type NoteResponse = {
  __typename?: 'NoteResponse';
  meta: Meta;
  notes: Array<Note>;
};

export type Notebook = {
  __typename?: 'Notebook';
  createdAt: Scalars['Time'];
  id?: Maybe<Scalars['ID']>;
  link?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  shareable?: Maybe<Scalars['Boolean']>;
  teamId?: Maybe<Scalars['ID']>;
  totalNotes?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['Time'];
  userId?: Maybe<Scalars['ID']>;
};

export type NotebookFiltersInput = {
  all?: InputMaybe<Scalars['Boolean']>;
  sortBy?: InputMaybe<Scalars['String']>;
  terms?: InputMaybe<Scalars['String']>;
};

export type NotebookResponse = {
  __typename?: 'NotebookResponse';
  meta: Meta;
  notebooks: Array<Notebook>;
};

export type OverallStatResponse = {
  __typename?: 'OverallStatResponse';
  name: Scalars['String'];
  totalAmount: Scalars['Float'];
  totalClients: Scalars['Int'];
  totalComments: Scalars['Int'];
  totalContents: Scalars['Int'];
  totalInteractions: Scalars['Int'];
  totalLikes: Scalars['Int'];
  totalShares: Scalars['Int'];
};

export type OverallStatsResponse = {
  __typename?: 'OverallStatsResponse';
  categoryStat?: Maybe<OverallStatResponse>;
  performance?: Maybe<Performance>;
  stats?: Maybe<Array<Stat>>;
};

export type PaymentChannel =
  | 'PADDLE'
  | 'PAYSTACK'
  | 'STRIPE';

export type PaymentType =
  | 'ARTICLE'
  | 'MONTHLY'
  | 'ONETIME';

export type Performance = {
  __typename?: 'Performance';
  totalAmount: Scalars['Float'];
  totalContents: Scalars['Int'];
  totalInteractions: Scalars['Int'];
};

export type Plan = {
  __typename?: 'Plan';
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
};

export type Portfolio = {
  __typename?: 'Portfolio';
  createdAt: Scalars['Time'];
  description?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  googleAnalyticId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isCustomized?: Maybe<Scalars['Boolean']>;
  isPremium?: Maybe<Scalars['Boolean']>;
  password?: Maybe<Scalars['String']>;
  template?: Maybe<UserTemplate>;
  templateId: Scalars['ID'];
  title: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Time'];
  url: Scalars['String'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']>;
  userTemplate?: Maybe<UserTemplate>;
};

export type PortfolioContent = {
  __typename?: 'PortfolioContent';
  categories?: Maybe<Array<Category>>;
  clients?: Maybe<Array<Client>>;
  contents?: Maybe<ContentResponse>;
  tags?: Maybe<Array<Tag>>;
  topics?: Maybe<Array<Topic>>;
};

export type PortfolioContentFilters = {
  categories?: InputMaybe<Array<Scalars['String']>>;
  clients?: InputMaybe<Array<Scalars['String']>>;
  code?: InputMaybe<Scalars['String']>;
  fromDate?: InputMaybe<Scalars['Time']>;
  sortBy?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  terms?: InputMaybe<Scalars['String']>;
  toDate?: InputMaybe<Scalars['Time']>;
  topics?: InputMaybe<Array<Scalars['String']>>;
  url?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type PortfolioDetail = {
  __typename?: 'PortfolioDetail';
  about?: Maybe<Scalars['String']>;
  contact?: Maybe<Contact>;
  coverImage?: Maybe<Scalars['String']>;
  css?: Maybe<Scalars['String']>;
  html?: Maybe<Scalars['String']>;
  job?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  profileImage?: Maybe<Scalars['String']>;
  socials: Array<Maybe<Social>>;
  templateSlug: Scalars['String'];
  templateType: TemplateType;
};

export type PortfolioDetailsFilters = {
  code?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type PortfolioFiltersInput = {
  terms?: InputMaybe<Scalars['String']>;
};

export type PortfolioResponse = {
  __typename?: 'PortfolioResponse';
  meta: Meta;
  portfolios: Array<Portfolio>;
};

export type PullContentInput = {
  plugins: Array<AppInput>;
};

export type Query = {
  __typename?: 'Query';
  getAllPortfolios?: Maybe<AllPortfoliosResponse>;
  getApps: AppResponse;
  getBoxStats?: Maybe<BoxStats>;
  getCategories: CategoryResponse;
  getCategory: Category;
  getCategoryStats?: Maybe<OverallStatResponse>;
  getClient: Client;
  getClients: ClientResponse;
  getConnectedApp: App;
  getConnectedApps: ConnectedAppResponse;
  getContent: Content;
  getContentStats?: Maybe<IndexMetadataResponse>;
  getContents: ContentResponse;
  getCurrentUser?: Maybe<User>;
  getIndexMetadata?: Maybe<IndexMetadataResponse>;
  getMedia: Media;
  getMedias: MediaResponse;
  getMembers?: Maybe<Array<Member>>;
  getNote: Note;
  getNotebook: Notebook;
  getNotebooks: NotebookResponse;
  getNotes: NoteResponse;
  getOverallStats?: Maybe<OverallStatsResponse>;
  getPortfolio: Portfolio;
  getPortfolioContent?: Maybe<PortfolioContent>;
  getPortfolioDetail: PortfolioDetail;
  getPortfolios: PortfolioResponse;
  getSocial: Social;
  getSocialByName: Social;
  getSocials: SocialResponse;
  getSubscriptionPlans: Array<SubscriptionPlan>;
  getTag: Tag;
  getTagStats?: Maybe<OverallStatResponse>;
  getTags: TagResponse;
  getTeams: Array<Team>;
  getTemplates: Array<Template>;
  getTopic: Topic;
  getTopicStats?: Maybe<OverallStatResponse>;
  getTopics: TopicResponse;
  getUser: User;
  getVersion: Scalars['String'];
};


export type QueryGetAllPortfoliosArgs = {
  filters?: InputMaybe<AllPortfolioFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetAppsArgs = {
  filters?: InputMaybe<AppFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetBoxStatsArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
};


export type QueryGetCategoriesArgs = {
  filters?: InputMaybe<CategoryFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryGetCategoryStatsArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
};


export type QueryGetClientArgs = {
  id: Scalars['ID'];
};


export type QueryGetClientsArgs = {
  filters?: InputMaybe<ClientFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetConnectedAppArgs = {
  id: Scalars['ID'];
};


export type QueryGetConnectedAppsArgs = {
  filters?: InputMaybe<AppFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetContentArgs = {
  id: Scalars['ID'];
};


export type QueryGetContentStatsArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
};


export type QueryGetContentsArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetIndexMetadataArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
};


export type QueryGetMediaArgs = {
  id: Scalars['ID'];
};


export type QueryGetMediasArgs = {
  filters?: InputMaybe<MediaFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetMembersArgs = {
  contains?: InputMaybe<Scalars['String']>;
};


export type QueryGetNoteArgs = {
  id: Scalars['ID'];
};


export type QueryGetNotebookArgs = {
  id: Scalars['ID'];
};


export type QueryGetNotebooksArgs = {
  filters?: InputMaybe<NotebookFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetNotesArgs = {
  filters?: InputMaybe<NoteFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetOverallStatsArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
};


export type QueryGetPortfolioArgs = {
  id: Scalars['ID'];
};


export type QueryGetPortfolioContentArgs = {
  filters: PortfolioContentFilters;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetPortfolioDetailArgs = {
  filters: PortfolioDetailsFilters;
};


export type QueryGetPortfoliosArgs = {
  filters?: InputMaybe<PortfolioFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetSocialArgs = {
  id: Scalars['ID'];
};


export type QueryGetSocialByNameArgs = {
  name: Scalars['String'];
};


export type QueryGetSocialsArgs = {
  filters?: InputMaybe<SocialFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetTagArgs = {
  id: Scalars['ID'];
};


export type QueryGetTagStatsArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
};


export type QueryGetTagsArgs = {
  filters?: InputMaybe<TagFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetTemplatesArgs = {
  filters?: InputMaybe<TemplateFiltersInput>;
  size?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryGetTopicArgs = {
  id: Scalars['ID'];
};


export type QueryGetTopicStatsArgs = {
  filters?: InputMaybe<ContentFiltersInput>;
};


export type QueryGetTopicsArgs = {
  filters?: InputMaybe<TopicFiltersInput>;
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

export type RevenueChart = {
  __typename?: 'RevenueChart';
  data: Chart;
  months: Array<Scalars['String']>;
};

export type SendSegmentInput = {
  data: Scalars['JSON'];
  eventName?: InputMaybe<Scalars['String']>;
  groupId?: InputMaybe<Scalars['String']>;
  operation: Scalars['String'];
  pageName?: InputMaybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type SignedUpThrough =
  | 'CONTENTRE'
  | 'GOOGLE';

export type Social = {
  __typename?: 'Social';
  createdAt: Scalars['Time'];
  icon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  link: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['Time'];
};

export type SocialFiltersInput = {
  all?: InputMaybe<Scalars['Boolean']>;
  sortBy?: InputMaybe<Scalars['String']>;
  terms?: InputMaybe<Scalars['String']>;
};

export type SocialResponse = {
  __typename?: 'SocialResponse';
  meta: Meta;
  socials: Array<Social>;
};

export type Stat = {
  __typename?: 'Stat';
  growth: Scalars['Float'];
  interactions: Scalars['Float'];
  name: Scalars['String'];
  status: Scalars['String'];
  totalComments: Scalars['Int'];
  totalContents: Scalars['Int'];
  totalLikes: Scalars['Int'];
  totalShares: Scalars['Int'];
};

export type Status =
  | 'ACTIVE'
  | 'INACTIVE';

export type StatusType =
  | 'DELETED'
  | 'DRAFT'
  | 'INACTIVE'
  | 'PUBLISHED';

export type Subscription = {
  __typename?: 'Subscription';
  channel?: Maybe<Scalars['String']>;
  expiry?: Maybe<Scalars['Time']>;
  features?: Maybe<Array<Feature>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  planId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Time']>;
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  channel: Scalars['String'];
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  paymentPlanId?: Maybe<Scalars['String']>;
  plan?: Maybe<Plan>;
  updatedAt: Scalars['Time'];
};

export type Tag = {
  __typename?: 'Tag';
  createdAt: Scalars['Time'];
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  totalAmount?: Maybe<Scalars['Float']>;
  totalContents?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['Time'];
  userId?: Maybe<Scalars['ID']>;
};

export type TagFiltersInput = {
  all?: InputMaybe<Scalars['Boolean']>;
  sortBy?: InputMaybe<Scalars['String']>;
  terms?: InputMaybe<Scalars['String']>;
};

export type TagResponse = {
  __typename?: 'TagResponse';
  meta: Meta;
  tags: Array<Tag>;
};

export type Team = {
  __typename?: 'Team';
  avatarURL?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['Time'];
};

export type TeamAdminsRelation = {
  connect?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  disconnect?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type TeamInput = {
  avatarURL?: InputMaybe<Scalars['String']>;
  members?: InputMaybe<Array<TeamMembersRelation>>;
  name?: InputMaybe<Scalars['String']>;
};

export type TeamMembersRelation = {
  connect?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  create?: InputMaybe<Array<InputMaybe<UserInput>>>;
  disconnect?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type Template = {
  __typename?: 'Template';
  demoLink?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
  type?: Maybe<TemplateType>;
};

export type TemplateFiltersInput = {
  terms?: InputMaybe<Scalars['String']>;
};

export type TemplateType =
  | 'CUSTOMIZED'
  | 'TEMPLATE';

export type Topic = {
  __typename?: 'Topic';
  createdAt: Scalars['Time'];
  id: Scalars['ID'];
  name: Scalars['String'];
  totalAmount?: Maybe<Scalars['Float']>;
  totalContents?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['Time'];
  userId?: Maybe<Scalars['ID']>;
};

export type TopicFiltersInput = {
  categories?: InputMaybe<Array<Scalars['String']>>;
  categoryIds?: InputMaybe<Array<Scalars['ID']>>;
  clients?: InputMaybe<Array<Scalars['String']>>;
  daily?: InputMaybe<Scalars['Boolean']>;
  duration?: InputMaybe<Scalars['Int']>;
  fromAmount?: InputMaybe<Scalars['Float']>;
  fromDate?: InputMaybe<Scalars['String']>;
  sortBy?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  terms?: InputMaybe<Scalars['String']>;
  toAmount?: InputMaybe<Scalars['Float']>;
  toDate?: InputMaybe<Scalars['String']>;
  topicIds?: InputMaybe<Array<Scalars['ID']>>;
  topics?: InputMaybe<Array<Scalars['String']>>;
};

export type TopicResponse = {
  __typename?: 'TopicResponse';
  meta: Meta;
  topics: Array<Topic>;
};

export type UpdateAppInput = {
  isActivated?: InputMaybe<Scalars['Boolean']>;
  key?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryInput = {
  color?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type UpdateClientInput = {
  amount?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  paymentType?: InputMaybe<PaymentType>;
  profile?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Status>;
  visibility?: InputMaybe<Visibility>;
  website?: InputMaybe<Scalars['String']>;
};

export type UpdateContentInput = {
  amount?: InputMaybe<Scalars['Float']>;
  apps?: InputMaybe<Apps>;
  category?: InputMaybe<Scalars['String']>;
  clientId?: InputMaybe<Scalars['ID']>;
  comments?: InputMaybe<Scalars['Int']>;
  content?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['String']>;
  featuredImage?: InputMaybe<Scalars['String']>;
  likes?: InputMaybe<Scalars['Int']>;
  paymentType?: InputMaybe<Scalars['String']>;
  shareable?: InputMaybe<Scalars['Boolean']>;
  shares?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<StatusType>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  title?: InputMaybe<Scalars['String']>;
  topics?: InputMaybe<Array<Scalars['String']>>;
  url?: InputMaybe<Scalars['String']>;
  visibility?: InputMaybe<Scalars['String']>;
};

export type UpdateMediaInput = {
  title?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type UpdateNoteInput = {
  content?: InputMaybe<Scalars['String']>;
  notebookId?: InputMaybe<Scalars['ID']>;
  shareable?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateNotebookInput = {
  name?: InputMaybe<Scalars['String']>;
  shareable?: InputMaybe<Scalars['Boolean']>;
};

export type UpdatePortfolioInput = {
  categoryId?: InputMaybe<Scalars['ID']>;
  clientId?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  googleAnalyticId?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  shouldCustomize?: InputMaybe<Scalars['Boolean']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  templateId?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
  topics?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateSocialInput = {
  link?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateTagInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateTopicInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  avatarURL?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  homeAddress?: InputMaybe<Scalars['String']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  portfolio?: InputMaybe<Scalars['String']>;
};

export type UpdateUserTemplateInput = {
  content?: InputMaybe<Scalars['String']>;
  css?: InputMaybe<Scalars['String']>;
};

export type UploadContentInput = {
  url: Scalars['String'];
};

export type UploadMultipleContentInput = {
  urls: Array<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  activeRole?: Maybe<MemberRole>;
  activeSubscription?: Maybe<Subscription>;
  activeSubscriptionId?: Maybe<Scalars['ID']>;
  activeTeam?: Maybe<Team>;
  activeTeamId?: Maybe<Scalars['String']>;
  avatarURL?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  clients?: Maybe<Array<Client>>;
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  email: Scalars['String'];
  emailConfirmed: Scalars['Boolean'];
  hasFinishedOnboarding?: Maybe<Scalars['Boolean']>;
  hasTrial?: Maybe<Scalars['Boolean']>;
  homeAddress?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isPremium?: Maybe<Scalars['Boolean']>;
  isTrial?: Maybe<Scalars['Boolean']>;
  jobTitle?: Maybe<Scalars['String']>;
  lastActivityAt: Scalars['Time'];
  name: Scalars['String'];
  paying?: Maybe<Scalars['Boolean']>;
  phoneCode?: Maybe<Scalars['String']>;
  phoneConfirmed: Scalars['Boolean'];
  phoneNumber?: Maybe<Scalars['String']>;
  portfolioURL?: Maybe<Scalars['String']>;
  subscription?: Maybe<Subscription>;
  subscriptionId?: Maybe<Scalars['ID']>;
  teams?: Maybe<Array<Team>>;
  totalContents?: Maybe<Scalars['Int']>;
  totalPortfolios?: Maybe<Scalars['Int']>;
  totalUsersReferred?: Maybe<Scalars['String']>;
  trialEndDate?: Maybe<Scalars['Time']>;
  updatedAt: Scalars['Time'];
  username?: Maybe<Scalars['String']>;
};

export type UserActiveTeamRelation = {
  connect?: InputMaybe<Scalars['ID']>;
  create?: InputMaybe<CreateTeamInput>;
  disconnect?: InputMaybe<Scalars['Boolean']>;
};

export type UserInput = {
  activeTeam?: InputMaybe<UserActiveTeamRelation>;
  avatarURL?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phoneCode?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  teams?: InputMaybe<UserTeamsRelation>;
};

export type UserTeamsRelation = {
  connect?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  create?: InputMaybe<Array<InputMaybe<CreateTeamInput>>>;
  disconnect?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type UserTemplate = {
  __typename?: 'UserTemplate';
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  css?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  template?: Maybe<Template>;
  updatedAt: Scalars['Time'];
};

export type Visibility =
  | 'PRIVATE'
  | 'PUBLIC'
  | 'TEAM'
  | 'UNLISTED';

export type SubUser = {
  __typename?: 'subUser';
  id: Scalars['ID'];
  subscriptionId?: Maybe<Scalars['ID']>;
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
  AllPortfolioFiltersInput: AllPortfolioFiltersInput;
  AllPortfoliosResponse: ResolverTypeWrapper<AllPortfoliosResponse>;
  App: ResolverTypeWrapper<App>;
  AppData: AppData;
  AppFiltersInput: AppFiltersInput;
  AppInput: AppInput;
  AppResponse: ResolverTypeWrapper<AppResponse>;
  AppStatus: AppStatus;
  Apps: Apps;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BoxStats: ResolverTypeWrapper<BoxStats>;
  Category: ResolverTypeWrapper<Category>;
  CategoryFiltersInput: CategoryFiltersInput;
  CategoryResponse: ResolverTypeWrapper<CategoryResponse>;
  Chart: ResolverTypeWrapper<Chart>;
  Client: ResolverTypeWrapper<Client>;
  ClientFiltersInput: ClientFiltersInput;
  ClientResponse: ResolverTypeWrapper<ClientResponse>;
  ConnectedAppResponse: ResolverTypeWrapper<ConnectedAppResponse>;
  Contact: ResolverTypeWrapper<Contact>;
  Content: ResolverTypeWrapper<Content>;
  ContentFiltersInput: ContentFiltersInput;
  ContentResponse: ResolverTypeWrapper<ContentResponse>;
  ContentType: ContentType;
  ConvertContentInput: ConvertContentInput;
  Country: ResolverTypeWrapper<Country>;
  CountryInput: CountryInput;
  CreateAppInput: CreateAppInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateClientInput: CreateClientInput;
  CreateContentInput: CreateContentInput;
  CreateMediaInput: CreateMediaInput;
  CreateMultipleMediaInput: CreateMultipleMediaInput;
  CreateNoteInput: CreateNoteInput;
  CreateNotebookInput: CreateNotebookInput;
  CreatePortfolioInput: CreatePortfolioInput;
  CreateProfileInput: CreateProfileInput;
  CreateSocialInput: CreateSocialInput;
  CreateTagInput: CreateTagInput;
  CreateTeamInput: CreateTeamInput;
  CreateTopicInput: CreateTopicInput;
  CreateUserInput: CreateUserInput;
  CreateUserTemplateInput: CreateUserTemplateInput;
  DeleteBulkCategoryInput: DeleteBulkCategoryInput;
  DeleteBulkClientInput: DeleteBulkClientInput;
  DeleteBulkContentInput: DeleteBulkContentInput;
  DeleteBulkNoteInput: DeleteBulkNoteInput;
  DeleteBulkNotebookInput: DeleteBulkNotebookInput;
  DeleteBulkTagInput: DeleteBulkTagInput;
  DeleteBulkTopicInput: DeleteBulkTopicInput;
  Feature: ResolverTypeWrapper<Feature>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Format: Format;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IndexMetadataResponse: ResolverTypeWrapper<IndexMetadataResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Integration: ResolverTypeWrapper<Integration>;
  InviteFriendsInput: InviteFriendsInput;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LegalEntityInput: LegalEntityInput;
  LoginUserInput: LoginUserInput;
  Media: ResolverTypeWrapper<Media>;
  MediaFiltersInput: MediaFiltersInput;
  MediaResponse: ResolverTypeWrapper<MediaResponse>;
  Medium: Medium;
  Member: ResolverTypeWrapper<Member>;
  MemberRole: MemberRole;
  Meta: ResolverTypeWrapper<Meta>;
  Metadata: ResolverTypeWrapper<Metadata>;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Note>;
  NoteFiltersInput: NoteFiltersInput;
  NoteResponse: ResolverTypeWrapper<NoteResponse>;
  Notebook: ResolverTypeWrapper<Notebook>;
  NotebookFiltersInput: NotebookFiltersInput;
  NotebookResponse: ResolverTypeWrapper<NotebookResponse>;
  OverallStatResponse: ResolverTypeWrapper<OverallStatResponse>;
  OverallStatsResponse: ResolverTypeWrapper<OverallStatsResponse>;
  PaymentChannel: PaymentChannel;
  PaymentType: PaymentType;
  Performance: ResolverTypeWrapper<Performance>;
  Plan: ResolverTypeWrapper<Plan>;
  Portfolio: ResolverTypeWrapper<Portfolio>;
  PortfolioContent: ResolverTypeWrapper<PortfolioContent>;
  PortfolioContentFilters: PortfolioContentFilters;
  PortfolioDetail: ResolverTypeWrapper<PortfolioDetail>;
  PortfolioDetailsFilters: PortfolioDetailsFilters;
  PortfolioFiltersInput: PortfolioFiltersInput;
  PortfolioResponse: ResolverTypeWrapper<PortfolioResponse>;
  PullContentInput: PullContentInput;
  Query: ResolverTypeWrapper<{}>;
  RegisterUserInput: RegisterUserInput;
  RevenueChart: ResolverTypeWrapper<RevenueChart>;
  SendSegmentInput: SendSegmentInput;
  SignedUpThrough: SignedUpThrough;
  Social: ResolverTypeWrapper<Social>;
  SocialFiltersInput: SocialFiltersInput;
  SocialResponse: ResolverTypeWrapper<SocialResponse>;
  Stat: ResolverTypeWrapper<Stat>;
  Status: Status;
  StatusType: StatusType;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  SubscriptionPlan: ResolverTypeWrapper<SubscriptionPlan>;
  Tag: ResolverTypeWrapper<Tag>;
  TagFiltersInput: TagFiltersInput;
  TagResponse: ResolverTypeWrapper<TagResponse>;
  Team: ResolverTypeWrapper<Team>;
  TeamAdminsRelation: TeamAdminsRelation;
  TeamInput: TeamInput;
  TeamMembersRelation: TeamMembersRelation;
  Template: ResolverTypeWrapper<Template>;
  TemplateFiltersInput: TemplateFiltersInput;
  TemplateType: TemplateType;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  Topic: ResolverTypeWrapper<Topic>;
  TopicFiltersInput: TopicFiltersInput;
  TopicResponse: ResolverTypeWrapper<TopicResponse>;
  UpdateAppInput: UpdateAppInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateClientInput: UpdateClientInput;
  UpdateContentInput: UpdateContentInput;
  UpdateMediaInput: UpdateMediaInput;
  UpdateNoteInput: UpdateNoteInput;
  UpdateNotebookInput: UpdateNotebookInput;
  UpdatePortfolioInput: UpdatePortfolioInput;
  UpdateSocialInput: UpdateSocialInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTopicInput: UpdateTopicInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserTemplateInput: UpdateUserTemplateInput;
  UploadContentInput: UploadContentInput;
  UploadMultipleContentInput: UploadMultipleContentInput;
  User: ResolverTypeWrapper<User>;
  UserActiveTeamRelation: UserActiveTeamRelation;
  UserInput: UserInput;
  UserTeamsRelation: UserTeamsRelation;
  UserTemplate: ResolverTypeWrapper<UserTemplate>;
  Visibility: Visibility;
  subUser: ResolverTypeWrapper<SubUser>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AllPortfolioFiltersInput: AllPortfolioFiltersInput;
  AllPortfoliosResponse: AllPortfoliosResponse;
  App: App;
  AppData: AppData;
  AppFiltersInput: AppFiltersInput;
  AppInput: AppInput;
  AppResponse: AppResponse;
  Apps: Apps;
  Boolean: Scalars['Boolean'];
  BoxStats: BoxStats;
  Category: Category;
  CategoryFiltersInput: CategoryFiltersInput;
  CategoryResponse: CategoryResponse;
  Chart: Chart;
  Client: Client;
  ClientFiltersInput: ClientFiltersInput;
  ClientResponse: ClientResponse;
  ConnectedAppResponse: ConnectedAppResponse;
  Contact: Contact;
  Content: Content;
  ContentFiltersInput: ContentFiltersInput;
  ContentResponse: ContentResponse;
  ConvertContentInput: ConvertContentInput;
  Country: Country;
  CountryInput: CountryInput;
  CreateAppInput: CreateAppInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateClientInput: CreateClientInput;
  CreateContentInput: CreateContentInput;
  CreateMediaInput: CreateMediaInput;
  CreateMultipleMediaInput: CreateMultipleMediaInput;
  CreateNoteInput: CreateNoteInput;
  CreateNotebookInput: CreateNotebookInput;
  CreatePortfolioInput: CreatePortfolioInput;
  CreateProfileInput: CreateProfileInput;
  CreateSocialInput: CreateSocialInput;
  CreateTagInput: CreateTagInput;
  CreateTeamInput: CreateTeamInput;
  CreateTopicInput: CreateTopicInput;
  CreateUserInput: CreateUserInput;
  CreateUserTemplateInput: CreateUserTemplateInput;
  DeleteBulkCategoryInput: DeleteBulkCategoryInput;
  DeleteBulkClientInput: DeleteBulkClientInput;
  DeleteBulkContentInput: DeleteBulkContentInput;
  DeleteBulkNoteInput: DeleteBulkNoteInput;
  DeleteBulkNotebookInput: DeleteBulkNotebookInput;
  DeleteBulkTagInput: DeleteBulkTagInput;
  DeleteBulkTopicInput: DeleteBulkTopicInput;
  Feature: Feature;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  IndexMetadataResponse: IndexMetadataResponse;
  Int: Scalars['Int'];
  Integration: Integration;
  InviteFriendsInput: InviteFriendsInput;
  JSON: Scalars['JSON'];
  LegalEntityInput: LegalEntityInput;
  LoginUserInput: LoginUserInput;
  Media: Media;
  MediaFiltersInput: MediaFiltersInput;
  MediaResponse: MediaResponse;
  Medium: Medium;
  Member: Member;
  Meta: Meta;
  Metadata: Metadata;
  Mutation: {};
  Note: Note;
  NoteFiltersInput: NoteFiltersInput;
  NoteResponse: NoteResponse;
  Notebook: Notebook;
  NotebookFiltersInput: NotebookFiltersInput;
  NotebookResponse: NotebookResponse;
  OverallStatResponse: OverallStatResponse;
  OverallStatsResponse: OverallStatsResponse;
  Performance: Performance;
  Plan: Plan;
  Portfolio: Portfolio;
  PortfolioContent: PortfolioContent;
  PortfolioContentFilters: PortfolioContentFilters;
  PortfolioDetail: PortfolioDetail;
  PortfolioDetailsFilters: PortfolioDetailsFilters;
  PortfolioFiltersInput: PortfolioFiltersInput;
  PortfolioResponse: PortfolioResponse;
  PullContentInput: PullContentInput;
  Query: {};
  RegisterUserInput: RegisterUserInput;
  RevenueChart: RevenueChart;
  SendSegmentInput: SendSegmentInput;
  Social: Social;
  SocialFiltersInput: SocialFiltersInput;
  SocialResponse: SocialResponse;
  Stat: Stat;
  String: Scalars['String'];
  Subscription: {};
  SubscriptionPlan: SubscriptionPlan;
  Tag: Tag;
  TagFiltersInput: TagFiltersInput;
  TagResponse: TagResponse;
  Team: Team;
  TeamAdminsRelation: TeamAdminsRelation;
  TeamInput: TeamInput;
  TeamMembersRelation: TeamMembersRelation;
  Template: Template;
  TemplateFiltersInput: TemplateFiltersInput;
  Time: Scalars['Time'];
  Topic: Topic;
  TopicFiltersInput: TopicFiltersInput;
  TopicResponse: TopicResponse;
  UpdateAppInput: UpdateAppInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateClientInput: UpdateClientInput;
  UpdateContentInput: UpdateContentInput;
  UpdateMediaInput: UpdateMediaInput;
  UpdateNoteInput: UpdateNoteInput;
  UpdateNotebookInput: UpdateNotebookInput;
  UpdatePortfolioInput: UpdatePortfolioInput;
  UpdateSocialInput: UpdateSocialInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTopicInput: UpdateTopicInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserTemplateInput: UpdateUserTemplateInput;
  UploadContentInput: UploadContentInput;
  UploadMultipleContentInput: UploadMultipleContentInput;
  User: User;
  UserActiveTeamRelation: UserActiveTeamRelation;
  UserInput: UserInput;
  UserTeamsRelation: UserTeamsRelation;
  UserTemplate: UserTemplate;
  subUser: SubUser;
};

export type AllPortfoliosResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AllPortfoliosResponse'] = ResolversParentTypes['AllPortfoliosResponse']> = {
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  portfolios?: Resolver<Array<ResolversTypes['Portfolio']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppResolvers<ContextType = any, ParentType extends ResolversParentTypes['App'] = ResolversParentTypes['App']> = {
  app?: Resolver<Maybe<ResolversTypes['Integration']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActivated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  secret?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppResponse'] = ResolversParentTypes['AppResponse']> = {
  apps?: Resolver<Array<ResolversTypes['Integration']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BoxStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['BoxStats'] = ResolversParentTypes['BoxStats']> = {
  amount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  amountPercent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  amountPercentStat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  clientPercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  contentPercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  currentInteractions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  interactionPercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalClients?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalContents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalContents?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryResponse'] = ResolversParentTypes['CategoryResponse']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChartResolvers<ContextType = any, ParentType extends ResolversParentTypes['Chart'] = ResolversParentTypes['Chart']> = {
  current?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
  last?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
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
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalContents?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  visibility?: Resolver<Maybe<ResolversTypes['Visibility']>, ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ClientResponse'] = ResolversParentTypes['ClientResponse']> = {
  clients?: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConnectedAppResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConnectedAppResponse'] = ResolversParentTypes['ConnectedAppResponse']> = {
  apps?: Resolver<Array<ResolversTypes['App']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactResolvers<ContextType = any, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  publishedDate?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>;
  shares?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['StatusType']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  topics?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ContentType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['Visibility'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContentResponse'] = ResolversParentTypes['ContentResponse']> = {
  contents?: Resolver<Array<ResolversTypes['Content']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CountryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['Feature'] = ResolversParentTypes['Feature']> = {
  feature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexMetadataResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexMetadataResponse'] = ResolversParentTypes['IndexMetadataResponse']> = {
  box?: Resolver<Maybe<ResolversTypes['BoxStats']>, ParentType, ContextType>;
  revenue?: Resolver<Maybe<ResolversTypes['RevenueChart']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntegrationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Integration'] = ResolversParentTypes['Integration']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MediaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Media'] = ResolversParentTypes['Media']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MediaResponse'] = ResolversParentTypes['MediaResponse']> = {
  media?: Resolver<Array<ResolversTypes['Media']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['Member'] = ResolversParentTypes['Member']> = {
  avatarURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastActivityAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['MemberRole'], ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']> = {
  netTotal?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalUsers?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['Metadata'] = ResolversParentTypes['Metadata']> = {
  client?: Resolver<ResolversTypes['Client'], ParentType, ContextType>;
  excerpt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publishedDate?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  changePassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'newPassword' | 'oldPassword'>>;
  convertNoteContent?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType, RequireFields<MutationConvertNoteContentArgs, 'id' | 'input'>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationCreateClientArgs, 'input'>>;
  createConnectedApp?: Resolver<Maybe<ResolversTypes['App']>, ParentType, ContextType, RequireFields<MutationCreateConnectedAppArgs, 'input'>>;
  createContent?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType, RequireFields<MutationCreateContentArgs, 'input'>>;
  createMedia?: Resolver<Maybe<ResolversTypes['Media']>, ParentType, ContextType, RequireFields<MutationCreateMediaArgs, 'input'>>;
  createMultipleMedia?: Resolver<Array<ResolversTypes['Media']>, ParentType, ContextType, RequireFields<MutationCreateMultipleMediaArgs, 'input'>>;
  createNote?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<MutationCreateNoteArgs, 'input'>>;
  createNotebook?: Resolver<Maybe<ResolversTypes['Notebook']>, ParentType, ContextType, RequireFields<MutationCreateNotebookArgs, 'input'>>;
  createPortfolio?: Resolver<Maybe<ResolversTypes['Portfolio']>, ParentType, ContextType, RequireFields<MutationCreatePortfolioArgs, 'input'>>;
  createSocial?: Resolver<Maybe<ResolversTypes['Social']>, ParentType, ContextType, RequireFields<MutationCreateSocialArgs, 'input'>>;
  createTag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'input'>>;
  createTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationCreateTeamArgs, 'input'>>;
  createTopic?: Resolver<Maybe<ResolversTypes['Topic']>, ParentType, ContextType, RequireFields<MutationCreateTopicArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteBulkCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBulkCategoryArgs, 'input'>>;
  deleteBulkClient?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBulkClientArgs, 'input'>>;
  deleteBulkContent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBulkContentArgs, 'input'>>;
  deleteBulkNote?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBulkNoteArgs, 'input'>>;
  deleteBulkNotebook?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBulkNotebookArgs, 'input'>>;
  deleteBulkTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBulkTagArgs, 'input'>>;
  deleteBulkTopic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBulkTopicArgs, 'input'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteClient?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteClientArgs, 'id'>>;
  deleteConnectedApp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteConnectedAppArgs, 'id'>>;
  deleteContent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteContentArgs, 'id'>>;
  deleteMedia?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMediaArgs, 'id'>>;
  deleteNote?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteNoteArgs, 'id'>>;
  deleteNotebook?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteNotebookArgs, 'id'>>;
  deletePortfolio?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePortfolioArgs, 'id'>>;
  deleteSocial?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSocialArgs, 'id'>>;
  deleteTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  deleteTeam?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteTeamArgs, 'id'>>;
  deleteTopic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTopicArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'oldPassword'>>;
  inviteFriends?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationInviteFriendsArgs, 'data'>>;
  loginUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'data'>>;
  logoutUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  pullMultipleContent?: Resolver<Maybe<Array<ResolversTypes['Content']>>, ParentType, ContextType, RequireFields<MutationPullMultipleContentArgs, 'input'>>;
  removeContentTag?: Resolver<Maybe<ResolversTypes['Content']>, ParentType, ContextType, RequireFields<MutationRemoveContentTagArgs, 'id'>>;
  resetPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'newPassword'>>;
  sendEmailCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendEmailCodeArgs, 'email'>>;
  sendPasswordResetCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPasswordResetCodeArgs, 'email'>>;
  sendPhoneCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPhoneCodeArgs, 'phoneCode' | 'phoneNumber'>>;
  sendSegment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendSegmentArgs, 'input'>>;
  switchTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationSwitchTeamArgs, 'id'>>;
  updateActiveTeam?: Resolver<ResolversTypes['Team'], ParentType, ContextType, RequireFields<MutationUpdateActiveTeamArgs, 'input'>>;
  updateCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'id' | 'input'>>;
  updateClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationUpdateClientArgs, 'id' | 'input'>>;
  updateConnectedApp?: Resolver<ResolversTypes['App'], ParentType, ContextType, RequireFields<MutationUpdateConnectedAppArgs, 'id' | 'input'>>;
  updateContent?: Resolver<ResolversTypes['Content'], ParentType, ContextType, RequireFields<MutationUpdateContentArgs, 'id' | 'input'>>;
  updateMedia?: Resolver<ResolversTypes['Media'], ParentType, ContextType, RequireFields<MutationUpdateMediaArgs, 'id' | 'input'>>;
  updateNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationUpdateNoteArgs, 'id' | 'input'>>;
  updateNotebook?: Resolver<ResolversTypes['Notebook'], ParentType, ContextType, RequireFields<MutationUpdateNotebookArgs, 'id' | 'input'>>;
  updatePortfolio?: Resolver<ResolversTypes['Portfolio'], ParentType, ContextType, RequireFields<MutationUpdatePortfolioArgs, 'id' | 'input'>>;
  updateSocial?: Resolver<ResolversTypes['Social'], ParentType, ContextType, RequireFields<MutationUpdateSocialArgs, 'id' | 'input'>>;
  updateTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'id' | 'input'>>;
  updateTopic?: Resolver<ResolversTypes['Topic'], ParentType, ContextType, RequireFields<MutationUpdateTopicArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserTemplate?: Resolver<ResolversTypes['UserTemplate'], ParentType, ContextType, RequireFields<MutationUpdateUserTemplateArgs, 'id' | 'input'>>;
  uploadContent?: Resolver<ResolversTypes['Content'], ParentType, ContextType, RequireFields<MutationUploadContentArgs, 'input'>>;
  uploadMultipleContent?: Resolver<Array<ResolversTypes['Content']>, ParentType, ContextType, RequireFields<MutationUploadMultipleContentArgs, 'input'>>;
  useEmailCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUseEmailCodeArgs, 'code'>>;
  usePasswordResetCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUsePasswordResetCodeArgs, 'code' | 'email'>>;
  usePhoneCode?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUsePhoneCodeArgs, 'code'>>;
  verifyUsername?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVerifyUsernameArgs, 'username'>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type NoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notebookId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  shareLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shareable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  teamId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NoteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['NoteResponse'] = ResolversParentTypes['NoteResponse']> = {
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotebookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Notebook'] = ResolversParentTypes['Notebook']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  shareable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  teamId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  totalNotes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotebookResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotebookResponse'] = ResolversParentTypes['NotebookResponse']> = {
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  notebooks?: Resolver<Array<ResolversTypes['Notebook']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OverallStatResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['OverallStatResponse'] = ResolversParentTypes['OverallStatResponse']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalClients?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalComments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalContents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalInteractions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalLikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalShares?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OverallStatsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['OverallStatsResponse'] = ResolversParentTypes['OverallStatsResponse']> = {
  categoryStat?: Resolver<Maybe<ResolversTypes['OverallStatResponse']>, ParentType, ContextType>;
  performance?: Resolver<Maybe<ResolversTypes['Performance']>, ParentType, ContextType>;
  stats?: Resolver<Maybe<Array<ResolversTypes['Stat']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PerformanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Performance'] = ResolversParentTypes['Performance']> = {
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalContents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalInteractions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['Plan'] = ResolversParentTypes['Plan']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortfolioResolvers<ContextType = any, ParentType extends ResolversParentTypes['Portfolio'] = ResolversParentTypes['Portfolio']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  domain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  googleAnalyticId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCustomized?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isPremium?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  template?: Resolver<Maybe<ResolversTypes['UserTemplate']>, ParentType, ContextType>;
  templateId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  userTemplate?: Resolver<Maybe<ResolversTypes['UserTemplate']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortfolioContentResolvers<ContextType = any, ParentType extends ResolversParentTypes['PortfolioContent'] = ResolversParentTypes['PortfolioContent']> = {
  categories?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  clients?: Resolver<Maybe<Array<ResolversTypes['Client']>>, ParentType, ContextType>;
  contents?: Resolver<Maybe<ResolversTypes['ContentResponse']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['Tag']>>, ParentType, ContextType>;
  topics?: Resolver<Maybe<Array<ResolversTypes['Topic']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortfolioDetailResolvers<ContextType = any, ParentType extends ResolversParentTypes['PortfolioDetail'] = ResolversParentTypes['PortfolioDetail']> = {
  about?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  contact?: Resolver<Maybe<ResolversTypes['Contact']>, ParentType, ContextType>;
  coverImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  css?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  html?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  job?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profileImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  socials?: Resolver<Array<Maybe<ResolversTypes['Social']>>, ParentType, ContextType>;
  templateSlug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  templateType?: Resolver<ResolversTypes['TemplateType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PortfolioResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PortfolioResponse'] = ResolversParentTypes['PortfolioResponse']> = {
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  portfolios?: Resolver<Array<ResolversTypes['Portfolio']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAllPortfolios?: Resolver<Maybe<ResolversTypes['AllPortfoliosResponse']>, ParentType, ContextType, RequireFields<QueryGetAllPortfoliosArgs, never>>;
  getApps?: Resolver<ResolversTypes['AppResponse'], ParentType, ContextType, RequireFields<QueryGetAppsArgs, never>>;
  getBoxStats?: Resolver<Maybe<ResolversTypes['BoxStats']>, ParentType, ContextType, RequireFields<QueryGetBoxStatsArgs, never>>;
  getCategories?: Resolver<ResolversTypes['CategoryResponse'], ParentType, ContextType, RequireFields<QueryGetCategoriesArgs, never>>;
  getCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<QueryGetCategoryArgs, 'id'>>;
  getCategoryStats?: Resolver<Maybe<ResolversTypes['OverallStatResponse']>, ParentType, ContextType, RequireFields<QueryGetCategoryStatsArgs, never>>;
  getClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<QueryGetClientArgs, 'id'>>;
  getClients?: Resolver<ResolversTypes['ClientResponse'], ParentType, ContextType, RequireFields<QueryGetClientsArgs, never>>;
  getConnectedApp?: Resolver<ResolversTypes['App'], ParentType, ContextType, RequireFields<QueryGetConnectedAppArgs, 'id'>>;
  getConnectedApps?: Resolver<ResolversTypes['ConnectedAppResponse'], ParentType, ContextType, RequireFields<QueryGetConnectedAppsArgs, never>>;
  getContent?: Resolver<ResolversTypes['Content'], ParentType, ContextType, RequireFields<QueryGetContentArgs, 'id'>>;
  getContentStats?: Resolver<Maybe<ResolversTypes['IndexMetadataResponse']>, ParentType, ContextType, RequireFields<QueryGetContentStatsArgs, never>>;
  getContents?: Resolver<ResolversTypes['ContentResponse'], ParentType, ContextType, RequireFields<QueryGetContentsArgs, never>>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  getIndexMetadata?: Resolver<Maybe<ResolversTypes['IndexMetadataResponse']>, ParentType, ContextType, RequireFields<QueryGetIndexMetadataArgs, never>>;
  getMedia?: Resolver<ResolversTypes['Media'], ParentType, ContextType, RequireFields<QueryGetMediaArgs, 'id'>>;
  getMedias?: Resolver<ResolversTypes['MediaResponse'], ParentType, ContextType, RequireFields<QueryGetMediasArgs, never>>;
  getMembers?: Resolver<Maybe<Array<ResolversTypes['Member']>>, ParentType, ContextType, RequireFields<QueryGetMembersArgs, never>>;
  getNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<QueryGetNoteArgs, 'id'>>;
  getNotebook?: Resolver<ResolversTypes['Notebook'], ParentType, ContextType, RequireFields<QueryGetNotebookArgs, 'id'>>;
  getNotebooks?: Resolver<ResolversTypes['NotebookResponse'], ParentType, ContextType, RequireFields<QueryGetNotebooksArgs, never>>;
  getNotes?: Resolver<ResolversTypes['NoteResponse'], ParentType, ContextType, RequireFields<QueryGetNotesArgs, never>>;
  getOverallStats?: Resolver<Maybe<ResolversTypes['OverallStatsResponse']>, ParentType, ContextType, RequireFields<QueryGetOverallStatsArgs, never>>;
  getPortfolio?: Resolver<ResolversTypes['Portfolio'], ParentType, ContextType, RequireFields<QueryGetPortfolioArgs, 'id'>>;
  getPortfolioContent?: Resolver<Maybe<ResolversTypes['PortfolioContent']>, ParentType, ContextType, RequireFields<QueryGetPortfolioContentArgs, 'filters'>>;
  getPortfolioDetail?: Resolver<ResolversTypes['PortfolioDetail'], ParentType, ContextType, RequireFields<QueryGetPortfolioDetailArgs, 'filters'>>;
  getPortfolios?: Resolver<ResolversTypes['PortfolioResponse'], ParentType, ContextType, RequireFields<QueryGetPortfoliosArgs, never>>;
  getSocial?: Resolver<ResolversTypes['Social'], ParentType, ContextType, RequireFields<QueryGetSocialArgs, 'id'>>;
  getSocialByName?: Resolver<ResolversTypes['Social'], ParentType, ContextType, RequireFields<QueryGetSocialByNameArgs, 'name'>>;
  getSocials?: Resolver<ResolversTypes['SocialResponse'], ParentType, ContextType, RequireFields<QueryGetSocialsArgs, never>>;
  getSubscriptionPlans?: Resolver<Array<ResolversTypes['SubscriptionPlan']>, ParentType, ContextType>;
  getTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<QueryGetTagArgs, 'id'>>;
  getTagStats?: Resolver<Maybe<ResolversTypes['OverallStatResponse']>, ParentType, ContextType, RequireFields<QueryGetTagStatsArgs, never>>;
  getTags?: Resolver<ResolversTypes['TagResponse'], ParentType, ContextType, RequireFields<QueryGetTagsArgs, never>>;
  getTeams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  getTemplates?: Resolver<Array<ResolversTypes['Template']>, ParentType, ContextType, RequireFields<QueryGetTemplatesArgs, never>>;
  getTopic?: Resolver<ResolversTypes['Topic'], ParentType, ContextType, RequireFields<QueryGetTopicArgs, 'id'>>;
  getTopicStats?: Resolver<Maybe<ResolversTypes['OverallStatResponse']>, ParentType, ContextType, RequireFields<QueryGetTopicStatsArgs, never>>;
  getTopics?: Resolver<ResolversTypes['TopicResponse'], ParentType, ContextType, RequireFields<QueryGetTopicsArgs, never>>;
  getUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryGetUserArgs, 'uuid'>>;
  getVersion?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type RevenueChartResolvers<ContextType = any, ParentType extends ResolversParentTypes['RevenueChart'] = ResolversParentTypes['RevenueChart']> = {
  data?: Resolver<ResolversTypes['Chart'], ParentType, ContextType>;
  months?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SocialResolvers<ContextType = any, ParentType extends ResolversParentTypes['Social'] = ResolversParentTypes['Social']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  icon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SocialResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SocialResponse'] = ResolversParentTypes['SocialResponse']> = {
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  socials?: Resolver<Array<ResolversTypes['Social']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StatResolvers<ContextType = any, ParentType extends ResolversParentTypes['Stat'] = ResolversParentTypes['Stat']> = {
  growth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  interactions?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalComments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalContents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalLikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalShares?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  channel?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "channel", ParentType, ContextType>;
  expiry?: SubscriptionResolver<Maybe<ResolversTypes['Time']>, "expiry", ParentType, ContextType>;
  features?: SubscriptionResolver<Maybe<Array<ResolversTypes['Feature']>>, "features", ParentType, ContextType>;
  id?: SubscriptionResolver<ResolversTypes['ID'], "id", ParentType, ContextType>;
  name?: SubscriptionResolver<ResolversTypes['String'], "name", ParentType, ContextType>;
  planId?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "planId", ParentType, ContextType>;
  updatedAt?: SubscriptionResolver<Maybe<ResolversTypes['Time']>, "updatedAt", ParentType, ContextType>;
};

export type SubscriptionPlanResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubscriptionPlan'] = ResolversParentTypes['SubscriptionPlan']> = {
  channel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paymentPlanId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  plan?: Resolver<Maybe<ResolversTypes['Plan']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalContents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagResponse'] = ResolversParentTypes['TagResponse']> = {
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  avatarURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Template'] = ResolversParentTypes['Template']> = {
  demoLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['TemplateType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type TopicResolvers<ContextType = any, ParentType extends ResolversParentTypes['Topic'] = ResolversParentTypes['Topic']> = {
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totalContents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TopicResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TopicResponse'] = ResolversParentTypes['TopicResponse']> = {
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  topics?: Resolver<Array<ResolversTypes['Topic']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  activeRole?: Resolver<Maybe<ResolversTypes['MemberRole']>, ParentType, ContextType>;
  activeSubscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType>;
  activeSubscriptionId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  activeTeam?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  activeTeamId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatarURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clients?: Resolver<Maybe<Array<ResolversTypes['Client']>>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailConfirmed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasFinishedOnboarding?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasTrial?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  homeAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPremium?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isTrial?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  jobTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastActivityAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paying?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  phoneCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneConfirmed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  portfolioURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subscription?: Resolver<Maybe<ResolversTypes['Subscription']>, ParentType, ContextType>;
  subscriptionId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  teams?: Resolver<Maybe<Array<ResolversTypes['Team']>>, ParentType, ContextType>;
  totalContents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalPortfolios?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalUsersReferred?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trialEndDate?: Resolver<Maybe<ResolversTypes['Time']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserTemplate'] = ResolversParentTypes['UserTemplate']> = {
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  css?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  template?: Resolver<Maybe<ResolversTypes['Template']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Time'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['subUser'] = ResolversParentTypes['subUser']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  subscriptionId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AllPortfoliosResponse?: AllPortfoliosResponseResolvers<ContextType>;
  App?: AppResolvers<ContextType>;
  AppResponse?: AppResponseResolvers<ContextType>;
  BoxStats?: BoxStatsResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  CategoryResponse?: CategoryResponseResolvers<ContextType>;
  Chart?: ChartResolvers<ContextType>;
  Client?: ClientResolvers<ContextType>;
  ClientResponse?: ClientResponseResolvers<ContextType>;
  ConnectedAppResponse?: ConnectedAppResponseResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  Content?: ContentResolvers<ContextType>;
  ContentResponse?: ContentResponseResolvers<ContextType>;
  Country?: CountryResolvers<ContextType>;
  Feature?: FeatureResolvers<ContextType>;
  IndexMetadataResponse?: IndexMetadataResponseResolvers<ContextType>;
  Integration?: IntegrationResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Media?: MediaResolvers<ContextType>;
  MediaResponse?: MediaResponseResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  Meta?: MetaResolvers<ContextType>;
  Metadata?: MetadataResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteResponse?: NoteResponseResolvers<ContextType>;
  Notebook?: NotebookResolvers<ContextType>;
  NotebookResponse?: NotebookResponseResolvers<ContextType>;
  OverallStatResponse?: OverallStatResponseResolvers<ContextType>;
  OverallStatsResponse?: OverallStatsResponseResolvers<ContextType>;
  Performance?: PerformanceResolvers<ContextType>;
  Plan?: PlanResolvers<ContextType>;
  Portfolio?: PortfolioResolvers<ContextType>;
  PortfolioContent?: PortfolioContentResolvers<ContextType>;
  PortfolioDetail?: PortfolioDetailResolvers<ContextType>;
  PortfolioResponse?: PortfolioResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RevenueChart?: RevenueChartResolvers<ContextType>;
  Social?: SocialResolvers<ContextType>;
  SocialResponse?: SocialResponseResolvers<ContextType>;
  Stat?: StatResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  SubscriptionPlan?: SubscriptionPlanResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagResponse?: TagResponseResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  Template?: TemplateResolvers<ContextType>;
  Time?: GraphQLScalarType;
  Topic?: TopicResolvers<ContextType>;
  TopicResponse?: TopicResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserTemplate?: UserTemplateResolvers<ContextType>;
  subUser?: SubUserResolvers<ContextType>;
};

