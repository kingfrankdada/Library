<template>
  <div class="alert" @click="handleClickOutside">
    <div class="alert-content">
      <span class="close-button" @click="close">&times;</span>
      {{ message }}
      <div class="close-form" @click="close">
        <div class="close-form-item">{{ $t("alertBox.btnMsg") }}</div>
        <div class="close-form-loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlertBox",

  created() {
    setTimeout(() => {
      this.$emit("close");
    }, 1500);
  },

  props: {
    message: {
      type: String,
      default: "Error",
    },
  },

  computed: {},

  methods: {
    close() {
      this.$emit("close");
    },
    handleClickOutside(event) {
      if (event.target.classList.contains("alert")) {
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.alert {
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

.alert-content {
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
  background: red;
  animation: loading 1.5s;
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