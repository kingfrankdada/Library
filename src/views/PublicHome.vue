<template>
  <div class="app">
    <div class="header">
      <HeaderGuide></HeaderGuide>
    </div>
    <div v-show="this.$route.path === '/home'" class="body">
      <h1 class="title">高校图书管理系统</h1>
      <h4 class="subtitle">Smart Organizational Library Assistant Resource</h4>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderGuide from "@/components/HeaderGuide.vue";

export default {
  name: "PublicHome",
  components: {
    HeaderGuide,
  },
};
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  flex-shrink: 0;
}

.body {
  margin: 20px 0;
}

.content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: var(--h1-font-size);
  font-family: "Montserrat", sans-serif;
  color: var(--first-color);
}
.subtitle {
  font-size: var(--h4-font-size);
  font-family: "Montserrat", sans-serif;
  color: var(--text-color);
  /* border-right: 0.1em solid;
  width: 26%;
  margin: 0 16px 0 0;
  white-space: nowrap;
  overflow: hidden;
  animation: typing 3s steps(35, end),
    cursor-blink 0.3s infinite alternate; */
}

/* @keyframes typing {
  from {
    width: 0;
  }
}

@keyframes cursor-blink {
  50% {
    border-color: transparent;
  }
} */
</style>