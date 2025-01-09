<template>
  <div class="setting" @click="handleClickOutside">
    <div class="setting-content" :class="{ 'night-mode-content': isNightMode }">
      <span class="close-button" @click="close">&times;</span>
      <div class="setting-title">{{ settingMsg }}</div>
      <div class="setting-items">
        <span>夜间模式</span>
        <label class="switch">
          <input
            type="checkbox"
            v-model="isNightMode"
            @change="toggleNightMode"
          />
          <span class="slider"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingBox",

  props: {
    settingMsg: {
      type: String,
      default: "系统错误！",
    },
    showCopyButton: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isNightMode: JSON.parse(localStorage.getItem("isNightMode")) || false, // 默认为白天模式
    };
  },

  mounted() {
    console.log(localStorage.getItem("isNightMode"));
  },

  methods: {
    close() {
      this.$emit("close");
    },

    handleClickOutside(event) {
      if (event.target.classList.contains("setting")) {
        this.close();
      }
    },

    toggleNightMode() {
      localStorage.setItem("isNightMode", JSON.stringify(this.isNightMode)); // 存储布尔值
      // if (this.isNightMode) {
      //   // 设置夜间模式
      //   document.body.classList.add("night-mode");
      // } else {
      //   document.body.classList.remove("night-mode");
      // }
    },
  },
};
</script>

<style scoped>
.setting {
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

.setting-content {
  width: 25%;
  height: 35%;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
}

.setting-content.night-mode-content {
  background-color: #333; 
  color: #fff; 
}

.setting-title {
  padding-top: 15px;
  padding-left: 15px;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
}

.setting-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  padding: 10px 20px;
}

.setting-items span {
  font-size: 16px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 17px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  border-radius: 50%;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--first-color);
}

input:checked + .slider:before {
  transform: translateX(13px);
}

.setting-text {
  padding: 10px;
  text-align: center;
}

.setting-text i {
  cursor: pointer;
}

.setting-text i:hover {
  color: var(--first-color);
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
