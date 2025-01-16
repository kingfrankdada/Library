export default {
  setting: {
    nightMode: "夜间模式",
    title: "系统设置",
    language: "系统语言",
  },

  publicLogin: {
    logo: "高校图书管理系统",
    changeReg: "没有账户？立刻注册",
    loginError: "用户名或密码错误",
  },

  publicReg: {
    logo: "高校图书管理系统",
    changeLogin: "已有账户？立刻登录",

    handleReg: {
      empty: "用户名和密码不能为空",
      short: "密码长度不能少于6位",
      notMatch: "两次密码不一致",
      success: "注册成功，用户名：{username}",
      fail: "注册失败: {error}",
    }
  },

  publicLogout: {
    info: "确定要退出登录吗？",
    confirm: "确定",
    cancel: "取消",
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

  editTag: {
    title: "修改详情",
    placeholder: "编辑内容",
    btnMsg: "提交",
  },

  inputTag: {
    placeholder: "输入标签",
    empty: "标签不能为空",
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
    btnMsg: "借阅",
    guideTitle: "全部图书",
    bookEmpty: "未找到任何图书信息",
    bookError: "图书信息加载失败，请稍后再试",
    menuError: "分类信息加载失败，请稍后再试",
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
    messageError: "留言信息加载失败，请稍后再试",
    userInfoNone: "未找到用户信息",
    userInfoError: "用户信息加载失败，请稍后再试",
    borrow: "借阅",
    view: "在图书中心查看",
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
    borrowDays: "预计借阅天数 (最大30天)",
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
  },

  userForum: {
    illegalTitle: "违规评论",
    illegalInfo: "[该评论涉嫌违规，已屏蔽]",
    yourself: "你",
    anonymous: "匿名用户",
    title: "输入您的留言标题",
    info: "输入您的留言内容",
    submit: "发表",
    isAnonymous: "匿名发表",
    borrowMsg: "显示借阅评论",
    loginFirst: "请先登录再进行留言",
    defaultBoxMsg: "正在加载论坛留言...",
    emptyBoxMsg: "未找到任何论坛留言记录",
    errorBoxMsg: "加载论坛留言失败",
    updateError: "更新论坛留言数据失败",
    emptyError: "论坛标题或内容不完整",
    addError: "论坛留言添加失败",
    delSuccess: "论坛留言删除成功",
    delError: "论坛留言删除失败",
  },

  userSetting: {
    personalInfo: "账户基本信息",
    personalInfoTip: "您在注册时候提供的基本信息,包含用户名称，邮箱，注册日期等",
    username: "用户名:",
    superAdmin: "[超级管理员]",
    admin: "[管理员]",
    user: "[用户]",
    email: "邮箱:",
    registerDate: "注册日期:",
    edit: "修改账户信息",
    security: "账户安全信息",
    securityTip: "为了保护您的账户安全，建议定期更改密码，并妥善管理您的账户信息",
    changePassword: "修改密码",
    delAccount: "注销账户",
    credit: "账户信誉分",
    creditTip: "您的用户行为会影响您的信誉分，当信誉分过低将会禁用用户使用部分功能",
    currentCredit: "当前信誉分:",
    creditContent: "在本系统中，信誉分机制旨在激励用户遵守规则并维护良好的使用环境。用户的信誉分会基于其行为表现进行动态调整，从而确保系统的公平性与安全性。",
    goCredit: "查看信誉分明细",
    guideTitle: "用户中心",
    editUser: "修改帐户信息",
    editPassword: "修改帐户密码",

    guideList: {
      collection: "我的收藏",
      borrow: "我的借阅",
      comment: "我的留言",
      credit: "我的信誉分",
    },

    selectUsersByUserName: {
      empty: "未找到任何用户信息",
      error: "用户信息加载失败，请稍后再试",
    }
  },

  editUser: {
    title: "修改个人信息",
    subTitle: "双击表单项进行编辑",
    username: "用户名",
    email: "邮箱",
    tip: "Tips：双击表单项进行编辑，按下回车键提交表单项",
    submit: "保存",

    selectUsersByUserName: {
      empty: "未找到任何用户信息",
      error: "用户信息加载失败，请稍后再试",
    },

    submitForm: {
      empty: "用户名和邮箱不能为空",
      success: "更新用户数据成功",
      error: "信息修改失败，请稍后再试",
    },
  },

  editPassword: {
    username: "用户名",
    oldPassword: "旧密码",
    oldPasswordPlaceholder: "输入您的旧密码",
    newPassword: "新密码",
    newPasswordPlaceholder: "输入您的新密码",
    confirmPassword: "确认密码",
    confirmPasswordPlaceholder: "再次输入您的新密码",
    submit: "重置密码",

    submitForm: {
      empty: "请输入完整信息",
      notMatch: "两次密码不一致",
      short: "密码长度不能少于6位",
      error: "旧密码错误，请重新输入",
    }
  },

  delUser: {
    title: "警告",
    info: "此操作将会退出登录并清除您的所有用户数据",
    confirm: "确认",
    cancel: "取消",
    error: "注销失败，请稍后再试",
  },

  userCollection: {
    titleInfo: "查看图书详情",
    titleDisabled: "图书已下架",
    imgAlt: "封面",
    num: "库存数量:",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",
    btnMsg: "在图书中心查看",
    defaultBoxMsg: "正在加载收藏图书...",

    selectFavorite: {
      empty: "未找到任何图书记录",
      error: "图书信息加载失败，请稍后再试",
    },

    menuError: "分类信息加载失败，请稍后再试",
  },

  userBorrow: {
    searchPlaceholder: "搜索借阅图书名称或借阅日期",
    showRecentDays: "仅显示最近七天",
    startDate: "借出日期",
    overDate: "预计归还日期",
    days: "预计借阅天数",
    bookname: "书名",
    returnDate: "实际归还日期",
    recordDays: "实际借阅天数",
    creditDelta: "信誉分变化",
    state: "状态",
    actions: "操作",
    borrowing: "借阅中",
    returned: "已归还",
    overdue: "已逾期",
    return: "归还",
    renew: "续借",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",
    btnMsg: "在图书中心查看",
    defaultBoxMsg: "正在加载借阅记录...",

    fetchBorrowBorrows: {
      empty: "未找到任何借阅记录",
      error: "借阅记录加载失败，请稍后再试",
    },

    selectUsersByUserName: {
      empty: "未找到任何用户信息",
      error: "用户信息加载失败，请稍后再试",
    },

    handleReturn: {
      login: "请先登录",
      success: "归还成功，请对此次借阅进行评价",
      fail: "归还失败，请稍后再试",
    },

    handleRenew: {
      login: "请先登录",
      credit: "信誉分过低，无法续借",
      fail: "续借失败，请稍后再试",
    }
  },

  renewBox: {
    imgAlt: "封面",
    author: "作者:",
    menu: "分类:",
    press: "出版社:",
    price: "价格:",
    info: "更多信息:",
    num: "库存数量:",
    adddate: "入库日期:",
    renewDays: "预计续借天数 (最大7天):",
    renewDaysPlaceholder: "输入天数:",
    overDate: "预计归还日期:",
    renew: "确认续借",
    cancel: "取消",

    handleRenew: {
      login: "请先登录",
      formEmpty: "请填写预计续借天数和归还日期",
      bookEmpty: "库存不足，无法续借",
      overDays: "续借天数不能超过7天",
      success: "续借成功: {bookname}",
      bookRepeat: "您已续借过此书籍",
      fail: "续借失败，请稍后再试",
    }
  },

  returnBox: {
    messagePlaceholder: "请输入您对此次借阅的留言",
    btnMsg: "确认",

    submitRating: {
      empty: "图书信息或评分不完整",
      fail: "评分提交失败，请稍后再试",
    },

    addMessage: {
      fail: "论坛留言添加失败，请稍后再试",
    }
  },

  userComment: {
    searchPlaceholder: "搜索留言标题或内容",
    illegalTitle: "[违规言论]",
    illegalInfo: "[该留言涉嫌违规，已屏蔽]",
    delBtn: "删除",
    emptyMsg: "未找到任何留言记录",

    selectMessageByUserName: {
      error: "留言信息加载失败，请稍后再试",
    },

    delComment: {
      success: "留言删除成功",
      fail: "留言删除失败，请稍后再试",
    }
  },

  userCredit: {
    searchPlaceholder: "搜索信誉分明细或日期",
    showRecentDays: "仅显示最近七天",
    delete: "清空信誉分记录",
    date: "日期",
    creditCount: "当前信誉分",
    info: "详情",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",
    defaultBoxMsg: "正在加载信誉分明细...",

    selectCredits: {
      empty: "未找到任何信誉分记录",
      error: "信誉分明细加载失败，请稍后再试",
    },

    deleteAll: {
      success: "清空信誉分记录成功",
      empty: "未找到任何信誉分记录",
      fail: "清空信誉分记录失败，请稍后再试",
    }
  },

  adminHome: {
    realTimeData: "实时数据",
    onlineUsers: "在线用户",
    bookCount: "收录图书",
    borrowCount: "借阅记录",
    logCount: "日志记录",
    cpuData: "服务器CPU资源",
    cpuType: "CPU型号:",
    cpuSpeed: "CPU频率(GHz):",
    memData: "服务器内存资源",
    memTotal: "总内存:",
    memUsed: "已使用:",
    userActivity: "用户活跃度",
    borrowLog: "借阅记录",
    sysLog: "系统日志",

    getDailyUser: {
      empty: "未找到任何活跃度信息",
      error: "活跃度信息加载失败，请稍后再试",
    },

    selectBooks: {
      empty: "未找到任何图书记录",
      error: "图书信息加载失败，请稍后再试",
    },

    selectLogs: {
      empty: "未找到任何日志记录",
      error: "日志信息加载失败，请稍后再试",
    },
  },

  adminLeftGuide: {
    title: "管理员控制台",

    menuList: {
      book: "图书管理",
      menu: "分类管理",
      borrow: "借阅管理",
      notice: "公告管理",
      forum: "论坛管理",
      user: "用户管理",
      log: "日志管理",
    }
  },

  adminBook: {
    searchPlaceholder: "搜索图书标题，作者，分类，出版社",
    addBook: "添加图书",
    showRecentDays: "仅显示最近七天",
    enableSelection: "启用复选框",
    selectAll: "全选",
    closeSelected: "关闭",
    openSelected: "开放",
    deleteSelected: "删除",
    name: "书名",
    author: "作者",
    menu: "分类",
    press: "出版社",
    price: "价格",
    num: "库存",
    cover: "封面",
    info: "详情",
    state: "状态",
    score: "评分",
    adddate: "入库日期",
    delete: "删除",
    imgAlt: "封面",
    editTitle: "双击可进入编辑模式",
    noBook: "未找到任何图书",
    open: "正常",
    close: "关闭",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",
    defaultBoxMsg: "正在加载图书信息...",

    selectMenuTitles: {
      error: "分类信息加载失败, 请稍后再试",
    },

    selectBooks: {
      empty: "未找到任何图书记录",
      error: "图书信息加载失败, 请稍后再试",
    },

    delBook: {
      success: "图书删除成功",
      fail: "图书删除失败，请稍后再试",
    },

    deleteSelectedBooks: {
      success: "删除选中成功",
      empty: "未选中任何图书记录",
      fail: "图书删除失败，请稍后再试",
    },

    openSelectedBooks: {
      success: "开放选中成功",
      empty: "未选中任何图书记录",
      fail: "图书开放失败，请稍后再试",
    },

    closeSelectedBooks: {
      success: "关闭选中成功",
      empty: "未选中任何图书记录",
      fail: "图书关闭失败，请稍后再试",
    },

    updateBook: {
      fail: "图书更新失败，请稍后再试",
    }
  },

  addBook: {
    title: "字段",
    input: "输入",
    name: "图书名称",
    namePlaceholder: "输入图书名称",
    author: "作者",
    authorPlaceholder: "输入作者",
    menu: "分类",
    menuPlaceholder: "选择分类",
    price: "价格",
    pricePlaceholder: "输入价格",
    press: "出版社",
    pressPlaceholder: "输入出版社",
    num: "库存",
    numPlaceholder: "输入库存",
    cover: "封面",
    info: "详情",
    infoPlaceholder: "输入详情",
    state: "状态",
    open: "正常",
    close: "关闭",
    autoPush: "自动推送公告",
    autoPushTip: "开启后在图书上线时自动推送公告，可在管理员仪表盘-公告管理中查看",
    adddate: "添加日期",
    submit: "提交",

    fetchMenuTitles: {
      fail: "分类信息加载失败, 请稍后再试",
    },

    handleImageChange: {
      alert: "请上传图片格式文件（jpg, jpeg, png, gif）",
      fail: "上传失败，请稍后再试",
    },

    submitForm: {
      empty: "图书信息不完整",
      success: "图书添加成功",
      noticeFail: "公告推送失败，请稍后再试",
      fail: "图书添加失败，请稍后再试",
    }
  },

  adminMenu: {
    searchPlaceholder: "搜索分类名称",
    addMenu: "添加分类",
    showRecentDays: "仅显示最近七天",
    enableSelection: "启用复选框",
    selectAll: "全选",
    delete: "删除",
    title: "分类名称",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",
    defaultBoxMsg: "正在加载分类信息...",
    noMenu: "未找到任何分类",

    selectMenus: {
      empty: "未找到任何分类记录",
      fail: "分类信息加载失败, 请稍后再试",
    },

    delMenu: {
      fail: "分类删除失败，请稍后再试",
    },

    deleteSelectedMenus: {
      empty: "未选中任何分类记录",
      success: "删除选中成功",
      fail: "分类删除失败，请稍后再试",
    },

    updateMenu: {
      fail: "分类更新失败，请稍后再试",
    }
  },

  addMenu: {
    title: "字段",
    input: "输入",
    name: "分类名称",
    namePlaceholder: "输入分类名称",
    submit: "提交",

    submitForm: {
      empty: "分类信息不完整",
      success: "分类添加成功",
      fail: "分类添加失败，请稍后再试",
    }
  },

  adminBorrow: {
    searchPlaceholder: "搜索借阅信息或用户名",
    add: "添加借阅",
    showRecentDays: "仅显示最近七天",
    enableSelection: "启用复选框",
    selectAll: "全选",
    returnSelected: "归还",
    delete: "删除",
    user: "用户名",
    book: "图书名称",
    startDate: "借阅日期",
    overDate: "预计归还日期",
    days: "预计借阅天数",
    returnDate: "实际归还日期",
    recordDays: "实际借阅天数",
    overtime: "逾期天数",
    state: "借阅状态",
    credit: "信誉分",
    adddate: "添加日期",
    overdue: "已逾期",
    returned: "已归还",
    borrowing: "借阅中",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",
    defaultBoxMsg: "正在加载借阅记录...",
    noBorrow: "未找到任何借阅记录",

    selectBorrows: {
      empty: "未找到任何借阅记录",
      fail: "借阅记录加载失败，请稍后再试",
    },

    delBorrow: {
      fail: "借阅记录删除失败，请稍后再试",
    },

    deleteSelectedBorrows: {
      empty: "未选中任何借阅记录",
      success: "删除选中成功",
      fail: "借阅记录删除失败，请稍后再试",
    },

    updateBorrow: {
      fail: "借阅记录更新失败，请稍后再试",
    },

    returnSelectedBorrows: {
      empty: "未选中任何借阅记录",
      success: "归还选中成功",
      fail: "借阅记录归还失败，请稍后再试",
    }
  },

  addBorrow: {
    title: "字段",
    input: "输入",
    username: "借阅用户",
    usernamePlaceholder: "选择借阅用户",
    book: "借阅图书",
    bookPlaceholder: "选择借阅图书",
    startdate: "借阅日期",
    overdate: "预计归还日期",
    days: "预计借阅天数",
    daysPlaceholder: "输入预计借阅天数",
    adduser: "添加用户",
    adddate: "添加日期",
    submit: "提交",

    selectBooks: {
      empty: "未找到任何图书记录",
      fail: "图书信息加载失败，请稍后再试",
    },

    selectUsers: {
      fail: "用户信息加载失败，请稍后再试",
    },

    submitForm: {
      empty: "借阅信息不完整",
      success: "借阅添加成功",
      fail: "借阅添加失败，请稍后再试",
    }
  },

  adminNotice: {
    searchPlaceholder: "搜索公告名，角色或注册信息",
    add: "添加公告",
    showRecentDays: "仅显示最近七天",
    enableSelection: "启用复选框",
    selectAll: "全选",
    top: "置顶",
    normal: "正常",
    untop: "取消置顶",
    delete: "删除",
    title: "公告标题",
    info: "详情内容",
    isTop: "是否置顶",
    infoTip: "双击可进入编辑模式",
    defaultBoxMsg: "正在加载公告信息...",
    noNotice: "未找到任何公告",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",

    selectNotices: {
      empty: "未找到任何公告记录",
      fail: "公告信息加载失败, 请稍后再试",
    },

    delNotice: {
      fail: "公告删除失败，请稍后再试",
    },

    deleteSelectedNotices: {
      empty: "未选中任何公告记录",
      success: "删除选中成功",
      fail: "公告删除失败，请稍后再试",
    },

    topSelectedNotices: {
      empty: "未选中任何公告记录",
      success: "置顶选中成功",
      fail: "公告置顶失败，请稍后再试",
    },

    untopSelectedNotices: {
      empty: "未选中任何公告记录",
      success: "取消置顶选中成功",
      fail: "公告取消置顶失败，请稍后再试",
    },

    updateNotice: {
      fail: "公告更新失败，请稍后再试",
    }
  },

  addNotice: {
    field: "字段",
    input: "输入",
    title: "公告标题",
    titlePlaceholder: "请输入公告标题",
    info: "公告内容",
    infoPlaceholder: "请输入公告内容",
    adduser: "添加用户",
    adddate: "添加日期",
    isTop: "是否置顶",
    isTopPlaceholder: "请选择是否置顶",
    top: "置顶",
    normal: "正常",
    submit: "提交",

    submitForm: {
      empty: "公告信息不完整",
      success: "公告添加成功",
      fail: "公告添加失败，请稍后再试",
    }
  },

  adminForum: {
    searchPlaceholder: "搜索留言名，发表用户或日期",
    add: "添加留言",
    showRecentDays: "仅显示最近七天",
    enableSelection: "启用复选框",
    selectAll: "全选",
    ban: "屏蔽",
    unban: "解除屏蔽",
    delete: "删除",
    title: "留言标题",
    info: "留言内容",
    adduser: "发表用户",
    adddate: "发表日期",
    views: "浏览数",
    likes: "点赞数",
    state: "状态",
    infoTip: "双击可进入编辑模式",
    normal: "正常",
    banned: "屏蔽",
    defaultBoxMsg: "正在加载留言信息...",
    noMessage: "未找到任何留言",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",

    selectMessages: {
      empty: "未找到任何留言记录",
      fail: "留言信息加载失败, 请稍后再试",
    },

    delMessage: {
      fail: "留言删除失败，请稍后再试",
    },

    deleteSelectedMessages: {
      empty: "未选中任何留言记录",
      success: "删除选中成功",
      fail: "留言删除失败，请稍后再试",
    },

    banSelectedMessages: {
      empty: "未选中任何留言记录",
      success: "屏蔽选中成功",
      fail: "留言屏蔽失败，请稍后再试",
    },

    unbanSelectedMessages: {
      empty: "未选中任何留言记录",
      success: "解除屏蔽选中成功",
      fail: "留言解除屏蔽失败，请稍后再试",
    },

    updateMessage: {
      fail: "留言更新失败，请稍后再试",
    }
  },

  addMessage: {
    field: "字段",
    input: "输入",
    title: "留言标题",
    titlePlaceholder: "请输入留言标题",
    info: "留言内容",
    infoPlaceholder: "请输入留言内容",
    adduser: "添加用户",
    adduserPlaceholder: "请输入添加用户",
    adddate: "添加日期",
    submit: "提交",

    submitForm: {
      empty: "留言信息不完整",
      success: "留言添加成功",
      fail: "留言添加失败，请稍后再试",
    }
  },

  adminUser: {
    searchPlaceholder: "搜索用户名，注册日期或角色",
    add: "添加用户",
    enableSelection: "启用复选框",
    selectAll: "全选",
    ban: "封禁",
    unban: "解除封禁",
    delete: "删除",
    username: "用户名",
    role: "权限组",
    roleTip: "该项会在重新登陆后生效",
    email: "邮箱",
    state: "状态",
    credit: "信誉分",
    adddate: "注册日期",
    superAdmin: "超级管理员",
    admin: "管理员",
    user: "用户",
    normal: "正常",
    banned: "封禁",
    denied: "权限不足",
    defaultBoxMsg: "正在加载用户信息...",
    noUser: "未找到任何用户",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",

    selectUsers: {
      empty: "未找到任何用户记录",
      fail: "用户信息加载失败，请稍后再试",
    },

    delUser: {
      fail: "用户删除失败，请稍后再试",
    },

    deleteSelectedUsers: {
      empty: "未选中任何用户记录",
      denied: "权限不足",
      success: "删除选中成功",
      fail: "用户删除失败，请稍后再试",
    },

    banSelectedUsers: {
      empty: "未选中任何用户记录",
      denied: "权限不足",
      success: "封禁选中成功",
      fail: "用户封禁失败，请稍后再试",
    },

    unbanSelectedUsers: {
      empty: "未选中任何用户记录",
      denied: "权限不足",
      success: "解除封禁选中成功",
      fail: "用户解除封禁失败，请稍后再试",
    },

    updateUser: {
      fail: "用户更新失败，请稍后再试",
    }
  },

  addUser: {
    field: "字段",
    input: "输入",
    username: "用户名",
    usernamePlaceholder: "请输入用户名",
    state: "状态",
    normal: "正常",
    banned: "封禁",
    email: "邮箱",
    emailPlaceholder: "输入预设用户邮箱",
    adddate: "注册日期",
    submit: "提交",

    submitForm: {
      empty: "用户名和邮箱不能为空",
      success: "用户添加成功，初始密码为：{password}",
      fail: "用户添加失败，请稍后再试",
    }
  },

  adminLog: {
    searchPlaceholder: "搜索用户名，IP，事件类型，详情或日期",
    enableLog: "启用日志记录",
    showRecentDays: "仅显示最近七天",
    enableSelection: "启用复选框",
    selectAll: "全选",
    delete: "删除",
    username: "用户名",
    type: "事件类型",
    info: "详情",
    adddate: "日期",
    defaultBoxMsg: "正在加载日志信息...",
    noLog: "未找到任何日志",
    pageSize: "每页显示",
    firstPage: "首页",
    prevPage: "上一页",
    nextPage: "下一页",
    lastPage: "尾页",
    pageInfo: "第 {currentPage} 页 / 共 {totalPages} 页",

    toggleLog: {
      response: "日志记录已{status}",
      open: "启用",
      close: "关闭",
      fail: "日志记录启用失败，请稍后再试",
    },

    selectLogs: {
      empty: "未找到任何日志记录",
      fail: "日志信息加载失败，请稍后再试",
    },

    delLog: {
      fail: "日志删除失败，请稍后再试",
    },

    deleteSelectedLogs: {
      empty: "未选中任何日志记录",
      success: "删除选中成功",
      fail: "日志删除失败，请稍后再试",
    },

    openInfo: {
      message: "查看详情：",
    }
  }
};