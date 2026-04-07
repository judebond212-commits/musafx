-- ============================================================
--  MusaFX – Supabase / PostgreSQL Schema
--  Run this in your Supabase SQL Editor (or psql)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
--  TABLE: accounts
--  One row per registered user.
-- ============================================================
CREATE TABLE IF NOT EXISTS accounts (
  "userID"               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Auth
  "Email"                TEXT          NOT NULL UNIQUE,
  "PWord"                TEXT          NOT NULL,          -- bcrypt hash

  -- Profile
  "FName"                TEXT          NOT NULL,
  "LName"                TEXT          NOT NULL,
  "Country"              TEXT          NOT NULL DEFAULT '',
  "ST"                   TEXT          NOT NULL DEFAULT '',  -- State
  "AD"                   TEXT          NOT NULL DEFAULT '',  -- Address

  -- Investment
  "investmentPlan"       TEXT          NOT NULL DEFAULT '',
  "investmentAmount"     NUMERIC(18,2) NOT NULL DEFAULT 0,
  "investmentDate"       TIMESTAMPTZ,

  -- Flags (stored as text to match existing app logic)
  "InvestMentEnabled"    TEXT          NOT NULL DEFAULT 'false',
  "firstBillingEnabled"  TEXT          NOT NULL DEFAULT 'false',
  "AccountEnabled"       TEXT          NOT NULL DEFAULT 'true',

  -- Audit
  "createdAt"            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Index for fast email look-ups
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts ("Email");


-- ============================================================
--  TABLE: transactions
--  Covers both investments and withdrawal requests.
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  "id"              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership
  "userID"          UUID          NOT NULL REFERENCES accounts("userID") ON DELETE CASCADE,
  "email"           TEXT          NOT NULL,               -- denormalised for quick admin display

  -- Type: 'investment' | 'withdrawal'
  "paymentfor"      TEXT          NOT NULL
                      CHECK ("paymentfor" IN ('investment', 'withdrawal')),

  -- Financials
  "amount"          NUMERIC(18,2) NOT NULL,
  "paymentMethod"   TEXT          NOT NULL,               -- 'Bitcoin (BTC)', 'USDT (TRC20)', etc.

  -- Investment-specific
  "plan"            TEXT,                                 -- 'starter' | 'growth' | 'elite'
  "screenshot"      TEXT,                                 -- URL of payment proof image

  -- Withdrawal-specific
  "walletAddress"   TEXT,                                 -- crypto address or bank details

  -- Status (text to match app logic)
  "confirmed"       TEXT          NOT NULL DEFAULT 'false',

  -- Audit
  "createdAt"       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_userID    ON transactions ("userID");
CREATE INDEX IF NOT EXISTS idx_transactions_email     ON transactions ("email");
CREATE INDEX IF NOT EXISTS idx_transactions_payfor    ON transactions ("paymentfor");
CREATE INDEX IF NOT EXISTS idx_transactions_confirmed ON transactions ("confirmed");


-- ============================================================
--  TABLE: password_reset_tokens
--  One-time tokens for forgot-password email links.
-- ============================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  "userID"        UUID          NOT NULL REFERENCES accounts("userID") ON DELETE CASCADE,
  "tokenHash"     TEXT          NOT NULL,
  "expiresAt"     TIMESTAMPTZ   NOT NULL,
  "usedAt"        TIMESTAMPTZ,
  "createdAt"     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_password_reset_token_hash ON password_reset_tokens ("tokenHash");
CREATE INDEX IF NOT EXISTS idx_password_reset_user ON password_reset_tokens ("userID");


-- ============================================================
--  AUTO-UPDATE updatedAt trigger (shared helper)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
--  ROW LEVEL SECURITY (Supabase)
--  Service-role key bypasses all RLS – the Next.js backend
--  uses supabaseAdmin (service role) so these policies guard
--  any direct anon/client connections.
-- ============================================================
ALTER TABLE accounts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Deny all anon access (service role bypasses this automatically)
CREATE POLICY "deny_anon_accounts"
  ON accounts FOR ALL TO anon USING (false);

CREATE POLICY "deny_anon_transactions"
  ON transactions FOR ALL TO anon USING (false);

CREATE POLICY "deny_anon_password_reset_tokens"
  ON password_reset_tokens FOR ALL TO anon USING (false);


-- ============================================================
--  SEED: optional dev test account
--  Password is "musafx1234" – change before going to prod!
-- ============================================================
-- INSERT INTO accounts ("Email","PWord","FName","LName","AccountEnabled")
-- VALUES (
--   'test@musafx.com',
--   '$2a$10$placeholderHashReplaceMeWithRealBcryptHash',
--   'Test',
--   'User',
--   'true'
-- );
