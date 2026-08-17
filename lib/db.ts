// lib/db.ts
import { Pool } from 'pg';

// This is a "Singleton" - it ensures the robot doesn't open too many 
// doors to the filing cabinet at once, which could break it.
const globalForPg = global as unknown as { pgPool: Pool };

const pool = globalForPg.pgPool || new Pool({
  connectionString: process.env.DATABASE_URL, // This uses your secret address!
  max: 20, 
  idleTimeoutMillis: 30000,
});

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}

export default pool;
