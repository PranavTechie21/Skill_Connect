-- Add approved column if it doesn't exist
ALTER TABLE stories ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;

-- Update all existing stories to be approved
UPDATE stories SET approved = true WHERE approved IS NULL;

-- Make sure all future stories are approved by default
ALTER TABLE stories ALTER COLUMN approved SET DEFAULT true;