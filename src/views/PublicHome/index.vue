<template>
  <div class="app">
    <div v-if="this.$route.path === '/home'" class="body">
      <swiper
        id="swiperBox"
        :options="swiperOption"
        ref="mySwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide
          v-for="(slide, index) in slides"
          :key="index"
          :class="`swiper-slide slide-${index + 1}`"
        >
          <div
            class="page"
            :class="{
              'fade-in': currentIndex == index,
              'fade-out': currentIndex != index,
            }"
          >
            <h1 class="title">{{ slide.title }}</h1>
            <h4 class="subtitle">{{ slide.subtitle }}</h4>
            <button
              :style="slide.btnStyle"
              v-if="slide.btnText"
              @click="slide.btnMethod"
            >
              {{ slide.btnText }}
              <i class="ri-arrow-right-double-line"></i>
            </button>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { eventBus } from "@/utils/eventBus";
import { mapState, mapMutations } from "vuex";

export default {
  name: "PublicHome",
  components: {
    Swiper,
    SwiperSlide,
  },

  data() {
    return {
      currentIndex: 0,
      swiperOption: {
        notNextTick: true,
        direction: "vertical",
        grabCursor: false,
        setWrapperSize: true,
        autoHeight: false,
        slidesPerView: 1,
        mousewheel: true,
        mousewheelControl: true,
        height: window.innerHeight,
        resistanceRatio: 10,
        observeParents: true,
      },
      slides: [],
    };
  },

  computed: {
    ...mapState("UserInfo", ["userInfo"]),
    swiper() {
      return this.$refs.mySwiper;
    },
  },

  mounted() {
    eventBus.$on("language-changed", this.handleLanguageChange);
    this.setDocuments();
  },

  beforeDestroy() {
    eventBus.$off("language-changed", this.handleLanguageChange);
  },

  methods: {
    ...mapMutations("NormalModal", ["setLoginModalVisible"]),
    onSlideChange() {
      this.currentIndex = this.swiper.swiperInstance.realIndex;
    },

    swiperNext() {
      this.swiper.swiperInstance.slideNext();
    },

    goBook() {
      this.$nextTick(() => {
        this.$router.push("/book");
      });
    },

    goForum() {
      this.$nextTick(() => {
        this.$router.push("/forum");
      });
    },

    goSetting() {
      this.$nextTick(() => {
        this.$router.push("/user");
      });
    },

    goLogin() {
      this.$nextTick(() => {
        this.setLoginModalVisible(true);
      });
    },

    handleLanguageChange() {
      this.setDocuments();
    },

    setDocuments() {
      this.$nextTick(() => {
        this.slides = [
          {
            title: this.$t("publicHome.title_1"),
            subtitle: this.$t("publicHome.subtitle_1"),
            btnText: this.$t("publicHome.btnText_1"),
            btnMethod: this.swiperNext,
          },
          {
            title: this.$t("publicHome.title_2"),
            subtitle: this.$t("publicHome.subtitle_2"),
            btnText: this.$t("publicHome.btnText_2"),
            btnMethod: this.goBook,
          },
          {
            title: this.$t("publicHome.title_3"),
            subtitle: this.$t("publicHome.subtitle_3"),
            btnText: this.$t("publicHome.btnText_3"),
            btnMethod: this.goForum,
          },
          {
            title: this.$t("publicHome.title_4"),
            subtitle: this.$t("publicHome.subtitle_4"),
            btnText: this.userInfo.usertoken
              ? this.$t("publicHome.btnText_4")
              : "Login",
            btnMethod: this.userInfo.usertoken ? this.goSetting : this.goLogin,
          },
          {
            title: this.$t("publicHome.title_5"),
            subtitle: this.$t("publicHome.subtitle_5"),
            btnText: this.$t("publicHome.btnText_5"),
            btnMethod: () => {
              window.open("https://github.com/kingfrankdada/Library");
            },
            btnStyle: {
              background: "#383838",
              color: "#fff",
            },
          },
        ];
      });
    },
  },
};
</script>

<style scoped>
@import "./index.less";
</style>
