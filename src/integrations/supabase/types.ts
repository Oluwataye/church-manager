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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
