import axios from 'axios'
import { getDisplayProductName } from '../data/productNameOverrides'

// Public Northwind OData v4 mock service
const BASE_URL = 'https://services.odata.org/V4/Northwind/Northwind.svc/'

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

/**
 * Fetches the product list with only the fields the list view needs.
 * Names are overridden to their Israeli display name, so the sort is
 * re-applied client-side afterwards (the API sorts by the original name).
 */
export function fetchProducts() {
  return client
    .get('Products', {
      params: {
        $select: 'ProductID,ProductName,UnitPrice,CategoryID,UnitsInStock',
        $orderby: 'ProductName',
      },
    })
    .then((res) =>
      res.data.value
        .map((product) => ({
          ...product,
          ProductName: getDisplayProductName(product.ProductID, product.ProductName),
        }))
        .sort((a, b) => a.ProductName.localeCompare(b.ProductName, 'he')),
    )
}

/**
 * Fetches all categories (id + name) for the filter dropdown.
 */
export function fetchCategories() {
  return client
    .get('Categories', {
      params: {
        $select: 'CategoryID,CategoryName',
      },
    })
    .then((res) => res.data.value)
}

/**
 * Fetches a single product with its category and order details expanded.
 * @param {number|string} productId
 */
export function fetchProductById(productId) {
  return client
    .get(`Products(${productId})`, {
      params: {
        $expand: 'Category,Order_Details',
      },
    })
    .then((res) => ({
      ...res.data,
      ProductName: getDisplayProductName(res.data.ProductID, res.data.ProductName),
    }))
}

export default client
