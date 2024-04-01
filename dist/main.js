/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/dev/markusDM.js":
/*!********************************!*\
  !*** ./src/js/dev/markusDM.js ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "./src/js/dev/ukik0.js":
/*!*****************************!*\
  !*** ./src/js/dev/ukik0.js ***!
  \*****************************/
/***/ (() => {



/***/ }),

/***/ "./src/js/dev/vzmsk1.js":
/*!******************************!*\
  !*** ./src/js/dev/vzmsk1.js ***!
  \******************************/
/***/ (() => {



/***/ }),

/***/ "./src/js/modules.js":
/*!***************************!*\
  !*** ./src/js/modules.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   modules: () => (/* binding */ modules)
/* harmony export */ });
const modules = {};

/***/ }),

/***/ "./src/js/utils/forms.js":
/*!*******************************!*\
  !*** ./src/js/utils/forms.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules.js */ "./src/js/modules.js");


// --------------------------------------------------------------------------

class Validation {
  constructor() {
    this.attrs = {
      REQUIRED: "data-required",
      IGNORE_VALIDATION: "data-ignore-validation",
      AJAX: "data-ajax",
      DEV: "data-dev",
      IGNORE_FOCUS: "data-ignore-focus",
      SHOW_PLACEHOLDER: "data-show-placeholder",
      VALIDATE: "data-validate"
    };
    this.classes = {
      HAS_ERROR: "_has-error",
      HAS_FOCUS: "_has-focus",
      IS_FILLED: "_is-filled",
      IS_REVEALED: "_is-revealed"
    };
  }
  getErrors(form) {
    let err = 0;
    let requiredFields = form.querySelectorAll(`*[${this.attrs.REQUIRED}]`);
    if (requiredFields.length) {
      requiredFields.forEach(requiredField => {
        if ((requiredField.offsetParent !== null || requiredField.tagName === "SELECT") && !requiredField.disabled) {
          err += this.validateField(requiredField);
        }
      });
    }
    return err;
  }
  addError(requiredField) {
    requiredField.classList.add(this.classes.HAS_ERROR);
    requiredField.parentElement.classList.remove(this.classes.IS_FILLED);
    requiredField.parentElement.classList.add(this.classes.HAS_ERROR);
  }
  removeError(requiredField) {
    requiredField.classList.remove(this.classes.HAS_ERROR);
    requiredField.parentElement.classList.remove(this.classes.HAS_ERROR);
  }
  validateField(requiredField) {
    let err = 0;
    if (requiredField.dataset.required === "email") {
      requiredField.value = requiredField.value.replace(" ", "");
      if (this.testEmail(requiredField)) {
        this.addError(requiredField);
        err++;
      } else {
        this.removeError(requiredField);
      }
    } else if (requiredField.type === "checkbox" && !requiredField.checked) {
      this.addError(requiredField);
      err++;
    } else {
      if (!requiredField.value.trim()) {
        this.addError(requiredField);
        err++;
      } else {
        this.removeError(requiredField);
      }
    }
    return err;
  }
  clearFields(form) {
    form.reset();
    setTimeout(() => {
      const inputs = form.querySelectorAll("input,textarea");
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      if (inputs.length) {
        for (let index = 0; index < inputs.length; index++) {
          const input = inputs[index];
          input.parentElement.classList.remove(this.classes.HAS_FOCUS);
          input.classList.remove(this.classes.HAS_FOCUS);
          this.removeError(input);
        }
      }
      if (checkboxes.length) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
        }
      }
    }, 0);
  }
  testEmail(requiredField) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(requiredField.value);
  }
}
class FormSubmition extends Validation {
  constructor(shouldValidate) {
    super();
    this.shouldValidate = shouldValidate ? shouldValidate : true;
    this.forms = document.querySelectorAll("form");
    this.init();
  }
  sendForm(form) {
    let responseResult = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ``;
    document.dispatchEvent(new CustomEvent("sendForm", {
      detail: {
        form: form
      }
    }));

    // show modal, if popup module is connected
    setTimeout(() => {
      if (_modules_js__WEBPACK_IMPORTED_MODULE_0__.modules.popup) {
        const modal = form.dataset.modalMessage;
        modal ? _modules_js__WEBPACK_IMPORTED_MODULE_0__.modules.modal.open(modal) : null;
      }
    }, 0);
    this.clearFields(form);
    console.log("is sent");
  }
  async handleSubmition(form, e) {
    const err = !form.hasAttribute(this.attrs.IGNORE_VALIDATION) ? this.getErrors(form) : 0;
    if (err === 0) {
      const ajax = form.hasAttribute(this.attrs.AJAX);
      if (ajax) {
        e.preventDefault();
        const action = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
        const method = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
        const data = new FormData(form);
        form.classList.add("_is-sending");
        const response = await fetch(action, {
          method: method,
          body: data
        });
        if (response.ok) {
          const result = await response.json();
          form.classList.remove("_is-sending");
          this.sendForm(form, result);
        } else {
          alert("error");
          form.classList.remove("_is-sending");
        }
      } else if (form.hasAttribute(this.attrs.DEV)) {
        // in development mode
        e.preventDefault();
        this.sendForm(form);
      }
    } else {
      e.preventDefault();
    }
  }
  init() {
    const _this = this;
    const passwordFields = document.querySelectorAll('[data-required="pass"]');
    if (this.forms.length) {
      this.forms.forEach(form => {
        form.addEventListener("submit", function (e) {
          _this.handleSubmition(e.target, e);
        });
        form.addEventListener("reset", function (e) {
          _this.clearFields(e.target);
        });
      });
    }
    if (passwordFields.length) {
      passwordFields.forEach(field => {
        const btn = field.nextElementSibling;
        if (btn) {
          btn.addEventListener("click", function () {
            const type = field.parentElement.classList.contains(_this.classes.IS_REVEALED) ? "password" : "text";
            field.setAttribute("type", type);
            field.parentElement.classList.toggle(_this.classes.IS_REVEALED);
          });
        }
      });
    }
  }
}
class FormFields extends Validation {
  constructor() {
    super();
    this.fields = document.querySelectorAll("input,textarea");
    this.init();
  }
  savePlaceholder() {
    if (this.fields.length) {
      this.fields.forEach(field => {
        if (!field.hasAttribute(this.attrs.SHOW_PLACEHOLDER)) {
          field.dataset.placeholder = field.placeholder;
        }
      });
    }
  }
  handleFocusin(e) {
    const target = e.target;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      if (target.dataset.placeholder) target.placeholder = "";
      if (!target.hasAttribute(this.attrs.IGNORE_FOCUS)) {
        target.classList.add(this.classes.HAS_FOCUS);
        target.parentElement.classList.add(this.classes.HAS_FOCUS);
        target.classList.remove(this.classes.HAS_ERROR);
        target.parentElement.classList.remove(this.classes.HAS_ERROR);
      }
      if (target.type !== "file" && target.type !== "checkbox" && target.type !== "radio" && !target.closest(".quantity")) {
        target.closest(".input").classList.remove(this.classes.IS_FILLED);
      }
      this.removeError(target);
    }
  }
  handleFocusout(e) {
    const target = e.target;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      if (target.dataset.placeholder) {
        target.placeholder = target.dataset.placeholder;
      }
      if (!target.hasAttribute(this.attrs.IGNORE_FOCUS)) {
        target.classList.remove(this.classes.HAS_FOCUS);
        target.parentElement.classList.remove(this.classes.HAS_FOCUS);
      }
      if (target.hasAttribute(this.attrs.VALIDATE)) {
        this.validateField(target);
      }
      if (target.type !== "file" && target.type !== "checkbox" && target.type !== "radio" && !target.closest(".quantity")) {
        if (!target.classList.contains(this.classes.HAS_ERROR) && target.value.trim()) {
          target.closest(".input").classList.add(this.classes.IS_FILLED);
        } else {
          target.closest(".input").classList.remove(this.classes.IS_FILLED);
        }
      }
    }
  }
  init() {
    // save placeholder in data attribute
    this.savePlaceholder();

    // handle submition
    new FormSubmition();

    // events
    document.body.addEventListener("focusin", this.handleFocusin.bind(this));
    document.body.addEventListener("focusout", this.handleFocusout.bind(this));
  }
}

// --------------------------------------------------------------------------

new FormFields();

/***/ }),

/***/ "./src/js/utils/modals.js":
/*!********************************!*\
  !*** ./src/js/utils/modals.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules.js */ "./src/js/modules.js");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils.js */ "./src/js/utils/utils.js");



// --------------------------------------------------------------------------

class Modal {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: 'data-modal',
      attributeCloseButton: 'data-close',
      fixElementSelector: '[data-lp]',
      youtubeAttribute: 'data-modal-youtube',
      youtubePlaceAttribute: 'data-modal-youtube-place',
      setAutoplayYoutube: true,
      classes: {
        modal: 'modal',
        // modalWrapper: 'modal__wrapper',
        modalContent: 'modal__content',
        modalActive: 'modal_show',
        bodyActive: 'modal-show'
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        location: true,
        goHash: true
      },
      on: {
        beforeOpen: function () {},
        afterOpen: function () {},
        beforeClose: function () {},
        afterClose: function () {}
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = ['a[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'area[href]', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];
    //this.options = Object.assign(config, options);
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.options.init ? this.initmodals() : null;
  }
  initmodals() {
    this.eventsmodal();
  }
  eventsmodal() {
    document.addEventListener('click', function (e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : 'error';
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if (this._dataValue !== 'error') {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (!e.target.closest('#unconfirmedAgeModal') && !e.target.closest('#confirmAgeModal') && (buttonClose || !e.target.closest(`.${this.options.classes.modalContent}`) && this.isOpen)) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));
    document.addEventListener('keydown', function (e) {
      if (this.options.closeEsc && e.which == 27 && e.code === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && e.which == 9 && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener('hashchange', function () {
        if (window.location.hash) {
          this._openToHash();
        } else {
          this.close(this.targetOpen.selector);
        }
      }.bind(this));
      window.addEventListener('load', function () {
        if (window.location.hash) {
          this._openToHash();
        }
      }.bind(this));
    }
  }
  open(selectorValue) {
    if (_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.bodyLockStatus) {
      this.bodyLock = document.documentElement.classList.contains('lock') && !this.isOpen ? true : false;
      if (selectorValue && typeof selectorValue === 'string' && selectorValue.trim() !== '') {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(this.targetOpen.selector);
      if (this.targetOpen.element) {
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement('iframe');
          iframe.setAttribute('allowfullscreen', '');
          const autoplay = this.options.setAutoplayYoutube ? 'autoplay;' : '';
          iframe.setAttribute('allow', `${autoplay}; encrypted-media`);
          iframe.setAttribute('src', urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            const youtubePlace = this.targetOpen.element.querySelector('.modal__text').setAttribute(`${this.options.youtubePlaceAttribute}`, '');
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent('beforemodalOpen', {
          detail: {
            modal: this
          }
        }));
        this.targetOpen.element.classList.add(this.options.classes.modalActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) {
          const m = document.querySelector(this.hash);
          setTimeout(() => {
            !this.bodyLock && !m.hasAttribute('data-bl-mobile') || !this.bodyLock && window.innerWidth <= 768 && m.hasAttribute('data-bl-mobile') ? (0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.bodyLock)() : null;
          }, 0);
        } else this._reopen = false;
        this.targetOpen.element.setAttribute('aria-hidden', 'false');
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        setTimeout(() => {
          this._focusTrap();
        }, 50);
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent('aftermodalOpen', {
          detail: {
            modal: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && typeof selectorValue === 'string' && selectorValue.trim() !== '') {
      this.previousOpen.selector = selectorValue;
    }
    if (!this.isOpen || !_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.bodyLockStatus) {
      return;
    }
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent('beforemodalClose', {
      detail: {
        modal: this
      }
    }));
    if (this.youTubeCode) {
      if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = '';
    }
    this.previousOpen.element.classList.remove(this.options.classes.modalActive);
    // aria-hidden
    this.previousOpen.element.setAttribute('aria-hidden', 'true');
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? (0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.bodyUnlock)() : null;
      this.isOpen = false;
    }
    this._removeHash();
    if (this._selectorOpen) {
      this.lastClosed.selector = this.previousOpen.selector;
      this.lastClosed.element = this.previousOpen.element;
    }
    this.options.on.afterClose(this);
    document.dispatchEvent(new CustomEvent('aftermodalClose', {
      detail: {
        modal: this
      }
    }));
    setTimeout(() => {
      this._focusTrap();
    }, 50);
  }
  _getHash() {
    if (this.options.hashSettings.location) {
      this.hash = this.targetOpen.selector.includes('#') ? this.targetOpen.selector : this.targetOpen.selector.replace('.', '#');
    }
  }
  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace('#', '')}`) ? `.${window.location.hash.replace('#', '')}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace('.', '#')}"]`);
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState('', '', this.hash);
  }
  _removeHash() {
    history.pushState('', '', window.location.href.split('#')[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
  _focusTrap() {
    const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
    if (!this.isOpen && this.lastFocusEl) {
      this.lastFocusEl.focus();
    } else {
      focusable[0].focus();
    }
  }
}

// --------------------------------------------------------------------------

_modules_js__WEBPACK_IMPORTED_MODULE_0__.modules.modal = new Modal({});

/***/ }),

/***/ "./src/js/utils/tabs.js":
/*!******************************!*\
  !*** ./src/js/utils/tabs.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils/utils.js");


// --------------------------------------------------------------------------

class Tabs {
  constructor() {
    this.attrs = {
      TABS: "data-tabs",
      INDEX: "data-tabs-index",
      TITLES: "data-tabs-titles",
      TITLE: "data-tabs-title",
      TAB_ITEM: "data-tabs-item",
      BODY: "data-tabs-body",
      HASH: "data-tabs-hash"
    };
    this.classes = {
      INIT: "_tabs-init",
      ACTIVE: "_is-active",
      MODAL: "modal"
    };
    this.tabs = document.querySelectorAll(`[data-tabs]`);
    this.activeHash = [];
    if (this.tabs.length) {
      const hash = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getHash)();
      if (hash && hash.startsWith("tab-")) {
        this.activeHash = hash.replace("tab-", "").split("-");
      }
      this.tabs.forEach((tabsBlock, index) => {
        tabsBlock.classList.add(this.classes.INIT);
        tabsBlock.setAttribute(this.attrs.INDEX, index);
        tabsBlock.addEventListener("click", this.setActions.bind(this));
        this.init(tabsBlock);
      });
    }
  }
  setStatus(tabsBlock) {
    let titles = tabsBlock.querySelectorAll(`[${this.attrs.TITLE}]`);
    let content = tabsBlock.querySelectorAll(`[${this.attrs.TAB_ITEM}]`);
    const index = tabsBlock.dataset.tabsIndex;
    if (content.length) {
      const hasHash = tabsBlock.hasAttribute(this.attrs.HASH);
      content = Array.from(content).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock);
      titles = Array.from(titles).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock);
      content.forEach((item, indx) => {
        if (titles[indx].classList.contains(this.classes.ACTIVE)) {
          item.hidden = false;
          if (hasHash && !item.closest(`.${this.classes.MODAL}`)) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setHash)(`tab-${index}-${indx}`);
          }
        } else {
          item.hidden = true;
        }
      });
    }
  }
  setActions(e) {
    const target = e.target;
    if (target.closest(`[${this.attrs.TITLE}]`)) {
      const title = target.closest(`[${this.attrs.TITLE}]`);
      const tabsBlock = title.closest(`[${this.attrs.TABS}]`);
      if (!title.classList.contains(this.classes.ACTIVE)) {
        let activeTitle = tabsBlock.querySelectorAll(`[${this.attrs.TITLE}].${this.classes.ACTIVE}`);
        activeTitle.length ? activeTitle = Array.from(activeTitle).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock) : null;
        activeTitle.length ? activeTitle[0].classList.remove(this.classes.ACTIVE) : null;
        title.classList.add(this.classes.ACTIVE);
        this.setStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
  init(tabsBlock) {
    let titles = tabsBlock.querySelectorAll(`[${this.attrs.TITLES}]>*`);
    let content = tabsBlock.querySelectorAll(`[${this.attrs.BODY}]>*`);
    const index = tabsBlock.dataset.tabsIndex;
    const activeHashBlock = this.activeHash[0] == index;
    if (activeHashBlock) {
      const activeTitle = tabsBlock.querySelector(`[${this.attrs.TITLES}]>.${this.classes.ACTIVE}`);
      activeTitle ? activeTitle.classList.remove(this.classes.ACTIVE) : null;
    }
    if (content.length) {
      content = Array.from(content).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock);
      titles = Array.from(titles).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock);
      content.forEach((item, index) => {
        titles[index].setAttribute(this.attrs.TITLE, "");
        item.setAttribute(this.attrs.TAB_ITEM, "");
        if (activeHashBlock && index == this.activeHash[1]) {
          titles[index].classList.add(this.classes.ACTIVE);
        }
        item.hidden = !titles[index].classList.contains(this.classes.ACTIVE);
      });
    }
  }
}

// --------------------------------------------------------------------------

new Tabs();

/***/ }),

/***/ "./src/js/utils/utils.js":
/*!*******************************!*\
  !*** ./src/js/utils/utils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _slideDown: () => (/* binding */ _slideDown),
/* harmony export */   _slideToggle: () => (/* binding */ _slideToggle),
/* harmony export */   _slideUp: () => (/* binding */ _slideUp),
/* harmony export */   bodyLock: () => (/* binding */ bodyLock),
/* harmony export */   bodyLockStatus: () => (/* binding */ bodyLockStatus),
/* harmony export */   bodyLockToggle: () => (/* binding */ bodyLockToggle),
/* harmony export */   bodyUnlock: () => (/* binding */ bodyUnlock),
/* harmony export */   dataMediaQueries: () => (/* binding */ dataMediaQueries),
/* harmony export */   getHash: () => (/* binding */ getHash),
/* harmony export */   menuClose: () => (/* binding */ menuClose),
/* harmony export */   menuInit: () => (/* binding */ menuInit),
/* harmony export */   menuOpen: () => (/* binding */ menuOpen),
/* harmony export */   remToPx: () => (/* binding */ remToPx),
/* harmony export */   removeClasses: () => (/* binding */ removeClasses),
/* harmony export */   setCurrentYear: () => (/* binding */ setCurrentYear),
/* harmony export */   setHash: () => (/* binding */ setHash),
/* harmony export */   uniqueArray: () => (/* binding */ uniqueArray)
/* harmony export */ });
/**
 * set hash to url
 * @param {string} hash
 */
const setHash = hash => {
  hash = hash ? `#${hash}` : window.location.href.split('#')[0];
  history.pushState('', '', hash);
};

/**
 * get hash from url
 * @returns string
 */
const getHash = () => {
  if (location.hash) {
    return location.hash.replace('#', '');
  }
};

/**
 * initializes hamburger menu
 */
const menuInit = () => {
  if (document.querySelector('.hamburger')) {
    document.addEventListener('click', function (e) {
      if (bodyLockStatus && e.target.closest('.hamburger')) {
        menuOpen();
      } else if (bodyLockStatus && document.documentElement.classList.contains('_menu-opened') && (e.target.closest('.menu__close-btn') || !e.target.closest('.menu'))) {
        menuClose();
      }
    });
  }
};
/**
 * opens hamburger menu
 */
const menuOpen = () => {
  bodyLock();
  document.documentElement.classList.add('_menu-opened');
};
/**
 * closes hamburger menu
 */
const menuClose = () => {
  bodyUnlock();
  document.documentElement.classList.remove('_menu-opened');
};

// body lock
let bodyLockStatus = true;
/**
 * toggles body lock
 * @param {number} delay
 */
const bodyLockToggle = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
/**
 * unlocks body
 * @param {number} delay
 */
const bodyUnlock = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (bodyLockStatus) {
    setTimeout(() => {
      document.documentElement.classList.remove('lock');
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
/**
 * locks body
 * @param {number} delay
 */
const bodyLock = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (bodyLockStatus) {
    document.documentElement.classList.add('lock');
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};

/**
 * make the array unique
 * @param {array} array
 * @returns
 */
function uniqueArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

/**
 *
 * @param {array} array
 * @param {number} dataSetValue
 * process media requests from attributes
 */
const dataMediaQueries = (array, dataSetValue) => {
  // get objects with media queries
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(',')[0];
    }
  });
  // objects with media queries initialization
  if (media.length) {
    const breakpointsArray = [];
    media.forEach(item => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(',');
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // get unique breakpoints
    let mdQueries = breakpointsArray.map(function (item) {
      return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
    });
    mdQueries = uniqueArray(mdQueries);
    const mdQueriesArray = [];
    if (mdQueries.length) {
      // work with every breakpoint
      mdQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(',');
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // objects with conditions
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia
        });
      });
      return mdQueriesArray;
    }
  }
};

/**
 * smoothly slides up
 * @param {HTMLElement} target
 * @param {number} duration
 * @param {boolean} showmore
 */
