<script setup>
</script>

<template>
  <el-container class="app-shell">
    <el-header class="app-header">
      <h1>Catalog Product</h1>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
}

.app-header h1 {
  font-size: 1.25rem;
  margin: 0;
}
</style>
