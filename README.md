# FreshCart — E-commerce (Next.js + TypeScript)

Final project built on the Route FreshCart API (`https://ecommerce.routemisr.com/api/v1`).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
# production
npm run build && npm start
```

Optional: set `NEXT_PUBLIC_API_URL` in `.env.local` to point to a different API base URL.

## Features

| Area | Pages / what it does |
|------|----------------------|
| Auth | `/register`, `/login`, `/forgot-password` (email → code → new password), `/profile` (update details + change password) |
| Home | Hero, categories → subcategories → products of the chosen subcategory, popular products |
| Catalog | `/products` (search + sort + pagination), `/products/[id]`, `/categories`, `/categories/[id]`, `/subcategories/[id]`, `/brands`, `/brands/[id]` |
| Cart | Display, add, remove, update quantity, clear (`/cart`) |
| Wishlist | Display, add, remove (`/wishlist`, heart button on every product) |
| Payment | `/checkout` — Cash on delivery and Online (Stripe checkout session) |
| Orders | `/allorders` — all orders of the logged-in user |

Navbar: Home, Products, Categories dropdown (every category links to its products), Brands, Orders, Wishlist, Cart, Profile, Logout.

## Structure

```
app/            routes (App Router)
components/     Navbar, Footer, ProductCard, ProductList, CategoryExplorer, Providers (Auth/Cart/Wishlist context), ui, Field
lib/api.ts      every API call in one place
lib/types.ts    TypeScript types
```

## Deploy (Vercel)

Push to GitHub → import the repo on vercel.com → Deploy. No env vars required.
