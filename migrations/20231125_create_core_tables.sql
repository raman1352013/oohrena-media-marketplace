-- SQL migration: Core tables for OOHRENA Vendor Dashboard
-- Users, Vendors, KYC Documents, Assets, Audits, etc.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  mobile TEXT UNIQUE,
  password_hash TEXT,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  role TEXT NOT NULL CHECK (role IN ('admin','vendor-bm','vendor-go','client','finance','partner')),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vendors (media owners)
CREATE TABLE vendors (
  id TEXT PRIMARY KEY, -- e.g., V-BM
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  initials TEXT,
  kyc_status TEXT NOT NULL CHECK (kyc_status IN ('verified','pending','rejected')),
  gstin TEXT UNIQUE,
  pan TEXT UNIQUE,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- KYC Documents (encrypted storage reference)
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id TEXT REFERENCES vendors(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_key TEXT NOT NULL, -- reference to object storage
  number_masked TEXT,
  valid_to DATE,
  status TEXT NOT NULL CHECK (status IN ('uploaded','verified','rejected')),
  reviewer_id UUID REFERENCES users(id),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assets (Verified Inventory)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_code TEXT UNIQUE NOT NULL,
  vendor_id TEXT REFERENCES vendors(id),
  type_id TEXT NOT NULL,
  title TEXT NOT NULL,
  state TEXT,
  city TEXT,
  locality TEXT,
  address TEXT,
  pincode TEXT,
  geo GEOGRAPHY(Point,4326),
  gps_accuracy_m NUMERIC,
  facing_direction TEXT,
  traffic_towards TEXT,
  width_ft NUMERIC,
  height_ft NUMERIC,
  faces INTEGER,
  illumination TEXT,
  media_format TEXT,
  verification_status TEXT NOT NULL DEFAULT 'draft' CHECK (verification_status IN ('draft','submitted','under_review','verified','reverify_due','expired','rejected','suspended','archived')),
  verified_at TIMESTAMP WITH TIME ZONE,
  reverify_due_date DATE,
  permit_valid_to DATE,
  availability_confidence NUMERIC,
  archived_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Asset media (photos / videos)
CREATE TABLE asset_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('photo','video')),
  file_key TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  phash TEXT,
  exif_lat NUMERIC,
  exif_lng NUMERIC,
  captured_at TIMESTAMP WITH TIME ZONE,
  device_id TEXT,
  distance_from_pin_m NUMERIC,
  is_original BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'original',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit log (append‑only)
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID,
  actor_role TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  before JSONB,
  after JSONB,
  ip INET,
  device TEXT,
  geo POINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for fast search
CREATE INDEX idx_assets_geo ON assets USING GIST (geo);
CREATE INDEX idx_assets_verification_status ON assets (verification_status) WHERE verification_status IN ('verified','reverify_due');

-- Add any additional tables as needed (quotes, bookings, payments, etc.) later.
