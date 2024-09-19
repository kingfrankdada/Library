<template>
  <div class="search">
    <i
      class="ri-seo-line search-button"
      id="search-button"
      @click="setSearchModalVisible(true)"
    ></i>
    <div class="search-content">
      <NormalModal :size="modalSize" v-if="isSearchModalVisible">
        <!-- 搜索框 -->
        <div class="search-form">Search</div>
        <div class="g-container">
          <input
            v-model="inputText"
            type="text"
            placeholder="输入你想查询的内容"
            class="g-input-search"
          />
          <button type="button" class="g-button-search">GO</button>
        </div>
      </NormalModal>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NormalModal from "@/components/NormalModal";

export default {
  name: "PublicSearch",

  components: {
    NormalModal,
  },

  data() {
    return {
      modalSize: "search",
      inputText: "",
    };
  },

  computed: {
    ...mapState("NormalModal", ["isSearchModalVisible"]),
  },

  methods: {
    ...mapMutations("NormalModal", ["setSearchModalVisible"]),
    checkWindowSize() {
      this.modalSize = window.innerWidth > 1150 ? "search" : "large";
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

<style>
.search {
  height: 100%;
  width: 100%;
  z-index: 0;
}

.search-form {
  position: relative;
  display: flex;
  height: 30%;
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
  margin: 10% auto;
  display: flex;
  flex-wrap: wrap;
  width: 30%;
  height: 7.5%;
  overflow: hidden;
  transition: 0.3s;
  bottom: 20%;
  overflow: hidden;
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
  box-shadow: 4px 4px 10px 2px #ddd;
}
</style>