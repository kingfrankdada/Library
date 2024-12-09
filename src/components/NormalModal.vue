<template>
  <div class="modal" @click="handleClickOutside">
    <div :style="modalStyle" class="modal-content">
      <span class="close-button" @click="close">&times;</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "NormalModal",
  props: {
    size: {
      type: String,
      default: "normal", // 默认值为normal
    },
  },
  computed: {
    modalStyle() {
      switch (this.size) {
        case "small":
          return {
            width: "var(--small-modal-content-weight)",
            height: "var(--small-modal-content-height)",
          };
        case "mid": {
          return {
            width: "var(--mid-modal-content-weight)",
            height: "var(--mid-modal-content-height)",
          };
        }
        case "normal":
          return {
            width: "var(--normal-modal-content-weight)",
            height: "var(--normal-modal-content-height)",
          };
        case "large":
          return {
            width: "var(--large-modal-content-weight)",
            height: "var(--large-modal-content-height)",
          };
        case "search":
          return {
            width: "var(--search-modal-content-weight)",
            height: "var(--search-modal-content-height)",
          };
        case "edit":
          return {
            width: "var(--edit-modal-content-weight)",
            height: "var(--edit-modal-content-height)",
          };
        default:
          return {};
      }
    },
  },
  methods: {
    ...mapMutations("NormalModal", [
      "setLoginModalVisible",
      "setLogoutModalVisible",
      "setRegModalVisible",
      "setSearchModalVisible",
      "setSelectModalVisible",
      "setAddModalVisible",
      "setUpdateModalVisible",
      "setNoticeModalVisible",
      "setEditUserModalVisible",
      "setDelUserModalVisible",
      "setEditNoticeModalVisible",
    ]),
    close() {
      this.$emit("close");
      this.setLoginModalVisible(false);
      this.setLogoutModalVisible(false);
      this.setRegModalVisible(false);
      this.setSearchModalVisible(false);
      this.setSelectModalVisible(false);
      this.setAddModalVisible(false);
      this.setNoticeModalVisible(false);
      this.setEditUserModalVisible(false);
      this.setDelUserModalVisible(false);
      this.setEditNoticeModalVisible(false);
    },
    handleClickOutside(event) {
      if (event.target.classList.contains("modal")) {
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.modal {
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
  backdrop-filter: blur(5px);
  animation: fade-in 0.5s;
}

.modal-content {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  color: #000;
  animation: rotate 0.1s linear;
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
