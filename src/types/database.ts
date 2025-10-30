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
