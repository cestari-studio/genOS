-- Enable pgvector extension for RAG embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Content embeddings table for RAG vector search
CREATE TABLE IF NOT EXISTS cestari.content_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES cestari.organizations(id),
  source_id text NOT NULL,
  source_type varchar(50) NOT NULL, -- 'brand', 'content_item', 'post'
  content_text text NOT NULL,
  embedding vector(768) NOT NULL, -- Granite embedding dimension
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (org_id, source_id, source_type)
);

CREATE INDEX IF NOT EXISTS idx_content_embeddings_org ON cestari.content_embeddings(org_id);
CREATE INDEX IF NOT EXISTS idx_content_embeddings_source ON cestari.content_embeddings(source_type);

-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS idx_content_embeddings_vector
  ON cestari.content_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS trg_content_embeddings_updated ON cestari.content_embeddings;
CREATE TRIGGER trg_content_embeddings_updated
  BEFORE UPDATE ON cestari.content_embeddings
  FOR EACH ROW EXECUTE FUNCTION cestari.fn_update_timestamp();

-- RLS policies
ALTER TABLE cestari.content_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_embeddings_org_isolation ON cestari.content_embeddings
  USING (org_id = (SELECT cestari.get_user_org_id()));

-- RPC function for similarity search
CREATE OR REPLACE FUNCTION cestari.match_content_embeddings(
  query_embedding vector(768),
  match_org_id uuid,
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 5,
  filter_source_types text[] DEFAULT NULL
)
RETURNS TABLE (
  source_id text,
  source_type varchar(50),
  content_text text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.source_id,
    ce.source_type,
    ce.content_text,
    ce.metadata,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM cestari.content_embeddings ce
  WHERE ce.org_id = match_org_id
    AND (filter_source_types IS NULL OR ce.source_type = ANY(filter_source_types))
    AND 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
