<template>
  <div class="delete">
    <i
      class="ri-delete-box-line"
      id="delete-button"
      @click="setDelUserModalVisible(true)"
    ></i>
    <NormalModal size="small" v-if="isDelUserModalVisible">
      <div class="delete-form-content">
        <p class="warning-title"><i class="ri-alert-line"></i>警告</p>
        <p class="warning-message">
          <strong>此操作将会退出登录并清除您的所有用户数据</strong>
        </p>
      </div>
      <div class="delete-form-btn">
        <div class="delete-btn" @click="handleDel">确认</div>
        <div class="cancel-btn" @click="close">取消</div>
      </div>
    </NormalModal>
  </div>
</template>

<script scoped>
import { mapState, mapMutations } from "vuex";
import NormalModal from "@/components/NormalModal";
import axios from "axios";

export default {
  name: "PublicDel",

  props: {
    userId: {
      type: Number,
      required: true,
      default: 0,
    },
  },

  components: {
    NormalModal,
  },

  computed: {
    ...mapState("NormalModal", ["isDelUserModalVisible"]),
  },

  methods: {
    ...mapMutations("UserInfo", ["setUserInfo"]),
    ...mapMutations("NormalModal", ["setDelUserModalVisible"]),

    async handleDel() {
      try {
        const user = {
          id: this.userId,
        };
        await axios.post(
          `http://localhost:3000/api/delUser/${this.userId}`,
          user
        );
        this.alertMsg = "删除用户成功";
      } catch (error) {
        console.error(error.response?.data?.error || error.message);
        this.alertMsg = "删除用户失败";
      }
      this.setUserInfo({
        isAdmin: false,
        username: "",
        usertoken: "",
      });
      if (this.$route.path !== "/home") {
        this.$router.push({ path: "/" });
      }
      this.setDelUserModalVisible(false);
    },

    close() {
      this.setDelUserModalVisible(false);
    },
  },
};
</script>

<style>
.delete {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.delete-form-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70%;
  width: 100%;
}

.ri-alert-line {
  margin: 0 5px 0 5px;
  font-weight: normal;
}

.warning-title {
  font-size: 24px;
  font-weight: bold;
  color: red;
  margin-bottom: 10px;
}

.warning-message {
  padding: 5px;
  text-align: center;
  margin: 5px 0;
}

.delete-form-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: end;
  height: 30%;
  width: 100%;
}

.delete-btn,
.cancel-btn {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
}

.delete-btn:hover {
  background-color: red;
  border-radius: 0 0 0 10px;
  color: var(--white-color);
}

.cancel-btn:hover {
  background-color: var(--border-color);
  border-radius: 0 0 10px 0;
}
</style>
