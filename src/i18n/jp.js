export default {
  setting: {
    nightMode: "ナイトモード",
    title: "システム設定",
    language: "システム言語",
  },

  publicLogin: {
    logo: "高校図書管理システム",
    changeReg: "アカウントがないですか？今すぐ登録",
    loginError: "ユーザー名またはパスワードが間違っています",
    empty: "ユーザー名とパスワードは必須です",
  },

  publicReg: {
    logo: "S.O.L.A.R",
    changeLogin: "すでにアカウントをお持ちですか？今すぐログイン",

    handleReg: {
      empty: "ユーザー名とパスワードは必須です",
      short: "パスワードの長さは6文字未満にできません",
      notMatch: "パスワードが一致しません",
      success: "登録成功、ユーザー名：{username}",
      fail: "登録失敗: {error}",
    }
  },

  publicLogout: {
    info: "本当にログアウトしますか？",
    confirm: "確認",
    cancel: "キャンセル",
  },

  headerGuide: {
    title: "高校図書管理システム",
    home: "ホーム",
    book: "図書センター",
    forum: "フォーラムセンター",
    user: "ユーザーセンター",
    search: "書籍検索",
    notice: "お知らせ",
    setting: "設定",
    admin: "システム設定",
    login: "ログイン",
    logout: "ログアウト",
  },

  publicSearch: {
    placeholder: "検索したい書籍を入力",
    alertMsg: "検索内容は空にできません",
  },

  publicNotice: {
    title: "サイト内のお知らせ",
    top: "[トップ]",
    empty: "お知らせはありません",
    error: "お知らせの取得に失敗しました",
  },

  noticeBox: {
    adduser: "投稿者：",
    adddate: "投稿日：",
    defaultMsg: {
      title: "システムエラー！",
      adduser: "不明",
      adddate: "不明",
      info: "コンテンツの読み込みに失敗しました！",
    },
  },

  messageBox: {
    btnMsg: "確認",
    emptyCopyError: "コピーする内容が見つかりません",
    copySuccess: "コピー成功",
    copyFail: "コピー失敗"
  },

  alertBox: {
    btnMsg: "確認",
  },

  editTag: {
    title: "詳細を編集",
    placeholder: "内容を編集",
    btnMsg: "送信",
  },

  inputTag: {
    placeholder: "タグを入力",
    empty: "タグは空にできません",
  },

  publicHome: {
    title_1: "Smart Organizational Library Assistant Resource",
    subtitle_1: "Vue2 と Node.js に基づいて開発された現代的な図書管理プラットフォーム。大学にデジタル化されたワンストップオンライン図書管理ソリューションを提供し、大学図書管理を効率的でモダンなデジタル時代に推進します。",
    btnText_1: "詳細を見る",

    title_2: "図書センター",
    subtitle_2: "豊富なオンライン書籍ライブラリで、各種書籍リソースを簡単に検索・閲覧できます。即時貸出機能により、書籍の取得が効率的で簡単になり、全サイト検索は曖昧検索をサポートし、興味のある書籍を正確に特定できます。",
    btnText_2: "今すぐ貸し出す",

    title_3: "フォーラムセンター",
    subtitle_3: "書籍や学習リソースの共有と議論を促進するための内部コミュニケーションプラットフォーム。さまざまな書籍に関するディスカッションに参加し、投稿と返信を行い、経験や見解を共有して、学術的な交流と知的なコラボレーションを促進します。",
    btnText_3: "今すぐ探索",

    title_4: "ユーザーセンター",
    subtitle_4: "個人のセキュリティ設定、信用スコア管理、貸出履歴、お気に入り機能を集約し、アカウント情報の管理と最適化を提供します。アカウントのプライバシーとセキュリティを管理し、信用スコアをリアルタイムで確認し、借りた履歴や好みを理解し、インテリジェントな図書管理体験を楽しんでください。",
    btnText_4: "設定に進む",

    title_5: "プロジェクト紹介とサポート",
    subtitle_5: "このプロジェクトの継続的な技術サポートとメンテナンスを提供し、変化するニーズに対応するためにプラットフォームの更新と最適化をタイムリーに行います。本プロジェクトはMITオープンソースライセンスを採用しており、GitHubでフィードバックを提供したり、サポートを求めたりできます。",
    btnText_5: "GitHubで見る",
  },

  userBook: {
    titleInfo: "図書詳細を見る",
    titleInfoDisabled: "図書は販売終了しました",
    boxMsg: "データはありません...",
    imgAlt: "表紙",
    num: "在庫数:",
    firstPage: "ホームページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最終ページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",
    btnMsg: "借りる",
    guideTitle: "すべての図書",
    bookEmpty: "図書情報が見つかりません",
    bookError: "図書情報の読み込みに失敗しました。後で再試行してください",
    menuError: "カテゴリー情報の読み込みに失敗しました。後で再試行してください",
    searchResult: "条件に一致する図書は {resultCount} 件見つかりました",
    searchEmpty: "条件に一致する図書は見つかりません",
  },

  bookBox: {
    imgAlt: "表紙",
    scoreTitle: "評価:",
    scoreInfo: "{score} / 5 ({numScore} 人が評価)",
    scoreNone: "評価はありません",
    author: "著者:",
    menu: "カテゴリー:",
    press: "出版社:",
    price: "価格:",
    info: "詳細情報:",
    num: "在庫数:",
    adddate: "入荷日:",
    messageTitle: "読者のコメント",
    messageNone: "コメントはありません",
    btnMsg: "借りる",
    noneCredit: "ユーザーの信用スコアが不足しています。操作は失敗しました",
    login: "ログイン後に操作してください",
    favorite: "お気に入り",
    cancelFavorite: "お気に入り解除",
    addFavoriteSuccess: "お気に入りに追加しました。ユーザーセンターで確認できます",
    addFavoriteFail: "お気に入りの追加に失敗しました",
    cancelFavoriteSuccess: "お気に入り解除に成功しました",
    cancelFavoriteFail: "お気に入り解除に失敗しました",
    messageError: "コメント情報の読み込みに失敗しました。後で再試行してください",
    userInfoNone: "ユーザー情報が見つかりません",
    userInfoError: "ユーザー情報の読み込みに失敗しました。後で再試行してください",
    borrow: "借りる",
    view: "図書センターで見る",
  },

  borrowBox: {
    imgAlt: "表紙",
    author: "著者:",
    menu: "カテゴリー:",
    press: "出版社:",
    price: "価格:",
    info: "詳細情報:",
    num: "在庫数:",
    adddate: "入荷日:",
    borrowDays: "予想借りる日数（最大30日）:",
    borrowDaysPlaceholder: "日数を入力",
    overDate: "予想返却日:",
    handleBorrow: "借りる確認",
    handleCancel: "キャンセル",
    loginError: "ログインしてください",
    formError: "予想借りる日数と返却日を入力してください",
    emptyError: "在庫不足で借りることができません",
    overDaysError: "借りる日数は30日を超えてはいけません",
    borrowSuccess: "借りることに成功しました。ユーザーセンターで確認してください",
    borrowRepeat: "すでにこの本を借りています",
    borrowFail: "借りることに失敗しました。後で再試行してください",
  },

  userForum: {
    illegalTitle: "違反コメント",
    illegalInfo: "[このコメントは違反の疑いがあり、非表示にされました]",
    yourself: "あなた",
    anonymous: "匿名ユーザー",
    title: "コメントのタイトルを入力",
    info: "コメント内容を入力",
    submit: "投稿",
    isAnonymous: "匿名で投稿",
    borrowMsg: "借りたコメントを表示",
    loginFirst: "コメントを投稿するにはログインしてください",
    defaultBoxMsg: "フォーラムのコメントを読み込んでいます...",
    emptyBoxMsg: "フォーラムのコメントが見つかりません",
    errorBoxMsg: "フォーラムのコメントの読み込みに失敗しました",
    updateError: "フォーラムコメントデータの更新に失敗しました",
    emptyError: "フォーラムタイトルや内容が不完全です",
    addError: "フォーラムコメントの追加に失敗しました",
    delSuccess: "フォーラムコメントの削除に成功しました",
    delError: "フォーラムコメントの削除に失敗しました",
  },

  userSetting: {
    personalInfo: "アカウント基本情報",
    personalInfoTip: "登録時に提供した基本情報（ユーザー名、メールアドレス、登録日など）",
    username: "ユーザー名:",
    superAdmin: "[スーパ管理者]",
    admin: "[管理者]",
    user: "[ユーザー]",
    email: "メールアドレス:",
    registerDate: "登録日:",
    edit: "アカウント情報を編集",
    security: "アカウントのセキュリティ情報",
    securityTip: "アカウントのセキュリティを保護するため、定期的なパスワード変更を推奨します",
    changePassword: "パスワードを変更",
    delAccount: "アカウントを削除",
    credit: "アカウントの信用スコア",
    creditTip: "ユーザーの行動が信用スコアに影響を与え、信用スコアが低すぎると機能が制限される場合があります",
    currentCredit: "現在の信用スコア:",
    creditContent: "本システムでは、ユーザーの信用スコアはその行動に基づいて動的に調整され、システムの公平性と安全性を確保します。",
    goCredit: "信用スコアの詳細を確認",
    guideTitle: "ユーザーセンター",
    editUser: "アカウント情報を編集",
    editPassword: "パスワードを変更",

    guideList: {
      collection: "私のお気に入り",
      borrow: "私の借りた本",
      comment: "私のコメント",
      credit: "私の信用スコア",
    },

    selectUsersByUserName: {
      empty: "ユーザー情報が見つかりません",
      error: "ユーザー情報の読み込みに失敗しました。後で再試行してください",
    }
  },

  editUser: {
    title: "個人情報を変更",
    subTitle: "フォーム項目をダブルクリックして編集",
    username: "ユーザー名",
    email: "メールアドレス",
    tip: "ヒント：フォーム項目をダブルクリックして編集、Enterキーで項目を送信",
    submit: "保存",

    selectUsersByUserName: {
      empty: "ユーザー情報が見つかりません",
      error: "ユーザー情報の読み込みに失敗しました。後で再試行してください",
    },

    submitForm: {
      empty: "ユーザー名とメールアドレスは必須です",
      success: "ユーザーデータの更新に成功しました",
      error: "情報の変更に失敗しました。後で再試行してください",
    },
  },

  editPassword: {
    username: "ユーザー名",
    oldPassword: "旧パスワード",
    oldPasswordPlaceholder: "旧パスワードを入力",
    newPassword: "新パスワード",
    newPasswordPlaceholder: "新パスワードを入力",
    confirmPassword: "確認用パスワード",
    confirmPasswordPlaceholder: "新パスワードを再度入力",
    submit: "パスワードをリセット",

    submitForm: {
      empty: "情報を完全に入力してください",
      notMatch: "パスワードが一致しません",
      short: "パスワードの長さは6文字以上である必要があります",
      error: "旧パスワードが間違っています。再度入力してください",
    }
  },

  delUser: {
    title: "警告",
    info: "この操作はログアウトし、すべてのユーザーデータを削除します",
    confirm: "確認",
    cancel: "キャンセル",
    error: "削除に失敗しました。後で再試行してください",
  },

  userCollection: {
    titleInfo: "図書詳細を見る",
    titleDisabled: "図書は販売終了しました",
    imgAlt: "表紙",
    num: "在庫数:",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最終ページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",
    btnMsg: "図書センターで見る",
    defaultBoxMsg: "お気に入りの図書を読み込んでいます...",

    selectFavorite: {
      empty: "図書記録が見つかりません",
      error: "図書情報の読み込みに失敗しました。後で再試行してください",
    },

    menuError: "カテゴリー情報の読み込みに失敗しました。後で再試行してください",
  },

  userBorrow: {
    searchPlaceholder: "借りた本の名前または借りた日付を検索",
    showRecentDays: "最近7日間のみ表示",
    startDate: "借りた日付",
    overDate: "予想返却日",
    days: "予想借りる日数",
    bookname: "本の名前",
    returnDate: "実際の返却日",
    recordDays: "実際に借りた日数",
    creditDelta: "信用スコアの変化",
    state: "状態",
    actions: "操作",
    delete: "削除",
    borrowing: "借りている",
    returned: "返却済み",
    overdue: "延滞",
    return: "返却",
    renew: "延長",
    pageSize: "ページごとの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最終ページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",
    btnMsg: "図書センターで見る",
    defaultBoxMsg: "借りた記録を読み込んでいます...",

    fetchBorrowBorrows: {
      empty: "借りた記録が見つかりません",
      error: "借りた記録の読み込みに失敗しました。後で再試行してください",
    },

    selectUsersByUserName: {
      empty: "ユーザー情報が見つかりません",
      error: "ユーザー情報の読み込みに失敗しました。後で再試行してください",
    },

    handleReturn: {
      login: "ログインしてください",
      success: "返却に成功しました。評価してください",
      fail: "返却に失敗しました。後で再試行してください",
    },

    handleRenew: {
      login: "ログインしてください",
      credit: "信用スコアが低すぎて延長できません",
      fail: "延長に失敗しました。後で再試行してください",
    },

    delBorrow: {
      success: "削除に成功しました",
      fail: "削除に失敗しました。後で再試行して，请",
    }
  },

  renewBox: {
    imgAlt: "表紙",
    author: "著者:",
    menu: "カテゴリー:",
    press: "出版社:",
    price: "価格:",
    info: "詳細情報:",
    num: "在庫数:",
    adddate: "入荷日:",
    renewDays: "予想延長日数（最大7日）:",
    renewDaysPlaceholder: "日数を入力",
    overDate: "予想返却日:",
    renew: "延長確認",
    cancel: "キャンセル",

    handleRenew: {
      login: "ログインしてください",
      formEmpty: "予想延長日数と返却日を入力してください",
      bookEmpty: "在庫が不足しているため延長できません",
      overDays: "延長日数は7日を超えてはいけません",
      success: "延長に成功しました: {bookname}",
      bookRepeat: "すでにこの本を延長しています",
      fail: "延長に失敗しました。後で再試行してください",
    }
  },

  returnBox: {
    messagePlaceholder: "今回の借りた本についてコメントを入力してください",
    btnMsg: "確認",

    submitRating: {
      empty: "本の情報または評価が不完全です",
      fail: "評価の送信に失敗しました。後で再試行してください",
    },

    addMessage: {
      fail: "フォーラムコメントの追加に失敗しました。後で再試行してください",
    }
  },

  userComment: {
    searchPlaceholder: "コメントタイトルまたは内容を検索",
    illegalTitle: "[違反発言]",
    illegalInfo: "[このコメントは違反の疑いがあり、非表示にされました]",
    delBtn: "削除",
    emptyMsg: "コメントが見つかりません",

    selectMessageByUserName: {
      error: "コメント情報の読み込みに失敗しました。後で再試行してください",
    },

    delComment: {
      success: "コメントの削除に成功しました",
      fail: "コメントの削除に失敗しました。後で再試行してください",
    }
  },

  userCredit: {
    searchPlaceholder: "信用分明細または日付を検索",
    showRecentDays: "最近7日間のみ表示",
    delete: "すべて削除",
    date: "日付",
    creditCount: "信用分",
    info: "詳細",
    pageSize: "ページごとの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最終ページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",
    defaultBoxMsg: "信用分明細を読み込んでいます...",

    selectCredits: {
      empty: "信用分明細が見つかりません",
      error: "信用分明細の読み込みに失敗しました。後で再試行してください",
    },

    deleteAll: {
      success: "信用分明細を正常に削除しました",
      empty: "信用分明細が見つかりません",
      fail: "信用分明細の削除に失敗しました。後で再試行してください",
    },
  },

  adminHome: {
    realTimeData: "リアルタイムデータ",
    onlineUsers: "オンラインユーザー",
    bookCount: "収録図書",
    borrowCount: "借阅記録",
    logCount: "ログ記録",
    cpuData: "サーバーCPUリソース",
    cpuType: "CPUモデル:",
    cpuSpeed: "CPU周波数(GHz):",
    memData: "サーバーメモリリソース",
    memTotal: "総メモリ:",
    memUsed: "使用済み:",
    userActivity: "ユーザー活動度",
    borrowLog: "借阅記録",
    sysLog: "システムログ",

    getDailyUser: {
      empty: "活動度情報が見つかりません",
      error: "活動度情報の読み込みに失敗しました。後で再試行してください",
    },

    selectBooks: {
      empty: "図書記録が見つかりません",
      error: "図書情報の読み込みに失敗しました。後で再試行してください",
    },

    selectLogs: {
      empty: "ログ記録が見つかりません",
      error: "ログ情報の読み込みに失敗しました。後で再試行してください",
    },
  },

  adminLeftGuide: {
    title: "管理者コンソール",

    menuList: {
      book: "図書管理",
      menu: "カテゴリ管理",
      borrow: "借用管理",
      notice: "通知管理",
      forum: "フォーラム管理",
      user: "ユーザー管理",
      log: "ログ管理",
    }
  },

  adminBook: {
    searchPlaceholder: "図書タイトル、著者、カテゴリ、出版社を検索",
    addBook: "図書を追加",
    showRecentDays: "最新の7日間のみ表示",
    enableSelection: "チェックボックスを有効にする",
    selectAll: "すべて選択",
    closeSelected: "閉じる",
    openSelected: "開放",
    deleteSelected: "削除",
    name: "書名",
    author: "著者",
    menu: "カテゴリ",
    press: "出版社",
    price: "価格",
    num: "在庫",
    cover: "表紙",
    info: "詳細",
    state: "状態",
    score: "評価",
    adddate: "登録日",
    delete: "削除",
    imgAlt: "表紙",
    editTitle: "ダブルクリックで編集モードに入ります",
    noBook: "図書が見つかりません",
    open: "正常",
    close: "閉じる",
    pageSize: "ページごとの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最後のページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",
    defaultBoxMsg: "図書情報を読み込み中...",

    selectMenuTitles: {
      error: "カテゴリ情報の読み込みに失敗しました。後で再試行してください",
    },

    selectBooks: {
      empty: "図書記録が見つかりません",
      error: "図書情報の読み込みに失敗しました。後で再試行してください",
    },

    delBook: {
      success: "図書が正常に削除されました",
      fail: "図書削除に失敗しました。後で再試行してください",
    },

    deleteSelectedBooks: {
      success: "選択した図書を削除しました",
      empty: "選択した図書記録がありません",
      fail: "図書削除に失敗しました。後で再試行してください",
    },

    openSelectedBooks: {
      success: "選択した図書を開放しました",
      empty: "選択した図書記録がありません",
      fail: "図書開放に失敗しました。後で再試行してください",
    },

    closeSelectedBooks: {
      success: "選択した図書を閉じました",
      empty: "選択した図書記録がありません",
      fail: "図書閉鎖に失敗しました。後で再試行してください",
    },

    updateBook: {
      fail: "図書更新に失敗しました。後で再試行してください",
    }
  },

  addBook: {
    title: "フィールド",
    input: "入力",
    name: "図書名",
    namePlaceholder: "図書名を入力",
    author: "著者",
    authorPlaceholder: "著者名を入力",
    menu: "カテゴリ",
    menuPlaceholder: "カテゴリを選択",
    price: "価格",
    pricePlaceholder: "価格を入力",
    press: "出版社",
    pressPlaceholder: "出版社を入力",
    num: "在庫",
    numPlaceholder: "在庫数を入力",
    cover: "表紙",
    info: "詳細",
    infoPlaceholder: "詳細を入力",
    state: "状態",
    open: "正常",
    close: "閉じる",
    autoPush: "自動通知送信",
    autoPushTip: "有効にすると、図書が公開された際に自動で通知が送信されます。通知は管理者ダッシュボードの通知管理で確認できます",
    adddate: "追加日",
    submit: "提出",

    fetchMenuTitles: {
      fail: "カテゴリ情報の読み込みに失敗しました。後で再試行してください",
    },

    handleImageChange: {
      alert: "画像形式のファイル（jpg, jpeg, png, gif）をアップロードしてください",
      fail: "アップロードに失敗しました。後で再試行してください",
    },

    submitForm: {
      empty: "図書情報が不完全です",
      success: "図書が正常に追加されました",
      noticeFail: "通知送信に失敗しました。後で再試行してください",
      fail: "図書の追加に失敗しました。後で再試行してください",
    }
  },

  adminMenu: {
    searchPlaceholder: "カテゴリ名を検索",
    addMenu: "カテゴリ追加",
    showRecentDays: "最新の7日間のみ表示",
    enableSelection: "チェックボックスを有効にする",
    selectAll: "すべて選択",
    delete: "削除",
    title: "カテゴリ名",
    pageSize: "ページごとの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最後のページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",
    defaultBoxMsg: "カテゴリ情報を読み込み中...",
    noMenu: "カテゴリが見つかりません",

    selectMenus: {
      empty: "カテゴリ記録が見つかりません",
      fail: "カテゴリ情報の読み込みに失敗しました。後で再試行してください",
    },

    delMenu: {
      fail: "カテゴリ削除に失敗しました。後で再試行してください",
    },

    deleteSelectedMenus: {
      empty: "選択したカテゴリ記録がありません",
      success: "選択したカテゴリを削除しました",
      fail: "カテゴリ削除に失敗しました。後で再試行してください",
    },

    updateMenu: {
      fail: "カテゴリ更新に失敗しました。後で再試行してください",
    }
  },

  addMenu: {
    title: "フィールド",
    input: "入力",
    name: "カテゴリ名",
    namePlaceholder: "カテゴリ名を入力",
    submit: "提出",

    submitForm: {
      empty: "カテゴリ情報が不完全です",
      success: "カテゴリが正常に追加されました",
      fail: "カテゴリ追加に失敗しました。後で再試行してください",
    }
  },

  adminBorrow: {
    searchPlaceholder: "借用情報またはユーザー名を検索",
    add: "借用を追加",
    showRecentDays: "最新の7日間のみ表示",
    enableSelection: "チェックボックスを有効にする",
    selectAll: "すべて選択",
    returnSelected: "返却",
    delete: "削除",
    user: "ユーザー名",
    book: "図書名",
    startDate: "借用日",
    overDate: "返却予定日",
    days: "借用予定日数",
    returnDate: "実際の返却日",
    recordDays: "実際の借用日数",
    overtime: "延滞日数",
    state: "借用状態",
    credit: "信用スコア",
    adddate: "追加日",
    overdue: "延滞中",
    returned: "返却済み",
    borrowing: "借用中",
    pageSize: "ページごとの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最後のページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",
    defaultBoxMsg: "借用記録を読み込み中...",
    noBorrow: "借用記録が見つかりません",

    selectBorrows: {
      empty: "借用記録が見つかりません",
      fail: "借用記録の読み込みに失敗しました。後で再試行してください",
    },

    delBorrow: {
      fail: "借用記録削除に失敗しました。後で再試行してください",
    },

    deleteSelectedBorrows: {
      empty: "選択した借用記録がありません",
      success: "選択した記録を削除しました",
      fail: "借用記録削除に失敗しました。後で再試行してください",
    },

    updateBorrow: {
      fail: "借用記録更新に失敗しました。後で再試行してください",
    },

    returnSelectedBorrows: {
      empty: "選択した借用記録がありません",
      success: "選択した記録を返却しました",
      fail: "借用記録の返却に失敗しました。後で再試行してください",
    }
  },

  addBorrow: {
    title: "フィールド",
    input: "入力",
    username: "借りるユーザー",
    usernamePlaceholder: "借りるユーザーを選択",
    book: "借りる本",
    bookPlaceholder: "借りる本を選択",
    startdate: "借りる日",
    overdate: "返却予定日",
    days: "予定借り日数",
    daysPlaceholder: "予定借り日数を入力",
    adduser: "ユーザーを追加",
    adddate: "追加日",
    submit: "送信",

    selectBooks: {
      empty: "本の記録が見つかりません",
      fail: "本の情報の読み込みに失敗しました。後で再試行してください",
    },

    selectUsers: {
      fail: "ユーザー情報の読み込みに失敗しました。後で再試行してください",
    },

    submitForm: {
      empty: "借りる情報が不完全です",
      success: "借りる情報が追加されました",
      fail: "借りる情報の追加に失敗しました。後で再試行してください",
    }
  },

  adminNotice: {
    searchPlaceholder: "公告名、役割または登録情報を検索",
    add: "公告を追加",
    showRecentDays: "最近7日間のみ表示",
    enableSelection: "チェックボックスを有効にする",
    selectAll: "すべて選択",
    top: "トップに固定",
    normal: "通常",
    untop: "トップ固定を解除",
    delete: "削除",
    title: "公告タイトル",
    info: "詳細内容",
    isTop: "トップ固定にするか",
    infoTip: "ダブルクリックで編集モードに入ります",
    defaultBoxMsg: "公告情報を読み込み中...",
    noNotice: "公告が見つかりません",
    pageSize: "ページあたりの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最後のページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",

    selectNotices: {
      empty: "公告の記録が見つかりません",
      fail: "公告情報の読み込みに失敗しました。後で再試行してください",
    },

    delNotice: {
      fail: "公告の削除に失敗しました。後で再試行してください",
    },

    deleteSelectedNotices: {
      empty: "選択された公告がありません",
      success: "選択した公告が削除されました",
      fail: "公告の削除に失敗しました。後で再試行してください",
    },

    topSelectedNotices: {
      empty: "選択された公告がありません",
      success: "選択した公告をトップに固定しました",
      fail: "公告のトップ固定に失敗しました。後で再試行してください",
    },

    untopSelectedNotices: {
      empty: "選択された公告がありません",
      success: "選択した公告のトップ固定を解除しました",
      fail: "公告のトップ固定解除に失敗しました。後で再試行してください",
    },

    updateNotice: {
      fail: "公告の更新に失敗しました。後で再試行してください",
    }
  },

  addNotice: {
    field: "フィールド",
    input: "入力",
    title: "公告タイトル",
    titlePlaceholder: "公告タイトルを入力してください",
    info: "公告内容",
    infoPlaceholder: "公告内容を入力してください",
    adduser: "ユーザーを追加",
    adddate: "追加日",
    isTop: "トップ固定にするか",
    isTopPlaceholder: "トップ固定にするか選択してください",
    top: "トップに固定",
    normal: "通常",
    submit: "送信",

    submitForm: {
      empty: "公告情報が不完全です",
      success: "公告が追加されました",
      fail: "公告の追加に失敗しました。後で再試行してください",
    }
  },

  adminForum: {
    searchPlaceholder: "コメント名、投稿ユーザーまたは日付を検索",
    add: "コメントを追加",
    showRecentDays: "最近7日間のみ表示",
    enableSelection: "チェックボックスを有効にする",
    selectAll: "すべて選択",
    ban: "禁止",
    unban: "禁止解除",
    delete: "削除",
    title: "コメントタイトル",
    info: "コメント内容",
    adduser: "投稿ユーザー",
    adddate: "投稿日",
    views: "ビュー数",
    likes: "いいね数",
    state: "状態",
    infoTip: "ダブルクリックで編集モードに入ります",
    normal: "通常",
    banned: "禁止",
    defaultBoxMsg: "コメント情報を読み込み中...",
    noMessage: "コメントが見つかりません",
    pageSize: "ページあたりの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最後のページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",

    selectMessages: {
      empty: "コメントの記録が見つかりません",
      fail: "コメント情報の読み込みに失敗しました。後で再試行してください",
    },

    delMessage: {
      fail: "コメントの削除に失敗しました。後で再試行してください",
    },

    deleteSelectedMessages: {
      empty: "選択されたコメントがありません",
      success: "選択したコメントが削除されました",
      fail: "コメントの削除に失敗しました。後で再試行してください",
    },

    banSelectedMessages: {
      empty: "選択されたコメントがありません",
      success: "選択したコメントが禁止されました",
      fail: "コメントの禁止に失敗しました。後で再試行してください",
    },

    unbanSelectedMessages: {
      empty: "選択されたコメントがありません",
      success: "選択したコメントの禁止が解除されました",
      fail: "コメントの禁止解除に失敗しました。後で再試行してください",
    },

    updateMessage: {
      fail: "コメントの更新に失敗しました。後で再試行してください",
    }
  },

  addMessage: {
    field: "フィールド",
    input: "入力",
    title: "コメントタイトル",
    titlePlaceholder: "コメントタイトルを入力してください",
    info: "コメント内容",
    infoPlaceholder: "コメント内容を入力してください",
    adduser: "ユーザーを追加",
    adduserPlaceholder: "追加ユーザーを入力してください",
    adddate: "追加日",
    submit: "送信",

    submitForm: {
      empty: "コメント情報が不完全です",
      success: "コメントが追加されました",
      fail: "コメントの追加に失敗しました。後で再試行してください",
    }
  },

  adminUser: {
    searchPlaceholder: "ユーザー名、登録日または役割を検索",
    add: "ユーザーを追加",
    enableSelection: "チェックボックスを有効にする",
    selectAll: "すべて選択",
    ban: "禁止",
    unban: "禁止解除",
    delete: "削除",
    username: "ユーザー名",
    role: "役割グループ",
    roleTip: "再ログイン後に適用されます",
    email: "メール",
    state: "状態",
    credit: "信用スコア",
    adddate: "登録日",
    superAdmin: "スーパ管理者",
    admin: "管理者",
    user: "ユーザー",
    normal: "通常",
    banned: "禁止",
    denied: "権限不足",
    defaultBoxMsg: "ユーザー情報を読み込み中...",
    noUser: "ユーザーが見つかりません",
    pageSize: "ページあたりの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最後のページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",

    selectUsers: {
      empty: "ユーザー記録が見つかりません",
      fail: "ユーザー情報の読み込みに失敗しました。後で再試行してください",
    },

    delUser: {
      fail: "ユーザーの削除に失敗しました。後で再試行してください",
    },

    deleteSelectedUsers: {
      empty: "選択されたユーザーがありません",
      denied: "権限不足",
      success: "選択したユーザーが削除されました",
      fail: "ユーザーの削除に失敗しました。後で再試行してください",
    },

    banSelectedUsers: {
      empty: "選択されたユーザーがありません",
      denied: "権限不足",
      success: "選択したユーザーが禁止されました",
      fail: "ユーザーの禁止に失敗しました。後で再試行してください",
    },

    unbanSelectedUsers: {
      empty: "選択されたユーザーがありません",
      denied: "権限不足",
      success: "選択したユーザーの禁止が解除されました",
      fail: "ユーザーの禁止解除に失敗しました。後で再試行してください",
    },

    updateUser: {
      fail: "ユーザーの更新に失敗しました。後で再試行してください",
    }
  },

  addUser: {
    field: "フィールド",
    input: "入力",
    username: "ユーザー名",
    usernamePlaceholder: "ユーザー名を入力してください",
    state: "状態",
    normal: "通常",
    banned: "禁止",
    email: "メール",
    emailPlaceholder: "予め設定されたユーザーのメールを入力してください",
    adddate: "登録日",
    submit: "送信",

    submitForm: {
      empty: "ユーザー名とメールは必須です",
      success: "ユーザーが追加されました。初期パスワードは：{password}",
      fail: "ユーザーの追加に失敗しました。後で再試行してください",
    }
  },

  adminLog: {
    searchPlaceholder: "ユーザー名、IP、イベントタイプ、詳細または日付を検索",
    enableLog: "ログ記録を有効にする",
    showRecentDays: "最近7日間のみ表示",
    enableSelection: "チェックボックスを有効にする",
    selectAll: "すべて選択",
    delete: "削除",
    username: "ユーザー名",
    type: "イベントタイプ",
    info: "詳細",
    adddate: "日付",
    defaultBoxMsg: "ログ情報を読み込み中...",
    noLog: "ログが見つかりません",
    pageSize: "ページあたりの表示数",
    firstPage: "最初のページ",
    prevPage: "前のページ",
    nextPage: "次のページ",
    lastPage: "最後のページ",
    pageInfo: "第 {currentPage} ページ / 全 {totalPages} ページ",

    toggleLog: {
      response: "ログ記録が{status}になりました",
      open: "有効",
      close: "無効",
      fail: "ログ記録の有効化に失敗しました。後で再試行してください",
    },

    selectLogs: {
      empty: "ログ記録が見つかりません",
      fail: "ログ情報の読み込みに失敗しました。後で再試行してください",
    },

    delLog: {
      fail: "ログの削除に失敗しました。後で再試行してください",
    },

    deleteSelectedLogs: {
      empty: "選択されたログがありません",
      success: "選択したログが削除されました",
      fail: "ログの削除に失敗しました。後で再試行してください",
    },

    openInfo: {
      message: "詳細を見る：",
    }
  },

  notFound: {
    title: "トップページに戻る",
    info: "404 Not Found",
    message: "お探しのページは見つかりません...",
  }
}