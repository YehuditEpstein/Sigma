# Catalog Product

A small Vue 3 application for browsing the Northwind product catalog: a
searchable/filterable product list and a product details page, built on top
of the public Northwind OData v4 mock service.

## Stack

- **Vue 3** with the Composition API (`<script setup>`)
- **Vite** as the build tool
- **Element Plus** for UI components (table, select, input, card,
  descriptions, skeleton, alert, empty state)
- **Pinia** for state management (`useProductsStore`)
- **Vue Router** with two routes: `/products` (list) and `/products/:id`
  (details)
- **Axios** for HTTP calls to the OData service

## Data source

All data comes directly from the public Northwind OData service (CORS is
enabled, so calls are made straight from the browser):

```
https://services.odata.org/V4/Northwind/Northwind.svc/
```

Requests used:

- `GET /Products?$select=ProductID,ProductName,UnitPrice,CategoryID,UnitsInStock&$orderby=ProductName`
- `GET /Categories?$select=CategoryID,CategoryName`
- `GET /Products(ProductID)?$expand=Category,Order_Details`

Every request sends `Accept: application/json`. See `src/services/odata.js`.

## Project structure

```
src/
  services/odata.js        # Axios client + OData calls
  stores/products.js       # Pinia store: state, getters, actions
  router/index.js          # Vue Router routes + a simple id guard
  utils/format.js          # Currency formatting helper
  views/
    ProductListView.vue    # Table, search (debounced), category filter
    ProductDetailView.vue  # Product card + order details table
  App.vue
  main.js
```

## Features

- Live text search on product name, **debounced 300ms**
- Category filter dropdown (populated from `/Categories`)
- "Showing X of Y products" result counter
- Loading state via Element Plus skeletons, error state via `el-alert`,
  and an empty state (`el-empty`) when a filter yields no results
- Product details page showing the expanded `Category` and `Order_Details`
  (Northwind has no `Reviews` entity, so the order-detail rows — the
  closest related sub-table the API exposes — are shown in their own
  table), plus a "back to list" button

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

To build for production:

```bash
npm run build
```

## Notes on AI tool usage

This project was built with the help of **Claude Code** (Anthropic), which
was used to:

- Scaffold the Vite + Vue 3 project and wire up Pinia, Vue Router, and
  Element Plus
- Write the OData service layer, Pinia store, router, and Vue components
  (list view, detail view) based on the exam requirements
- Verify the project builds and the dev server starts cleanly

The OData query parameters, requirement structure, and UI behavior
(debounce timing, columns, routes) were taken directly from the assignment
spec.
