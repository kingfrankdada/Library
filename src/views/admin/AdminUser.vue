<template>
  <div class="admin-user">
    <div class="user-box">
      <!-- 用户查看 -->
      <div @click="openSelectModal">
        <NormalViewBox class="user-box-item">
          <div class="title-container">
            <h1>PREVIEW</h1>
            <h3>查看所有用户</h3>
          </div>
          <div class="img-container">
            <img src="/assets/images/background5.png" alt="user" />
          </div>
        </NormalViewBox>
      </div>
      <!-- 用户查看模态框 -->
      <NormalModal
        v-if="isSelectModalVisible"
        class="select-modal"
        size="large"
      >
        <div class="select-text">
          用户列表
          <div class="select-tips">*双击用户属性可进行编辑</div>
        </div>
        <SelectUser class="select-user"></SelectUser>
      </NormalModal>

      <!-- 用户添加 -->
      <div @click="openAddModal">
        <NormalViewBox class="user-box-item">
          <div class="title-container">
            <h1>INCREASE</h1>
            <h3>添加新的用户</h3>
          </div>
          <div class="img-container">
            <img src="/assets/images/background6.png" alt="user" />
          </div>
        </NormalViewBox>
      </div>
      <!-- 用户添加模态框 -->
      <NormalModal v-if="isAddModalVisible" class="select-modal" size="large">
        <div class="select-text">添加用户</div>
        <AddUser></AddUser>
      </NormalModal>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NormalViewBox from "@/components/NormalViewBox.vue";
import NormalModal from "@/components/NormalModal.vue";
import SelectUser from "@/components/admin/SelectUser.vue";
import AddUser from "@/components/admin/AddUser.vue";

export default {
  components: {
    NormalViewBox,
    NormalModal,
    SelectUser,
    AddUser,
  },

  computed: {
    ...mapState("NormalModal", [
      "isSelectModalVisible",
      "isAddModalVisible",
      "isUpdateModalVisible",
    ]),
    ...mapState("AdminLeftGuide", ["isLeftGuideVisible"]),
  },

  watch: {
    isLeftGuideVisible(newVal) {
      this.updateModalPosition(newVal);
    },
  },

  methods: {
    ...mapMutations("NormalModal", [
      "setSelectModalVisible",
      "setAddModalVisible",
      "setUpdateModalVisible",
    ]),

    updateModalPosition(isVisible) {
      this.$nextTick(() => {
        const selectModal = document.querySelector(".select-modal");
        if (selectModal) {
          selectModal.style.left = isVisible ? "0%" : "-7.5%";
        }
      });
    },

    openSelectModal() {
      this.setSelectModalVisible(true);
      this.syncPosition();
    },

    openAddModal() {
      this.setAddModalVisible(true);
      this.syncPosition();
    },

    syncPosition() {
      this.updateModalPosition(this.isLeftGuideVisible);
    },
  },

  mounted() {
    this.updateModalPosition(this.isLeftGuideVisible);
    this.setAddModalVisible(false);
    this.setSelectModalVisible(false);
  },
};
</script>

<style scoped>
.admin-user {
  height: 100%;
  width: 85%;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: scroll;
  background: var(--background-color);
}

.select-modal {
  width: 115%;
  height: 110%;
  transition: left 0.4s ease;
}

.select-text {
  left: 20px;
  width: 100%;
  height: 50px;
  text-align: left;
  font-size: 20px;
  font-weight: var(--font-semi-bold);
  color: var(--first-color);
  margin-top: 20px;
  margin-left: 20px;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  transition: all 0.4s ease;
  background: var(--white-color);
}

.user-box-item {
  justify-content: left;
  align-items: center;
  text-align: left;
  transition: all 0.4s ease;
}

.user-box-item:hover .title-container {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.user-box-item:hover h1,
.user-box-item:hover h3 {
  text-align: center;
  margin: 0;
}

.user-box-item h1 {
  font-family: var(--body-font);
  font-size: 40px;
  color: var(--first-color);
  margin-bottom: 10px;
  transition: all 1s ease;
}

.user-box-item h3 {
  font-family: var(--body-font);
  font-size: 20px;
  color: var(--first-color);
  text-align: left;
  margin-left: 10px;
  transition: all 1s ease;
}

.select-tips {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  margin-right: 20px;
  width: 100%;
  text-align: right;
  font-size: 15px;
  color: var(--text-color);
}

.select-user {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>