<template>
  <div class="min-h-screen bg-primary-900">
    <!-- Konten utama halaman -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
</script>

<style>
/* Bisa tambahkan style global di sini */
</style>
