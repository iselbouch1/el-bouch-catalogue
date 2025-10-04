-- Schema initialization for EL Bouch Auto

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id UUID NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description VARCHAR(1000),
    description VARCHAR(10000),
    is_visible BOOLEAN NOT NULL,
    is_featured BOOLEAN,
    sort_order INTEGER,
    specs_json VARCHAR(20000),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY,
    url VARCHAR(2000) NOT NULL,
    alt VARCHAR(1000),
    is_cover BOOLEAN NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_categories (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

CREATE TABLE IF NOT EXISTS product_tags (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);
