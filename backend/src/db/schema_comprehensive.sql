-- ==============================
--  Enable extensions
-- ==============================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "vector";    -- for pgvector

-- ==============================
--  Enums
-- ==============================
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'SUPERVISOR', 'OPERATOR', 'USER');
CREATE TYPE stock_movement_type AS ENUM ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT');
CREATE TYPE manufacturing_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE customer_tier AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');
CREATE TYPE manufacturing_status AS ENUM ('PLANNED', 'RELEASED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');
CREATE TYPE work_order_status AS ENUM ('PLANNED', 'RELEASED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');
CREATE TYPE work_order_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE quality_check_type AS ENUM ('INCOMING', 'IN_PROCESS', 'FINAL', 'RANDOM');
CREATE TYPE quality_status AS ENUM ('PASS', 'FAIL', 'PENDING');
CREATE TYPE event_type AS ENUM (
  'MANUFACTURING_ORDER_CREATED','MANUFACTURING_ORDER_UPDATED','MANUFACTURING_ORDER_COMPLETED',
  'WORK_ORDER_CREATED','WORK_ORDER_UPDATED','WORK_ORDER_COMPLETED',
  'STOCK_LOW','STOCK_OUT','QUALITY_ISSUE','SYSTEM_ALERT'
);

-- ==============================
--  Timestamp trigger for updatedAt
-- ==============================
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================
--  Core tables
-- ==============================

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT,
    role user_role NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_users_set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'pcs',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_products_set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE boms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    version TEXT NOT NULL DEFAULT '1.0',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_boms_set_timestamp
