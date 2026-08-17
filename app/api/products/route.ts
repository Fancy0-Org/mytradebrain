// app/api/products/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 1. FETCH: Getting your list of items
export async function GET() {
  try {
    const query = 'SELECT * FROM products ORDER BY created_at DESC;';
    const { rows } = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'The robot couldn’t reach the filing cabinet' }, { status: 500 });
  }
}

// 2. SAVE: Adding a new item to your catalog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { item_code, description, assessed_value_usd, supplier_price, supplier_currency } = body;

    const query = `
      INSERT INTO products (item_code, description, assessed_value_usd, supplier_price, supplier_currency)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [item_code, description, assessed_value_usd, supplier_price, supplier_currency];
    const { rows } = await pool.query(query, values);

    return NextResponse.json({ success: true, product: rows });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'The robot failed to save your item' }, { status: 500 });
  }
}
