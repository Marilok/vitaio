# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### How to Get Supabase Credentials

1. Go to [Supabase](https://app.supabase.com/)
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Node.js Version

⚠️ **Important**: This project requires Node.js 20.9.0 or higher.

Current Node.js version detected: 18.18.0

Please upgrade Node.js to avoid compatibility issues:

### Using nvm (recommended):
```bash
nvm install 20
nvm use 20
```

### Or download from:
https://nodejs.org/

## Installation

After setting up environment variables and ensuring you have the correct Node.js version:

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Optional: Set up Supabase Database

If you want to test database operations:

1. In your Supabase project dashboard, go to **SQL Editor**
2. Create a test table:

```sql
-- Example: Create a users profile table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
```

## Troubleshooting

### Module Not Found Errors

If you see TypeScript errors about missing modules after installation:

1. Restart your development server
2. Restart your IDE/editor
3. Clear Next.js cache: `rm -rf .next`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

### Authentication Not Working

1. Verify your environment variables are correct
2. Check that `.env.local` is in the root directory
3. Make sure you've enabled Email/Password authentication in Supabase:
   - Go to **Authentication** → **Providers**
   - Enable **Email** provider

### Build Errors

If you encounter build errors related to Node.js version, please upgrade to Node.js 20.9.0 or higher.

