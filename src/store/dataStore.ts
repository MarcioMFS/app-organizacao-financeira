import { create } from 'zustand'
import { Transaction, Category, Reserve, ReserveTransaction } from '../types'
import { supabase } from '../lib/supabase'

interface DataState {
  transactions: Transaction[]
  categories: Category[]
  reserves: Reserve[]
  reserveTransactions: ReserveTransaction[]
  loading: boolean

  // Transactions
  fetchTransactions: (coupleId: string) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  getTransactionsByMonth: (year: number, month: number) => Transaction[]

  // Categories
  fetchCategories: (coupleId: string) => Promise<void>
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>

  // Reserves
  fetchReserves: (coupleId: string) => Promise<void>
  addReserve: (reserve: Omit<Reserve, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateReserve: (id: string, reserve: Partial<Reserve>) => Promise<void>
  deleteReserve: (id: string) => Promise<void>
  addReserveTransaction: (transaction: Omit<ReserveTransaction, 'id'>) => Promise<void>
}

export const useDataStore = create<DataState>()((set, get) => ({
  transactions: [],
  categories: [],
  reserves: [],
  reserveTransactions: [],
  loading: false,

  // Transactions
  fetchTransactions: async (coupleId: string) => {
    try {
      set({ loading: true })

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('couple_id', coupleId)
        .order('date', { ascending: false })

      if (error) throw error

      const transactions: Transaction[] = (data || []).map((t) => ({
        id: t.id,
        coupleId: t.couple_id,
        type: t.type as 'income' | 'expense',
        amount: Number(t.amount),
        description: t.description,
        date: new Date(t.date),
        categoryId: t.category_id,
        owner: t.owner as any,
        proportionA: t.proportion_a || undefined,
        proportionB: t.proportion_b || undefined,
        paymentMethod: t.payment_method as any,
        recurrence: t.recurrence as any,
        notes: t.notes || undefined,
        attachmentUrl: t.attachment_url || undefined,
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at),
        createdBy: t.created_by,
      }))

      set({ transactions })
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      set({ loading: false })
    }
  },

  addTransaction: async (transaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          couple_id: transaction.coupleId,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date.toISOString().split('T')[0],
          category_id: transaction.categoryId,
          owner: transaction.owner,
          proportion_a: transaction.proportionA,
          proportion_b: transaction.proportionB,
          payment_method: transaction.paymentMethod,
          recurrence: transaction.recurrence,
          notes: transaction.notes,
          created_by: transaction.createdBy,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newTransaction: Transaction = {
          id: data.id,
          coupleId: data.couple_id,
          type: data.type as any,
          amount: Number(data.amount),
          description: data.description,
          date: new Date(data.date),
          categoryId: data.category_id,
          owner: data.owner as any,
          proportionA: data.proportion_a || undefined,
          proportionB: data.proportion_b || undefined,
          paymentMethod: data.payment_method as any,
          recurrence: data.recurrence as any,
          notes: data.notes || undefined,
          attachmentUrl: data.attachment_url || undefined,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          createdBy: data.created_by,
        }

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }))
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  },

  updateTransaction: async (id, transaction) => {
    try {
      const updates: any = {}

      if (transaction.amount !== undefined) updates.amount = transaction.amount
      if (transaction.description !== undefined) updates.description = transaction.description
      if (transaction.date !== undefined) updates.date = transaction.date.toISOString().split('T')[0]
      if (transaction.categoryId !== undefined) updates.category_id = transaction.categoryId
      if (transaction.owner !== undefined) updates.owner = transaction.owner
      if (transaction.proportionA !== undefined) updates.proportion_a = transaction.proportionA
      if (transaction.proportionB !== undefined) updates.proportion_b = transaction.proportionB
      if (transaction.paymentMethod !== undefined) updates.payment_method = transaction.paymentMethod
      if (transaction.notes !== undefined) updates.notes = transaction.notes

      const { error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...transaction, updatedAt: new Date() } : t
        ),
      }))
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  },

  deleteTransaction: async (id) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  },

  getTransactionsByMonth: (year, month) => {
    return get().transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getFullYear() === year && date.getMonth() === month
    })
  },

  // Categories
  fetchCategories: async (coupleId: string) => {
    try {
      set({ loading: true })

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('couple_id', coupleId)
        .order('name')

      if (error) throw error

      const categories: Category[] = (data || []).map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        type: c.type as any,
        coupleId: c.couple_id,
        isDefault: c.is_default,
        monthlyBudget: c.monthly_budget ? Number(c.monthly_budget) : undefined,
        color: c.color || undefined,
      }))

      set({ categories })
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      set({ loading: false })
    }
  },

  addCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          couple_id: category.coupleId,
          name: category.name,
          icon: category.icon,
          type: category.type,
          is_default: category.isDefault,
          monthly_budget: category.monthlyBudget,
          color: category.color,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newCategory: Category = {
          id: data.id,
          name: data.name,
          icon: data.icon,
          type: data.type as any,
          coupleId: data.couple_id,
          isDefault: data.is_default,
          monthlyBudget: data.monthly_budget ? Number(data.monthly_budget) : undefined,
          color: data.color || undefined,
        }

        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
      }
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  },

  updateCategory: async (id, category) => {
    try {
      const updates: any = {}

      if (category.name !== undefined) updates.name = category.name
      if (category.icon !== undefined) updates.icon = category.icon
      if (category.monthlyBudget !== undefined) updates.monthly_budget = category.monthlyBudget

      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...category } : c
        ),
      }))
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  deleteCategory: async (id) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  },

  // Reserves
  fetchReserves: async (coupleId: string) => {
    try {
      const { data, error } = await supabase
        .from('reserves')
        .select('*')
        .eq('couple_id', coupleId)

      if (error) throw error

      const reserves: Reserve[] = (data || []).map((r) => ({
        id: r.id,
        coupleId: r.couple_id,
        name: r.name,
        targetAmount: Number(r.target_amount),
        currentAmount: Number(r.current_amount),
        targetDate: r.target_date ? new Date(r.target_date) : undefined,
        imageUrl: r.image_url || undefined,
        isEmergency: r.is_emergency,
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      }))

      set({ reserves })
    } catch (error) {
      console.error('Error fetching reserves:', error)
    }
  },

  addReserve: async (reserve) => {
    try {
      const { data, error } = await supabase
        .from('reserves')
        .insert({
          couple_id: reserve.coupleId,
          name: reserve.name,
          target_amount: reserve.targetAmount,
          current_amount: reserve.currentAmount,
          target_date: reserve.targetDate?.toISOString().split('T')[0],
          image_url: reserve.imageUrl,
          is_emergency: reserve.isEmergency,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        const newReserve: Reserve = {
          id: data.id,
          coupleId: data.couple_id,
          name: data.name,
          targetAmount: Number(data.target_amount),
          currentAmount: Number(data.current_amount),
          targetDate: data.target_date ? new Date(data.target_date) : undefined,
          imageUrl: data.image_url || undefined,
          isEmergency: data.is_emergency,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        }

        set((state) => ({
          reserves: [...state.reserves, newReserve],
        }))
      }
    } catch (error) {
      console.error('Error adding reserve:', error)
      throw error
    }
  },

  updateReserve: async (id, reserve) => {
    try {
      const updates: any = {}

      if (reserve.name !== undefined) updates.name = reserve.name
      if (reserve.targetAmount !== undefined) updates.target_amount = reserve.targetAmount
      if (reserve.currentAmount !== undefined) updates.current_amount = reserve.currentAmount
      if (reserve.targetDate !== undefined) updates.target_date = reserve.targetDate?.toISOString().split('T')[0]
      if (reserve.imageUrl !== undefined) updates.image_url = reserve.imageUrl

      const { error } = await supabase
        .from('reserves')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        reserves: state.reserves.map((r) =>
          r.id === id ? { ...r, ...reserve, updatedAt: new Date() } : r
        ),
      }))
    } catch (error) {
      console.error('Error updating reserve:', error)
      throw error
    }
  },

  deleteReserve: async (id) => {
    try {
      const { error } = await supabase
        .from('reserves')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        reserves: state.reserves.filter((r) => r.id !== id),
      }))
    } catch (error) {
      console.error('Error deleting reserve:', error)
      throw error
    }
  },

  addReserveTransaction: async (transaction) => {
    try {
      const { data, error } = await supabase
        .from('reserve_transactions')
        .insert({
          reserve_id: transaction.reserveId,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          date: transaction.date.toISOString().split('T')[0],
          created_by: transaction.createdBy,
        })
        .select()
        .single()

      if (error) throw error

      // Update reserve amount
      const reserve = get().reserves.find((r) => r.id === transaction.reserveId)
      if (reserve) {
        const newAmount = transaction.type === 'deposit'
          ? reserve.currentAmount + transaction.amount
          : reserve.currentAmount - transaction.amount

        await get().updateReserve(transaction.reserveId, { currentAmount: newAmount })
      }

      if (data) {
        const newTransaction: ReserveTransaction = {
          id: data.id,
          reserveId: data.reserve_id,
          amount: Number(data.amount),
          type: data.type as any,
          description: data.description,
          date: new Date(data.date),
          createdBy: data.created_by,
        }

        set((state) => ({
          reserveTransactions: [...state.reserveTransactions, newTransaction],
        }))
      }
    } catch (error) {
      console.error('Error adding reserve transaction:', error)
      throw error
    }
  },
}))
