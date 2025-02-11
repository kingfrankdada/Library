export default {
  setting: {
    nightMode: "Night Mode",
    title: "Settings",
    language: "Language",
  },

  publicLogin: {
    logo: "S.O.L.A.R",
    changeReg: "Don't have an account? Register now",
    loginError: "Username or password error",
    empty: "Username and password required",
  },

  publicReg: {
    logo: "S.O.L.A.R",
    changeLogin: "Already have an account? Login now",

    handleReg: {
      empty: "Username and password required",
      short: "Password length cannot be less than 6",
      notMatch: "Passwords do not match",
      success: "Registration successful, username: {username}",
      fail: "Registration failed: {error}",
    }
  },

  publicLogout: {
    info: "Are you sure you want to log out?",
    confirm: "Confirm",
    cancel: "Cancel",
  },

  headerGuide: {
    title: "S.O.L.A.R",
    home: "Home",
    book: "Book Center",
    forum: "Forum",
    user: "User Center",
    search: "Search Books",
    notice: "Notice",
    setting: "Settings",
    admin: "System Settings",
    login: "Login",
    logout: "Logout",
  },

  publicSearch: {
    placeholder: "Enter book name",
    alertMsg: "Empty content",
  },

  publicNotice: {
    title: "Notice",
    top: "[TOP]",
    empty: "No Notice",
    error: "Error",
  },

  noticeBox: {
    adduser: "Author：",
    adddate: "Date：",
    defaultMsg: {
      title: "Unknown",
      adduser: "Unknown",
      adddate: "Unknown",
      info: "Error",
    },
  },

  messageBox: {
    btnMsg: "Comfirm",
    emptyCopyError: "Copy content is empty",
    copySuccess: "Copied successfully",
    copyFail: "Copy failed",
  },

  alertBox: {
    btnMsg: "Comfirm",
  },

  editTag: {
    title: "Edit Tag",
    placeholder: "Enter",
    btnMsg: "Submit",
  },

  inputTag: {
    placeholder: "Enter",
    empty: "Empty content",
  },

  publicHome: {
    title_1: "Smart Organizational Library Assistant Resource",
    subtitle_1: "A modern online book management platform based on Vue2 and Node.js, aiming to provide a one-stop digital library management solution for universities, driving library management towards a more efficient and modern digital era.",
    btnText_1: "Learn More",

    title_2: "Book Center",
    subtitle_2: "A rich online book library for quick browsing and searching of various book resources. Instant borrowing functionality makes book acquisition easy and efficient. Full-site search supports fuzzy matching, helping precisely locate the books of interest, greatly enhancing the borrowing experience.",
    btnText_2: "Borrow Now",

    title_3: "Forum",
    subtitle_3: "An internal communication platform focused on promoting sharing and discussion of books and learning resources. Participate in discussions on various topics, post and reply to threads, share experiences and insights, and foster academic exchange and intellectual collaboration.",
    btnText_3: "Explore Now",

    title_4: "User Center",
    subtitle_4: "Centralizes personal security settings, credit score management, borrowing records, and favorites functionality, providing comprehensive account information maintenance and optimization. Take control of account privacy and security, view credit scores in real time, understand borrowing history and preferences, and enjoy an intelligent library management experience.",
    btnText_4: "Go Settings",

    title_5: "Project Introduction and Support",
    subtitle_5: "We provide ongoing technical support and maintenance for this project to ensure timely updates and optimizations to meet evolving needs. This project adopts the MIT open-source license, allowing you to provide feedback or seek assistance on GitHub.",
    btnText_5: "View on GitHub",
  },

  userBook: {
    titleInfo: "View Book Details",
    titleInfoDisabled: "Book Unavailable",
    boxMsg: "No data...",
    imgAlt: "Cover",
    num: "Stock:",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",
    btnMsg: "Borrow",
    guideTitle: "All Books",
    bookEmpty: "No books found",
    bookError: "Book information loading failed",
    menuError: "Menu information loading failed",
    searchResult: "Found {resultCount} books",
    searchEmpty: "No books found",
  },

  bookBox: {
    imgAlt: "Cover",
    scoreTitle: "Score:",
    scoreInfo: "{score} / 5 By {numScore} Users",
    scoreNone: "No score",
    author: "Author:",
    menu: "Category:",
    press: "Publisher:",
    price: "Price:",
    info: "Description:",
    num: "Stock:",
    adddate: "Add Date:",
    messageTitle: "Comments",
    messageNone: "No Comments",
    btnMsg: "Borrow",
    noneCredit: "Insufficient credit",
    login: "Please login first",
    favorite: "Favorite",
    cancelFavorite: "Cancel Favorite",
    addFavoriteSuccess: "Favorite added successfull",
    addFavoriteFail: "Favorite add failed",
    cancelFavoriteSuccess: "Favorite canceled successfull",
    cancelFavoriteFail: "Favorite cancel failed",
    messageError: "Message information loading failed",
    userInfoNone: "No user information",
    userInfoError: "User information loading failed",
    borrow: "Borrow",
    view: "View",
  },


  borrowBox: {
    imgAlt: "Cover",
    author: "Author:",
    menu: "Category:",
    press: "Publisher:",
    price: "Price:",
    info: "Description:",
    num: "Stock:",
    adddate: "Add Date:",
    borrowDays: "Borrow Days(Max 30):",
    borrowDaysPlaceholder: "Input days",
    overDate: "Over Date:",
    handleBorrow: "Confirm Borrow",
    handleCancel: "Cancel",
    loginError: "Please login first",
    formError: "Please fill in borrow days and over date",
    emptyError: "Cannot borrow, book stock not enough",
    overDaysError: "Borrow days cannot exceed 30 days",
    borrowSuccess: "Borrow success",
    borrowRepeat: "You have borrowed this book",
    borrowFail: "Borrow failed, please try again later",
  },

  userForum: {
    illegalTitle: "[ILLEGAL MESSAGE]",
    illegalInfo: "[This comment is illegal, it has been blocked]",
    yourself: "You",
    anonymous: "Anonymous",
    title: "Enter your title",
    info: "Enter your message",
    submit: "Submit",
    isAnonymous: "Anonymous",
    borrowMsg: "Borrow Comments",
    loginFirst: "Please login first",
    defaultBoxMsg: "Loading forum messages...",
    emptyBoxMsg: "No forum messages found",
    errorBoxMsg: "Failed to load forum messages",
    updateError: "Failed to update forum messages",
    emptyError: "Forum title or content incomplete",
    addError: "Forum message addition failed",
    delSuccess: "Forum message deleted successfully",
    delError: "Forum message deletion failed",
  },


  userSetting: {
    personalInfo: "Account Information",
    personalInfoTip: "The basic information you provided when you registered, including username, email, and registration date",
    username: "用户名:",
    superAdmin: "[Superior Admin]",
    admin: "[Admin]",
    user: "[User]",
    email: "email:",
    registerDate: "Registration Date:",
    edit: "Edit Account",
    security: "Security Information",
    securityTip: "For the protection of your account security, it is recommended to change the password periodically and manage your account information carefully",
    changePassword: "Change Password",
    delAccount: "Delete Account",
    credit: "Credit Score",
    creditTip: "Your user behavior will affect your credit score, and low credit scores will disable some user functions",
    currentCredit: "Current Credit Score:",
    creditContent: "Credit score is based on user behavior to dynamically adjust and ensure fairness and security in the system",
    goCredit: "View Credit Details",
    guideTitle: "User Center",
    editUser: "Edit Account",
    editPassword: "Change Password",

    guideList: {
      collection: "Collection",
      borrow: "Borrow",
      comment: "Comment",
      credit: "Credit",
    },

    selectUsersByUserName: {
      empty: "Empty user information",
      error: "User information loading failed",
    }
  },


  editUser: {
    title: "Edit Account Information",
    subTitle: "Double-click to edit",
    username: "Username",
    email: "Email",
    tip: "Tips: Double-click to edit, press Enter to submit the form item",
    submit: "Submit",

    selectUsersByUserName: {
      empty: "No user information",
      error: "User information loading failed",
    },

    submitForm: {
      empty: "Username and email cannot be empty",
      success: "User information updated successfully",
      error: "User information update failed, please try again later",
    },
  },

  editPassword: {
    username: "Username",
    oldPassword: "Old Password",
    oldPasswordPlaceholder: "Enter your old password",
    newPassword: "New Password",
    newPasswordPlaceholder: "Enter your new password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Enter your new password again",
    submit: "Reset",

    submitForm: {
      empty: "Username and password required",
      notMatch: "New password and confirmed password do not match",
      short: "Password length must be at least 6 characters",
      error: "Old password verification failed, please try again later",
    }
  },

  delUser: {
    title: "WARNING",
    info: "This operation will log out and clear all your account data",
    confirm: "CONFIRM",
    cancel: "CANCEL",
    error: "Deletion failed, please try again later",
  },


  userCollection: {
    titleInfo: "View Book Details",
    titleDisabled: "Book Unavailable",
    imgAlt: "Cover",
    num: "Stock:",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",
    btnMsg: "View",
    defaultBoxMsg: "Loading favorite books...",

    selectFavorite: {
      empty: "No favorite books found",
      error: "Favorite book information loading failed",
    },

    menuError: "Menu information loading failed",
  },


  userBorrow: {
    searchPlaceholder: "Search book name or date",
    showRecentDays: "Show recent 7 days",
    startDate: "Start Date",
    overDate: "End Data",
    days: "Record Days",
    bookName: "Book",
    returnDate: "Return Date",
    recordDays: "Actual Days",
    creditDelta: "Credit Delta",
    state: "State",
    actions: "Actions",
    borrowing: "Borrowing",
    returned: "Returned",
    overdue: "Overdue",
    return: "Return",
    renew: "Renew",
    pageSize: "Page size",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",
    btnMsg: "View",
    defaultBoxMsg: "Loading borrow records...",

    fetchBorrowBorrows: {
      empty: "No borrow records found",
      error: "Borrow record information loading failed",
    },

    selectUsersByUserName: {
      empty: "No user information",
      error: "User information loading failed",
    },

    handleReturn: {
      login: "Please login first",
      success: "Return success, please evaluate",
      fail: "Return failed, please try again later",
    },

    handleRenew: {
      login: "Please login first",
      credit: "Insufficient credit",
      fail: "Renew failed, please try again later",
    }
  },


  renewBox: {
    imgAlt: "Cover",
    author: "Author:",
    menu: "Category:",
    press: "Publisher:",
    price: "Price:",
    info: "Description:",
    num: "Stock:",
    adddate: "Add Date:",
    renewDays: "Renew Days(Max 7):",
    renewDaysPlaceholder: "Input days:",
    overDate: "End Date:",
    renew: "Renew",
    cancel: "Cancel",

    handleRenew: {
      login: "Please login first",
      formEmpty: "Please fill in renew days and end date",
      bookEmpty: "Stock not enough, cannot renew",
      overDays: "Renew days cannot exceed 7 days",
      success: "Renew success: {bookname}",
      bookRepeat: "You have renewed this book",
      fail: "Renew failed, please try again later",
    }
  },


  returnBox: {
    messagePlaceholder: "Please enter your comments",
    btnMsg: "Submit",

    submitRating: {
      empty: "Please fill in your comments",
      fail: "Rating failed, please try again later",
    },

    addMessage: {
      fail: "Comment failed, please try again later",
    }
  },

  userComment: {
    searchPlaceholder: "Search comment title or content",
    illegalTitle: "[ILLEGAL COMMENT]",
    illegalInfo: "[This comment is illegal, it has been blocked]",
    delBtn: "DEL",
    emptyMsg: "No comment records found",

    selectMessageByUserName: {
      error: "Comment information loading failed",
    },

    delComment: {
      success: "Comment deleted successfully",
      fail: "Comment deletion failed, please try again later",
    }
  },

  userCredit: {
    searchPlaceholder: "Search credit details or date",
    showRecentDays: "Show recent 7 days",
    delete: "Clear all credit records",
    date: "Date",
    creditCount: "Current Credit",
    info: "Details",
    pageSize: "Page size",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",
    defaultBoxMsg: "Loading credit details...",

    selectCredits: {
      empty: "No credit details found",
      error: "Credit details information loading failed",
    },

    deleteAll: {
      success: "Successfully cleared all credit records",
      empty: "No credit details found",
      fail: "Credit details deletion failed, please try again later",
    }
  },


  adminHome: {
    realTimeData: "Real Time Data",
    onlineUsers: "Online Users",
    bookCount: "Stored Books",
    borrowCount: "Borrow Logs",
    logCount: "System Logs",
    cpuData: "CPU Resources",
    cpuType: "Type:",
    cpuSpeed: "Frequency(GHz):",
    memData: "Memory Resources",
    memTotal: "Total:",
    memUsed: "Used:",
    userActivity: "Daily User Activity",
    borrowLog: "Borrow Logs",
    sysLog: "System Logs",

    getDailyUser: {
      empty: "No active users found",
      error: "User activity information loading failed",
    },

    selectBooks: {
      empty: "No book records found",
      error: "Book information loading failed",
    },

    selectLogs: {
      empty: "No log records found",
      error: "Log information loading failed",
    },
  },

  adminLeftGuide: {
    title: "Dashboard",

    menuList: {
      book: "Book",
      menu: "Menu",
      borrow: "Borrow",
      notice: "Notice",
      forum: "Forum",
      user: "User",
      log: "Log",
    }
  },


  adminBook: {
    searchPlaceholder: "Search book title, author, category, publisher",
    addBook: "Add Book",
    showRecentDays: "Show recent 7 days",
    enableSelection: "Enable selection",
    selectAll: "Select all",
    closeSelected: "Close",
    openSelected: "Open",
    name: "Book Name",
    author: "Author",
    menu: "Category",
    press: "Publisher",
    price: "Price",
    num: "Stock",
    cover: "Cover",
    info: "Description",
    state: "State",
    score: "Score",
    adddate: "Add Date",
    delete: "DEL",
    imgAlt: "Cover",
    editTitle: "Double-click to enter edit mode",
    noBook: "No books found",
    open: "Open",
    close: "Close",
    pageSize: "Page size",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",
    defaultBoxMsg: "Loading books...",

    selectMenuTitles: {
      error: "Menu information loading failed",
    },

    selectBooks: {
      empty: "No book records found",
      error: "Book information loading failed",
    },

    delBook: {
      success: "Book deleted successfully",
      fail: "Book deletion failed, please try again later",
    },

    deleteSelectedBooks: {
      success: "Delete selected successfully",
      empty: "No book records selected",
      fail: "Book deletion failed, please try again later",
    },

    openSelectedBooks: {
      success: "Open selected successfully",
      empty: "No book records selected",
      fail: "Book opening failed, please try again later",
    },

    closeSelectedBooks: {
      success: "Close selected successfully",
      empty: "No book records selected",
      fail: "Book closing failed, please try again later",
    },

    updateBook: {
      fail: "Book update failed, please try again later",
    }
  },


  addBook: {
    title: "Title",
    input: "Input",
    name: "Book Name",
    namePlaceholder: "Enter book name",
    author: "Author",
    authorPlaceholder: "Enter author",
    menu: "Category",
    menuPlaceholder: "Select category",
    price: "Price",
    pricePlaceholder: "Enter price",
    press: "Publisher",
    pressPlaceholder: "Enter publisher",
    num: "Stock",
    numPlaceholder: "Enter stock",
    cover: "Cover",
    info: "Details",
    infoPlaceholder: "Enter details",
    state: "State",
    open: "Open",
    close: "Close",
    autoPush: "Auto Push Notice",
    autoPushTip: "Open after book online automatically push notice, can be seen in admin dashboard-notice management",
    adddate: "Add Date",
    submit: "Submit",

    fetchMenuTitles: {
      fail: "Select menu information failed",
    },

    handleImageChange: {
      alert: "Please upload a picture (jpg, png, jpeg, gif, bmp)",
      fail: "Image upload failed, please try again later",
    },

    submitForm: {
      empty: "Book all information required",
      success: "Book added successfully",
      noticeFail: "Notice auto push failed, please try again later",
      fail: "Book addition failed, please try again later",
    }
  },

  adminMenu: {
    searchPlaceholder: "Search menu title",
    addMenu: "Add Menu",
    showRecentDays: "Show recent 7 days",
    enableSelection: "Enable selection",
    selectAll: "Select all",
    delete: "DEL",
    title: "Title",
    pageSize: "Page size",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",
    defaultBoxMsg: "Loading menus...",
    noMenu: "No menus found",

    selectMenus: {
      empty: "No menu records found",
      fail: "Menu information loading failed",
    },

    delMenu: {
      fail: "Menu deletion failed, please try again later",
    },

    deleteSelectedMenus: {
      empty: "No menu records selected",
      success: "Delete selected successfully",
      fail: "Menu deletion failed, please try again later",
    },

    updateMenu: {
      fail: "Menu update failed, please try again later",
    }
  },

  addMenu: {
    title: "Title",
    input: "Input",
    name: "Category Name",
    namePlaceholder: "Enter category name",
    submit: "Submit",

    submitForm: {
      empty: "Category name required",
      success: "Category added successfully",
      fail: "Category addition failed, please try again later",
    }
  },


  adminBorrow: {
    searchPlaceholder: "Search borrow information or username",
    add: "Add Borrow",
    showRecentDays: "Show recent 7 days",
    enableSelection: "Enable selection",
    selectAll: "Select all",
    returnSelected: "Return",
    delete: "DEL",
    user: "User",
    book: "Book",
    startDate: "Start",
    overDate: "End",
    days: "Days",
    returnDate: "Return",
    recordDays: "Actual",
    overtime: "Overdue",
    state: "State",
    credit: "Credit",
    adddate: "Add Date",
    overdue: "Overdue",
    returned: "Returned",
    borrowing: "Borrowing",
    pageSize: "Page size",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",
    defaultBoxMsg: "Loading borrow records...",
    noBorrow: "No borrow records found",

    selectBorrows: {
      empty: "No borrow records found",
      fail: "Borrow record information loading failed",
    },

    delBorrow: {
      fail: "Borrow record deletion failed, please try again later",
    },

    deleteSelectedBorrows: {
      empty: "No borrow records selected",
      success: "Delete selected successfully",
      fail: "Borrow record deletion failed, please try again later",
    },

    updateBorrow: {
      fail: "Borrow record update failed, please try again later",
    },

    returnSelectedBorrows: {
      empty: "No borrow records selected",
      success: "Successfully return selected",
      fail: "Borrow record return failed, please try again later",
    }
  },


  addBorrow: {
    title: "Title",
    input: "Input",
    username: "Borrow User",
    usernamePlaceholder: "Select borrow user",
    book: "Borrow Book",
    bookPlaceholder: "Select borrow book",
    startdate: "Start Date",
    overdate: "End Date",
    days: "Days",
    daysPlaceholder: "Input days",
    adduser: "Add User",
    adddate: "Add Date",
    submit: "Submit",

    selectBooks: {
      empty: "No book records found",
      fail: "Book information loading failed, please try again later",
    },

    selectUsers: {
      fail: "User information loading failed, please try again later",
    },

    submitForm: {
      empty: "Borrow information not complete",
      success: "Borrow added successfully",
      fail: "Borrow addition failed, please try again later",
    }
  },


  adminNotice: {
    searchPlaceholder: "Search notice title, role or register information",
    add: "Add Notice",
    showRecentDays: "Show recent 7 days",
    enableSelection: "Enable selection",
    selectAll: "Select all",
    top: "Top",
    normal: "Normal",
    untop: "UnTop",
    delete: "DEL",
    title: "Title",
    info: "Info",
    isTop: "Is Top",
    infoTip: "Double-click to enter edit mode",
    defaultBoxMsg: "Loading notices...",
    noNotice: "No notices found",
    pageSize: "Page size",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",

    selectNotices: {
      empty: "No notice records found",
      fail: "Notice information loading failed, please try again later",
    },

    delNotice: {
      fail: "Notice deletion failed, please try again later",
    },

    deleteSelectedNotices: {
      empty: "No notice records selected",
      success: "Delete selected successfully",
      fail: "Notice deletion failed, please try again later",
    },

    topSelectedNotices: {
      empty: "No notice records selected",
      success: "Top selected successfully",
      fail: "Notice top failed, please try again later",
    },

    untopSelectedNotices: {
      empty: "No notice records selected",
      success: "UnTop selected successfully",
      fail: "Notice untop failed, please try again later",
    },

    updateNotice: {
      fail: "Notice update failed, please try again later",
    }
  },


  addNotice: {
    field: "Title",
    input: "Input",
    title: "Notice Title",
    titlePlaceholder: "Please enter notice title",
    info: "Notice Content",
    infoPlaceholder: "Please enter notice content",
    adduser: "Add User",
    adddate: "Add Date",
    isTop: "Is Top",
    isTopPlaceholder: "Please select is top",
    top: "Top",
    normal: "Normal",
    submit: "Submit",

    submitForm: {
      empty: "Notice information not complete",
      success: "Add notice successfully",
      fail: "Notice addition failed, please try again later",
    }
  },


  adminForum: {
    searchPlaceholder: "Search by message title, author, or date",
    add: "Add Message",
    showRecentDays: "Show only the last seven days",
    enableSelection: "Enable selection",
    selectAll: "Select All",
    ban: "Ban",
    unban: "Unban",
    delete: "Delete",
    title: "Message Title",
    info: "Message Content",
    adduser: "Author",
    adddate: "Add Date",
    views: "Views",
    likes: "Likes",
    state: "Status",
    infoTip: "Double-click to enter edit mode",
    normal: "Normal",
    banned: "Banned",
    defaultBoxMsg: "Loading message information...",
    noMessage: "No messages found",
    pageSize: "Items per page",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",

    selectMessages: {
      empty: "No message records found",
      fail: "Failed to load message information, please try again later",
    },

    delMessage: {
      fail: "Failed to delete message, please try again later",
    },

    deleteSelectedMessages: {
      empty: "No message records selected",
      success: "Delete selected successfully",
      fail: "Failed to delete messages, please try again later",
    },

    banSelectedMessages: {
      empty: "No message records selected",
      success: "Ban selected successfully",
      fail: "Failed to ban messages, please try again later",
    },

    unbanSelectedMessages: {
      empty: "No message records selected",
      success: "Unban selected successfully",
      fail: "Failed to unban messages, please try again later",
    },

    updateMessage: {
      fail: "Failed to update message, please try again later",
    },
  },

  addMessage: {
    field: "Title",
    input: "Input",
    title: "Message Title",
    titlePlaceholder: "Please enter the message title",
    info: "Message Content",
    infoPlaceholder: "Please enter the message content",
    adduser: "Author",
    adduserPlaceholder: "Please enter the author",
    adddate: "Add Date",
    submit: "Submit",

    submitForm: {
      empty: "Message information is incomplete",
      success: "Message added successfully",
      fail: "Failed to add message, please try again later",
    }
  },

  adminUser: {
    searchPlaceholder: "Search username, registration date, or role",
    add: "Add User",
    enableSelection: "Enable selection",
    selectAll: "Select All",
    ban: "Ban",
    unban: "Unban",
    delete: "Delete",
    username: "Username",
    role: "Role",
    roleTip: "This will take effect after re-login",
    email: "Email",
    state: "Status",
    credit: "Credit Score",
    adddate: "Registration Date",
    superAdmin: "Super Administrator",
    admin: "Administrator",
    user: "User",
    normal: "Normal",
    banned: "Banned",
    denied: "Permission Denied",
    defaultBoxMsg: "Loading user information...",
    noUser: "No users found",
    pageSize: "Items per page",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",

    selectUsers: {
      empty: "No user records found",
      fail: "Failed to load user information, please try again later",
    },

    delUser: {
      fail: "Failed to delete user, please try again later",
    },

    deleteSelectedUsers: {
      empty: "No user records selected",
      denied: "Permission denied",
      success: "Selected users deleted successfully",
      fail: "Failed to delete users, please try again later",
    },

    banSelectedUsers: {
      empty: "No user records selected",
      denied: "Permission denied",
      success: "Selected users banned successfully",
      fail: "Failed to ban users, please try again later",
    },

    unbanSelectedUsers: {
      empty: "No user records selected",
      denied: "Permission denied",
      success: "Selected users unbanned successfully",
      fail: "Failed to unban users, please try again later",
    },

    updateUser: {
      fail: "Failed to update user, please try again later",
    }
  },

  addUser: {
    field: "Title",
    input: "Input",
    username: "Username",
    usernamePlaceholder: "Please enter username",
    state: "Status",
    normal: "Normal",
    banned: "Banned",
    email: "Email",
    emailPlaceholder: "Enter preset user email",
    adddate: "Registration Date",
    submit: "Submit",

    submitForm: {
      empty: "Username and email cannot be empty",
      success: "User added successfully, initial password：{password}",
      fail: "Failed to add user, please try again later",
    }
  },

  adminLog: {
    searchPlaceholder: "Search by username, IP, event type, details, or date",
    enableLog: "Enable log recording",
    showRecentDays: "Show recent 7 days",
    enableSelection: "Enable checkboxes",
    selectAll: "Select All",
    delete: "Delete",
    username: "Username",
    type: "Event Type",
    info: "Details",
    adddate: "Date",
    defaultBoxMsg: "Loading log information...",
    noLog: "No logs found",
    pageSize: "Page size",
    firstPage: "Home",
    prevPage: "Pre",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {currentPage} of {totalPages}",

    toggleLog: {
      response: "Log recording has been {status}",
      open: "Enable",
      close: "Disable",
      fail: "Failed to enable log recording, please try again later",
    },

    selectLogs: {
      empty: "No log records found",
      fail: "Failed to load log information, please try again later",
    },

    delLog: {
      fail: "Failed to delete log, please try again later",
    },

    deleteSelectedLogs: {
      empty: "No log records selected",
      success: "Successfully deleted selected logs",
      fail: "Failed to delete logs, please try again later",
    },

    openInfo: {
      message: "View details：",
    }
  },

  notFound: {
    title: "Back to Home",
    info: "404 Not Found",
    message: "The page you are looking for cannot be found...",
  }
};