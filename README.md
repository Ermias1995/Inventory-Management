# Inventory Management System

A modern, full-stack web application for managing product inventory. Create, read, update, and delete inventory items with support for images, pricing, stock tracking, and category organization.

## ✨ Features

- **Complete CRUD Operations** — Create, read, update, and delete inventory items
- **Product Images** — Upload and manage product images via Cloudinary with automatic optimization
- **Stock Management** — Track quantity levels with visual stock status (In Stock, Low Stock, Out of Stock)
- **Search & Filter** — Search items by name/description and filter by category
- **Inventory Analytics** — View total inventory value, low stock items, and out-of-stock counts
- **Sortable Table** — Click column headers to sort by name, category, quantity, price, or date
- **Responsive Design** — Works seamlessly on desktop and mobile devices
- **Form Validation** — Client-side validation with error messages
- **Toast Notifications** — Real-time feedback for user actions

## 🛠️ Tech Stack

- **Frontend Framework** — [Next.js 16.2.6](https://nextjs.org/) with App Router
- **Styling** — [Tailwind CSS 4](https://tailwindcss.com/)
- **Database** — PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/)
- **Image Storage** — [Cloudinary](https://cloudinary.com/)
- **Form Handling** — [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **UI Icons** — [Lucide React](https://lucide.dev/)
- **Hosting-Ready** — Built for deployment on [Vercel](https://vercel.com/)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Cloudinary account for image uploads
- `.env.local` file with required environment variables

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Set Up the Database

```bash
npm run db:push
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
inventory-app/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   └── items/                # Item CRUD endpoints
│   │       ├── route.ts          # GET, POST /api/items
│   │       └── [id]/route.ts     # PUT, DELETE /api/items/[id]
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage with inventory management
├── components/                   # React components
│   ├── ItemForm.tsx              # Add/edit item form
│   ├── ItemTable.tsx             # Inventory table with sorting
│   └── ui/                       # UI components
│       ├── Modal.tsx             # Dialog wrapper
│       ├── ConfirmDialog.tsx     # Delete confirmation
│       └── Toast.tsx             # Success/error notifications
├── db/                           # Database configuration
│   ├── index.ts                  # Database connection
│   └── schema.ts                 # Drizzle schema
├── lib/                          # Utilities
│   ├── cloudinary.ts             # Image upload functions
│   └── utils.ts                  # Helper functions
├── types/                        # TypeScript types
│   └── index.ts                  # Shared type definitions
├── drizzle.config.ts             # Drizzle configuration
├── tsconfig.json                 # TypeScript config
├── tailwind.config.mjs           # Tailwind configuration
└── package.json                  # Dependencies
```

## 🔌 API Endpoints

All endpoints return a consistent response format:

### GET /api/items
Fetch all inventory items ordered by most recent first.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "MacBook Pro",
      "description": "14-inch laptop",
      "category": "Electronics",
      "quantity": 5,
      "price": "1999.99",
      "imageUrl": "https://...",
      "imagePublicId": "...",
      "createdAt": "2026-05-22T10:00:00Z",
      "updatedAt": "2026-05-22T10:00:00Z"
    }
  ]
}
```

### POST /api/items
Create a new inventory item.

**Request Body:**
```json
{
  "name": "MacBook Pro",
  "description": "14-inch laptop",
  "category": "Electronics",
  "quantity": 5,
  "price": 1999.99,
  "imageUrl": "https://...",
  "imagePublicId": "..."
}
```

### PUT /api/items/[id]
Update an existing inventory item.

### DELETE /api/items/[id]
Delete an item and remove its image from Cloudinary.

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run db:push  # Sync database schema with PostgreSQL
```

## 🎨 Customization

### Add New Categories
Edit `CATEGORIES` array in [components/ItemForm.tsx](components/ItemForm.tsx#L11)

### Change Colors
Update Tailwind classes throughout components or modify [tailwind.config.mjs](tailwind.config.mjs)

### Modify Stock Status Logic
Edit `getStockStatus()` in [lib/utils.ts](lib/utils.ts)

## 🚢 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

```bash
vercel
```

### Deploy Elsewhere

Build the application:
```bash
npm run build
npm start
```

## 📝 Notes

- All prices are stored as strings in the database for precision
- Images are automatically optimized by Cloudinary
- Form validation happens on both client and server
- The app requires a PostgreSQL database connection

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.
