# Tirta "Kikuk" Afandi - Personal Portfolio & Digital Storefront

A full-stack personal portfolio website with blog and digital product storefront featuring automated payments via OY! Indonesia.

## Features

- **Portfolio Showcase**: Display projects with descriptions, tech stacks, and live demos
- **Blog System**: Write and publish blog posts with markdown support
- **Digital Products**: Sell digital products with automated payment processing
- **Payment Integration**: OY! Indonesia payment gateway (VA, QRIS, Payment Link)
- **Admin Dashboard**: Complete CRUD management for all content
- **Email Notifications**: Automated invoice and download link delivery
- **Glassmorphism UI**: Premium dark gradient design with glassmorphism effects
- **Secure Authentication**: NextAuth v5 with admin-only access

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5
- **Payment**: OY! Indonesia
- **Email**: Nodemailer / Resend
- **Validation**: Zod

## Project Structure

```
/app
  /api
    /auth/[...nextauth]    # NextAuth routes
    /projects              # Projects CRUD API
    /blogs                 # Blogs CRUD API
    /products              # Products CRUD API
    /transactions          # Transactions API
    /checkout              # Checkout/purchase API
    /payments/oy/callback  # OY! webhook handler
  /admin                   # Admin dashboard
    /projects              # Manage projects
    /blogs                 # Manage blogs
    /products              # Manage products
    /transactions          # View transactions
  /blog                    # Public blog pages
  /projects                # Public projects pages
  /products                # Public products pages
  /login                   # Hidden admin login
  page.tsx                 # Landing page
/components
  /ui                      # Reusable UI components
  ProjectCard.tsx
  BlogCard.tsx
  ProductCard.tsx
/lib
  prisma.ts               # Prisma client singleton
  auth.ts                 # NextAuth configuration
  oyService.ts            # OY! payment service
  mailer.ts               # Email service
/prisma
  schema.prisma           # Database schema
/scripts
  seed-admin.ts           # Admin user seeder
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OY! Indonesia account (for payments)
- Email service (SMTP or Resend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kikukafandi/web_porto.git
cd web_porto
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/web_porto"

# NextAuth
NEXTAUTH_SECRET="generate-a-secure-random-string-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"

# OY! Indonesia
OY_API_KEY="your-oy-api-key"
OY_BASE_URL="https://api-stg.oyindonesia.com"
OY_CALLBACK_SECRET="your-callback-secret"

# Email Service
EMAIL_PROVIDER="smtp"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@example.com"
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Seed the admin user:
```bash
npx tsx scripts/seed-admin.ts
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Admin Access

The admin panel is intentionally hidden from public navigation for security.

- **Admin Login**: Navigate directly to `/login`
- **Admin Dashboard**: After login, access `/admin`
- **Default Credentials**: Use the ADMIN_EMAIL and ADMIN_PASSWORD from your `.env`

**Important**: There is no public registration. Only the seeded admin account can access the admin panel.

## Database Schema

### Models

- **User**: Admin users with role-based access
- **Project**: Portfolio projects with tech stack, demos, and repos
- **Blog**: Blog posts with slug, tags, and markdown content
- **Product**: Digital products with pricing and file URLs
- **Transaction**: Payment transactions with status tracking
- **CallbackLog**: Audit log for payment callbacks

## Payment Flow

1. Customer visits product page and clicks "Buy Now"
2. Customer enters email (and optional name)
3. System creates transaction with PENDING status
4. System calls OY! API to create payment
5. Customer is redirected to OY! payment page
6. Customer completes payment (VA, QRIS, etc.)
7. OY! sends callback to `/api/payments/oy/callback`
8. System verifies callback and updates transaction to PAID
9. System sends invoice email with secure download link
10. System sends notification to admin

## API Routes

### Public Routes

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `GET /api/blogs` - List all blogs
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `GET /api/products` - List active products
- `GET /api/products/:id` - Get product details
- `POST /api/checkout` - Create checkout/transaction

### Admin Routes (Require Authentication)

- `POST /api/projects` - Create project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/blogs` - Create blog
- `PATCH /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/products` - Create product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/transactions` - List transactions
- `GET /api/transactions/:id` - Get transaction details

### Webhook Routes

- `POST /api/payments/oy/callback` - OY! payment callback handler

## Development

### Code Style

This project follows **Clear Flow Programming Style**:
- Simple, clean, flat code flow
- Honest, descriptive naming
- Minimal nesting - prefer early returns
- Single responsibility functions
- Fully typed TypeScript

### Testing OY! Callbacks

To test payment callbacks locally:

1. Use ngrok or similar to expose local server:
```bash
ngrok http 3000
```

2. Update `NEXTAUTH_URL` in `.env` to your ngrok URL

3. Configure OY! dashboard callback URL to: `https://your-ngrok-url.ngrok.io/api/payments/oy/callback`

4. Create a test transaction and complete payment

5. Check logs and database for callback processing

### Email Testing

For development, you can use:
- **Mailhog**: Local SMTP server
- **Mailtrap**: Email testing service
- **Gmail**: With app-specific password

## Production Deployment

### Environment Variables

Ensure all production environment variables are set:
- Use a strong `NEXTAUTH_SECRET` (min 32 chars)
- Use production OY! API credentials
- Use production database URL
- Configure proper email service

### Database Migration

```bash
npx prisma migrate deploy
```

### Build

```bash
npm run build
npm start
```

## Security Considerations

- Admin login is hidden (no public links)
- No public registration
- API routes protected with NextAuth sessions
- Payment callbacks verified (signature/IP)
- All callbacks logged for audit trail
- Secure download links with expiry (implement token-based)

## License

MIT License - feel free to use this template for your own portfolio!

## Author

**Tirta "Kikuk" Afandi** - Backend Engineer

## Support

For issues or questions, please open an issue on GitHub.
