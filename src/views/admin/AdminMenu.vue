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
            <img v-lazy="'/assets/images/background4.png'" alt="menu" />
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
          <div class="search-box">
            <i class="ri-search-line" @click="toggleSearch"></i>
            <input
              v-if="isSearch"
              v-model="searchText"
              ref="searchRef"
              class="search-input"
              type="text"
              placeholder="搜索名称"
            />
          </div>
          <div class="select-tips">*双击分类属性可进行编辑</div>
        </div>
        <SelectMenu :searchText="searchText"></SelectMenu>
      </NormalModal>

      <!-- 分类添加 -->
      <div @click="openAddModal">
        <NormalViewBox class="menu-box-item">
          <div class="title-container">
            <h1>INCREASE</h1>
            <h3>添加新的分类</h3>
          </div>
          <div class="img-container">
            <img v-lazy="'/assets/images/background1.png'" alt="menu" />
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

  data() {
    return {
      isSearch: false, // 搜索框是否处于激活状态
      searchText: "", // 搜索框的值
    };
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

    toggleSearch() {
      this.isSearch = !this.isSearch;
      if (this.isSearch) {
        this.$nextTick(() => {
          this.$refs.searchRef.focus();
        });
      } else {
        this.searchText = "";
      }
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
  background: var(--background-color);
}

.select-modal {
  width: 115%;
  height: 110%;
  transition: left 0.4s ease;
}

.select-text {
  display: flex;
  align-items: center;
  left: 20px;
  width: 100%;
  height: 50px;
  font-size: 20px;
  font-weight: var(--font-semi-bold);
  color: var(--first-color);
  margin-top: 20px;
  margin-left: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.ri-search-line::before {
  cursor: pointer;
}

.search-input {
  border: 1px solid var(--first-color);
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 10px;
  color: var(--first-color);
  font-size: 15px;
  font-weight: var(--font-medium);
  outline: none;
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
  right: 20px;
  transform: translateY(-50%);
  margin-right: 20px;
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