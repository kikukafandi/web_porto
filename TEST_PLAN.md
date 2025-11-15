# Test Plan for Web Portfolio Application

## Overview
This document outlines the testing strategy for the personal portfolio and digital product storefront application.

## Test Environment Setup

### Local Development
1. Start PostgreSQL database
2. Run `npm install`
3. Copy `.env.example` to `.env` and configure
4. Run `npm run db:migrate`
5. Run `npm run seed:admin`
6. Start dev server: `npm run dev`

### Testing Payment Webhooks
1. Install ngrok: `npm install -g ngrok`
2. Start ngrok: `ngrok http 3000`
3. Update `NEXTAUTH_URL` in `.env` with ngrok URL
4. Configure OY! callback URL in dashboard

## Test Cases

### 1. Authentication Flow

#### TC-1.1: Admin Login
**Steps:**
1. Navigate to `/login`
2. Enter admin email and password
3. Click "Sign In"

**Expected Result:**
- Redirected to `/admin`
- Admin dashboard displays

**Test Data:**
- Email: Value from `ADMIN_EMAIL` env var
- Password: Value from `ADMIN_PASSWORD` env var

#### TC-1.2: Invalid Login
**Steps:**
1. Navigate to `/login`
2. Enter incorrect credentials
3. Click "Sign In"

**Expected Result:**
- Error message displayed
- Remain on login page

#### TC-1.3: Protected Route Access
**Steps:**
1. Without logging in, navigate to `/admin`

**Expected Result:**
- Redirected to `/login`

#### TC-1.4: Admin Logout
**Steps:**
1. Login as admin
2. Click "Sign Out" button

**Expected Result:**
- Redirected to home page
- Session cleared
- Cannot access `/admin` without re-login

### 2. Project Management

#### TC-2.1: Create Project
**Steps:**
1. Login as admin
2. Navigate to `/admin/projects`
3. Click "Add Project"
4. Fill in all required fields
5. Click "Create"

**Expected Result:**
- Project created successfully
- Appears in project list
- Visible on public `/projects` page

**Test Data:**
```json
{
  "title": "Test Project",
  "description": "A test project description",
  "techStack": "React, TypeScript, Node.js",
  "thumbnailUrl": "https://via.placeholder.com/400x300",
  "demoUrl": "https://example.com/demo",
  "repoUrl": "https://github.com/test/repo"
}
```

#### TC-2.2: Edit Project
**Steps:**
1. Navigate to `/admin/projects`
2. Click "Edit" on existing project
3. Modify fields
4. Click "Update"

**Expected Result:**
- Project updated successfully
- Changes reflected in project list
- Changes visible on public page

#### TC-2.3: Delete Project
**Steps:**
1. Navigate to `/admin/projects`
2. Click "Delete" on a project
3. Confirm deletion

**Expected Result:**
- Project deleted from database
- Removed from project list
- No longer visible on public page

### 3. Blog Management

#### TC-3.1: Create Blog Post
**Steps:**
1. Navigate to `/admin/blogs`
2. Click "Add Blog Post"
3. Fill in all required fields
4. Click "Create"

**Expected Result:**
- Blog post created
- Slug is URL-friendly
- Accessible at `/blog/[slug]`

**Test Data:**
```json
{
  "title": "Test Blog Post",
  "slug": "test-blog-post",
  "content": "This is a test blog post with markdown support.",
  "coverImage": "https://via.placeholder.com/800x400",
  "tags": "nextjs, typescript, testing"
}
```

#### TC-3.2: Auto-generate Slug
**Steps:**
1. Navigate to `/admin/blogs`
2. Click "Add Blog Post"
3. Enter title but not slug
4. Observe slug field

**Expected Result:**
- Slug auto-generated from title
- Special characters converted to hyphens
- Lowercase format

#### TC-3.3: Duplicate Slug Prevention
**Steps:**
1. Create blog with slug "test-post"
2. Try to create another blog with same slug

**Expected Result:**
- Error message displayed
- Second blog not created

### 4. Product & Payment Flow

#### TC-4.1: Create Product
**Steps:**
1. Navigate to `/admin/products`
2. Click "Add Product"
3. Fill in all fields
4. Click "Create"

**Expected Result:**
- Product created
- Visible on `/products` page

**Test Data:**
```json
{
  "title": "Test Digital Product",
  "description": "A test product for sale",
  "price": "50000",
  "fileUrl": "https://example.com/file.zip",
  "thumbnailUrl": "https://via.placeholder.com/400x300",
  "isActive": true
}
```

#### TC-4.2: Inactive Product Hidden
**Steps:**
1. Create product with `isActive: false`
2. Visit `/products` page

**Expected Result:**
- Product not visible to public
- Visible in admin products list

#### TC-4.3: Checkout Process
**Steps:**
1. Visit `/products/[id]` for an active product
2. Enter email address
3. (Optional) Enter name
4. Click "Proceed to Payment"

**Expected Result:**
- Transaction created with PENDING status
- OY! payment created
- Redirected to OY! payment page

**Test Data:**
- Email: test@example.com
- Name: Test User