const _slideUp = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  let showmore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}rem` : `0`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty('height') : null;
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      !showmore ? target.style.removeProperty('overflow') : null;
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // create event
      document.dispatchEvent(new CustomEvent('slideUpDone', {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
};

/**
 * smoothly slides down
 * @param {HTMLElement} target
 * @param {number} duration
 * @param {boolean} showmore
 */
const _slideDown = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  let showmore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty('height') : null;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}rem` : `0`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // create event
      document.dispatchEvent(new CustomEvent('slideDownDone', {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
};

/**
 * toggles smooth slide
 * @param {HTMLElement} target
 * @param {number} duration
 * @returns function
 */
const _slideToggle = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};

/**
 * converts rem to pixels
 * @param {number} remValue
 * @returns string
 */
function remToPx(remValue) {
  const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const pxValue = remValue * htmlFontSize;
  return Math.round(pxValue) + 'px';
}

/**
 * set current year
 */
const setCurrentYear = () => {
  if (document.getElementById('currentYear')) {
    document.getElementById('currentYear').innerHTML = new Date().getFullYear();
  }
};

// remove class from all array elements
const removeClasses = (array, className) => {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className);
  }
};

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/group-css-media-queries-loader/lib/index.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/style.scss":
/*!*************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/group-css-media-queries-loader/lib/index.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/style.scss ***!
  \*************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Noto+Sans:wdth,wght@75,100..900&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@font-face {
  font-family: "Bahnschrift";
  src: url("../assets/fonts/Bahnschrift.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: "Noto Sans";
  font-size: 0.5208335vw;
  font-style: normal;
  font-weight: normal;
  -webkit-animation: bugfix infinite 1s;
  line-height: 1.2;
  margin: 0;
  height: 100%;
  padding: 0;
}

body {
  font-style: normal;
  font-weight: normal;
  -webkit-animation: bugfix infinite 1s;
  line-height: 1.2;
  margin: 0;
  padding: 0;
  height: 100%;
  font-size: 1.8rem;
  color: #001b30;
  background-color: #ffffff;
}

input,
textarea {
  -webkit-animation: bugfix infinite 1s;
  line-height: inherit;
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  color: inherit;
}

a {
  color: unset;
}

a,
a:hover {
  text-decoration: none;
}

button,
input,
a,
textarea {
  outline: none;
  cursor: pointer;
  font: inherit;
}
button:focus,
input:focus,
a:focus,
textarea:focus {
  outline: none;
}
button:active,
input:active,
a:active,
textarea:active {
  outline: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font: inherit;
  margin: 0;
  padding: 0;
}

p {
  margin-top: 0;
  margin-bottom: 0;
}

img {
  width: 100%;
  height: auto;
  display: block;
}

button {
  border: none;
  color: inherit;
  font: inherit;
  text-align: inherit;
  padding: 0;
  background-color: transparent;
}

ul {
  padding: 0;
  margin: 0;
}

ul li {
  margin: 0;
  padding: 0;
  list-style: none;
}

.container {
  width: 176rem;
  margin: 0 auto;
}

section {
  margin-bottom: 19rem;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

svg,
img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
html.lock {
  overflow: hidden;
  pointer-events: none;
}

html,
body {
  overflow-x: clip;
}

main {
  position: relative;
  flex: 1 1 auto;
}

.wrapper {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1920px;
}

.header {
  position: absolute;
  z-index: 500;
  top: 0;
  left: 0;
  width: 100%;
  height: 11.8rem;
}

.hf-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}
.hf-grid__logo {
  flex: 0 0 12.2rem;
  width: 12.2rem;
}
.hf-grid__nav {
  display: flex;
  column-gap: 4.8rem;
  color: #ffffff;
}
.hf-grid__nav-link {
  font-size: 2.4rem;
  line-height: 2.9rem;
  font-weight: 300;
}

.footer {
  padding: 5.2rem 0;
  background-color: #004780;
  color: #ffffff;
}
.footer__container {
  display: flex;
  flex-direction: column;
  row-gap: 4rem;
}
.footer__body {
  padding-bottom: 4rem;
  border-bottom: 1px solid #a6bdd0;
}
.footer__bottom {
  display: flex;
  justify-content: space-between;
}
.footer__txt {
  color: #b2c8d9;
}

.h {
  font-family: "Bahnschrift";
  line-height: 120%;
}
.h_h1 {
  font-size: 7rem;
  text-transform: uppercase;
}
.h_h2 {
  font-size: 6rem;
}
.h_h3 {
  font-size: 3.2rem;
}
.h_h4 {
  font-size: 2.4rem;
}

.txt24 {
  font-size: 2.4rem;
  line-height: 3.3rem;
}

.txt22 {
  font-size: 2.2rem;
  line-height: 2.6rem;
}
.txt22_sb {
  font-weight: 600;
}

.btn {
  display: inline-flex;
  text-align: center;
  color: #ffffff;
}
.btn_primary {
  position: relative;
  padding: 1.4rem 2.8rem;
  justify-content: center;
  align-items: center;
  background-color: #004780;
  clip-path: polygon(0 0, 92% 0, 100% 22%, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 20%);
  transition: clip-path 0.3s ease;
}
.btn_primary .btn__txt {
  line-height: 2.6rem;
}
.btn_primary:disabled {
  color: #86919a;
  background-color: #f2f2f2;
  pointer-events: none;
}
.btn_primary_white {
  background-color: #ffffff;
}
.btn_primary_white .btn__txt {
  color: #004780;
}
.btn_secondary {
  position: relative;
}
.btn_secondary::after {
  content: "";
  position: absolute;
  bottom: -0.3rem;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ffffff;
  transition: transform 0.3s ease;
  transform-origin: left;
}
.btn_secondary .btn__txt {
  line-height: 2.4rem;
}
.btn_secondary_blue {
  color: #004780;
}
.btn_secondary_blue::after {
  background-color: #004780;
}

.i-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 4.2rem;
  width: 4.2rem;
  height: 4.2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}
.i-btn::before, .i-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid #ffffff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.i-btn::before {
  width: 3.8rem;
  height: 3.8rem;
  opacity: 0.4;
}
.i-btn::after {
  width: 3.4rem;
  height: 3.4rem;
}
.i-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}
.i-btn_blue {
  border: 1px solid rgba(0, 71, 128, 0.1);
}
.i-btn_blue::before, .i-btn_blue::after {
  border: 1px solid #004780;
}
.i-btn_blue svg {
  fill: #004780;
}

input[type=text],
input[type=email],
input[type=tel],
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

textarea:focus,
input:focus {
  outline: none;
}

.input {
  position: relative;
}
.input_file .input__field {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.input_file .input__placeholder {
  display: inline-flex;
  align-items: center;
  column-gap: 1.2rem;
  line-height: 2.6rem;
}
.input_file .input__placeholder::after {
  content: "";
  flex: 0 0 2.4rem;
  width: 2.4rem;
  height: 2.4rem;
  background: url("./assets/images/icons/clip.svg") center/contain no-repeat;
}
.input:not(.input_file) .input__field {
  padding-bottom: 1.6rem;
  display: block;
  width: 100%;
  line-height: 1;
  border-bottom: 1px solid #a6bdd0;
  transition: color 0.3s ease, border-bottom 0.3s ease;
}
.input:not(.input_file) .input__field::placeholder {
  color: #4d5f6e;
  transition: color 0.3s ease;
}
.input:not(.input_file)._is-filled .input__field {
  border-bottom: 1px solid #000000;
  color: #000000;
}
.input:not(.input_file)._has-error::after {
  content: attr(data-hint);
  position: absolute;
  bottom: -0.4rem;
  left: 0;
  font-size: 1.4rem;
  color: #d90000;
  white-space: nowrap;
  transform: translateY(100%);
}
.input:not(.input_file)._has-error .input__field {
  border-bottom: 1px solid #d90000;
}

.option {
  position: relative;
  cursor: pointer;
}
.option__input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  appearance: none;
}
.option__input:checked + .option__txt::after {
  transform: scale(1);
}
.option__txt {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  column-gap: 0.8rem;
}
.option__txt::before, .option__txt::after {
  content: "";
  border-radius: 50%;
}
.option__txt::before {
  flex: 0 0 2.4rem;
  width: 2.4rem;
  height: 2.4rem;
  border: 1.5px solid #004780;
}
.option__txt::after {
  position: absolute;
  left: 0.4rem;
  top: 0.4rem;
  width: 1.6rem;
  height: 1.6rem;
  background-color: #004780;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.checkbox {
  position: relative;
  display: inline-flex;
}
.checkbox__input {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  opacity: 0;
  appearance: none;
}
.checkbox__input:checked + .checkbox__txt::before {
  border: 1px solid #004780;
}
.checkbox__input:checked + .checkbox__txt::after {
  transform: scale(1);
}
.checkbox__txt {
  position: relative;
  display: inline-flex;
  align-items: center;
  column-gap: 0.8rem;
  cursor: pointer;
}
.checkbox__txt::before {
  content: "";
  flex: 0 0 2.2rem;
  width: 2.2rem;
  height: 2.2rem;
  border: 1px solid #a6bdd0;
  background-color: #ffffff;
  transition: border 0.3s ease;
}
.checkbox__txt::after {
  content: "";
  position: absolute;
  top: 0.3rem;
  left: 0.3rem;
  width: 1.6rem;
  height: 1.6rem;
  background-color: #004780;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
}
.breadcrumbs__link {
  display: flex;
  align-items: center;
  column-gap: 1.2rem;
}
.breadcrumbs__link::after {
  content: "";
  width: 2rem;
  height: 0.2rem;
  background-color: #808d97;
}
.breadcrumbs__txt {
  color: #004780;
}

.tabs__navigation {
  display: flex;
  column-gap: 1.5rem;
}
.tabs__body {
  padding-top: 1rem;
}

.tab {
  padding: 0 2.8rem;
  display: inline-flex;
  align-items: center;
  height: 10rem;
  background-color: #f2f2f2;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.tab svg {
  flex: 0 0 2.4rem;
  width: 2.4rem;
  height: 2.4rem;
  transform: translate(0.3rem, -0.3rem);
  transition: fill 0.3s ease;
}
.tab__num {
  margin-right: 0.8rem;
}
.tab__txt {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.tab._is-active {
  background-color: #004780;
  color: #ffffff;
}
.tab._is-active svg {
  fill: #ffffff;
}
@media (min-width: 48em){
  .header__hamburger-btn {
    display: none;
  }
}
@media (min-width: 1920px){
  html {
    font-size: 10px;
  }
}
@media (max-width: 48em){
  section {
    margin-bottom: 20rem;
  }
  html {
    font-size: 5px;
    font-size: 1.5625vw;
    font-size: 1.3333333333vw;
    -webkit-text-size-adjust: none;
  }
  body {
    font-size: 2.8rem;
    -webkit-text-size-adjust: none;
  }
  .container {
    padding: 0 2.4rem;
    width: 100%;
  }
  .header {
    height: 15.4rem;
  }
  .header .hf-grid {
    padding-top: 4.8rem;
    border-bottom: none;
  }
  .header .hf-grid__nav {
    display: none;
  }
  .header .hf-grid__btn {
    display: none;
  }
  .hf-grid__logo {
    flex: 0 0 22rem;
    width: 22rem;
  }
  .hf-grid__nav-link {
    font-size: 3.8rem;
    line-height: 1;
    font-weight: 400;
  }
  .footer {
    padding: 6.4rem 0;
  }
  .footer__container {
    row-gap: 6.4rem;
  }
  .footer__body {
    padding-bottom: 6.4rem;
  }
  .footer__bottom {
    flex-direction: column;
    justify-content: stretch;
    align-items: center;
    row-gap: 1.6rem;
    text-align: center;
  }
  .footer .hf-grid {
    display: flex;
    flex-direction: column;
    row-gap: 6.4rem;
  }
  .footer .hf-grid__logo {
    flex: 0 0 auto;
    align-self: flex-start;
  }
  .footer .hf-grid__nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-self: flex-start;
    column-gap: 15rem;
    row-gap: 2.4rem;
  }
  .footer .hf-grid__btn {
    width: 100%;
  }
  .h_h1 {
    font-size: 5.6rem;
  }
  .h_h2 {
    font-size: 5.6rem;
  }
  .h_h3 {
    font-size: 4.4rem;
    line-height: 1;
  }
  .h_h4 {
    font-size: 4.4rem;
    line-height: 1;
  }
  .txt24 {
    font-size: 4rem;
  }
  .txt22 {
    font-size: 3.6rem;
  }
  .btn_primary {
    padding: 2.8rem 5.6rem;
  }
  .btn_primary::after {
    width: 5.6rem;
  }
  .btn_primary_fw {
    clip-path: polygon(0 0, 96% 0, 100% 29%, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 20%);
  }
  .btn_primary .btn__txt {
    line-height: 4.2rem;
  }
  .btn_secondary .btn__txt {
    line-height: 4.8rem;
  }
  .i-btn {
    flex: 0 0 10rem;
    width: 10rem;
    height: 10rem;
  }
  .i-btn::before {
    width: 9rem;
    height: 9rem;
  }
  .i-btn::after {
    width: 8rem;
    height: 8rem;
  }
  .i-btn svg {
    width: 3.2rem;
    height: 3.2rem;
  }
  .input_file .input__placeholder {
    column-gap: 3rem;
    line-height: 4.1rem;
  }
  .input_file .input__placeholder::after {
    flex: 0 0 4.8rem;
    width: 4.8rem;
    height: 4.8rem;
  }
  .input:not(.input_file)._has-error::after {
    bottom: -0.8rem;
    font-size: 2rem;
  }
  .option__txt {
    column-gap: 1.6rem;
  }
  .option__txt::before {
    flex: 0 0 4.8rem;
    width: 4.8rem;
    height: 4.8rem;
  }
  .option__txt::after {
    top: 0.8rem;
    left: 0.8rem;
    width: 3.2rem;
    height: 3.2rem;
  }
  .checkbox__txt {
    column-gap: 1.6rem;
  }
  .checkbox__txt::before {
    flex: 0 0 4.4rem;
    width: 4.4rem;
    height: 4.4rem;
  }
  .checkbox__txt::after {
    left: 0.6rem;
    top: 0.6rem;
    width: 3.2rem;
    height: 3.2rem;
  }
  .breadcrumbs {
    column-gap: 1.6rem;
    font-size: 3.2rem;
  }
  .breadcrumbs__link {
    column-gap: 1.6rem;
  }
  .breadcrumbs__link::after {
    width: 3.2rem;
    height: 1px;
  }
  .tab {
    padding: 0 2.4rem;
    height: 11.2rem;
  }
  .tab svg {
    flex: 0 0 3.2rem;
    width: 3.2rem;
    height: 3.2rem;
    transform: translate(0.6rem, -0.6rem);
  }
  .tab__num {
    margin-right: 1.6rem;
  }
}
@media (any-hover: hover){
  .btn_primary:hover {
    clip-path: polygon(0 0, 100% 0, 100% 0, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 20%);
  }
  .btn_secondary:hover::after {
    transform: scaleX(0.05);
  }
}`, "",{"version":3,"sources":["webpack://./src/scss/fonts.scss","webpack://./src/scss/style.scss","webpack://./src/scss/set.scss","webpack://./src/scss/sections/header.scss","webpack://./src/scss/sections/footer.scss","webpack://./src/ui/_typo.scss","webpack://./src/ui/_buttons.scss","webpack://./src/ui/_input.scss","webpack://./src/ui/_breadcrumbs.scss","webpack://./src/ui/_tabs.scss","<no source>"],"names":[],"mappings":"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","sourcesContent":["@font-face {\n  font-family: \"Bahnschrift\";\n  src: url(\"../assets/fonts/Bahnschrift.woff2\") format(\"woff2\");\n  font-weight: 400;\n  font-style: normal;\n}\n","// --------------------------------- mixins ---------------------------------\n\n@import './mixins';\n\n// -------------------------------- variables -------------------------------\n\n// colors\n$white: #ffffff;\n$black: #000000;\n$blue: #004780;\n$gray: #f2f2f2;\n$fontColor: #001b30;\n$lightBlue: #a6bdd0;\n$red: #d90000;\n\n// ---------------------------------- fonts ---------------------------------\n\n@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wdth,wght@75,100..900&display=swap');\n\n// local fonts\n@import './fonts';\n\n// ------------------------------- base styles ------------------------------\n\n// base scss file\n@import './set';\n\n// html, body\nhtml {\n    &.lock {\n        overflow: hidden;\n        pointer-events: none;\n    }\n}\nhtml,\nbody {\n    overflow-x: clip;\n}\n\n// main\nmain {\n    position: relative;\n    flex: 1 1 auto;\n}\n\n.wrapper {\n    margin: 0 auto;\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    max-width: 1920px;\n}\n\n// --------------------------------------------------------------------------\n\n// header / footer\n@import './sections/header';\n@import './sections/footer';\n\n// ui\n@import '../ui/ui';\n\n// --------------------------------------------------------------------------\n\n@import './dev/vzmsk1.scss';\n@import './dev/markusDM.scss';\n@import './dev/ukik0.scss';\n","*,\n*::before,\n*::after {\n    box-sizing: border-box;\n}\nhtml {\n    font-family: 'Noto Sans'; // шрифт по умолчанию по сайту\n    font-size: 0.5208335vw; // на разрешении 1920 0.520835vw === 10px\n    font-style: normal;\n    font-weight: normal;\n    -webkit-animation: bugfix infinite 1s;\n    line-height: 1.2;\n    margin: 0;\n    height: 100%;\n    padding: 0;\n}\n\nbody {\n    font-style: normal;\n    font-weight: normal;\n    -webkit-animation: bugfix infinite 1s;\n    line-height: 1.2;\n    margin: 0;\n    padding: 0;\n    height: 100%;\n    font-size: 1.8rem;\n    color: $fontColor; // цвет по умолчанию текста по сайту\n    background-color: $white;\n}\n\ninput,\ntextarea {\n    -webkit-animation: bugfix infinite 1s;\n    line-height: inherit;\n    margin: 0;\n    padding: 0;\n    background-color: transparent;\n    border: none;\n    color: inherit;\n}\na {\n    color: unset;\n}\na,\na:hover {\n    text-decoration: none;\n}\n\nbutton,\ninput,\na,\ntextarea {\n    outline: none;\n    cursor: pointer;\n    font: inherit;\n    &:focus {\n        outline: none;\n    }\n    &:active {\n        outline: none;\n    }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n    font: inherit;\n    margin: 0;\n    padding: 0;\n}\np {\n    margin-top: 0;\n    margin-bottom: 0;\n}\n\nimg {\n    width: 100%;\n    height: auto;\n    display: block;\n}\n\nbutton {\n    border: none;\n    color: inherit;\n    font: inherit;\n    text-align: inherit;\n    padding: 0;\n    background-color: transparent;\n}\nul {\n    padding: 0;\n    margin: 0;\n}\n\nul li {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n\n.container {\n    width: 176rem;\n    margin: 0 auto;\n}\n\nsection {\n    margin-bottom: 19rem;\n    \n    @media (max-width: 48em) {\n        margin-bottom: 20rem;\n    }\n}\n\ninput[type='number']::-webkit-inner-spin-button,\ninput[type='number']::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n}\n\ninput[type='number'] {\n    -moz-appearance: textfield;\n}\n\nsvg,\nimg {\n    width: 100%;\n    height: auto;\n    object-fit: contain;\n}\n\n@media (min-width: 1920px) {\n    html {\n        font-size: 10px;\n    }\n}\n\n@media (max-width: 48em) {\n    html {\n        font-size: 5px;\n        font-size: 1.5625vw;\n        font-size: calc((100 / 375) * 5vw); // где 375 это ширина моб версии макета\n        -webkit-text-size-adjust: none;\n    }\n\n    body {\n        font-size: 2.8rem;\n        -webkit-text-size-adjust: none;\n    }\n\n    .container {\n        padding: 0 2.4rem; // в моб версии отступ от края задаем для всех контейнеров, а там где не нужно можем точечно убрать\n        width: 100%;\n    }\n}\n",".header {\n    position: absolute;\n    z-index: 500;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 11.8rem;\n\n    @media (max-width: 48em) {\n        height: 15.4rem;\n\n        .hf-grid {\n            padding-top: 4.8rem;\n            border-bottom: none;\n\n            &__nav {\n                display: none;\n            }\n\n            &__btn {\n                display: none;\n            }\n        }\n    }\n\n    &__hamburger-btn {\n        @media (min-width: 48em) {\n            display: none;\n        }\n    }\n}\n\n.hf-grid {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    height: 100%;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.4);\n\n    &__logo {\n        flex: 0 0 12.2rem;\n        width: 12.2rem;\n\n        @media (max-width: 48em) {\n            flex: 0 0 22rem;\n            width: 22rem;\n        }\n    }\n    &__nav {\n        display: flex;\n        column-gap: 4.8rem;\n        color: $white;\n    }\n\n    &__nav-link {\n        font-size: 2.4rem;\n        line-height: 2.9rem;\n        font-weight: 300;\n\n        @media (max-width: 48em) {\n            font-size: 3.8rem;\n            line-height: 1;\n            font-weight: 400;\n        }\n    }\n}\n",".footer {\n    padding: 5.2rem 0;\n    background-color: $blue;\n    color: $white;\n\n    &__container {\n        display: flex;\n        flex-direction: column;\n        row-gap: 4rem;\n    }\n\n    &__body {\n        padding-bottom: 4rem;\n        border-bottom: 1px solid #a6bdd0;\n    }\n\n    &__bottom {\n        display: flex;\n        justify-content: space-between;\n    }\n\n    &__txt {\n        color: #b2c8d9;\n    }\n\n    @media (max-width: 48em) {\n        padding: 6.4rem 0;\n\n        &__container {\n            row-gap: 6.4rem;\n        }\n\n        &__body {\n            padding-bottom: 6.4rem;\n        }\n\n        &__bottom {\n            flex-direction: column;\n            justify-content: stretch;\n            align-items: center;\n            row-gap: 1.6rem;\n            text-align: center;\n        }\n\n        .hf-grid {\n            display: flex;\n            flex-direction: column;\n            row-gap: 6.4rem;\n\n            &__logo {\n                flex: 0 0 auto;\n                align-self: flex-start;\n            }\n\n            &__nav {\n                display: grid;\n                grid-template-columns: repeat(2, 1fr);\n                align-self: flex-start;\n                column-gap: 15rem;\n                row-gap: 2.4rem;\n            }\n\n            &__btn {\n                width: 100%;\n            }\n        }\n    }\n}\n",".h {\n    font-family: 'Bahnschrift';\n    line-height: 120%;\n\n    &_h1 {\n        font-size: 7rem;\n        text-transform: uppercase;\n\n        @media (max-width: 48em) {\n            font-size: 5.6rem;\n        }\n    }\n\n    &_h2 {\n        font-size: 6rem;\n\n        @media (max-width: 48em) {\n            font-size: 5.6rem;\n        }\n    }\n\n    &_h3 {\n        font-size: 3.2rem;\n\n        @media (max-width: 48em) {\n            font-size: 4.4rem;\n            line-height: 1;\n        }\n    }\n\n    &_h4 {\n        font-size: 2.4rem;\n\n        @media (max-width: 48em) {\n            font-size: 4.4rem;\n            line-height: 1;\n        }\n    }\n}\n\n.txt24 {\n    font-size: 2.4rem;\n    line-height: 3.3rem;\n\n    @media (max-width: 48em) {\n        font-size: 4rem;\n    }\n}\n\n.txt22 {\n    font-size: 2.2rem;\n    line-height: 2.6rem;\n\n    &_sb {\n        font-weight: 600;\n    }\n\n    @media (max-width: 48em) {\n        font-size: 3.6rem;\n    }\n}\n",".btn {\n    display: inline-flex;\n    text-align: center;\n    color: $white;\n\n    &_primary {\n        position: relative;\n        padding: 1.4rem 2.8rem;\n        justify-content: center;\n        align-items: center;\n        background-color: $blue;\n        clip-path: polygon(0 0, 92% 0, 100% 22%, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 20%);\n        transition: clip-path 0.3s ease;\n\n        @media (max-width: 48em) {\n            padding: 2.8rem 5.6rem;\n\n            &::after {\n                width: 5.6rem;\n            }\n\n            &_fw {\n                clip-path: polygon(0 0, 96% 0, 100% 29%, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 20%);\n            }\n        }\n\n        .btn__txt {\n            line-height: 2.6rem;\n\n            @media (max-width: 48em) {\n                line-height: 4.2rem;\n            }\n        }\n\n        &:disabled {\n            color: #86919a;\n            background-color: $gray;\n            pointer-events: none;\n        }\n\n        &_white {\n            background-color: $white;\n\n            .btn__txt {\n                color: $blue;\n            }\n        }\n\n        @media (any-hover: hover) {\n            &:hover {\n                clip-path: polygon(0 0, 100% 0, 100% 0, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0% 20%);\n            }\n        }\n    }\n\n    &_secondary {\n        position: relative;\n\n        &::after {\n            content: '';\n            position: absolute;\n            bottom: -0.3rem;\n            left: 0;\n            width: 100%;\n            height: 1px;\n            background-color: $white;\n            transition: transform 0.3s ease;\n            transform-origin: left;\n        }\n\n        .btn__txt {\n            line-height: 2.4rem;\n        }\n\n        @media (any-hover: hover) {\n            &:hover {\n                &::after {\n                    transform: scaleX(0.05);\n                }\n            }\n        }\n\n        @media (max-width: 48em) {\n            .btn__txt {\n                line-height: 4.8rem;\n            }\n        }\n\n        &_blue {\n            color: $blue;\n\n            &::after {\n                background-color: $blue;\n            }\n        }\n    }\n}\n\n.i-btn {\n    position: relative;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    flex: 0 0 4.2rem;\n    width: 4.2rem;\n    height: 4.2rem;\n    border: 1px solid rgba(255, 255, 255, 0.1);\n    border-radius: 50%;\n\n    @media (max-width: 48em) {\n        flex: 0 0 10rem;\n        width: 10rem;\n        height: 10rem;\n    }\n\n    &::before,\n    &::after {\n        content: '';\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        border: 1px solid $white;\n        border-radius: 50%;\n        transform: translate(-50%, -50%);\n    }\n\n    &::before {\n        width: 3.8rem;\n        height: 3.8rem;\n        opacity: 0.4;\n\n        @media (max-width: 48em) {\n            width: 9rem;\n            height: 9rem;\n        }\n    }\n\n    &::after {\n        width: 3.4rem;\n        height: 3.4rem;\n\n        @media (max-width: 48em) {\n            width: 8rem;\n            height: 8rem;\n        }\n    }\n\n    svg {\n        width: 1.5rem;\n        height: 1.5rem;\n\n        @media (max-width: 48em) {\n            width: 3.2rem;\n            height: 3.2rem;\n        }\n    }\n\n    &_blue {\n        border: 1px solid rgba(0, 71, 128, 0.1);\n\n        &::before,\n        &::after {\n            border: 1px solid $blue;\n        }\n\n        svg {\n            fill: $blue;\n        }\n    }\n}\n","input[type=\"text\"],\ninput[type=\"email\"],\ninput[type=\"tel\"],\ntextarea {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\ntextarea:focus,\ninput:focus {\n  outline: none;\n}\n\n.input {\n  position: relative;\n\n  &_file {\n    .input {\n      &__field {\n        position: absolute;\n        z-index: 2;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        opacity: 0;\n      }\n\n      &__placeholder {\n        display: inline-flex;\n        align-items: center;\n        column-gap: 1.2rem;\n        line-height: 2.6rem;\n\n        &::after {\n          content: \"\";\n          flex: 0 0 2.4rem;\n          width: 2.4rem;\n          height: 2.4rem;\n          background: url(\"./assets/images/icons/clip.svg\") center / contain\n            no-repeat;\n        }\n\n        @media (max-width: 48em) {\n          column-gap: 3rem;\n          line-height: 4.1rem;\n\n          &::after {\n            flex: 0 0 4.8rem;\n            width: 4.8rem;\n            height: 4.8rem;\n          }\n        }\n      }\n    }\n  }\n\n  &:not(&_file) {\n    .input__field {\n      padding-bottom: 1.6rem;\n      display: block;\n      width: 100%;\n      line-height: 1;\n      border-bottom: 1px solid $lightBlue;\n      transition:\n        color 0.3s ease,\n        border-bottom 0.3s ease;\n\n      &::placeholder {\n        color: #4d5f6e;\n        transition: color 0.3s ease;\n      }\n    }\n\n    &._is-filled {\n      .input__field {\n        border-bottom: 1px solid $black;\n        color: $black;\n      }\n    }\n\n    &._has-error {\n      &::after {\n        content: attr(data-hint);\n        position: absolute;\n        bottom: -0.4rem;\n        left: 0;\n        font-size: 1.4rem;\n        color: $red;\n        white-space: nowrap;\n        transform: translateY(100%);\n\n        @media (max-width: 48em) {\n          bottom: -0.8rem;\n          font-size: 2rem;\n        }\n      }\n      .input__field {\n        border-bottom: 1px solid $red;\n      }\n    }\n  }\n  //\n  //  // .input__label\n  //\n  //  &__label {\n  //    position: relative;\n  //    display: flex;\n  //    align-items: center;\n  //    justify-content: space-between;\n  //    column-gap: 3rem;\n  //    white-space: nowrap;\n  //  }\n  //\n  //  &._has-focus {\n  //    .input__field {\n  //      border: 1px solid $black;\n  //    }\n  //  }\n  //  &._has-error {\n  //    .input__label {\n  //      color: transparent;\n  //      &::after {\n  //        content: attr(data-hint);\n  //        position: absolute;\n  //        top: 0;\n  //        left: 0;\n  //        color: $red;\n  //        white-space: nowrap;\n  //      }\n  //    }\n  //    .input__field {\n  //      border: 1px solid $red;\n  //      color: $red;\n  //      &::placeholder {\n  //        color: $red;\n  //      }\n  //    }\n  //  }\n}\n\n.option {\n  position: relative;\n  cursor: pointer;\n\n  &__input {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    opacity: 0;\n    appearance: none;\n\n    &:checked + .option__txt::after {\n      transform: scale(1);\n    }\n  }\n\n  &__txt {\n    display: inline-flex;\n    align-items: center;\n    cursor: pointer;\n    column-gap: 0.8rem;\n\n    @media (max-width: 48em) {\n      column-gap: 1.6rem;\n    }\n\n    &::before,\n    &::after {\n      content: \"\";\n      border-radius: 50%;\n    }\n\n    &::before {\n      flex: 0 0 2.4rem;\n      width: 2.4rem;\n      height: 2.4rem;\n      border: 1.5px solid $blue;\n\n      @media (max-width: 48em) {\n        flex: 0 0 4.8rem;\n        width: 4.8rem;\n        height: 4.8rem;\n      }\n    }\n\n    &::after {\n      position: absolute;\n      left: 0.4rem;\n      top: 0.4rem;\n      width: 1.6rem;\n      height: 1.6rem;\n      background-color: $blue;\n      transform: scale(0);\n      transition: transform 0.3s ease;\n\n      @media (max-width: 48em) {\n        top: 0.8rem;\n        left: 0.8rem;\n        width: 3.2rem;\n        height: 3.2rem;\n      }\n    }\n  }\n}\n\n.checkbox {\n  position: relative;\n  display: inline-flex;\n\n  &__input {\n    position: absolute;\n    z-index: 2;\n    width: 100%;\n    height: 100%;\n    opacity: 0;\n    appearance: none;\n\n    &:checked + .checkbox__txt {\n      &::before {\n        border: 1px solid $blue;\n      }\n      &::after {\n        transform: scale(1);\n      }\n    }\n  }\n\n  &__txt {\n    position: relative;\n    display: inline-flex;\n    align-items: center;\n    column-gap: 0.8rem;\n    cursor: pointer;\n\n    @media (max-width: 48em) {\n      column-gap: 1.6rem;\n    }\n\n    &::before {\n      content: \"\";\n      flex: 0 0 2.2rem;\n      width: 2.2rem;\n      height: 2.2rem;\n      border: 1px solid $lightBlue;\n      background-color: $white;\n      transition: border 0.3s ease;\n\n      @media (max-width: 48em) {\n        flex: 0 0 4.4rem;\n        width: 4.4rem;\n        height: 4.4rem;\n      }\n    }\n\n    &::after {\n      content: \"\";\n      position: absolute;\n      top: 0.3rem;\n      left: 0.3rem;\n      width: 1.6rem;\n      height: 1.6rem;\n      background-color: $blue;\n      transform: scale(0);\n      transition: transform 0.3s ease;\n\n      @media (max-width: 48em) {\n        left: 0.6rem;\n        top: 0.6rem;\n        width: 3.2rem;\n        height: 3.2rem;\n      }\n    }\n  }\n}\n",".breadcrumbs {\n  display: flex;\n  align-items: center;\n  column-gap: 1.2rem;\n\n  @media (max-width: 48em) {\n    column-gap: 1.6rem;\n    font-size: 3.2rem;\n  }\n\n  &__link {\n    display: flex;\n    align-items: center;\n    column-gap: 1.2rem;\n\n    &::after {\n      content: \"\";\n      width: 2rem;\n      height: 0.2rem;\n      background-color: #808d97;\n    }\n\n    @media (max-width: 48em) {\n      column-gap: 1.6rem;\n\n      &::after {\n        width: 3.2rem;\n        height: 1px;\n      }\n    }\n  }\n\n  &__txt {\n    color: $blue;\n  }\n}\n",".tabs {\n  &__navigation {\n    display: flex;\n    column-gap: 1.5rem;\n  }\n  &__body {\n    padding-top: 1rem;\n  }\n}\n\n.tab {\n  padding: 0 2.8rem;\n  display: inline-flex;\n  align-items: center;\n  height: 10rem;\n  background-color: $gray;\n  transition:\n    background-color 0.3s ease,\n    color 0.3s ease;\n\n  @media (max-width: 48em) {\n    padding: 0 2.4rem;\n    height: 11.2rem;\n  }\n\n  svg {\n    flex: 0 0 2.4rem;\n    width: 2.4rem;\n    height: 2.4rem;\n    transform: translate(0.3rem, -0.3rem);\n    transition: fill 0.3s ease;\n\n    @media (max-width: 48em) {\n      flex: 0 0 3.2rem;\n      width: 3.2rem;\n      height: 3.2rem;\n      transform: translate(0.6rem, -0.6rem);\n    }\n  }\n\n  &__num {\n    margin-right: 0.8rem;\n\n    @media (max-width: 48em) {\n      margin-right: 1.6rem;\n    }\n  }\n\n  &__txt {\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n  }\n\n  &._is-active {\n    background-color: $blue;\n    color: $white;\n\n    svg {\n      fill: $white;\n    }\n  }\n}\n",null],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/group-css-media-queries-loader/lib/index.js!../../node_modules/sass-loader/dist/cjs.js!./style.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/group-css-media-queries-loader/lib/index.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/style.scss");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()((_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default()), options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default()) && (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default().locals) ? (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default().locals) : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/style.scss */ "./src/scss/style.scss");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils.js */ "./src/js/utils/utils.js");
/* harmony import */ var _utils_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/forms */ "./src/js/utils/forms.js");
/* harmony import */ var _utils_tabs_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/tabs.js */ "./src/js/utils/tabs.js");
/* harmony import */ var _utils_modals_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/modals.js */ "./src/js/utils/modals.js");
/* harmony import */ var _dev_vzmsk1_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dev/vzmsk1.js */ "./src/js/dev/vzmsk1.js");
/* harmony import */ var _dev_vzmsk1_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_dev_vzmsk1_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _dev_markusDM_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dev/markusDM.js */ "./src/js/dev/markusDM.js");
/* harmony import */ var _dev_markusDM_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_dev_markusDM_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _dev_ukik0_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dev/ukik0.js */ "./src/js/dev/ukik0.js");
/* harmony import */ var _dev_ukik0_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_dev_ukik0_js__WEBPACK_IMPORTED_MODULE_7__);


// ---------------------------------- utils ---------------------------------



// hamburger menu
_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.menuInit();

// set current year
_utils_utils_js__WEBPACK_IMPORTED_MODULE_1__.setCurrentYear();

// ------------------------------- components -------------------------------

// forms


// tabs


// accordion
// import "./utils/accordion.js";

// select
// import "./utils/select.js";

// modals


