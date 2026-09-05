<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { formatPrice } from '../utils/format'

const router = useRouter()
const store = useProductsStore()

// Local input model, kept separate from the store's searchTerm so we can
// debounce writes to the store (and therefore the filtering) by 300ms.
const searchInput = ref(store.searchTerm)
let debounceTimer = null

watch(searchInput, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.setSearchTerm(value)
  }, 300)
})

const selectedCategory = computed({
  get: () => store.selectedCategoryId,
  set: (value) => store.setSelectedCategoryId(value),
})

const filteredProducts = computed(() => store.filteredProducts)
const isEmpty = computed(
  () => !store.listLoading && !store.listError && filteredProducts.value.length === 0,
)

function categoryName(categoryId) {
  return store.categoryNameById[categoryId] || 'Unknown'
}

function goToDetails(productId) {
  router.push({ name: 'product-details', params: { id: productId } })
}

onMounted(() => {
  store.loadProducts()
})
</script>

<template>
  <div class="product-list">
    <div class="filters">
      <el-input
        v-model="searchInput"
        placeholder="Search by product name..."
        clearable
        class="search-input"
        :prefix-icon="'Search'"
      />
      <el-select
        v-model="selectedCategory"
        placeholder="All categories"
        clearable
        class="category-select"
      >
        <el-option
          v-for="category in store.categories"
          :key="category.CategoryID"
          :label="category.CategoryName"
          :value="category.CategoryID"
        />
      </el-select>
    </div>

    <el-alert
      v-if="store.listError"
      type="error"
      :title="`Failed to load products: ${store.listError}`"
      show-icon
      class="error-alert"
    />

    <el-skeleton v-if="store.listLoading" :rows="6" animated class="skeleton" />

    <template v-else-if="!store.listError">
      <p class="results-summary">
        Showing {{ filteredProducts.length }} of {{ store.totalCount }} products
      </p>

      <el-empty v-if="isEmpty" description="No products match your search" />

      <el-table v-else :data="filteredProducts" stripe border>
        <el-table-column prop="ProductName" label="Product Name" min-width="200" />
        <el-table-column label="Category" min-width="150">
          <template #default="{ row }">
            {{ categoryName(row.CategoryID) }}
          </template>
        </el-table-column>
        <el-table-column label="Price" width="120">
          <template #default="{ row }">
            {{ formatPrice(row.UnitPrice) }}
          </template>
        </el-table-column>
        <el-table-column prop="UnitsInStock" label="Units In Stock" width="140" />
        <el-table-column label="" width="120">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="goToDetails(row.ProductID)">
              Details
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<style scoped>
.product-list {
  max-width: 1100px;
  margin: 0 auto;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-input {
  max-width: 320px;
}

.category-select {
  max-width: 240px;
}

.results-summary {
  color: #606266;
  margin-bottom: 0.75rem;
}

.error-alert,
.skeleton {
  margin-bottom: 1rem;
}
</style>
