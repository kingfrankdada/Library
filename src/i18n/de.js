export default {
  setting: {
    nightMode: "Nachtmodus",
    title: "Einstellungen",
    language: "Sprache",
  },

  publicLogin: {
    logo: "S.O.L.A.R",
    changeReg: "Haben Sie kein Konto? Jetzt registrieren",
    loginError: "Benutzername oder Passwort falsch",
  },

  publicReg: {
    logo: "S.O.L.A.R",
    changeLogin: "Haben Sie bereits ein Konto? Jetzt anmelden",

    handleReg: {
      empty: "Benutzername und Passwort erforderlich",
      short: "Passwort darf nicht kürzer als 6 Zeichen sein",
      notMatch: "Passwörter stimmen nicht überein",
      success: "Registrierung erfolgreich, Benutzername: {username}",
      fail: "Registrierung fehlgeschlagen: {error}",
    }
  },

  publicLogout: {
    info: "Sind Sie sicher, dass Sie sich abmelden möchten?",
    confirm: "Bestätigen",
    cancel: "Abbrechen",
  },

  headerGuide: {
    title: "S.O.L.A.R",
    home: "Startseite",
    book: "Buchzentrum",
    forum: "Forum",
    user: "Benutzerzentrum",
    search: "Bücher suchen",
    notice: "Benachrichtigung",
    setting: "Einstellungen",
    admin: "Systemeinstellungen",
    login: "Anmelden",
    logout: "Abmelden",
  },

  publicSearch: {
    placeholder: "Buchname eingeben",
    alertMsg: "Inhalt darf nicht leer sein",
  },

  publicNotice: {
    title: "Benachrichtigung",
    top: "[OBEN]",
    empty: "Keine Benachrichtigung",
    error: "Fehler",
  },

  noticeBox: {
    adduser: "Autor: ",
    adddate: "Datum: ",
    defaultMsg: {
      title: "Unbekannt",
      adduser: "Unbekannt",
      adddate: "Unbekannt",
      info: "Fehler",
    },
  },

  messageBox: {
    btnMsg: "Bestätigen",
    emptyCopyError: "Zu kopierender Inhalt ist leer",
    copySuccess: "Erfolgreich kopiert",
    copyFail: "Kopieren fehlgeschlagen",
  },

  alertBox: {
    btnMsg: "Bestätigen",
  },

  editTag: {
    title: "Tag bearbeiten",
    placeholder: "Eingeben",
    btnMsg: "Absenden",
  },

  inputTag: {
    placeholder: "Eingeben",
    empty: "Inhalt darf nicht leer sein",
  },

  publicHome: {
    title_1: "Smart Organizational Library Assistant Resource",
    subtitle_1: "Eine moderne Online-Buchverwaltungsplattform basierend auf Vue2 und Node.js, die darauf abzielt, eine digitale One-Stop-Bibliotheksverwaltungslösung für Universitäten bereitzustellen und die Bibliotheksverwaltung in eine effizientere und modernere digitale Ära zu führen.",
    btnText_1: "Mehr erfahren",

    title_2: "Buchzentrum",
    subtitle_2: "Eine umfangreiche Online-Bibliothek für schnelles Browsen und Suchen verschiedener Buchressourcen. Die Sofort-Ausleihfunktion macht den Erwerb von Büchern einfach und effizient. Die gesamte Website-Suche unterstützt unscharfe Übereinstimmungen, um Bücher von Interesse präzise zu lokalisieren und das Ausleiherlebnis erheblich zu verbessern.",
    btnText_2: "Jetzt ausleihen",

    title_3: "Forum",
    subtitle_3: "Eine interne Kommunikationsplattform, die darauf abzielt, den Austausch und die Diskussion von Büchern und Lernressourcen zu fördern. Nehmen Sie an Diskussionen zu verschiedenen Themen teil, veröffentlichen und antworten Sie auf Beiträge, teilen Sie Erfahrungen und Einsichten und fördern Sie den akademischen Austausch und die intellektuelle Zusammenarbeit.",
    btnText_3: "Jetzt erkunden",

    title_4: "Benutzerzentrum",
    subtitle_4: "Zentralisiert persönliche Sicherheitseinstellungen, Kreditpunktverwaltung, Ausleihhistorie und Favoritenfunktionen, um eine umfassende Wartung und Optimierung der Kontoinformationen zu bieten. Übernehmen Sie die Kontrolle über die Kontoprivatsphäre und Sicherheit, sehen Sie Ihre Kreditpunkte in Echtzeit, verstehen Sie Ihre Ausleihhistorie und -präferenzen und genießen Sie ein intelligentes Bibliotheksmanagement-Erlebnis.",
    btnText_4: "Zu den Einstellungen",

    title_5: "Projektvorstellung Und Unterstützung",
    subtitle_5: "Wir bieten kontinuierliche technische Unterstützung und Wartung für dieses Projekt, um rechtzeitige Updates und Optimierungen sicherzustellen, die sich an die sich entwickelnden Bedürfnisse anpassen. Dieses Projekt verwendet die MIT Open-Source-Lizenz, die es Ihnen ermöglicht, Feedback zu geben oder Unterstützung auf GitHub zu suchen.",
    btnText_5: "Auf GitHub ansehen",
  },

  userBook: {
    titleInfo: "Buchdetails anzeigen",
    titleInfoDisabled: "Buch wurde aus dem Sortiment genommen",
    boxMsg: "Keine Daten verfügbar...",
    imgAlt: "Cover",
    num: "Verfügbare Menge:",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} von {totalPages}",
    btnMsg: "Ausleihen",
    guideTitle: "Alle Bücher",
    bookEmpty: "Keine Buchinformationen gefunden",
    bookError: "Fehler beim Laden der Buchinformationen, bitte versuchen Sie es später erneut",
    menuError: "Fehler beim Laden der Kategorien, bitte versuchen Sie es später erneut",
    searchResult: "Wir haben {resultCount} Bücher gefunden, die den Suchkriterien entsprechen",
    searchEmpty: "Keine Bücher gefunden, die den Suchkriterien entsprechen",
  },

  bookBox: {
    imgAlt: "Cover",
    scoreTitle: "Bewertung:",
    scoreInfo: "{score} / 5 basierend auf {numScore} Bewertungen",
    scoreNone: "Keine Bewertungen verfügbar",
    author: "Autor:",
    menu: "Kategorie:",
    press: "Verlag:",
    price: "Preis:",
    info: "Weitere Informationen:",
    num: "Verfügbare Menge:",
    adddate: "Zugangsdaten:",
    messageTitle: "Leserkommentare",
    messageNone: "Keine Kommentare vorhanden",
    btnMsg: "Ausleihen",
    noneCredit: "Unzureichendes Nutzer-Rating, Aktion fehlgeschlagen",
    login: "Bitte loggen Sie sich ein, um fortzufahren",
    favorite: "Favorisieren",
    cancelFavorite: "Favorit entfernen",
    addFavoriteSuccess: "Erfolgreich favorisiert, bitte gehen Sie zum Benutzerzentrum - Meine Favoriten",
    addFavoriteFail: "Fehler beim Hinzufügen zu Favoriten",
    cancelFavoriteSuccess: "Erfolgreich aus den Favoriten entfernt",
    cancelFavoriteFail: "Fehler beim Entfernen aus den Favoriten",
    messageError: "Fehler beim Laden der Kommentare, bitte versuchen Sie es später erneut",
    userInfoNone: "Keine Benutzerinformationen gefunden",
    userInfoError: "Fehler beim Laden der Benutzerinformationen, bitte versuchen Sie es später erneut",
    borrow: "Ausleihen",
    view: "Im Bücherzentrum anzeigen",
  },

  borrowBox: {
    imgAlt: "Cover",
    author: "Autor:",
    menu: "Kategorie:",
    press: "Verlag:",
    price: "Preis:",
    info: "Weitere Informationen:",
    num: "Verfügbare Menge:",
    adddate: "Zugangsdaten:",
    borrowDays: "Voraussichtliche Ausleihdauer (max. 30 Tage):",
    borrowDaysPlaceholder: "Geben Sie die Anzahl der Tage ein",
    overDate: "Voraussichtliches Rückgabedatum:",
    handleBorrow: "Ausleihe bestätigen",
    handleCancel: "Abbrechen",
    loginError: "Bitte melden Sie sich an",
    formError: "Bitte geben Sie die voraussichtliche Ausleihdauer und das Rückgabedatum ein",
    emptyError: "Ausleihe nicht möglich, nicht genug Bücher auf Lager",
    overDaysError: "Die Ausleihdauer darf 30 Tage nicht überschreiten",
    borrowSuccess: "Ausleihe erfolgreich, bitte gehen Sie zum Benutzerzentrum - Meine Ausleihen",
    borrowRepeat: "Sie haben dieses Buch bereits ausgeliehen",
    borrowFail: "Fehler bei der Ausleihe, bitte versuchen Sie es später erneut",
  },

  userForum: {
    illegalTitle: "Verstoßkommentar",
    illegalInfo: "[Dieser Kommentar verstößt gegen die Regeln und wurde gesperrt]",
    yourself: "Du",
    anonymous: "Anonymer Benutzer",
    title: "Gib den Titel deines Kommentars ein",
    info: "Gib den Inhalt deines Kommentars ein",
    submit: "Veröffentlichen",
    isAnonymous: "Anonym veröffentlichen",
    borrowMsg: "Zeige Ausleihkommentare",
    loginFirst: "Bitte melde dich zuerst an, um einen Kommentar zu hinterlassen",
    defaultBoxMsg: "Forum-Kommentare werden geladen...",
    emptyBoxMsg: "Keine Forum-Kommentare gefunden",
    errorBoxMsg: "Fehler beim Laden der Forum-Kommentare",
    updateError: "Fehler beim Aktualisieren der Forum-Kommentardaten",
    emptyError: "Forum-Titel oder -Inhalt unvollständig",
    addError: "Fehler beim Hinzufügen des Forum-Kommentars",
    delSuccess: "Forum-Kommentar erfolgreich gelöscht",
    delError: "Fehler beim Löschen des Forum-Kommentars",
  },

  userSetting: {
    personalInfo: "Kontoinformationen",
    personalInfoTip: "Die grundlegenden Informationen, die Sie bei der Registrierung angegeben haben, einschließlich Benutzername, E-Mail, Registrierungsdatum usw.",
    username: "Benutzername:",
    superAdmin: "[Super Administrator]",
    admin: "[Administrator]",
    user: "[Benutzer]",
    email: "E-Mail:",
    registerDate: "Registrierungsdatum:",
    edit: "Kontoinformationen bearbeiten",
    security: "Kontosicherheitsinformationen",
    securityTip: "Um die Sicherheit Ihres Kontos zu schützen, wird empfohlen, regelmäßig das Passwort zu ändern und Ihre Kontoinformationen sorgfältig zu verwalten",
    changePassword: "Passwort ändern",
    delAccount: "Konto löschen",
    credit: "Kontorating",
    creditTip: "Ihr Verhalten als Benutzer beeinflusst Ihr Kontorating. Ein zu niedriger Rating führt dazu, dass bestimmte Funktionen des Systems deaktiviert werden.",
    currentCredit: "Aktuelles Rating:",
    creditContent: "Im System soll das Ratingsystem Benutzer dazu anregen, die Regeln zu befolgen und eine gute Nutzungserfahrung zu gewährleisten. Das Rating des Benutzers wird basierend auf seinem Verhalten dynamisch angepasst, um die Fairness und Sicherheit des Systems zu gewährleisten.",
    goCredit: "Details zum Rating ansehen",
    guideTitle: "Benutzerzentrum",
    editUser: "Kontoinformationen bearbeiten",
    editPassword: "Passwort ändern",

    guideList: {
      collection: "Meine Favoriten",
      borrow: "Meine Ausleihen",
      comment: "Meine Kommentare",
      credit: "Mein Rating",
    },

    selectUsersByUserName: {
      empty: "Keine Benutzerinformationen gefunden",
      error: "Fehler beim Laden der Benutzerinformationen, bitte versuchen Sie es später erneut",
    }
  },

  editUser: {
    title: "Persönliche Informationen bearbeiten",
    subTitle: "Doppelklicken Sie auf ein Formularfeld, um es zu bearbeiten",
    username: "Benutzername",
    email: "E-Mail",
    tip: "Tipp: Doppelklicken Sie auf ein Formularfeld, um es zu bearbeiten, drücken Sie die Eingabetaste, um das Feld zu senden",
    submit: "Absenden",

    selectUsersByUserName: {
      empty: "Keine Benutzerinformationen gefunden",
      error: "Fehler beim Laden der Benutzerinformationen, bitte versuchen Sie es später erneut",
    },

    submitForm: {
      empty: "Benutzername und E-Mail dürfen nicht leer sein",
      success: "Benutzerdaten erfolgreich aktualisiert",
      error: "Datenaktualisierung fehlgeschlagen, bitte versuchen Sie es später erneut",
    },
  },

  editPassword: {
    username: "Benutzername",
    oldPassword: "Altes Passwort",
    oldPasswordPlaceholder: "Geben Sie Ihr altes Passwort ein",
    newPassword: "Neues Passwort",
    newPasswordPlaceholder: "Geben Sie Ihr neues Passwort ein",
    confirmPassword: "Passwort bestätigen",
    confirmPasswordPlaceholder: "Geben Sie Ihr neues Passwort erneut ein",
    submit: "Zurücksetzen",

    submitForm: {
      empty: "Bitte füllen Sie alle Felder aus",
      notMatch: "Die Passwörter stimmen nicht überein",
      short: "Das Passwort muss mindestens 6 Zeichen lang sein",
      error: "Das alte Passwort ist falsch, bitte versuchen Sie es erneut",
    }
  },

  delUser: {
    title: "Warnung",
    info: "Diese Aktion wird Sie abmelden und alle Ihre Benutzerdaten löschen",
    confirm: "Bestätigen",
    cancel: "Abbrechen",
    error: "Fehler beim Löschen des Kontos, bitte versuchen Sie es später erneut",
  },
  userCollection: {
    titleInfo: "Details des Buches anzeigen",
    titleDisabled: "Das Buch wurde aus dem Verkauf genommen",
    imgAlt: "Umschlag",
    num: "Lagerbestand:",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} von {totalPages}",
    btnMsg: "Im Buchzentrum anzeigen",
    defaultBoxMsg: "Lade Lieblingsbücher...",

    selectFavorite: {
      empty: "Keine Buchaufzeichnungen gefunden",
      error: "Fehler beim Laden der Buchinformationen. Bitte versuchen Sie es später erneut.",
    },

    menuError: "Fehler beim Laden der Kategorieninformationen. Bitte versuchen Sie es später erneut.",
  },

  userBorrow: {
    searchPlaceholder: "Suchen Sie nach dem Namen des ausgeliehenen Buches oder dem Ausleihdatum",
    showRecentDays: "Nur die letzten sieben Tage anzeigen",
    startDate: "Ausleihdatum",
    overDate: "Voraussichtliches Rückgabedatum",
    days: "Voraussichtliche Ausleihtage",
    bookname: "Buchtitel",
    returnDate: "Tatsächliches Rückgabedatum",
    recordDays: "Tatsächliche Ausleihtage",
    creditDelta: "Änderung der Kreditpunkte",
    state: "Status",
    actions: "Aktionen",
    borrowing: "Ausgeliehen",
    returned: "Zurückgegeben",
    overdue: "Überfällig",
    return: "Rück",
    renew: "Ver",
    pageSize: "Pro Seite anzeigen",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} von {totalPages}",
    btnMsg: "Im Buchzentrum anzeigen",
    defaultBoxMsg: "Lade Ausleihdatensätze...",

    fetchBorrowBorrows: {
      empty: "Keine Ausleihdatensätze gefunden",
      error: "Fehler beim Laden der Ausleihdatensätze. Bitte versuchen Sie es später erneut.",
    },

    selectUsersByUserName: {
      empty: "Keine Benutzerinformationen gefunden",
      error: "Fehler beim Laden der Benutzerinformationen. Bitte versuchen Sie es später erneut.",
    },

    handleReturn: {
      login: "Bitte zuerst einloggen",
      success: "Erfolgreich zurückgegeben, bitte bewerten Sie diese Ausleihe",
      fail: "Fehler bei der Rückgabe. Bitte versuchen Sie es später erneut.",
    },

    handleRenew: {
      login: "Bitte zuerst einloggen",
      credit: "Zu wenig Kreditpunkte, Verlängerung nicht möglich",
      fail: "Fehler bei der Verlängerung. Bitte versuchen Sie es später erneut.",
    }
  },

  renewBox: {
    imgAlt: "Umschlag",
    author: "Autor:",
    menu: "Kategorie:",
    press: "Verlag:",
    price: "Preis:",
    info: "Weitere Informationen:",
    num: "Lagerbestand:",
    adddate: "Einlagerungsdatum:",
    renewDays: "Voraussichtliche Verlängerungstage (maximal 7 Tage):",
    renewDaysPlaceholder: "Tage eingeben:",
    overDate: "Voraussichtliches Rückgabedatum:",
    renew: "Verlängerung bestätigen",
    cancel: "Abbrechen",

    handleRenew: {
      login: "Bitte zuerst einloggen",
      formEmpty: "Bitte geben Sie die voraussichtlichen Verlängerungstage und das Rückgabedatum ein",
      bookEmpty: "Nicht genügend Lagerbestand, Verlängerung nicht möglich",
      overDays: "Die Verlängerungstage dürfen 7 Tage nicht überschreiten",
      success: "Verlängerung erfolgreich: {bookname}",
      bookRepeat: "Sie haben dieses Buch bereits verlängert",
      fail: "Fehler bei der Verlängerung. Bitte versuchen Sie es später erneut.",
    }
  },

  returnBox: {
    messagePlaceholder: "Bitte geben Sie Ihre Nachricht zu dieser Ausleihe ein",
    btnMsg: "Bestätigen",

    submitRating: {
      empty: "Buchinformationen oder Bewertung unvollständig",
      fail: "Fehler beim Einreichen der Bewertung. Bitte versuchen Sie es später erneut.",
    },

    addMessage: {
      fail: "Fehler beim Hinzufügen der Forumsnachricht. Bitte versuchen Sie es später erneut.",
    }
  },

  userComment: {
    searchPlaceholder: "Suche nach Titel oder Inhalt der Nachricht",
    illegalTitle: "[Verbotene Äußerungen]",
    illegalInfo: "[Diese Nachricht verstößt gegen die Regeln und wurde blockiert]",
    delBtn: "Löschen",
    emptyMsg: "Keine Nachrichten gefunden",

    selectMessageByUserName: {
      error: "Nachrichteninformationen konnten nicht geladen werden. Bitte versuche es später erneut",
    },

    delComment: {
      success: "Nachricht erfolgreich gelöscht",
      fail: "Nachricht konnte nicht gelöscht werden. Bitte versuche es später erneut",
    }
  },

  userCredit: {
    searchPlaceholder: "Suche nach Details oder Datum der Kreditpunkte",
    showRecentDays: "Nur die letzten sieben Tage anzeigen",
    delete: "Kreditpunkte löschen",
    date: "Datum",
    creditCount: "Aktuelle Kreditpunkte",
    info: "Details",
    pageSize: "Pro Seite anzeigen",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} / von {totalPages} Seiten",
    defaultBoxMsg: "Lade Kreditpunkte-Daten...",

    selectCredits: {
      empty: "Keine Kreditpunkte gefunden",
      error: "Fehler beim Laden der Kreditpunkte-Daten. Bitte versuche es später erneut",
    },

    deleteAll: {
      success: "Kreditpunkte-Daten erfolgreich gelöscht",
      empty: "Keine Kreditpunkte gefunden",
      fail: "Fehler beim Löschen der Kreditpunkte-Daten. Bitte versuche es später erneut",
    }
  },

  adminHome: {
    realTimeData: "Echtzeitdaten",
    onlineUsers: "Online-Nutzer",
    bookCount: "Bücher im System",
    borrowCount: "Ausleihvorgänge",
    logCount: "Log-Einträge",
    cpuData: "CPU-Ressourcen",
    cpuType: "CPU-Modell:",
    cpuSpeed: "CPU-Frequenz (GHz):",
    memData: "Speicherressourcen",
    memTotal: "Gesamtspeicher:",
    memUsed: "Verwendeter Speicher:",
    userActivity: "Nutzeraktivität",
    borrowLog: "Ausleihprotokolle",
    sysLog: "Systemprotokolle",

    getDailyUser: {
      empty: "Keine Aktivitätsdaten gefunden",
      error: "Aktivitätsdaten konnten nicht geladen werden. Bitte versuche es später erneut",
    },

    selectBooks: {
      empty: "Keine Bücher gefunden",
      error: "Buchinformationen konnten nicht geladen werden. Bitte versuche es später erneut",
    },

    selectLogs: {
      empty: "Keine Log-Einträge gefunden",
      error: "Log-Daten konnten nicht geladen werden. Bitte versuche es später erneut",
    },
  },

  adminLeftGuide: {
    title: "Dashboard",

    menuList: {
      book: "Buchverwaltung",
      menu: "Kategorieverwaltung",
      borrow: "Ausleihverwaltung",
      notice: "Notizverwaltung",
      forum: "Forumverwaltung",
      user: "Benutzerverwaltung",
      log: "Log-Verwaltung",
    }
  },

  adminBook: {
    searchPlaceholder: "Suche nach Buchtitel, Autor, Kategorie, Verlag",
    addBook: "Buch hinzufügen",
    showRecentDays: "Nur die letzten sieben Tage anzeigen",
    enableSelection: "Auswahlkästchen aktivieren",
    selectAll: "Alle auswählen",
    closeSelected: "Schließen",
    openSelected: "Öffnen",
    deleteSelected: "Löschen",
    name: "Buchtitel",
    author: "Autor",
    menu: "Kategorie",
    press: "Verlag",
    price: "Preis",
    num: "Bestand",
    cover: "Cover",
    info: "Details",
    state: "Status",
    score: "Bewertung",
    adddate: "Einfügedatum",
    delete: "Löschen",
    imgAlt: "Cover",
    editTitle: "Doppelklicken, um den Bearbeitungsmodus zu betreten",
    noBook: "Keine Bücher gefunden",
    open: "Aktiv",
    close: "Deaktiviert",
    pageSize: "Pro Seite anzeigen",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} / von {totalPages} Seiten",
    defaultBoxMsg: "Buchinformationen werden geladen...",

    selectMenuTitles: {
      error: "Fehler beim Laden der Kategoriedaten. Bitte versuche es später erneut",
    },

    selectBooks: {
      empty: "Keine Bücher gefunden",
      error: "Buchinformationen konnten nicht geladen werden. Bitte versuche es später erneut",
    },

    delBook: {
      success: "Buch erfolgreich gelöscht",
      fail: "Buch konnte nicht gelöscht werden. Bitte versuche es später erneut",
    },

    deleteSelectedBooks: {
      success: "Ausgewählte Bücher erfolgreich gelöscht",
      empty: "Keine Bücher ausgewählt",
      fail: "Fehler beim Löschen der Bücher. Bitte versuche es später erneut",
    },

    openSelectedBooks: {
      success: "Ausgewählte Bücher erfolgreich geöffnet",
      empty: "Keine Bücher ausgewählt",
      fail: "Fehler beim Öffnen der Bücher. Bitte versuche es später erneut",
    },

    closeSelectedBooks: {
      success: "Ausgewählte Bücher erfolgreich geschlossen",
      empty: "Keine Bücher ausgewählt",
      fail: "Fehler beim Schließen der Bücher. Bitte versuche es später erneut",
    },

    updateBook: {
      fail: "Buchaktualisierung fehlgeschlagen. Bitte versuche es später erneut",
    }
  },

  addBook: {
    title: "Felder",
    input: "Eingabe",
    name: "Buchtitel",
    namePlaceholder: "Buchtitel eingeben",
    author: "Autor",
    authorPlaceholder: "Autor eingeben",
    menu: "Kategorie",
    menuPlaceholder: "Kategorie auswählen",
    price: "Preis",
    pricePlaceholder: "Preis eingeben",
    press: "Verlag",
    pressPlaceholder: "Verlag eingeben",
    num: "Bestand",
    numPlaceholder: "Bestand eingeben",
    cover: "Cover",
    info: "Details",
    infoPlaceholder: "Details eingeben",
    state: "Status",
    open: "Aktiv",
    close: "Deaktiviert",
    autoPush: "Automatische Benachrichtigungen senden",
    autoPushTip: "Wird aktiviert, um beim Veröffentlichen von Büchern automatisch Benachrichtigungen zu senden. Diese können im Dashboard unter Benachrichtigungsmanagement eingesehen werden.",
    adddate: "Hinzufügedatum",
    submit: "Absenden",

    fetchMenuTitles: {
      fail: "Fehler beim Laden der Kategoriedaten. Bitte versuche es später erneut",
    },

    handleImageChange: {
      alert: "Bitte lade eine Bilddatei (jpg, jpeg, png, gif) hoch",
      fail: "Fehler beim Hochladen. Bitte versuche es später erneut",
    },

    submitForm: {
      empty: "Buchinformationen unvollständig",
      success: "Buch erfolgreich hinzugefügt",
      noticeFail: "Benachrichtigung konnte nicht gesendet werden. Bitte versuche es später erneut",
      fail: "Fehler beim Hinzufügen des Buches. Bitte versuche es später erneut",
    }
  },

  adminMenu: {
    searchPlaceholder: "Suche nach Kategoriebezeichnung",
    addMenu: "Kategorie hinzufügen",
    showRecentDays: "Nur die letzten sieben Tage anzeigen",
    enableSelection: "Auswahlkästchen aktivieren",
    selectAll: "Alle auswählen",
    delete: "Löschen",
    title: "Kategoriename",
    pageSize: "Pro Seite anzeigen",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} / von {totalPages} Seiten",
    defaultBoxMsg: "Kategoriedaten werden geladen...",
    noMenu: "Keine Kategorien gefunden",

    selectMenus: {
      empty: "Keine Kategorien gefunden",
      fail: "Fehler beim Laden der Kategoriedaten. Bitte versuche es später erneut",
    },

    delMenu: {
      fail: "Fehler beim Löschen der Kategorie. Bitte versuche es später erneut",
    },

    deleteSelectedMenus: {
      empty: "Keine Kategorien ausgewählt",
      success: "Ausgewählte Kategorien erfolgreich gelöscht",
      fail: "Fehler beim Löschen der Kategorien. Bitte versuche es später erneut",
    },

    updateMenu: {
      fail: "Fehler beim Aktualisieren der Kategorie. Bitte versuche es später erneut",
    }
  },

  addMenu: {
    title: "Felder",
    input: "Eingabe",
    name: "Kategoriename",
    namePlaceholder: "Kategoriename eingeben",
    submit: "Absenden",

    submitForm: {
      empty: "Kategoriedaten unvollständig",
      success: "Kategorie erfolgreich hinzugefügt",
      fail: "Fehler beim Hinzufügen der Kategorie. Bitte versuche es später erneut",
    }
  },

  adminBorrow: {
    searchPlaceholder: "Suche nach Ausleihinformationen oder Benutzernamen",
    add: "Ausleihe hinzufügen",
    showRecentDays: "Nur die letzten sieben Tage anzeigen",
    enableSelection: "Auswahlkästchen aktivieren",
    selectAll: "Alle auswählen",
    returnSelected: "Zurückgeben",
    delete: "Löschen",
    user: "Benutzername",
    book: "Buchtitel",
    startDate: "Ausleihdatum",
    overDate: "Voraussichtliches Rückgabedatum",
    days: "Voraussichtliche Leihdauer",
    returnDate: "Tatsächliches Rückgabedatum",
    recordDays: "Tatsächliche Leihdauer",
    overtime: "Überfällige Tage",
    state: "Ausleihstatus",
    credit: "Kreditpunkte",
    adddate: "Hinzufügedatum",
    overdue: "Überfällig",
    returned: "Zurückgegeben",
    borrowing: "Ausgeliehen",
    pageSize: "Pro Seite anzeigen",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} / von {totalPages} Seiten",
    defaultBoxMsg: "Ausleihdaten werden geladen...",
    noBorrow: "Keine Ausleihen gefunden",

    selectBorrows: {
      empty: "Keine Ausleihen gefunden",
      fail: "Fehler beim Laden der Ausleihdaten. Bitte versuche es später erneut",
    },

    delBorrow: {
      fail: "Fehler beim Löschen der Ausleihdaten. Bitte versuche es später erneut",
    },

    deleteSelectedBorrows: {
      empty: "Keine Ausleihen ausgewählt",
      success: "Ausgewählte Ausleihen erfolgreich gelöscht",
      fail: "Fehler beim Löschen der Ausleihen. Bitte versuche es später erneut",
    },

    updateBorrow: {
      fail: "Fehler beim Aktualisieren der Ausleihdaten. Bitte versuche es später erneut",
    },

    returnSelectedBorrows: {
      empty: "Keine Ausleihen ausgewählt",
      success: "Ausgewählte Ausleihen erfolgreich zurückgegeben",
      fail: "Fehler beim Zurückgeben der Ausleihen. Bitte versuche es später erneut",
    }
  },

  addBorrow: {
    title: "Felder",
    input: "Eingabe",
    username: "Ausleihender Benutzer",
    usernamePlaceholder: "Benutzer auswählen",
    book: "Ausgeliehenes Buch",
    bookPlaceholder: "Buch auswählen",
    startdate: "Ausleihdatum",
    overdate: "Voraussichtliches Rückgabedatum",
    days: "Voraussichtliche Leihdauer",
    daysPlaceholder: "Leihdauer eingeben",
    adduser: "Benutzer hinzufügen",
    adddate: "Hinzufügedatum",
    submit: "Absenden",

    selectBooks: {
      empty: "Keine Bücher gefunden",
      fail: "Fehler beim Laden der Buchdaten. Bitte versuche es später erneut",
    },

    selectUsers: {
      fail: "Fehler beim Laden der Benutzerdaten. Bitte versuche es später erneut",
    },

    submitForm: {
      empty: "Ausleihinformationen unvollständig",
      success: "Ausleihe erfolgreich hinzugefügt",
      fail: "Fehler beim Hinzufügen der Ausleihe. Bitte versuche es später erneut",
    }
  },

  adminNotice: {
    searchPlaceholder: "Suchen Sie nach Bekanntmachungsname, Rolle oder Registrierungsinformationen",
    add: "Bekanntmachung hinzufügen",
    showRecentDays: "Nur die letzten sieben Tage anzeigen",
    enableSelection: "Auswahlkästchen aktivieren",
    selectAll: "Alle auswählen",
    top: "Anheften",
    normal: "Normal",
    untop: "Anheften aufheben",
    delete: "Löschen",
    title: "Bekanntmachungstitel",
    info: "Detailinhalt",
    isTop: "Angepinnt?",
    infoTip: "Doppelklick, um in den Bearbeitungsmodus zu wechseln",
    defaultBoxMsg: "Lade Bekanntmachungsinformationen...",
    noNotice: "Keine Bekanntmachung gefunden",
    pageSize: "Anzeige pro Seite",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} von {totalPages}",

    selectNotices: {
      empty: "Keine Bekanntmachungen gefunden",
      fail: "Fehler beim Laden der Bekanntmachungsinformationen, bitte später erneut versuchen"
    },

    delNotice: {
      fail: "Fehler beim Löschen der Bekanntmachung, bitte später erneut versuchen"
    },

    deleteSelectedNotices: {
      empty: "Keine Bekanntmachungen ausgewählt",
      success: "Ausgewählte Bekanntmachungen erfolgreich gelöscht",
      fail: "Fehler beim Löschen der Bekanntmachungen, bitte später erneut versuchen"
    },

    topSelectedNotices: {
      empty: "Keine Bekanntmachungen ausgewählt",
      success: "Ausgewählte Bekanntmachungen erfolgreich angeheftet",
      fail: "Fehler beim Anheften der Bekanntmachungen, bitte später erneut versuchen"
    },

    untopSelectedNotices: {
      empty: "Keine Bekanntmachungen ausgewählt",
      success: "Anheften der ausgewählten Bekanntmachungen erfolgreich aufgehoben",
      fail: "Fehler beim Aufheben des Anheftens der Bekanntmachungen, bitte später erneut versuchen"
    },

    updateNotice: {
      fail: "Fehler beim Aktualisieren der Bekanntmachung, bitte später erneut versuchen"
    }
  },

  addNotice: {
    field: "Feld",
    input: "Eingabe",
    title: "Bekanntmachungstitel",
    titlePlaceholder: "Bitte den Titel der Bekanntmachung eingeben",
    info: "Bekanntmachungsinhalt",
    infoPlaceholder: "Bitte den Inhalt der Bekanntmachung eingeben",
    adduser: "Benutzer hinzufügen",
    adddate: "Hinzufügedatum",
    isTop: "Angepinnt",
    isTopPlaceholder: "Bitte wählen, ob die Bekanntmachung angeheftet werden soll",
    top: "Anheften",
    normal: "Normal",
    submit: "Absenden",

    submitForm: {
      empty: "Die Bekanntmachungsinformationen sind unvollständig",
      success: "Bekanntmachung erfolgreich hinzugefügt",
      fail: "Fehler beim Hinzufügen der Bekanntmachung, bitte später erneut versuchen"
    }
  },

  adminForum: {
    searchPlaceholder: "Suchen Sie nach Kommentartitel, Benutzer oder Datum",
    add: "Kommentar hinzufügen",
    showRecentDays: "Nur die letzten sieben Tage anzeigen",
    enableSelection: "Auswahlkästchen aktivieren",
    selectAll: "Alle auswählen",
    ban: "Sperren",
    unban: "Entsperren",
    delete: "Löschen",
    title: "Kommentar-Titel",
    info: "Kommentar-Inhalt",
    adduser: "Verfasser",
    adddate: "Veröffentlichungsdatum",
    views: "Anzahl der Aufrufe",
    likes: "Anzahl der Likes",
    state: "Status",
    infoTip: "Doppelklick, um in den Bearbeitungsmodus zu wechseln",
    normal: "Normal",
    banned: "Gesperrt",
    defaultBoxMsg: "Lade Kommentarinformationen...",
    noMessage: "Keine Kommentare gefunden",
    pageSize: "Anzeige pro Seite",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} von {totalPages}",

    selectMessages: {
      empty: "Keine Kommentaraufzeichnungen gefunden",
      fail: "Fehler beim Laden der Kommentarinformationen, bitte später erneut versuchen"
    },

    delMessage: {
      fail: "Fehler beim Löschen des Kommentars, bitte später erneut versuchen"
    },

    deleteSelectedMessages: {
      empty: "Keine Kommentare ausgewählt",
      success: "Ausgewählte Kommentare erfolgreich gelöscht",
      fail: "Fehler beim Löschen der Kommentare, bitte später erneut versuchen"
    },

    banSelectedMessages: {
      empty: "Keine Kommentare ausgewählt",
      success: "Ausgewählte Kommentare erfolgreich gesperrt",
      fail: "Fehler beim Sperren der Kommentare, bitte später erneut versuchen"
    },

    unbanSelectedMessages: {
      empty: "Keine Kommentare ausgewählt",
      success: "Ausgewählte Kommentare erfolgreich entsperrt",
      fail: "Fehler beim Entsperren der Kommentare, bitte später erneut versuchen"
    },

    updateMessage: {
      fail: "Fehler beim Aktualisieren des Kommentars, bitte später erneut versuchen"
    }
  },

  addMessage: {
    field: "Feld",
    input: "Eingabe",
    title: "Kommentar-Titel",
    titlePlaceholder: "Bitte den Kommentar-Titel eingeben",
    info: "Kommentar-Inhalt",
    infoPlaceholder: "Bitte den Kommentar-Inhalt eingeben",
    adduser: "Benutzer hinzufügen",
    adduserPlaceholder: "Bitte den Benutzer eingeben",
    adddate: "Hinzufügedatum",
    submit: "Absenden",

    submitForm: {
      empty: "Kommentarinformationen sind unvollständig",
      success: "Kommentar erfolgreich hinzugefügt",
      fail: "Fehler beim Hinzufügen des Kommentars, bitte später erneut versuchen"
    }
  },

  adminUser: {
    searchPlaceholder: "Suchen Sie nach Benutzername, Registrierungsdatum oder Rolle",
    add: "Benutzer hinzufügen",
    enableSelection: "Auswahlkästchen aktivieren",
    selectAll: "Alle auswählen",
    ban: "Sperren",
    unban: "Entsperren",
    delete: "Löschen",
    username: "Benutzername",
    role: "Berechtigungsgruppe",
    roleTip: "Diese Option wird nach erneuter Anmeldung wirksam",
    email: "E-Mail",
    state: "Status",
    credit: "Kreditpunktzahl",
    adddate: "Registrierungsdatum",
    superAdmin: "Super Administrator",
    admin: "Administrator",
    user: "Benutzer",
    normal: "Normal",
    banned: "Gesperrt",
    denied: "Nicht autorisiert",
    defaultBoxMsg: "Lade Benutzerinformationen...",
    noUser: "Keine Benutzer gefunden",
    pageSize: "Anzeige pro Seite",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} von {totalPages}",

    selectUsers: {
      empty: "Keine Benutzeraufzeichnungen gefunden",
      fail: "Fehler beim Laden der Benutzerinformationen, bitte später erneut versuchen"
    },

    delUser: {
      fail: "Fehler beim Löschen des Benutzers, bitte später erneut versuchen"
    },

    deleteSelectedUsers: {
      empty: "Keine Benutzer ausgewählt",
      denied: "Nicht autorisiert",
      success: "Ausgewählte Benutzer erfolgreich gelöscht",
      fail: "Fehler beim Löschen der Benutzer, bitte später erneut versuchen"
    },

    banSelectedUsers: {
      empty: "Keine Benutzer ausgewählt",
      denied: "Nicht autorisiert",
      success: "Ausgewählte Benutzer erfolgreich gesperrt",
      fail: "Fehler beim Sperren der Benutzer, bitte später erneut versuchen"
    },

    unbanSelectedUsers: {
      empty: "Keine Benutzer ausgewählt",
      denied: "Nicht autorisiert",
      success: "Ausgewählte Benutzer erfolgreich entsperrt",
      fail: "Fehler beim Entsperren der Benutzer, bitte später erneut versuchen"
    },

    updateUser: {
      fail: "Fehler beim Aktualisieren des Benutzers, bitte später erneut versuchen"
    }
  },

  addUser: {
    field: "Feld",
    input: "Eingabe",
    username: "Benutzername",
    usernamePlaceholder: "Bitte den Benutzernamen eingeben",
    state: "Status",
    normal: "Normal",
    banned: "Gesperrt",
    email: "E-Mail",
    emailPlaceholder: "Bitte die E-Mail des Benutzers eingeben",
    adddate: "Registrierungsdatum",
    submit: "Absenden",

    submitForm: {
      empty: "Benutzername und E-Mail dürfen nicht leer sein",
      success: "Benutzer erfolgreich hinzugefügt, initiales passwort：{password}",
      fail: "Fehler beim Hinzufügen des Benutzers, bitte später erneut versuchen"
    }
  },

  adminLog: {
    searchPlaceholder: "Suchen Sie nach Benutzername, IP, Ereignistyp, Details oder Datum",
    enableLog: "Protokollierung aktivieren",
    showRecentDays: "Nur die letzten sieben Tage anzeigen",
    enableSelection: "Auswahlkästchen aktivieren",
    selectAll: "Alle auswählen",
    delete: "Löschen",
    username: "Benutzername",
    type: "Ereignistyp",
    info: "Details",
    adddate: "Datum",
    defaultBoxMsg: "Lade Protokollinformationen...",
    noLog: "Keine Protokolle gefunden",
    pageSize: "Anzeige pro Seite",
    firstPage: "Erste",
    prevPage: "Vorher",
    nextPage: "Nächste",
    lastPage: "Letzte",
    pageInfo: "Seite {currentPage} von {totalPages}",

    toggleLog: {
      response: "Protokollierung ist {status}",
      open: "Aktivieren",
      close: "Deaktivieren",
      fail: "Fehler beim Aktivieren der Protokollierung, bitte später erneut versuchen"
    },

    selectLogs: {
      empty: "Keine Protokollaufzeichnungen gefunden",
      fail: "Fehler beim Laden der Protokollinformationen, bitte später erneut versuchen"
    },

    delLog: {
      fail: "Fehler beim Löschen des Protokolls, bitte später erneut versuchen"
    },

    deleteSelectedLogs: {
      empty: "Keine Protokolle ausgewählt",
      success: "Ausgewählte Protokolle erfolgreich gelöscht",
      fail: "Fehler beim Löschen der Protokolle, bitte später erneut versuchen"
    },

    openInfo: {
      message: "Details anzeigen："
    }
  }

}