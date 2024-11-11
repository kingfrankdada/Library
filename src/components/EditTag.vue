<template>
  <div class="edit" @click="handleClickOutside">
    <div class="edit-content">
      <span class="close-button" @click="close">&times;</span>
      <strong class="edit-title">修改公告详情</strong>
      <textarea
        v-model="editableInfo"
        class="edit-textarea"
        placeholder="编辑公告内容"
      ></textarea>
      <button class="submit-button" @click="submitForm">提交</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditTag",
  props: {
    editMsg: {
      type: [String, Number],
      default: "系统错误！",
    },
    editId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editableInfo: this.editMsg,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

    handleClickOutside(event) {
      if (event.target.classList.contains("edit")) {
        this.close();
      }
    },

    submitForm() {
      this.$emit("update", {
        id: this.editId,
        info: this.editableInfo,
      });
      this.close();
    },
  },
};
</script>

<style scoped>
.edit {
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

.edit-content {
  width: 50%;
  height: 60%;
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.edit-title {
  color: var(--first-color);
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.edit-textarea {
  font-family: var(--body-font);
  color: var(--text-color);
  width: 100%;
  height: 80%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 15px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  overflow: auto;
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

.submit-button {
  width: 100px;
  height: 40px;
  align-self: center;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--white-color);
  color: var(--first-color);
  font-weight: bold;
  cursor: pointer;
}

.submit-button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
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
