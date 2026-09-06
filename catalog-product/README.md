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

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

## AI

הפרויקט פותח בעזרת cloud code
