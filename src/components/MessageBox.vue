<template>
  <div class="message" @click="handleClickOutside">
    <div class="message-content">
      <span class="close-button" @click="close">&times;</span>
      <div class="message-text">
        {{ message }}
        <i
          v-if="showCopyButton"
          class="ri-file-copy-line"
          @click="copyText"
        ></i>
      </div>
      <div class="close-form" @click="close">
        <div class="close-form-item">{{ $t("messageBox.btnMsg") }}</div>
        <div class="close-form-loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageBox",

  props: {
    message: {
      type: String,
      default: "Error",
    },
    showCopyButton: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },
    handleClickOutside(event) {
      if (event.target.classList.contains("message")) {
        this.close();
      }
    },
    copyText() {
      // 提取复制信息
      const textMatch = this.message.match(
        /(?:初始密码为|查看详情|Password|Info)：(.*)$/
      );
      const text = textMatch ? textMatch[1].trim() : "";
      if (!text) {
        alert(this.$t("messageBox.emptyCopyError"));
        return;
      }

      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert(this.$t("messageBox.copySuccess"));
        })
        .catch(() => {
          alert(this.$t("messageBox.copyFail"));
        });
    },
  },
};
</script>

<style scoped>
.message {
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

.message-content {
  width: 30%;
  height: 20%;
  background-color: var(--card-color);
  border-radius: 3px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.message-text {
  padding: 10px;
  text-align: center;
}

.message-text i {
  cursor: pointer;
}

.message-text i:hover {
  color: var(--first-color);
}

.close-form {
  width: 100%;
  height: 25%;
  position: absolute;
  text-align: center;
  font-display: center;
  color: var(--first-color);
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  bottom: 0;
}

.close-form-item {
  width: 100%;
  height: 93%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-form-loading {
  width: 100%;
  height: 7%;
  display: flex;
  background: rgb(41, 181, 41);
  animation: loading 2s;
}

.close-form:hover {
  background: var(--background-color);
  border-radius: 0 0 2px 2px;
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

@keyframes loading {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>