// --------------------------------------------------------------------------




})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFPLE1BQU1BLE9BQU8sR0FBRyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNBZTs7QUFFeEM7O0FBRUEsTUFBTUMsVUFBVSxDQUFDO0VBQ2ZDLFdBQVdBLENBQUEsRUFBRztJQUNaLElBQUksQ0FBQ0MsS0FBSyxHQUFHO01BQ1hDLFFBQVEsRUFBRSxlQUFlO01BQ3pCQyxpQkFBaUIsRUFBRSx3QkFBd0I7TUFDM0NDLElBQUksRUFBRSxXQUFXO01BQ2pCQyxHQUFHLEVBQUUsVUFBVTtNQUNmQyxZQUFZLEVBQUUsbUJBQW1CO01BQ2pDQyxnQkFBZ0IsRUFBRSx1QkFBdUI7TUFDekNDLFFBQVEsRUFBRTtJQUNaLENBQUM7SUFDRCxJQUFJLENBQUNDLE9BQU8sR0FBRztNQUNiQyxTQUFTLEVBQUUsWUFBWTtNQUN2QkMsU0FBUyxFQUFFLFlBQVk7TUFDdkJDLFNBQVMsRUFBRSxZQUFZO01BQ3ZCQyxXQUFXLEVBQUU7SUFDZixDQUFDO0VBQ0g7RUFFQUMsU0FBU0EsQ0FBQ0MsSUFBSSxFQUFFO0lBQ2QsSUFBSUMsR0FBRyxHQUFHLENBQUM7SUFDWCxJQUFJQyxjQUFjLEdBQUdGLElBQUksQ0FBQ0csZ0JBQWdCLENBQUUsS0FBSSxJQUFJLENBQUNqQixLQUFLLENBQUNDLFFBQVMsR0FBRSxDQUFDO0lBRXZFLElBQUllLGNBQWMsQ0FBQ0UsTUFBTSxFQUFFO01BQ3pCRixjQUFjLENBQUNHLE9BQU8sQ0FBRUMsYUFBYSxJQUFLO1FBQ3hDLElBQ0UsQ0FBQ0EsYUFBYSxDQUFDQyxZQUFZLEtBQUssSUFBSSxJQUNsQ0QsYUFBYSxDQUFDRSxPQUFPLEtBQUssUUFBUSxLQUNwQyxDQUFDRixhQUFhLENBQUNHLFFBQVEsRUFDdkI7VUFDQVIsR0FBRyxJQUFJLElBQUksQ0FBQ1MsYUFBYSxDQUFDSixhQUFhLENBQUM7UUFDMUM7TUFDRixDQUFDLENBQUM7SUFDSjtJQUNBLE9BQU9MLEdBQUc7RUFDWjtFQUVBVSxRQUFRQSxDQUFDTCxhQUFhLEVBQUU7SUFDdEJBLGFBQWEsQ0FBQ00sU0FBUyxDQUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDbkIsT0FBTyxDQUFDQyxTQUFTLENBQUM7SUFDbkRXLGFBQWEsQ0FBQ1EsYUFBYSxDQUFDRixTQUFTLENBQUNHLE1BQU0sQ0FBQyxJQUFJLENBQUNyQixPQUFPLENBQUNHLFNBQVMsQ0FBQztJQUNwRVMsYUFBYSxDQUFDUSxhQUFhLENBQUNGLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQ25CLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDO0VBQ25FO0VBRUFxQixXQUFXQSxDQUFDVixhQUFhLEVBQUU7SUFDekJBLGFBQWEsQ0FBQ00sU0FBUyxDQUFDRyxNQUFNLENBQUMsSUFBSSxDQUFDckIsT0FBTyxDQUFDQyxTQUFTLENBQUM7SUFDdERXLGFBQWEsQ0FBQ1EsYUFBYSxDQUFDRixTQUFTLENBQUNHLE1BQU0sQ0FBQyxJQUFJLENBQUNyQixPQUFPLENBQUNDLFNBQVMsQ0FBQztFQUN0RTtFQUVBZSxhQUFhQSxDQUFDSixhQUFhLEVBQUU7SUFDM0IsSUFBSUwsR0FBRyxHQUFHLENBQUM7SUFFWCxJQUFJSyxhQUFhLENBQUNXLE9BQU8sQ0FBQ0MsUUFBUSxLQUFLLE9BQU8sRUFBRTtNQUM5Q1osYUFBYSxDQUFDYSxLQUFLLEdBQUdiLGFBQWEsQ0FBQ2EsS0FBSyxDQUFDQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztNQUUxRCxJQUFJLElBQUksQ0FBQ0MsU0FBUyxDQUFDZixhQUFhLENBQUMsRUFBRTtRQUNqQyxJQUFJLENBQUNLLFFBQVEsQ0FBQ0wsYUFBYSxDQUFDO1FBQzVCTCxHQUFHLEVBQUU7TUFDUCxDQUFDLE1BQU07UUFDTCxJQUFJLENBQUNlLFdBQVcsQ0FBQ1YsYUFBYSxDQUFDO01BQ2pDO0lBQ0YsQ0FBQyxNQUFNLElBQUlBLGFBQWEsQ0FBQ2dCLElBQUksS0FBSyxVQUFVLElBQUksQ0FBQ2hCLGFBQWEsQ0FBQ2lCLE9BQU8sRUFBRTtNQUN0RSxJQUFJLENBQUNaLFFBQVEsQ0FBQ0wsYUFBYSxDQUFDO01BQzVCTCxHQUFHLEVBQUU7SUFDUCxDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNLLGFBQWEsQ0FBQ2EsS0FBSyxDQUFDSyxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQy9CLElBQUksQ0FBQ2IsUUFBUSxDQUFDTCxhQUFhLENBQUM7UUFDNUJMLEdBQUcsRUFBRTtNQUNQLENBQUMsTUFBTTtRQUNMLElBQUksQ0FBQ2UsV0FBVyxDQUFDVixhQUFhLENBQUM7TUFDakM7SUFDRjtJQUNBLE9BQU9MLEdBQUc7RUFDWjtFQUVBd0IsV0FBV0EsQ0FBQ3pCLElBQUksRUFBRTtJQUNoQkEsSUFBSSxDQUFDMEIsS0FBSyxDQUFDLENBQUM7SUFFWkMsVUFBVSxDQUFDLE1BQU07TUFDZixNQUFNQyxNQUFNLEdBQUc1QixJQUFJLENBQUNHLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO01BQ3RELE1BQU0wQixVQUFVLEdBQUc3QixJQUFJLENBQUNHLGdCQUFnQixDQUFDLHdCQUF3QixDQUFDO01BRWxFLElBQUl5QixNQUFNLENBQUN4QixNQUFNLEVBQUU7UUFDakIsS0FBSyxJQUFJMEIsS0FBSyxHQUFHLENBQUMsRUFBRUEsS0FBSyxHQUFHRixNQUFNLENBQUN4QixNQUFNLEVBQUUwQixLQUFLLEVBQUUsRUFBRTtVQUNsRCxNQUFNQyxLQUFLLEdBQUdILE1BQU0sQ0FBQ0UsS0FBSyxDQUFDO1VBRTNCQyxLQUFLLENBQUNqQixhQUFhLENBQUNGLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLElBQUksQ0FBQ3JCLE9BQU8sQ0FBQ0UsU0FBUyxDQUFDO1VBQzVEbUMsS0FBSyxDQUFDbkIsU0FBUyxDQUFDRyxNQUFNLENBQUMsSUFBSSxDQUFDckIsT0FBTyxDQUFDRSxTQUFTLENBQUM7VUFDOUMsSUFBSSxDQUFDb0IsV0FBVyxDQUFDZSxLQUFLLENBQUM7UUFDekI7TUFDRjtNQUNBLElBQUlGLFVBQVUsQ0FBQ3pCLE1BQU0sRUFBRTtRQUNyQixLQUFLLElBQUkwQixLQUFLLEdBQUcsQ0FBQyxFQUFFQSxLQUFLLEdBQUdELFVBQVUsQ0FBQ3pCLE1BQU0sRUFBRTBCLEtBQUssRUFBRSxFQUFFO1VBQ3RELE1BQU1FLFFBQVEsR0FBR0gsVUFBVSxDQUFDQyxLQUFLLENBQUM7VUFDbENFLFFBQVEsQ0FBQ1QsT0FBTyxHQUFHLEtBQUs7UUFDMUI7TUFDRjtJQUNGLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDUDtFQUVBRixTQUFTQSxDQUFDZixhQUFhLEVBQUU7SUFDdkIsT0FBTyxDQUFDLCtDQUErQyxDQUFDMkIsSUFBSSxDQUMxRDNCLGFBQWEsQ0FBQ2EsS0FDaEIsQ0FBQztFQUNIO0FBQ0Y7QUFDQSxNQUFNZSxhQUFhLFNBQVNsRCxVQUFVLENBQUM7RUFDckNDLFdBQVdBLENBQUNrRCxjQUFjLEVBQUU7SUFDMUIsS0FBSyxDQUFDLENBQUM7SUFDUCxJQUFJLENBQUNBLGNBQWMsR0FBR0EsY0FBYyxHQUFHQSxjQUFjLEdBQUcsSUFBSTtJQUM1RCxJQUFJLENBQUNDLEtBQUssR0FBR0MsUUFBUSxDQUFDbEMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDO0lBQzlDLElBQUksQ0FBQ21DLElBQUksQ0FBQyxDQUFDO0VBQ2I7RUFFQUMsUUFBUUEsQ0FBQ3ZDLElBQUksRUFBdUI7SUFBQSxJQUFyQndDLGNBQWMsR0FBQUMsU0FBQSxDQUFBckMsTUFBQSxRQUFBcUMsU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBSSxFQUFDO0lBQ2hDSixRQUFRLENBQUNNLGFBQWEsQ0FDcEIsSUFBSUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtNQUMxQkMsTUFBTSxFQUFFO1FBQ043QyxJQUFJLEVBQUVBO01BQ1I7SUFDRixDQUFDLENBQ0gsQ0FBQzs7SUFFRDtJQUNBMkIsVUFBVSxDQUFDLE1BQU07TUFDZixJQUFJNUMsZ0RBQU8sQ0FBQytELEtBQUssRUFBRTtRQUNqQixNQUFNQyxLQUFLLEdBQUcvQyxJQUFJLENBQUNpQixPQUFPLENBQUMrQixZQUFZO1FBQ3ZDRCxLQUFLLEdBQUdoRSxnREFBTyxDQUFDZ0UsS0FBSyxDQUFDRSxJQUFJLENBQUNGLEtBQUssQ0FBQyxHQUFHLElBQUk7TUFDMUM7SUFDRixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRUwsSUFBSSxDQUFDdEIsV0FBVyxDQUFDekIsSUFBSSxDQUFDO0lBRXRCa0QsT0FBTyxDQUFDQyxHQUFHLENBQUMsU0FBUyxDQUFDO0VBQ3hCO0VBRUEsTUFBTUMsZUFBZUEsQ0FBQ3BELElBQUksRUFBRXFELENBQUMsRUFBRTtJQUM3QixNQUFNcEQsR0FBRyxHQUFHLENBQUNELElBQUksQ0FBQ3NELFlBQVksQ0FBQyxJQUFJLENBQUNwRSxLQUFLLENBQUNFLGlCQUFpQixDQUFDLEdBQ3hELElBQUksQ0FBQ1csU0FBUyxDQUFDQyxJQUFJLENBQUMsR0FDcEIsQ0FBQztJQUVMLElBQUlDLEdBQUcsS0FBSyxDQUFDLEVBQUU7TUFDYixNQUFNc0QsSUFBSSxHQUFHdkQsSUFBSSxDQUFDc0QsWUFBWSxDQUFDLElBQUksQ0FBQ3BFLEtBQUssQ0FBQ0csSUFBSSxDQUFDO01BRS9DLElBQUlrRSxJQUFJLEVBQUU7UUFDUkYsQ0FBQyxDQUFDRyxjQUFjLENBQUMsQ0FBQztRQUVsQixNQUFNQyxNQUFNLEdBQUd6RCxJQUFJLENBQUMwRCxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQ3RDMUQsSUFBSSxDQUFDMEQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDbEMsSUFBSSxDQUFDLENBQUMsR0FDbEMsR0FBRztRQUNQLE1BQU1tQyxNQUFNLEdBQUczRCxJQUFJLENBQUMwRCxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQ3RDMUQsSUFBSSxDQUFDMEQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDbEMsSUFBSSxDQUFDLENBQUMsR0FDbEMsS0FBSztRQUNULE1BQU1vQyxJQUFJLEdBQUcsSUFBSUMsUUFBUSxDQUFDN0QsSUFBSSxDQUFDO1FBRS9CQSxJQUFJLENBQUNZLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGFBQWEsQ0FBQztRQUVqQyxNQUFNaUQsUUFBUSxHQUFHLE1BQU1DLEtBQUssQ0FBQ04sTUFBTSxFQUFFO1VBQ25DRSxNQUFNLEVBQUVBLE1BQU07VUFDZEssSUFBSSxFQUFFSjtRQUNSLENBQUMsQ0FBQztRQUVGLElBQUlFLFFBQVEsQ0FBQ0csRUFBRSxFQUFFO1VBQ2YsTUFBTUMsTUFBTSxHQUFHLE1BQU1KLFFBQVEsQ0FBQ0ssSUFBSSxDQUFDLENBQUM7VUFDcENuRSxJQUFJLENBQUNZLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLGFBQWEsQ0FBQztVQUNwQyxJQUFJLENBQUN3QixRQUFRLENBQUN2QyxJQUFJLEVBQUVrRSxNQUFNLENBQUM7UUFDN0IsQ0FBQyxNQUFNO1VBQ0xFLEtBQUssQ0FBQyxPQUFPLENBQUM7VUFDZHBFLElBQUksQ0FBQ1ksU0FBUyxDQUFDRyxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3RDO01BQ0YsQ0FBQyxNQUFNLElBQUlmLElBQUksQ0FBQ3NELFlBQVksQ0FBQyxJQUFJLENBQUNwRSxLQUFLLENBQUNJLEdBQUcsQ0FBQyxFQUFFO1FBQzVDO1FBQ0ErRCxDQUFDLENBQUNHLGNBQWMsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQ2pCLFFBQVEsQ0FBQ3ZDLElBQUksQ0FBQztNQUNyQjtJQUNGLENBQUMsTUFBTTtNQUNMcUQsQ0FBQyxDQUFDRyxjQUFjLENBQUMsQ0FBQztJQUNwQjtFQUNGO0VBRUFsQixJQUFJQSxDQUFBLEVBQUc7SUFDTCxNQUFNK0IsS0FBSyxHQUFHLElBQUk7SUFDbEIsTUFBTUMsY0FBYyxHQUFHakMsUUFBUSxDQUFDbEMsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUM7SUFFMUUsSUFBSSxJQUFJLENBQUNpQyxLQUFLLENBQUNoQyxNQUFNLEVBQUU7TUFDckIsSUFBSSxDQUFDZ0MsS0FBSyxDQUFDL0IsT0FBTyxDQUFFTCxJQUFJLElBQUs7UUFDM0JBLElBQUksQ0FBQ3VFLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxVQUFVbEIsQ0FBQyxFQUFFO1VBQzNDZ0IsS0FBSyxDQUFDakIsZUFBZSxDQUFDQyxDQUFDLENBQUNtQixNQUFNLEVBQUVuQixDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDO1FBQ0ZyRCxJQUFJLENBQUN1RSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVWxCLENBQUMsRUFBRTtVQUMxQ2dCLEtBQUssQ0FBQzVDLFdBQVcsQ0FBQzRCLENBQUMsQ0FBQ21CLE1BQU0sQ0FBQztRQUM3QixDQUFDLENBQUM7TUFDSixDQUFDLENBQUM7SUFDSjtJQUVBLElBQUlGLGNBQWMsQ0FBQ2xFLE1BQU0sRUFBRTtNQUN6QmtFLGNBQWMsQ0FBQ2pFLE9BQU8sQ0FBRW9FLEtBQUssSUFBSztRQUNoQyxNQUFNQyxHQUFHLEdBQUdELEtBQUssQ0FBQ0Usa0JBQWtCO1FBRXBDLElBQUlELEdBQUcsRUFBRTtVQUNQQSxHQUFHLENBQUNILGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZO1lBQ3hDLE1BQU1qRCxJQUFJLEdBQUdtRCxLQUFLLENBQUMzRCxhQUFhLENBQUNGLFNBQVMsQ0FBQ2dFLFFBQVEsQ0FDakRQLEtBQUssQ0FBQzNFLE9BQU8sQ0FBQ0ksV0FDaEIsQ0FBQyxHQUNHLFVBQVUsR0FDVixNQUFNO1lBQ1YyRSxLQUFLLENBQUNJLFlBQVksQ0FBQyxNQUFNLEVBQUV2RCxJQUFJLENBQUM7WUFDaENtRCxLQUFLLENBQUMzRCxhQUFhLENBQUNGLFNBQVMsQ0FBQ2tFLE1BQU0sQ0FBQ1QsS0FBSyxDQUFDM0UsT0FBTyxDQUFDSSxXQUFXLENBQUM7VUFDakUsQ0FBQyxDQUFDO1FBQ0o7TUFDRixDQUFDLENBQUM7SUFDSjtFQUNGO0FBQ0Y7QUFDQSxNQUFNaUYsVUFBVSxTQUFTL0YsVUFBVSxDQUFDO0VBQ2xDQyxXQUFXQSxDQUFBLEVBQUc7SUFDWixLQUFLLENBQUMsQ0FBQztJQUNQLElBQUksQ0FBQytGLE1BQU0sR0FBRzNDLFFBQVEsQ0FBQ2xDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO0lBQ3pELElBQUksQ0FBQ21DLElBQUksQ0FBQyxDQUFDO0VBQ2I7RUFFQTJDLGVBQWVBLENBQUEsRUFBRztJQUNoQixJQUFJLElBQUksQ0FBQ0QsTUFBTSxDQUFDNUUsTUFBTSxFQUFFO01BQ3RCLElBQUksQ0FBQzRFLE1BQU0sQ0FBQzNFLE9BQU8sQ0FBRW9FLEtBQUssSUFBSztRQUM3QixJQUFJLENBQUNBLEtBQUssQ0FBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUNwRSxLQUFLLENBQUNNLGdCQUFnQixDQUFDLEVBQUU7VUFDcERpRixLQUFLLENBQUN4RCxPQUFPLENBQUNpRSxXQUFXLEdBQUdULEtBQUssQ0FBQ1MsV0FBVztRQUMvQztNQUNGLENBQUMsQ0FBQztJQUNKO0VBQ0Y7RUFFQUMsYUFBYUEsQ0FBQzlCLENBQUMsRUFBRTtJQUNmLE1BQU1tQixNQUFNLEdBQUduQixDQUFDLENBQUNtQixNQUFNO0lBRXZCLElBQUlBLE1BQU0sQ0FBQ2hFLE9BQU8sS0FBSyxPQUFPLElBQUlnRSxNQUFNLENBQUNoRSxPQUFPLEtBQUssVUFBVSxFQUFFO01BQy9ELElBQUlnRSxNQUFNLENBQUN2RCxPQUFPLENBQUNpRSxXQUFXLEVBQUVWLE1BQU0sQ0FBQ1UsV0FBVyxHQUFHLEVBQUU7TUFFdkQsSUFBSSxDQUFDVixNQUFNLENBQUNsQixZQUFZLENBQUMsSUFBSSxDQUFDcEUsS0FBSyxDQUFDSyxZQUFZLENBQUMsRUFBRTtRQUNqRGlGLE1BQU0sQ0FBQzVELFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQ25CLE9BQU8sQ0FBQ0UsU0FBUyxDQUFDO1FBQzVDNEUsTUFBTSxDQUFDMUQsYUFBYSxDQUFDRixTQUFTLENBQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUNuQixPQUFPLENBQUNFLFNBQVMsQ0FBQztRQUMxRDRFLE1BQU0sQ0FBQzVELFNBQVMsQ0FBQ0csTUFBTSxDQUFDLElBQUksQ0FBQ3JCLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDO1FBQy9DNkUsTUFBTSxDQUFDMUQsYUFBYSxDQUFDRixTQUFTLENBQUNHLE1BQU0sQ0FBQyxJQUFJLENBQUNyQixPQUFPLENBQUNDLFNBQVMsQ0FBQztNQUMvRDtNQUVBLElBQ0U2RSxNQUFNLENBQUNsRCxJQUFJLEtBQUssTUFBTSxJQUN0QmtELE1BQU0sQ0FBQ2xELElBQUksS0FBSyxVQUFVLElBQzFCa0QsTUFBTSxDQUFDbEQsSUFBSSxLQUFLLE9BQU8sSUFDdkIsQ0FBQ2tELE1BQU0sQ0FBQ1ksT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUM1QjtRQUNBWixNQUFNLENBQUNZLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQ3hFLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLElBQUksQ0FBQ3JCLE9BQU8sQ0FBQ0csU0FBUyxDQUFDO01BQ25FO01BQ0EsSUFBSSxDQUFDbUIsV0FBVyxDQUFDd0QsTUFBTSxDQUFDO0lBQzFCO0VBQ0Y7RUFFQWEsY0FBY0EsQ0FBQ2hDLENBQUMsRUFBRTtJQUNoQixNQUFNbUIsTUFBTSxHQUFHbkIsQ0FBQyxDQUFDbUIsTUFBTTtJQUN2QixJQUFJQSxNQUFNLENBQUNoRSxPQUFPLEtBQUssT0FBTyxJQUFJZ0UsTUFBTSxDQUFDaEUsT0FBTyxLQUFLLFVBQVUsRUFBRTtNQUMvRCxJQUFJZ0UsTUFBTSxDQUFDdkQsT0FBTyxDQUFDaUUsV0FBVyxFQUFFO1FBQzlCVixNQUFNLENBQUNVLFdBQVcsR0FBR1YsTUFBTSxDQUFDdkQsT0FBTyxDQUFDaUUsV0FBVztNQUNqRDtNQUVBLElBQUksQ0FBQ1YsTUFBTSxDQUFDbEIsWUFBWSxDQUFDLElBQUksQ0FBQ3BFLEtBQUssQ0FBQ0ssWUFBWSxDQUFDLEVBQUU7UUFDakRpRixNQUFNLENBQUM1RCxTQUFTLENBQUNHLE1BQU0sQ0FBQyxJQUFJLENBQUNyQixPQUFPLENBQUNFLFNBQVMsQ0FBQztRQUMvQzRFLE1BQU0sQ0FBQzFELGFBQWEsQ0FBQ0YsU0FBUyxDQUFDRyxNQUFNLENBQUMsSUFBSSxDQUFDckIsT0FBTyxDQUFDRSxTQUFTLENBQUM7TUFDL0Q7TUFDQSxJQUFJNEUsTUFBTSxDQUFDbEIsWUFBWSxDQUFDLElBQUksQ0FBQ3BFLEtBQUssQ0FBQ08sUUFBUSxDQUFDLEVBQUU7UUFDNUMsSUFBSSxDQUFDaUIsYUFBYSxDQUFDOEQsTUFBTSxDQUFDO01BQzVCO01BRUEsSUFDRUEsTUFBTSxDQUFDbEQsSUFBSSxLQUFLLE1BQU0sSUFDdEJrRCxNQUFNLENBQUNsRCxJQUFJLEtBQUssVUFBVSxJQUMxQmtELE1BQU0sQ0FBQ2xELElBQUksS0FBSyxPQUFPLElBQ3ZCLENBQUNrRCxNQUFNLENBQUNZLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFDNUI7UUFDQSxJQUNFLENBQUNaLE1BQU0sQ0FBQzVELFNBQVMsQ0FBQ2dFLFFBQVEsQ0FBQyxJQUFJLENBQUNsRixPQUFPLENBQUNDLFNBQVMsQ0FBQyxJQUNsRDZFLE1BQU0sQ0FBQ3JELEtBQUssQ0FBQ0ssSUFBSSxDQUFDLENBQUMsRUFDbkI7VUFDQWdELE1BQU0sQ0FBQ1ksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDeEUsU0FBUyxDQUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDbkIsT0FBTyxDQUFDRyxTQUFTLENBQUM7UUFDaEUsQ0FBQyxNQUFNO1VBQ0wyRSxNQUFNLENBQUNZLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQ3hFLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLElBQUksQ0FBQ3JCLE9BQU8sQ0FBQ0csU0FBUyxDQUFDO1FBQ25FO01BQ0Y7SUFDRjtFQUNGO0VBRUF5QyxJQUFJQSxDQUFBLEVBQUc7SUFDTDtJQUNBLElBQUksQ0FBQzJDLGVBQWUsQ0FBQyxDQUFDOztJQUV0QjtJQUNBLElBQUkvQyxhQUFhLENBQUMsQ0FBQzs7SUFFbkI7SUFDQUcsUUFBUSxDQUFDMkIsSUFBSSxDQUFDTyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDWSxhQUFhLENBQUNHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4RWpELFFBQVEsQ0FBQzJCLElBQUksQ0FBQ08sZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQ2MsY0FBYyxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDNUU7QUFDRjs7QUFFQTs7QUFFQSxJQUFJUCxVQUFVLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNuVHdCO0FBQ2lDOztBQUV6RTs7QUFFQSxNQUFNVyxLQUFLLENBQUM7RUFDVnpHLFdBQVdBLENBQUMwRyxPQUFPLEVBQUU7SUFDbkIsSUFBSUMsTUFBTSxHQUFHO01BQ1hDLE9BQU8sRUFBRSxJQUFJO01BQ2J2RCxJQUFJLEVBQUUsSUFBSTtNQUNWd0QsbUJBQW1CLEVBQUUsWUFBWTtNQUNqQ0Msb0JBQW9CLEVBQUUsWUFBWTtNQUNsQ0Msa0JBQWtCLEVBQUUsV0FBVztNQUMvQkMsZ0JBQWdCLEVBQUUsb0JBQW9CO01BQ3RDQyxxQkFBcUIsRUFBRSwwQkFBMEI7TUFDakRDLGtCQUFrQixFQUFFLElBQUk7TUFDeEJ6RyxPQUFPLEVBQUU7UUFDUHFELEtBQUssRUFBRSxPQUFPO1FBQ2Q7UUFDQXFELFlBQVksRUFBRSxnQkFBZ0I7UUFDOUJDLFdBQVcsRUFBRSxZQUFZO1FBQ3pCQyxVQUFVLEVBQUU7TUFDZCxDQUFDO01BQ0RDLFVBQVUsRUFBRSxJQUFJO01BQ2hCQyxRQUFRLEVBQUUsSUFBSTtNQUNkaEIsUUFBUSxFQUFFLElBQUk7TUFDZGlCLFlBQVksRUFBRTtRQUNaQyxRQUFRLEVBQUUsSUFBSTtRQUNkQyxNQUFNLEVBQUU7TUFDVixDQUFDO01BQ0RDLEVBQUUsRUFBRTtRQUNGQyxVQUFVLEVBQUUsU0FBQUEsQ0FBQSxFQUFZLENBQUMsQ0FBQztRQUMxQkMsU0FBUyxFQUFFLFNBQUFBLENBQUEsRUFBWSxDQUFDLENBQUM7UUFDekJDLFdBQVcsRUFBRSxTQUFBQSxDQUFBLEVBQVksQ0FBQyxDQUFDO1FBQzNCQyxVQUFVLEVBQUUsU0FBQUEsQ0FBQSxFQUFZLENBQUM7TUFDM0I7SUFDRixDQUFDO0lBQ0QsSUFBSSxDQUFDQyxXQUFXO0lBQ2hCLElBQUksQ0FBQ0MsTUFBTSxHQUFHLEtBQUs7SUFDbkIsSUFBSSxDQUFDQyxVQUFVLEdBQUc7TUFDaEJDLFFBQVEsRUFBRSxLQUFLO01BQ2ZDLE9BQU8sRUFBRTtJQUNYLENBQUM7SUFDRCxJQUFJLENBQUNDLFlBQVksR0FBRztNQUNsQkYsUUFBUSxFQUFFLEtBQUs7TUFDZkMsT0FBTyxFQUFFO0lBQ1gsQ0FBQztJQUNELElBQUksQ0FBQ0UsVUFBVSxHQUFHO01BQ2hCSCxRQUFRLEVBQUUsS0FBSztNQUNmQyxPQUFPLEVBQUU7SUFDWCxDQUFDO0lBQ0QsSUFBSSxDQUFDRyxVQUFVLEdBQUcsS0FBSztJQUN2QixJQUFJLENBQUNDLElBQUksR0FBRyxLQUFLO0lBRWpCLElBQUksQ0FBQ0MsT0FBTyxHQUFHLEtBQUs7SUFDcEIsSUFBSSxDQUFDQyxhQUFhLEdBQUcsS0FBSztJQUUxQixJQUFJLENBQUNDLFdBQVcsR0FBRyxLQUFLO0lBQ3hCLElBQUksQ0FBQ0MsUUFBUSxHQUFHLENBQ2QsU0FBUyxFQUNULCtEQUErRCxFQUMvRCwyQ0FBMkMsRUFDM0MsMkNBQTJDLEVBQzNDLDZDQUE2QyxFQUM3QyxZQUFZLEVBQ1osUUFBUSxFQUNSLFFBQVEsRUFDUixPQUFPLEVBQ1AsbUJBQW1CLEVBQ25CLGlDQUFpQyxDQUNsQztJQUNEO0lBQ0EsSUFBSSxDQUFDbEMsT0FBTyxHQUFHO01BQ2IsR0FBR0MsTUFBTTtNQUNULEdBQUdELE9BQU87TUFDVmpHLE9BQU8sRUFBRTtRQUNQLEdBQUdrRyxNQUFNLENBQUNsRyxPQUFPO1FBQ2pCLEdBQUdpRyxPQUFPLEVBQUVqRztNQUNkLENBQUM7TUFDRCtHLFlBQVksRUFBRTtRQUNaLEdBQUdiLE1BQU0sQ0FBQ2EsWUFBWTtRQUN0QixHQUFHZCxPQUFPLEVBQUVjO01BQ2QsQ0FBQztNQUNERyxFQUFFLEVBQUU7UUFDRixHQUFHaEIsTUFBTSxDQUFDZ0IsRUFBRTtRQUNaLEdBQUdqQixPQUFPLEVBQUVpQjtNQUNkO0lBQ0YsQ0FBQztJQUNELElBQUksQ0FBQ3BCLFFBQVEsR0FBRyxLQUFLO0lBQ3JCLElBQUksQ0FBQ0csT0FBTyxDQUFDckQsSUFBSSxHQUFHLElBQUksQ0FBQ3dGLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSTtFQUM5QztFQUNBQSxVQUFVQSxDQUFBLEVBQUc7SUFDWCxJQUFJLENBQUNDLFdBQVcsQ0FBQyxDQUFDO0VBQ3BCO0VBQ0FBLFdBQVdBLENBQUEsRUFBRztJQUNaMUYsUUFBUSxDQUFDa0MsZ0JBQWdCLENBQ3ZCLE9BQU8sRUFDUCxVQUFVbEIsQ0FBQyxFQUFFO01BQ1gsTUFBTTJFLFVBQVUsR0FBRzNFLENBQUMsQ0FBQ21CLE1BQU0sQ0FBQ1ksT0FBTyxDQUNoQyxJQUFHLElBQUksQ0FBQ08sT0FBTyxDQUFDRyxtQkFBb0IsR0FDdkMsQ0FBQztNQUNELElBQUlrQyxVQUFVLEVBQUU7UUFDZDNFLENBQUMsQ0FBQ0csY0FBYyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDZ0UsVUFBVSxHQUFHUSxVQUFVLENBQUN0RSxZQUFZLENBQ3ZDLElBQUksQ0FBQ2lDLE9BQU8sQ0FBQ0csbUJBQ2YsQ0FBQyxHQUNHa0MsVUFBVSxDQUFDdEUsWUFBWSxDQUFDLElBQUksQ0FBQ2lDLE9BQU8sQ0FBQ0csbUJBQW1CLENBQUMsR0FDekQsT0FBTztRQUNYLElBQUksQ0FBQ21CLFdBQVcsR0FBR2UsVUFBVSxDQUFDdEUsWUFBWSxDQUN4QyxJQUFJLENBQUNpQyxPQUFPLENBQUNNLGdCQUNmLENBQUMsR0FDRytCLFVBQVUsQ0FBQ3RFLFlBQVksQ0FBQyxJQUFJLENBQUNpQyxPQUFPLENBQUNNLGdCQUFnQixDQUFDLEdBQ3RELElBQUk7UUFDUixJQUFJLElBQUksQ0FBQ3VCLFVBQVUsS0FBSyxPQUFPLEVBQUU7VUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQ04sTUFBTSxFQUFFLElBQUksQ0FBQ1UsV0FBVyxHQUFHSSxVQUFVO1VBQy9DLElBQUksQ0FBQ2IsVUFBVSxDQUFDQyxRQUFRLEdBQUksR0FBRSxJQUFJLENBQUNJLFVBQVcsRUFBQztVQUMvQyxJQUFJLENBQUNHLGFBQWEsR0FBRyxJQUFJO1VBQ3pCLElBQUksQ0FBQzFFLElBQUksQ0FBQyxDQUFDO1VBQ1g7UUFDRjtRQUVBO01BQ0Y7TUFDQSxNQUFNZ0YsV0FBVyxHQUFHNUUsQ0FBQyxDQUFDbUIsTUFBTSxDQUFDWSxPQUFPLENBQ2pDLElBQUcsSUFBSSxDQUFDTyxPQUFPLENBQUNJLG9CQUFxQixHQUN4QyxDQUFDO01BQ0QsSUFDRSxDQUFDMUMsQ0FBQyxDQUFDbUIsTUFBTSxDQUFDWSxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFDekMsQ0FBQy9CLENBQUMsQ0FBQ21CLE1BQU0sQ0FBQ1ksT0FBTyxDQUFDLGtCQUFrQixDQUFDLEtBQ3BDNkMsV0FBVyxJQUNULENBQUM1RSxDQUFDLENBQUNtQixNQUFNLENBQUNZLE9BQU8sQ0FBRSxJQUFHLElBQUksQ0FBQ08sT0FBTyxDQUFDakcsT0FBTyxDQUFDMEcsWUFBYSxFQUFDLENBQUMsSUFDekQsSUFBSSxDQUFDYyxNQUFPLENBQUMsRUFDakI7UUFDQTdELENBQUMsQ0FBQ0csY0FBYyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDMEUsS0FBSyxDQUFDLENBQUM7UUFDWjtNQUNGO0lBQ0YsQ0FBQyxDQUFDNUMsSUFBSSxDQUFDLElBQUksQ0FDYixDQUFDO0lBQ0RqRCxRQUFRLENBQUNrQyxnQkFBZ0IsQ0FDdkIsU0FBUyxFQUNULFVBQVVsQixDQUFDLEVBQUU7TUFDWCxJQUNFLElBQUksQ0FBQ3NDLE9BQU8sQ0FBQ2EsUUFBUSxJQUNyQm5ELENBQUMsQ0FBQzhFLEtBQUssSUFBSSxFQUFFLElBQ2I5RSxDQUFDLENBQUMrRSxJQUFJLEtBQUssUUFBUSxJQUNuQixJQUFJLENBQUNsQixNQUFNLEVBQ1g7UUFDQTdELENBQUMsQ0FBQ0csY0FBYyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDMEUsS0FBSyxDQUFDLENBQUM7UUFDWjtNQUNGO01BQ0EsSUFBSSxJQUFJLENBQUN2QyxPQUFPLENBQUNZLFVBQVUsSUFBSWxELENBQUMsQ0FBQzhFLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDakIsTUFBTSxFQUFFO1FBQzFELElBQUksQ0FBQ21CLFdBQVcsQ0FBQ2hGLENBQUMsQ0FBQztRQUNuQjtNQUNGO0lBQ0YsQ0FBQyxDQUFDaUMsSUFBSSxDQUFDLElBQUksQ0FDYixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUNLLE9BQU8sQ0FBQ2MsWUFBWSxDQUFDRSxNQUFNLEVBQUU7TUFDcEMyQixNQUFNLENBQUMvRCxnQkFBZ0IsQ0FDckIsWUFBWSxFQUNaLFlBQVk7UUFDVixJQUFJK0QsTUFBTSxDQUFDNUIsUUFBUSxDQUFDZSxJQUFJLEVBQUU7VUFDeEIsSUFBSSxDQUFDYyxXQUFXLENBQUMsQ0FBQztRQUNwQixDQUFDLE1BQU07VUFDTCxJQUFJLENBQUNMLEtBQUssQ0FBQyxJQUFJLENBQUNmLFVBQVUsQ0FBQ0MsUUFBUSxDQUFDO1FBQ3RDO01BQ0YsQ0FBQyxDQUFDOUIsSUFBSSxDQUFDLElBQUksQ0FDYixDQUFDO01BRURnRCxNQUFNLENBQUMvRCxnQkFBZ0IsQ0FDckIsTUFBTSxFQUNOLFlBQVk7UUFDVixJQUFJK0QsTUFBTSxDQUFDNUIsUUFBUSxDQUFDZSxJQUFJLEVBQUU7VUFDeEIsSUFBSSxDQUFDYyxXQUFXLENBQUMsQ0FBQztRQUNwQjtNQUNGLENBQUMsQ0FBQ2pELElBQUksQ0FBQyxJQUFJLENBQ2IsQ0FBQztJQUNIO0VBQ0Y7RUFDQXJDLElBQUlBLENBQUN1RixhQUFhLEVBQUU7SUFDbEIsSUFBSWpELDJEQUFjLEVBQUU7TUFDbEIsSUFBSSxDQUFDQyxRQUFRLEdBQ1huRCxRQUFRLENBQUNvRyxlQUFlLENBQUM3SCxTQUFTLENBQUNnRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUNzQyxNQUFNLEdBQy9ELElBQUksR0FDSixLQUFLO01BRVgsSUFDRXNCLGFBQWEsSUFDYixPQUFPQSxhQUFhLEtBQUssUUFBUSxJQUNqQ0EsYUFBYSxDQUFDaEgsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQzNCO1FBQ0EsSUFBSSxDQUFDMkYsVUFBVSxDQUFDQyxRQUFRLEdBQUdvQixhQUFhO1FBQ3hDLElBQUksQ0FBQ2IsYUFBYSxHQUFHLElBQUk7TUFDM0I7TUFDQSxJQUFJLElBQUksQ0FBQ1QsTUFBTSxFQUFFO1FBQ2YsSUFBSSxDQUFDUSxPQUFPLEdBQUcsSUFBSTtRQUNuQixJQUFJLENBQUNRLEtBQUssQ0FBQyxDQUFDO01BQ2Q7TUFDQSxJQUFJLENBQUMsSUFBSSxDQUFDUCxhQUFhLEVBQ3JCLElBQUksQ0FBQ1IsVUFBVSxDQUFDQyxRQUFRLEdBQUcsSUFBSSxDQUFDRyxVQUFVLENBQUNILFFBQVE7TUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQ00sT0FBTyxFQUFFLElBQUksQ0FBQ2dCLHFCQUFxQixHQUFHckcsUUFBUSxDQUFDc0csYUFBYTtNQUV0RSxJQUFJLENBQUN4QixVQUFVLENBQUNFLE9BQU8sR0FBR2hGLFFBQVEsQ0FBQ3VHLGFBQWEsQ0FDOUMsSUFBSSxDQUFDekIsVUFBVSxDQUFDQyxRQUNsQixDQUFDO01BRUQsSUFBSSxJQUFJLENBQUNELFVBQVUsQ0FBQ0UsT0FBTyxFQUFFO1FBQzNCLElBQUksSUFBSSxDQUFDSixXQUFXLEVBQUU7VUFDcEIsTUFBTTRCLFNBQVMsR0FBRyxJQUFJLENBQUM1QixXQUFXO1VBQ2xDLE1BQU02QixRQUFRLEdBQUksaUNBQWdDRCxTQUFVLDhCQUE2QjtVQUN6RixNQUFNRSxNQUFNLEdBQUcxRyxRQUFRLENBQUMyRyxhQUFhLENBQUMsUUFBUSxDQUFDO1VBQy9DRCxNQUFNLENBQUNsRSxZQUFZLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDO1VBRTFDLE1BQU1vRSxRQUFRLEdBQUcsSUFBSSxDQUFDdEQsT0FBTyxDQUFDUSxrQkFBa0IsR0FBRyxXQUFXLEdBQUcsRUFBRTtVQUNuRTRDLE1BQU0sQ0FBQ2xFLFlBQVksQ0FBQyxPQUFPLEVBQUcsR0FBRW9FLFFBQVMsbUJBQWtCLENBQUM7VUFFNURGLE1BQU0sQ0FBQ2xFLFlBQVksQ0FBQyxLQUFLLEVBQUVpRSxRQUFRLENBQUM7VUFFcEMsSUFDRSxDQUFDLElBQUksQ0FBQzNCLFVBQVUsQ0FBQ0UsT0FBTyxDQUFDdUIsYUFBYSxDQUNuQyxJQUFHLElBQUksQ0FBQ2pELE9BQU8sQ0FBQ08scUJBQXNCLEdBQ3pDLENBQUMsRUFDRDtZQUNBLE1BQU1nRCxZQUFZLEdBQUcsSUFBSSxDQUFDL0IsVUFBVSxDQUFDRSxPQUFPLENBQ3pDdUIsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUM3Qi9ELFlBQVksQ0FBRSxHQUFFLElBQUksQ0FBQ2MsT0FBTyxDQUFDTyxxQkFBc0IsRUFBQyxFQUFFLEVBQUUsQ0FBQztVQUM5RDtVQUNBLElBQUksQ0FBQ2lCLFVBQVUsQ0FBQ0UsT0FBTyxDQUNwQnVCLGFBQWEsQ0FBRSxJQUFHLElBQUksQ0FBQ2pELE9BQU8sQ0FBQ08scUJBQXNCLEdBQUUsQ0FBQyxDQUN4RGlELFdBQVcsQ0FBQ0osTUFBTSxDQUFDO1FBQ3hCO1FBQ0EsSUFBSSxJQUFJLENBQUNwRCxPQUFPLENBQUNjLFlBQVksQ0FBQ0MsUUFBUSxFQUFFO1VBQ3RDLElBQUksQ0FBQzBDLFFBQVEsQ0FBQyxDQUFDO1VBQ2YsSUFBSSxDQUFDQyxRQUFRLENBQUMsQ0FBQztRQUNqQjtRQUVBLElBQUksQ0FBQzFELE9BQU8sQ0FBQ2lCLEVBQUUsQ0FBQ0MsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNoQ3hFLFFBQVEsQ0FBQ00sYUFBYSxDQUNwQixJQUFJQyxXQUFXLENBQUMsaUJBQWlCLEVBQUU7VUFDakNDLE1BQU0sRUFBRTtZQUNORSxLQUFLLEVBQUU7VUFDVDtRQUNGLENBQUMsQ0FDSCxDQUFDO1FBRUQsSUFBSSxDQUFDb0UsVUFBVSxDQUFDRSxPQUFPLENBQUN6RyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUM4RSxPQUFPLENBQUNqRyxPQUFPLENBQUMyRyxXQUFXLENBQUM7UUFDdkVoRSxRQUFRLENBQUNvRyxlQUFlLENBQUM3SCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUM4RSxPQUFPLENBQUNqRyxPQUFPLENBQUM0RyxVQUFVLENBQUM7UUFFdkUsSUFBSSxDQUFDLElBQUksQ0FBQ29CLE9BQU8sRUFBRTtVQUNqQixNQUFNNEIsQ0FBQyxHQUFHakgsUUFBUSxDQUFDdUcsYUFBYSxDQUFDLElBQUksQ0FBQ25CLElBQUksQ0FBQztVQUMzQzlGLFVBQVUsQ0FBQyxNQUFNO1lBQ2QsQ0FBQyxJQUFJLENBQUM2RCxRQUFRLElBQUksQ0FBQzhELENBQUMsQ0FBQ2hHLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUNuRCxDQUFDLElBQUksQ0FBQ2tDLFFBQVEsSUFDYjhDLE1BQU0sQ0FBQ2lCLFVBQVUsSUFBSSxHQUFHLElBQ3hCRCxDQUFDLENBQUNoRyxZQUFZLENBQUMsZ0JBQWdCLENBQUUsR0FDL0JrQyx5REFBUSxDQUFDLENBQUMsR0FDVixJQUFJO1VBQ1YsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNQLENBQUMsTUFBTSxJQUFJLENBQUNrQyxPQUFPLEdBQUcsS0FBSztRQUUzQixJQUFJLENBQUNQLFVBQVUsQ0FBQ0UsT0FBTyxDQUFDeEMsWUFBWSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUM7UUFFNUQsSUFBSSxDQUFDeUMsWUFBWSxDQUFDRixRQUFRLEdBQUcsSUFBSSxDQUFDRCxVQUFVLENBQUNDLFFBQVE7UUFDckQsSUFBSSxDQUFDRSxZQUFZLENBQUNELE9BQU8sR0FBRyxJQUFJLENBQUNGLFVBQVUsQ0FBQ0UsT0FBTztRQUVuRCxJQUFJLENBQUNNLGFBQWEsR0FBRyxLQUFLO1FBRTFCLElBQUksQ0FBQ1QsTUFBTSxHQUFHLElBQUk7UUFFbEJ2RixVQUFVLENBQUMsTUFBTTtVQUNmLElBQUksQ0FBQzZILFVBQVUsQ0FBQyxDQUFDO1FBQ25CLENBQUMsRUFBRSxFQUFFLENBQUM7UUFFTixJQUFJLENBQUM3RCxPQUFPLENBQUNpQixFQUFFLENBQUNFLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDL0J6RSxRQUFRLENBQUNNLGFBQWEsQ0FDcEIsSUFBSUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFO1VBQ2hDQyxNQUFNLEVBQUU7WUFDTkUsS0FBSyxFQUFFO1VBQ1Q7UUFDRixDQUFDLENBQ0gsQ0FBQztNQUNIO0lBQ0Y7RUFDRjtFQUNBbUYsS0FBS0EsQ0FBQ00sYUFBYSxFQUFFO0lBQ25CLElBQ0VBLGFBQWEsSUFDYixPQUFPQSxhQUFhLEtBQUssUUFBUSxJQUNqQ0EsYUFBYSxDQUFDaEgsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQzNCO01BQ0EsSUFBSSxDQUFDOEYsWUFBWSxDQUFDRixRQUFRLEdBQUdvQixhQUFhO0lBQzVDO0lBQ0EsSUFBSSxDQUFDLElBQUksQ0FBQ3RCLE1BQU0sSUFBSSxDQUFDM0IsMkRBQWMsRUFBRTtNQUNuQztJQUNGO0lBQ0EsSUFBSSxDQUFDSSxPQUFPLENBQUNpQixFQUFFLENBQUNHLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDakMxRSxRQUFRLENBQUNNLGFBQWEsQ0FDcEIsSUFBSUMsV0FBVyxDQUFDLGtCQUFrQixFQUFFO01BQ2xDQyxNQUFNLEVBQUU7UUFDTkUsS0FBSyxFQUFFO01BQ1Q7SUFDRixDQUFDLENBQ0gsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDa0UsV0FBVyxFQUFFO01BQ3BCLElBQ0UsSUFBSSxDQUFDRSxVQUFVLENBQUNFLE9BQU8sQ0FBQ3VCLGFBQWEsQ0FDbEMsSUFBRyxJQUFJLENBQUNqRCxPQUFPLENBQUNPLHFCQUFzQixHQUN6QyxDQUFDLEVBRUQsSUFBSSxDQUFDaUIsVUFBVSxDQUFDRSxPQUFPLENBQUN1QixhQUFhLENBQ2xDLElBQUcsSUFBSSxDQUFDakQsT0FBTyxDQUFDTyxxQkFBc0IsR0FDekMsQ0FBQyxDQUFDdUQsU0FBUyxHQUFHLEVBQUU7SUFDcEI7SUFDQSxJQUFJLENBQUNuQyxZQUFZLENBQUNELE9BQU8sQ0FBQ3pHLFNBQVMsQ0FBQ0csTUFBTSxDQUN4QyxJQUFJLENBQUM0RSxPQUFPLENBQUNqRyxPQUFPLENBQUMyRyxXQUN2QixDQUFDO0lBQ0Q7SUFDQSxJQUFJLENBQUNpQixZQUFZLENBQUNELE9BQU8sQ0FBQ3hDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO0lBQzdELElBQUksQ0FBQyxJQUFJLENBQUM2QyxPQUFPLEVBQUU7TUFDakJyRixRQUFRLENBQUNvRyxlQUFlLENBQUM3SCxTQUFTLENBQUNHLE1BQU0sQ0FDdkMsSUFBSSxDQUFDNEUsT0FBTyxDQUFDakcsT0FBTyxDQUFDNEcsVUFDdkIsQ0FBQztNQUNELENBQUMsSUFBSSxDQUFDZCxRQUFRLEdBQUdDLDJEQUFVLENBQUMsQ0FBQyxHQUFHLElBQUk7TUFDcEMsSUFBSSxDQUFDeUIsTUFBTSxHQUFHLEtBQUs7SUFDckI7SUFDQSxJQUFJLENBQUN3QyxXQUFXLENBQUMsQ0FBQztJQUNsQixJQUFJLElBQUksQ0FBQy9CLGFBQWEsRUFBRTtNQUN0QixJQUFJLENBQUNKLFVBQVUsQ0FBQ0gsUUFBUSxHQUFHLElBQUksQ0FBQ0UsWUFBWSxDQUFDRixRQUFRO01BQ3JELElBQUksQ0FBQ0csVUFBVSxDQUFDRixPQUFPLEdBQUcsSUFBSSxDQUFDQyxZQUFZLENBQUNELE9BQU87SUFDckQ7SUFDQSxJQUFJLENBQUMxQixPQUFPLENBQUNpQixFQUFFLENBQUNJLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDaEMzRSxRQUFRLENBQUNNLGFBQWEsQ0FDcEIsSUFBSUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFO01BQ2pDQyxNQUFNLEVBQUU7UUFDTkUsS0FBSyxFQUFFO01BQ1Q7SUFDRixDQUFDLENBQ0gsQ0FBQztJQUVEcEIsVUFBVSxDQUFDLE1BQU07TUFDZixJQUFJLENBQUM2SCxVQUFVLENBQUMsQ0FBQztJQUNuQixDQUFDLEVBQUUsRUFBRSxDQUFDO0VBQ1I7RUFDQUosUUFBUUEsQ0FBQSxFQUFHO0lBQ1QsSUFBSSxJQUFJLENBQUN6RCxPQUFPLENBQUNjLFlBQVksQ0FBQ0MsUUFBUSxFQUFFO01BQ3RDLElBQUksQ0FBQ2UsSUFBSSxHQUFHLElBQUksQ0FBQ04sVUFBVSxDQUFDQyxRQUFRLENBQUN1QyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQzlDLElBQUksQ0FBQ3hDLFVBQVUsQ0FBQ0MsUUFBUSxHQUN4QixJQUFJLENBQUNELFVBQVUsQ0FBQ0MsUUFBUSxDQUFDaEcsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7SUFDaEQ7RUFDRjtFQUNBbUgsV0FBV0EsQ0FBQSxFQUFHO0lBQ1osSUFBSXFCLFdBQVcsR0FBR3ZILFFBQVEsQ0FBQ3VHLGFBQWEsQ0FDckMsSUFBR04sTUFBTSxDQUFDNUIsUUFBUSxDQUFDZSxJQUFJLENBQUNyRyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBRSxFQUM1QyxDQUFDLEdBQ0ksSUFBR2tILE1BQU0sQ0FBQzVCLFFBQVEsQ0FBQ2UsSUFBSSxDQUFDckcsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUUsRUFBQyxHQUMzQ2lCLFFBQVEsQ0FBQ3VHLGFBQWEsQ0FBRSxHQUFFTixNQUFNLENBQUM1QixRQUFRLENBQUNlLElBQUssRUFBQyxDQUFDLEdBQ2hELEdBQUVhLE1BQU0sQ0FBQzVCLFFBQVEsQ0FBQ2UsSUFBSyxFQUFDLEdBQ3pCLElBQUk7SUFFUixNQUFNb0MsT0FBTyxHQUFHeEgsUUFBUSxDQUFDdUcsYUFBYSxDQUNuQyxJQUFHLElBQUksQ0FBQ2pELE9BQU8sQ0FBQ0csbUJBQW9CLE9BQU04RCxXQUFZLElBQ3pELENBQUMsR0FDR3ZILFFBQVEsQ0FBQ3VHLGFBQWEsQ0FDbkIsSUFBRyxJQUFJLENBQUNqRCxPQUFPLENBQUNHLG1CQUFvQixPQUFNOEQsV0FBWSxJQUN6RCxDQUFDLEdBQ0R2SCxRQUFRLENBQUN1RyxhQUFhLENBQ25CLElBQUcsSUFBSSxDQUFDakQsT0FBTyxDQUFDRyxtQkFBb0IsT0FBTThELFdBQVcsQ0FBQ3hJLE9BQU8sQ0FDNUQsR0FBRyxFQUNILEdBQ0YsQ0FBRSxJQUNKLENBQUM7SUFDTCxJQUFJeUksT0FBTyxJQUFJRCxXQUFXLEVBQUUsSUFBSSxDQUFDM0csSUFBSSxDQUFDMkcsV0FBVyxDQUFDO0VBQ3BEO0VBQ0FQLFFBQVFBLENBQUEsRUFBRztJQUNUUyxPQUFPLENBQUNDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQ3RDLElBQUksQ0FBQztFQUN0QztFQUNBaUMsV0FBV0EsQ0FBQSxFQUFHO0lBQ1pJLE9BQU8sQ0FBQ0MsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUV6QixNQUFNLENBQUM1QixRQUFRLENBQUNzRCxJQUFJLENBQUNDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMvRDtFQUNBNUIsV0FBV0EsQ0FBQ2hGLENBQUMsRUFBRTtJQUNiLE1BQU02RyxTQUFTLEdBQUcsSUFBSSxDQUFDL0MsVUFBVSxDQUFDRSxPQUFPLENBQUNsSCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMwSCxRQUFRLENBQUM7SUFDekUsTUFBTXNDLFVBQVUsR0FBR0MsS0FBSyxDQUFDQyxTQUFTLENBQUNDLEtBQUssQ0FBQ0MsSUFBSSxDQUFDTCxTQUFTLENBQUM7SUFDeEQsTUFBTU0sWUFBWSxHQUFHTCxVQUFVLENBQUNNLE9BQU8sQ0FBQ3BJLFFBQVEsQ0FBQ3NHLGFBQWEsQ0FBQztJQUUvRCxJQUFJdEYsQ0FBQyxDQUFDcUgsUUFBUSxJQUFJRixZQUFZLEtBQUssQ0FBQyxFQUFFO01BQ3BDTCxVQUFVLENBQUNBLFVBQVUsQ0FBQy9KLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQ3VLLEtBQUssQ0FBQyxDQUFDO01BQ3pDdEgsQ0FBQyxDQUFDRyxjQUFjLENBQUMsQ0FBQztJQUNwQjtJQUNBLElBQUksQ0FBQ0gsQ0FBQyxDQUFDcUgsUUFBUSxJQUFJRixZQUFZLEtBQUtMLFVBQVUsQ0FBQy9KLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDekQrSixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUNRLEtBQUssQ0FBQyxDQUFDO01BQ3JCdEgsQ0FBQyxDQUFDRyxjQUFjLENBQUMsQ0FBQztJQUNwQjtFQUNGO0VBQ0FnRyxVQUFVQSxDQUFBLEVBQUc7SUFDWCxNQUFNVSxTQUFTLEdBQUcsSUFBSSxDQUFDNUMsWUFBWSxDQUFDRCxPQUFPLENBQUNsSCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMwSCxRQUFRLENBQUM7SUFDM0UsSUFBSSxDQUFDLElBQUksQ0FBQ1gsTUFBTSxJQUFJLElBQUksQ0FBQ1UsV0FBVyxFQUFFO01BQ3BDLElBQUksQ0FBQ0EsV0FBVyxDQUFDK0MsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxNQUFNO01BQ0xULFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1MsS0FBSyxDQUFDLENBQUM7SUFDdEI7RUFDRjtBQUNGOztBQUVBOztBQUVBNUwsZ0RBQU8sQ0FBQ2dFLEtBQUssR0FBRyxJQUFJMkMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0FDeFpjOztBQUUzQzs7QUFFQSxNQUFNb0YsSUFBSSxDQUFDO0VBQ1Q3TCxXQUFXQSxDQUFBLEVBQUc7SUFDWixJQUFJLENBQUNDLEtBQUssR0FBRztNQUNYNkwsSUFBSSxFQUFFLFdBQVc7TUFDakJDLEtBQUssRUFBRSxpQkFBaUI7TUFDeEJDLE1BQU0sRUFBRSxrQkFBa0I7TUFDMUJDLEtBQUssRUFBRSxpQkFBaUI7TUFDeEJDLFFBQVEsRUFBRSxnQkFBZ0I7TUFDMUJDLElBQUksRUFBRSxnQkFBZ0I7TUFDdEJDLElBQUksRUFBRTtJQUNSLENBQUM7SUFDRCxJQUFJLENBQUMzTCxPQUFPLEdBQUc7TUFDYjRMLElBQUksRUFBRSxZQUFZO01BQ2xCQyxNQUFNLEVBQUUsWUFBWTtNQUNwQkMsS0FBSyxFQUFFO0lBQ1QsQ0FBQztJQUNELElBQUksQ0FBQ0MsSUFBSSxHQUFHcEosUUFBUSxDQUFDbEMsZ0JBQWdCLENBQUUsYUFBWSxDQUFDO0lBQ3BELElBQUksQ0FBQ3VMLFVBQVUsR0FBRyxFQUFFO0lBRXBCLElBQUksSUFBSSxDQUFDRCxJQUFJLENBQUNyTCxNQUFNLEVBQUU7TUFDcEIsTUFBTXFILElBQUksR0FBR29ELCtDQUFPLENBQUMsQ0FBQztNQUV0QixJQUFJcEQsSUFBSSxJQUFJQSxJQUFJLENBQUNrRSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDbkMsSUFBSSxDQUFDRCxVQUFVLEdBQUdqRSxJQUFJLENBQUNyRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDNkksS0FBSyxDQUFDLEdBQUcsQ0FBQztNQUN2RDtNQUVBLElBQUksQ0FBQ3dCLElBQUksQ0FBQ3BMLE9BQU8sQ0FBQyxDQUFDdUwsU0FBUyxFQUFFOUosS0FBSyxLQUFLO1FBQ3RDOEosU0FBUyxDQUFDaEwsU0FBUyxDQUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDbkIsT0FBTyxDQUFDNEwsSUFBSSxDQUFDO1FBQzFDTSxTQUFTLENBQUMvRyxZQUFZLENBQUMsSUFBSSxDQUFDM0YsS0FBSyxDQUFDOEwsS0FBSyxFQUFFbEosS0FBSyxDQUFDO1FBQy9DOEosU0FBUyxDQUFDckgsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQ3NILFVBQVUsQ0FBQ3ZHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUNoRCxJQUFJLENBQUNzSixTQUFTLENBQUM7TUFDdEIsQ0FBQyxDQUFDO0lBQ0o7RUFDRjtFQUVBRSxTQUFTQSxDQUFDRixTQUFTLEVBQUU7SUFDbkIsSUFBSUcsTUFBTSxHQUFHSCxTQUFTLENBQUN6TCxnQkFBZ0IsQ0FBRSxJQUFHLElBQUksQ0FBQ2pCLEtBQUssQ0FBQ2dNLEtBQU0sR0FBRSxDQUFDO0lBQ2hFLElBQUljLE9BQU8sR0FBR0osU0FBUyxDQUFDekwsZ0JBQWdCLENBQUUsSUFBRyxJQUFJLENBQUNqQixLQUFLLENBQUNpTSxRQUFTLEdBQUUsQ0FBQztJQUNwRSxNQUFNckosS0FBSyxHQUFHOEosU0FBUyxDQUFDM0ssT0FBTyxDQUFDZ0wsU0FBUztJQUV6QyxJQUFJRCxPQUFPLENBQUM1TCxNQUFNLEVBQUU7TUFDbEIsTUFBTThMLE9BQU8sR0FBR04sU0FBUyxDQUFDdEksWUFBWSxDQUFDLElBQUksQ0FBQ3BFLEtBQUssQ0FBQ21NLElBQUksQ0FBQztNQUV2RFcsT0FBTyxHQUFHNUIsS0FBSyxDQUFDK0IsSUFBSSxDQUFDSCxPQUFPLENBQUMsQ0FBQ0ksTUFBTSxDQUNqQ0MsSUFBSSxJQUFLQSxJQUFJLENBQUNqSCxPQUFPLENBQUUsSUFBRyxJQUFJLENBQUNsRyxLQUFLLENBQUM2TCxJQUFLLEdBQUUsQ0FBQyxLQUFLYSxTQUNyRCxDQUFDO01BRURHLE1BQU0sR0FBRzNCLEtBQUssQ0FBQytCLElBQUksQ0FBQ0osTUFBTSxDQUFDLENBQUNLLE1BQU0sQ0FDL0JDLElBQUksSUFBS0EsSUFBSSxDQUFDakgsT0FBTyxDQUFFLElBQUcsSUFBSSxDQUFDbEcsS0FBSyxDQUFDNkwsSUFBSyxHQUFFLENBQUMsS0FBS2EsU0FDckQsQ0FBQztNQUVESSxPQUFPLENBQUMzTCxPQUFPLENBQUMsQ0FBQ2dNLElBQUksRUFBRUMsSUFBSSxLQUFLO1FBQzlCLElBQUlQLE1BQU0sQ0FBQ08sSUFBSSxDQUFDLENBQUMxTCxTQUFTLENBQUNnRSxRQUFRLENBQUMsSUFBSSxDQUFDbEYsT0FBTyxDQUFDNkwsTUFBTSxDQUFDLEVBQUU7VUFDeERjLElBQUksQ0FBQ0UsTUFBTSxHQUFHLEtBQUs7VUFFbkIsSUFBSUwsT0FBTyxJQUFJLENBQUNHLElBQUksQ0FBQ2pILE9BQU8sQ0FBRSxJQUFHLElBQUksQ0FBQzFGLE9BQU8sQ0FBQzhMLEtBQU0sRUFBQyxDQUFDLEVBQUU7WUFDdERaLCtDQUFPLENBQUUsT0FBTTlJLEtBQU0sSUFBR3dLLElBQUssRUFBQyxDQUFDO1VBQ2pDO1FBQ0YsQ0FBQyxNQUFNO1VBQ0xELElBQUksQ0FBQ0UsTUFBTSxHQUFHLElBQUk7UUFDcEI7TUFDRixDQUFDLENBQUM7SUFDSjtFQUNGO0VBRUFWLFVBQVVBLENBQUN4SSxDQUFDLEVBQUU7SUFDWixNQUFNbUIsTUFBTSxHQUFHbkIsQ0FBQyxDQUFDbUIsTUFBTTtJQUV2QixJQUFJQSxNQUFNLENBQUNZLE9BQU8sQ0FBRSxJQUFHLElBQUksQ0FBQ2xHLEtBQUssQ0FBQ2dNLEtBQU0sR0FBRSxDQUFDLEVBQUU7TUFDM0MsTUFBTXNCLEtBQUssR0FBR2hJLE1BQU0sQ0FBQ1ksT0FBTyxDQUFFLElBQUcsSUFBSSxDQUFDbEcsS0FBSyxDQUFDZ00sS0FBTSxHQUFFLENBQUM7TUFDckQsTUFBTVUsU0FBUyxHQUFHWSxLQUFLLENBQUNwSCxPQUFPLENBQUUsSUFBRyxJQUFJLENBQUNsRyxLQUFLLENBQUM2TCxJQUFLLEdBQUUsQ0FBQztNQUV2RCxJQUFJLENBQUN5QixLQUFLLENBQUM1TCxTQUFTLENBQUNnRSxRQUFRLENBQUMsSUFBSSxDQUFDbEYsT0FBTyxDQUFDNkwsTUFBTSxDQUFDLEVBQUU7UUFDbEQsSUFBSWtCLFdBQVcsR0FBR2IsU0FBUyxDQUFDekwsZ0JBQWdCLENBQ3pDLElBQUcsSUFBSSxDQUFDakIsS0FBSyxDQUFDZ00sS0FBTSxLQUFJLElBQUksQ0FBQ3hMLE9BQU8sQ0FBQzZMLE1BQU8sRUFDL0MsQ0FBQztRQUVEa0IsV0FBVyxDQUFDck0sTUFBTSxHQUNicU0sV0FBVyxHQUFHckMsS0FBSyxDQUFDK0IsSUFBSSxDQUFDTSxXQUFXLENBQUMsQ0FBQ0wsTUFBTSxDQUMxQ0MsSUFBSSxJQUFLQSxJQUFJLENBQUNqSCxPQUFPLENBQUUsSUFBRyxJQUFJLENBQUNsRyxLQUFLLENBQUM2TCxJQUFLLEdBQUUsQ0FBQyxLQUFLYSxTQUNyRCxDQUFDLEdBQ0QsSUFBSTtRQUNSYSxXQUFXLENBQUNyTSxNQUFNLEdBQ2RxTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM3TCxTQUFTLENBQUNHLE1BQU0sQ0FBQyxJQUFJLENBQUNyQixPQUFPLENBQUM2TCxNQUFNLENBQUMsR0FDcEQsSUFBSTtRQUNSaUIsS0FBSyxDQUFDNUwsU0FBUyxDQUFDQyxHQUFHLENBQUMsSUFBSSxDQUFDbkIsT0FBTyxDQUFDNkwsTUFBTSxDQUFDO1FBQ3hDLElBQUksQ0FBQ08sU0FBUyxDQUFDRixTQUFTLENBQUM7TUFDM0I7TUFFQXZJLENBQUMsQ0FBQ0csY0FBYyxDQUFDLENBQUM7SUFDcEI7RUFDRjtFQUVBbEIsSUFBSUEsQ0FBQ3NKLFNBQVMsRUFBRTtJQUNkLElBQUlHLE1BQU0sR0FBR0gsU0FBUyxDQUFDekwsZ0JBQWdCLENBQUUsSUFBRyxJQUFJLENBQUNqQixLQUFLLENBQUMrTCxNQUFPLEtBQUksQ0FBQztJQUNuRSxJQUFJZSxPQUFPLEdBQUdKLFNBQVMsQ0FBQ3pMLGdCQUFnQixDQUFFLElBQUcsSUFBSSxDQUFDakIsS0FBSyxDQUFDa00sSUFBSyxLQUFJLENBQUM7SUFDbEUsTUFBTXRKLEtBQUssR0FBRzhKLFNBQVMsQ0FBQzNLLE9BQU8sQ0FBQ2dMLFNBQVM7SUFDekMsTUFBTVMsZUFBZSxHQUFHLElBQUksQ0FBQ2hCLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSTVKLEtBQUs7SUFFbkQsSUFBSTRLLGVBQWUsRUFBRTtNQUNuQixNQUFNRCxXQUFXLEdBQUdiLFNBQVMsQ0FBQ2hELGFBQWEsQ0FDeEMsSUFBRyxJQUFJLENBQUMxSixLQUFLLENBQUMrTCxNQUFPLE1BQUssSUFBSSxDQUFDdkwsT0FBTyxDQUFDNkwsTUFBTyxFQUNqRCxDQUFDO01BQ0RrQixXQUFXLEdBQUdBLFdBQVcsQ0FBQzdMLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLElBQUksQ0FBQ3JCLE9BQU8sQ0FBQzZMLE1BQU0sQ0FBQyxHQUFHLElBQUk7SUFDeEU7SUFFQSxJQUFJUyxPQUFPLENBQUM1TCxNQUFNLEVBQUU7TUFDbEI0TCxPQUFPLEdBQUc1QixLQUFLLENBQUMrQixJQUFJLENBQUNILE9BQU8sQ0FBQyxDQUFDSSxNQUFNLENBQ2pDQyxJQUFJLElBQUtBLElBQUksQ0FBQ2pILE9BQU8sQ0FBRSxJQUFHLElBQUksQ0FBQ2xHLEtBQUssQ0FBQzZMLElBQUssR0FBRSxDQUFDLEtBQUthLFNBQ3JELENBQUM7TUFDREcsTUFBTSxHQUFHM0IsS0FBSyxDQUFDK0IsSUFBSSxDQUFDSixNQUFNLENBQUMsQ0FBQ0ssTUFBTSxDQUMvQkMsSUFBSSxJQUFLQSxJQUFJLENBQUNqSCxPQUFPLENBQUUsSUFBRyxJQUFJLENBQUNsRyxLQUFLLENBQUM2TCxJQUFLLEdBQUUsQ0FBQyxLQUFLYSxTQUNyRCxDQUFDO01BRURJLE9BQU8sQ0FBQzNMLE9BQU8sQ0FBQyxDQUFDZ00sSUFBSSxFQUFFdkssS0FBSyxLQUFLO1FBQy9CaUssTUFBTSxDQUFDakssS0FBSyxDQUFDLENBQUMrQyxZQUFZLENBQUMsSUFBSSxDQUFDM0YsS0FBSyxDQUFDZ00sS0FBSyxFQUFFLEVBQUUsQ0FBQztRQUNoRG1CLElBQUksQ0FBQ3hILFlBQVksQ0FBQyxJQUFJLENBQUMzRixLQUFLLENBQUNpTSxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBRTFDLElBQUl1QixlQUFlLElBQUk1SyxLQUFLLElBQUksSUFBSSxDQUFDNEosVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1VBQ2xESyxNQUFNLENBQUNqSyxLQUFLLENBQUMsQ0FBQ2xCLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQ25CLE9BQU8sQ0FBQzZMLE1BQU0sQ0FBQztRQUNsRDtRQUNBYyxJQUFJLENBQUNFLE1BQU0sR0FBRyxDQUFDUixNQUFNLENBQUNqSyxLQUFLLENBQUMsQ0FBQ2xCLFNBQVMsQ0FBQ2dFLFFBQVEsQ0FBQyxJQUFJLENBQUNsRixPQUFPLENBQUM2TCxNQUFNLENBQUM7TUFDdEUsQ0FBQyxDQUFDO0lBQ0o7RUFDRjtBQUNGOztBQUVBOztBQUVBLElBQUlULElBQUksQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcklWO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTUYsT0FBTyxHQUFJbkQsSUFBSSxJQUFLO0VBQzdCQSxJQUFJLEdBQUdBLElBQUksR0FBSSxJQUFHQSxJQUFLLEVBQUMsR0FBR2EsTUFBTSxDQUFDNUIsUUFBUSxDQUFDc0QsSUFBSSxDQUFDQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzdESCxPQUFPLENBQUNDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFdEMsSUFBSSxDQUFDO0FBQ25DLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNb0QsT0FBTyxHQUFHQSxDQUFBLEtBQU07RUFDekIsSUFBSW5FLFFBQVEsQ0FBQ2UsSUFBSSxFQUFFO0lBQ2YsT0FBT2YsUUFBUSxDQUFDZSxJQUFJLENBQUNyRyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztFQUN6QztBQUNKLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ08sTUFBTXVMLFFBQVEsR0FBR0EsQ0FBQSxLQUFNO0VBQzFCLElBQUl0SyxRQUFRLENBQUN1RyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUU7SUFDdEN2RyxRQUFRLENBQUNrQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVWxCLENBQUMsRUFBRTtNQUM1QyxJQUFJa0MsY0FBYyxJQUFJbEMsQ0FBQyxDQUFDbUIsTUFBTSxDQUFDWSxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDbER3SCxRQUFRLENBQUMsQ0FBQztNQUNkLENBQUMsTUFBTSxJQUNIckgsY0FBYyxJQUNkbEQsUUFBUSxDQUFDb0csZUFBZSxDQUFDN0gsU0FBUyxDQUFDZ0UsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUMxRHZCLENBQUMsQ0FBQ21CLE1BQU0sQ0FBQ1ksT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQy9CLENBQUMsQ0FBQ21CLE1BQU0sQ0FBQ1ksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQ3RFO1FBQ0V5SCxTQUFTLENBQUMsQ0FBQztNQUNmO0lBQ0osQ0FBQyxDQUFDO0VBQ047QUFDSixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ08sTUFBTUQsUUFBUSxHQUFHQSxDQUFBLEtBQU07RUFDMUJwSCxRQUFRLENBQUMsQ0FBQztFQUNWbkQsUUFBUSxDQUFDb0csZUFBZSxDQUFDN0gsU0FBUyxDQUFDQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQzFELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDTyxNQUFNZ00sU0FBUyxHQUFHQSxDQUFBLEtBQU07RUFDM0JwSCxVQUFVLENBQUMsQ0FBQztFQUNacEQsUUFBUSxDQUFDb0csZUFBZSxDQUFDN0gsU0FBUyxDQUFDRyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQzdELENBQUM7O0FBRUQ7QUFDTyxJQUFJd0UsY0FBYyxHQUFHLElBQUk7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNdUgsY0FBYyxHQUFHLFNBQUFBLENBQUEsRUFBaUI7RUFBQSxJQUFoQkMsS0FBSyxHQUFBdEssU0FBQSxDQUFBckMsTUFBQSxRQUFBcUMsU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBRyxHQUFHO0VBQ3RDLElBQUlKLFFBQVEsQ0FBQ29HLGVBQWUsQ0FBQzdILFNBQVMsQ0FBQ2dFLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUNyRGEsVUFBVSxDQUFDc0gsS0FBSyxDQUFDO0VBQ3JCLENBQUMsTUFBTTtJQUNIdkgsUUFBUSxDQUFDdUgsS0FBSyxDQUFDO0VBQ25CO0FBQ0osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTXRILFVBQVUsR0FBRyxTQUFBQSxDQUFBLEVBQWlCO0VBQUEsSUFBaEJzSCxLQUFLLEdBQUF0SyxTQUFBLENBQUFyQyxNQUFBLFFBQUFxQyxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHLEdBQUc7RUFDbEMsSUFBSThDLGNBQWMsRUFBRTtJQUNoQjVELFVBQVUsQ0FBQyxNQUFNO01BQ2JVLFFBQVEsQ0FBQ29HLGVBQWUsQ0FBQzdILFNBQVMsQ0FBQ0csTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNyRCxDQUFDLEVBQUVnTSxLQUFLLENBQUM7SUFDVHhILGNBQWMsR0FBRyxLQUFLO0lBQ3RCNUQsVUFBVSxDQUFDLFlBQVk7TUFDbkI0RCxjQUFjLEdBQUcsSUFBSTtJQUN6QixDQUFDLEVBQUV3SCxLQUFLLENBQUM7RUFDYjtBQUNKLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU12SCxRQUFRLEdBQUcsU0FBQUEsQ0FBQSxFQUFpQjtFQUFBLElBQWhCdUgsS0FBSyxHQUFBdEssU0FBQSxDQUFBckMsTUFBQSxRQUFBcUMsU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBRyxHQUFHO0VBQ2hDLElBQUk4QyxjQUFjLEVBQUU7SUFDaEJsRCxRQUFRLENBQUNvRyxlQUFlLENBQUM3SCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFFOUMwRSxjQUFjLEdBQUcsS0FBSztJQUN0QjVELFVBQVUsQ0FBQyxZQUFZO01BQ25CNEQsY0FBYyxHQUFHLElBQUk7SUFDekIsQ0FBQyxFQUFFd0gsS0FBSyxDQUFDO0VBQ2I7QUFDSixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTQyxXQUFXQSxDQUFDQyxLQUFLLEVBQUU7RUFDL0IsT0FBT0EsS0FBSyxDQUFDYixNQUFNLENBQUMsVUFBVUMsSUFBSSxFQUFFdkssS0FBSyxFQUFFb0wsSUFBSSxFQUFFO0lBQzdDLE9BQU9BLElBQUksQ0FBQ3pDLE9BQU8sQ0FBQzRCLElBQUksQ0FBQyxLQUFLdkssS0FBSztFQUN2QyxDQUFDLENBQUM7QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNcUwsZ0JBQWdCLEdBQUdBLENBQUNGLEtBQUssRUFBRUcsWUFBWSxLQUFLO0VBQ3JEO0VBQ0EsTUFBTUMsS0FBSyxHQUFHakQsS0FBSyxDQUFDK0IsSUFBSSxDQUFDYyxLQUFLLENBQUMsQ0FBQ2IsTUFBTSxDQUFDLFVBQVVDLElBQUksRUFBRXZLLEtBQUssRUFBRW9MLElBQUksRUFBRTtJQUNoRSxJQUFJYixJQUFJLENBQUNwTCxPQUFPLENBQUNtTSxZQUFZLENBQUMsRUFBRTtNQUM1QixPQUFPZixJQUFJLENBQUNwTCxPQUFPLENBQUNtTSxZQUFZLENBQUMsQ0FBQ25ELEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQ7RUFDSixDQUFDLENBQUM7RUFDRjtFQUNBLElBQUlvRCxLQUFLLENBQUNqTixNQUFNLEVBQUU7SUFDZCxNQUFNa04sZ0JBQWdCLEdBQUcsRUFBRTtJQUMzQkQsS0FBSyxDQUFDaE4sT0FBTyxDQUFFZ00sSUFBSSxJQUFLO01BQ3BCLE1BQU1rQixNQUFNLEdBQUdsQixJQUFJLENBQUNwTCxPQUFPLENBQUNtTSxZQUFZLENBQUM7TUFDekMsTUFBTUksVUFBVSxHQUFHLENBQUMsQ0FBQztNQUNyQixNQUFNQyxXQUFXLEdBQUdGLE1BQU0sQ0FBQ3RELEtBQUssQ0FBQyxHQUFHLENBQUM7TUFDckN1RCxVQUFVLENBQUNyTSxLQUFLLEdBQUdzTSxXQUFXLENBQUMsQ0FBQyxDQUFDO01BQ2pDRCxVQUFVLENBQUNsTSxJQUFJLEdBQUdtTSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUdBLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQ2pNLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSztNQUNoRWdNLFVBQVUsQ0FBQ25CLElBQUksR0FBR0EsSUFBSTtNQUN0QmlCLGdCQUFnQixDQUFDSSxJQUFJLENBQUNGLFVBQVUsQ0FBQztJQUNyQyxDQUFDLENBQUM7SUFDRjtJQUNBLElBQUlHLFNBQVMsR0FBR0wsZ0JBQWdCLENBQUNNLEdBQUcsQ0FBQyxVQUFVdkIsSUFBSSxFQUFFO01BQ2pELE9BQU8sR0FBRyxHQUFHQSxJQUFJLENBQUMvSyxJQUFJLEdBQUcsVUFBVSxHQUFHK0ssSUFBSSxDQUFDbEwsS0FBSyxHQUFHLE1BQU0sR0FBR2tMLElBQUksQ0FBQ2xMLEtBQUssR0FBRyxHQUFHLEdBQUdrTCxJQUFJLENBQUMvSyxJQUFJO0lBQzVGLENBQUMsQ0FBQztJQUNGcU0sU0FBUyxHQUFHWCxXQUFXLENBQUNXLFNBQVMsQ0FBQztJQUNsQyxNQUFNRSxjQUFjLEdBQUcsRUFBRTtJQUV6QixJQUFJRixTQUFTLENBQUN2TixNQUFNLEVBQUU7TUFDbEI7TUFDQXVOLFNBQVMsQ0FBQ3ROLE9BQU8sQ0FBRW1OLFVBQVUsSUFBSztRQUM5QixNQUFNQyxXQUFXLEdBQUdELFVBQVUsQ0FBQ3ZELEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDekMsTUFBTTZELGVBQWUsR0FBR0wsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUN0QyxNQUFNTSxTQUFTLEdBQUdOLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDaEMsTUFBTU8sVUFBVSxHQUFHMUYsTUFBTSxDQUFDMEYsVUFBVSxDQUFDUCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQ7UUFDQSxNQUFNUSxVQUFVLEdBQUdYLGdCQUFnQixDQUFDbEIsTUFBTSxDQUFDLFVBQVVDLElBQUksRUFBRTtVQUN2RCxJQUFJQSxJQUFJLENBQUNsTCxLQUFLLEtBQUsyTSxlQUFlLElBQUl6QixJQUFJLENBQUMvSyxJQUFJLEtBQUt5TSxTQUFTLEVBQUU7WUFDM0QsT0FBTyxJQUFJO1VBQ2Y7UUFDSixDQUFDLENBQUM7UUFDRkYsY0FBYyxDQUFDSCxJQUFJLENBQUM7VUFDaEJPLFVBQVU7VUFDVkQ7UUFDSixDQUFDLENBQUM7TUFDTixDQUFDLENBQUM7TUFDRixPQUFPSCxjQUFjO0lBQ3pCO0VBQ0o7QUFDSixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1LLFFBQVEsR0FBRyxTQUFBQSxDQUFDMUosTUFBTSxFQUFtQztFQUFBLElBQWpDMkosUUFBUSxHQUFBMUwsU0FBQSxDQUFBckMsTUFBQSxRQUFBcUMsU0FBQSxRQUFBQyxTQUFBLEdBQUFELFNBQUEsTUFBRyxHQUFHO0VBQUEsSUFBRTJMLFFBQVEsR0FBQTNMLFNBQUEsQ0FBQXJDLE1BQUEsUUFBQXFDLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUcsQ0FBQztFQUN6RCxJQUFJLENBQUMrQixNQUFNLENBQUM1RCxTQUFTLENBQUNnRSxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7SUFDdENKLE1BQU0sQ0FBQzVELFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUM5QjJELE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ0Msa0JBQWtCLEdBQUcseUJBQXlCO0lBQzNEOUosTUFBTSxDQUFDNkosS0FBSyxDQUFDRSxrQkFBa0IsR0FBR0osUUFBUSxHQUFHLElBQUk7SUFDakQzSixNQUFNLENBQUM2SixLQUFLLENBQUNHLE1BQU0sR0FBSSxHQUFFaEssTUFBTSxDQUFDaUssWUFBYSxJQUFHO0lBQ2hEakssTUFBTSxDQUFDaUssWUFBWTtJQUNuQmpLLE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ0ssUUFBUSxHQUFHLFFBQVE7SUFDaENsSyxNQUFNLENBQUM2SixLQUFLLENBQUNHLE1BQU0sR0FBR0osUUFBUSxHQUFJLEdBQUVBLFFBQVMsS0FBSSxHQUFJLEdBQUU7SUFDdkQ1SixNQUFNLENBQUM2SixLQUFLLENBQUNNLFVBQVUsR0FBRyxDQUFDO0lBQzNCbkssTUFBTSxDQUFDNkosS0FBSyxDQUFDTyxhQUFhLEdBQUcsQ0FBQztJQUM5QnBLLE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ1EsU0FBUyxHQUFHLENBQUM7SUFDMUJySyxNQUFNLENBQUM2SixLQUFLLENBQUNTLFlBQVksR0FBRyxDQUFDO0lBQzdCeEcsTUFBTSxDQUFDM0csVUFBVSxDQUFDLE1BQU07TUFDcEI2QyxNQUFNLENBQUMrSCxNQUFNLEdBQUcsQ0FBQzZCLFFBQVEsR0FBRyxJQUFJLEdBQUcsS0FBSztNQUN4QyxDQUFDQSxRQUFRLEdBQUc1SixNQUFNLENBQUM2SixLQUFLLENBQUNVLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJO01BQ3hEdkssTUFBTSxDQUFDNkosS0FBSyxDQUFDVSxjQUFjLENBQUMsYUFBYSxDQUFDO01BQzFDdkssTUFBTSxDQUFDNkosS0FBSyxDQUFDVSxjQUFjLENBQUMsZ0JBQWdCLENBQUM7TUFDN0N2SyxNQUFNLENBQUM2SixLQUFLLENBQUNVLGNBQWMsQ0FBQyxZQUFZLENBQUM7TUFDekN2SyxNQUFNLENBQUM2SixLQUFLLENBQUNVLGNBQWMsQ0FBQyxlQUFlLENBQUM7TUFDNUMsQ0FBQ1gsUUFBUSxHQUFHNUosTUFBTSxDQUFDNkosS0FBSyxDQUFDVSxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSTtNQUMxRHZLLE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ1UsY0FBYyxDQUFDLHFCQUFxQixDQUFDO01BQ2xEdkssTUFBTSxDQUFDNkosS0FBSyxDQUFDVSxjQUFjLENBQUMscUJBQXFCLENBQUM7TUFDbER2SyxNQUFNLENBQUM1RCxTQUFTLENBQUNHLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDakM7TUFDQXNCLFFBQVEsQ0FBQ00sYUFBYSxDQUNsQixJQUFJQyxXQUFXLENBQUMsYUFBYSxFQUFFO1FBQzNCQyxNQUFNLEVBQUU7VUFDSjJCLE1BQU0sRUFBRUE7UUFDWjtNQUNKLENBQUMsQ0FDTCxDQUFDO0lBQ0wsQ0FBQyxFQUFFMkosUUFBUSxDQUFDO0VBQ2hCO0FBQ0osQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNYSxVQUFVLEdBQUcsU0FBQUEsQ0FBQ3hLLE1BQU0sRUFBbUM7RUFBQSxJQUFqQzJKLFFBQVEsR0FBQTFMLFNBQUEsQ0FBQXJDLE1BQUEsUUFBQXFDLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUcsR0FBRztFQUFBLElBQUUyTCxRQUFRLEdBQUEzTCxTQUFBLENBQUFyQyxNQUFBLFFBQUFxQyxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHLENBQUM7RUFDM0QsSUFBSSxDQUFDK0IsTUFBTSxDQUFDNUQsU0FBUyxDQUFDZ0UsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0lBQ3RDSixNQUFNLENBQUM1RCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDOUIyRCxNQUFNLENBQUMrSCxNQUFNLEdBQUcvSCxNQUFNLENBQUMrSCxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUk7SUFDNUM2QixRQUFRLEdBQUc1SixNQUFNLENBQUM2SixLQUFLLENBQUNVLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJO0lBQ3ZELElBQUlQLE1BQU0sR0FBR2hLLE1BQU0sQ0FBQ2lLLFlBQVk7SUFDaENqSyxNQUFNLENBQUM2SixLQUFLLENBQUNLLFFBQVEsR0FBRyxRQUFRO0lBQ2hDbEssTUFBTSxDQUFDNkosS0FBSyxDQUFDRyxNQUFNLEdBQUdKLFFBQVEsR0FBSSxHQUFFQSxRQUFTLEtBQUksR0FBSSxHQUFFO0lBQ3ZENUosTUFBTSxDQUFDNkosS0FBSyxDQUFDTSxVQUFVLEdBQUcsQ0FBQztJQUMzQm5LLE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ08sYUFBYSxHQUFHLENBQUM7SUFDOUJwSyxNQUFNLENBQUM2SixLQUFLLENBQUNRLFNBQVMsR0FBRyxDQUFDO0lBQzFCckssTUFBTSxDQUFDNkosS0FBSyxDQUFDUyxZQUFZLEdBQUcsQ0FBQztJQUM3QnRLLE1BQU0sQ0FBQ2lLLFlBQVk7SUFDbkJqSyxNQUFNLENBQUM2SixLQUFLLENBQUNDLGtCQUFrQixHQUFHLHlCQUF5QjtJQUMzRDlKLE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ0Usa0JBQWtCLEdBQUdKLFFBQVEsR0FBRyxJQUFJO0lBQ2pEM0osTUFBTSxDQUFDNkosS0FBSyxDQUFDRyxNQUFNLEdBQUdBLE1BQU0sR0FBRyxJQUFJO0lBQ25DaEssTUFBTSxDQUFDNkosS0FBSyxDQUFDVSxjQUFjLENBQUMsYUFBYSxDQUFDO0lBQzFDdkssTUFBTSxDQUFDNkosS0FBSyxDQUFDVSxjQUFjLENBQUMsZ0JBQWdCLENBQUM7SUFDN0N2SyxNQUFNLENBQUM2SixLQUFLLENBQUNVLGNBQWMsQ0FBQyxZQUFZLENBQUM7SUFDekN2SyxNQUFNLENBQUM2SixLQUFLLENBQUNVLGNBQWMsQ0FBQyxlQUFlLENBQUM7SUFDNUN6RyxNQUFNLENBQUMzRyxVQUFVLENBQUMsTUFBTTtNQUNwQjZDLE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ1UsY0FBYyxDQUFDLFFBQVEsQ0FBQztNQUNyQ3ZLLE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ1UsY0FBYyxDQUFDLFVBQVUsQ0FBQztNQUN2Q3ZLLE1BQU0sQ0FBQzZKLEtBQUssQ0FBQ1UsY0FBYyxDQUFDLHFCQUFxQixDQUFDO01BQ2xEdkssTUFBTSxDQUFDNkosS0FBSyxDQUFDVSxjQUFjLENBQUMscUJBQXFCLENBQUM7TUFDbER2SyxNQUFNLENBQUM1RCxTQUFTLENBQUNHLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDakM7TUFDQXNCLFFBQVEsQ0FBQ00sYUFBYSxDQUNsQixJQUFJQyxXQUFXLENBQUMsZUFBZSxFQUFFO1FBQzdCQyxNQUFNLEVBQUU7VUFDSjJCLE1BQU0sRUFBRUE7UUFDWjtNQUNKLENBQUMsQ0FDTCxDQUFDO0lBQ0wsQ0FBQyxFQUFFMkosUUFBUSxDQUFDO0VBQ2hCO0FBQ0osQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNYyxZQUFZLEdBQUcsU0FBQUEsQ0FBQ3pLLE1BQU0sRUFBcUI7RUFBQSxJQUFuQjJKLFFBQVEsR0FBQTFMLFNBQUEsQ0FBQXJDLE1BQUEsUUFBQXFDLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUcsR0FBRztFQUMvQyxJQUFJK0IsTUFBTSxDQUFDK0gsTUFBTSxFQUFFO0lBQ2YsT0FBT3lDLFVBQVUsQ0FBQ3hLLE1BQU0sRUFBRTJKLFFBQVEsQ0FBQztFQUN2QyxDQUFDLE1BQU07SUFDSCxPQUFPRCxRQUFRLENBQUMxSixNQUFNLEVBQUUySixRQUFRLENBQUM7RUFDckM7QUFDSixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTZSxPQUFPQSxDQUFDQyxRQUFRLEVBQUU7RUFDOUIsTUFBTUMsWUFBWSxHQUFHQyxVQUFVLENBQUNDLGdCQUFnQixDQUFDak4sUUFBUSxDQUFDb0csZUFBZSxDQUFDLENBQUM4RyxRQUFRLENBQUM7RUFFcEYsTUFBTUMsT0FBTyxHQUFHTCxRQUFRLEdBQUdDLFlBQVk7RUFFdkMsT0FBT0ssSUFBSSxDQUFDQyxLQUFLLENBQUNGLE9BQU8sQ0FBQyxHQUFHLElBQUk7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ08sTUFBTUcsY0FBYyxHQUFHQSxDQUFBLEtBQU07RUFDaEMsSUFBSXROLFFBQVEsQ0FBQ3VOLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFBRTtJQUN4Q3ZOLFFBQVEsQ0FBQ3VOLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQ25HLFNBQVMsR0FBRyxJQUFJb0csSUFBSSxDQUFDLENBQUMsQ0FBQ0MsV0FBVyxDQUFDLENBQUM7RUFDL0U7QUFDSixDQUFDOztBQUVEO0FBQ08sTUFBTUMsYUFBYSxHQUFHQSxDQUFDOUMsS0FBSyxFQUFFK0MsU0FBUyxLQUFLO0VBQy9DLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHaEQsS0FBSyxDQUFDN00sTUFBTSxFQUFFNlAsQ0FBQyxFQUFFLEVBQUU7SUFDbkNoRCxLQUFLLENBQUNnRCxDQUFDLENBQUMsQ0FBQ3JQLFNBQVMsQ0FBQ0csTUFBTSxDQUFDaVAsU0FBUyxDQUFDO0VBQ3hDO0FBQ0osQ0FBQzs7Ozs7Ozs7OztBQ2hTRDtBQUNBLDRDQUE0QyxtQkFBTyxDQUFDLHNIQUEwRDtBQUM5RyxrQ0FBa0MsbUJBQU8sQ0FBQyx3R0FBbUQ7QUFDN0Y7QUFDQSw2SUFBNkk7QUFDN0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLE9BQU8seWFBQXlhLFdBQVcsV0FBVyxXQUFXLFdBQVcsS0FBSyxPQUFPLFdBQVcsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFdBQVcsVUFBVSxhQUFhLE9BQU8sTUFBTSxXQUFXLFdBQVcsVUFBVSxVQUFVLFdBQVcsVUFBVSxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sTUFBTSxXQUFXLE1BQU0sUUFBUSxVQUFVLFVBQVUsVUFBVSxLQUFLLFFBQVEsVUFBVSxLQUFLLFFBQVEsVUFBVSxPQUFPLFVBQVUsVUFBVSxVQUFVLFVBQVUsT0FBTyxLQUFLLFVBQVUsV0FBVyxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFdBQVcsVUFBVSxXQUFXLE9BQU8sTUFBTSxVQUFVLFVBQVUsT0FBTyxNQUFNLFVBQVUsVUFBVSxXQUFXLE9BQU8sTUFBTSxVQUFVLFVBQVUsT0FBTyxNQUFNLFdBQVcsT0FBTyxNQUFNLFdBQVcsVUFBVSxPQUFPLE1BQU0sV0FBVyxPQUFPLE9BQU8sVUFBVSxVQUFVLFdBQVcsTUFBTSxNQUFNLFdBQVcsV0FBVyxPQUFPLE9BQU8sV0FBVyxPQUFPLE1BQU0sV0FBVyxVQUFVLE9BQU8sTUFBTSxVQUFVLFVBQVUsV0FBVyxVQUFVLFdBQVcsT0FBTyxNQUFNLFdBQVcsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLE9BQU8sTUFBTSxVQUFVLFdBQVcsV0FBVyxVQUFVLFdBQVcsTUFBTSxNQUFNLFdBQVcsVUFBVSxNQUFNLE1BQU0sVUFBVSxXQUFXLFdBQVcsTUFBTSxNQUFNLFdBQVcsV0FBVyxXQUFXLE9BQU8sTUFBTSxXQUFXLFdBQVcsVUFBVSxNQUFNLE1BQU0sVUFBVSxXQUFXLFVBQVUsTUFBTSxNQUFNLFdBQVcsV0FBVyxNQUFNLE1BQU0sVUFBVSxXQUFXLE1BQU0sTUFBTSxVQUFVLE9BQU8sTUFBTSxXQUFXLFdBQVcsTUFBTSxNQUFNLFVBQVUsV0FBVyxNQUFNLE1BQU0sVUFBVSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxPQUFPLE1BQU0sV0FBVyxXQUFXLE9BQU8sTUFBTSxXQUFXLFdBQVcsTUFBTSxNQUFNLFdBQVcsT0FBTyxNQUFNLFdBQVcsV0FBVyxVQUFVLE1BQU0sTUFBTSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxVQUFVLFlBQVksWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxZQUFZLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFlBQVksT0FBTyxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFVBQVUsVUFBVSxNQUFNLE1BQU0sVUFBVSxVQUFVLE1BQU0sTUFBTSxVQUFVLFVBQVUsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsUUFBUSxVQUFVLFdBQVcsV0FBVyxXQUFXLFFBQVEsUUFBUSxVQUFVLFFBQVEsT0FBTyxXQUFXLE9BQU8sT0FBTyxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLE9BQU8sT0FBTyxXQUFXLFdBQVcsV0FBVyxXQUFXLE9BQU8sT0FBTyxVQUFVLFdBQVcsVUFBVSxVQUFVLFdBQVcsT0FBTyxPQUFPLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLE9BQU8sT0FBTyxVQUFVLFdBQVcsT0FBTyxPQUFPLFdBQVcsV0FBVyxPQUFPLE9BQU8sV0FBVyxXQUFXLFVBQVUsVUFBVSxXQUFXLFdBQVcsWUFBWSxXQUFXLE9BQU8sTUFBTSxXQUFXLFFBQVEsTUFBTSxXQUFXLFVBQVUsTUFBTSxNQUFNLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxXQUFXLFVBQVUsV0FBVyxNQUFNLE1BQU0sVUFBVSxXQUFXLE1BQU0sTUFBTSxXQUFXLFVBQVUsVUFBVSxXQUFXLE1BQU0sTUFBTSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxZQUFZLFdBQVcsT0FBTyxNQUFNLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxNQUFNLE1BQU0sVUFBVSxXQUFXLFVBQVUsVUFBVSxXQUFXLFlBQVksWUFBWSxNQUFNLE1BQU0sVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxZQUFZLFdBQVcsT0FBTyxPQUFPLFVBQVUsV0FBVyxXQUFXLE9BQU8sT0FBTyxVQUFVLFdBQVcsV0FBVyxPQUFPLE9BQU8sVUFBVSxVQUFVLFVBQVUsV0FBVyxPQUFPLE9BQU8sV0FBVyxRQUFRLE9BQU8sVUFBVSxXQUFXLE9BQU8sT0FBTyxXQUFXLFFBQVEsT0FBTyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxPQUFPLE9BQU8sV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLE9BQU8sT0FBTyxXQUFXLE9BQU8sT0FBTyxXQUFXLFdBQVcsV0FBVyxPQUFPLE9BQU8sWUFBWSxZQUFZLE9BQU8sT0FBTyxXQUFXLE9BQU8sT0FBTyxNQUFNLFVBQVUsTUFBTSxNQUFNLE9BQU8sTUFBTSxVQUFVLE1BQU0sTUFBTSxPQUFPLE1BQU0sV0FBVyxNQUFNLEtBQUssVUFBVSxXQUFXLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxXQUFXLE1BQU0sS0FBSyxXQUFXLFVBQVUsTUFBTSxNQUFNLFVBQVUsTUFBTSxNQUFNLFdBQVcsV0FBVyxNQUFNLE1BQU0sVUFBVSxNQUFNLE1BQU0sVUFBVSxNQUFNLE1BQU0sVUFBVSxVQUFVLE1BQU0sTUFBTSxXQUFXLFVBQVUsV0FBVyxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sVUFBVSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsVUFBVSxNQUFNLE1BQU0sVUFBVSxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsV0FBVyxXQUFXLFVBQVUsTUFBTSxNQUFNLFVBQVUsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsVUFBVSxNQUFNLE1BQU0sV0FBVyxVQUFVLE1BQU0sTUFBTSxVQUFVLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxVQUFVLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxVQUFVLFVBQVUsVUFBVSxNQUFNLE1BQU0sVUFBVSxVQUFVLE1BQU0sTUFBTSxVQUFVLFVBQVUsTUFBTSxNQUFNLFVBQVUsVUFBVSxNQUFNLE1BQU0sWUFBWSxXQUFXLE9BQU8sT0FBTyxXQUFXLFVBQVUsVUFBVSxPQUFPLE1BQU0sVUFBVSxVQUFVLE9BQU8sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLFVBQVUsVUFBVSxNQUFNLE1BQU0sVUFBVSxVQUFVLFVBQVUsVUFBVSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxVQUFVLFVBQVUsTUFBTSxNQUFN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YTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzVEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDYkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTRCOztBQUU1Qjs7QUFFMEM7O0FBRTFDO0FBQ0FFLHFEQUFjLENBQUMsQ0FBQzs7QUFFaEI7QUFDQUEsMkRBQW9CLENBQUMsQ0FBQzs7QUFFdEI7O0FBRUE7QUFDdUI7O0FBRXZCO0FBQ3lCOztBQUV6QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDMkI7O0FBRTNCOztBQUV5QjtBQUNFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL21vZHVsZXMuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL3V0aWxzL2Zvcm1zLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy91dGlscy9tb2RhbHMuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL3V0aWxzL3RhYnMuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL3V0aWxzL3V0aWxzLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9zY3NzL3N0eWxlLnNjc3MiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvc2Nzcy9zdHlsZS5zY3NzPzZjMmQiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBtb2R1bGVzID0ge307XG4iLCJpbXBvcnQgeyBtb2R1bGVzIH0gZnJvbSBcIi4uL21vZHVsZXMuanNcIjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY2xhc3MgVmFsaWRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXR0cnMgPSB7XG4gICAgICBSRVFVSVJFRDogXCJkYXRhLXJlcXVpcmVkXCIsXG4gICAgICBJR05PUkVfVkFMSURBVElPTjogXCJkYXRhLWlnbm9yZS12YWxpZGF0aW9uXCIsXG4gICAgICBBSkFYOiBcImRhdGEtYWpheFwiLFxuICAgICAgREVWOiBcImRhdGEtZGV2XCIsXG4gICAgICBJR05PUkVfRk9DVVM6IFwiZGF0YS1pZ25vcmUtZm9jdXNcIixcbiAgICAgIFNIT1dfUExBQ0VIT0xERVI6IFwiZGF0YS1zaG93LXBsYWNlaG9sZGVyXCIsXG4gICAgICBWQUxJREFURTogXCJkYXRhLXZhbGlkYXRlXCIsXG4gICAgfTtcbiAgICB0aGlzLmNsYXNzZXMgPSB7XG4gICAgICBIQVNfRVJST1I6IFwiX2hhcy1lcnJvclwiLFxuICAgICAgSEFTX0ZPQ1VTOiBcIl9oYXMtZm9jdXNcIixcbiAgICAgIElTX0ZJTExFRDogXCJfaXMtZmlsbGVkXCIsXG4gICAgICBJU19SRVZFQUxFRDogXCJfaXMtcmV2ZWFsZWRcIixcbiAgICB9O1xuICB9XG5cbiAgZ2V0RXJyb3JzKGZvcm0pIHtcbiAgICBsZXQgZXJyID0gMDtcbiAgICBsZXQgcmVxdWlyZWRGaWVsZHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoYCpbJHt0aGlzLmF0dHJzLlJFUVVJUkVEfV1gKTtcblxuICAgIGlmIChyZXF1aXJlZEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHJlcXVpcmVkRmllbGRzLmZvckVhY2goKHJlcXVpcmVkRmllbGQpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChyZXF1aXJlZEZpZWxkLm9mZnNldFBhcmVudCAhPT0gbnVsbCB8fFxuICAgICAgICAgICAgcmVxdWlyZWRGaWVsZC50YWdOYW1lID09PSBcIlNFTEVDVFwiKSAmJlxuICAgICAgICAgICFyZXF1aXJlZEZpZWxkLmRpc2FibGVkXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciArPSB0aGlzLnZhbGlkYXRlRmllbGQocmVxdWlyZWRGaWVsZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZXJyO1xuICB9XG5cbiAgYWRkRXJyb3IocmVxdWlyZWRGaWVsZCkge1xuICAgIHJlcXVpcmVkRmllbGQuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzZXMuSEFTX0VSUk9SKTtcbiAgICByZXF1aXJlZEZpZWxkLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuSVNfRklMTEVEKTtcbiAgICByZXF1aXJlZEZpZWxkLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzZXMuSEFTX0VSUk9SKTtcbiAgfVxuXG4gIHJlbW92ZUVycm9yKHJlcXVpcmVkRmllbGQpIHtcbiAgICByZXF1aXJlZEZpZWxkLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19FUlJPUik7XG4gICAgcmVxdWlyZWRGaWVsZC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19FUlJPUik7XG4gIH1cblxuICB2YWxpZGF0ZUZpZWxkKHJlcXVpcmVkRmllbGQpIHtcbiAgICBsZXQgZXJyID0gMDtcblxuICAgIGlmIChyZXF1aXJlZEZpZWxkLmRhdGFzZXQucmVxdWlyZWQgPT09IFwiZW1haWxcIikge1xuICAgICAgcmVxdWlyZWRGaWVsZC52YWx1ZSA9IHJlcXVpcmVkRmllbGQudmFsdWUucmVwbGFjZShcIiBcIiwgXCJcIik7XG5cbiAgICAgIGlmICh0aGlzLnRlc3RFbWFpbChyZXF1aXJlZEZpZWxkKSkge1xuICAgICAgICB0aGlzLmFkZEVycm9yKHJlcXVpcmVkRmllbGQpO1xuICAgICAgICBlcnIrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlRXJyb3IocmVxdWlyZWRGaWVsZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZXF1aXJlZEZpZWxkLnR5cGUgPT09IFwiY2hlY2tib3hcIiAmJiAhcmVxdWlyZWRGaWVsZC5jaGVja2VkKSB7XG4gICAgICB0aGlzLmFkZEVycm9yKHJlcXVpcmVkRmllbGQpO1xuICAgICAgZXJyKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghcmVxdWlyZWRGaWVsZC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgdGhpcy5hZGRFcnJvcihyZXF1aXJlZEZpZWxkKTtcbiAgICAgICAgZXJyKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUVycm9yKHJlcXVpcmVkRmllbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXJyO1xuICB9XG5cbiAgY2xlYXJGaWVsZHMoZm9ybSkge1xuICAgIGZvcm0ucmVzZXQoKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXQsdGV4dGFyZWFcIik7XG4gICAgICBjb25zdCBjaGVja2JveGVzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgaWYgKGlucHV0cy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGlucHV0cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGlucHV0c1tpbmRleF07XG5cbiAgICAgICAgICBpbnB1dC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19GT0NVUyk7XG4gICAgICAgICAgaW5wdXQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuSEFTX0ZPQ1VTKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUVycm9yKGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoZWNrYm94ZXMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBjaGVja2JveGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgIGNvbnN0IGNoZWNrYm94ID0gY2hlY2tib3hlc1tpbmRleF07XG4gICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMCk7XG4gIH1cblxuICB0ZXN0RW1haWwocmVxdWlyZWRGaWVsZCkge1xuICAgIHJldHVybiAhL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDh9KSskLy50ZXN0KFxuICAgICAgcmVxdWlyZWRGaWVsZC52YWx1ZSxcbiAgICApO1xuICB9XG59XG5jbGFzcyBGb3JtU3VibWl0aW9uIGV4dGVuZHMgVmFsaWRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHNob3VsZFZhbGlkYXRlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnNob3VsZFZhbGlkYXRlID0gc2hvdWxkVmFsaWRhdGUgPyBzaG91bGRWYWxpZGF0ZSA6IHRydWU7XG4gICAgdGhpcy5mb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJmb3JtXCIpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgc2VuZEZvcm0oZm9ybSwgcmVzcG9uc2VSZXN1bHQgPSBgYCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJzZW5kRm9ybVwiLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIGZvcm06IGZvcm0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgLy8gc2hvdyBtb2RhbCwgaWYgcG9wdXAgbW9kdWxlIGlzIGNvbm5lY3RlZFxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKG1vZHVsZXMucG9wdXApIHtcbiAgICAgICAgY29uc3QgbW9kYWwgPSBmb3JtLmRhdGFzZXQubW9kYWxNZXNzYWdlO1xuICAgICAgICBtb2RhbCA/IG1vZHVsZXMubW9kYWwub3Blbihtb2RhbCkgOiBudWxsO1xuICAgICAgfVxuICAgIH0sIDApO1xuXG4gICAgdGhpcy5jbGVhckZpZWxkcyhmb3JtKTtcblxuICAgIGNvbnNvbGUubG9nKFwiaXMgc2VudFwiKTtcbiAgfVxuXG4gIGFzeW5jIGhhbmRsZVN1Ym1pdGlvbihmb3JtLCBlKSB7XG4gICAgY29uc3QgZXJyID0gIWZvcm0uaGFzQXR0cmlidXRlKHRoaXMuYXR0cnMuSUdOT1JFX1ZBTElEQVRJT04pXG4gICAgICA/IHRoaXMuZ2V0RXJyb3JzKGZvcm0pXG4gICAgICA6IDA7XG5cbiAgICBpZiAoZXJyID09PSAwKSB7XG4gICAgICBjb25zdCBhamF4ID0gZm9ybS5oYXNBdHRyaWJ1dGUodGhpcy5hdHRycy5BSkFYKTtcblxuICAgICAgaWYgKGFqYXgpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGZvcm0uZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpXG4gICAgICAgICAgPyBmb3JtLmdldEF0dHJpYnV0ZShcImFjdGlvblwiKS50cmltKClcbiAgICAgICAgICA6IFwiI1wiO1xuICAgICAgICBjb25zdCBtZXRob2QgPSBmb3JtLmdldEF0dHJpYnV0ZShcIm1ldGhvZFwiKVxuICAgICAgICAgID8gZm9ybS5nZXRBdHRyaWJ1dGUoXCJtZXRob2RcIikudHJpbSgpXG4gICAgICAgICAgOiBcIkdFVFwiO1xuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pO1xuXG4gICAgICAgIGZvcm0uY2xhc3NMaXN0LmFkZChcIl9pcy1zZW5kaW5nXCIpO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYWN0aW9uLCB7XG4gICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgYm9keTogZGF0YSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgIGZvcm0uY2xhc3NMaXN0LnJlbW92ZShcIl9pcy1zZW5kaW5nXCIpO1xuICAgICAgICAgIHRoaXMuc2VuZEZvcm0oZm9ybSwgcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhbGVydChcImVycm9yXCIpO1xuICAgICAgICAgIGZvcm0uY2xhc3NMaXN0LnJlbW92ZShcIl9pcy1zZW5kaW5nXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGZvcm0uaGFzQXR0cmlidXRlKHRoaXMuYXR0cnMuREVWKSkge1xuICAgICAgICAvLyBpbiBkZXZlbG9wbWVudCBtb2RlXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zZW5kRm9ybShmb3JtKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuICAgIGNvbnN0IHBhc3N3b3JkRmllbGRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcmVxdWlyZWQ9XCJwYXNzXCJdJyk7XG5cbiAgICBpZiAodGhpcy5mb3Jtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZm9ybXMuZm9yRWFjaCgoZm9ybSkgPT4ge1xuICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBfdGhpcy5oYW5kbGVTdWJtaXRpb24oZS50YXJnZXQsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwicmVzZXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBfdGhpcy5jbGVhckZpZWxkcyhlLnRhcmdldCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHBhc3N3b3JkRmllbGRzLmxlbmd0aCkge1xuICAgICAgcGFzc3dvcmRGaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgY29uc3QgYnRuID0gZmllbGQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChidG4pIHtcbiAgICAgICAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBmaWVsZC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcbiAgICAgICAgICAgICAgX3RoaXMuY2xhc3Nlcy5JU19SRVZFQUxFRCxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgPyBcInBhc3N3b3JkXCJcbiAgICAgICAgICAgICAgOiBcInRleHRcIjtcbiAgICAgICAgICAgIGZpZWxkLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgdHlwZSk7XG4gICAgICAgICAgICBmaWVsZC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoX3RoaXMuY2xhc3Nlcy5JU19SRVZFQUxFRCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuY2xhc3MgRm9ybUZpZWxkcyBleHRlbmRzIFZhbGlkYXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZmllbGRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0LHRleHRhcmVhXCIpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgc2F2ZVBsYWNlaG9sZGVyKCkge1xuICAgIGlmICh0aGlzLmZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuZmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgIGlmICghZmllbGQuaGFzQXR0cmlidXRlKHRoaXMuYXR0cnMuU0hPV19QTEFDRUhPTERFUikpIHtcbiAgICAgICAgICBmaWVsZC5kYXRhc2V0LnBsYWNlaG9sZGVyID0gZmllbGQucGxhY2Vob2xkZXI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZvY3VzaW4oZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgaWYgKHRhcmdldC50YWdOYW1lID09PSBcIklOUFVUXCIgfHwgdGFyZ2V0LnRhZ05hbWUgPT09IFwiVEVYVEFSRUFcIikge1xuICAgICAgaWYgKHRhcmdldC5kYXRhc2V0LnBsYWNlaG9sZGVyKSB0YXJnZXQucGxhY2Vob2xkZXIgPSBcIlwiO1xuXG4gICAgICBpZiAoIXRhcmdldC5oYXNBdHRyaWJ1dGUodGhpcy5hdHRycy5JR05PUkVfRk9DVVMpKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5IQVNfRk9DVVMpO1xuICAgICAgICB0YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5IQVNfRk9DVVMpO1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuSEFTX0VSUk9SKTtcbiAgICAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuSEFTX0VSUk9SKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICB0YXJnZXQudHlwZSAhPT0gXCJmaWxlXCIgJiZcbiAgICAgICAgdGFyZ2V0LnR5cGUgIT09IFwiY2hlY2tib3hcIiAmJlxuICAgICAgICB0YXJnZXQudHlwZSAhPT0gXCJyYWRpb1wiICYmXG4gICAgICAgICF0YXJnZXQuY2xvc2VzdChcIi5xdWFudGl0eVwiKVxuICAgICAgKSB7XG4gICAgICAgIHRhcmdldC5jbG9zZXN0KFwiLmlucHV0XCIpLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLklTX0ZJTExFRCk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlbW92ZUVycm9yKHRhcmdldCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRm9jdXNvdXQoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGlmICh0YXJnZXQudGFnTmFtZSA9PT0gXCJJTlBVVFwiIHx8IHRhcmdldC50YWdOYW1lID09PSBcIlRFWFRBUkVBXCIpIHtcbiAgICAgIGlmICh0YXJnZXQuZGF0YXNldC5wbGFjZWhvbGRlcikge1xuICAgICAgICB0YXJnZXQucGxhY2Vob2xkZXIgPSB0YXJnZXQuZGF0YXNldC5wbGFjZWhvbGRlcjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0YXJnZXQuaGFzQXR0cmlidXRlKHRoaXMuYXR0cnMuSUdOT1JFX0ZPQ1VTKSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuSEFTX0ZPQ1VTKTtcbiAgICAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuSEFTX0ZPQ1VTKTtcbiAgICAgIH1cbiAgICAgIGlmICh0YXJnZXQuaGFzQXR0cmlidXRlKHRoaXMuYXR0cnMuVkFMSURBVEUpKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVGaWVsZCh0YXJnZXQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHRhcmdldC50eXBlICE9PSBcImZpbGVcIiAmJlxuICAgICAgICB0YXJnZXQudHlwZSAhPT0gXCJjaGVja2JveFwiICYmXG4gICAgICAgIHRhcmdldC50eXBlICE9PSBcInJhZGlvXCIgJiZcbiAgICAgICAgIXRhcmdldC5jbG9zZXN0KFwiLnF1YW50aXR5XCIpXG4gICAgICApIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY2xhc3Nlcy5IQVNfRVJST1IpICYmXG4gICAgICAgICAgdGFyZ2V0LnZhbHVlLnRyaW0oKVxuICAgICAgICApIHtcbiAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcIi5pbnB1dFwiKS5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5JU19GSUxMRUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5jbG9zZXN0KFwiLmlucHV0XCIpLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLklTX0ZJTExFRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8vIHNhdmUgcGxhY2Vob2xkZXIgaW4gZGF0YSBhdHRyaWJ1dGVcbiAgICB0aGlzLnNhdmVQbGFjZWhvbGRlcigpO1xuXG4gICAgLy8gaGFuZGxlIHN1Ym1pdGlvblxuICAgIG5ldyBGb3JtU3VibWl0aW9uKCk7XG5cbiAgICAvLyBldmVudHNcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c2luXCIsIHRoaXMuaGFuZGxlRm9jdXNpbi5iaW5kKHRoaXMpKTtcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c291dFwiLCB0aGlzLmhhbmRsZUZvY3Vzb3V0LmJpbmQodGhpcykpO1xuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm5ldyBGb3JtRmllbGRzKCk7XG4iLCJpbXBvcnQgeyBtb2R1bGVzIH0gZnJvbSAnLi4vbW9kdWxlcy5qcyc7XG5pbXBvcnQgeyBib2R5TG9ja1N0YXR1cywgYm9keUxvY2ssIGJvZHlVbmxvY2sgfSBmcm9tICcuLi91dGlscy91dGlscy5qcyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNsYXNzIE1vZGFsIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGxldCBjb25maWcgPSB7XG4gICAgICBsb2dnaW5nOiB0cnVlLFxuICAgICAgaW5pdDogdHJ1ZSxcbiAgICAgIGF0dHJpYnV0ZU9wZW5CdXR0b246ICdkYXRhLW1vZGFsJyxcbiAgICAgIGF0dHJpYnV0ZUNsb3NlQnV0dG9uOiAnZGF0YS1jbG9zZScsXG4gICAgICBmaXhFbGVtZW50U2VsZWN0b3I6ICdbZGF0YS1scF0nLFxuICAgICAgeW91dHViZUF0dHJpYnV0ZTogJ2RhdGEtbW9kYWwteW91dHViZScsXG4gICAgICB5b3V0dWJlUGxhY2VBdHRyaWJ1dGU6ICdkYXRhLW1vZGFsLXlvdXR1YmUtcGxhY2UnLFxuICAgICAgc2V0QXV0b3BsYXlZb3V0dWJlOiB0cnVlLFxuICAgICAgY2xhc3Nlczoge1xuICAgICAgICBtb2RhbDogJ21vZGFsJyxcbiAgICAgICAgLy8gbW9kYWxXcmFwcGVyOiAnbW9kYWxfX3dyYXBwZXInLFxuICAgICAgICBtb2RhbENvbnRlbnQ6ICdtb2RhbF9fY29udGVudCcsXG4gICAgICAgIG1vZGFsQWN0aXZlOiAnbW9kYWxfc2hvdycsXG4gICAgICAgIGJvZHlBY3RpdmU6ICdtb2RhbC1zaG93JyxcbiAgICAgIH0sXG4gICAgICBmb2N1c0NhdGNoOiB0cnVlLFxuICAgICAgY2xvc2VFc2M6IHRydWUsXG4gICAgICBib2R5TG9jazogdHJ1ZSxcbiAgICAgIGhhc2hTZXR0aW5nczoge1xuICAgICAgICBsb2NhdGlvbjogdHJ1ZSxcbiAgICAgICAgZ29IYXNoOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIG9uOiB7XG4gICAgICAgIGJlZm9yZU9wZW46IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICBhZnRlck9wZW46IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICBiZWZvcmVDbG9zZTogZnVuY3Rpb24gKCkge30sXG4gICAgICAgIGFmdGVyQ2xvc2U6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgfSxcbiAgICB9O1xuICAgIHRoaXMueW91VHViZUNvZGU7XG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICB0aGlzLnRhcmdldE9wZW4gPSB7XG4gICAgICBzZWxlY3RvcjogZmFsc2UsXG4gICAgICBlbGVtZW50OiBmYWxzZSxcbiAgICB9O1xuICAgIHRoaXMucHJldmlvdXNPcGVuID0ge1xuICAgICAgc2VsZWN0b3I6IGZhbHNlLFxuICAgICAgZWxlbWVudDogZmFsc2UsXG4gICAgfTtcbiAgICB0aGlzLmxhc3RDbG9zZWQgPSB7XG4gICAgICBzZWxlY3RvcjogZmFsc2UsXG4gICAgICBlbGVtZW50OiBmYWxzZSxcbiAgICB9O1xuICAgIHRoaXMuX2RhdGFWYWx1ZSA9IGZhbHNlO1xuICAgIHRoaXMuaGFzaCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fcmVvcGVuID0gZmFsc2U7XG4gICAgdGhpcy5fc2VsZWN0b3JPcGVuID0gZmFsc2U7XG5cbiAgICB0aGlzLmxhc3RGb2N1c0VsID0gZmFsc2U7XG4gICAgdGhpcy5fZm9jdXNFbCA9IFtcbiAgICAgICdhW2hyZWZdJyxcbiAgICAgICdpbnB1dDpub3QoW2Rpc2FibGVkXSk6bm90KFt0eXBlPVwiaGlkZGVuXCJdKTpub3QoW2FyaWEtaGlkZGVuXSknLFxuICAgICAgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSk6bm90KFthcmlhLWhpZGRlbl0pJyxcbiAgICAgICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW5dKScsXG4gICAgICAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW5dKScsXG4gICAgICAnYXJlYVtocmVmXScsXG4gICAgICAnaWZyYW1lJyxcbiAgICAgICdvYmplY3QnLFxuICAgICAgJ2VtYmVkJyxcbiAgICAgICdbY29udGVudGVkaXRhYmxlXScsXG4gICAgICAnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4Xj1cIi1cIl0pJyxcbiAgICBdO1xuICAgIC8vdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihjb25maWcsIG9wdGlvbnMpO1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC4uLmNvbmZpZyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBjbGFzc2VzOiB7XG4gICAgICAgIC4uLmNvbmZpZy5jbGFzc2VzLFxuICAgICAgICAuLi5vcHRpb25zPy5jbGFzc2VzLFxuICAgICAgfSxcbiAgICAgIGhhc2hTZXR0aW5nczoge1xuICAgICAgICAuLi5jb25maWcuaGFzaFNldHRpbmdzLFxuICAgICAgICAuLi5vcHRpb25zPy5oYXNoU2V0dGluZ3MsXG4gICAgICB9LFxuICAgICAgb246IHtcbiAgICAgICAgLi4uY29uZmlnLm9uLFxuICAgICAgICAuLi5vcHRpb25zPy5vbixcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLmJvZHlMb2NrID0gZmFsc2U7XG4gICAgdGhpcy5vcHRpb25zLmluaXQgPyB0aGlzLmluaXRtb2RhbHMoKSA6IG51bGw7XG4gIH1cbiAgaW5pdG1vZGFscygpIHtcbiAgICB0aGlzLmV2ZW50c21vZGFsKCk7XG4gIH1cbiAgZXZlbnRzbW9kYWwoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjbGljaycsXG4gICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zdCBidXR0b25PcGVuID0gZS50YXJnZXQuY2xvc2VzdChcbiAgICAgICAgICBgWyR7dGhpcy5vcHRpb25zLmF0dHJpYnV0ZU9wZW5CdXR0b259XWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGJ1dHRvbk9wZW4pIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5fZGF0YVZhbHVlID0gYnV0dG9uT3Blbi5nZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuYXR0cmlidXRlT3BlbkJ1dHRvblxuICAgICAgICAgIClcbiAgICAgICAgICAgID8gYnV0dG9uT3Blbi5nZXRBdHRyaWJ1dGUodGhpcy5vcHRpb25zLmF0dHJpYnV0ZU9wZW5CdXR0b24pXG4gICAgICAgICAgICA6ICdlcnJvcic7XG4gICAgICAgICAgdGhpcy55b3VUdWJlQ29kZSA9IGJ1dHRvbk9wZW4uZ2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnlvdXR1YmVBdHRyaWJ1dGVcbiAgICAgICAgICApXG4gICAgICAgICAgICA/IGJ1dHRvbk9wZW4uZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy55b3V0dWJlQXR0cmlidXRlKVxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICAgIGlmICh0aGlzLl9kYXRhVmFsdWUgIT09ICdlcnJvcicpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc09wZW4pIHRoaXMubGFzdEZvY3VzRWwgPSBidXR0b25PcGVuO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRPcGVuLnNlbGVjdG9yID0gYCR7dGhpcy5fZGF0YVZhbHVlfWA7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rvck9wZW4gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJ1dHRvbkNsb3NlID0gZS50YXJnZXQuY2xvc2VzdChcbiAgICAgICAgICBgWyR7dGhpcy5vcHRpb25zLmF0dHJpYnV0ZUNsb3NlQnV0dG9ufV1gXG4gICAgICAgICk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhZS50YXJnZXQuY2xvc2VzdCgnI3VuY29uZmlybWVkQWdlTW9kYWwnKSAmJlxuICAgICAgICAgICFlLnRhcmdldC5jbG9zZXN0KCcjY29uZmlybUFnZU1vZGFsJykgJiZcbiAgICAgICAgICAoYnV0dG9uQ2xvc2UgfHxcbiAgICAgICAgICAgICghZS50YXJnZXQuY2xvc2VzdChgLiR7dGhpcy5vcHRpb25zLmNsYXNzZXMubW9kYWxDb250ZW50fWApICYmXG4gICAgICAgICAgICAgIHRoaXMuaXNPcGVuKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKVxuICAgICk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdrZXlkb3duJyxcbiAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuY2xvc2VFc2MgJiZcbiAgICAgICAgICBlLndoaWNoID09IDI3ICYmXG4gICAgICAgICAgZS5jb2RlID09PSAnRXNjYXBlJyAmJlxuICAgICAgICAgIHRoaXMuaXNPcGVuXG4gICAgICAgICkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZm9jdXNDYXRjaCAmJiBlLndoaWNoID09IDkgJiYgdGhpcy5pc09wZW4pIHtcbiAgICAgICAgICB0aGlzLl9mb2N1c0NhdGNoKGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpXG4gICAgKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzaFNldHRpbmdzLmdvSGFzaCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdoYXNoY2hhbmdlJyxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICAgICAgICAgICAgdGhpcy5fb3BlblRvSGFzaCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKHRoaXMudGFyZ2V0T3Blbi5zZWxlY3Rvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnbG9hZCcsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgICAgIHRoaXMuX29wZW5Ub0hhc2goKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgb3BlbihzZWxlY3RvclZhbHVlKSB7XG4gICAgaWYgKGJvZHlMb2NrU3RhdHVzKSB7XG4gICAgICB0aGlzLmJvZHlMb2NrID1cbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbG9jaycpICYmICF0aGlzLmlzT3BlblxuICAgICAgICAgID8gdHJ1ZVxuICAgICAgICAgIDogZmFsc2U7XG5cbiAgICAgIGlmIChcbiAgICAgICAgc2VsZWN0b3JWYWx1ZSAmJlxuICAgICAgICB0eXBlb2Ygc2VsZWN0b3JWYWx1ZSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgc2VsZWN0b3JWYWx1ZS50cmltKCkgIT09ICcnXG4gICAgICApIHtcbiAgICAgICAgdGhpcy50YXJnZXRPcGVuLnNlbGVjdG9yID0gc2VsZWN0b3JWYWx1ZTtcbiAgICAgICAgdGhpcy5fc2VsZWN0b3JPcGVuID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICB0aGlzLl9yZW9wZW4gPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX3NlbGVjdG9yT3BlbilcbiAgICAgICAgdGhpcy50YXJnZXRPcGVuLnNlbGVjdG9yID0gdGhpcy5sYXN0Q2xvc2VkLnNlbGVjdG9yO1xuICAgICAgaWYgKCF0aGlzLl9yZW9wZW4pIHRoaXMucHJldmlvdXNBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblxuICAgICAgdGhpcy50YXJnZXRPcGVuLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICB0aGlzLnRhcmdldE9wZW4uc2VsZWN0b3JcbiAgICAgICk7XG5cbiAgICAgIGlmICh0aGlzLnRhcmdldE9wZW4uZWxlbWVudCkge1xuICAgICAgICBpZiAodGhpcy55b3VUdWJlQ29kZSkge1xuICAgICAgICAgIGNvbnN0IGNvZGVWaWRlbyA9IHRoaXMueW91VHViZUNvZGU7XG4gICAgICAgICAgY29uc3QgdXJsVmlkZW8gPSBgaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJHtjb2RlVmlkZW99P3JlbD0wJnNob3dpbmZvPTAmYXV0b3BsYXk9MWA7XG4gICAgICAgICAgY29uc3QgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnYWxsb3dmdWxsc2NyZWVuJywgJycpO1xuXG4gICAgICAgICAgY29uc3QgYXV0b3BsYXkgPSB0aGlzLm9wdGlvbnMuc2V0QXV0b3BsYXlZb3V0dWJlID8gJ2F1dG9wbGF5OycgOiAnJztcbiAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdhbGxvdycsIGAke2F1dG9wbGF5fTsgZW5jcnlwdGVkLW1lZGlhYCk7XG5cbiAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzcmMnLCB1cmxWaWRlbyk7XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy50YXJnZXRPcGVuLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgYFske3RoaXMub3B0aW9ucy55b3V0dWJlUGxhY2VBdHRyaWJ1dGV9XWBcbiAgICAgICAgICAgIClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IHlvdXR1YmVQbGFjZSA9IHRoaXMudGFyZ2V0T3Blbi5lbGVtZW50XG4gICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfX3RleHQnKVxuICAgICAgICAgICAgICAuc2V0QXR0cmlidXRlKGAke3RoaXMub3B0aW9ucy55b3V0dWJlUGxhY2VBdHRyaWJ1dGV9YCwgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRhcmdldE9wZW4uZWxlbWVudFxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoYFske3RoaXMub3B0aW9ucy55b3V0dWJlUGxhY2VBdHRyaWJ1dGV9XWApXG4gICAgICAgICAgICAuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmhhc2hTZXR0aW5ncy5sb2NhdGlvbikge1xuICAgICAgICAgIHRoaXMuX2dldEhhc2goKTtcbiAgICAgICAgICB0aGlzLl9zZXRIYXNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9wdGlvbnMub24uYmVmb3JlT3Blbih0aGlzKTtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2JlZm9yZW1vZGFsT3BlbicsIHtcbiAgICAgICAgICAgIGRldGFpbDoge1xuICAgICAgICAgICAgICBtb2RhbDogdGhpcyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnRhcmdldE9wZW4uZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMub3B0aW9ucy5jbGFzc2VzLm1vZGFsQWN0aXZlKTtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5vcHRpb25zLmNsYXNzZXMuYm9keUFjdGl2ZSk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9yZW9wZW4pIHtcbiAgICAgICAgICBjb25zdCBtID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmhhc2gpO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgKCF0aGlzLmJvZHlMb2NrICYmICFtLmhhc0F0dHJpYnV0ZSgnZGF0YS1ibC1tb2JpbGUnKSkgfHxcbiAgICAgICAgICAgICghdGhpcy5ib2R5TG9jayAmJlxuICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCA8PSA3NjggJiZcbiAgICAgICAgICAgICAgbS5oYXNBdHRyaWJ1dGUoJ2RhdGEtYmwtbW9iaWxlJykpXG4gICAgICAgICAgICAgID8gYm9keUxvY2soKVxuICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH0gZWxzZSB0aGlzLl9yZW9wZW4gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLnRhcmdldE9wZW4uZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgdGhpcy5wcmV2aW91c09wZW4uc2VsZWN0b3IgPSB0aGlzLnRhcmdldE9wZW4uc2VsZWN0b3I7XG4gICAgICAgIHRoaXMucHJldmlvdXNPcGVuLmVsZW1lbnQgPSB0aGlzLnRhcmdldE9wZW4uZWxlbWVudDtcblxuICAgICAgICB0aGlzLl9zZWxlY3Rvck9wZW4gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZm9jdXNUcmFwKCk7XG4gICAgICAgIH0sIDUwKTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMub24uYWZ0ZXJPcGVuKHRoaXMpO1xuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudCgnYWZ0ZXJtb2RhbE9wZW4nLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgbW9kYWw6IHRoaXMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGNsb3NlKHNlbGVjdG9yVmFsdWUpIHtcbiAgICBpZiAoXG4gICAgICBzZWxlY3RvclZhbHVlICYmXG4gICAgICB0eXBlb2Ygc2VsZWN0b3JWYWx1ZSA9PT0gJ3N0cmluZycgJiZcbiAgICAgIHNlbGVjdG9yVmFsdWUudHJpbSgpICE9PSAnJ1xuICAgICkge1xuICAgICAgdGhpcy5wcmV2aW91c09wZW4uc2VsZWN0b3IgPSBzZWxlY3RvclZhbHVlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNPcGVuIHx8ICFib2R5TG9ja1N0YXR1cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm9wdGlvbnMub24uYmVmb3JlQ2xvc2UodGhpcyk7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnYmVmb3JlbW9kYWxDbG9zZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgbW9kYWw6IHRoaXMsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBpZiAodGhpcy55b3VUdWJlQ29kZSkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnRhcmdldE9wZW4uZWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGBbJHt0aGlzLm9wdGlvbnMueW91dHViZVBsYWNlQXR0cmlidXRlfV1gXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgICAgdGhpcy50YXJnZXRPcGVuLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgWyR7dGhpcy5vcHRpb25zLnlvdXR1YmVQbGFjZUF0dHJpYnV0ZX1dYFxuICAgICAgICApLmlubmVySFRNTCA9ICcnO1xuICAgIH1cbiAgICB0aGlzLnByZXZpb3VzT3Blbi5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICB0aGlzLm9wdGlvbnMuY2xhc3Nlcy5tb2RhbEFjdGl2ZVxuICAgICk7XG4gICAgLy8gYXJpYS1oaWRkZW5cbiAgICB0aGlzLnByZXZpb3VzT3Blbi5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIGlmICghdGhpcy5fcmVvcGVuKSB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgICAgdGhpcy5vcHRpb25zLmNsYXNzZXMuYm9keUFjdGl2ZVxuICAgICAgKTtcbiAgICAgICF0aGlzLmJvZHlMb2NrID8gYm9keVVubG9jaygpIDogbnVsbDtcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuX3JlbW92ZUhhc2goKTtcbiAgICBpZiAodGhpcy5fc2VsZWN0b3JPcGVuKSB7XG4gICAgICB0aGlzLmxhc3RDbG9zZWQuc2VsZWN0b3IgPSB0aGlzLnByZXZpb3VzT3Blbi5zZWxlY3RvcjtcbiAgICAgIHRoaXMubGFzdENsb3NlZC5lbGVtZW50ID0gdGhpcy5wcmV2aW91c09wZW4uZWxlbWVudDtcbiAgICB9XG4gICAgdGhpcy5vcHRpb25zLm9uLmFmdGVyQ2xvc2UodGhpcyk7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudCgnYWZ0ZXJtb2RhbENsb3NlJywge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBtb2RhbDogdGhpcyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fZm9jdXNUcmFwKCk7XG4gICAgfSwgNTApO1xuICB9XG4gIF9nZXRIYXNoKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuaGFzaFNldHRpbmdzLmxvY2F0aW9uKSB7XG4gICAgICB0aGlzLmhhc2ggPSB0aGlzLnRhcmdldE9wZW4uc2VsZWN0b3IuaW5jbHVkZXMoJyMnKVxuICAgICAgICA/IHRoaXMudGFyZ2V0T3Blbi5zZWxlY3RvclxuICAgICAgICA6IHRoaXMudGFyZ2V0T3Blbi5zZWxlY3Rvci5yZXBsYWNlKCcuJywgJyMnKTtcbiAgICB9XG4gIH1cbiAgX29wZW5Ub0hhc2goKSB7XG4gICAgbGV0IGNsYXNzSW5IYXNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIGAuJHt3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpfWBcbiAgICApXG4gICAgICA/IGAuJHt3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpfWBcbiAgICAgIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgJHt3aW5kb3cubG9jYXRpb24uaGFzaH1gKVxuICAgICAgPyBgJHt3aW5kb3cubG9jYXRpb24uaGFzaH1gXG4gICAgICA6IG51bGw7XG5cbiAgICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIGBbJHt0aGlzLm9wdGlvbnMuYXR0cmlidXRlT3BlbkJ1dHRvbn0gPSBcIiR7Y2xhc3NJbkhhc2h9XCJdYFxuICAgIClcbiAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgWyR7dGhpcy5vcHRpb25zLmF0dHJpYnV0ZU9wZW5CdXR0b259ID0gXCIke2NsYXNzSW5IYXNofVwiXWBcbiAgICAgICAgKVxuICAgICAgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGBbJHt0aGlzLm9wdGlvbnMuYXR0cmlidXRlT3BlbkJ1dHRvbn0gPSBcIiR7Y2xhc3NJbkhhc2gucmVwbGFjZShcbiAgICAgICAgICAgICcuJyxcbiAgICAgICAgICAgICcjJ1xuICAgICAgICAgICl9XCJdYFxuICAgICAgICApO1xuICAgIGlmIChidXR0b25zICYmIGNsYXNzSW5IYXNoKSB0aGlzLm9wZW4oY2xhc3NJbkhhc2gpO1xuICB9XG4gIF9zZXRIYXNoKCkge1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKCcnLCAnJywgdGhpcy5oYXNoKTtcbiAgfVxuICBfcmVtb3ZlSGFzaCgpIHtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMF0pO1xuICB9XG4gIF9mb2N1c0NhdGNoKGUpIHtcbiAgICBjb25zdCBmb2N1c2FibGUgPSB0aGlzLnRhcmdldE9wZW4uZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuX2ZvY3VzRWwpO1xuICAgIGNvbnN0IGZvY3VzQXJyYXkgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmb2N1c2FibGUpO1xuICAgIGNvbnN0IGZvY3VzZWRJbmRleCA9IGZvY3VzQXJyYXkuaW5kZXhPZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcblxuICAgIGlmIChlLnNoaWZ0S2V5ICYmIGZvY3VzZWRJbmRleCA9PT0gMCkge1xuICAgICAgZm9jdXNBcnJheVtmb2N1c0FycmF5Lmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGlmICghZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IGZvY3VzQXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgZm9jdXNBcnJheVswXS5mb2N1cygpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuICBfZm9jdXNUcmFwKCkge1xuICAgIGNvbnN0IGZvY3VzYWJsZSA9IHRoaXMucHJldmlvdXNPcGVuLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLl9mb2N1c0VsKTtcbiAgICBpZiAoIXRoaXMuaXNPcGVuICYmIHRoaXMubGFzdEZvY3VzRWwpIHtcbiAgICAgIHRoaXMubGFzdEZvY3VzRWwuZm9jdXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9jdXNhYmxlWzBdLmZvY3VzKCk7XG4gICAgfVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZXMubW9kYWwgPSBuZXcgTW9kYWwoe30pO1xuIiwiaW1wb3J0IHsgc2V0SGFzaCwgZ2V0SGFzaCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNsYXNzIFRhYnMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmF0dHJzID0ge1xuICAgICAgVEFCUzogXCJkYXRhLXRhYnNcIixcbiAgICAgIElOREVYOiBcImRhdGEtdGFicy1pbmRleFwiLFxuICAgICAgVElUTEVTOiBcImRhdGEtdGFicy10aXRsZXNcIixcbiAgICAgIFRJVExFOiBcImRhdGEtdGFicy10aXRsZVwiLFxuICAgICAgVEFCX0lURU06IFwiZGF0YS10YWJzLWl0ZW1cIixcbiAgICAgIEJPRFk6IFwiZGF0YS10YWJzLWJvZHlcIixcbiAgICAgIEhBU0g6IFwiZGF0YS10YWJzLWhhc2hcIixcbiAgICB9O1xuICAgIHRoaXMuY2xhc3NlcyA9IHtcbiAgICAgIElOSVQ6IFwiX3RhYnMtaW5pdFwiLFxuICAgICAgQUNUSVZFOiBcIl9pcy1hY3RpdmVcIixcbiAgICAgIE1PREFMOiBcIm1vZGFsXCIsXG4gICAgfTtcbiAgICB0aGlzLnRhYnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS10YWJzXWApO1xuICAgIHRoaXMuYWN0aXZlSGFzaCA9IFtdO1xuXG4gICAgaWYgKHRoaXMudGFicy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGhhc2ggPSBnZXRIYXNoKCk7XG5cbiAgICAgIGlmIChoYXNoICYmIGhhc2guc3RhcnRzV2l0aChcInRhYi1cIikpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVIYXNoID0gaGFzaC5yZXBsYWNlKFwidGFiLVwiLCBcIlwiKS5zcGxpdChcIi1cIik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGFicy5mb3JFYWNoKCh0YWJzQmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICAgIHRhYnNCbG9jay5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5JTklUKTtcbiAgICAgICAgdGFic0Jsb2NrLnNldEF0dHJpYnV0ZSh0aGlzLmF0dHJzLklOREVYLCBpbmRleCk7XG4gICAgICAgIHRhYnNCbG9jay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5zZXRBY3Rpb25zLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmluaXQodGFic0Jsb2NrKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldFN0YXR1cyh0YWJzQmxvY2spIHtcbiAgICBsZXQgdGl0bGVzID0gdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoYFske3RoaXMuYXR0cnMuVElUTEV9XWApO1xuICAgIGxldCBjb250ZW50ID0gdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoYFske3RoaXMuYXR0cnMuVEFCX0lURU19XWApO1xuICAgIGNvbnN0IGluZGV4ID0gdGFic0Jsb2NrLmRhdGFzZXQudGFic0luZGV4O1xuXG4gICAgaWYgKGNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBoYXNIYXNoID0gdGFic0Jsb2NrLmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJzLkhBU0gpO1xuXG4gICAgICBjb250ZW50ID0gQXJyYXkuZnJvbShjb250ZW50KS5maWx0ZXIoXG4gICAgICAgIChpdGVtKSA9PiBpdGVtLmNsb3Nlc3QoYFske3RoaXMuYXR0cnMuVEFCU31dYCkgPT09IHRhYnNCbG9jayxcbiAgICAgICk7XG5cbiAgICAgIHRpdGxlcyA9IEFycmF5LmZyb20odGl0bGVzKS5maWx0ZXIoXG4gICAgICAgIChpdGVtKSA9PiBpdGVtLmNsb3Nlc3QoYFske3RoaXMuYXR0cnMuVEFCU31dYCkgPT09IHRhYnNCbG9jayxcbiAgICAgICk7XG5cbiAgICAgIGNvbnRlbnQuZm9yRWFjaCgoaXRlbSwgaW5keCkgPT4ge1xuICAgICAgICBpZiAodGl0bGVzW2luZHhdLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNsYXNzZXMuQUNUSVZFKSkge1xuICAgICAgICAgIGl0ZW0uaGlkZGVuID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAoaGFzSGFzaCAmJiAhaXRlbS5jbG9zZXN0KGAuJHt0aGlzLmNsYXNzZXMuTU9EQUx9YCkpIHtcbiAgICAgICAgICAgIHNldEhhc2goYHRhYi0ke2luZGV4fS0ke2luZHh9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0uaGlkZGVuID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0QWN0aW9ucyhlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICBpZiAodGFyZ2V0LmNsb3Nlc3QoYFske3RoaXMuYXR0cnMuVElUTEV9XWApKSB7XG4gICAgICBjb25zdCB0aXRsZSA9IHRhcmdldC5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRJVExFfV1gKTtcbiAgICAgIGNvbnN0IHRhYnNCbG9jayA9IHRpdGxlLmNsb3Nlc3QoYFske3RoaXMuYXR0cnMuVEFCU31dYCk7XG5cbiAgICAgIGlmICghdGl0bGUuY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY2xhc3Nlcy5BQ1RJVkUpKSB7XG4gICAgICAgIGxldCBhY3RpdmVUaXRsZSA9IHRhYnNCbG9jay5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgIGBbJHt0aGlzLmF0dHJzLlRJVExFfV0uJHt0aGlzLmNsYXNzZXMuQUNUSVZFfWAsXG4gICAgICAgICk7XG5cbiAgICAgICAgYWN0aXZlVGl0bGUubGVuZ3RoXG4gICAgICAgICAgPyAoYWN0aXZlVGl0bGUgPSBBcnJheS5mcm9tKGFjdGl2ZVRpdGxlKS5maWx0ZXIoXG4gICAgICAgICAgICAgIChpdGVtKSA9PiBpdGVtLmNsb3Nlc3QoYFske3RoaXMuYXR0cnMuVEFCU31dYCkgPT09IHRhYnNCbG9jayxcbiAgICAgICAgICAgICkpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICBhY3RpdmVUaXRsZS5sZW5ndGhcbiAgICAgICAgICA/IGFjdGl2ZVRpdGxlWzBdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkFDVElWRSlcbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkFDVElWRSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzKHRhYnNCbG9jayk7XG4gICAgICB9XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBpbml0KHRhYnNCbG9jaykge1xuICAgIGxldCB0aXRsZXMgPSB0YWJzQmxvY2sucXVlcnlTZWxlY3RvckFsbChgWyR7dGhpcy5hdHRycy5USVRMRVN9XT4qYCk7XG4gICAgbGV0IGNvbnRlbnQgPSB0YWJzQmxvY2sucXVlcnlTZWxlY3RvckFsbChgWyR7dGhpcy5hdHRycy5CT0RZfV0+KmApO1xuICAgIGNvbnN0IGluZGV4ID0gdGFic0Jsb2NrLmRhdGFzZXQudGFic0luZGV4O1xuICAgIGNvbnN0IGFjdGl2ZUhhc2hCbG9jayA9IHRoaXMuYWN0aXZlSGFzaFswXSA9PSBpbmRleDtcblxuICAgIGlmIChhY3RpdmVIYXNoQmxvY2spIHtcbiAgICAgIGNvbnN0IGFjdGl2ZVRpdGxlID0gdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbJHt0aGlzLmF0dHJzLlRJVExFU31dPi4ke3RoaXMuY2xhc3Nlcy5BQ1RJVkV9YCxcbiAgICAgICk7XG4gICAgICBhY3RpdmVUaXRsZSA/IGFjdGl2ZVRpdGxlLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkFDVElWRSkgOiBudWxsO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50Lmxlbmd0aCkge1xuICAgICAgY29udGVudCA9IEFycmF5LmZyb20oY29udGVudCkuZmlsdGVyKFxuICAgICAgICAoaXRlbSkgPT4gaXRlbS5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRBQlN9XWApID09PSB0YWJzQmxvY2ssXG4gICAgICApO1xuICAgICAgdGl0bGVzID0gQXJyYXkuZnJvbSh0aXRsZXMpLmZpbHRlcihcbiAgICAgICAgKGl0ZW0pID0+IGl0ZW0uY2xvc2VzdChgWyR7dGhpcy5hdHRycy5UQUJTfV1gKSA9PT0gdGFic0Jsb2NrLFxuICAgICAgKTtcblxuICAgICAgY29udGVudC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICB0aXRsZXNbaW5kZXhdLnNldEF0dHJpYnV0ZSh0aGlzLmF0dHJzLlRJVExFLCBcIlwiKTtcbiAgICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUodGhpcy5hdHRycy5UQUJfSVRFTSwgXCJcIik7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUhhc2hCbG9jayAmJiBpbmRleCA9PSB0aGlzLmFjdGl2ZUhhc2hbMV0pIHtcbiAgICAgICAgICB0aXRsZXNbaW5kZXhdLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkFDVElWRSk7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbS5oaWRkZW4gPSAhdGl0bGVzW2luZGV4XS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jbGFzc2VzLkFDVElWRSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubmV3IFRhYnMoKTtcbiIsIi8qKlxuICogc2V0IGhhc2ggdG8gdXJsXG4gKiBAcGFyYW0ge3N0cmluZ30gaGFzaFxuICovXG5leHBvcnQgY29uc3Qgc2V0SGFzaCA9IChoYXNoKSA9PiB7XG4gICAgaGFzaCA9IGhhc2ggPyBgIyR7aGFzaH1gIDogd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXTtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIGhhc2gpO1xufTtcblxuLyoqXG4gKiBnZXQgaGFzaCBmcm9tIHVybFxuICogQHJldHVybnMgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRIYXNoID0gKCkgPT4ge1xuICAgIGlmIChsb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgIHJldHVybiBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBpbml0aWFsaXplcyBoYW1idXJnZXIgbWVudVxuICovXG5leHBvcnQgY29uc3QgbWVudUluaXQgPSAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKSkge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAoYm9keUxvY2tTdGF0dXMgJiYgZS50YXJnZXQuY2xvc2VzdCgnLmhhbWJ1cmdlcicpKSB7XG4gICAgICAgICAgICAgICAgbWVudU9wZW4oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgYm9keUxvY2tTdGF0dXMgJiZcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdfbWVudS1vcGVuZWQnKSAmJlxuICAgICAgICAgICAgICAgIChlLnRhcmdldC5jbG9zZXN0KCcubWVudV9fY2xvc2UtYnRuJykgfHwgIWUudGFyZ2V0LmNsb3Nlc3QoJy5tZW51JykpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBtZW51Q2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbi8qKlxuICogb3BlbnMgaGFtYnVyZ2VyIG1lbnVcbiAqL1xuZXhwb3J0IGNvbnN0IG1lbnVPcGVuID0gKCkgPT4ge1xuICAgIGJvZHlMb2NrKCk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ19tZW51LW9wZW5lZCcpO1xufTtcbi8qKlxuICogY2xvc2VzIGhhbWJ1cmdlciBtZW51XG4gKi9cbmV4cG9ydCBjb25zdCBtZW51Q2xvc2UgPSAoKSA9PiB7XG4gICAgYm9keVVubG9jaygpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdfbWVudS1vcGVuZWQnKTtcbn07XG5cbi8vIGJvZHkgbG9ja1xuZXhwb3J0IGxldCBib2R5TG9ja1N0YXR1cyA9IHRydWU7XG4vKipcbiAqIHRvZ2dsZXMgYm9keSBsb2NrXG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAqL1xuZXhwb3J0IGNvbnN0IGJvZHlMb2NrVG9nZ2xlID0gKGRlbGF5ID0gNTAwKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvY2snKSkge1xuICAgICAgICBib2R5VW5sb2NrKGRlbGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBib2R5TG9jayhkZWxheSk7XG4gICAgfVxufTtcbi8qKlxuICogdW5sb2NrcyBib2R5XG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAqL1xuZXhwb3J0IGNvbnN0IGJvZHlVbmxvY2sgPSAoZGVsYXkgPSA1MDApID0+IHtcbiAgICBpZiAoYm9keUxvY2tTdGF0dXMpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbG9jaycpO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgIGJvZHlMb2NrU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYm9keUxvY2tTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgfVxufTtcbi8qKlxuICogbG9ja3MgYm9keVxuICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5XG4gKi9cbmV4cG9ydCBjb25zdCBib2R5TG9jayA9IChkZWxheSA9IDUwMCkgPT4ge1xuICAgIGlmIChib2R5TG9ja1N0YXR1cykge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbG9jaycpO1xuXG4gICAgICAgIGJvZHlMb2NrU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYm9keUxvY2tTdGF0dXMgPSB0cnVlO1xuICAgICAgICB9LCBkZWxheSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBtYWtlIHRoZSBhcnJheSB1bmlxdWVcbiAqIEBwYXJhbSB7YXJyYXl9IGFycmF5XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcXVlQXJyYXkoYXJyYXkpIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgc2VsZikge1xuICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKGl0ZW0pID09PSBpbmRleDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHthcnJheX0gYXJyYXlcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRhU2V0VmFsdWVcbiAqIHByb2Nlc3MgbWVkaWEgcmVxdWVzdHMgZnJvbSBhdHRyaWJ1dGVzXG4gKi9cbmV4cG9ydCBjb25zdCBkYXRhTWVkaWFRdWVyaWVzID0gKGFycmF5LCBkYXRhU2V0VmFsdWUpID0+IHtcbiAgICAvLyBnZXQgb2JqZWN0cyB3aXRoIG1lZGlhIHF1ZXJpZXNcbiAgICBjb25zdCBtZWRpYSA9IEFycmF5LmZyb20oYXJyYXkpLmZpbHRlcihmdW5jdGlvbiAoaXRlbSwgaW5kZXgsIHNlbGYpIHtcbiAgICAgICAgaWYgKGl0ZW0uZGF0YXNldFtkYXRhU2V0VmFsdWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5kYXRhc2V0W2RhdGFTZXRWYWx1ZV0uc3BsaXQoJywnKVswXTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIG9iamVjdHMgd2l0aCBtZWRpYSBxdWVyaWVzIGluaXRpYWxpemF0aW9uXG4gICAgaWYgKG1lZGlhLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBicmVha3BvaW50c0FycmF5ID0gW107XG4gICAgICAgIG1lZGlhLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IGl0ZW0uZGF0YXNldFtkYXRhU2V0VmFsdWVdO1xuICAgICAgICAgICAgY29uc3QgYnJlYWtwb2ludCA9IHt9O1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zQXJyYXkgPSBwYXJhbXMuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQudmFsdWUgPSBwYXJhbXNBcnJheVswXTtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQudHlwZSA9IHBhcmFtc0FycmF5WzFdID8gcGFyYW1zQXJyYXlbMV0udHJpbSgpIDogJ21heCc7XG4gICAgICAgICAgICBicmVha3BvaW50Lml0ZW0gPSBpdGVtO1xuICAgICAgICAgICAgYnJlYWtwb2ludHNBcnJheS5wdXNoKGJyZWFrcG9pbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gZ2V0IHVuaXF1ZSBicmVha3BvaW50c1xuICAgICAgICBsZXQgbWRRdWVyaWVzID0gYnJlYWtwb2ludHNBcnJheS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiAnKCcgKyBpdGVtLnR5cGUgKyAnLXdpZHRoOiAnICsgaXRlbS52YWx1ZSArICdweCksJyArIGl0ZW0udmFsdWUgKyAnLCcgKyBpdGVtLnR5cGU7XG4gICAgICAgIH0pO1xuICAgICAgICBtZFF1ZXJpZXMgPSB1bmlxdWVBcnJheShtZFF1ZXJpZXMpO1xuICAgICAgICBjb25zdCBtZFF1ZXJpZXNBcnJheSA9IFtdO1xuXG4gICAgICAgIGlmIChtZFF1ZXJpZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyB3b3JrIHdpdGggZXZlcnkgYnJlYWtwb2ludFxuICAgICAgICAgICAgbWRRdWVyaWVzLmZvckVhY2goKGJyZWFrcG9pbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXNBcnJheSA9IGJyZWFrcG9pbnQuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZWRpYUJyZWFrcG9pbnQgPSBwYXJhbXNBcnJheVsxXTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZWRpYVR5cGUgPSBwYXJhbXNBcnJheVsyXTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaE1lZGlhID0gd2luZG93Lm1hdGNoTWVkaWEocGFyYW1zQXJyYXlbMF0pO1xuICAgICAgICAgICAgICAgIC8vIG9iamVjdHMgd2l0aCBjb25kaXRpb25zXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbXNBcnJheSA9IGJyZWFrcG9pbnRzQXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnZhbHVlID09PSBtZWRpYUJyZWFrcG9pbnQgJiYgaXRlbS50eXBlID09PSBtZWRpYVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbWRRdWVyaWVzQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zQXJyYXksXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoTWVkaWFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG1kUXVlcmllc0FycmF5O1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBzbW9vdGhseSBzbGlkZXMgdXBcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNob3dtb3JlXG4gKi9cbmV4cG9ydCBjb25zdCBfc2xpZGVVcCA9ICh0YXJnZXQsIGR1cmF0aW9uID0gNTAwLCBzaG93bW9yZSA9IDApID0+IHtcbiAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ19zbGlkZScpKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdfc2xpZGUnKTtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9ICdoZWlnaHQsIG1hcmdpbiwgcGFkZGluZyc7XG4gICAgICAgIHRhcmdldC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBkdXJhdGlvbiArICdtcyc7XG4gICAgICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSBgJHt0YXJnZXQub2Zmc2V0SGVpZ2h0fXB4YDtcbiAgICAgICAgdGFyZ2V0Lm9mZnNldEhlaWdodDtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSBzaG93bW9yZSA/IGAke3Nob3dtb3JlfXJlbWAgOiBgMGA7XG4gICAgICAgIHRhcmdldC5zdHlsZS5wYWRkaW5nVG9wID0gMDtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAwO1xuICAgICAgICB0YXJnZXQuc3R5bGUubWFyZ2luVG9wID0gMDtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLm1hcmdpbkJvdHRvbSA9IDA7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRhcmdldC5oaWRkZW4gPSAhc2hvd21vcmUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAhc2hvd21vcmUgPyB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ2hlaWdodCcpIDogbnVsbDtcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgncGFkZGluZy10b3AnKTtcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgncGFkZGluZy1ib3R0b20nKTtcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnbWFyZ2luLXRvcCcpO1xuICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdtYXJnaW4tYm90dG9tJyk7XG4gICAgICAgICAgICAhc2hvd21vcmUgPyB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ292ZXJmbG93JykgOiBudWxsO1xuICAgICAgICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCd0cmFuc2l0aW9uLWR1cmF0aW9uJyk7XG4gICAgICAgICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24tcHJvcGVydHknKTtcbiAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdfc2xpZGUnKTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBldmVudFxuICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ3NsaWRlVXBEb25lJywge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgIH1cbn07XG5cbi8qKlxuICogc21vb3RobHkgc2xpZGVzIGRvd25cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNob3dtb3JlXG4gKi9cbmV4cG9ydCBjb25zdCBfc2xpZGVEb3duID0gKHRhcmdldCwgZHVyYXRpb24gPSA1MDAsIHNob3dtb3JlID0gMCkgPT4ge1xuICAgIGlmICghdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnX3NsaWRlJykpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ19zbGlkZScpO1xuICAgICAgICB0YXJnZXQuaGlkZGVuID0gdGFyZ2V0LmhpZGRlbiA/IGZhbHNlIDogbnVsbDtcbiAgICAgICAgc2hvd21vcmUgPyB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ2hlaWdodCcpIDogbnVsbDtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRhcmdldC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICB0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gc2hvd21vcmUgPyBgJHtzaG93bW9yZX1yZW1gIDogYDBgO1xuICAgICAgICB0YXJnZXQuc3R5bGUucGFkZGluZ1RvcCA9IDA7XG4gICAgICAgIHRhcmdldC5zdHlsZS5wYWRkaW5nQm90dG9tID0gMDtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLm1hcmdpblRvcCA9IDA7XG4gICAgICAgIHRhcmdldC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAwO1xuICAgICAgICB0YXJnZXQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB0YXJnZXQuc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gJ2hlaWdodCwgbWFyZ2luLCBwYWRkaW5nJztcbiAgICAgICAgdGFyZ2V0LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGR1cmF0aW9uICsgJ21zJztcbiAgICAgICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgncGFkZGluZy10b3AnKTtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdwYWRkaW5nLWJvdHRvbScpO1xuICAgICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ21hcmdpbi10b3AnKTtcbiAgICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdtYXJnaW4tYm90dG9tJyk7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnaGVpZ2h0Jyk7XG4gICAgICAgICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ292ZXJmbG93Jyk7XG4gICAgICAgICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24tZHVyYXRpb24nKTtcbiAgICAgICAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbi1wcm9wZXJ0eScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ19zbGlkZScpO1xuICAgICAgICAgICAgLy8gY3JlYXRlIGV2ZW50XG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudCgnc2xpZGVEb3duRG9uZScsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sIGR1cmF0aW9uKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIHRvZ2dsZXMgc21vb3RoIHNsaWRlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxuICogQHJldHVybnMgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IF9zbGlkZVRvZ2dsZSA9ICh0YXJnZXQsIGR1cmF0aW9uID0gNTAwKSA9PiB7XG4gICAgaWYgKHRhcmdldC5oaWRkZW4pIHtcbiAgICAgICAgcmV0dXJuIF9zbGlkZURvd24odGFyZ2V0LCBkdXJhdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF9zbGlkZVVwKHRhcmdldCwgZHVyYXRpb24pO1xuICAgIH1cbn07XG5cbi8qKlxuICogY29udmVydHMgcmVtIHRvIHBpeGVsc1xuICogQHBhcmFtIHtudW1iZXJ9IHJlbVZhbHVlXG4gKiBAcmV0dXJucyBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbVRvUHgocmVtVmFsdWUpIHtcbiAgICBjb25zdCBodG1sRm9udFNpemUgPSBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5mb250U2l6ZSk7XG5cbiAgICBjb25zdCBweFZhbHVlID0gcmVtVmFsdWUgKiBodG1sRm9udFNpemU7XG5cbiAgICByZXR1cm4gTWF0aC5yb3VuZChweFZhbHVlKSArICdweCc7XG59XG5cbi8qKlxuICogc2V0IGN1cnJlbnQgeWVhclxuICovXG5leHBvcnQgY29uc3Qgc2V0Q3VycmVudFllYXIgPSAoKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyZW50WWVhcicpKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXJyZW50WWVhcicpLmlubmVySFRNTCA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgICB9XG59O1xuXG4vLyByZW1vdmUgY2xhc3MgZnJvbSBhbGwgYXJyYXkgZWxlbWVudHNcbmV4cG9ydCBjb25zdCByZW1vdmVDbGFzc2VzID0gKGFycmF5LCBjbGFzc05hbWUpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFycmF5W2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG59O1xuIiwiLy8gSW1wb3J0c1xudmFyIF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIik7XG52YXIgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIik7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiQGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Ob3RvK1NhbnM6d2R0aCx3Z2h0QDc1LDEwMC4uOTAwJmRpc3BsYXk9c3dhcCk7XCJdKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiBcIkJhaG5zY2hyaWZ0XCI7XG4gIHNyYzogdXJsKFwiLi4vYXNzZXRzL2ZvbnRzL0JhaG5zY2hyaWZ0LndvZmYyXCIpIGZvcm1hdChcIndvZmYyXCIpO1xuICBmb250LXdlaWdodDogNDAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG4qLFxuKjo6YmVmb3JlLFxuKjo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG5odG1sIHtcbiAgZm9udC1mYW1pbHk6IFwiTm90byBTYW5zXCI7XG4gIGZvbnQtc2l6ZTogMC41MjA4MzM1dnc7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgLXdlYmtpdC1hbmltYXRpb246IGJ1Z2ZpeCBpbmZpbml0ZSAxcztcbiAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgbWFyZ2luOiAwO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbmJvZHkge1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBidWdmaXggaW5maW5pdGUgMXM7XG4gIGxpbmUtaGVpZ2h0OiAxLjI7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBmb250LXNpemU6IDEuOHJlbTtcbiAgY29sb3I6ICMwMDFiMzA7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG59XG5cbmlucHV0LFxudGV4dGFyZWEge1xuICAtd2Via2l0LWFuaW1hdGlvbjogYnVnZml4IGluZmluaXRlIDFzO1xuICBsaW5lLWhlaWdodDogaW5oZXJpdDtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyOiBub25lO1xuICBjb2xvcjogaW5oZXJpdDtcbn1cblxuYSB7XG4gIGNvbG9yOiB1bnNldDtcbn1cblxuYSxcbmE6aG92ZXIge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG5cbmJ1dHRvbixcbmlucHV0LFxuYSxcbnRleHRhcmVhIHtcbiAgb3V0bGluZTogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250OiBpbmhlcml0O1xufVxuYnV0dG9uOmZvY3VzLFxuaW5wdXQ6Zm9jdXMsXG5hOmZvY3VzLFxudGV4dGFyZWE6Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xufVxuYnV0dG9uOmFjdGl2ZSxcbmlucHV0OmFjdGl2ZSxcbmE6YWN0aXZlLFxudGV4dGFyZWE6YWN0aXZlIHtcbiAgb3V0bGluZTogbm9uZTtcbn1cblxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2IHtcbiAgZm9udDogaW5oZXJpdDtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG5wIHtcbiAgbWFyZ2luLXRvcDogMDtcbiAgbWFyZ2luLWJvdHRvbTogMDtcbn1cblxuaW1nIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbmJ1dHRvbiB7XG4gIGJvcmRlcjogbm9uZTtcbiAgY29sb3I6IGluaGVyaXQ7XG4gIGZvbnQ6IGluaGVyaXQ7XG4gIHRleHQtYWxpZ246IGluaGVyaXQ7XG4gIHBhZGRpbmc6IDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG51bCB7XG4gIHBhZGRpbmc6IDA7XG4gIG1hcmdpbjogMDtcbn1cblxudWwgbGkge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5cbi5jb250YWluZXIge1xuICB3aWR0aDogMTc2cmVtO1xuICBtYXJnaW46IDAgYXV0bztcbn1cblxuc2VjdGlvbiB7XG4gIG1hcmdpbi1ib3R0b206IDE5cmVtO1xufVxuXG5pbnB1dFt0eXBlPW51bWJlcl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5pbnB1dFt0eXBlPW51bWJlcl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gIG1hcmdpbjogMDtcbn1cblxuaW5wdXRbdHlwZT1udW1iZXJdIHtcbiAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XG59XG5cbnN2ZyxcbmltZyB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IGF1dG87XG4gIG9iamVjdC1maXQ6IGNvbnRhaW47XG59XG5odG1sLmxvY2sge1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cblxuaHRtbCxcbmJvZHkge1xuICBvdmVyZmxvdy14OiBjbGlwO1xufVxuXG5tYWluIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBmbGV4OiAxIDEgYXV0bztcbn1cblxuLndyYXBwZXIge1xuICBtYXJnaW46IDAgYXV0bztcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgaGVpZ2h0OiAxMDAlO1xuICBtYXgtd2lkdGg6IDE5MjBweDtcbn1cblxuLmhlYWRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogNTAwO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDExLjhyZW07XG59XG5cbi5oZi1ncmlkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNCk7XG59XG4uaGYtZ3JpZF9fbG9nbyB7XG4gIGZsZXg6IDAgMCAxMi4ycmVtO1xuICB3aWR0aDogMTIuMnJlbTtcbn1cbi5oZi1ncmlkX19uYXYge1xuICBkaXNwbGF5OiBmbGV4O1xuICBjb2x1bW4tZ2FwOiA0LjhyZW07XG4gIGNvbG9yOiAjZmZmZmZmO1xufVxuLmhmLWdyaWRfX25hdi1saW5rIHtcbiAgZm9udC1zaXplOiAyLjRyZW07XG4gIGxpbmUtaGVpZ2h0OiAyLjlyZW07XG4gIGZvbnQtd2VpZ2h0OiAzMDA7XG59XG5cbi5mb290ZXIge1xuICBwYWRkaW5nOiA1LjJyZW0gMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwNDc4MDtcbiAgY29sb3I6ICNmZmZmZmY7XG59XG4uZm9vdGVyX19jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICByb3ctZ2FwOiA0cmVtO1xufVxuLmZvb3Rlcl9fYm9keSB7XG4gIHBhZGRpbmctYm90dG9tOiA0cmVtO1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2E2YmRkMDtcbn1cbi5mb290ZXJfX2JvdHRvbSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2Vlbjtcbn1cbi5mb290ZXJfX3R4dCB7XG4gIGNvbG9yOiAjYjJjOGQ5O1xufVxuXG4uaCB7XG4gIGZvbnQtZmFtaWx5OiBcIkJhaG5zY2hyaWZ0XCI7XG4gIGxpbmUtaGVpZ2h0OiAxMjAlO1xufVxuLmhfaDEge1xuICBmb250LXNpemU6IDdyZW07XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG4uaF9oMiB7XG4gIGZvbnQtc2l6ZTogNnJlbTtcbn1cbi5oX2gzIHtcbiAgZm9udC1zaXplOiAzLjJyZW07XG59XG4uaF9oNCB7XG4gIGZvbnQtc2l6ZTogMi40cmVtO1xufVxuXG4udHh0MjQge1xuICBmb250LXNpemU6IDIuNHJlbTtcbiAgbGluZS1oZWlnaHQ6IDMuM3JlbTtcbn1cblxuLnR4dDIyIHtcbiAgZm9udC1zaXplOiAyLjJyZW07XG4gIGxpbmUtaGVpZ2h0OiAyLjZyZW07XG59XG4udHh0MjJfc2Ige1xuICBmb250LXdlaWdodDogNjAwO1xufVxuXG4uYnRuIHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICNmZmZmZmY7XG59XG4uYnRuX3ByaW1hcnkge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHBhZGRpbmc6IDEuNHJlbSAyLjhyZW07XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA0NzgwO1xuICBjbGlwLXBhdGg6IHBvbHlnb24oMCAwLCA5MiUgMCwgMTAwJSAyMiUsIDEwMCUgODAlLCAxMDAlIDEwMCUsIDAgMTAwJSwgMCUgODAlLCAwJSAyMCUpO1xuICB0cmFuc2l0aW9uOiBjbGlwLXBhdGggMC4zcyBlYXNlO1xufVxuLmJ0bl9wcmltYXJ5IC5idG5fX3R4dCB7XG4gIGxpbmUtaGVpZ2h0OiAyLjZyZW07XG59XG4uYnRuX3ByaW1hcnk6ZGlzYWJsZWQge1xuICBjb2xvcjogIzg2OTE5YTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2YyZjJmMjtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG4uYnRuX3ByaW1hcnlfd2hpdGUge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xufVxuLmJ0bl9wcmltYXJ5X3doaXRlIC5idG5fX3R4dCB7XG4gIGNvbG9yOiAjMDA0NzgwO1xufVxuLmJ0bl9zZWNvbmRhcnkge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG4uYnRuX3NlY29uZGFyeTo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogLTAuM3JlbTtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0O1xufVxuLmJ0bl9zZWNvbmRhcnkgLmJ0bl9fdHh0IHtcbiAgbGluZS1oZWlnaHQ6IDIuNHJlbTtcbn1cbi5idG5fc2Vjb25kYXJ5X2JsdWUge1xuICBjb2xvcjogIzAwNDc4MDtcbn1cbi5idG5fc2Vjb25kYXJ5X2JsdWU6OmFmdGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwNDc4MDtcbn1cblxuLmktYnRuIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXg6IDAgMCA0LjJyZW07XG4gIHdpZHRoOiA0LjJyZW07XG4gIGhlaWdodDogNC4ycmVtO1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbn1cbi5pLWJ0bjo6YmVmb3JlLCAuaS1idG46OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDUwJTtcbiAgbGVmdDogNTAlO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZmZmZmZmO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xufVxuLmktYnRuOjpiZWZvcmUge1xuICB3aWR0aDogMy44cmVtO1xuICBoZWlnaHQ6IDMuOHJlbTtcbiAgb3BhY2l0eTogMC40O1xufVxuLmktYnRuOjphZnRlciB7XG4gIHdpZHRoOiAzLjRyZW07XG4gIGhlaWdodDogMy40cmVtO1xufVxuLmktYnRuIHN2ZyB7XG4gIHdpZHRoOiAxLjVyZW07XG4gIGhlaWdodDogMS41cmVtO1xufVxuLmktYnRuX2JsdWUge1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDcxLCAxMjgsIDAuMSk7XG59XG4uaS1idG5fYmx1ZTo6YmVmb3JlLCAuaS1idG5fYmx1ZTo6YWZ0ZXIge1xuICBib3JkZXI6IDFweCBzb2xpZCAjMDA0NzgwO1xufVxuLmktYnRuX2JsdWUgc3ZnIHtcbiAgZmlsbDogIzAwNDc4MDtcbn1cblxuaW5wdXRbdHlwZT10ZXh0XSxcbmlucHV0W3R5cGU9ZW1haWxdLFxuaW5wdXRbdHlwZT10ZWxdLFxudGV4dGFyZWEge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcbiAgYXBwZWFyYW5jZTogbm9uZTtcbn1cblxudGV4dGFyZWE6Zm9jdXMsXG5pbnB1dDpmb2N1cyB7XG4gIG91dGxpbmU6IG5vbmU7XG59XG5cbi5pbnB1dCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cbi5pbnB1dF9maWxlIC5pbnB1dF9fZmllbGQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHotaW5kZXg6IDI7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3BhY2l0eTogMDtcbn1cbi5pbnB1dF9maWxlIC5pbnB1dF9fcGxhY2Vob2xkZXIge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY29sdW1uLWdhcDogMS4ycmVtO1xuICBsaW5lLWhlaWdodDogMi42cmVtO1xufVxuLmlucHV0X2ZpbGUgLmlucHV0X19wbGFjZWhvbGRlcjo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBmbGV4OiAwIDAgMi40cmVtO1xuICB3aWR0aDogMi40cmVtO1xuICBoZWlnaHQ6IDIuNHJlbTtcbiAgYmFja2dyb3VuZDogdXJsKFwiLi9hc3NldHMvaW1hZ2VzL2ljb25zL2NsaXAuc3ZnXCIpIGNlbnRlci9jb250YWluIG5vLXJlcGVhdDtcbn1cbi5pbnB1dDpub3QoLmlucHV0X2ZpbGUpIC5pbnB1dF9fZmllbGQge1xuICBwYWRkaW5nLWJvdHRvbTogMS42cmVtO1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IDEwMCU7XG4gIGxpbmUtaGVpZ2h0OiAxO1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2E2YmRkMDtcbiAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyBlYXNlLCBib3JkZXItYm90dG9tIDAuM3MgZWFzZTtcbn1cbi5pbnB1dDpub3QoLmlucHV0X2ZpbGUpIC5pbnB1dF9fZmllbGQ6OnBsYWNlaG9sZGVyIHtcbiAgY29sb3I6ICM0ZDVmNmU7XG4gIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgZWFzZTtcbn1cbi5pbnB1dDpub3QoLmlucHV0X2ZpbGUpLl9pcy1maWxsZWQgLmlucHV0X19maWVsZCB7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjMDAwMDAwO1xuICBjb2xvcjogIzAwMDAwMDtcbn1cbi5pbnB1dDpub3QoLmlucHV0X2ZpbGUpLl9oYXMtZXJyb3I6OmFmdGVyIHtcbiAgY29udGVudDogYXR0cihkYXRhLWhpbnQpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvdHRvbTogLTAuNHJlbTtcbiAgbGVmdDogMDtcbiAgZm9udC1zaXplOiAxLjRyZW07XG4gIGNvbG9yOiAjZDkwMDAwO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTAwJSk7XG59XG4uaW5wdXQ6bm90KC5pbnB1dF9maWxlKS5faGFzLWVycm9yIC5pbnB1dF9fZmllbGQge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2Q5MDAwMDtcbn1cblxuLm9wdGlvbiB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLm9wdGlvbl9faW5wdXQge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG9wYWNpdHk6IDA7XG4gIGFwcGVhcmFuY2U6IG5vbmU7XG59XG4ub3B0aW9uX19pbnB1dDpjaGVja2VkICsgLm9wdGlvbl9fdHh0OjphZnRlciB7XG4gIHRyYW5zZm9ybTogc2NhbGUoMSk7XG59XG4ub3B0aW9uX190eHQge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2x1bW4tZ2FwOiAwLjhyZW07XG59XG4ub3B0aW9uX190eHQ6OmJlZm9yZSwgLm9wdGlvbl9fdHh0OjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbn1cbi5vcHRpb25fX3R4dDo6YmVmb3JlIHtcbiAgZmxleDogMCAwIDIuNHJlbTtcbiAgd2lkdGg6IDIuNHJlbTtcbiAgaGVpZ2h0OiAyLjRyZW07XG4gIGJvcmRlcjogMS41cHggc29saWQgIzAwNDc4MDtcbn1cbi5vcHRpb25fX3R4dDo6YWZ0ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDAuNHJlbTtcbiAgdG9wOiAwLjRyZW07XG4gIHdpZHRoOiAxLjZyZW07XG4gIGhlaWdodDogMS42cmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA0NzgwO1xuICB0cmFuc2Zvcm06IHNjYWxlKDApO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xufVxuXG4uY2hlY2tib3gge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xufVxuLmNoZWNrYm94X19pbnB1dCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMjtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3BhY2l0eTogMDtcbiAgYXBwZWFyYW5jZTogbm9uZTtcbn1cbi5jaGVja2JveF9faW5wdXQ6Y2hlY2tlZCArIC5jaGVja2JveF9fdHh0OjpiZWZvcmUge1xuICBib3JkZXI6IDFweCBzb2xpZCAjMDA0NzgwO1xufVxuLmNoZWNrYm94X19pbnB1dDpjaGVja2VkICsgLmNoZWNrYm94X190eHQ6OmFmdGVyIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbn1cbi5jaGVja2JveF9fdHh0IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY29sdW1uLWdhcDogMC44cmVtO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4uY2hlY2tib3hfX3R4dDo6YmVmb3JlIHtcbiAgY29udGVudDogXCJcIjtcbiAgZmxleDogMCAwIDIuMnJlbTtcbiAgd2lkdGg6IDIuMnJlbTtcbiAgaGVpZ2h0OiAyLjJyZW07XG4gIGJvcmRlcjogMXB4IHNvbGlkICNhNmJkZDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG4gIHRyYW5zaXRpb246IGJvcmRlciAwLjNzIGVhc2U7XG59XG4uY2hlY2tib3hfX3R4dDo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMC4zcmVtO1xuICBsZWZ0OiAwLjNyZW07XG4gIHdpZHRoOiAxLjZyZW07XG4gIGhlaWdodDogMS42cmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA0NzgwO1xuICB0cmFuc2Zvcm06IHNjYWxlKDApO1xuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xufVxuXG4uYnJlYWRjcnVtYnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2x1bW4tZ2FwOiAxLjJyZW07XG59XG4uYnJlYWRjcnVtYnNfX2xpbmsge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2x1bW4tZ2FwOiAxLjJyZW07XG59XG4uYnJlYWRjcnVtYnNfX2xpbms6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgd2lkdGg6IDJyZW07XG4gIGhlaWdodDogMC4ycmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjODA4ZDk3O1xufVxuLmJyZWFkY3J1bWJzX190eHQge1xuICBjb2xvcjogIzAwNDc4MDtcbn1cblxuLnRhYnNfX25hdmlnYXRpb24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBjb2x1bW4tZ2FwOiAxLjVyZW07XG59XG4udGFic19fYm9keSB7XG4gIHBhZGRpbmctdG9wOiAxcmVtO1xufVxuXG4udGFiIHtcbiAgcGFkZGluZzogMCAyLjhyZW07XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBoZWlnaHQ6IDEwcmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjJmMmYyO1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgZWFzZSwgY29sb3IgMC4zcyBlYXNlO1xufVxuLnRhYiBzdmcge1xuICBmbGV4OiAwIDAgMi40cmVtO1xuICB3aWR0aDogMi40cmVtO1xuICBoZWlnaHQ6IDIuNHJlbTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMC4zcmVtLCAtMC4zcmVtKTtcbiAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIGVhc2U7XG59XG4udGFiX19udW0ge1xuICBtYXJnaW4tcmlnaHQ6IDAuOHJlbTtcbn1cbi50YWJfX3R4dCB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbi50YWIuX2lzLWFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDQ3ODA7XG4gIGNvbG9yOiAjZmZmZmZmO1xufVxuLnRhYi5faXMtYWN0aXZlIHN2ZyB7XG4gIGZpbGw6ICNmZmZmZmY7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNDhlbSl7XG4gIC5oZWFkZXJfX2hhbWJ1cmdlci1idG4ge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiAxOTIwcHgpe1xuICBodG1sIHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKXtcbiAgc2VjdGlvbiB7XG4gICAgbWFyZ2luLWJvdHRvbTogMjByZW07XG4gIH1cbiAgaHRtbCB7XG4gICAgZm9udC1zaXplOiA1cHg7XG4gICAgZm9udC1zaXplOiAxLjU2MjV2dztcbiAgICBmb250LXNpemU6IDEuMzMzMzMzMzMzM3Z3O1xuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcbiAgfVxuICBib2R5IHtcbiAgICBmb250LXNpemU6IDIuOHJlbTtcbiAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XG4gIH1cbiAgLmNvbnRhaW5lciB7XG4gICAgcGFkZGluZzogMCAyLjRyZW07XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbiAgLmhlYWRlciB7XG4gICAgaGVpZ2h0OiAxNS40cmVtO1xuICB9XG4gIC5oZWFkZXIgLmhmLWdyaWQge1xuICAgIHBhZGRpbmctdG9wOiA0LjhyZW07XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgfVxuICAuaGVhZGVyIC5oZi1ncmlkX19uYXYge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgLmhlYWRlciAuaGYtZ3JpZF9fYnRuIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gIC5oZi1ncmlkX19sb2dvIHtcbiAgICBmbGV4OiAwIDAgMjJyZW07XG4gICAgd2lkdGg6IDIycmVtO1xuICB9XG4gIC5oZi1ncmlkX19uYXYtbGluayB7XG4gICAgZm9udC1zaXplOiAzLjhyZW07XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgfVxuICAuZm9vdGVyIHtcbiAgICBwYWRkaW5nOiA2LjRyZW0gMDtcbiAgfVxuICAuZm9vdGVyX19jb250YWluZXIge1xuICAgIHJvdy1nYXA6IDYuNHJlbTtcbiAgfVxuICAuZm9vdGVyX19ib2R5IHtcbiAgICBwYWRkaW5nLWJvdHRvbTogNi40cmVtO1xuICB9XG4gIC5mb290ZXJfX2JvdHRvbSB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHN0cmV0Y2g7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICByb3ctZ2FwOiAxLjZyZW07XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG4gIC5mb290ZXIgLmhmLWdyaWQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICByb3ctZ2FwOiA2LjRyZW07XG4gIH1cbiAgLmZvb3RlciAuaGYtZ3JpZF9fbG9nbyB7XG4gICAgZmxleDogMCAwIGF1dG87XG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcbiAgfVxuICAuZm9vdGVyIC5oZi1ncmlkX19uYXYge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgMWZyKTtcbiAgICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xuICAgIGNvbHVtbi1nYXA6IDE1cmVtO1xuICAgIHJvdy1nYXA6IDIuNHJlbTtcbiAgfVxuICAuZm9vdGVyIC5oZi1ncmlkX19idG4ge1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG4gIC5oX2gxIHtcbiAgICBmb250LXNpemU6IDUuNnJlbTtcbiAgfVxuICAuaF9oMiB7XG4gICAgZm9udC1zaXplOiA1LjZyZW07XG4gIH1cbiAgLmhfaDMge1xuICAgIGZvbnQtc2l6ZTogNC40cmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxO1xuICB9XG4gIC5oX2g0IHtcbiAgICBmb250LXNpemU6IDQuNHJlbTtcbiAgICBsaW5lLWhlaWdodDogMTtcbiAgfVxuICAudHh0MjQge1xuICAgIGZvbnQtc2l6ZTogNHJlbTtcbiAgfVxuICAudHh0MjIge1xuICAgIGZvbnQtc2l6ZTogMy42cmVtO1xuICB9XG4gIC5idG5fcHJpbWFyeSB7XG4gICAgcGFkZGluZzogMi44cmVtIDUuNnJlbTtcbiAgfVxuICAuYnRuX3ByaW1hcnk6OmFmdGVyIHtcbiAgICB3aWR0aDogNS42cmVtO1xuICB9XG4gIC5idG5fcHJpbWFyeV9mdyB7XG4gICAgY2xpcC1wYXRoOiBwb2x5Z29uKDAgMCwgOTYlIDAsIDEwMCUgMjklLCAxMDAlIDgwJSwgMTAwJSAxMDAlLCAwIDEwMCUsIDAlIDgwJSwgMCUgMjAlKTtcbiAgfVxuICAuYnRuX3ByaW1hcnkgLmJ0bl9fdHh0IHtcbiAgICBsaW5lLWhlaWdodDogNC4ycmVtO1xuICB9XG4gIC5idG5fc2Vjb25kYXJ5IC5idG5fX3R4dCB7XG4gICAgbGluZS1oZWlnaHQ6IDQuOHJlbTtcbiAgfVxuICAuaS1idG4ge1xuICAgIGZsZXg6IDAgMCAxMHJlbTtcbiAgICB3aWR0aDogMTByZW07XG4gICAgaGVpZ2h0OiAxMHJlbTtcbiAgfVxuICAuaS1idG46OmJlZm9yZSB7XG4gICAgd2lkdGg6IDlyZW07XG4gICAgaGVpZ2h0OiA5cmVtO1xuICB9XG4gIC5pLWJ0bjo6YWZ0ZXIge1xuICAgIHdpZHRoOiA4cmVtO1xuICAgIGhlaWdodDogOHJlbTtcbiAgfVxuICAuaS1idG4gc3ZnIHtcbiAgICB3aWR0aDogMy4ycmVtO1xuICAgIGhlaWdodDogMy4ycmVtO1xuICB9XG4gIC5pbnB1dF9maWxlIC5pbnB1dF9fcGxhY2Vob2xkZXIge1xuICAgIGNvbHVtbi1nYXA6IDNyZW07XG4gICAgbGluZS1oZWlnaHQ6IDQuMXJlbTtcbiAgfVxuICAuaW5wdXRfZmlsZSAuaW5wdXRfX3BsYWNlaG9sZGVyOjphZnRlciB7XG4gICAgZmxleDogMCAwIDQuOHJlbTtcbiAgICB3aWR0aDogNC44cmVtO1xuICAgIGhlaWdodDogNC44cmVtO1xuICB9XG4gIC5pbnB1dDpub3QoLmlucHV0X2ZpbGUpLl9oYXMtZXJyb3I6OmFmdGVyIHtcbiAgICBib3R0b206IC0wLjhyZW07XG4gICAgZm9udC1zaXplOiAycmVtO1xuICB9XG4gIC5vcHRpb25fX3R4dCB7XG4gICAgY29sdW1uLWdhcDogMS42cmVtO1xuICB9XG4gIC5vcHRpb25fX3R4dDo6YmVmb3JlIHtcbiAgICBmbGV4OiAwIDAgNC44cmVtO1xuICAgIHdpZHRoOiA0LjhyZW07XG4gICAgaGVpZ2h0OiA0LjhyZW07XG4gIH1cbiAgLm9wdGlvbl9fdHh0OjphZnRlciB7XG4gICAgdG9wOiAwLjhyZW07XG4gICAgbGVmdDogMC44cmVtO1xuICAgIHdpZHRoOiAzLjJyZW07XG4gICAgaGVpZ2h0OiAzLjJyZW07XG4gIH1cbiAgLmNoZWNrYm94X190eHQge1xuICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcbiAgfVxuICAuY2hlY2tib3hfX3R4dDo6YmVmb3JlIHtcbiAgICBmbGV4OiAwIDAgNC40cmVtO1xuICAgIHdpZHRoOiA0LjRyZW07XG4gICAgaGVpZ2h0OiA0LjRyZW07XG4gIH1cbiAgLmNoZWNrYm94X190eHQ6OmFmdGVyIHtcbiAgICBsZWZ0OiAwLjZyZW07XG4gICAgdG9wOiAwLjZyZW07XG4gICAgd2lkdGg6IDMuMnJlbTtcbiAgICBoZWlnaHQ6IDMuMnJlbTtcbiAgfVxuICAuYnJlYWRjcnVtYnMge1xuICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcbiAgICBmb250LXNpemU6IDMuMnJlbTtcbiAgfVxuICAuYnJlYWRjcnVtYnNfX2xpbmsge1xuICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcbiAgfVxuICAuYnJlYWRjcnVtYnNfX2xpbms6OmFmdGVyIHtcbiAgICB3aWR0aDogMy4ycmVtO1xuICAgIGhlaWdodDogMXB4O1xuICB9XG4gIC50YWIge1xuICAgIHBhZGRpbmc6IDAgMi40cmVtO1xuICAgIGhlaWdodDogMTEuMnJlbTtcbiAgfVxuICAudGFiIHN2ZyB7XG4gICAgZmxleDogMCAwIDMuMnJlbTtcbiAgICB3aWR0aDogMy4ycmVtO1xuICAgIGhlaWdodDogMy4ycmVtO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAuNnJlbSwgLTAuNnJlbSk7XG4gIH1cbiAgLnRhYl9fbnVtIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDEuNnJlbTtcbiAgfVxufVxuQG1lZGlhIChhbnktaG92ZXI6IGhvdmVyKXtcbiAgLmJ0bl9wcmltYXJ5OmhvdmVyIHtcbiAgICBjbGlwLXBhdGg6IHBvbHlnb24oMCAwLCAxMDAlIDAsIDEwMCUgMCwgMTAwJSA4MCUsIDEwMCUgMTAwJSwgMCAxMDAlLCAwJSA4MCUsIDAlIDIwJSk7XG4gIH1cbiAgLmJ0bl9zZWNvbmRhcnk6aG92ZXI6OmFmdGVyIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWCgwLjA1KTtcbiAgfVxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3Njc3MvZm9udHMuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3Njc3Mvc3R5bGUuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3Njc3Mvc2V0LnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy9zY3NzL3NlY3Rpb25zL2hlYWRlci5zY3NzXCIsXCJ3ZWJwYWNrOi8vLi9zcmMvc2Nzcy9zZWN0aW9ucy9mb290ZXIuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3VpL190eXBvLnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy91aS9fYnV0dG9ucy5zY3NzXCIsXCJ3ZWJwYWNrOi8vLi9zcmMvdWkvX2lucHV0LnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy91aS9fYnJlYWRjcnVtYnMuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3VpL190YWJzLnNjc3NcIixcIjxubyBzb3VyY2U+XCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsMEJBQUE7RUFDQSw2REFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7QUNFRjtBQ05BOzs7RUFHSSxzQkFBQTtBRFFKOztBQ05BO0VBQ0ksd0JBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7RUFDQSxxQ0FBQTtFQUNBLGdCQUFBO0VBQ0EsU0FBQTtFQUNBLFlBQUE7RUFDQSxVQUFBO0FEU0o7O0FDTkE7RUFDSSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EscUNBQUE7RUFDQSxnQkFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLGlCQUFBO0VBQ0EsY0RmUTtFQ2dCUix5QkRwQkk7QUE2QlI7O0FDTkE7O0VBRUkscUNBQUE7RUFDQSxvQkFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsNkJBQUE7RUFDQSxZQUFBO0VBQ0EsY0FBQTtBRFNKOztBQ1BBO0VBQ0ksWUFBQTtBRFVKOztBQ1JBOztFQUVJLHFCQUFBO0FEV0o7O0FDUkE7Ozs7RUFJSSxhQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7QURXSjtBQ1ZJOzs7O0VB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TXJkRTtJQVlJLFlBQUE7SUFDQSxXQUFBO0lBQ0EsYUFBQTtJQUNBLGNBQUE7RU55ZE47RU92dUJGO0lBTUksa0JBQUE7SUFDQSxpQkFBQTtFUDR1QkY7RU96dUJBO0lBYUksa0JBQUE7RVA0dUJKO0VPMXVCSTtJQUNFLGFBQUE7SUFDQSxXQUFBO0VQNHVCTjtFUTd2QkY7SUFXSSxpQkFBQTtJQUNBLGVBQUE7RVIyd0JGO0VReHdCQTtJQVFJLGdCQUFBO0lBQ0EsYUFBQTtJQUNBLGNBQUE7SUFDQSxxQ0FBQTtFUjR3Qko7RVF4d0JBO0lBSUksb0JBQUE7RVI0d0JKO0FBNURGO0FTNXZCQTtFSmlEWTtJQUNJLG9GQUFBO0VMMlhkO0VLaldjO0lBQ0ksdUJBQUE7RUxzWGxCO0FBaVVGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJCYWhuc2NocmlmdFxcXCI7XFxuICBzcmM6IHVybChcXFwiLi4vYXNzZXRzL2ZvbnRzL0JhaG5zY2hyaWZ0LndvZmYyXFxcIikgZm9ybWF0KFxcXCJ3b2ZmMlxcXCIpO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG59XFxuXCIsXCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWl4aW5zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcbkBpbXBvcnQgJy4vbWl4aW5zJztcXG5cXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB2YXJpYWJsZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcbi8vIGNvbG9yc1xcbiR3aGl0ZTogI2ZmZmZmZjtcXG4kYmxhY2s6ICMwMDAwMDA7XFxuJGJsdWU6ICMwMDQ3ODA7XFxuJGdyYXk6ICNmMmYyZjI7XFxuJGZvbnRDb2xvcjogIzAwMWIzMDtcXG4kbGlnaHRCbHVlOiAjYTZiZGQwO1xcbiRyZWQ6ICNkOTAwMDA7XFxuXFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmb250cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG5AaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Ob3RvK1NhbnM6d2R0aCx3Z2h0QDc1LDEwMC4uOTAwJmRpc3BsYXk9c3dhcCcpO1xcblxcbi8vIGxvY2FsIGZvbnRzXFxuQGltcG9ydCAnLi9mb250cyc7XFxuXFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBiYXNlIHN0eWxlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG4vLyBiYXNlIHNjc3MgZmlsZVxcbkBpbXBvcnQgJy4vc2V0JztcXG5cXG4vLyBodG1sLCBib2R5XFxuaHRtbCB7XFxuICAgICYubG9jayB7XFxuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgIH1cXG59XFxuaHRtbCxcXG5ib2R5IHtcXG4gICAgb3ZlcmZsb3cteDogY2xpcDtcXG59XFxuXFxuLy8gbWFpblxcbm1haW4ge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGZsZXg6IDEgMSBhdXRvO1xcbn1cXG5cXG4ud3JhcHBlciB7XFxuICAgIG1hcmdpbjogMCBhdXRvO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIG1heC13aWR0aDogMTkyMHB4O1xcbn1cXG5cXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcbi8vIGhlYWRlciAvIGZvb3RlclxcbkBpbXBvcnQgJy4vc2VjdGlvbnMvaGVhZGVyJztcXG5AaW1wb3J0ICcuL3NlY3Rpb25zL2Zvb3Rlcic7XFxuXFxuLy8gdWlcXG5AaW1wb3J0ICcuLi91aS91aSc7XFxuXFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG5AaW1wb3J0ICcuL2Rldi92em1zazEuc2Nzcyc7XFxuQGltcG9ydCAnLi9kZXYvbWFya3VzRE0uc2Nzcyc7XFxuQGltcG9ydCAnLi9kZXYvdWtpazAuc2Nzcyc7XFxuXCIsXCIqLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcbmh0bWwge1xcbiAgICBmb250LWZhbWlseTogJ05vdG8gU2Fucyc7IC8vINGI0YDQuNGE0YIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L/QviDRgdCw0LnRgtGDXFxuICAgIGZvbnQtc2l6ZTogMC41MjA4MzM1dnc7IC8vINC90LAg0YDQsNC30YDQtdGI0LXQvdC40LggMTkyMCAwLjUyMDgzNXZ3ID09PSAxMHB4XFxuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG4gICAgLXdlYmtpdC1hbmltYXRpb246IGJ1Z2ZpeCBpbmZpbml0ZSAxcztcXG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIHBhZGRpbmc6IDA7XFxufVxcblxcbmJvZHkge1xcbiAgICBmb250LXN0eWxlOiBub3JtYWw7XFxuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XFxuICAgIC13ZWJraXQtYW5pbWF0aW9uOiBidWdmaXggaW5maW5pdGUgMXM7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjI7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgICBmb250LXNpemU6IDEuOHJlbTtcXG4gICAgY29sb3I6ICRmb250Q29sb3I7IC8vINGG0LLQtdGCINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINGC0LXQutGB0YLQsCDQv9C+INGB0LDQudGC0YNcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHdoaXRlO1xcbn1cXG5cXG5pbnB1dCxcXG50ZXh0YXJlYSB7XFxuICAgIC13ZWJraXQtYW5pbWF0aW9uOiBidWdmaXggaW5maW5pdGUgMXM7XFxuICAgIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICBib3JkZXI6IG5vbmU7XFxuICAgIGNvbG9yOiBpbmhlcml0O1xcbn1cXG5hIHtcXG4gICAgY29sb3I6IHVuc2V0O1xcbn1cXG5hLFxcbmE6aG92ZXIge1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxufVxcblxcbmJ1dHRvbixcXG5pbnB1dCxcXG5hLFxcbnRleHRhcmVhIHtcXG4gICAgb3V0bGluZTogbm9uZTtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICBmb250OiBpbmhlcml0O1xcbiAgICAmOmZvY3VzIHtcXG4gICAgICAgIG91dGxpbmU6IG5vbmU7XFxuICAgIH1cXG4gICAgJjphY3RpdmUge1xcbiAgICAgICAgb3V0bGluZTogbm9uZTtcXG4gICAgfVxcbn1cXG5cXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNiB7XFxuICAgIGZvbnQ6IGluaGVyaXQ7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG59XFxucCB7XFxuICAgIG1hcmdpbi10b3A6IDA7XFxuICAgIG1hcmdpbi1ib3R0b206IDA7XFxufVxcblxcbmltZyB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IGF1dG87XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG5idXR0b24ge1xcbiAgICBib3JkZXI6IG5vbmU7XFxuICAgIGNvbG9yOiBpbmhlcml0O1xcbiAgICBmb250OiBpbmhlcml0O1xcbiAgICB0ZXh0LWFsaWduOiBpbmhlcml0O1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxudWwge1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBtYXJnaW46IDA7XFxufVxcblxcbnVsIGxpIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBsaXN0LXN0eWxlOiBub25lO1xcbn1cXG5cXG4uY29udGFpbmVyIHtcXG4gICAgd2lkdGg6IDE3NnJlbTtcXG4gICAgbWFyZ2luOiAwIGF1dG87XFxufVxcblxcbnNlY3Rpb24ge1xcbiAgICBtYXJnaW4tYm90dG9tOiAxOXJlbTtcXG4gICAgXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHJlbTtcXG4gICAgfVxcbn1cXG5cXG5pbnB1dFt0eXBlPSdudW1iZXInXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5pbnB1dFt0eXBlPSdudW1iZXInXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gICAgbWFyZ2luOiAwO1xcbn1cXG5cXG5pbnB1dFt0eXBlPSdudW1iZXInXSB7XFxuICAgIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xcbn1cXG5cXG5zdmcsXFxuaW1nIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGhlaWdodDogYXV0bztcXG4gICAgb2JqZWN0LWZpdDogY29udGFpbjtcXG59XFxuXFxuQG1lZGlhIChtaW4td2lkdGg6IDE5MjBweCkge1xcbiAgICBodG1sIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogMTBweDtcXG4gICAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICBodG1sIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogNXB4O1xcbiAgICAgICAgZm9udC1zaXplOiAxLjU2MjV2dztcXG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygoMTAwIC8gMzc1KSAqIDV2dyk7IC8vINCz0LTQtSAzNzUg0Y3RgtC+INGI0LjRgNC40L3QsCDQvNC+0LEg0LLQtdGA0YHQuNC4INC80LDQutC10YLQsFxcbiAgICAgICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiBub25lO1xcbiAgICB9XFxuXFxuICAgIGJvZHkge1xcbiAgICAgICAgZm9udC1zaXplOiAyLjhyZW07XFxuICAgICAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxuICAgIH1cXG5cXG4gICAgLmNvbnRhaW5lciB7XFxuICAgICAgICBwYWRkaW5nOiAwIDIuNHJlbTsgLy8g0LIg0LzQvtCxINCy0LXRgNGB0LjQuCDQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDRjyDQt9Cw0LTQsNC10Lwg0LTQu9GPINCy0YHQtdGFINC60L7QvdGC0LXQudC90LXRgNC+0LIsINCwINGC0LDQvCDQs9C00LUg0L3QtSDQvdGD0LbQvdC+INC80L7QttC10Lwg0YLQvtGH0LXRh9C90L4g0YPQsdGA0LDRgtGMXFxuICAgICAgICB3aWR0aDogMTAwJTtcXG4gICAgfVxcbn1cXG5cIixcIi5oZWFkZXIge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHotaW5kZXg6IDUwMDtcXG4gICAgdG9wOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAxMS44cmVtO1xcblxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgaGVpZ2h0OiAxNS40cmVtO1xcblxcbiAgICAgICAgLmhmLWdyaWQge1xcbiAgICAgICAgICAgIHBhZGRpbmctdG9wOiA0LjhyZW07XFxuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcXG5cXG4gICAgICAgICAgICAmX19uYXYge1xcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xcbiAgICAgICAgICAgIH1cXG5cXG4gICAgICAgICAgICAmX19idG4ge1xcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICAmX19oYW1idXJnZXItYnRuIHtcXG4gICAgICAgIEBtZWRpYSAobWluLXdpZHRoOiA0OGVtKSB7XFxuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcXG4gICAgICAgIH1cXG4gICAgfVxcbn1cXG5cXG4uaGYtZ3JpZCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQpO1xcblxcbiAgICAmX19sb2dvIHtcXG4gICAgICAgIGZsZXg6IDAgMCAxMi4ycmVtO1xcbiAgICAgICAgd2lkdGg6IDEyLjJyZW07XFxuXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgICAgIGZsZXg6IDAgMCAyMnJlbTtcXG4gICAgICAgICAgICB3aWR0aDogMjJyZW07XFxuICAgICAgICB9XFxuICAgIH1cXG4gICAgJl9fbmF2IHtcXG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgICAgICBjb2x1bW4tZ2FwOiA0LjhyZW07XFxuICAgICAgICBjb2xvcjogJHdoaXRlO1xcbiAgICB9XFxuXFxuICAgICZfX25hdi1saW5rIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogMi40cmVtO1xcbiAgICAgICAgbGluZS1oZWlnaHQ6IDIuOXJlbTtcXG4gICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XFxuXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMy44cmVtO1xcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XFxuICAgICAgICB9XFxuICAgIH1cXG59XFxuXCIsXCIuZm9vdGVyIHtcXG4gICAgcGFkZGluZzogNS4ycmVtIDA7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICRibHVlO1xcbiAgICBjb2xvcjogJHdoaXRlO1xcblxcbiAgICAmX19jb250YWluZXIge1xcbiAgICAgICAgZGlzcGxheTogZmxleDtcXG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgICAgICByb3ctZ2FwOiA0cmVtO1xcbiAgICB9XFxuXFxuICAgICZfX2JvZHkge1xcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDRyZW07XFxuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2E2YmRkMDtcXG4gICAgfVxcblxcbiAgICAmX19ib3R0b20ge1xcbiAgICAgICAgZGlzcGxheTogZmxleDtcXG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gICAgfVxcblxcbiAgICAmX190eHQge1xcbiAgICAgICAgY29sb3I6ICNiMmM4ZDk7XFxuICAgIH1cXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgIHBhZGRpbmc6IDYuNHJlbSAwO1xcblxcbiAgICAgICAgJl9fY29udGFpbmVyIHtcXG4gICAgICAgICAgICByb3ctZ2FwOiA2LjRyZW07XFxuICAgICAgICB9XFxuXFxuICAgICAgICAmX19ib2R5IHtcXG4gICAgICAgICAgICBwYWRkaW5nLWJvdHRvbTogNi40cmVtO1xcbiAgICAgICAgfVxcblxcbiAgICAgICAgJl9fYm90dG9tIHtcXG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3RyZXRjaDtcXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICAgICAgICAgIHJvdy1nYXA6IDEuNnJlbTtcXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgICAgICB9XFxuXFxuICAgICAgICAuaGYtZ3JpZCB7XFxuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcXG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICAgICAgICAgIHJvdy1nYXA6IDYuNHJlbTtcXG5cXG4gICAgICAgICAgICAmX19sb2dvIHtcXG4gICAgICAgICAgICAgICAgZmxleDogMCAwIGF1dG87XFxuICAgICAgICAgICAgICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxuICAgICAgICAgICAgfVxcblxcbiAgICAgICAgICAgICZfX25hdiB7XFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgICAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XFxuICAgICAgICAgICAgICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XFxuICAgICAgICAgICAgICAgIGNvbHVtbi1nYXA6IDE1cmVtO1xcbiAgICAgICAgICAgICAgICByb3ctZ2FwOiAyLjRyZW07XFxuICAgICAgICAgICAgfVxcblxcbiAgICAgICAgICAgICZfX2J0biB7XFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgfVxcbn1cXG5cIixcIi5oIHtcXG4gICAgZm9udC1mYW1pbHk6ICdCYWhuc2NocmlmdCc7XFxuICAgIGxpbmUtaGVpZ2h0OiAxMjAlO1xcblxcbiAgICAmX2gxIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogN3JlbTtcXG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNS42cmVtO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgICZfaDIge1xcbiAgICAgICAgZm9udC1zaXplOiA2cmVtO1xcblxcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgICAgICBmb250LXNpemU6IDUuNnJlbTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICAmX2gzIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogMy4ycmVtO1xcblxcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgICAgICBmb250LXNpemU6IDQuNHJlbTtcXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICAmX2g0IHtcXG4gICAgICAgIGZvbnQtc2l6ZTogMi40cmVtO1xcblxcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgICAgICBmb250LXNpemU6IDQuNHJlbTtcXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcXG4gICAgICAgIH1cXG4gICAgfVxcbn1cXG5cXG4udHh0MjQge1xcbiAgICBmb250LXNpemU6IDIuNHJlbTtcXG4gICAgbGluZS1oZWlnaHQ6IDMuM3JlbTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgIGZvbnQtc2l6ZTogNHJlbTtcXG4gICAgfVxcbn1cXG5cXG4udHh0MjIge1xcbiAgICBmb250LXNpemU6IDIuMnJlbTtcXG4gICAgbGluZS1oZWlnaHQ6IDIuNnJlbTtcXG5cXG4gICAgJl9zYiB7XFxuICAgICAgICBmb250LXdlaWdodDogNjAwO1xcbiAgICB9XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgICBmb250LXNpemU6IDMuNnJlbTtcXG4gICAgfVxcbn1cXG5cIixcIi5idG4ge1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICBjb2xvcjogJHdoaXRlO1xcblxcbiAgICAmX3ByaW1hcnkge1xcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICAgICAgcGFkZGluZzogMS40cmVtIDIuOHJlbTtcXG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRibHVlO1xcbiAgICAgICAgY2xpcC1wYXRoOiBwb2x5Z29uKDAgMCwgOTIlIDAsIDEwMCUgMjIlLCAxMDAlIDgwJSwgMTAwJSAxMDAlLCAwIDEwMCUsIDAlIDgwJSwgMCUgMjAlKTtcXG4gICAgICAgIHRyYW5zaXRpb246IGNsaXAtcGF0aCAwLjNzIGVhc2U7XFxuXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgICAgIHBhZGRpbmc6IDIuOHJlbSA1LjZyZW07XFxuXFxuICAgICAgICAgICAgJjo6YWZ0ZXIge1xcbiAgICAgICAgICAgICAgICB3aWR0aDogNS42cmVtO1xcbiAgICAgICAgICAgIH1cXG5cXG4gICAgICAgICAgICAmX2Z3IHtcXG4gICAgICAgICAgICAgICAgY2xpcC1wYXRoOiBwb2x5Z29uKDAgMCwgOTYlIDAsIDEwMCUgMjklLCAxMDAlIDgwJSwgMTAwJSAxMDAlLCAwIDEwMCUsIDAlIDgwJSwgMCUgMjAlKTtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9XFxuXFxuICAgICAgICAuYnRuX190eHQge1xcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAyLjZyZW07XFxuXFxuICAgICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDQuMnJlbTtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9XFxuXFxuICAgICAgICAmOmRpc2FibGVkIHtcXG4gICAgICAgICAgICBjb2xvcjogIzg2OTE5YTtcXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZ3JheTtcXG4gICAgICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gICAgICAgIH1cXG5cXG4gICAgICAgICZfd2hpdGUge1xcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR3aGl0ZTtcXG5cXG4gICAgICAgICAgICAuYnRuX190eHQge1xcbiAgICAgICAgICAgICAgICBjb2xvcjogJGJsdWU7XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfVxcblxcbiAgICAgICAgQG1lZGlhIChhbnktaG92ZXI6IGhvdmVyKSB7XFxuICAgICAgICAgICAgJjpob3ZlciB7XFxuICAgICAgICAgICAgICAgIGNsaXAtcGF0aDogcG9seWdvbigwIDAsIDEwMCUgMCwgMTAwJSAwLCAxMDAlIDgwJSwgMTAwJSAxMDAlLCAwIDEwMCUsIDAlIDgwJSwgMCUgMjAlKTtcXG4gICAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgIH1cXG5cXG4gICAgJl9zZWNvbmRhcnkge1xcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xcblxcbiAgICAgICAgJjo6YWZ0ZXIge1xcbiAgICAgICAgICAgIGNvbnRlbnQ6ICcnO1xcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICAgICAgICBib3R0b206IC0wLjNyZW07XFxuICAgICAgICAgICAgbGVmdDogMDtcXG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcXG4gICAgICAgICAgICBoZWlnaHQ6IDFweDtcXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkd2hpdGU7XFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZTtcXG4gICAgICAgICAgICB0cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0O1xcbiAgICAgICAgfVxcblxcbiAgICAgICAgLmJ0bl9fdHh0IHtcXG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMi40cmVtO1xcbiAgICAgICAgfVxcblxcbiAgICAgICAgQG1lZGlhIChhbnktaG92ZXI6IGhvdmVyKSB7XFxuICAgICAgICAgICAgJjpob3ZlciB7XFxuICAgICAgICAgICAgICAgICY6OmFmdGVyIHtcXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGVYKDAuMDUpO1xcbiAgICAgICAgICAgICAgICB9XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfVxcblxcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgICAgICAuYnRuX190eHQge1xcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogNC44cmVtO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIH1cXG5cXG4gICAgICAgICZfYmx1ZSB7XFxuICAgICAgICAgICAgY29sb3I6ICRibHVlO1xcblxcbiAgICAgICAgICAgICY6OmFmdGVyIHtcXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGJsdWU7XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICB9XFxufVxcblxcbi5pLWJ0biB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBmbGV4OiAwIDAgNC4ycmVtO1xcbiAgICB3aWR0aDogNC4ycmVtO1xcbiAgICBoZWlnaHQ6IDQuMnJlbTtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgICBmbGV4OiAwIDAgMTByZW07XFxuICAgICAgICB3aWR0aDogMTByZW07XFxuICAgICAgICBoZWlnaHQ6IDEwcmVtO1xcbiAgICB9XFxuXFxuICAgICY6OmJlZm9yZSxcXG4gICAgJjo6YWZ0ZXIge1xcbiAgICAgICAgY29udGVudDogJyc7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB0b3A6IDUwJTtcXG4gICAgICAgIGxlZnQ6IDUwJTtcXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICR3aGl0ZTtcXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgICB9XFxuXFxuICAgICY6OmJlZm9yZSB7XFxuICAgICAgICB3aWR0aDogMy44cmVtO1xcbiAgICAgICAgaGVpZ2h0OiAzLjhyZW07XFxuICAgICAgICBvcGFjaXR5OiAwLjQ7XFxuXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgICAgIHdpZHRoOiA5cmVtO1xcbiAgICAgICAgICAgIGhlaWdodDogOXJlbTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICAmOjphZnRlciB7XFxuICAgICAgICB3aWR0aDogMy40cmVtO1xcbiAgICAgICAgaGVpZ2h0OiAzLjRyZW07XFxuXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgICAgIHdpZHRoOiA4cmVtO1xcbiAgICAgICAgICAgIGhlaWdodDogOHJlbTtcXG4gICAgICAgIH1cXG4gICAgfVxcblxcbiAgICBzdmcge1xcbiAgICAgICAgd2lkdGg6IDEuNXJlbTtcXG4gICAgICAgIGhlaWdodDogMS41cmVtO1xcblxcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgICAgICB3aWR0aDogMy4ycmVtO1xcbiAgICAgICAgICAgIGhlaWdodDogMy4ycmVtO1xcbiAgICAgICAgfVxcbiAgICB9XFxuXFxuICAgICZfYmx1ZSB7XFxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDcxLCAxMjgsIDAuMSk7XFxuXFxuICAgICAgICAmOjpiZWZvcmUsXFxuICAgICAgICAmOjphZnRlciB7XFxuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJGJsdWU7XFxuICAgICAgICB9XFxuXFxuICAgICAgICBzdmcge1xcbiAgICAgICAgICAgIGZpbGw6ICRibHVlO1xcbiAgICAgICAgfVxcbiAgICB9XFxufVxcblwiLFwiaW5wdXRbdHlwZT1cXFwidGV4dFxcXCJdLFxcbmlucHV0W3R5cGU9XFxcImVtYWlsXFxcIl0sXFxuaW5wdXRbdHlwZT1cXFwidGVsXFxcIl0sXFxudGV4dGFyZWEge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbiAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xcbiAgYXBwZWFyYW5jZTogbm9uZTtcXG59XFxudGV4dGFyZWE6Zm9jdXMsXFxuaW5wdXQ6Zm9jdXMge1xcbiAgb3V0bGluZTogbm9uZTtcXG59XFxuXFxuLmlucHV0IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cXG4gICZfZmlsZSB7XFxuICAgIC5pbnB1dCB7XFxuICAgICAgJl9fZmllbGQge1xcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgICAgei1pbmRleDogMjtcXG4gICAgICAgIHRvcDogMDtcXG4gICAgICAgIGxlZnQ6IDA7XFxuICAgICAgICB3aWR0aDogMTAwJTtcXG4gICAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICAgIG9wYWNpdHk6IDA7XFxuICAgICAgfVxcblxcbiAgICAgICZfX3BsYWNlaG9sZGVyIHtcXG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgICAgIGNvbHVtbi1nYXA6IDEuMnJlbTtcXG4gICAgICAgIGxpbmUtaGVpZ2h0OiAyLjZyZW07XFxuXFxuICAgICAgICAmOjphZnRlciB7XFxuICAgICAgICAgIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgICAgICAgICBmbGV4OiAwIDAgMi40cmVtO1xcbiAgICAgICAgICB3aWR0aDogMi40cmVtO1xcbiAgICAgICAgICBoZWlnaHQ6IDIuNHJlbTtcXG4gICAgICAgICAgYmFja2dyb3VuZDogdXJsKFxcXCIuL2Fzc2V0cy9pbWFnZXMvaWNvbnMvY2xpcC5zdmdcXFwiKSBjZW50ZXIgLyBjb250YWluXFxuICAgICAgICAgICAgbm8tcmVwZWF0O1xcbiAgICAgICAgfVxcblxcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgICAgY29sdW1uLWdhcDogM3JlbTtcXG4gICAgICAgICAgbGluZS1oZWlnaHQ6IDQuMXJlbTtcXG5cXG4gICAgICAgICAgJjo6YWZ0ZXIge1xcbiAgICAgICAgICAgIGZsZXg6IDAgMCA0LjhyZW07XFxuICAgICAgICAgICAgd2lkdGg6IDQuOHJlbTtcXG4gICAgICAgICAgICBoZWlnaHQ6IDQuOHJlbTtcXG4gICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcblxcbiAgJjpub3QoJl9maWxlKSB7XFxuICAgIC5pbnB1dF9fZmllbGQge1xcbiAgICAgIHBhZGRpbmctYm90dG9tOiAxLjZyZW07XFxuICAgICAgZGlzcGxheTogYmxvY2s7XFxuICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgbGluZS1oZWlnaHQ6IDE7XFxuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICRsaWdodEJsdWU7XFxuICAgICAgdHJhbnNpdGlvbjpcXG4gICAgICAgIGNvbG9yIDAuM3MgZWFzZSxcXG4gICAgICAgIGJvcmRlci1ib3R0b20gMC4zcyBlYXNlO1xcblxcbiAgICAgICY6OnBsYWNlaG9sZGVyIHtcXG4gICAgICAgIGNvbG9yOiAjNGQ1ZjZlO1xcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyBlYXNlO1xcbiAgICAgIH1cXG4gICAgfVxcblxcbiAgICAmLl9pcy1maWxsZWQge1xcbiAgICAgIC5pbnB1dF9fZmllbGQge1xcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICRibGFjaztcXG4gICAgICAgIGNvbG9yOiAkYmxhY2s7XFxuICAgICAgfVxcbiAgICB9XFxuXFxuICAgICYuX2hhcy1lcnJvciB7XFxuICAgICAgJjo6YWZ0ZXIge1xcbiAgICAgICAgY29udGVudDogYXR0cihkYXRhLWhpbnQpO1xcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgICAgYm90dG9tOiAtMC40cmVtO1xcbiAgICAgICAgbGVmdDogMDtcXG4gICAgICAgIGZvbnQtc2l6ZTogMS40cmVtO1xcbiAgICAgICAgY29sb3I6ICRyZWQ7XFxuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwMCUpO1xcblxcbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgICAgYm90dG9tOiAtMC44cmVtO1xcbiAgICAgICAgICBmb250LXNpemU6IDJyZW07XFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICAgIC5pbnB1dF9fZmllbGQge1xcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICRyZWQ7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuICAvL1xcbiAgLy8gIC8vIC5pbnB1dF9fbGFiZWxcXG4gIC8vXFxuICAvLyAgJl9fbGFiZWwge1xcbiAgLy8gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgLy8gICAgZGlzcGxheTogZmxleDtcXG4gIC8vICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAvLyAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAvLyAgICBjb2x1bW4tZ2FwOiAzcmVtO1xcbiAgLy8gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIC8vICB9XFxuICAvL1xcbiAgLy8gICYuX2hhcy1mb2N1cyB7XFxuICAvLyAgICAuaW5wdXRfX2ZpZWxkIHtcXG4gIC8vICAgICAgYm9yZGVyOiAxcHggc29saWQgJGJsYWNrO1xcbiAgLy8gICAgfVxcbiAgLy8gIH1cXG4gIC8vICAmLl9oYXMtZXJyb3Ige1xcbiAgLy8gICAgLmlucHV0X19sYWJlbCB7XFxuICAvLyAgICAgIGNvbG9yOiB0cmFuc3BhcmVudDtcXG4gIC8vICAgICAgJjo6YWZ0ZXIge1xcbiAgLy8gICAgICAgIGNvbnRlbnQ6IGF0dHIoZGF0YS1oaW50KTtcXG4gIC8vICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAvLyAgICAgICAgdG9wOiAwO1xcbiAgLy8gICAgICAgIGxlZnQ6IDA7XFxuICAvLyAgICAgICAgY29sb3I6ICRyZWQ7XFxuICAvLyAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG4gIC8vICAgICAgfVxcbiAgLy8gICAgfVxcbiAgLy8gICAgLmlucHV0X19maWVsZCB7XFxuICAvLyAgICAgIGJvcmRlcjogMXB4IHNvbGlkICRyZWQ7XFxuICAvLyAgICAgIGNvbG9yOiAkcmVkO1xcbiAgLy8gICAgICAmOjpwbGFjZWhvbGRlciB7XFxuICAvLyAgICAgICAgY29sb3I6ICRyZWQ7XFxuICAvLyAgICAgIH1cXG4gIC8vICAgIH1cXG4gIC8vICB9XFxufVxcblxcbi5vcHRpb24ge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcblxcbiAgJl9faW5wdXQge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIGFwcGVhcmFuY2U6IG5vbmU7XFxuXFxuICAgICY6Y2hlY2tlZCArIC5vcHRpb25fX3R4dDo6YWZ0ZXIge1xcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICAgIH1cXG4gIH1cXG5cXG4gICZfX3R4dCB7XFxuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICAgIGNvbHVtbi1nYXA6IDAuOHJlbTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBjb2x1bW4tZ2FwOiAxLjZyZW07XFxuICAgIH1cXG5cXG4gICAgJjo6YmVmb3JlLFxcbiAgICAmOjphZnRlciB7XFxuICAgICAgY29udGVudDogXFxcIlxcXCI7XFxuICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgICB9XFxuXFxuICAgICY6OmJlZm9yZSB7XFxuICAgICAgZmxleDogMCAwIDIuNHJlbTtcXG4gICAgICB3aWR0aDogMi40cmVtO1xcbiAgICAgIGhlaWdodDogMi40cmVtO1xcbiAgICAgIGJvcmRlcjogMS41cHggc29saWQgJGJsdWU7XFxuXFxuICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgIGZsZXg6IDAgMCA0LjhyZW07XFxuICAgICAgICB3aWR0aDogNC44cmVtO1xcbiAgICAgICAgaGVpZ2h0OiA0LjhyZW07XFxuICAgICAgfVxcbiAgICB9XFxuXFxuICAgICY6OmFmdGVyIHtcXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgbGVmdDogMC40cmVtO1xcbiAgICAgIHRvcDogMC40cmVtO1xcbiAgICAgIHdpZHRoOiAxLjZyZW07XFxuICAgICAgaGVpZ2h0OiAxLjZyZW07XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGJsdWU7XFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcXG4gICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xcblxcbiAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgICB0b3A6IDAuOHJlbTtcXG4gICAgICAgIGxlZnQ6IDAuOHJlbTtcXG4gICAgICAgIHdpZHRoOiAzLjJyZW07XFxuICAgICAgICBoZWlnaHQ6IDMuMnJlbTtcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuLmNoZWNrYm94IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xcblxcbiAgJl9faW5wdXQge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHotaW5kZXg6IDI7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIGFwcGVhcmFuY2U6IG5vbmU7XFxuXFxuICAgICY6Y2hlY2tlZCArIC5jaGVja2JveF9fdHh0IHtcXG4gICAgICAmOjpiZWZvcmUge1xcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJGJsdWU7XFxuICAgICAgfVxcbiAgICAgICY6OmFmdGVyIHtcXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuXFxuICAmX190eHQge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBjb2x1bW4tZ2FwOiAwLjhyZW07XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBjb2x1bW4tZ2FwOiAxLjZyZW07XFxuICAgIH1cXG5cXG4gICAgJjo6YmVmb3JlIHtcXG4gICAgICBjb250ZW50OiBcXFwiXFxcIjtcXG4gICAgICBmbGV4OiAwIDAgMi4ycmVtO1xcbiAgICAgIHdpZHRoOiAyLjJyZW07XFxuICAgICAgaGVpZ2h0OiAyLjJyZW07XFxuICAgICAgYm9yZGVyOiAxcHggc29saWQgJGxpZ2h0Qmx1ZTtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkd2hpdGU7XFxuICAgICAgdHJhbnNpdGlvbjogYm9yZGVyIDAuM3MgZWFzZTtcXG5cXG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgZmxleDogMCAwIDQuNHJlbTtcXG4gICAgICAgIHdpZHRoOiA0LjRyZW07XFxuICAgICAgICBoZWlnaHQ6IDQuNHJlbTtcXG4gICAgICB9XFxuICAgIH1cXG5cXG4gICAgJjo6YWZ0ZXIge1xcbiAgICAgIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICB0b3A6IDAuM3JlbTtcXG4gICAgICBsZWZ0OiAwLjNyZW07XFxuICAgICAgd2lkdGg6IDEuNnJlbTtcXG4gICAgICBoZWlnaHQ6IDEuNnJlbTtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYmx1ZTtcXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XFxuXFxuICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgIGxlZnQ6IDAuNnJlbTtcXG4gICAgICAgIHRvcDogMC42cmVtO1xcbiAgICAgICAgd2lkdGg6IDMuMnJlbTtcXG4gICAgICAgIGhlaWdodDogMy4ycmVtO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcIi5icmVhZGNydW1icyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGNvbHVtbi1nYXA6IDEuMnJlbTtcXG5cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcXG4gICAgZm9udC1zaXplOiAzLjJyZW07XFxuICB9XFxuXFxuICAmX19saW5rIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgY29sdW1uLWdhcDogMS4ycmVtO1xcblxcbiAgICAmOjphZnRlciB7XFxuICAgICAgY29udGVudDogXFxcIlxcXCI7XFxuICAgICAgd2lkdGg6IDJyZW07XFxuICAgICAgaGVpZ2h0OiAwLjJyZW07XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzgwOGQ5NztcXG4gICAgfVxcblxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcXG5cXG4gICAgICAmOjphZnRlciB7XFxuICAgICAgICB3aWR0aDogMy4ycmVtO1xcbiAgICAgICAgaGVpZ2h0OiAxcHg7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuXFxuICAmX190eHQge1xcbiAgICBjb2xvcjogJGJsdWU7XFxuICB9XFxufVxcblwiLFwiLnRhYnMge1xcbiAgJl9fbmF2aWdhdGlvbiB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGNvbHVtbi1nYXA6IDEuNXJlbTtcXG4gIH1cXG4gICZfX2JvZHkge1xcbiAgICBwYWRkaW5nLXRvcDogMXJlbTtcXG4gIH1cXG59XFxuXFxuLnRhYiB7XFxuICBwYWRkaW5nOiAwIDIuOHJlbTtcXG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGhlaWdodDogMTByZW07XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAkZ3JheTtcXG4gIHRyYW5zaXRpb246XFxuICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyBlYXNlLFxcbiAgICBjb2xvciAwLjNzIGVhc2U7XFxuXFxuICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICBwYWRkaW5nOiAwIDIuNHJlbTtcXG4gICAgaGVpZ2h0OiAxMS4ycmVtO1xcbiAgfVxcblxcbiAgc3ZnIHtcXG4gICAgZmxleDogMCAwIDIuNHJlbTtcXG4gICAgd2lkdGg6IDIuNHJlbTtcXG4gICAgaGVpZ2h0OiAyLjRyZW07XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAuM3JlbSwgLTAuM3JlbSk7XFxuICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyBlYXNlO1xcblxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgIGZsZXg6IDAgMCAzLjJyZW07XFxuICAgICAgd2lkdGg6IDMuMnJlbTtcXG4gICAgICBoZWlnaHQ6IDMuMnJlbTtcXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLjZyZW0sIC0wLjZyZW0pO1xcbiAgICB9XFxuICB9XFxuXFxuICAmX19udW0ge1xcbiAgICBtYXJnaW4tcmlnaHQ6IDAuOHJlbTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBtYXJnaW4tcmlnaHQ6IDEuNnJlbTtcXG4gICAgfVxcbiAgfVxcblxcbiAgJl9fdHh0IHtcXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgfVxcblxcbiAgJi5faXMtYWN0aXZlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGJsdWU7XFxuICAgIGNvbG9yOiAkd2hpdGU7XFxuXFxuICAgIHN2ZyB7XFxuICAgICAgZmlsbDogJHdoaXRlO1xcbiAgICB9XFxuICB9XFxufVxcblwiLG51bGxdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbMl0udXNlWzFdIS4uLy4uL25vZGVfbW9kdWxlcy9ncm91cC1jc3MtbWVkaWEtcXVlcmllcy1sb2FkZXIvbGliL2luZGV4LmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1syXS51c2VbMV0hLi4vLi4vbm9kZV9tb2R1bGVzL2dyb3VwLWNzcy1tZWRpYS1xdWVyaWVzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0ICcuLi9zY3NzL3N0eWxlLnNjc3MnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHV0aWxzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzL3V0aWxzLmpzJztcblxuLy8gaGFtYnVyZ2VyIG1lbnVcbnV0aWxzLm1lbnVJbml0KCk7XG5cbi8vIHNldCBjdXJyZW50IHllYXJcbnV0aWxzLnNldEN1cnJlbnRZZWFyKCk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gY29tcG9uZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIGZvcm1zXG5pbXBvcnQgJy4vdXRpbHMvZm9ybXMnO1xuXG4vLyB0YWJzXG5pbXBvcnQgJy4vdXRpbHMvdGFicy5qcyc7XG5cbi8vIGFjY29yZGlvblxuLy8gaW1wb3J0IFwiLi91dGlscy9hY2NvcmRpb24uanNcIjtcblxuLy8gc2VsZWN0XG4vLyBpbXBvcnQgXCIuL3V0aWxzL3NlbGVjdC5qc1wiO1xuXG4vLyBtb2RhbHNcbmltcG9ydCAnLi91dGlscy9tb2RhbHMuanMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5pbXBvcnQgJy4vZGV2L3Z6bXNrMS5qcyc7XG5pbXBvcnQgJy4vZGV2L21hcmt1c0RNLmpzJztcbmltcG9ydCAnLi9kZXYvdWtpazAuanMnO1xuIl0sIm5hbWVzIjpbIm1vZHVsZXMiLCJWYWxpZGF0aW9uIiwiY29uc3RydWN0b3IiLCJhdHRycyIsIlJFUVVJUkVEIiwiSUdOT1JFX1ZBTElEQVRJT04iLCJBSkFYIiwiREVWIiwiSUdOT1JFX0ZPQ1VTIiwiU0hPV19QTEFDRUhPTERFUiIsIlZBTElEQVRFIiwiY2xhc3NlcyIsIkhBU19FUlJPUiIsIkhBU19GT0NVUyIsIklTX0ZJTExFRCIsIklTX1JFVkVBTEVEIiwiZ2V0RXJyb3JzIiwiZm9ybSIsImVyciIsInJlcXVpcmVkRmllbGRzIiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsImZvckVhY2giLCJyZXF1aXJlZEZpZWxkIiwib2Zmc2V0UGFyZW50IiwidGFnTmFtZSIsImRpc2FibGVkIiwidmFsaWRhdGVGaWVsZCIsImFkZEVycm9yIiwiY2xhc3NMaXN0IiwiYWRkIiwicGFyZW50RWxlbWVudCIsInJlbW92ZSIsInJlbW92ZUVycm9yIiwiZGF0YXNldCIsInJlcXVpcmVkIiwidmFsdWUiLCJyZXBsYWNlIiwidGVzdEVtYWlsIiwidHlwZSIsImNoZWNrZWQiLCJ0cmltIiwiY2xlYXJGaWVsZHMiLCJyZXNldCIsInNldFRpbWVvdXQiLCJpbnB1dHMiLCJjaGVja2JveGVzIiwiaW5kZXgiLCJpbnB1dCIsImNoZWNrYm94IiwidGVzdCIsIkZvcm1TdWJtaXRpb24iLCJzaG91bGRWYWxpZGF0ZSIsImZvcm1zIiwiZG9jdW1lbnQiLCJpbml0Iiwic2VuZEZvcm0iLCJyZXNwb25zZVJlc3VsdCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsInBvcHVwIiwibW9kYWwiLCJtb2RhbE1lc3NhZ2UiLCJvcGVuIiwiY29uc29sZSIsImxvZyIsImhhbmRsZVN1Ym1pdGlvbiIsImUiLCJoYXNBdHRyaWJ1dGUiLCJhamF4IiwicHJldmVudERlZmF1bHQiLCJhY3Rpb24iLCJnZXRBdHRyaWJ1dGUiLCJtZXRob2QiLCJkYXRhIiwiRm9ybURhdGEiLCJyZXNwb25zZSIsImZldGNoIiwiYm9keSIsIm9rIiwicmVzdWx0IiwianNvbiIsImFsZXJ0IiwiX3RoaXMiLCJwYXNzd29yZEZpZWxkcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0YXJnZXQiLCJmaWVsZCIsImJ0biIsIm5leHRFbGVtZW50U2libGluZyIsImNvbnRhaW5zIiwic2V0QXR0cmlidXRlIiwidG9nZ2xlIiwiRm9ybUZpZWxkcyIsImZpZWxkcyIsInNhdmVQbGFjZWhvbGRlciIsInBsYWNlaG9sZGVyIiwiaGFuZGxlRm9jdXNpbiIsImNsb3Nlc3QiLCJoYW5kbGVGb2N1c291dCIsImJpbmQiLCJib2R5TG9ja1N0YXR1cyIsImJvZHlMb2NrIiwiYm9keVVubG9jayIsIk1vZGFsIiwib3B0aW9ucyIsImNvbmZpZyIsImxvZ2dpbmciLCJhdHRyaWJ1dGVPcGVuQnV0dG9uIiwiYXR0cmlidXRlQ2xvc2VCdXR0b24iLCJmaXhFbGVtZW50U2VsZWN0b3IiLCJ5b3V0dWJlQXR0cmlidXRlIiwieW91dHViZVBsYWNlQXR0cmlidXRlIiwic2V0QXV0b3BsYXlZb3V0dWJlIiwibW9kYWxDb250ZW50IiwibW9kYWxBY3RpdmUiLCJib2R5QWN0aXZlIiwiZm9jdXNDYXRjaCIsImNsb3NlRXNjIiwiaGFzaFNldHRpbmdzIiwibG9jYXRpb24iLCJnb0hhc2giLCJvbiIsImJlZm9yZU9wZW4iLCJhZnRlck9wZW4iLCJiZWZvcmVDbG9zZSIsImFmdGVyQ2xvc2UiLCJ5b3VUdWJlQ29kZSIsImlzT3BlbiIsInRhcmdldE9wZW4iLCJzZWxlY3RvciIsImVsZW1lbnQiLCJwcmV2aW91c09wZW4iLCJsYXN0Q2xvc2VkIiwiX2RhdGFWYWx1ZSIsImhhc2giLCJfcmVvcGVuIiwiX3NlbGVjdG9yT3BlbiIsImxhc3RGb2N1c0VsIiwiX2ZvY3VzRWwiLCJpbml0bW9kYWxzIiwiZXZlbnRzbW9kYWwiLCJidXR0b25PcGVuIiwiYnV0dG9uQ2xvc2UiLCJjbG9zZSIsIndoaWNoIiwiY29kZSIsIl9mb2N1c0NhdGNoIiwid2luZG93IiwiX29wZW5Ub0hhc2giLCJzZWxlY3RvclZhbHVlIiwiZG9jdW1lbnRFbGVtZW50IiwicHJldmlvdXNBY3RpdmVFbGVtZW50IiwiYWN0aXZlRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjb2RlVmlkZW8iLCJ1cmxWaWRlbyIsImlmcmFtZSIsImNyZWF0ZUVsZW1lbnQiLCJhdXRvcGxheSIsInlvdXR1YmVQbGFjZSIsImFwcGVuZENoaWxkIiwiX2dldEhhc2giLCJfc2V0SGFzaCIsIm0iLCJpbm5lcldpZHRoIiwiX2ZvY3VzVHJhcCIsImlubmVySFRNTCIsIl9yZW1vdmVIYXNoIiwiaW5jbHVkZXMiLCJjbGFzc0luSGFzaCIsImJ1dHRvbnMiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiaHJlZiIsInNwbGl0IiwiZm9jdXNhYmxlIiwiZm9jdXNBcnJheSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiZm9jdXNlZEluZGV4IiwiaW5kZXhPZiIsInNoaWZ0S2V5IiwiZm9jdXMiLCJzZXRIYXNoIiwiZ2V0SGFzaCIsIlRhYnMiLCJUQUJTIiwiSU5ERVgiLCJUSVRMRVMiLCJUSVRMRSIsIlRBQl9JVEVNIiwiQk9EWSIsIkhBU0giLCJJTklUIiwiQUNUSVZFIiwiTU9EQUwiLCJ0YWJzIiwiYWN0aXZlSGFzaCIsInN0YXJ0c1dpdGgiLCJ0YWJzQmxvY2siLCJzZXRBY3Rpb25zIiwic2V0U3RhdHVzIiwidGl0bGVzIiwiY29udGVudCIsInRhYnNJbmRleCIsImhhc0hhc2giLCJmcm9tIiwiZmlsdGVyIiwiaXRlbSIsImluZHgiLCJoaWRkZW4iLCJ0aXRsZSIsImFjdGl2ZVRpdGxlIiwiYWN0aXZlSGFzaEJsb2NrIiwibWVudUluaXQiLCJtZW51T3BlbiIsIm1lbnVDbG9zZSIsImJvZHlMb2NrVG9nZ2xlIiwiZGVsYXkiLCJ1bmlxdWVBcnJheSIsImFycmF5Iiwic2VsZiIsImRhdGFNZWRpYVF1ZXJpZXMiLCJkYXRhU2V0VmFsdWUiLCJtZWRpYSIsImJyZWFrcG9pbnRzQXJyYXkiLCJwYXJhbXMiLCJicmVha3BvaW50IiwicGFyYW1zQXJyYXkiLCJwdXNoIiwibWRRdWVyaWVzIiwibWFwIiwibWRRdWVyaWVzQXJyYXkiLCJtZWRpYUJyZWFrcG9pbnQiLCJtZWRpYVR5cGUiLCJtYXRjaE1lZGlhIiwiaXRlbXNBcnJheSIsIl9zbGlkZVVwIiwiZHVyYXRpb24iLCJzaG93bW9yZSIsInN0eWxlIiwidHJhbnNpdGlvblByb3BlcnR5IiwidHJhbnNpdGlvbkR1cmF0aW9uIiwiaGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0Iiwib3ZlcmZsb3ciLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsInJlbW92ZVByb3BlcnR5IiwiX3NsaWRlRG93biIsIl9zbGlkZVRvZ2dsZSIsInJlbVRvUHgiLCJyZW1WYWx1ZSIsImh0bWxGb250U2l6ZSIsInBhcnNlRmxvYXQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZm9udFNpemUiLCJweFZhbHVlIiwiTWF0aCIsInJvdW5kIiwic2V0Q3VycmVudFllYXIiLCJnZXRFbGVtZW50QnlJZCIsIkRhdGUiLCJnZXRGdWxsWWVhciIsInJlbW92ZUNsYXNzZXMiLCJjbGFzc05hbWUiLCJpIiwidXRpbHMiXSwic291cmNlUm9vdCI6IiJ9