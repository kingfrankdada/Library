<template>
  <div class="not-found">
    <div class="content" @click="$router.push('/')" :title="$t('notFound.title')">
      <!-- <img v-lazy="'/assets/images/404.png'" class="not-found-image" /> -->
      <p class="not-found-text">{{ $t("notFound.info") }}</p>
      <p class="not-found-text-small">{{ $t("notFound.message") }}</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.not-found {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.not-found-image {
  width: 400px;
  height: 400px;
  object-fit: contain;
}

.not-found-text {
  font-size: 48px;
  font-weight: bold;
  color: var(--text-color);
  margin-top: 20px;
  text-align: center;
}

.not-found-text-small {
  margin-top: 20px;
  font-size: 24px;
  text-align: center;
}
</style>
