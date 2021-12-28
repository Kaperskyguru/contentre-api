import {
  AccountType,
  Currency,
  InstitutionFeature,
  PrismaClient,
  UsageType,
  User as PrismaUser
} from '@prisma/client'
import {
  AccountIdentificationType,
  CreateYapilyTransactionInput,
  CredentialsType,
  EnvironmentType,
  MemberRole,
  TransactionStatusEnum,
  User
} from './modules'

export type ContextUser = User | PrismaUser

export interface Context {
  token?: string
  user?: ContextUser | null
  faunaKey?: string
  setCookies?: Cookie[]
  setHeaders?: []
  sentryId: string
  prisma: PrismaClient
  ipAddress?: InternetProtocolAddress
  requestURL?: string
  requestOrigin?: string
  locale?: string
}

export interface InternetProtocolAddress {
  address?: string
  geolocation?: Geolocation
}

export interface Geolocation {
  range?: [number, number]
  country?: string
  region?: string
  eu?: string
  timezone?: string
  city?: string
  ll?: [number, number]
  metro?: number
  area?: number
}

export interface Cookie {
  name: string
  value?: string
  options?: {
    domain?: string
    expires?: Date
    httpOnly?: boolean
    maxAge?: number
    path?: '/'
    sameSite?: boolean | 'None'
    secure?: boolean
  }
}

export interface YapilyError {
  code: number
  institutionError: {
    errorMessage: string
    httpStatusCode: number
  }
  message: string
  source: string
  status: string
  tracingId: string
}

interface Country {
  countryCode2: string
  displayName: string
}

interface Media {
  source?: string
  type?: string
}

export type ConsentStatus =
  | 'AUTHORIZED'
  | 'AWAITING_DECOUPLED_AUTHORIZATION'
  | 'AWAITING_FURTHER_AUTHORIZATION'
  | 'AWAITING_PRE_AUTHORIZATION'
  | 'AWAITING_RE_AUTHORIZATION'
  | 'AWAITING_SCA_CODE'
  | 'AWAITING_SCA_METHOD'
  | 'AWAITING_AUTHORIZATION'
  | 'INVALID'
  | 'EXPIRED'
  | 'CONSUMED'
  | 'FAILED'
  | 'UNKNOWN'
  | 'REJECTED'
  | 'REVOKED'
  | 'PRE_AUTHORIZED'

export type StatusError =
  | ''
  | 'invalid authorization'
  | 'not implemented'
  | 'need authorization'

export interface CreateConsentInput {
  yapilyId: string
  yapilyUserEmail: string
  yapilyUserId: string
  featureScope: InstitutionFeature[]
  authorizationURL?: string
  qrCodeURL?: string
  createdAt: string
  expiresAt: string
}

export enum YapilyAccountBalanceType {
  CLOSING_AVAILABLE,
  CLOSING_BOOKED,
  CLOSING_CLEARED,
  EXPECTED,
  FORWARD_AVAILABLE,
  INFORMATION,
  INTERIM_AVAILABLE,
  INTERIM_BOOKED,
  INTERIM_CLEARED,
  OPENING_AVAILABLE,
  OPENING_BOOKED,
  OPENING_CLEARED,
  PREVIOUSLY_CLOSED_BOOKED,
  AUTHORISED,
  OTHER,
  UNKNOWN
}

export enum YapilyAddressTypeEnum {
  BUSINESS,
  CORRESPONDENCE,
  DELIVERY_TO,
  MAIL_TO,
  PO_BOX,
  POSTAL,
  RESIDENTIAL,
  STATEMENT,
  UNKNOWN
}

export interface YapilyAmount {
  amount: number
  currency: Currency
}

export interface YapilyIsoCodeDetails {
  amount: number
  currency: Currency
}

export interface YapilyAccountIdentification {
  identification: string
  type: AccountIdentificationType
}

export interface YapilyAddress {
  addressLines?: string
  addressType?: YapilyAddressTypeEnum
  buildingNumber?: string
  country?: string
  county?: string
  department?: string
  postCode?: string
  streetName?: string
  subDepartment?: string
  townName?: string
}

export interface YapilyTransaction {
  addressDetails?: {
    addressLine: string
  }
  amount: number
  balance?: {
    balanceAmount: YapilyAmount
    type: YapilyAccountBalanceType
  }
  bookingDateTime?: string
  chargeDetails?: {
    chargeAmount?: YapilyAmount
    chargeTo?: string
    chargeType?: string
  }
  currency: Currency
  currencyExchange?: {
    exchangeRate?: number
    sourceCurrency?: Currency
    targetCurrency?: Currency
    unitCurrency?: Currency
  }
  date: string
  description?: string
  enrichment: {
    categorisation?: {
      category?: {
        id: string
        label?: string
      }
      categories?: string[]
    }
    transactionHash: {
      hash: string
    }
  }
  grossAmount?: YapilyAmount
  id: string
  isoBankTransactionCode?: {
    domainCode?: YapilyIsoCodeDetails
    familyCode?: YapilyIsoCodeDetails
    subFamilyCode?: YapilyIsoCodeDetails
  }
  merchant?: {
    merchantCategoryCode?: string
    merchantName?: string
  }
  payeeDetails?: {
    accountIdentifications?: YapilyAccountIdentification[]
    address?: YapilyAddress
    merchantCategoryCode?: string
    merchantId?: string
    name?: string
  }
  payerDetails?: {
    accountIdentifications?: YapilyAccountIdentification[]
    address?: YapilyAddress
    name?: string
  }
  proprietaryBankTransactionCode?: {
    code?: string
    issuer?: string
  }
  reference?: string
  statementReferences?: { value?: string }[]
  status: TransactionStatusEnum
  supplementaryData?: JSON
  transactionAmount?: YapilyAmount
  transactionInformation?: string[]
  valueDateTime: string
}

export interface EmbeddedAccountResponse {
  data: {
    id: string
    userUuid: string
    applicationUserId: string
    institutionId: string
    status: ConsentStatus
    createdAt: string
    expiresAt: string
    timeToExpire: string
    featureScope: InstitutionFeature[]
    state: string
    institutionConsentId: string
    scaMethods: {
      id: string
      type: SCA_METHODS_TYPES
      description: string
    }[]
    selectedScaMethod?: {
      id: string
      type: SCA_METHODS_TYPES
      description: string
    }
  }
}

export enum SCA_METHODS_TYPES {
  SMS_OTP,
  CHIP_OTP,
  PHOTO_OTP,
  PUSH_OTP
}

export interface CompanyAndRole {
  role: MemberRole
  activeCompany: boolean
  id: string
  name: string
  websiteURL: string
  avatarURL?: string | null
  registeredName: string
  countryCode: string
  countryName: string
  createdAt: string
  updatedAt: string
}

export interface TransactionsMeta {
  count: number
  totalCount: number
  offset: number
}

export interface TransactionsResponse {
  transactions: CreateYapilyTransactionInput[]
  meta: TransactionsMeta
}
