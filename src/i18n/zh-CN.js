export default {
  setting: {
    nightMode: "夜间模式",
    title: "系统设置",
    language: "系统语言",
  },

  headerGuide: {
    title: "高校图书管理系统",
    home: "主页",
    book: "图书中心",
    forum: "论坛中心",
    user: "个人中心",
    search: "搜索图书",
    notice: "公告",
    setting: "设置",
    admin: "系统设置",
    login: "登录",
    logout: "退出登录",
  },

  publicSearch: {
    placeholder: "输入你想查询的书籍",
    alertMsg: "搜索内容不能为空",
  },

  publicNotice: {
    title: "站内公告",
    top: "[置顶]",
    empty: "暂无公告",
    error: "获取公告失败",
  },

  noticeBox: {
    adduser: "发布者：",
    adddate: "发布日期：",
    defaultMsg: {
      title: "系统错误！",
      adduser: "未知",
      adddate: "未知",
      info: "内容加载失败！",
    },
  },

  messageBox: {
    btnMsg: "确定",
    emptyCopyError: "未找到可复制的文本",
    copySuccess: "复制成功",
    copyFail: "复制失败"
  },

  alertBox: {
    btnMsg: "确定",
  },

  publicHome: {
    title_1: "Smart Organizational Library Assistant Resource",
    subtitle_1: "基于 Vue2 和 Node.js 开发的现代化图书管理平台，旨在为高校提供数字化一站式在线图书管理方案，推动高校图书管理迈向更高效、更现代的数字化时代。",
    btnText_1: "了解更多",

    title_2: "图书中心",
    subtitle_2: "丰富的在线书库，方便快速浏览和查找各类图书资源。即时借阅功能让图书获取变得轻松高效，全站搜索支持模糊匹配，帮助精准定位感兴趣的书籍，极大提升借阅体验。",
    btnText_2: "立即借阅",

    title_3: "论坛中心",
    subtitle_3: "即时通信站内交流平台，致力于促进图书和学习资源的共享与讨论。参与各类图书讨论，发布和回复帖子，分享经验与见解，共同推动学术交流与思维碰撞。",
    btnText_3: "前往查看",

    title_4: "个人中心",
    subtitle_4: "汇聚个人安全设置、信誉分管理、借阅记录与收藏功能，提供全面的账户信息维护与优化。掌控账户隐私与安全，实时查看信誉评分，了解借阅历史与偏好，尽享智能化图书管理体验。",
    btnText_4: "前往设置",

    title_5: "项目介绍与支持",
    subtitle_5: "我们为此项目提供持续的技术支持和维护，确保平台在使用过程中能得到及时更新与优化，以应对不断变化的需求。本项目采用MIT开源协议，您可以在GitHub中提供反馈或者寻求帮助与解答。",
    btnText_5: "前往GitHub",
  },

  userBook: {
    titleInfo: "查看图书详情",
    titleInfoDisabled: "图书已下架",
    boxMsg: "暂无数据...",
    imgAlt: "封面",
    num: "库存数量:",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",
    guideTitle: "全部图书",
    bookEmpty: "未找到任何图书信息",
    bookError: "图书信息加载失败",
    menuError: "分类信息加载失败",
    searchResult: "已为您找到 {resultCount} 本符1合搜索条件的图书",
    searchEmpty: "未找到符合搜索条件的图书",
  },

  bookBox: {
    imgAlt: "封面",
    scoreTitle: "评分:",
    scoreInfo: "{score} / 5 共 {numScore} 人参与",
    scoreNone: "暂无评分",
    author: "作者:",
    menu: "分类:",
    press: "出版社:",
    price: "价格:",
    info: "更多信息:",
    num: "库存数量:",
    adddate: "入库日期:",
    messageTitle: "读者留言",
    messageNone: "暂无留言",
    btnMsg: "借阅",
    noneCredit: "用户信誉分不足，操作失败",
    login: "登录后操作",
    favorite: "收藏",
    cancelFavorite: "取消收藏",
    addFavoriteSuccess: "收藏成功，请前往用户中心-我的收藏查看",
    addFavoriteFail: "收藏添加失败",
    cancelFavoriteSuccess: "取消收藏成功",
    cancelFavoriteFail: "取消收藏失败",
    messageError: "留言信息加载失败",
    userInfoNone: "未找到用户信息",
    userInfoError: "用户信息加载失败",
    borrow: "借阅",
    view: "查看",
  },

  borrowBox: {
    imgAlt: "封面",
    author: "作者:",
    menu: "分类:",
    press: "出版社:",
    price: "价格:",
    info: "更多信息:",
    num: "库存数量:",
    adddate: "入库日期:",
    borrowDays: "预计借阅天数 (最大30天):",
    borrowDaysPlaceholder: "输入天数",
    overDate: "预计归还日期:",
    handleBorrow: "确认借阅",
    handleCancel: "取消",
    loginError: "请先登录",
    formError: "请填写预计借阅天数和归还日期",
    emptyError: "无法借阅，图书库存不足",
    overDaysError: "借阅天数不能超过30天",
    borrowSuccess: "借阅成功，请前往用户中心-我的借阅查看",
    borrowRepeat: "您已借阅过此书籍",
    borrowFail: "借阅失败，请稍后再试",
  }
};