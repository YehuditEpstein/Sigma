import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '/products',
    name: 'product-list',
    component: () => import('../views/ProductListView.vue'),
  },
  {
    path: '/products/:id',
    name: 'product-details',
    component: () => import('../views/ProductDetailView.vue'),
    props: (route) => ({ id: Number(route.params.id) }),
    // Guard against non-numeric ids reaching the details view.
    beforeEnter: (to) => {
      if (!Number.isInteger(Number(to.params.id))) {
        return { name: 'product-list' }
      }
      return true
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/products',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