#### TC-4.4: Payment Callback (Simulated)
**Steps:**
1. Create a transaction via checkout
2. Send POST request to `/api/payments/oy/callback` with test payload

**Expected Result:**
- Transaction status updated to PAID
- Callback logged in CallbackLog
- Invoice email sent to buyer
- Admin notification sent

**Test Payload:**
```json
{
  "partner_tx_id": "[transaction-id]",
  "status": "success",
  "payment_method": "QRIS",
  "amount": 50000
}
```

**Verification:**
1. Check transaction status in admin panel
2. Check email inbox (buyer and admin)
3. Check CallbackLog in database

#### TC-4.5: Idempotency Test
**Steps:**
1. Send same callback payload twice

**Expected Result:**
- First callback processes normally
- Second callback ignored (already PAID)
- Only one email sent

### 5. Public Pages

#### TC-5.1: Landing Page
**Steps:**
1. Visit `/`

**Expected Result:**
- Hero section displays
- About, Skills, Experience sections visible
- Featured projects (if any) displayed
- All links functional

#### TC-5.2: Projects Page
**Steps:**
1. Visit `/projects`

**Expected Result:**
- All projects displayed in grid
- Project cards show correct info
- Links to demos/repos work

#### TC-5.3: Blog List Page
**Steps:**
1. Visit `/blog`

**Expected Result:**
- All blog posts listed
- Sorted by date (newest first)
- Tags displayed correctly

#### TC-5.4: Blog Detail Page
**Steps:**
1. Visit `/blog/[slug]`

**Expected Result:**
- Blog content displays
- Cover image shows (if exists)
- Tags displayed
- Back link works

#### TC-5.5: Products Page
**Steps:**
1. Visit `/products`

**Expected Result:**
- Only active products shown
- Prices formatted correctly (IDR)
- Product cards link to detail pages

### 6. Email Delivery

#### TC-6.1: Invoice Email
**Steps:**
1. Complete a successful payment
2. Check buyer's email

**Expected Result:**
- Email received
- Contains product details
- Contains download link
- Professional formatting

#### TC-6.2: Admin Notification
**Steps:**
1. Complete a successful payment
2. Check admin email

**Expected Result:**
- Email received
- Contains sale details
- Shows buyer info

### 7. UI/UX

#### TC-7.1: Glassmorphism Styling
**Steps:**
1. Visit all public pages
2. Observe design elements

**Expected Result:**
- Dark gradient background
- Glass effect on cards
- Consistent styling
- Smooth transitions

#### TC-7.2: Responsive Design
**Steps:**
1. Test on mobile (375px)
2. Test on tablet (768px)
3. Test on desktop (1920px)

**Expected Result:**
- All pages responsive
- Navigation works on mobile
- Forms usable on all sizes

#### TC-7.3: Hidden Login
**Steps:**
1. Check all public pages
2. Look for login link

**Expected Result:**
- No login link visible
- `/login` accessible by direct URL only

### 8. Error Handling

#### TC-8.1: 404 Pages
**Steps:**
1. Visit non-existent routes
   - `/blog/non-existent`
   - `/products/invalid-id`

**Expected Result:**
- Appropriate error messages
- Navigation still works

#### TC-8.2: API Errors
**Steps:**
1. Attempt invalid operations
2. Check error responses

**Expected Result:**
- Proper error messages
- No sensitive data exposed
- Appropriate HTTP status codes

## Performance Tests

### PT-1: Page Load Times
- Landing page: < 2s
- Blog list: < 2s
- Product pages: < 2s
- Admin pages: < 3s (authenticated)

### PT-2: API Response Times
- GET endpoints: < 500ms
- POST endpoints: < 1s
- Payment creation: < 3s (external API)

## Security Tests

### ST-1: Authentication
- Verify `/admin/*` requires login
- Verify session expiration
- Verify logout clears session

### ST-2: API Protection
- Verify admin endpoints reject unauthenticated requests
- Verify role-based access control

### ST-3: Input Validation
- Test XSS prevention in forms
- Test SQL injection prevention (Prisma ORM handles this)
- Test malformed payloads

## Database Tests

### DT-1: Data Integrity
- Verify foreign key constraints
- Verify cascade deletes work correctly
- Verify unique constraints enforced

### DT-2: Migrations
- Test migration up and down
- Verify no data loss

## Regression Tests

After any code changes, re-run:
1. Authentication flow
2. CRUD operations for all entities
3. Payment callback simulation
4. Email delivery

## Test Automation (Future)

Consider implementing:
- Jest/Vitest for unit tests
- Playwright for E2E tests
- API tests with Supertest

## Bug Reporting

When a bug is found:
1. Document steps to reproduce
2. Note expected vs actual behavior
3. Include screenshots if UI issue
4. Note environment details
5. Create GitHub issue

## Sign-off Criteria

All tests must pass before deployment:
- ✅ All authentication flows work
- ✅ All CRUD operations successful
- ✅ Payment flow end-to-end verified
- ✅ Emails deliver correctly
- ✅ No critical security issues
- ✅ UI is responsive and styled correctly
