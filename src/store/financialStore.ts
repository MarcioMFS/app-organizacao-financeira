import { create } from 'zustand'
import {
  FixedExpense,
  FixedExpensePayment,
  FixedIncome,
  FixedIncomeReceipt,
  FinancialGoal,
  FinancialGoalTransaction,
  DebtSettlement
} from '../types'
import { supabase } from '../lib/supabase'

interface FinancialState {
  // Fixed Expenses
  fixedExpenses: FixedExpense[]
  fixedExpensePayments: FixedExpensePayment[]

  // Fixed Incomes
  fixedIncomes: FixedIncome[]
  fixedIncomeReceipts: FixedIncomeReceipt[]

  // Financial Goals
  financialGoals: FinancialGoal[]
  goalTransactions: FinancialGoalTransaction[]

  // Debt Settlements
  debtSettlements: DebtSettlement[]

  loading: boolean

  // Fixed Expenses
  fetchFixedExpenses: (coupleId: string) => Promise<void>
  addFixedExpense: (expense: Omit<FixedExpense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateFixedExpense: (id: string, expense: Partial<FixedExpense>) => Promise<void>
  deleteFixedExpense: (id: string) => Promise<void>

  // Fixed Expense Payments
  fetchFixedExpensePayments: (expenseId: string) => Promise<void>
  markExpenseAsPaid: (payment: Omit<FixedExpensePayment, 'id' | 'createdAt'>) => Promise<void>

  // Fixed Incomes
  fetchFixedIncomes: (coupleId: string) => Promise<void>
  addFixedIncome: (income: Omit<FixedIncome, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateFixedIncome: (id: string, income: Partial<FixedIncome>) => Promise<void>
  deleteFixedIncome: (id: string) => Promise<void>

  // Fixed Income Receipts
  fetchFixedIncomeReceipts: (incomeId: string) => Promise<void>
  markIncomeAsReceived: (receipt: Omit<FixedIncomeReceipt, 'id' | 'createdAt'>) => Promise<void>

  // Financial Goals
  fetchFinancialGoals: (coupleId: string) => Promise<void>
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateFinancialGoal: (id: string, goal: Partial<FinancialGoal>) => Promise<void>
  deleteFinancialGoal: (id: string) => Promise<void>
  addGoalTransaction: (transaction: Omit<FinancialGoalTransaction, 'id' | 'createdAt'>) => Promise<void>

  // Debt Settlements
  fetchDebtSettlements: (coupleId: string) => Promise<void>
  addDebtSettlement: (settlement: Omit<DebtSettlement, 'id' | 'createdAt'>) => Promise<void>
  deleteDebtSettlement: (id: string) => Promise<void>
}

export const useFinancialStore = create<FinancialState>()((set, get) => ({
  fixedExpenses: [],
  fixedExpensePayments: [],
  fixedIncomes: [],
  fixedIncomeReceipts: [],
  financialGoals: [],
  goalTransactions: [],
  debtSettlements: [],
  loading: false,

  // ========== FIXED EXPENSES ==========
  fetchFixedExpenses: async (coupleId: string) => {
    try {
      set({ loading: true })
      const { data, error } = await supabase
        .from('fixed_expenses')
        .select('*')
        .eq('couple_id', coupleId)
        .order('due_day')

      if (error) throw error

      const fixedExpenses: FixedExpense[] = (data || []).map((e) => ({
        id: e.id,
        coupleId: e.couple_id,
        name: e.name,
        description: e.description || undefined,
        amount: Number(e.amount),
        categoryId: e.category_id,
        owner: e.owner as any,
        proportionA: e.proportion_a || undefined,
        proportionB: e.proportion_b || undefined,
        dueDay: e.due_day,
        paymentMethod: e.payment_method as any,
        isInstallment: e.is_installment,
        installmentNumber: e.installment_number || undefined,
        totalInstallments: e.total_installments || undefined,
        startDate: e.start_date ? new Date(e.start_date) : undefined,
        endDate: e.end_date ? new Date(e.end_date) : undefined,
        isActive: e.is_active,
        notes: e.notes || undefined,
        createdAt: new Date(e.created_at),
        updatedAt: new Date(e.updated_at),
        createdBy: e.created_by,
      }))

      set({ fixedExpenses })
    } catch (error) {
      console.error('Error fetching fixed expenses:', error)
    } finally {
      set({ loading: false })
    }
  },

  addFixedExpense: async (expense) => {
    try {
      const { data, error } = await supabase
        .from('fixed_expenses')
        .insert({
          couple_id: expense.coupleId,
          name: expense.name,
          description: expense.description,
          amount: expense.amount,
          category_id: expense.categoryId,
          owner: expense.owner,
          proportion_a: expense.proportionA,
          proportion_b: expense.proportionB,
          due_day: expense.dueDay,
          payment_method: expense.paymentMethod,
          is_installment: expense.isInstallment,
          installment_number: expense.installmentNumber,
          total_installments: expense.totalInstallments,
          start_date: expense.startDate?.toISOString().split('T')[0],
          end_date: expense.endDate?.toISOString().split('T')[0],
          is_active: expense.isActive,
          notes: expense.notes,
          created_by: expense.createdBy,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newExpense: FixedExpense = {
          id: data.id,
          coupleId: data.couple_id,
          name: data.name,
          description: data.description || undefined,
          amount: Number(data.amount),
          categoryId: data.category_id,
          owner: data.owner as any,
          proportionA: data.proportion_a || undefined,
          proportionB: data.proportion_b || undefined,
          dueDay: data.due_day,
          paymentMethod: data.payment_method as any,
          isInstallment: data.is_installment,
          installmentNumber: data.installment_number || undefined,
          totalInstallments: data.total_installments || undefined,
          startDate: data.start_date ? new Date(data.start_date) : undefined,
          endDate: data.end_date ? new Date(data.end_date) : undefined,
          isActive: data.is_active,
          notes: data.notes || undefined,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          createdBy: data.created_by,
        }

        set((state) => ({
          fixedExpenses: [...state.fixedExpenses, newExpense],
        }))
      }
    } catch (error) {
      console.error('Error adding fixed expense:', error)
      throw error
    }
  },

  updateFixedExpense: async (id, expense) => {
    try {
      const updates: any = {}

      if (expense.name !== undefined) updates.name = expense.name
      if (expense.description !== undefined) updates.description = expense.description
      if (expense.amount !== undefined) updates.amount = expense.amount
      if (expense.categoryId !== undefined) updates.category_id = expense.categoryId
      if (expense.owner !== undefined) updates.owner = expense.owner
      if (expense.dueDay !== undefined) updates.due_day = expense.dueDay
      if (expense.paymentMethod !== undefined) updates.payment_method = expense.paymentMethod
      if (expense.isActive !== undefined) updates.is_active = expense.isActive
      if (expense.notes !== undefined) updates.notes = expense.notes

      const { error } = await supabase
        .from('fixed_expenses')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        fixedExpenses: state.fixedExpenses.map((e) =>
          e.id === id ? { ...e, ...expense, updatedAt: new Date() } : e
        ),
      }))
    } catch (error) {
      console.error('Error updating fixed expense:', error)
      throw error
    }
  },

  deleteFixedExpense: async (id) => {
    try {
      const { error } = await supabase
        .from('fixed_expenses')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        fixedExpenses: state.fixedExpenses.filter((e) => e.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting fixed expense:', error)
      throw error
    }
  },

  fetchFixedExpensePayments: async (expenseId: string) => {
    try {
      const { data, error } = await supabase
        .from('fixed_expense_payments')
        .select('*')
        .eq('fixed_expense_id', expenseId)
        .order('reference_month', { ascending: false })

      if (error) throw error

      const payments: FixedExpensePayment[] = (data || []).map((p) => ({
        id: p.id,
        fixedExpenseId: p.fixed_expense_id,
        referenceMonth: new Date(p.reference_month),
        paidDate: p.paid_date ? new Date(p.paid_date) : undefined,
        paidAmount: p.paid_amount ? Number(p.paid_amount) : undefined,
        paymentMethod: p.payment_method as any,
        notes: p.notes || undefined,
        createdAt: new Date(p.created_at),
        paidBy: p.paid_by || undefined,
      }))

      set({ fixedExpensePayments: payments })
    } catch (error) {
      console.error('Error fetching expense payments:', error)
    }
  },

  markExpenseAsPaid: async (payment) => {
    try {
      const { data, error } = await supabase
        .from('fixed_expense_payments')
        .insert({
          fixed_expense_id: payment.fixedExpenseId,
          reference_month: payment.referenceMonth.toISOString().split('T')[0],
          paid_date: payment.paidDate?.toISOString().split('T')[0],
          paid_amount: payment.paidAmount,
          payment_method: payment.paymentMethod,
          notes: payment.notes,
          paid_by: payment.paidBy,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newPayment: FixedExpensePayment = {
          id: data.id,
          fixedExpenseId: data.fixed_expense_id,
          referenceMonth: new Date(data.reference_month),
          paidDate: data.paid_date ? new Date(data.paid_date) : undefined,
          paidAmount: data.paid_amount ? Number(data.paid_amount) : undefined,
          paymentMethod: data.payment_method as any,
          notes: data.notes || undefined,
          createdAt: new Date(data.created_at),
          paidBy: data.paid_by || undefined,
        }

        set((state) => ({
          fixedExpensePayments: [newPayment, ...state.fixedExpensePayments],
        }))
      }
    } catch (error) {
      console.error('Error marking expense as paid:', error)
      throw error
    }
  },

  // ========== FIXED INCOMES ==========
  fetchFixedIncomes: async (coupleId: string) => {
    try {
      set({ loading: true })
      const { data, error } = await supabase
        .from('fixed_incomes')
        .select('*')
        .eq('couple_id', coupleId)
        .order('receipt_day')

      if (error) throw error

      const fixedIncomes: FixedIncome[] = (data || []).map((i) => ({
        id: i.id,
        coupleId: i.couple_id,
        name: i.name,
        description: i.description || undefined,
        amount: Number(i.amount),
        categoryId: i.category_id,
        owner: i.owner as any,
        receiptDay: i.receipt_day,
        isIndefinite: i.is_indefinite,
        startDate: new Date(i.start_date),
        endDate: i.end_date ? new Date(i.end_date) : undefined,
        isActive: i.is_active,
        notes: i.notes || undefined,
        createdAt: new Date(i.created_at),
        updatedAt: new Date(i.updated_at),
        createdBy: i.created_by,
      }))

      set({ fixedIncomes })
    } catch (error) {
      console.error('Error fetching fixed incomes:', error)
    } finally {
      set({ loading: false })
    }
  },

  addFixedIncome: async (income) => {
    try {
      const { data, error } = await supabase
        .from('fixed_incomes')
        .insert({
          couple_id: income.coupleId,
          name: income.name,
          description: income.description,
          amount: income.amount,
          category_id: income.categoryId,
          owner: income.owner,
          receipt_day: income.receiptDay,
          is_indefinite: income.isIndefinite,
          start_date: income.startDate.toISOString().split('T')[0],
          end_date: income.endDate?.toISOString().split('T')[0],
          is_active: income.isActive,
          notes: income.notes,
          created_by: income.createdBy,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newIncome: FixedIncome = {
          id: data.id,
          coupleId: data.couple_id,
          name: data.name,
          description: data.description || undefined,
          amount: Number(data.amount),
          categoryId: data.category_id,
          owner: data.owner as any,
          receiptDay: data.receipt_day,
          isIndefinite: data.is_indefinite,
          startDate: new Date(data.start_date),
          endDate: data.end_date ? new Date(data.end_date) : undefined,
          isActive: data.is_active,
          notes: data.notes || undefined,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          createdBy: data.created_by,
        }

        set((state) => ({
          fixedIncomes: [...state.fixedIncomes, newIncome],
        }))
      }
    } catch (error) {
      console.error('Error adding fixed income:', error)
      throw error
    }
  },

  updateFixedIncome: async (id, income) => {
    try {
      const updates: any = {}

      if (income.name !== undefined) updates.name = income.name
      if (income.description !== undefined) updates.description = income.description
      if (income.amount !== undefined) updates.amount = income.amount
      if (income.categoryId !== undefined) updates.category_id = income.categoryId
      if (income.owner !== undefined) updates.owner = income.owner
      if (income.receiptDay !== undefined) updates.receipt_day = income.receiptDay
      if (income.isActive !== undefined) updates.is_active = income.isActive
      if (income.notes !== undefined) updates.notes = income.notes

      const { error } = await supabase
        .from('fixed_incomes')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        fixedIncomes: state.fixedIncomes.map((i) =>
          i.id === id ? { ...i, ...income, updatedAt: new Date() } : i
        ),
      }))
    } catch (error) {
      console.error('Error updating fixed income:', error)
      throw error
    }
  },

  deleteFixedIncome: async (id) => {
    try {
      const { error } = await supabase
        .from('fixed_incomes')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        fixedIncomes: state.fixedIncomes.filter((i) => i.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting fixed income:', error)
      throw error
    }
  },

  fetchFixedIncomeReceipts: async (incomeId: string) => {
    try {
      const { data, error } = await supabase
        .from('fixed_income_receipts')
        .select('*')
        .eq('fixed_income_id', incomeId)
        .order('reference_month', { ascending: false })

      if (error) throw error

      const receipts: FixedIncomeReceipt[] = (data || []).map((r) => ({
        id: r.id,
        fixedIncomeId: r.fixed_income_id,
        referenceMonth: new Date(r.reference_month),
        receivedDate: r.received_date ? new Date(r.received_date) : undefined,
        receivedAmount: r.received_amount ? Number(r.received_amount) : undefined,
        notes: r.notes || undefined,
        createdAt: new Date(r.created_at),
        receivedBy: r.received_by || undefined,
      }))

      set({ fixedIncomeReceipts: receipts })
    } catch (error) {
      console.error('Error fetching income receipts:', error)
    }
  },

  markIncomeAsReceived: async (receipt) => {
    try {
      const { data, error } = await supabase
        .from('fixed_income_receipts')
        .insert({
          fixed_income_id: receipt.fixedIncomeId,
          reference_month: receipt.referenceMonth.toISOString().split('T')[0],
          received_date: receipt.receivedDate?.toISOString().split('T')[0],
          received_amount: receipt.receivedAmount,
          notes: receipt.notes,
          received_by: receipt.receivedBy,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newReceipt: FixedIncomeReceipt = {
          id: data.id,
          fixedIncomeId: data.fixed_income_id,
          referenceMonth: new Date(data.reference_month),
          receivedDate: data.received_date ? new Date(data.received_date) : undefined,
          receivedAmount: data.received_amount ? Number(data.received_amount) : undefined,
          notes: data.notes || undefined,
          createdAt: new Date(data.created_at),
          receivedBy: data.received_by || undefined,
        }

        set((state) => ({
          fixedIncomeReceipts: [newReceipt, ...state.fixedIncomeReceipts],
        }))
      }
    } catch (error) {
      console.error('Error marking income as received:', error)
      throw error
    }
  },

  // ========== FINANCIAL GOALS ==========
  fetchFinancialGoals: async (coupleId: string) => {
    try {
      set({ loading: true })
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const goals: FinancialGoal[] = (data || []).map((g) => ({
        id: g.id,
        coupleId: g.couple_id,
        name: g.name,
        description: g.description || undefined,
        targetAmount: Number(g.target_amount),
        currentAmount: Number(g.current_amount),
        timeFrame: g.time_frame as any,
        startDate: new Date(g.start_date),
        targetDate: g.target_date ? new Date(g.target_date) : undefined,
        priority: g.priority as any,
        category: g.category || undefined,
        icon: g.icon,
        imageUrl: g.image_url || undefined,
        isCompleted: g.is_completed,
        completedDate: g.completed_date ? new Date(g.completed_date) : undefined,
        isActive: g.is_active,
        createdAt: new Date(g.created_at),
        updatedAt: new Date(g.updated_at),
        createdBy: g.created_by,
      }))

      set({ financialGoals: goals })
    } catch (error) {
      console.error('Error fetching financial goals:', error)
    } finally {
      set({ loading: false })
    }
  },

  addFinancialGoal: async (goal) => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert({
          couple_id: goal.coupleId,
          name: goal.name,
          description: goal.description,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          time_frame: goal.timeFrame,
          start_date: goal.startDate.toISOString().split('T')[0],
          target_date: goal.targetDate?.toISOString().split('T')[0],
          priority: goal.priority,
          category: goal.category,
          icon: goal.icon,
          image_url: goal.imageUrl,
          is_completed: goal.isCompleted,
          is_active: goal.isActive,
          created_by: goal.createdBy,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newGoal: FinancialGoal = {
          id: data.id,
          coupleId: data.couple_id,
          name: data.name,
          description: data.description || undefined,
          targetAmount: Number(data.target_amount),
          currentAmount: Number(data.current_amount),
          timeFrame: data.time_frame as any,
          startDate: new Date(data.start_date),
          targetDate: data.target_date ? new Date(data.target_date) : undefined,
          priority: data.priority as any,
          category: data.category || undefined,
          icon: data.icon,
          imageUrl: data.image_url || undefined,
          isCompleted: data.is_completed,
          completedDate: data.completed_date ? new Date(data.completed_date) : undefined,
          isActive: data.is_active,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          createdBy: data.created_by,
        }

        set((state) => ({
          financialGoals: [newGoal, ...state.financialGoals],
        }))
      }
    } catch (error) {
      console.error('Error adding financial goal:', error)
      throw error
    }
  },

  updateFinancialGoal: async (id, goal) => {
    try {
      const updates: any = {}

      if (goal.name !== undefined) updates.name = goal.name
      if (goal.description !== undefined) updates.description = goal.description
      if (goal.targetAmount !== undefined) updates.target_amount = goal.targetAmount
      if (goal.currentAmount !== undefined) updates.current_amount = goal.currentAmount
      if (goal.targetDate !== undefined) updates.target_date = goal.targetDate?.toISOString().split('T')[0]
      if (goal.priority !== undefined) updates.priority = goal.priority
      if (goal.category !== undefined) updates.category = goal.category
      if (goal.icon !== undefined) updates.icon = goal.icon
      if (goal.isCompleted !== undefined) updates.is_completed = goal.isCompleted
      if (goal.completedDate !== undefined) updates.completed_date = goal.completedDate?.toISOString().split('T')[0]
      if (goal.isActive !== undefined) updates.is_active = goal.isActive

      const { error } = await supabase
        .from('financial_goals')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        financialGoals: state.financialGoals.map((g) =>
          g.id === id ? { ...g, ...goal, updatedAt: new Date() } : g
        ),
      }))
    } catch (error) {
      console.error('Error updating financial goal:', error)
      throw error
    }
  },