BEFORE UPDATE ON boms
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE bom_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bom_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity DOUBLE PRECISION NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL DEFAULT 'pcs',
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (bom_id, product_id),
    CONSTRAINT bom_items_bom_id_fkey FOREIGN KEY (bom_id) REFERENCES boms(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT bom_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TRIGGER trg_bom_items_set_timestamp
BEFORE UPDATE ON bom_items
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE work_centers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    code TEXT NOT NULL UNIQUE,
    capacity INTEGER NOT NULL DEFAULT 1 CHECK (capacity >= 1),
    current_workload INTEGER NOT NULL DEFAULT 0 CHECK (current_workload >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    manager_id uuid,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT work_centers_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TRIGGER trg_work_centers_set_timestamp
BEFORE UPDATE ON work_centers
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE stock_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    work_center_id uuid,
    quantity DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_qty DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (reserved_qty >= 0),
    min_qty DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (min_qty >= 0),
    max_qty DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (max_qty >= 0),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, work_center_id),
    CONSTRAINT stock_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT stock_items_work_center_id_fkey FOREIGN KEY (work_center_id) REFERENCES work_centers(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TRIGGER trg_stock_items_set_timestamp
BEFORE UPDATE ON stock_items
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE stock_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    work_center_id uuid,
    quantity DOUBLE PRECISION NOT NULL CHECK (quantity > 0),
    type stock_movement_type NOT NULL,
    reason TEXT NOT NULL,
    reference TEXT,
    user_id uuid NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT stock_movements_work_center_id_fkey FOREIGN KEY (work_center_id) REFERENCES work_centers(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT stock_movements_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Manufacturing Orders
CREATE TABLE manufacturing_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    product_id uuid NOT NULL,
    quantity DOUBLE PRECISION NOT NULL CHECK (quantity > 0),
    priority manufacturing_priority NOT NULL DEFAULT 'NORMAL',
    status manufacturing_status NOT NULL DEFAULT 'PLANNED',
    start_date TIMESTAMP(3),
    end_date TIMESTAMP(3),
    due_date TIMESTAMP(3) NOT NULL,
    notes TEXT,
    priority_score DOUBLE PRECISION,
    customer_tier customer_tier NOT NULL DEFAULT 'BRONZE',
    created_by_id uuid NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT manufacturing_orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT manufacturing_orders_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TRIGGER trg_mo_set_timestamp
BEFORE UPDATE ON manufacturing_orders
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE INDEX idx_mo_status_priority_due ON manufacturing_orders(status, priority, due_date);
CREATE INDEX idx_mo_created_by ON manufacturing_orders(created_by_id);

-- Work Orders
CREATE TABLE work_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    manufacturing_order_id uuid NOT NULL,
    work_center_id uuid NOT NULL,
    status work_order_status NOT NULL DEFAULT 'PLANNED',
    priority work_order_priority NOT NULL DEFAULT 'NORMAL',
    planned_start_date TIMESTAMP(3),
    planned_end_date TIMESTAMP(3),
    actual_start_date TIMESTAMP(3),
    actual_end_date TIMESTAMP(3),
    assigned_user_id uuid,
    notes TEXT,
    priority_score DOUBLE PRECISION,
    schedule_position INTEGER,
    estimated_duration DOUBLE PRECISION,
    actual_duration DOUBLE PRECISION,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT work_orders_manufacturing_order_id_fkey FOREIGN KEY (manufacturing_order_id) REFERENCES manufacturing_orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT work_orders_work_center_id_fkey FOREIGN KEY (work_center_id) REFERENCES work_centers(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT work_orders_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TRIGGER trg_wo_set_timestamp
BEFORE UPDATE ON work_orders
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE INDEX idx_wo_mo ON work_orders(manufacturing_order_id);
CREATE INDEX idx_wo_assigned ON work_orders(assigned_user_id);
CREATE INDEX idx_wo_workcenter ON work_orders(work_center_id);

-- Work Order Items
CREATE TABLE work_order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity DOUBLE PRECISION NOT NULL CHECK (quantity >= 0),
    unit TEXT NOT NULL DEFAULT 'pcs',
    completed_qty DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (completed_qty >= 0),
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (work_order_id, product_id),
    CONSTRAINT work_order_items_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT work_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TRIGGER trg_wo_items_set_timestamp
BEFORE UPDATE ON work_order_items
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

-- Quality Checks
CREATE TABLE quality_checks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id uuid NOT NULL,
    check_type quality_check_type NOT NULL,
    status quality_status NOT NULL,
    notes TEXT,
    checked_by uuid NOT NULL,
    checked_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT quality_checks_work_order_id_fkey FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT quality_checks_checked_by_fkey FOREIGN KEY (checked_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Events
CREATE TABLE events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type event_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    user_id uuid,
    is_read BOOLEAN NOT NULL DEFAULT false,
    event_id uuid DEFAULT gen_random_uuid(),
    correlation_id TEXT,
    topic TEXT,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Vector Documents
CREATE TABLE vector_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding vector(1536), -- using pgvector
    metadata JSONB,
    collection TEXT NOT NULL,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vector_docs_embedding ON vector_documents USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- Search Analytics
CREATE TABLE search_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    results_count INTEGER NOT NULL,
    user_id uuid,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT search_analytics_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Priority Queue
CREATE TABLE priority_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    order_type TEXT NOT NULL,
    priority DOUBLE PRECISION NOT NULL,
    due_date TIMESTAMP(3) NOT NULL,
    work_center_id uuid,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT priority_queue_work_center_id_fkey FOREIGN KEY (work_center_id) REFERENCES work_centers(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TRIGGER trg_priority_queue_set_timestamp
BEFORE UPDATE ON priority_queue
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE INDEX idx_priority_queue_order ON priority_queue(priority, due_date);

-- ==============================
--  Reliability & Audit
-- ==============================
CREATE TABLE outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aggregate_type TEXT,
  aggregate_id TEXT,
  topic TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_outbox_unpublished ON outbox_events(published, created_at);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action TEXT NOT NULL,
  resource TEXT,
  resource_id TEXT,
  detail JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);

-- ==============================
--  Optional RBAC (roles/permissions)
-- ==============================
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  label TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  resource TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(action, resource)
);

CREATE TABLE role_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY(role_id, permission_id)
);

CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  scope JSONB,
  UNIQUE(user_id, role_id)
);

-- ==============================
--  Initial Data
-- ==============================
INSERT INTO users (id, email, password, name, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'admin@example.com', '$2a$12$rZnrCg8WW.2XnIWJx1x8FO8e8aMKBJGUYOG6m5.3D1k.KgK8k8k8k', 'Administrator', 'ADMIN'),
('22222222-2222-2222-2222-222222222222', 'manager@example.com', '$2a$12$rZnrCg8WW.2XnIWJx1x8FO8e8aMKBJGUYOG6m5.3D1k.KgK8k8k8k', 'Manager', 'MANAGER'),
('33333333-3333-3333-3333-333333333333', 'operator@example.com', '$2a$12$rZnrCg8WW.2XnIWJx1x8FO8e8aMKBJGUYOG6m5.3D1k.KgK8k8k8k', 'Operator', 'OPERATOR');

INSERT INTO products (id, name, description, sku, category) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Widget A', 'Basic widget component', 'WIDGET-A-001', 'Components'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Assembly B', 'Complete assembly unit', 'ASSEMBLY-B-001', 'Assemblies'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Raw Material C', 'Basic raw material', 'RAW-C-001', 'Materials');

INSERT INTO work_centers (id, name, description, code, capacity) VALUES 
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Assembly Line 1', 'Main assembly line', 'AL-001', 10),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Quality Control', 'Quality inspection station', 'QC-001', 5),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Packaging', 'Final packaging station', 'PKG-001', 8);

INSERT INTO stock_items (product_id, work_center_id, quantity, min_qty, max_qty) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 100, 20, 500),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 50, 10, 200),
('cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 1000, 100, 5000);

INSERT INTO boms (id, name, description, version) VALUES
('77777777-7777-7777-7777-777777777777', 'Widget A BOM', 'Bill of Materials for Widget A', '1.0');

INSERT INTO bom_items (bom_id, product_id, quantity, unit) VALUES
('77777777-7777-7777-7777-777777777777', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 2.5, 'kg');