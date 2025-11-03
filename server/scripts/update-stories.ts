import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function updateStories() {
  try {
    // Add approved column if it doesn't exist
    await db.execute(sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'stories' AND column_name = 'approved'
        ) THEN 
          ALTER TABLE stories ADD COLUMN approved BOOLEAN DEFAULT true;
        END IF;
      END $$;
    `);

    // Update all existing stories to be approved
    await db.execute(sql`UPDATE stories SET approved = true WHERE approved IS NULL`);

    // Make sure all future stories are approved by default
    await db.execute(sql`ALTER TABLE stories ALTER COLUMN approved SET DEFAULT true`);

    console.log('Successfully updated stories table!');
  } catch (error) {
    console.error('Error updating stories table:', error);
  } finally {
    process.exit(0);
  }
}

updateStories();