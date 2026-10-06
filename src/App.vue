<script setup>
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
</script>

<template>
  <VApp>
    <TheHeader />
    <VMain>
      <VContainer max-width="1440">
        <router-view />
      </VContainer>
    </VMain>
    <TheFooter />
  </VApp>
</template>
