<template>
  <div class="input-tag" title="双击可进入编辑模式，回车可确认提交">
    <input
      v-if="isEdit"
      v-focus
      ref="inp"
      class="input"
      type="text"
      placeholder="输入标签"
      :value="value"
      @blur="isEdit = false"
      @keyup.enter="handleEnter"
    />
    <div v-else @dblclick="handleClick" class="text">
      {{ value }}
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

.input-tag .input::placeholder {
  color: #666;
}
</style>