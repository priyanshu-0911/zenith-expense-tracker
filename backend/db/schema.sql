-- backend/db/schema.sql

-- Table for Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_pw VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'free', -- 'free', 'premium', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Categories (e.g., Food, Transport, Utilities)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#60A5FA', -- Hex color for UI representation
    UNIQUE (user_id, name) -- A user cannot have two categories with the same name
);

-- Table for Receipts
CREATE TABLE IF NOT EXISTS receipts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    merchant VARCHAR(255),
    total NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD', -- For future multi-currency support
    raw_text TEXT, -- Raw OCR output
    ocr_source VARCHAR(50), -- e.g., 'Google Vision', 'Tesseract'
    file_url VARCHAR(255), -- URL to the stored image/PDF
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL, -- Optional category
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Line Items (detailed items on a receipt)
CREATE TABLE IF NOT EXISTS line_items (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER REFERENCES receipts(id) ON DELETE CASCADE,
    description VARCHAR(255),
    quantity INTEGER,
    amount NUMERIC(10, 2) NOT NULL
);

-- Table for Embeddings (for AI natural language queries)
CREATE TABLE IF NOT EXISTS embeddings (
    receipt_id INTEGER UNIQUE REFERENCES receipts(id) ON DELETE CASCADE,
    -- Using array of FLOAT8 for vector, assuming 1536 dimensions
    vector FLOAT8[1536] NOT NULL
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_receipts_user_date ON receipts (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_user_category ON receipts (user_id, category_id);
CREATE INDEX IF NOT EXISTS idx_line_items_receipt_id ON line_items (receipt_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories (user_id);