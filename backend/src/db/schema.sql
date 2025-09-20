-- ==============================
--  Enable extensions
-- ==============================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "vector";    -- for pgvector

-- ==============================
--  Enums
-- ==============================
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'SUPERVISOR', 'OPERATOR', 'USER');
CREATE TYPE "StockMovementType" AS ENUM ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT');
CREATE TYPE "ManufacturingPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE "CustomerTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');
CREATE TYPE "ManufacturingStatus" AS ENUM ('PLANNED', 'RELEASED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');
CREATE TYPE "WorkOrderStatus" AS ENUM ('PLANNED', 'RELEASED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD');
CREATE TYPE "WorkOrderPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
CREATE TYPE "QualityCheckType" AS ENUM ('INCOMING', 'IN_PROCESS', 'FINAL', 'RANDOM');
CREATE TYPE "QualityStatus" AS ENUM ('PASS', 'FAIL', 'PENDING');
CREATE TYPE "EventType" AS ENUM (
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
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================
--  Core tables
-- ==============================

CREATE TABLE "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_users_set_timestamp
BEFORE UPDATE ON "users"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE "products" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT NOT NULL UNIQUE,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_products_set_timestamp
BEFORE UPDATE ON "products"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE "boms" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_boms_set_timestamp
BEFORE UPDATE ON "boms"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE "bom_items" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "bomId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL CHECK (quantity > 0),
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("bomId","productId"),
    CONSTRAINT "bom_items_bomId_fkey" FOREIGN KEY ("bomId") REFERENCES "boms"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bom_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TRIGGER trg_bom_items_set_timestamp
BEFORE UPDATE ON "bom_items"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE "work_centers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL UNIQUE,
    "capacity" INTEGER NOT NULL DEFAULT 1 CHECK (capacity >= 1),
    "currentWorkload" INTEGER NOT NULL DEFAULT 0 CHECK (currentWorkload >= 0),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "managerId" uuid,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "work_centers_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TRIGGER trg_work_centers_set_timestamp
BEFORE UPDATE ON "work_centers"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE "stock_items" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" uuid NOT NULL,
    "workCenterId" uuid,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    "reservedQty" DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (reservedQty >= 0),
    "minQty" DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (minQty >= 0),
    "maxQty" DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (maxQty >= 0),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("productId","workCenterId"),
    CONSTRAINT "stock_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_items_workCenterId_fkey" FOREIGN KEY ("workCenterId") REFERENCES "work_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TRIGGER trg_stock_items_set_timestamp
BEFORE UPDATE ON "stock_items"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE TABLE "stock_movements" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" uuid NOT NULL,
    "workCenterId" uuid,
    "quantity" DOUBLE PRECISION NOT NULL CHECK (quantity > 0),
    "type" "StockMovementType" NOT NULL,
    "reason" TEXT NOT NULL,
    "reference" TEXT,
    "userId" uuid NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stock_movements_workCenterId_fkey" FOREIGN KEY ("workCenterId") REFERENCES "work_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "stock_movements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Manufacturing Orders
CREATE TABLE "manufacturing_orders" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderNumber" TEXT NOT NULL UNIQUE,
    "productId" uuid NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL CHECK (quantity > 0),
    "priority" "ManufacturingPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "ManufacturingStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "priorityScore" DOUBLE PRECISION,
    "customerTier" "CustomerTier" NOT NULL DEFAULT 'BRONZE',
    "createdById" uuid NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "manufacturing_orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "manufacturing_orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TRIGGER trg_mo_set_timestamp
BEFORE UPDATE ON "manufacturing_orders"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE INDEX idx_mo_status_priority_due ON "manufacturing_orders"(status, priority, dueDate);
CREATE INDEX idx_mo_created_by ON "manufacturing_orders"(createdById);

-- Work Orders
CREATE TABLE "work_orders" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderNumber" TEXT NOT NULL UNIQUE,
    "manufacturingOrderId" uuid NOT NULL,
    "workCenterId" uuid NOT NULL,
    "status" "WorkOrderStatus" NOT NULL DEFAULT 'PLANNED',
    "priority" "WorkOrderPriority" NOT NULL DEFAULT 'NORMAL',
    "plannedStartDate" TIMESTAMP(3),
    "plannedEndDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "assignedUserId" uuid,
    "notes" TEXT,
    "priorityScore" DOUBLE PRECISION,
    "schedulePosition" INTEGER,
    "estimatedDuration" DOUBLE PRECISION,
    "actualDuration" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "work_orders_manufacturingOrderId_fkey" FOREIGN KEY ("manufacturingOrderId") REFERENCES "manufacturing_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_orders_workCenterId_fkey" FOREIGN KEY ("workCenterId") REFERENCES "work_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "work_orders_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TRIGGER trg_wo_set_timestamp
BEFORE UPDATE ON "work_orders"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE INDEX idx_wo_mo ON "work_orders"(manufacturingOrderId);
CREATE INDEX idx_wo_assigned ON "work_orders"(assignedUserId);
CREATE INDEX idx_wo_workcenter ON "work_orders"(workCenterId);

-- Work Order Items
CREATE TABLE "work_order_items" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "workOrderId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL CHECK (quantity >= 0),
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "completedQty" DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (completedQty >= 0),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("workOrderId","productId"),
    CONSTRAINT "work_order_items_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "work_order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TRIGGER trg_wo_items_set_timestamp
BEFORE UPDATE ON "work_order_items"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

-- Quality Checks
CREATE TABLE "quality_checks" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "workOrderId" uuid NOT NULL,
    "checkType" "QualityCheckType" NOT NULL,
    "status" "QualityStatus" NOT NULL,
    "notes" TEXT,
    "checkedBy" uuid NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quality_checks_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "work_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quality_checks_checkedBy_fkey" FOREIGN KEY ("checkedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Events
CREATE TABLE "events" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "type" "EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "userId" uuid,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "eventId" uuid DEFAULT gen_random_uuid(),
    "correlationId" TEXT,
    "topic" TEXT,
    "processed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Vector Documents
CREATE TABLE "vector_documents" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "embedding" vector(1536), -- using pgvector
    "metadata" JSONB,
    "collection" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vector_docs_embedding ON "vector_documents" USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- Search Analytics
CREATE TABLE "search_analytics" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "query" TEXT NOT NULL,
    "resultsCount" INTEGER NOT NULL,
    "userId" uuid,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "search_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Priority Queue
CREATE TABLE "priority_queue" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" uuid NOT NULL,
    "orderType" TEXT NOT NULL,
    "priority" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "workCenterId" uuid,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "priority_queue_workCenterId_fkey" FOREIGN KEY ("workCenterId") REFERENCES "work_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TRIGGER trg_priority_queue_set_timestamp
BEFORE UPDATE ON "priority_queue"
FOR EACH ROW EXECUTE PROCEDURE set_timestamp();

CREATE INDEX idx_priority_queue_order ON "priority_queue"(priority, dueDate);

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
