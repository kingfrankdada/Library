<template>
  <div class="not-found">
    <div class="content" @click="$router.push('/')" title="返回首页">
      <img v-lazy="'/assets/images/404.png'" class="not-found-image" />
      <p class="not-found-text">404 Not Found</p>
      <p class="not-found-text-small">好像来到了没有知识的荒原...</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.not-found {
  height: 100%;
  width: 100%;
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
  color: #333;
  margin-top: 20px;
  text-align: center;
}

.not-found-text-small {
  margin-top: 20px;
  font-size: 24px;
  text-align: center;
}
</style>
