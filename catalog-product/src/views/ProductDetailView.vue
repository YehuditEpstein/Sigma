<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { formatPrice } from '../utils/format'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const router = useRouter()
const store = useProductsStore()

const product = computed(() => store.currentProduct)
const orderDetails = computed(() => product.value?.Order_Details || [])

function load() {
  store.loadProductDetails(props.id)
}

function goBack() {
  router.push({ name: 'product-list' })
}

onMounted(load)
// Re-fetch if the user navigates directly between two /products/:id routes.
watch(() => props.id, load)
</script>

<template>
  <div class="product-detail">
    <el-button class="back-button" @click="goBack">&larr; Back to list</el-button>

    <el-alert
      v-if="store.detailError"
      type="error"
      :title="`Failed to load product: ${store.detailError}`"
      show-icon
      class="error-alert"
    />

    <el-skeleton v-if="store.detailLoading" :rows="8" animated />

    <template v-else-if="product">
      <el-card class="product-card">
        <template #header>
          <h2>{{ product.ProductName }}</h2>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="Category">
            {{ product.Category?.CategoryName || 'Unknown' }}
          </el-descriptions-item>
          <el-descriptions-item label="Unit Price">
            {{ formatPrice(product.UnitPrice) }}
          </el-descriptions-item>
          <el-descriptions-item label="Units In Stock">
            {{ product.UnitsInStock }}
          </el-descriptions-item>
          <el-descriptions-item label="Units On Order">
            {{ product.UnitsOnOrder }}
          </el-descriptions-item>
          <el-descriptions-item label="Quantity Per Unit">
            {{ product.QuantityPerUnit }}
          </el-descriptions-item>
          <el-descriptions-item label="Discontinued">
            {{ product.Discontinued ? 'Yes' : 'No' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="order-details-card">
        <template #header>
          <h3>Order Details</h3>
        </template>

        <el-empty v-if="orderDetails.length === 0" description="No order details for this product" />

        <el-table v-else :data="orderDetails" stripe border>
          <el-table-column prop="OrderID" label="Order ID" width="120" />
          <el-table-column label="Unit Price" width="140">
            <template #default="{ row }">
              {{ formatPrice(row.UnitPrice) }}
            </template>
          </el-table-column>
          <el-table-column prop="Quantity" label="Quantity" width="120" />
          <el-table-column label="Discount">
            <template #default="{ row }">
              {{ (row.Discount * 100).toFixed(0) }}%
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>
  </div>
</template>

<style scoped>
.product-detail {
  max-width: 900px;
  margin: 0 auto;
}

.back-button {
  margin-bottom: 1rem;
}

.error-alert {
  margin-bottom: 1rem;
}

.product-card {
  margin-bottom: 1.5rem;
}

.product-card h2,
.order-details-card h3 {
  margin: 0;
}
</style>
