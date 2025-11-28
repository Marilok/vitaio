# VitaIO - Next.js Starter

A modern Next.js starter template with TypeScript, Tailwind CSS, Mantine UI, React Hook Form, and Supabase.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Mantine UI v7** - Modern React component library
- **React Hook Form** - Performant form validation
- **Supabase** - Backend as a service (auth, database, storage)

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher (currently running 18.18.0 - upgrade recommended)
- npm or yarn package manager
- A Supabase account and project

### Installation

1. Clone or use this repository

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings:
https://app.supabase.com/project/_/settings/api

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Mantine provider
│   ├── page.tsx            # Homepage with examples
│   ├── providers.tsx       # Mantine theme configuration
│   └── globals.css         # Global styles with Tailwind and Mantine
├── components/
│   └── ExampleForm.tsx     # Example form using all technologies
├── lib/
│   └── supabase/
│       ├── client.ts       # Supabase client for browser
│       ├── server.ts       # Supabase client for server components
│       └── middleware.ts   # Auth middleware helper
├── middleware.ts           # Next.js middleware for auth
└── package.json
```

## Key Features

### Mantine UI Integration

Mantine is fully configured with:

- Theme customization in `/app/providers.tsx`
- ColorSchemeScript for dark mode support
- Notifications system
- All Mantine styles imported in globals.css

### React Hook Form

The example form demonstrates:

- Form validation
- Error handling
- TypeScript integration
- Integration with Mantine components

### Supabase Integration

Three client types are available:

1. **Browser Client** (`/lib/supabase/client.ts`) - For client components
2. **Server Client** (`/lib/supabase/server.ts`) - For server components and actions
3. **Middleware Client** (`/lib/supabase/middleware.ts`) - For authentication middleware

### Authentication Middleware

The middleware automatically:

- Refreshes user sessions
- Manages authentication cookies
- Can redirect unauthenticated users (commented out by default)

## Example Usage

### Creating a Form with React Hook Form + Mantine

```tsx
import { useForm } from "react-hook-form";
import { Button, TextInput } from "@mantine/core";

interface FormValues {
  email: string;
}

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Email"
        {...register("email", { required: "Email is required" })}
        error={errors.email?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Using Supabase in Server Components

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function ServerComponent() {
  const supabase = await createClient();
  const { data } = await supabase.from("your_table").select();

  return <div>{/* render data */}</div>;
}
```

### Using Supabase in Client Components

```tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function ClientComponent() {
  const [data, setData] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("your_table").select();
      setData(data);
    }
    fetchData();
  }, []);

  return <div>{/* render data */}</div>;
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Mantine Theme

Edit `/app/providers.tsx` to customize the Mantine theme:

```tsx
const theme = createTheme({
  primaryColor: "blue",
  // Add your customizations here
});
```

### Tailwind Configuration

The project uses Tailwind CSS v4. Configuration is done in `/app/globals.css` using the `@theme` directive.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Mantine Documentation](https://mantine.dev/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Notes

⚠️ **Important**: This project requires Node.js 20.9.0 or higher. The current environment is running Node.js 18.18.0. Please upgrade to avoid potential issues.

## License

MIT
