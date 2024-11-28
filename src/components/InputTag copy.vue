<template>
  <div class="input-tag" :title="value">
    <input
      v-if="isEdit && type === 'text'"
      v-focus
      ref="inputRef"
      class="input"
      type="text"
      placeholder="输入标签"
      :value="value"
      @blur="isEdit = false"
      @keyup.enter="handleEnter"
    />
    <input
      v-else-if="isEdit && type === 'file'"
      ref="imageInputRef"
      class="input-file"
      type="file"
      title="添加文件"
      accept=".jpg, .jpeg, .png, .gif"
      :value="value"
    />
    <div v-else @dblclick="handleClick" class="text">
      {{ value || "-" }}
    </div>
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = null"
    ></AlertBox>
  </div>
</template>

<script>
import AlertBox from "./AlertBox.vue";

export default {
  name: "InputTag",
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: "text",
    },
  },

  components: {
    AlertBox,
  },

  data() {
    return {
      alertMsg: "",
      isEdit: false,
    };
  },
  methods: {
    handleClick() {
      this.isEdit = true;
      if (this.type != "file") {
        this.$nextTick(() => {
          this.$refs.inputRef.focus();
          this.$refs.inputRef.select();
        });
      }
    },
    handleEnter(e) {
      if (e.target.value.trim() === "") {
        this.alertMsg = "标签不能为空";
        return;
      }
      this.$emit("input", e.target.value);
      this.isEdit = false;
    },
  },
};
</script>

<style scoped>
.input-tag {
  cursor: pointer;
}

.input-tag .input {
  appearance: none;
  outline: none;
  border: 1px solid var(--first-color);
  border-radius: 3px;
  width: 100%;
  height: 27px;
  box-sizing: border-box;
  padding: 10px;
  color: #666;
}

.text {
  max-width: 200px;
  min-width: 50px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  direction: ltr;
}

.input-tag .input::placeholder {
  color: #666;
}
</style>