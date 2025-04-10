export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string | null
          id: string
          publish_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          publish_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          publish_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          adult_men: number
          adult_women: number
          boys: number
          created_at: string | null
          date: string
          girls: number
          id: string
          service_type: string
          updated_at: string | null
        }
        Insert: {
          adult_men?: number
          adult_women?: number
          boys?: number
          created_at?: string | null
          date: string
          girls?: number
          id?: string
          service_type: string
          updated_at?: string | null
        }
        Update: {
          adult_men?: number
          adult_women?: number
          boys?: number
          created_at?: string | null
          date?: string
          girls?: number
          id?: string
          service_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      church_settings: {
        Row: {
          church_name: string
          created_at: string | null
          id: string
          logo_url: string | null
          updated_at: string | null
        }
        Insert: {
          church_name?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
        }
        Update: {
          church_name?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      incomes: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string | null
          id: string
          service_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          service_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          service_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          baptism_holy_ghost: boolean | null
          baptism_water: boolean | null
          baptism_year: string | null
          church_group: string | null
          contact_address: string | null
          contact_number: string | null
          created_at: string | null
          family_name: string
          foundation_class_date: string | null
          id: string
          individual_names: string
          joining_location: string | null
          marital_status: string | null
          member_type: string | null
          number_of_children: number | null
          profile_photo: string | null
          updated_at: string | null
          wofbi_class_type: string | null
          wofbi_year: string | null
        }
        Insert: {
          baptism_holy_ghost?: boolean | null
          baptism_water?: boolean | null
          baptism_year?: string | null
          church_group?: string | null
          contact_address?: string | null
          contact_number?: string | null
          created_at?: string | null
          family_name: string
          foundation_class_date?: string | null
          id?: string
          individual_names: string
          joining_location?: string | null
          marital_status?: string | null
          member_type?: string | null
          number_of_children?: number | null
          profile_photo?: string | null
          updated_at?: string | null
          wofbi_class_type?: string | null
          wofbi_year?: string | null
        }
        Update: {
          baptism_holy_ghost?: boolean | null
          baptism_water?: boolean | null
          baptism_year?: string | null
          church_group?: string | null
          contact_address?: string | null
          contact_number?: string | null
          created_at?: string | null
          family_name?: string
          foundation_class_date?: string | null
          id?: string
          individual_names?: string
          joining_location?: string | null
          marital_status?: string | null
          member_type?: string | null
          number_of_children?: number | null
          profile_photo?: string | null
          updated_at?: string | null
          wofbi_class_type?: string | null
          wofbi_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_church_group_fkey"
            columns: ["church_group"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      tithes: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          member_id: string
          month: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id?: string
          member_id: string
          month: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          member_id?: string
          month?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tithes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
