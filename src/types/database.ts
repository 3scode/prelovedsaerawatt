export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string;
          sku: string;
          price: number;
          size: string;
          category: string;
          description: string;
          defect_notes: string | null;
          images: string[];
          status: boolean;
          created_by: string | null;
          request_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          slug: string;
          sku?: string;
          price: number;
          size: string;
          category: string;
          description: string;
          defect_notes?: string | null;
          images: string[];
          status?: boolean;
          created_by?: string | null;
          request_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          slug?: string;
          sku?: string;
          price?: number;
          size?: string;
          category?: string;
          description?: string;
          defect_notes?: string | null;
          images?: string[];
          status?: boolean;
          created_by?: string | null;
          request_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
