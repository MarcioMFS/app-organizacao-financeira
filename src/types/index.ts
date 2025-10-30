export type TransactionType = 'income' | 'expense'
export type TransactionOwner = 'person_a' | 'person_b' | 'both' | 'proportional'
export type RecurrenceType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: Date
}

export interface Couple {
  id: string
  personAId: string
  personBId: string
  personAName: string
  personBName: string
  createdAt: Date
  currency: string
  closingDay: number
}

export interface Category {
  id: string
  name: string
  icon: string
  type: TransactionType
  coupleId: string
  isDefault: boolean
  monthlyBudget?: number
  color?: string
}

export interface Transaction {
  id: string
  coupleId: string
  type: TransactionType
  amount: number
  description: string
  date: Date
  categoryId: string
  owner: TransactionOwner
  proportionA?: number // percentage for person A when owner is 'proportional'
  proportionB?: number // percentage for person B when owner is 'proportional'
  paymentMethod?: PaymentMethod
  recurrence: RecurrenceType
  notes?: string
  attachmentUrl?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface Reserve {
  id: string
  coupleId: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate?: Date
  imageUrl?: string
  isEmergency: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ReserveTransaction {
  id: string
  reserveId: string
  amount: number
  type: 'deposit' | 'withdrawal'
  description: string
  date: Date
  createdBy: string
}

export interface MonthlyBudget {
  id: string
  coupleId: string
  categoryId: string
  month: string // Format: YYYY-MM
  budgetAmount: number
  spentAmount: number
}

export interface SavingsGoal {
  id: string
  coupleId: string
  type: 'percentage' | 'fixed'
  value: number // percentage or fixed amount
  month: string // Format: YYYY-MM
}

// Dashboard summary types
export interface MonthSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  savingsRate: number
  personAIncome: number
  personBIncome: number
  personAExpense: number
  personBExpense: number
}

export interface CategoryExpense {
  categoryId: string
  categoryName: string
  categoryIcon: string
  amount: number
  percentage: number
  budget?: number
}

export interface MonthComparison {
  currentMonth: MonthSummary
  previousMonth: MonthSummary
  incomeChange: number
  expenseChange: number
  savingsChange: number
}
