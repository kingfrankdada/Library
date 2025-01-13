export default {
  setting: {
    nightMode: "Night Mode",
    title: "Settings",
    language: "Language",
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
    placeholder: "Enter Infomation",
    btnMsg: "Submit",
  },

  inputTag: {
    placeholder: "Enter Infomation",
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
    borrowDays: "Borrow Days:",
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
    illegalTitle: "ILLEGAL MESSAGE",
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
};