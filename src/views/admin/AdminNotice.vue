<template>
  <div class="admin-notice">
    <div class="notice-box">
      <!-- 公告查看 -->
      <div @click="openSelectModal">
        <NormalViewBox class="notice-box-item">
          <div class="title-container">
            <h1>PREVIEW</h1>
            <h3>查看并编辑所有公告</h3>
          </div>
          <div class="img-container">
            <img src="/assets/images/background7.png" alt="notice" />
          </div>
        </NormalViewBox>
      </div>
      <!-- 公告查看模态框 -->
      <NormalModal
        v-if="isSelectModalVisible"
        class="select-modal"
        size="large"
      >
        <div class="select-text">
          所有公告
          <div class="search-box">
            <i class="ri-search-line" @click="toggleSearch"></i>
            <input
              v-if="isSearch"
              v-model="searchText"
              ref="searchRef"
              class="search-input"
              type="text"
              placeholder="搜索标题或内容"
            />
          </div>
          <div class="select-tips">*双击公告属性可进行编辑</div>
        </div>
        <SelectNotice :searchText="searchText"></SelectNotice>
      </NormalModal>

      <!-- 公告添加 -->
      <div @click="openAddModal">
        <NormalViewBox class="notice-box-item">
          <div class="title-container">
            <h1>INCREASE</h1>
            <h3>添加新的公告</h3>
          </div>
          <div class="img-container">
            <img src="/assets/images/background8.png" alt="notice" />
          </div>
        </NormalViewBox>
      </div>
      <!-- 公告添加模态框 -->
      <NormalModal v-if="isAddModalVisible" class="select-modal" size="large">
        <div class="select-text">添加公告</div>
        <AddNotice></AddNotice>
      </NormalModal>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NormalViewBox from "@/components/NormalViewBox.vue";
import NormalModal from "@/components/NormalModal.vue";
import SelectNotice from "@/components/admin/SelectNotice.vue";
import AddNotice from "@/components/admin/AddNotice.vue";

export default {
  components: {
    NormalViewBox,
    NormalModal,
    SelectNotice,
    AddNotice,
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
.admin-notice {
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

.notice-box-item {
  justify-content: left;
  align-items: center;
  text-align: left;
  transition: all 0.4s ease;
}

.notice-box-item:hover .title-container {
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.notice-box-item:hover h1,
.notice-box-item:hover h3 {
  text-align: center;
  margin: 0;
}

.notice-box-item h1 {
  font-family: var(--body-font);
  font-size: 40px;
  color: var(--first-color);
  margin-bottom: 10px;
  transition: all 1s ease;
}

.notice-box-item h3 {
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

.select-notice {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>