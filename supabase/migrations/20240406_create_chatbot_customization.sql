-- Create chatbot_customization table
CREATE TABLE IF NOT EXISTS chatbot_customization (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  primary_color TEXT NOT NULL DEFAULT '#7c3aed',
  secondary_color TEXT NOT NULL DEFAULT '#f3f4f6',
  logo TEXT NOT NULL DEFAULT '🤖',
  name TEXT NOT NULL DEFAULT 'Sprigg AI',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chatbot_customization_updated_at
  BEFORE UPDATE ON chatbot_customization
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO chatbot_customization (primary_color, secondary_color, logo, name)
VALUES ('#7c3aed', '#f3f4f6', '🤖', 'Sprigg AI')
ON CONFLICT DO NOTHING; 