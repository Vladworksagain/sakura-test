<script setup>
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
</script>

<template>
  <VApp>
    <TheHeader />
    <VMain class="app-main">
      <VContainer class="app-container" max-width="1440">
        <router-view />
      </VContainer>
    </VMain>
    <TheFooter />
  </VApp>
</template>

<style>
html:root,
html body,
#app {
  height: 100%;
  overflow: hidden;
}

html body .v-application,
html body .v-application__wrap {
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow: hidden;
}
</style>

<style scoped>
.app-main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.app-container {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}
</style>
