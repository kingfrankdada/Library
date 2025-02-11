export default {
  setting: {
    nightMode: "夜間模式",
    title: "系統設置",
    language: "系統語言",
  },

  publicLogin: {
    logo: "高校圖書管理系統",
    changeReg: "沒有帳戶？立刻註冊",
    loginError: "用戶名或密碼錯誤",
    empty: "用戶名和密碼不能為空",
  },

  publicReg: {
    logo: "高校圖書管理系統",
    changeLogin: "已有帳戶？立刻登錄",

    handleReg: {
      empty: "用戶名和密碼不能為空",
      short: "密碼長度不能少於6位",
      notMatch: "兩次密碼不一致",
      success: "註冊成功，用戶名：{username}",
      fail: "註冊失敗: {error}",
    }
  },

  publicLogout: {
    info: "確定要退出登錄嗎？",
    confirm: "確定",
    cancel: "取消",
  },

  headerGuide: {
    title: "高校圖書管理系統",
    home: "主頁",
    book: "圖書中心",
    forum: "論壇中心",
    user: "個人中心",
    search: "搜索圖書",
    notice: "公告",
    setting: "設置",
    admin: "系統設置",
    login: "登錄",
    logout: "退出登錄",
  },

  publicSearch: {
    placeholder: "輸入你想查詢的書籍",
    alertMsg: "搜索內容不能為空",
  },

  publicNotice: {
    title: "站內公告",
    top: "[置頂]",
    empty: "暫無公告",
    error: "獲取公告失敗",
  },

  noticeBox: {
    adduser: "發布者：",
    adddate: "發布日期：",
    defaultMsg: {
      title: "系統錯誤！",
      adduser: "未知",
      adddate: "未知",
      info: "內容加載失敗！",
    },
  },

  messageBox: {
    btnMsg: "確定",
    emptyCopyError: "未找到可複製的文本",
    copySuccess: "複製成功",
    copyFail: "複製失敗"
  },

  alertBox: {
    btnMsg: "確定",
  },

  editTag: {
    title: "修改詳情",
    placeholder: "編輯內容",
    btnMsg: "提交",
  },

  inputTag: {
    placeholder: "輸入標籤",
    empty: "標籤不能為空",
  },

  publicHome: {
    title_1: "Smart Organizational Library Assistant Resource",
    subtitle_1: "基於 Vue2 和 Node.js 開發的現代化圖書管理平台，旨在為高校提供數字化一站式在線圖書管理方案，推動高校圖書管理邁向更高效、更現代的數字化時代。",
    btnText_1: "了解更多",

    title_2: "圖書中心",
    subtitle_2: "豐富的在線書庫，方便快速瀏覽和查找各類圖書資源。即時借閱功能讓圖書獲取變得輕鬆高效，全站搜索支持模糊匹配，幫助精準定位感興趣的書籍，極大提升借閱體驗。",
    btnText_2: "立即借閱",

    title_3: "論壇中心",
    subtitle_3: "即時通信站內交流平台，致力於促進圖書和學習資源的共享與討論。參與各類圖書討論，發布和回覆帖子，分享經驗與見解，共同推動學術交流與思維碰撞。",
    btnText_3: "前往查看",

    title_4: "個人中心",
    subtitle_4: "匯聚個人安全設置、信譽分管理、借閱記錄與收藏功能，提供全面的賬戶信息維護與優化。掌控賬戶隱私與安全，實時查看信譽評分，了解借閱歷史與偏好，盡享智能化圖書管理體驗。",
    btnText_4: "前往設置",

    title_5: "項目介紹與支持",
    subtitle_5: "我們為此項目提供持續的技術支持和維護，確保平台在使用過程中能得到及時更新與優化，以應對不斷變化的需求。本項目採用MIT開源協議，您可以在GitHub中提供反饋或者尋求幫助與解答。",
    btnText_5: "前往GitHub",
  },

  userBook: {
    titleInfo: "查看圖書詳情",
    titleInfoDisabled: "圖書已下架",
    boxMsg: "暫無數據...",
    imgAlt: "封面",
    num: "庫存數量:",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",
    btnMsg: "借閱",
    guideTitle: "全部圖書",
    bookEmpty: "未找到任何圖書信息",
    bookError: "圖書信息加載失敗，請稍後再試",
    menuError: "分類信息加載失敗，請稍後再試",
    searchResult: "已為您找到 {resultCount} 本符合搜索條件的圖書",
    searchEmpty: "未找到符合搜索條件的圖書",
  },

  bookBox: {
    imgAlt: "封面",
    scoreTitle: "評分:",
    scoreInfo: "{score} / 5 共 {numScore} 人參與",
    scoreNone: "暫無評分",
    author: "作者:",
    menu: "分類:",
    press: "出版社:",
    price: "價格:",
    info: "更多信息:",
    num: "庫存數量:",
    adddate: "入庫日期:",
    messageTitle: "讀者留言",
    messageNone: "暫無留言",
    btnMsg: "借閱",
    noneCredit: "用戶信譽分不足，操作失敗",
    login: "登錄後操作",
    favorite: "收藏",
    cancelFavorite: "取消收藏",
    addFavoriteSuccess: "收藏成功，請前往用戶中心-我的收藏查看",
    addFavoriteFail: "收藏添加失敗",
    cancelFavoriteSuccess: "取消收藏成功",
    cancelFavoriteFail: "取消收藏失敗",
    messageError: "留言信息加載失敗，請稍後再試",
    userInfoNone: "未找到用戶信息",
    userInfoError: "用戶信息加載失敗，請稍後再試",
    borrow: "借閱",
    view: "在圖書中心查看",
  },

  borrowBox: {
    imgAlt: "封面",
    author: "作者:",
    menu: "分類:",
    press: "出版社:",
    price: "價格:",
    info: "更多信息:",
    num: "庫存數量:",
    adddate: "入庫日期:",
    borrowDays: "預計借閱天數 (最大30天):",
    borrowDaysPlaceholder: "輸入天數",
    overDate: "預計歸還日期:",
    handleBorrow: "確認借閱",
    handleCancel: "取消",
    loginError: "請先登錄",
    formError: "請填寫預計借閱天數和歸還日期",
    emptyError: "無法借閱，圖書庫存不足",
    overDaysError: "借閱天數不能超過30天",
    borrowSuccess: "借閱成功，請前往用戶中心-我的借閱查看",
    borrowRepeat: "您已借閱過此書籍",
    borrowFail: "借閱失敗，請稍後再試",
  },

  userForum: {
    illegalTitle: "違規評論",
    illegalInfo: "[該評論涉嫌違規，已屏蔽]",
    yourself: "你",
    anonymous: "匿名用戶",
    title: "輸入您的留言標題",
    info: "輸入您的留言內容",
    submit: "發表",
    isAnonymous: "匿名發表",
    borrowMsg: "顯示借閱評論",
    loginFirst: "請先登錄再進行留言",
    defaultBoxMsg: "正在加載論壇留言...",
    emptyBoxMsg: "未找到任何論壇留言記錄",
    errorBoxMsg: "加載論壇留言失敗",
    updateError: "更新論壇留言數據失敗",
    emptyError: "論壇標題或內容不完整",
    addError: "論壇留言添加失敗",
    delSuccess: "論壇留言刪除成功",
    delError: "論壇留言刪除失敗",
  },

  userSetting: {
    personalInfo: "帳戶基本信息",
    personalInfoTip: "您在註冊時候提供的基本信息,包含用戶名稱，郵箱，註冊日期等",
    username: "用戶名:",
    superAdmin: "[超級管理員]",
    admin: "[管理員]",
    user: "[用戶]",
    email: "郵箱:",
    registerDate: "註冊日期:",
    edit: "修改帳戶信息",
    security: "帳戶安全信息",
    securityTip: "為了保護您的帳戶安全，建議定期更改密碼，並妥善管理您的帳戶信息",
    changePassword: "修改密碼",
    delAccount: "註銷帳戶",
    credit: "帳戶信譽分",
    creditTip: "您的用戶行為會影響您的信譽分，當信譽分過低將會禁用用戶使用部分功能",
    currentCredit: "當前信譽分:",
    creditContent: "在本系統中，信譽分機制旨在激勵用戶遵守規則並維護良好的使用環境。用戶的信譽分會基於其行為表現進行動態調整，從而確保系統的公平性與安全性。",
    goCredit: "查看信譽分明細",
    guideTitle: "用戶中心",
    editUser: "修改帳戶信息",
    editPassword: "修改帳戶密碼",

    guideList: {
      collection: "我的收藏",
      borrow: "我的借閱",
      comment: "我的留言",
      credit: "我的信譽分",
    },

    selectUsersByUserName: {
      empty: "未找到任何用戶信息",
      error: "用戶信息加載失敗，請稍後再試",
    }
  },

  editUser: {
    title: "修改個人信息",
    subTitle: "雙擊表單項進行編輯",
    username: "用戶名",
    email: "郵箱",
    tip: "提示：雙擊表單項進行編輯，按下回車鍵提交表單項",
    submit: "保存",

    selectUsersByUserName: {
      empty: "未找到任何用戶信息",
      error: "用戶信息加載失敗，請稍後再試",
    },

    submitForm: {
      empty: "用戶名和郵箱不能為空",
      success: "更新用戶數據成功",
      error: "信息修改失敗，請稍後再試",
    }
  },

  editPassword: {
    username: "用戶名",
    oldPassword: "舊密碼",
    oldPasswordPlaceholder: "輸入您的舊密碼",
    newPassword: "新密碼",
    newPasswordPlaceholder: "輸入您的新密碼",
    confirmPassword: "確認密碼",
    confirmPasswordPlaceholder: "再次輸入您的新密碼",
    submit: "重置密碼",

    submitForm: {
      empty: "請輸入完整信息",
      notMatch: "兩次密碼不一致",
      short: "密碼長度不能少於6位",
      error: "舊密碼錯誤，請重新輸入",
    }
  },

  delUser: {
    title: "警告",
    info: "此操作將會退出登錄並清除您的所有用戶數據",
    confirm: "確認",
    cancel: "取消",
    error: "註銷失敗，請稍後再試",
  },

  userCollection: {
    titleInfo: "查看圖書詳情",
    titleDisabled: "圖書已下架",
    imgAlt: "封面",
    num: "庫存數量:",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",
    btnMsg: "在圖書中心查看",
    defaultBoxMsg: "正在加載收藏圖書...",

    selectFavorite: {
      empty: "未找到任何圖書記錄",
      error: "圖書信息加載失敗，請稍後再試",
    },

    menuError: "分類信息加載失敗，請稍後再試",
  },

  userBorrow: {
    searchPlaceholder: "搜索借閱圖書名稱或借閱日期",
    showRecentDays: "僅顯示最近七天",
    startDate: "借出日期",
    overDate: "預計歸還日期",
    days: "預計借閱天數",
    bookname: "書名",
    returnDate: "實際歸還日期",
    recordDays: "實際借閱天數",
    creditDelta: "信譽分變化",
    state: "狀態",
    actions: "操作",
    borrowing: "借閱中",
    returned: "已歸還",
    overdue: "已逾期",
    return: "歸還",
    renew: "續借",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",
    btnMsg: "在圖書中心查看",
    defaultBoxMsg: "正在加載借閱記錄...",

    fetchBorrowBorrows: {
      empty: "未找到任何借閱記錄",
      error: "借閱記錄加載失敗，請稍後再試",
    },

    selectUsersByUserName: {
      empty: "未找到任何用戶信息",
      error: "用戶信息加載失敗，請稍後再試",
    },

    handleReturn: {
      login: "請先登錄",
      success: "歸還成功，請對此次借閱進行評價",
      fail: "歸還失敗，請稍後再試",
    },

    handleRenew: {
      login: "請先登錄",
      credit: "信譽分過低，無法續借",
      fail: "續借失敗，請稍後再試",
    }
  },

  renewBox: {
    imgAlt: "封面",
    author: "作者:",
    menu: "分類:",
    press: "出版社:",
    price: "價格:",
    info: "更多信息:",
    num: "庫存數量:",
    adddate: "入庫日期:",
    renewDays: "預計續借天數 (最大7天):",
    renewDaysPlaceholder: "輸入天數:",
    overDate: "預計歸還日期:",
    renew: "確認續借",
    cancel: "取消",

    handleRenew: {
      login: "請先登錄",
      formEmpty: "請填寫預計續借天數和歸還日期",
      bookEmpty: "庫存不足，無法續借",
      overDays: "續借天數不能超過7天",
      success: "續借成功: {bookname}",
      bookRepeat: "您已續借過此書籍",
      fail: "續借失敗，請稍後再試",
    }
  },

  returnBox: {
    messagePlaceholder: "請輸入您對此次借閱的留言",
    btnMsg: "確認",

    submitRating: {
      empty: "圖書信息或評分不完整",
      fail: "評分提交失敗，請稍後再試",
    },

    addMessage: {
      fail: "論壇留言添加失敗，請稍後再試",
    }
  },

  userComment: {
    searchPlaceholder: "搜尋留言標題或內容",
    illegalTitle: "[違規言論]",
    illegalInfo: "[該留言涉嫌違規，已屏蔽]",
    delBtn: "刪除",
    emptyMsg: "未找到任何留言記錄",

    selectMessageByUserName: {
      error: "留言資訊加載失敗，請稍後再試",
    },

    delComment: {
      success: "留言刪除成功",
      fail: "留言刪除失敗，請稍後再試",
    }
  },

  userCredit: {
    searchPlaceholder: "搜尋信用分明細或日期",
    showRecentDays: "僅顯示最近七天",
    delete: "清空信用分記錄",
    date: "日期",
    creditCount: "當前信用分",
    info: "詳情",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",
    defaultBoxMsg: "正在加載信用分明細...",

    selectCredits: {
      empty: "未找到任何信用分記錄",
      error: "信用分明細加載失敗，請稍後再試",
    },

    deleteAll: {
      success: "清空信用分記錄成功",
      empty: "未找到任何信用分記錄",
      fail: "清空信用分記錄失敗，請稍後再試",
    }
  },

  adminHome: {
    realTimeData: "即時數據",
    onlineUsers: "在線用戶",
    bookCount: "收錄圖書",
    borrowCount: "借閱記錄",
    logCount: "日誌記錄",
    cpuData: "伺服器CPU資源",
    cpuType: "CPU型號:",
    cpuSpeed: "CPU頻率(GHz):",
    memData: "伺服器記憶體資源",
    memTotal: "總記憶體:",
    memUsed: "已使用:",
    userActivity: "用戶活躍度",
    borrowLog: "借閱記錄",
    sysLog: "系統日誌",

    getDailyUser: {
      empty: "未找到任何活躍度資訊",
      error: "活躍度資訊加載失敗，請稍後再試",
    },

    selectBooks: {
      empty: "未找到任何圖書記錄",
      error: "圖書資訊加載失敗，請稍後再試",
    },

    selectLogs: {
      empty: "未找到任何日誌記錄",
      error: "日誌資訊加載失敗，請稍後再試",
    },
  },

  adminLeftGuide: {
    title: "管理員控制臺",

    menuList: {
      book: "圖書管理",
      menu: "分類管理",
      borrow: "借閱管理",
      notice: "公告管理",
      forum: "論壇管理",
      user: "用戶管理",
      log: "日誌管理",
    }
  },

  adminBook: {
    searchPlaceholder: "搜尋圖書標題，作者，分類，出版社",
    addBook: "添加圖書",
    showRecentDays: "僅顯示最近七天",
    enableSelection: "啟用複選框",
    selectAll: "全選",
    closeSelected: "關閉",
    openSelected: "開放",
    deleteSelected: "刪除",
    name: "書名",
    author: "作者",
    menu: "分類",
    press: "出版社",
    price: "價格",
    num: "庫存",
    cover: "封面",
    info: "詳情",
    state: "狀態",
    score: "評分",
    adddate: "入庫日期",
    delete: "刪除",
    imgAlt: "封面",
    editTitle: "雙擊可進入編輯模式",
    noBook: "未找到任何圖書",
    open: "正常",
    close: "關閉",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",
    defaultBoxMsg: "正在加載圖書資訊...",

    selectMenuTitles: {
      error: "分類資訊加載失敗, 請稍後再試",
    },

    selectBooks: {
      empty: "未找到任何圖書記錄",
      error: "圖書資訊加載失敗, 請稍後再試",
    },

    delBook: {
      success: "圖書刪除成功",
      fail: "圖書刪除失敗，請稍後再試",
    },

    deleteSelectedBooks: {
      success: "刪除選中成功",
      empty: "未選中任何圖書記錄",
      fail: "圖書刪除失敗，請稍後再試",
    },

    openSelectedBooks: {
      success: "開放選中成功",
      empty: "未選中任何圖書記錄",
      fail: "圖書開放失敗，請稍後再試",
    },

    closeSelectedBooks: {
      success: "關閉選中成功",
      empty: "未選中任何圖書記錄",
      fail: "圖書關閉失敗，請稍後再試",
    },

    updateBook: {
      fail: "圖書更新失敗，請稍後再試",
    }
  },

  addBook: {
    title: "欄位",
    input: "輸入",
    name: "圖書名稱",
    namePlaceholder: "輸入圖書名稱",
    author: "作者",
    authorPlaceholder: "輸入作者",
    menu: "分類",
    menuPlaceholder: "選擇分類",
    price: "價格",
    pricePlaceholder: "輸入價格",
    press: "出版社",
    pressPlaceholder: "輸入出版社",
    num: "庫存",
    numPlaceholder: "輸入庫存",
    cover: "封面",
    info: "詳情",
    infoPlaceholder: "輸入詳情",
    state: "狀態",
    open: "正常",
    close: "關閉",
    autoPush: "自動推送公告",
    autoPushTip: "開啟後在圖書上線時自動推送公告，可在管理員儀表盤-公告管理中查看",
    adddate: "添加日期",
    submit: "提交",

    fetchMenuTitles: {
      fail: "分類資訊加載失敗, 請稍後再試",
    },

    handleImageChange: {
      alert: "請上傳圖片格式文件（jpg, jpeg, png, gif）",
      fail: "上傳失敗，請稍後再試",
    },

    submitForm: {
      empty: "圖書資訊不完整",
      success: "圖書添加成功",
      noticeFail: "公告推送失敗，請稍後再試",
      fail: "圖書添加失敗，請稍後再試",
    }
  },

  adminMenu: {
    searchPlaceholder: "搜尋分類名稱",
    addMenu: "新增分類",
    showRecentDays: "僅顯示最近七天",
    enableSelection: "啟用複選框",
    selectAll: "全選",
    delete: "刪除",
    title: "分類名稱",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",
    defaultBoxMsg: "正在加載分類資訊...",
    noMenu: "未找到任何分類",

    selectMenus: {
      empty: "未找到任何分類記錄",
      fail: "分類資訊加載失敗，請稍後再試",
    },

    delMenu: {
      fail: "分類刪除失敗，請稍後再試",
    },

    deleteSelectedMenus: {
      empty: "未選中任何分類記錄",
      success: "刪除選中成功",
      fail: "分類刪除失敗，請稍後再試",
    },

    updateMenu: {
      fail: "分類更新失敗，請稍後再試",
    }
  },

  addMenu: {
    title: "欄位",
    input: "輸入",
    name: "分類名稱",
    namePlaceholder: "輸入分類名稱",
    submit: "提交",

    submitForm: {
      empty: "分類資訊不完整",
      success: "分類新增成功",
      fail: "分類新增失敗，請稍後再試",
    }
  },

  adminBorrow: {
    searchPlaceholder: "搜尋借閱資訊或用戶名",
    add: "新增借閱",
    showRecentDays: "僅顯示最近七天",
    enableSelection: "啟用複選框",
    selectAll: "全選",
    returnSelected: "歸還",
    delete: "刪除",
    user: "用戶名",
    book: "圖書名稱",
    startDate: "借閱日期",
    overDate: "預計歸還日期",
    days: "預計借閱天數",
    returnDate: "實際歸還日期",
    recordDays: "實際借閱天數",
    overtime: "逾期天數",
    state: "借閱狀態",
    credit: "信用分",
    adddate: "新增日期",
    overdue: "已逾期",
    returned: "已歸還",
    borrowing: "借閱中",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",
    defaultBoxMsg: "正在加載借閱記錄...",
    noBorrow: "未找到任何借閱記錄",

    selectBorrows: {
      empty: "未找到任何借閱記錄",
      fail: "借閱記錄加載失敗，請稍後再試",
    },

    delBorrow: {
      fail: "借閱記錄刪除失敗，請稍後再試",
    },

    deleteSelectedBorrows: {
      empty: "未選中任何借閱記錄",
      success: "刪除選中成功",
      fail: "借閱記錄刪除失敗，請稍後再試",
    },

    updateBorrow: {
      fail: "借閱記錄更新失敗，請稍後再試",
    },

    returnSelectedBorrows: {
      empty: "未選中任何借閱記錄",
      success: "歸還選中成功",
      fail: "借閱記錄歸還失敗，請稍後再試",
    }
  },

  addBorrow: {
    title: "欄位",
    input: "輸入",
    username: "借閱用戶",
    usernamePlaceholder: "選擇借閱用戶",
    book: "借閱圖書",
    bookPlaceholder: "選擇借閱圖書",
    startdate: "借閱日期",
    overdate: "預計歸還日期",
    days: "預計借閱天數",
    daysPlaceholder: "輸入預計借閱天數",
    adduser: "新增用戶",
    adddate: "新增日期",
    submit: "提交",

    selectBooks: {
      empty: "未找到任何圖書記錄",
      fail: "圖書資訊加載失敗，請稍後再試",
    },

    selectUsers: {
      fail: "用戶資訊加載失敗，請稍後再試",
    },

    submitForm: {
      empty: "借閱資訊不完整",
      success: "借閱新增成功",
      fail: "借閱新增失敗，請稍後再試",
    }
  },

  adminNotice: {
    searchPlaceholder: "搜尋公告名，角色或註冊資訊",
    add: "新增公告",
    showRecentDays: "僅顯示最近七天",
    enableSelection: "啟用複選框",
    selectAll: "全選",
    top: "置頂",
    normal: "正常",
    untop: "取消置頂",
    delete: "刪除",
    title: "公告標題",
    info: "詳情內容",
    isTop: "是否置頂",
    infoTip: "雙擊可進入編輯模式",
    defaultBoxMsg: "正在加載公告資訊...",
    noNotice: "未找到任何公告",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",

    selectNotices: {
      empty: "未找到任何公告記錄",
      fail: "公告資訊加載失敗，請稍後再試",
    },

    delNotice: {
      fail: "公告刪除失敗，請稍後再試",
    },

    deleteSelectedNotices: {
      empty: "未選中任何公告記錄",
      success: "刪除選中成功",
      fail: "公告刪除失敗，請稍後再試",
    },

    topSelectedNotices: {
      empty: "未選中任何公告記錄",
      success: "置頂選中成功",
      fail: "公告置頂失敗，請稍後再試",
    },

    untopSelectedNotices: {
      empty: "未選中任何公告記錄",
      success: "取消置頂選中成功",
      fail: "公告取消置頂失敗，請稍後再試",
    },

    updateNotice: {
      fail: "公告更新失敗，請稍後再試",
    }
  },

  addNotice: {
    field: "欄位",
    input: "輸入",
    title: "公告標題",
    titlePlaceholder: "請輸入公告標題",
    info: "公告內容",
    infoPlaceholder: "請輸入公告內容",
    adduser: "添加用戶",
    adddate: "添加日期",
    isTop: "是否置頂",
    isTopPlaceholder: "請選擇是否置頂",
    top: "置頂",
    normal: "正常",
    submit: "提交",

    submitForm: {
      empty: "公告信息不完整",
      success: "公告添加成功",
      fail: "公告添加失敗，請稍後再試",
    }
  },

  adminForum: {
    searchPlaceholder: "搜尋留言名，發表用戶或日期",
    add: "添加留言",
    showRecentDays: "僅顯示最近七天",
    enableSelection: "啟用複選框",
    selectAll: "全選",
    ban: "屏蔽",
    unban: "解除屏蔽",
    delete: "刪除",
    title: "留言標題",
    info: "留言內容",
    adduser: "發表用戶",
    adddate: "發表日期",
    views: "瀏覽數",
    likes: "點贊數",
    state: "狀態",
    infoTip: "雙擊可進入編輯模式",
    normal: "正常",
    banned: "屏蔽",
    defaultBoxMsg: "正在加載留言信息...",
    noMessage: "未找到任何留言",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",

    selectMessages: {
      empty: "未找到任何留言記錄",
      fail: "留言信息加載失敗，請稍後再試",
    },

    delMessage: {
      fail: "留言刪除失敗，請稍後再試",
    },

    deleteSelectedMessages: {
      empty: "未選中任何留言記錄",
      success: "刪除選中成功",
      fail: "留言刪除失敗，請稍後再試",
    },

    banSelectedMessages: {
      empty: "未選中任何留言記錄",
      success: "屏蔽選中成功",
      fail: "留言屏蔽失敗，請稍後再試",
    },

    unbanSelectedMessages: {
      empty: "未選中任何留言記錄",
      success: "解除屏蔽選中成功",
      fail: "留言解除屏蔽失敗，請稍後再試",
    },

    updateMessage: {
      fail: "留言更新失敗，請稍後再試",
    }
  },

  addMessage: {
    field: "欄位",
    input: "輸入",
    title: "留言標題",
    titlePlaceholder: "請輸入留言標題",
    info: "留言內容",
    infoPlaceholder: "請輸入留言內容",
    adduser: "添加用戶",
    adduserPlaceholder: "請輸入添加用戶",
    adddate: "添加日期",
    submit: "提交",

    submitForm: {
      empty: "留言信息不完整",
      success: "留言添加成功",
      fail: "留言添加失敗，請稍後再試",
    }
  },

  adminUser: {
    searchPlaceholder: "搜尋用戶名，註冊日期或角色",
    add: "添加用戶",
    enableSelection: "啟用複選框",
    selectAll: "全選",
    ban: "封禁",
    unban: "解除封禁",
    delete: "刪除",
    username: "用戶名",
    role: "權限組",
    roleTip: "該項會在重新登錄後生效",
    email: "郵箱",
    state: "狀態",
    credit: "信譽分",
    adddate: "註冊日期",
    superAdmin: "超級管理員",
    admin: "管理員",
    user: "用戶",
    normal: "正常",
    banned: "封禁",
    denied: "權限不足",
    defaultBoxMsg: "正在加載用戶信息...",
    noUser: "未找到任何用戶",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",

    selectUsers: {
      empty: "未找到任何用戶記錄",
      fail: "用戶信息加載失敗，請稍後再試",
    },

    delUser: {
      fail: "用戶刪除失敗，請稍後再試",
    },

    deleteSelectedUsers: {
      empty: "未選中任何用戶記錄",
      denied: "權限不足",
      success: "刪除選中成功",
      fail: "用戶刪除失敗，請稍後再試",
    },

    banSelectedUsers: {
      empty: "未選中任何用戶記錄",
      denied: "權限不足",
      success: "封禁選中成功",
      fail: "用戶封禁失敗，請稍後再試",
    },

    unbanSelectedUsers: {
      empty: "未選中任何用戶記錄",
      denied: "權限不足",
      success: "解除封禁選中成功",
      fail: "用戶解除封禁失敗，請稍後再試",
    },

    updateUser: {
      fail: "用戶更新失敗，請稍後再試",
    }
  },

  addUser: {
    field: "欄位",
    input: "輸入",
    username: "用戶名",
    usernamePlaceholder: "請輸入用戶名",
    state: "狀態",
    normal: "正常",
    banned: "封禁",
    email: "郵箱",
    emailPlaceholder: "輸入預設用戶郵箱",
    adddate: "註冊日期",
    submit: "提交",

    submitForm: {
      empty: "用戶名和郵箱不能為空",
      success: "用戶添加成功，初始密碼為：{password}",
      fail: "用戶添加失敗，請稍後再試",
    }
  },

  adminLog: {
    searchPlaceholder: "搜尋用戶名，IP，事件類型，詳情或日期",
    enableLog: "啟用日誌記錄",
    showRecentDays: "僅顯示最近七天",
    enableSelection: "啟用複選框",
    selectAll: "全選",
    delete: "刪除",
    username: "用戶名",
    type: "事件類型",
    info: "詳情",
    adddate: "日期",
    defaultBoxMsg: "正在加載日誌信息...",
    noLog: "未找到任何日誌",
    pageSize: "每頁顯示",
    firstPage: "首頁",
    prevPage: "上一頁",
    nextPage: "下一頁",
    lastPage: "尾頁",
    pageInfo: "第 {currentPage} 頁 / 共 {totalPages} 頁",

    toggleLog: {
      response: "日誌記錄已{status}",
      open: "啟用",
      close: "關閉",
      fail: "日誌記錄啟用失敗，請稍後再試",
    },

    selectLogs: {
      empty: "未找到任何日誌記錄",
      fail: "日誌信息加載失敗，請稍後再試",
    },

    delLog: {
      fail: "日誌刪除失敗，請稍後再試",
    },

    deleteSelectedLogs: {
      empty: "未選中任何日誌記錄",
      success: "刪除選中成功",
      fail: "日誌刪除失敗，請稍後再試",
    },

    openInfo: {
      message: "查看詳情：",
    }
  },

  notFound: {
    title: "返回首頁",
    info: "404 Not Found",
    message: "找不到該頁面...",
  }
}