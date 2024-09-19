<template>
  <div class="admin-menu">
    <div class="menu-box">
      <!-- 分类查看 -->
      <div @click="openSelectModal">
        <NormalViewBox class="menu-box-item">
          <div class="title-container">
            <h1>PREVIEW</h1>
            <h3>查看并编辑所有分类</h3>
          </div>
          <div class="img-container">
            <img src="/assets/images/background4.png" alt="menu" />
          </div>
        </NormalViewBox>
      </div>
      <!-- 分类查看模态框 -->
      <NormalModal
        v-if="isSelectModalVisible"
        class="select-modal"
        size="large"
      >
        <div class="select-text">
          所有分类
          <div class="select-tips">*双击分类属性可进行编辑</div>
        </div>
        <SelectMenu></SelectMenu>
      </NormalModal>

      <!-- 分类添加 -->
      <div @click="openAddModal">
        <NormalViewBox class="menu-box-item">
          <div class="title-container">
            <h1>INCREASE</h1>
            <h3>添加新的分类</h3>
          </div>
          <div class="img-container">
            <img src="/assets/images/background1.png" alt="menu" />
          </div>
        </NormalViewBox>
      </div>
      <!-- 分类添加模态框 -->
      <NormalModal v-if="isAddModalVisible" class="select-modal" size="large">
        <div class="select-text">添加分类</div>
        <AddMenu></AddMenu>
      </NormalModal>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NormalViewBox from "@/components/NormalViewBox.vue";
import NormalModal from "@/components/NormalModal.vue";
import SelectMenu from "@/components/admin/SelectMenu.vue";
import AddMenu from "@/components/admin/AddMenu.vue";

export default {
  components: {
    NormalViewBox,
    NormalModal,
    SelectMenu,
    AddMenu,
  },

  computed: {
    ...mapState("NormalModal", [
      "isSelectModalVisible",
      "isAddModalVisible",
      "isUpdateModalVisible",
    ]),
    ...mapState("LeftGuide", ["isLeftGuideVisible"]),
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
.admin-menu {
  height: 100%;
  width: 85%;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow-y: scroll;
  background: var(--body-color);
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

.menu-box-item {
  justify-content: left;
  align-items: center;
  text-align: left;
  transition: all 0.4s ease;
}

.menu-box-item:hover .title-container {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.menu-box-item:hover h1,
.menu-box-item:hover h3 {
  text-align: center;
  margin: 0;
}

.menu-box-item h1 {
  font-family: var(--body-font);
  font-size: 40px;
  color: var(--first-color);
  margin-bottom: 10px;
  transition: all 1s ease;
}

.menu-box-item h3 {
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

.select-menu {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>