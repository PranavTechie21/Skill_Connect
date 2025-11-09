import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:dsa@localhost:5432/graphicgenie'
});

async function checkSessions() {
  try {
    const result = await pool.query(
      'SELECT sid, sess, expire FROM session ORDER BY expire DESC LIMIT 5'
    );
    
    console.log('Recent sessions in database:');
    result.rows.forEach((row, i) => {
      try {
        // sess might be JSONB (already an object) or JSON string
        const sess = typeof row.sess === 'string' ? JSON.parse(row.sess) : row.sess;
        console.log(`${i+1}. SID: ${row.sid.substring(0, 20)}..., userId: ${sess?.userId || 'N/A'}, Expires: ${row.expire}`);
        console.log(`   Full session data:`, JSON.stringify(sess, null, 2));
      } catch (e) {
        console.log(`${i+1}. SID: ${row.sid.substring(0, 20)}..., sess type: ${typeof row.sess}, Error: ${(e as Error).message}`);
        console.log(`   Raw sess:`, row.sess);
      }
    });
    
    if (result.rows.length === 0) {
      console.log('No sessions found in database');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkSessions();

