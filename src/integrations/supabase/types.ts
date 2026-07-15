export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      advisory_reports: {
        Row: {
          created_at: string
          id: string
          metrics_snapshot: Json | null
          period_end: string | null
          period_start: string | null
          recommendations: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics_snapshot?: Json | null
          period_end?: string | null
          period_start?: string | null
          recommendations?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics_snapshot?: Json | null
          period_end?: string | null
          period_start?: string | null
          recommendations?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          budget_fit: string | null
          business_name: string | null
          business_type: string | null
          clarity_gap: string | null
          clarity_outcome: string | null
          consent: boolean
          created_at: string
          current_tools: string[] | null
          decisions: string[] | null
          email: string | null
          first_name: string | null
          id: string
          monthly_review: string | null
          revenue_range: string | null
          timeline: string | null
          worth_it: string | null
        }
        Insert: {
          budget_fit?: string | null
          business_name?: string | null
          business_type?: string | null
          clarity_gap?: string | null
          clarity_outcome?: string | null
          consent?: boolean
          created_at?: string
          current_tools?: string[] | null
          decisions?: string[] | null
          email?: string | null
          first_name?: string | null
          id?: string
          monthly_review?: string | null
          revenue_range?: string | null
          timeline?: string | null
          worth_it?: string | null
        }
        Update: {
          budget_fit?: string | null
          business_name?: string | null
          business_type?: string | null
          clarity_gap?: string | null
          clarity_outcome?: string | null
          consent?: boolean
          created_at?: string
          current_tools?: string[] | null
          decisions?: string[] | null
          email?: string | null
          first_name?: string | null
          id?: string
          monthly_review?: string | null
          revenue_range?: string | null
          timeline?: string | null
          worth_it?: string | null
        }
        Relationships: []
      }
      business_metric_inputs: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          period_end: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs?: Json
          period_end: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          period_end?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          business_name: string | null
          created_at: string
          entity_type: string
          industry: string
          reserve_floor_months: number
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          entity_type?: string
          industry?: string
          reserve_floor_months?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          entity_type?: string
          industry?: string
          reserve_floor_months?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cron_runs: {
        Row: {
          candidates: number | null
          error: string | null
          failed: number | null
          finished_at: string | null
          generated: number | null
          id: string
          job: string
          sent: number | null
          skipped: number | null
          started_at: string
        }
        Insert: {
          candidates?: number | null
          error?: string | null
          failed?: number | null
          finished_at?: string | null
          generated?: number | null
          id?: string
          job: string
          sent?: number | null
          skipped?: number | null
          started_at?: string
        }
        Update: {
          candidates?: number | null
          error?: string | null
          failed?: number | null
          finished_at?: string | null
          generated?: number | null
          id?: string
          job?: string
          sent?: number | null
          skipped?: number | null
          started_at?: string
        }
        Relationships: []
      }
      email_preferences: {
        Row: {
          advisory_report_enabled: boolean
          created_at: string
          unsubscribe_token: string
          unsubscribed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advisory_report_enabled?: boolean
          created_at?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advisory_report_enabled?: boolean
          created_at?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_suppressions: {
        Row: {
          created_at: string
          detail: string | null
          email: string
          reason: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          email: string
          reason: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          email?: string
          reason?: string
        }
        Relationships: []
      }
      lead_email_sends: {
        Row: {
          email: string
          email_key: string
          id: string
          provider_message_id: string | null
          sent_at: string
        }
        Insert: {
          email: string
          email_key: string
          id?: string
          provider_message_id?: string | null
          sent_at?: string
        }
        Update: {
          email?: string
          email_key?: string
          id?: string
          provider_message_id?: string | null
          sent_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          business_type: string | null
          consent: boolean
          converted_at: string | null
          created_at: string
          email: string
          first_name: string | null
          goals: string[] | null
          id: string
          source: string | null
          template_id: string | null
          template_name: string | null
          unsubscribe_token: string
          unsubscribed_at: string | null
        }
        Insert: {
          business_type?: string | null
          consent?: boolean
          converted_at?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          goals?: string[] | null
          id?: string
          source?: string | null
          template_id?: string | null
          template_name?: string | null
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Update: {
          business_type?: string | null
          consent?: boolean
          converted_at?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          goals?: string[] | null
          id?: string
          source?: string | null
          template_id?: string | null
          template_name?: string | null
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string | null
          entry_date: string
          id: string
          is_variable: boolean
          kind: string
          revenue_line: string | null
          source: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description?: string | null
          entry_date: string
          id?: string
          is_variable?: boolean
          kind?: string
          revenue_line?: string | null
          source?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string | null
          entry_date?: string
          id?: string
          is_variable?: boolean
          kind?: string
          revenue_line?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      login_otps: {
        Row: {
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          ip: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          ip?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          ip?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plaid_accounts: {
        Row: {
          account_id: string
          available_balance: number | null
          current_balance: number | null
          id: string
          iso_currency_code: string | null
          mask: string | null
          name: string | null
          official_name: string | null
          plaid_item_id: string
          subtype: string | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          available_balance?: number | null
          current_balance?: number | null
          id?: string
          iso_currency_code?: string | null
          mask?: string | null
          name?: string | null
          official_name?: string | null
          plaid_item_id: string
          subtype?: string | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          available_balance?: number | null
          current_balance?: number | null
          id?: string
          iso_currency_code?: string | null
          mask?: string | null
          name?: string | null
          official_name?: string | null
          plaid_item_id?: string
          subtype?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plaid_accounts_plaid_item_id_fkey"
            columns: ["plaid_item_id"]
            isOneToOne: false
            referencedRelation: "plaid_items"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_items: {
        Row: {
          access_token_encrypted: string
          created_at: string
          cursor: string | null
          id: string
          institution_id: string | null
          institution_logo: string | null
          institution_name: string | null
          last_synced_at: string | null
          plaid_item_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_encrypted: string
          created_at?: string
          cursor?: string | null
          id?: string
          institution_id?: string | null
          institution_logo?: string | null
          institution_name?: string | null
          last_synced_at?: string | null
          plaid_item_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_encrypted?: string
          created_at?: string
          cursor?: string | null
          id?: string
          institution_id?: string | null
          institution_logo?: string | null
          institution_name?: string | null
          last_synced_at?: string | null
          plaid_item_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plaid_transactions: {
        Row: {
          account_id: string
          amount: number
          category: string | null
          category_raw: Json | null
          confidence: number
          created_at: string
          id: string
          is_recurring: boolean
          iso_currency_code: string | null
          merchant_name_norm: string | null
          merchant_name_raw: string | null
          name: string | null
          owner_corrected: boolean
          pending: boolean
          plaid_item_id: string
          plaid_transaction_id: string
          posted_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          category?: string | null
          category_raw?: Json | null
          confidence?: number
          created_at?: string
          id?: string
          is_recurring?: boolean
          iso_currency_code?: string | null
          merchant_name_norm?: string | null
          merchant_name_raw?: string | null
          name?: string | null
          owner_corrected?: boolean
          pending?: boolean
          plaid_item_id: string
          plaid_transaction_id: string
          posted_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          category?: string | null
          category_raw?: Json | null
          confidence?: number
          created_at?: string
          id?: string
          is_recurring?: boolean
          iso_currency_code?: string | null
          merchant_name_norm?: string | null
          merchant_name_raw?: string | null
          name?: string | null
          owner_corrected?: boolean
          pending?: boolean
          plaid_item_id?: string
          plaid_transaction_id?: string
          posted_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plaid_transactions_plaid_item_id_fkey"
            columns: ["plaid_item_id"]
            isOneToOne: false
            referencedRelation: "plaid_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          deletion_executed_at: string | null
          deletion_requested_at: string | null
          email: string | null
          first_name: string | null
          id: string
          internal_test_allow: boolean
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deletion_executed_at?: string | null
          deletion_requested_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          internal_test_allow?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deletion_executed_at?: string | null
          deletion_requested_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          internal_test_allow?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recurring_streams: {
        Row: {
          average_amount: number | null
          category: string | null
          created_at: string
          description: string | null
          direction: string
          first_amount: number | null
          frequency: string | null
          id: string
          is_active: boolean
          last_amount: number | null
          last_date: string | null
          merchant_name: string | null
          plaid_item_id: string
          status: string | null
          stream_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          average_amount?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          direction?: string
          first_amount?: number | null
          frequency?: string | null
          id?: string
          is_active?: boolean
          last_amount?: number | null
          last_date?: string | null
          merchant_name?: string | null
          plaid_item_id: string
          status?: string | null
          stream_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          average_amount?: number | null
          category?: string | null
          created_at?: string
          description?: string | null
          direction?: string
          first_amount?: number | null
          frequency?: string | null
          id?: string
          is_active?: boolean
          last_amount?: number | null
          last_date?: string | null
          merchant_name?: string | null
          plaid_item_id?: string
          status?: string | null
          stream_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_streams_plaid_item_id_fkey"
            columns: ["plaid_item_id"]
            isOneToOne: false
            referencedRelation: "plaid_items"
            referencedColumns: ["id"]
          },
        ]
      }
      report_email_deliveries: {
        Row: {
          attempts: number
          bounced_at: string | null
          clicked_at: string | null
          complained_at: string | null
          created_at: string
          delivered_at: string | null
          id: string
          last_attempt_at: string | null
          last_error: string | null
          opened_at: string | null
          provider_message_id: string | null
          recipient_email: string
          report_id: string
          sent_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          bounced_at?: string | null
          clicked_at?: string | null
          complained_at?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          opened_at?: string | null
          provider_message_id?: string | null
          recipient_email: string
          report_id: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          bounced_at?: string | null
          clicked_at?: string | null
          complained_at?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          opened_at?: string | null
          provider_message_id?: string | null
          recipient_email?: string
          report_id?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_email_deliveries_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: true
            referencedRelation: "advisory_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      retention_policy_reviews: {
        Row: {
          id: string
          notes: string | null
          policy_version: string
          reviewed_at: string
          reviewer_user_id: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          policy_version: string
          reviewed_at?: string
          reviewer_user_id?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          policy_version?: string
          reviewed_at?: string
          reviewer_user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          email: string | null
          environment: string
          id: string
          price_id: string | null
          product_id: string | null
          status: string
          stripe_customer_id: string
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string | null
          environment?: string
          id?: string
          price_id?: string | null
          product_id?: string | null
          status?: string
          stripe_customer_id: string
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string | null
          environment?: string
          id?: string
          price_id?: string | null
          product_id?: string | null
          status?: string
          stripe_customer_id?: string
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tos_acceptances: {
        Row: {
          accepted_at: string
          id: string
          ip: string | null
          plaid_consent_version: string
          tos_version: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          id?: string
          ip?: string | null
          plaid_consent_version: string
          tos_version: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          id?: string
          ip?: string | null
          plaid_consent_version?: string
          tos_version?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transaction_corrections: {
        Row: {
          category: string
          created_at: string
          id: string
          merchant_name_norm: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          merchant_name_norm: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          merchant_name_norm?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          event_type: string
          external_id: string | null
          id: string
          received_at: string
          source: string
          summary: Json | null
          user_id: string | null
        }
        Insert: {
          event_type: string
          external_id?: string | null
          id?: string
          received_at?: string
          source: string
          summary?: Json | null
          user_id?: string | null
        }
        Update: {
          event_type?: string
          external_id?: string | null
          id?: string
          received_at?: string
          source?: string
          summary?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _plaid_token_key: { Args: never; Returns: string }
      admin_audit_overview: {
        Args: never
        Returns: {
          created_at: string
          email: string
          last_report_at: string
          last_report_status: string
          last_sign_in_at: string
          last_webhook_at: string
          last_webhook_source: string
          last_webhook_type: string
          plaid_account_count: number
          plaid_item_count: number
          plaid_status: string
          providers: string[]
          sub_period_end: string
          sub_plan: string
          sub_status: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      plaid_create_item: {
        Args: {
          _institution_id: string
          _institution_name: string
          _plaid_item_id: string
          _status: string
          _token: string
          _user_id: string
        }
        Returns: string
      }
      plaid_get_access_token: { Args: { _item_id: string }; Returns: string }
      plaid_set_access_token: {
        Args: { _item_id: string; _token: string }
        Returns: undefined
      }
      run_retention_sweep: { Args: never; Returns: Json }
      upsert_cron_secret: { Args: { p_secret: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member"],
    },
  },
} as const
