<template>
  <div class="search">
    <i
      class="ri-seo-line search-button"
      id="search-button"
      @click="openSearch"
    ></i>
    <div class="search-content">
      <NormalModal :size="modalSize" v-if="isSearchModalVisible">
        <!-- 搜索框 -->
        <div class="search-form">SEARCH</div>
        <div class="g-container">
          <input
            v-model="inputText"
            ref="inputRef"
            type="text"
            placeholder="输入你想查询的书籍"
            class="g-input-search"
            @keyup.enter="clickSearch"
          />
          <button type="button" class="g-button-search" @click="clickSearch">
            GO
          </button>
        </div>
      </NormalModal>
    </div>

    <!-- 自定义弹窗捕获 -->
    <AlertBox
      v-if="alertMsg"
      :message="alertMsg"
      @close="alertMsg = null"
    ></AlertBox>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NormalModal from "@/components/NormalModal";
import AlertBox from "./AlertBox.vue";

export default {
  name: "PublicSearch",

  components: {
    NormalModal,
    AlertBox,
  },

  data() {
    return {
      modalSize: "search",
      inputText: "",
      alertMsg: "",
    };
  },

  computed: {
    ...mapState("NormalModal", ["isSearchModalVisible"]),
  },

  methods: {
    ...mapMutations("NormalModal", ["setSearchModalVisible"]),

    checkWindowSize() {
      // this.modalSize = window.innerWidth > 1150 ? "search" : "large";
    },

    openSearch() {
      this.setSearchModalVisible(true);
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      });
    },

    clickSearch() {
      if (this.inputText.trim()) {
        this.$router.push({
          path: "/book",
          query: { search: this.inputText.trim() },
        });
        this.setSearchModalVisible(false);
      } else {
        this.alertMsg = "搜索内容不能为空";
      }
    },
  },

  watch: {
    isSearchModalVisible(newVal) {
      if (newVal) {
        this.inputText = "";
      }
    },
  },

  mounted() {
    this.checkWindowSize();
    window.addEventListener("resize", this.checkWindowSize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.checkWindowSize);
  },
};
</script>

<style scoped>
.search {
  height: 100%;
  width: 100%;
  z-index: 0;
}

.search-form {
  position: relative;
  margin-bottom: 20px;
  display: flex;
  width: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: var(--first-color);
  font-weight: var(--font-medium);
  overflow: hidden;
  bottom: 20%;
}

.g-container {
  position: fixed;
  margin: 20px;
  display: flex;
  flex-wrap: wrap;
  width: 30%;
  height: 7.5%;
  overflow: hidden;
  transition: 0.3s;
}

.g-container > * {
  border: none;
  outline: none;
}

.g-container .g-input-search {
  padding: 0 15px;
  height: 100%;
  width: 100%;
  border: 1px solid #ddd;
  font-size: 18px;
  box-sizing: border-box;
}

.g-container .g-input-search:not(:placeholder-shown) {
  border: 1px solid var(--first-color);
}

.g-container .g-input-search:not(:placeholder-shown) + .g-button-search {
  opacity: 1;
}

.g-container .g-input-search:placeholder-shown + .g-button-search {
  opacity: 0;
}

.g-container .g-button-search {
  background: var(--first-color);
  color: #feffd4;
  font-size: 15px;
  cursor: pointer;
  width: 100px;
  height: calc(100% - 20px);
  transition: 0.3s;
  position: absolute;
  right: 10px;
  top: 10px;
}

.g-container:focus-within {
  transform: translateY(-4px);
  border-color: #bbb;
  box-shadow: 4px 4px 10px 2px var(--background-color);
}
</style>