-- Enable pgvector extension for vector search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector_documents table for vector search
CREATE TABLE IF NOT EXISTS vector_documents (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(1536), -- OpenAI ada-002 dimension
    metadata JSONB,
    collection TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS vector_documents_embedding_idx 
ON vector_documents USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create index for collection filtering
CREATE INDEX IF NOT EXISTS vector_documents_collection_idx 
ON vector_documents (collection);

-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    query TEXT NOT NULL,
    results_count INTEGER NOT NULL,
    user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for search analytics
CREATE INDEX IF NOT EXISTS search_analytics_created_at_idx 
ON search_analytics (created_at);

-- Create priority queue table
CREATE TABLE IF NOT EXISTS priority_queue (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('MANUFACTURING_ORDER', 'WORK_ORDER')),
    priority FLOAT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    work_center_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for priority queue ordering
CREATE INDEX IF NOT EXISTS priority_queue_priority_idx 
ON priority_queue (priority DESC, due_date ASC);

-- Create index for work center filtering
CREATE INDEX IF NOT EXISTS priority_queue_work_center_idx 
ON priority_queue (work_center_id);

-- Add priority score columns to existing tables
ALTER TABLE manufacturing_orders 
ADD COLUMN IF NOT EXISTS priority_score FLOAT,
ADD COLUMN IF NOT EXISTS customer_tier TEXT DEFAULT 'BRONZE' 
CHECK (customer_tier IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM'));

ALTER TABLE work_orders 
ADD COLUMN IF NOT EXISTS priority_score FLOAT,
ADD COLUMN IF NOT EXISTS schedule_position INTEGER,
ADD COLUMN IF NOT EXISTS estimated_duration FLOAT,
ADD COLUMN IF NOT EXISTS actual_duration FLOAT;

ALTER TABLE work_centers 
ADD COLUMN IF NOT EXISTS current_workload INTEGER DEFAULT 0;

-- Create indexes for priority scoring
CREATE INDEX IF NOT EXISTS manufacturing_orders_priority_score_idx 
ON manufacturing_orders (priority_score DESC);

CREATE INDEX IF NOT EXISTS work_orders_priority_score_idx 
ON work_orders (priority_score DESC);

CREATE INDEX IF NOT EXISTS work_orders_schedule_position_idx 
ON work_orders (schedule_position ASC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vector_documents_updated_at 
    BEFORE UPDATE ON vector_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_priority_queue_updated_at 
    BEFORE UPDATE ON priority_queue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION search_similar_documents(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10,
    filter_collection text DEFAULT NULL
)
RETURNS TABLE (
    id text,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE sql
AS $$
    SELECT 
        vector_documents.id,
        vector_documents.content,
        vector_documents.metadata,
        1 - (vector_documents.embedding <=> query_embedding) as similarity
    FROM vector_documents
    WHERE 
        (filter_collection IS NULL OR vector_documents.collection = filter_collection)
        AND 1 - (vector_documents.embedding <=> query_embedding) > match_threshold
    ORDER BY vector_documents.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create function to get priority queue
CREATE OR REPLACE FUNCTION get_priority_queue(
    work_center_filter text DEFAULT NULL,
    limit_count int DEFAULT 50
)
RETURNS TABLE (
    id text,
    order_id text,
    order_type text,
    priority float,
    due_date timestamp with time zone,
    work_center_id text
)
LANGUAGE sql
AS $$
    SELECT 
        priority_queue.id,
        priority_queue.order_id,
        priority_queue.order_type,
        priority_queue.priority,
        priority_queue.due_date,
        priority_queue.work_center_id
    FROM priority_queue
    WHERE 
        (work_center_filter IS NULL OR priority_queue.work_center_id = work_center_filter)
    ORDER BY priority_queue.priority DESC, priority_queue.due_date ASC
    LIMIT limit_count;
$$;
