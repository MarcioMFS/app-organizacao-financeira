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

// Fixed Expenses & Installments
export interface FixedExpense {
  id: string
  coupleId: string
  name: string
  description?: string
  amount: number
  categoryId: string
  owner: TransactionOwner
  proportionA?: number
  proportionB?: number
  dueDay: number
  paymentMethod?: PaymentMethod
  isInstallment: boolean
  installmentNumber?: number // Current installment (e.g., 3)
  totalInstallments?: number // Total installments (e.g., 12)
  startDate?: Date
  endDate?: Date
  isActive: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface FixedExpensePayment {
  id: string
  fixedExpenseId: string
  referenceMonth: Date // Month reference (e.g., 2025-01-01)
  paidDate?: Date
  paidAmount?: number
  paymentMethod?: PaymentMethod
  notes?: string
  createdAt: Date
  paidBy?: string
}

// Fixed Incomes
export interface FixedIncome {
  id: string
  coupleId: string
  name: string
  description?: string
  amount: number
  categoryId: string
  owner: 'person_a' | 'person_b' | 'both'
  receiptDay: number
  isIndefinite: boolean
  startDate: Date
  endDate?: Date
  isActive: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface FixedIncomeReceipt {
  id: string
  fixedIncomeId: string
  referenceMonth: Date
  receivedDate?: Date
  receivedAmount?: number
  notes?: string
  createdAt: Date
  receivedBy?: string
}

// Financial Goals
export type TimeFrame = 'short' | 'medium' | 'long'
export type Priority = 'low' | 'medium' | 'high'

export interface FinancialGoal {
  id: string
  coupleId: string
  name: string
  description?: string
  targetAmount: number
  currentAmount: number
  timeFrame: TimeFrame
  startDate: Date
  targetDate?: Date
  priority: Priority
  category?: string
  icon: string
  imageUrl?: string
  isCompleted: boolean
  completedDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface FinancialGoalTransaction {
  id: string
  goalId: string
  amount: number
  type: 'deposit' | 'withdrawal'
  description: string
  date: Date
  createdBy: string
  createdAt: Date
}

// Debt Settlements
export type ReferenceType = 'fixed_expense' | 'installment' | 'transaction' | 'other'

export interface DebtSettlement {
  id: string
  coupleId: string
  referenceType: ReferenceType
  referenceId?: string
  name: string
  description?: string
  originalAmount: number
  settledAmount: number
  owner: 'person_a' | 'person_b' | 'both'
  settlementDate: Date
  originalDueDate?: Date
  notes?: string
  createdAt: Date
  createdBy: string
}