  deleteFinancialGoal: async (id) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        financialGoals: state.financialGoals.filter((g) => g.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting financial goal:', error)
      throw error
    }
  },

  addGoalTransaction: async (transaction) => {
    try {
      const { data, error } = await supabase
        .from('financial_goal_transactions')
        .insert({
          goal_id: transaction.goalId,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          date: transaction.date.toISOString().split('T')[0],
          created_by: transaction.createdBy,
        })
        .select()
        .single()

      if (error) throw error

      // Update goal amount
      const goal = get().financialGoals.find((g) => g.id === transaction.goalId)
      if (goal) {
        const newAmount = transaction.type === 'deposit'
          ? goal.currentAmount + transaction.amount
          : goal.currentAmount - transaction.amount

        await get().updateFinancialGoal(transaction.goalId, { currentAmount: newAmount })
      }

      if (data) {
        const newTransaction: FinancialGoalTransaction = {
          id: data.id,
          goalId: data.goal_id,
          amount: Number(data.amount),
          type: data.type as any,
          description: data.description,
          date: new Date(data.date),
          createdBy: data.created_by,
          createdAt: new Date(data.created_at),
        }

        set((state) => ({
          goalTransactions: [newTransaction, ...state.goalTransactions],
        }))
      }
    } catch (error) {
      console.error('Error adding goal transaction:', error)
      throw error
    }
  },

  // ========== DEBT SETTLEMENTS ==========
  fetchDebtSettlements: async (coupleId: string) => {
    try {
      set({ loading: true })
      const { data, error } = await supabase
        .from('debt_settlements')
        .select('*')
        .eq('couple_id', coupleId)
        .order('settlement_date', { ascending: false })

      if (error) throw error

      const settlements: DebtSettlement[] = (data || []).map((s) => ({
        id: s.id,
        coupleId: s.couple_id,
        referenceType: s.reference_type as any,
        referenceId: s.reference_id || undefined,
        name: s.name,
        description: s.description || undefined,
        originalAmount: Number(s.original_amount),
        settledAmount: Number(s.settled_amount),
        owner: s.owner as any,
        settlementDate: new Date(s.settlement_date),
        originalDueDate: s.original_due_date ? new Date(s.original_due_date) : undefined,
        notes: s.notes || undefined,
        createdAt: new Date(s.created_at),
        createdBy: s.created_by,
      }))

      set({ debtSettlements: settlements })
    } catch (error) {
      console.error('Error fetching debt settlements:', error)
    } finally {
      set({ loading: false })
    }
  },

  addDebtSettlement: async (settlement) => {
    try {
      const { data, error } = await supabase
        .from('debt_settlements')
        .insert({
          couple_id: settlement.coupleId,
          reference_type: settlement.referenceType,
          reference_id: settlement.referenceId,
          name: settlement.name,
          description: settlement.description,
          original_amount: settlement.originalAmount,
          settled_amount: settlement.settledAmount,
          owner: settlement.owner,
          settlement_date: settlement.settlementDate.toISOString().split('T')[0],
          original_due_date: settlement.originalDueDate?.toISOString().split('T')[0],
          notes: settlement.notes,
          created_by: settlement.createdBy,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newSettlement: DebtSettlement = {
          id: data.id,
          coupleId: data.couple_id,
          referenceType: data.reference_type as any,
          referenceId: data.reference_id || undefined,
          name: data.name,
          description: data.description || undefined,
          originalAmount: Number(data.original_amount),
          settledAmount: Number(data.settled_amount),
          owner: data.owner as any,
          settlementDate: new Date(data.settlement_date),
          originalDueDate: data.original_due_date ? new Date(data.original_due_date) : undefined,
          notes: data.notes || undefined,
          createdAt: new Date(data.created_at),
          createdBy: data.created_by,
        }

        set((state) => ({
          debtSettlements: [newSettlement, ...state.debtSettlements],
        }))
      }
    } catch (error) {
      console.error('Error adding debt settlement:', error)
      throw error
    }
  },

  deleteDebtSettlement: async (id) => {
    try {
      const { error } = await supabase
        .from('debt_settlements')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        debtSettlements: state.debtSettlements.filter((s) => s.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting debt settlement:', error)
      throw error
    }
  },
}))
