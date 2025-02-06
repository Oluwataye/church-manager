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
          created_at: string
          expiry_date: string | null
          id: string
          priority: string | null
          publish_date: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          priority?: string | null
          publish_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          priority?: string | null
          publish_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          attendance_date: string
          created_at: string
          group_id: string | null
          id: string
          member_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attendance_date: string
          created_at?: string
          group_id?: string | null
          id?: string
          member_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          attendance_date?: string
          created_at?: string
          group_id?: string | null
          id?: string
          member_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      church_settings: {
        Row: {
          church_name: string | null
          created_at: string
          id: string
          logo_url: string | null
          updated_at: string
        }
        Insert: {
          church_name?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
        }
        Update: {
          church_name?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string
          id: string
          location: string | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      income: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          updated_at?: string
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
          created_at: string
          family_name: string
          foundation_class_date: string | null
          id: string
          individual_names: string
          joining_location: string | null
          marital_status: string | null
          member_type: string | null
          number_of_children: number | null
          profile_photo: string | null
          updated_at: string
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
          created_at?: string
          family_name: string
          foundation_class_date?: string | null
          id?: string
          individual_names: string
          joining_location?: string | null
          marital_status?: string | null
          member_type?: string | null
          number_of_children?: number | null
          profile_photo?: string | null
          updated_at?: string
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
          created_at?: string
          family_name?: string
          foundation_class_date?: string | null
          id?: string
          individual_names?: string
          joining_location?: string | null
          marital_status?: string | null
          member_type?: string | null
          number_of_children?: number | null
          profile_photo?: string | null
          updated_at?: string
          wofbi_class_type?: string | null
          wofbi_year?: string | null
        }
        Relationships: []
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
