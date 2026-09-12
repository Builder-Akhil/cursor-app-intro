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
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          hope: string | null
          stuck: string | null
          becoming: string | null
          nature_place: string | null
          season_word: string | null
          category: "seeker" | "builder" | "healer" | "wanderer" | null
          onboarding_complete: boolean
          ambience_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          email: string
          hope?: string | null
          stuck?: string | null
          becoming?: string | null
          nature_place?: string | null
          season_word?: string | null
          category?: "seeker" | "builder" | "healer" | "wanderer" | null
          onboarding_complete?: boolean
          ambience_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          hope?: string | null
          stuck?: string | null
          becoming?: string | null
          nature_place?: string | null
          season_word?: string | null
          category?: "seeker" | "builder" | "healer" | "wanderer" | null
          onboarding_complete?: boolean
          ambience_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      entries: {
        Row: {
          id: string
          user_id: string
          type: "story" | "vision"
          status: "ready" | "generating" | "failed"
          source: "template" | "ai"
          title: string
          body: string
          prompt: string | null
          image_url: string | null
          image_path: string | null
          answers_snapshot: Json
          category_snapshot: "seeker" | "builder" | "healer" | "wanderer"
          model: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "story" | "vision"
          status?: "ready" | "generating" | "failed"
          source?: "template" | "ai"
          title: string
          body?: string
          prompt?: string | null
          image_url?: string | null
          image_path?: string | null
          answers_snapshot?: Json
          category_snapshot: "seeker" | "builder" | "healer" | "wanderer"
          model?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "story" | "vision"
          status?: "ready" | "generating" | "failed"
          source?: "template" | "ai"
          title?: string
          body?: string
          prompt?: string | null
          image_url?: string | null
          image_path?: string | null
          answers_snapshot?: Json
          category_snapshot?: "seeker" | "builder" | "healer" | "wanderer"
          model?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          email: string
          joined_at: string
        }
        Insert: {
          email: string
          joined_at?: string
        }
        Update: {
          email?: string
          joined_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
