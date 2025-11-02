export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      couples: {
        Row: {
          id: string
          person_a_id: string
          person_b_id: string | null
          person_a_name: string
          person_b_name: string
          currency: string
          closing_day: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          person_a_id: string
          person_b_id?: string | null
          person_a_name: string
          person_b_name: string
          currency?: string
          closing_day?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          person_a_id?: string
          person_b_id?: string | null
          person_a_name?: string
          person_b_name?: string
          currency?: string
          closing_day?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          couple_id: string
          name: string
          icon: string
          type: 'income' | 'expense'
          is_default: boolean
          monthly_budget: number | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          name: string
          icon: string
          type: 'income' | 'expense'
          is_default?: boolean
          monthly_budget?: number | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          name?: string
          icon?: string
          type?: 'income' | 'expense'
          is_default?: boolean
          monthly_budget?: number | null
          color?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          couple_id: string
          type: 'income' | 'expense'
          amount: number
          description: string
          date: string
          category_id: string
          owner: 'person_a' | 'person_b' | 'both' | 'proportional'
          proportion_a: number | null
          proportion_b: number | null
          payment_method: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          recurrence: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
          notes: string | null
          attachment_url: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          couple_id: string
          type: 'income' | 'expense'
          amount: number
          description: string
          date: string
          category_id: string
          owner: 'person_a' | 'person_b' | 'both' | 'proportional'
          proportion_a?: number | null
          proportion_b?: number | null
          payment_method?: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          recurrence?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
          notes?: string | null
          attachment_url?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          couple_id?: string
          type?: 'income' | 'expense'
          amount?: number
          description?: string
          date?: string
          category_id?: string
          owner?: 'person_a' | 'person_b' | 'both' | 'proportional'
          proportion_a?: number | null
          proportion_b?: number | null
          payment_method?: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          recurrence?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
          notes?: string | null
          attachment_url?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      reserves: {
        Row: {
          id: string
          couple_id: string
          name: string
          target_amount: number
          current_amount: number
          target_date: string | null
          image_url: string | null
          is_emergency: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          name: string
          target_amount: number
          current_amount?: number
          target_date?: string | null
          image_url?: string | null
          is_emergency?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          target_date?: string | null
          image_url?: string | null
          is_emergency?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reserve_transactions: {
        Row: {
          id: string
          reserve_id: string
          amount: number
          type: 'deposit' | 'withdrawal'
          description: string
          date: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          reserve_id: string
          amount: number
          type: 'deposit' | 'withdrawal'
          description: string
          date: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          reserve_id?: string
          amount?: number
          type?: 'deposit' | 'withdrawal'
          description?: string
          date?: string
          created_by?: string
          created_at?: string
        }
      }
      fixed_expenses: {
        Row: {
          id: string
          couple_id: string
          name: string
          description: string | null
          amount: number
          category_id: string
          owner: 'person_a' | 'person_b' | 'both' | 'proportional'
          proportion_a: number | null
          proportion_b: number | null
          due_day: number
          payment_method: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          is_installment: boolean
          installment_number: number | null
          total_installments: number | null
          start_date: string | null
          end_date: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          couple_id: string
          name: string
          description?: string | null
          amount: number
          category_id: string
          owner: 'person_a' | 'person_b' | 'both' | 'proportional'
          proportion_a?: number | null
          proportion_b?: number | null
          due_day: number
          payment_method?: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          is_installment?: boolean
          installment_number?: number | null
          total_installments?: number | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          couple_id?: string
          name?: string
          description?: string | null
          amount?: number
          category_id?: string
          owner?: 'person_a' | 'person_b' | 'both' | 'proportional'
          proportion_a?: number | null
          proportion_b?: number | null
          due_day?: number
          payment_method?: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          is_installment?: boolean
          installment_number?: number | null
          total_installments?: number | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      fixed_expense_payments: {
        Row: {
          id: string
          fixed_expense_id: string
          reference_month: string
          paid_date: string | null
          paid_amount: number | null
          payment_method: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          notes: string | null
          created_at: string
          paid_by: string | null
        }
        Insert: {
          id?: string
          fixed_expense_id: string
          reference_month: string
          paid_date?: string | null
          paid_amount?: number | null
          payment_method?: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          notes?: string | null
          created_at?: string
          paid_by?: string | null
        }
        Update: {
          id?: string
          fixed_expense_id?: string
          reference_month?: string
          paid_date?: string | null
          paid_amount?: number | null
          payment_method?: 'cash' | 'debit' | 'credit' | 'pix' | 'bank_slip' | null
          notes?: string | null
          created_at?: string
          paid_by?: string | null
        }
      }
      fixed_incomes: {
        Row: {
          id: string
          couple_id: string
          name: string
          description: string | null
          amount: number
          category_id: string
          owner: 'person_a' | 'person_b' | 'both'
          receipt_day: number
          is_indefinite: boolean
          start_date: string
          end_date: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          couple_id: string
          name: string
          description?: string | null
          amount: number
          category_id: string
          owner: 'person_a' | 'person_b' | 'both'
          receipt_day: number
          is_indefinite?: boolean
          start_date: string
          end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          couple_id?: string
          name?: string
          description?: string | null
          amount?: number
          category_id?: string
          owner?: 'person_a' | 'person_b' | 'both'
          receipt_day?: number
          is_indefinite?: boolean
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      fixed_income_receipts: {
        Row: {
          id: string
          fixed_income_id: string
          reference_month: string
          received_date: string | null
          received_amount: number | null
          notes: string | null
          created_at: string
          received_by: string | null
        }
        Insert: {
          id?: string
          fixed_income_id: string
          reference_month: string
          received_date?: string | null
          received_amount?: number | null
          notes?: string | null
          created_at?: string
          received_by?: string | null
        }
        Update: {
          id?: string
          fixed_income_id?: string
          reference_month?: string
          received_date?: string | null
          received_amount?: number | null
          notes?: string | null
          created_at?: string
          received_by?: string | null
        }
      }
      financial_goals: {
        Row: {
          id: string
          couple_id: string
          name: string
          description: string | null
          target_amount: number
          current_amount: number
          time_frame: 'short' | 'medium' | 'long'
          start_date: string
          target_date: string | null
          priority: 'low' | 'medium' | 'high'
          category: string | null
          icon: string
          image_url: string | null
          is_completed: boolean
          completed_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          couple_id: string
          name: string
          description?: string | null
          target_amount: number
          current_amount?: number
          time_frame: 'short' | 'medium' | 'long'
          start_date: string
          target_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          category?: string | null
          icon?: string
          image_url?: string | null
          is_completed?: boolean
          completed_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          couple_id?: string
          name?: string
          description?: string | null
          target_amount?: number
          current_amount?: number
          time_frame?: 'short' | 'medium' | 'long'
          start_date?: string
          target_date?: string | null
          priority?: 'low' | 'medium' | 'high'
          category?: string | null
          icon?: string
          image_url?: string | null
          is_completed?: boolean
          completed_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      financial_goal_transactions: {
        Row: {
          id: string
          goal_id: string
          amount: number
          type: 'deposit' | 'withdrawal'
          description: string
          date: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          amount: number
          type: 'deposit' | 'withdrawal'
          description: string
          date: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          amount?: number
          type?: 'deposit' | 'withdrawal'
          description?: string
          date?: string
          created_by?: string
          created_at?: string
        }
      }
      debt_settlements: {
        Row: {
          id: string
          couple_id: string
          reference_type: 'fixed_expense' | 'installment' | 'transaction' | 'other'
          reference_id: string | null
          name: string
          description: string | null
          original_amount: number
          settled_amount: number
          owner: 'person_a' | 'person_b' | 'both'
          settlement_date: string
          original_due_date: string | null
          notes: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          couple_id: string
          reference_type: 'fixed_expense' | 'installment' | 'transaction' | 'other'
          reference_id?: string | null
          name: string
          description?: string | null
          original_amount: number
          settled_amount: number
          owner: 'person_a' | 'person_b' | 'both'
          settlement_date: string
          original_due_date?: string | null
          notes?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          couple_id?: string
          reference_type?: 'fixed_expense' | 'installment' | 'transaction' | 'other'
          reference_id?: string | null
          name?: string
          description?: string | null
          original_amount?: number
          settled_amount?: number
          owner?: 'person_a' | 'person_b' | 'both'
          settlement_date?: string
          original_due_date?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_default_categories: {
        Args: {
          couple_id_param: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
