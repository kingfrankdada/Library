export const endpoints = {
  getLocalIP: "/getLocalIP",
  systemInfo: "/systemInfo",
  selectDailyUser: "/selectDailyUser",
  login: "/login",
  reg: "/reg",
  selectUser: "/selectUser",
  selectUserByUsername: (username) => `/selectUser/${username}`,
  updateUser: (id) => `/updateUser/${id}`,
  resetPassword: (id) => `/resetPassword/${id}`,
  delUser: (id) => `/delUser/${id}`,
  selectBook: "/selectBook",
  selectBookByBookname: (bookname) => `/selectBook/${bookname}`,
  updateBook: (id) => `/updateBook/${id}`,
  menuTitles: "/menuTitles",
  addBook: "/addBook",
  uploadImage: "/uploadImage",
  delBook: (id) => `/delBook/${id}`,
  addMenu: "/addMenu",
  selectMenu: "/selectMenu",
  updateMenu: (id) => `/updateMenu/${id}`,
  delMenu: (id) => `/delMenu/${id}`,
  addNotice: "/addNotice",
  selectNotice: "/selectNotice",
  updateNotice: (id) => `/updateNotice/${id}`,
  delNotice: (id) => `/delNotice/${id}`,
  addMessage: "/addMessage",
  selectMessage: "/selectMessage",
  selectMessageByUsername: (username) => `/selectMessage/${username}`,
  selectMessageByBookId: (bookId) => `/selectMessageByBookId/${bookId}`,
  updateMessage: (id) => `/updateMessage/${id}`,
  delMessage: (id) => `/delMessage/${id}`,
  addFavorite: "/addFavorite",
  selectFavorite: (username) => `/selectFavorite/${username}`,
  checkFavorite: "/checkFavorite",
  delFavorite: (username, bookname) => `/delFavorite/${username}/${bookname}`,
  delFavoriteByBookName: (bookname) => `/delFavoriteByBookName/${bookname}`,
  addLog: "/addLog",
  selectLog: "/selectLog",
  selectLogByUsername: (username) => `/selectLog/${username}`,
  updateLog: (id) => `/updateLog/${id}`,
  delLog: (id) => `/delLog/${id}`,
  selectCredit: "/selectCredit",
  addCredit: "/addCredit",
  delCredit: (username) => `/delCredit/${username}`,
  borrow: "/borrow",
  renew: "/renew",
  selectBorrow: "/selectBorrow",
  selectBorrowByUsername: (username) => `/selectBorrow/${username}`,
  updateBorrow: (id) => `/updateBorrow/${id}`,
  delBorrow: (id) => `/delBorrow/${id}`,
  return: "/return",
  isLogActive: "/isLogActive",
};