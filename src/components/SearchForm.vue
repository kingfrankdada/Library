<template>
  <div class="search-box">
    <div class="search-fields">
      <!-- <p class="search-title">Search</p> -->
      <div
        v-for="(item, index) in searchConfig"
        :key="index"
        class="search-item"
      >
        <label>{{ item.label }}:</label>
        <input
          v-model="searchForm[item.key]"
          v-if="item.type === 'input'"
          type="text"
          :placeholder="item.placeholder"
        />
        <select
          v-model="searchForm[item.key]"
          v-else-if="item.type === 'select'"
          class="search-select"
        >
          <option value="" disabled selected>{{ item.placeholder }}</option>
          <option
            v-for="option in item.options"
            :key="option.value"
            :value="option.value"
            :style="{ color: option.color }"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
    <div class="button-box">
      <button class="search-button" @click="search">Search</button>
      <button class="reset-button" @click="reset">Reset</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchForm",

  props: {
    searchConfig: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      searchForm: {},
    };
  },

  watch: {
    searchConfig: {
      handler() {
        this.initSearchForm();
      },
      immediate: true,
    },
  },

  methods: {
    initSearchForm() {
      this.searchForm = {};
      this.searchConfig.forEach((item) => {
        this.searchForm[item.key] = "";
      });
    },

    search() {
      this.$emit("search", this.searchForm);
    },

    reset() {
      this.initSearchForm();
      this.$emit("reSelect");
    },
  },
};
</script>

<style scoped>
.search-box {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-fields {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.search-title {
  width: 75%;
  font-size: 24px;
  font-weight: bold;
  justify-content: left;
  color: var(--first-color);
  text-align: left;
}

.search-item {
  margin-right: 150px;
}

label {
  font-size: 16px;
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.search-box input,
.search-box select {
  width: 220px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: var(--text-color);
  background-color: var(--card-color);
  font-size: 16px;
}

.search-box input:focus,
.search-box select:focus {
  border: 1px solid var(--first-color);
  transition: 0.4s;
}

.button-box {
  display: flex;
  justify-content: left;
  gap: 20px;
}

.search-button {
  width: 100px;
  padding: 8px 20px;
  border: 1px solid var(--first-color);
  border-radius: 5px;
  background-color: var(--card-color);
  color: var(--first-color);
  font-size: 16px;
  cursor: pointer;
}

.search-button:hover {
  background-color: var(--first-color);
  color: var(--white-color);
  transition: 0.4s;
}

.reset-button {
  width: 100px;
  padding: 8px 20px;
  border: 1px solid red;
  border-radius: 5px;
  background-color: var(--card-color);
  color: red;
  font-size: 16px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: red;
  color: var(--white-color);
  transition: 0.4s;
}
</style>