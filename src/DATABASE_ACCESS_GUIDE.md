# 🗄️ Database Access Guide for Baggage Buddy

## Where to Find Your Database

### 🔗 Supabase Dashboard
Your Baggage Buddy app is connected to Supabase. Here's how to access your database:

**Dashboard URL:**
```
https://supabase.com/dashboard/project/lfwigcgzzkhhieazmypp
```

**Project ID:** `lfwigcgzzkhhieazmypp`

---

## 📊 Database Structure

Your app uses **two types of storage**:

### 1. **PostgreSQL Database** (SQL - for User Accounts)
- **Location:** Supabase Dashboard → Authentication → Users
- **What's stored:** User accounts created via sign up
- **Table:** `auth.users`
- **Contains:**
  - Email addresses
  - Encrypted passwords
  - User metadata (names)
  - Sign-up timestamps
  - Session tokens

**To view users:**
1. Go to: https://supabase.com/dashboard/project/lfwigcgzzkhhieazmypp/auth/users
2. You'll see all registered users with their:
   - Email
   - Name (in metadata)
   - Created date
   - Last sign-in

### 2. **Key-Value Store** (for Listings & Bookings)
- **Location:** Accessed via your app's "Database Viewer" page or through Supabase Edge Functions
- **What's stored:** Airline listings and customer bookings
- **Structure:**
  - `listing:*` - All airline luggage capacity listings
  - `booking:*` - All customer booking records

**To view KV data:**
- **In your app:** Click your name → "View Database"
- **Via Supabase:** Dashboard → Edge Functions → Logs

---

## 🔍 How to Access Database Content

### Option 1: Use the Built-in Database Viewer (Easiest)
1. Sign in to your Baggage Buddy app
2. Click your name in the top-right corner
3. Select "View Database"
4. Toggle between:
   - **Airline Listings** - All available luggage capacity
   - **Bookings** - All customer reservations

### Option 2: Direct Supabase Dashboard Access

#### For User Accounts:
```
https://supabase.com/dashboard/project/lfwigcgzzkhhieazmypp/auth/users
```

#### For KV Store Data:
Unfortunately, Supabase doesn't provide a direct UI for KV store data, but you can:
1. Use the Database Viewer page in your app (recommended)
2. Query via SQL if you migrate to PostgreSQL tables (see below)

---

## 🛠️ Database Management Options

### Current Setup:
- **Users:** PostgreSQL (auth.users table)
- **Listings & Bookings:** Key-Value Store

### If You Want Full SQL Access:
The current implementation uses Supabase KV Store for simplicity. If you want to use SQL tables instead:

**Note:** The current Figma Make environment has limitations for creating custom PostgreSQL tables. However, the KV Store is:
- ✅ Fully functional
- ✅ Persistent across sessions
- ✅ Perfect for prototyping
- ✅ Accessible via the Database Viewer page

---

## 📝 What Data is Stored

### User Accounts (PostgreSQL)
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "user_metadata": {
    "name": "John Doe"
  },
  "created_at": "2025-01-29T...",
  "last_sign_in_at": "2025-01-29T..."
}
```

### Airline Listings (KV Store)
```json
{
  "id": "listing:1738167234567-abc123",
  "name": "United Airlines",
  "logo": "✈️",
  "flightNumber": "UA 123",
  "departure": "09:00",
  "arrival": "14:30",
  "priceSmall": 5,
  "priceMedium": 8,
  "priceLarge": 12,
  "availableSpace": 10,
  "rating": 4.5,
  "savings": 45,
  "createdAt": "2025-01-29T...",
  "createdBy": "user-uuid"
}
```

### Bookings (KV Store)
```json
{
  "id": "booking:1738167234567-xyz789",
  "airlineName": "United Airlines",
  "flightNumber": "UA 123",
  "route": "New York, USA → London, UK",
  "fromCity": "New York, USA",
  "toCity": "London, UK",
  "flightDate": "2025-02-15",
  "numberOfBags": 2,
  "luggageSize": "Medium",
  "totalPrice": 16,
  "userId": "user-uuid",
  "userEmail": "user@example.com",
  "createdAt": "2025-01-29T...",
  "status": "confirmed"
}
```

---

## 🔐 Access Credentials

Your Supabase project credentials are stored in `/utils/supabase/info.tsx`:

```typescript
export const projectId = "lfwigcgzzkhhieazmypp"
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Service Role Key** (for admin operations) is stored as an environment variable in Supabase Edge Functions.

---

## 🎯 Quick Links

- **Supabase Project:** https://supabase.com/dashboard/project/lfwigcgzzkhhieazmypp
- **User Management:** https://supabase.com/dashboard/project/lfwigcgzzkhhieazmypp/auth/users
- **Edge Functions:** https://supabase.com/dashboard/project/lfwigcgzzkhhieazmypp/functions
- **Database Viewer (in app):** Sign in → Click your name → "View Database"

---

## ✅ Testing Your Database Connection

1. **Create a test account:**
   - Go to Sign In page
   - Click "Sign Up"
   - Enter: test@example.com / password123 / Test User
   - Check Supabase Dashboard → Auth → Users

2. **Add a test listing:**
   - Sign in to your app
   - Click your name → "Admin Dashboard"
   - Click "Add Listing"
   - Fill in airline details and save
   - Click "View Database" to see it stored

3. **Make a test booking:**
   - Search for a flight
   - Select an airline
   - Complete booking
   - Check Database Viewer → Bookings tab

---

## 💡 Pro Tips

- All database operations are logged to browser console (F12 → Console)
- User sessions persist across page refreshes
- Data in KV Store is permanent until deleted via Admin Dashboard
- You can export data from the Database Viewer page for backups

---

**Need help?** Check the browser console for detailed logs of all database operations!
