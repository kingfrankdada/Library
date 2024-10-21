<template>
  <div class="notice" @click="handleClickOutside">
    <div class="notice-content">
      <span class="close-button" @click="close">&times;</span>
      <div class="notice-form">
        <p class="notice-form-item">
          <strong>{{ notice.title }}</strong>
        </p>

        <p class="notice-info notice-form-item">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ notice.info }}
        </p>
      </div>
      <div class="notice-bottom">
        <p class="notice-bottom-item">
          <strong>发布者：</strong>{{ notice.adduser }}
        </p>
        <p class="notice-bottom-item">
          <strong>发布日期：</strong>{{ notice.adddate }}
        </p>
      </div>
      <div class="close-form" @click="close"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoticeBox",

  props: {
    notice: {
      type: Object,
      default: () => ({
        title: "系统错误！",
        adduser: "未知",
        adddate: "未知",
        info: "内容加载失败！",
      }),
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },
    handleClickOutside(event) {
      if (event.target.classList.contains("notice")) {
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.notice {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  animation: fade-in 0.5s;
}

.notice-content {
  width: 60%;
  height: 60%;
  background-color: var(--white-color);
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-y: auto;

}

.notice-form {
  width: 100%;
  height: 80%;
  display: flex;
  padding: 20px 20px 0 20px;
  flex-direction: column;
  align-items: flex-start;
  font-size: 20px;
  animation: fade-in 0.5s;
}

.notice-bottom {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid #ddd;
}

.notice-bottom-item {
  font-size: 16px;
  color: var(--text-color);
}

.notice-info {
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.notice-info::-webkit-scrollbar {
  display: none;
}

.notice-form-item {
  margin-bottom: 10px;
  padding: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 20px;
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.5s;
  z-index: 1;
}

.close-button:hover {
  animation: rotate 0.1s linear;
  color: #000;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
