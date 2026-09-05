import { defineStore } from 'pinia'
import { fetchProducts, fetchCategories, fetchProductById } from '../services/odata'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    currentProduct: null,

    listLoading: false,
    listError: null,

    detailLoading: false,
    detailError: null,

    searchTerm: '',
    selectedCategoryId: null,
  }),

  getters: {
    /**
     * Map of CategoryID -> CategoryName, used to display the category
     * name for each product row without a separate lookup per row.
     */
    categoryNameById(state) {
      const map = {}
      for (const category of state.categories) {
        map[category.CategoryID] = category.CategoryName
      }
      return map
    },

    /**
     * Products filtered by the live search term (case-insensitive,
     * matched against the product name) and the selected category.
     */
    filteredProducts(state) {
      const term = state.searchTerm.trim().toLowerCase()
      return state.products.filter((product) => {
        const matchesTerm = !term || product.ProductName.toLowerCase().includes(term)
        const matchesCategory =
          !state.selectedCategoryId || product.CategoryID === state.selectedCategoryId
        return matchesTerm && matchesCategory
      })
    },

    totalCount(state) {
      return state.products.length
    },
  },

  actions: {
    async loadProducts() {
      this.listLoading = true
      this.listError = null
      try {
        const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()])
        this.products = products
        this.categories = categories
      } catch (err) {
        this.listError = err.message || 'Failed to load products'
      } finally {
        this.listLoading = false
      }
    },

    async loadProductDetails(productId) {
      this.detailLoading = true
      this.detailError = null
      this.currentProduct = null
      try {
        this.currentProduct = await fetchProductById(productId)
      } catch (err) {
        this.detailError = err.message || 'Failed to load product details'
      } finally {
        this.detailLoading = false
      }
    },

    setSearchTerm(term) {
      this.searchTerm = term
    },

    setSelectedCategoryId(categoryId) {
      this.selectedCategoryId = categoryId
    },
  },
})
