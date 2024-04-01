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
/* harmony export */   setHash: () => (/* binding */ setHash),
/* harmony export */   uniqueArray: () => (/* binding */ uniqueArray)
/* harmony export */ });
/**
 * set hash to url
 * @param {string} hash
 */
const setHash = hash => {
  hash = hash ? `#${hash}` : window.location.href.split("#")[0];
  history.pushState("", "", hash);
};

/**
 * get hash from url
 * @returns string
 */
const getHash = () => {
  if (location.hash) {
    return location.hash.replace("#", "");
  }
};

/**
 * initializes hamburger menu
 */
const menuInit = () => {
  if (document.querySelector(".hamburger")) {
    document.addEventListener("click", function (e) {
      if (bodyLockStatus && e.target.closest(".hamburger")) {
        menuOpen();
      } else if (bodyLockStatus && document.documentElement.classList.contains("_menu-opened") && (e.target.closest(".menu__close-btn") || !e.target.closest(".menu"))) {
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
  document.documentElement.classList.add("_menu-opened");
};
/**
 * closes hamburger menu
 */
const menuClose = () => {
  bodyUnlock();
  document.documentElement.classList.remove("_menu-opened");
};

// body lock
let bodyLockStatus = true;
/**
 * toggles body lock
 * @param {number} delay
 */
const bodyLockToggle = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (document.documentElement.classList.contains("lock")) {
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
      document.documentElement.classList.remove("lock");
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
    document.documentElement.classList.add("lock");
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
      return item.dataset[dataSetValue].split(",")[0];
    }
  });
  // objects with media queries initialization
  if (media.length) {
    const breakpointsArray = [];
    media.forEach(item => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(",");
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // get unique breakpoints
    let mdQueries = breakpointsArray.map(function (item) {
      return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
    });
    mdQueries = uniqueArray(mdQueries);
    const mdQueriesArray = [];
    if (mdQueries.length) {
      // work with every breakpoint
      mdQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(",");
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
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}rem` : `0`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      // create event
      document.dispatchEvent(new CustomEvent("slideUpDone", {
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
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}rem` : `0`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      // create event
      document.dispatchEvent(new CustomEvent("slideDownDone", {
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
  return Math.round(pxValue) + "px";
}

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
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Noto+Sans:wdth@75&display=swap);"]);
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
}

.wrapper {
  margin: 0 auto;
  max-width: 1920px;
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
  font-family: "Bahnschrift";
}

.btn {
  display: inline-flex;
  text-align: center;
  color: #ffffff;
}
.btn_primary {
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

.arrow-btn {
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
.arrow-btn::before, .arrow-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid #ffffff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.arrow-btn::before {
  width: 3.8rem;
  height: 3.8rem;
  opacity: 0.4;
}
.arrow-btn::after {
  width: 3.4rem;
  height: 3.4rem;
}
.arrow-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}
.arrow-btn_blue {
  border: 1px solid rgba(0, 71, 128, 0.1);
}
.arrow-btn_blue::before, .arrow-btn_blue::after {
  border: 1px solid #004780;
}
.arrow-btn_blue svg {
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
  .btn_primary .btn__txt {
    line-height: 4.2rem;
  }
  .btn_secondary .btn__txt {
    line-height: 4.8rem;
  }
  .arrow-btn {
    flex: 0 0 10rem;
    width: 10rem;
    height: 10rem;
  }
  .arrow-btn::before {
    width: 9rem;
    height: 9rem;
  }
  .arrow-btn::after {
    width: 8rem;
    height: 8rem;
  }
  .arrow-btn svg {
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
}`, "",{"version":3,"sources":["webpack://./src/scss/fonts.scss","webpack://./src/scss/style.scss","webpack://./src/scss/set.scss","webpack://./src/ui/_typo.scss","webpack://./src/ui/_buttons.scss","webpack://./src/ui/_input.scss","webpack://./src/ui/_breadcrumbs.scss","webpack://./src/ui/_tabs.scss","<no source>"],"names":[],"mappings":"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","sourcesContent":["@font-face {\n  font-family: \"Bahnschrift\";\n  src: url(\"../assets/fonts/Bahnschrift.woff2\") format(\"woff2\");\n  font-weight: 400;\n  font-style: normal;\n}\n","// --------------------------------- mixins ---------------------------------\n\n@import \"./mixins\";\n\n// -------------------------------- variables -------------------------------\n\n// colors\n$white: #ffffff;\n$black: #000000;\n$blue: #004780;\n$gray: #f2f2f2;\n$fontColor: #001b30;\n$lightBlue: #a6bdd0;\n$red: #d90000;\n\n// ---------------------------------- fonts ---------------------------------\n\n@import url(\"https://fonts.googleapis.com/css2?family=Noto+Sans:wdth@75&display=swap\");\n\n// local fonts\n@import \"./fonts\";\n\n// ------------------------------- base styles ------------------------------\n\n// base scss file\n@import \"./set\";\n\n// html, body\nhtml {\n  &.lock {\n    overflow: hidden;\n    pointer-events: none;\n  }\n}\nhtml,\nbody {\n  overflow-x: clip;\n}\n\n// main\nmain {\n  position: relative;\n}\n\n.wrapper {\n  margin: 0 auto;\n  max-width: 1920px;\n}\n\n// --------------------------------------------------------------------------\n\n// header / footer\n@import \"./sections/header\";\n@import \"./sections/footer\";\n\n// ui\n@import \"../ui/ui\";\n\n// --------------------------------------------------------------------------\n\n@import \"./dev/vzmsk1.scss\";\n@import \"./dev/markusDM.scss\";\n@import \"./dev/ukik0.scss\";\n","*,\n*::before,\n*::after {\n    box-sizing: border-box;\n}\nhtml {\n    font-family: 'Noto Sans'; // шрифт по умолчанию по сайту\n    font-size: 0.5208335vw; // на разрешении 1920 0.520835vw === 10px\n    font-style: normal;\n    font-weight: normal;\n    -webkit-animation: bugfix infinite 1s;\n    line-height: 1.2;\n    margin: 0;\n    height: 100%;\n    padding: 0;\n}\n\nbody {\n    font-style: normal;\n    font-weight: normal;\n    -webkit-animation: bugfix infinite 1s;\n    line-height: 1.2;\n    margin: 0;\n    padding: 0;\n    height: 100%;\n    font-size: 1.8rem;\n    color: $fontColor; // цвет по умолчанию текста по сайту\n    background-color: $white;\n}\n\ninput,\ntextarea {\n    -webkit-animation: bugfix infinite 1s;\n    line-height: inherit;\n    margin: 0;\n    padding: 0;\n    background-color: transparent;\n    border: none;\n    color: inherit;\n}\na {\n    color: unset;\n}\na,\na:hover {\n    text-decoration: none;\n}\n\nbutton,\ninput,\na,\ntextarea {\n    outline: none;\n    cursor: pointer;\n    font: inherit;\n    &:focus {\n        outline: none;\n    }\n    &:active {\n        outline: none;\n    }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n    font: inherit;\n    margin: 0;\n    padding: 0;\n}\np {\n    margin-top: 0;\n    margin-bottom: 0;\n}\n\nimg {\n    width: 100%;\n    height: auto;\n    display: block;\n}\n\nbutton {\n    border: none;\n    color: inherit;\n    font: inherit;\n    text-align: inherit;\n    padding: 0;\n    background-color: transparent;\n}\nul {\n    padding: 0;\n    margin: 0;\n}\n\nul li {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n\n.container {\n    width: 176rem;\n    margin: 0 auto;\n}\n\nsection {\n    margin-bottom: 19rem;\n    \n    @media (max-width: 48em) {\n        margin-bottom: 20rem;\n    }\n}\n\ninput[type='number']::-webkit-inner-spin-button,\ninput[type='number']::-webkit-outer-spin-button {\n    -webkit-appearance: none;\n    margin: 0;\n}\n\ninput[type='number'] {\n    -moz-appearance: textfield;\n}\n\nsvg,\nimg {\n    width: 100%;\n    height: auto;\n    object-fit: contain;\n}\n\n@media (min-width: 1920px) {\n    html {\n        font-size: 10px;\n    }\n}\n\n@media (max-width: 48em) {\n    html {\n        font-size: 5px;\n        font-size: 1.5625vw;\n        font-size: calc((100 / 375) * 5vw); // где 375 это ширина моб версии макета\n        -webkit-text-size-adjust: none;\n    }\n\n    body {\n        font-size: 2.8rem;\n        -webkit-text-size-adjust: none;\n    }\n\n    .container {\n        padding: 0 2.4rem; // в моб версии отступ от края задаем для всех контейнеров, а там где не нужно можем точечно убрать\n        width: 100%;\n    }\n}\n",".h {\n  font-family: \"Bahnschrift\";\n  line-height: 120%;\n\n  &_h1 {\n    font-size: 7rem;\n    text-transform: uppercase;\n\n    @media (max-width: 48em) {\n      font-size: 5.6rem;\n    }\n  }\n\n  &_h2 {\n    font-size: 6rem;\n\n    @media (max-width: 48em) {\n      font-size: 5.6rem;\n    }\n  }\n\n  &_h3 {\n    font-size: 3.2rem;\n\n    @media (max-width: 48em) {\n      font-size: 4.4rem;\n      line-height: 1;\n    }\n  }\n\n  &_h4 {\n    font-size: 2.4rem;\n\n    @media (max-width: 48em) {\n      font-size: 4.4rem;\n      line-height: 1;\n    }\n  }\n}\n\n.txt24 {\n  font-size: 2.4rem;\n  line-height: 3.3rem;\n\n  @media (max-width: 48em) {\n    font-size: 4rem;\n  }\n}\n\n.txt22 {\n  font-size: 2.2rem;\n  line-height: 2.6rem;\n\n  &_sb {\n    font-family: \"Bahnschrift\";\n  }\n\n  @media (max-width: 48em) {\n    font-size: 3.6rem;\n  }\n}\n",".btn {\n  display: inline-flex;\n  text-align: center;\n  color: $white;\n\n  &_primary {\n    padding: 1.4rem 2.8rem;\n    justify-content: center;\n    align-items: center;\n    background-color: $blue;\n    clip-path: polygon(\n      0 0,\n      92% 0,\n      100% 22%,\n      100% 80%,\n      100% 100%,\n      0 100%,\n      0% 80%,\n      0% 20%\n    );\n    transition: clip-path 0.3s ease;\n\n    @media (max-width: 48em) {\n      padding: 2.8rem 5.6rem;\n    }\n\n    .btn__txt {\n      line-height: 2.6rem;\n\n      @media (max-width: 48em) {\n        line-height: 4.2rem;\n      }\n    }\n\n    &:disabled {\n      color: #86919a;\n      background-color: $gray;\n      pointer-events: none;\n    }\n\n    &_white {\n      background-color: $white;\n\n      .btn__txt {\n        color: $blue;\n      }\n    }\n\n    @media (any-hover: hover) {\n      &:hover {\n        clip-path: polygon(\n          0 0,\n          100% 0,\n          100% 0,\n          100% 80%,\n          100% 100%,\n          0 100%,\n          0% 80%,\n          0% 20%\n        );\n      }\n    }\n  }\n\n  &_secondary {\n    position: relative;\n\n    &::after {\n      content: \"\";\n      position: absolute;\n      bottom: -0.3rem;\n      left: 0;\n      width: 100%;\n      height: 1px;\n      background-color: $white;\n      transition: transform 0.3s ease;\n      transform-origin: left;\n    }\n\n    .btn__txt {\n      line-height: 2.4rem;\n    }\n\n    @media (any-hover: hover) {\n      &:hover {\n        &::after {\n          transform: scaleX(0.05);\n        }\n      }\n    }\n\n    @media (max-width: 48em) {\n      .btn__txt {\n        line-height: 4.8rem;\n      }\n    }\n\n    &_blue {\n      color: $blue;\n\n      &::after {\n        background-color: $blue;\n      }\n    }\n  }\n}\n\n.arrow-btn {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 4.2rem;\n  width: 4.2rem;\n  height: 4.2rem;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 50%;\n\n  @media (max-width: 48em) {\n    flex: 0 0 10rem;\n    width: 10rem;\n    height: 10rem;\n  }\n\n  &::before,\n  &::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    border: 1px solid $white;\n    border-radius: 50%;\n    transform: translate(-50%, -50%);\n  }\n\n  &::before {\n    width: 3.8rem;\n    height: 3.8rem;\n    opacity: 0.4;\n\n    @media (max-width: 48em) {\n      width: 9rem;\n      height: 9rem;\n    }\n  }\n\n  &::after {\n    width: 3.4rem;\n    height: 3.4rem;\n\n    @media (max-width: 48em) {\n      width: 8rem;\n      height: 8rem;\n    }\n  }\n\n  svg {\n    width: 1.5rem;\n    height: 1.5rem;\n\n    @media (max-width: 48em) {\n      width: 3.2rem;\n      height: 3.2rem;\n    }\n  }\n\n  &_blue {\n    border: 1px solid rgba(0, 71, 128, 0.1);\n\n    &::before,\n    &::after {\n      border: 1px solid $blue;\n    }\n\n    svg {\n      fill: $blue;\n    }\n  }\n}\n","input[type=\"text\"],\ninput[type=\"email\"],\ninput[type=\"tel\"],\ntextarea {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\ntextarea:focus,\ninput:focus {\n  outline: none;\n}\n\n.input {\n  position: relative;\n\n  &_file {\n    .input {\n      &__field {\n        position: absolute;\n        z-index: 2;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        opacity: 0;\n      }\n\n      &__placeholder {\n        display: inline-flex;\n        align-items: center;\n        column-gap: 1.2rem;\n        line-height: 2.6rem;\n\n        &::after {\n          content: \"\";\n          flex: 0 0 2.4rem;\n          width: 2.4rem;\n          height: 2.4rem;\n          background: url(\"./assets/images/icons/clip.svg\") center / contain\n            no-repeat;\n        }\n\n        @media (max-width: 48em) {\n          column-gap: 3rem;\n          line-height: 4.1rem;\n\n          &::after {\n            flex: 0 0 4.8rem;\n            width: 4.8rem;\n            height: 4.8rem;\n          }\n        }\n      }\n    }\n  }\n\n  &:not(&_file) {\n    .input__field {\n      padding-bottom: 1.6rem;\n      display: block;\n      width: 100%;\n      line-height: 1;\n      border-bottom: 1px solid $lightBlue;\n      transition:\n        color 0.3s ease,\n        border-bottom 0.3s ease;\n\n      &::placeholder {\n        color: #4d5f6e;\n        transition: color 0.3s ease;\n      }\n    }\n\n    &._is-filled {\n      .input__field {\n        border-bottom: 1px solid $black;\n        color: $black;\n      }\n    }\n\n    &._has-error {\n      &::after {\n        content: attr(data-hint);\n        position: absolute;\n        bottom: -0.4rem;\n        left: 0;\n        font-size: 1.4rem;\n        color: $red;\n        white-space: nowrap;\n        transform: translateY(100%);\n\n        @media (max-width: 48em) {\n          bottom: -0.8rem;\n          font-size: 2rem;\n        }\n      }\n      .input__field {\n        border-bottom: 1px solid $red;\n      }\n    }\n  }\n  //\n  //  // .input__label\n  //\n  //  &__label {\n  //    position: relative;\n  //    display: flex;\n  //    align-items: center;\n  //    justify-content: space-between;\n  //    column-gap: 3rem;\n  //    white-space: nowrap;\n  //  }\n  //\n  //  &._has-focus {\n  //    .input__field {\n  //      border: 1px solid $black;\n  //    }\n  //  }\n  //  &._has-error {\n  //    .input__label {\n  //      color: transparent;\n  //      &::after {\n  //        content: attr(data-hint);\n  //        position: absolute;\n  //        top: 0;\n  //        left: 0;\n  //        color: $red;\n  //        white-space: nowrap;\n  //      }\n  //    }\n  //    .input__field {\n  //      border: 1px solid $red;\n  //      color: $red;\n  //      &::placeholder {\n  //        color: $red;\n  //      }\n  //    }\n  //  }\n}\n\n.option {\n  position: relative;\n  cursor: pointer;\n\n  &__input {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    opacity: 0;\n    appearance: none;\n\n    &:checked + .option__txt::after {\n      transform: scale(1);\n    }\n  }\n\n  &__txt {\n    display: inline-flex;\n    align-items: center;\n    cursor: pointer;\n    column-gap: 0.8rem;\n\n    @media (max-width: 48em) {\n      column-gap: 1.6rem;\n    }\n\n    &::before,\n    &::after {\n      content: \"\";\n      border-radius: 50%;\n    }\n\n    &::before {\n      flex: 0 0 2.4rem;\n      width: 2.4rem;\n      height: 2.4rem;\n      border: 1.5px solid $blue;\n\n      @media (max-width: 48em) {\n        flex: 0 0 4.8rem;\n        width: 4.8rem;\n        height: 4.8rem;\n      }\n    }\n\n    &::after {\n      position: absolute;\n      left: 0.4rem;\n      top: 0.4rem;\n      width: 1.6rem;\n      height: 1.6rem;\n      background-color: $blue;\n      transform: scale(0);\n      transition: transform 0.3s ease;\n\n      @media (max-width: 48em) {\n        top: 0.8rem;\n        left: 0.8rem;\n        width: 3.2rem;\n        height: 3.2rem;\n      }\n    }\n  }\n}\n\n.checkbox {\n  position: relative;\n  display: inline-flex;\n\n  &__input {\n    position: absolute;\n    z-index: 2;\n    width: 100%;\n    height: 100%;\n    opacity: 0;\n    appearance: none;\n\n    &:checked + .checkbox__txt {\n      &::before {\n        border: 1px solid $blue;\n      }\n      &::after {\n        transform: scale(1);\n      }\n    }\n  }\n\n  &__txt {\n    position: relative;\n    display: inline-flex;\n    align-items: center;\n    column-gap: 0.8rem;\n    cursor: pointer;\n\n    @media (max-width: 48em) {\n      column-gap: 1.6rem;\n    }\n\n    &::before {\n      content: \"\";\n      flex: 0 0 2.2rem;\n      width: 2.2rem;\n      height: 2.2rem;\n      border: 1px solid $lightBlue;\n      background-color: $white;\n      transition: border 0.3s ease;\n\n      @media (max-width: 48em) {\n        flex: 0 0 4.4rem;\n        width: 4.4rem;\n        height: 4.4rem;\n      }\n    }\n\n    &::after {\n      content: \"\";\n      position: absolute;\n      top: 0.3rem;\n      left: 0.3rem;\n      width: 1.6rem;\n      height: 1.6rem;\n      background-color: $blue;\n      transform: scale(0);\n      transition: transform 0.3s ease;\n\n      @media (max-width: 48em) {\n        left: 0.6rem;\n        top: 0.6rem;\n        width: 3.2rem;\n        height: 3.2rem;\n      }\n    }\n  }\n}\n",".breadcrumbs {\n  display: flex;\n  align-items: center;\n  column-gap: 1.2rem;\n\n  @media (max-width: 48em) {\n    column-gap: 1.6rem;\n    font-size: 3.2rem;\n  }\n\n  &__link {\n    display: flex;\n    align-items: center;\n    column-gap: 1.2rem;\n\n    &::after {\n      content: \"\";\n      width: 2rem;\n      height: 0.2rem;\n      background-color: #808d97;\n    }\n\n    @media (max-width: 48em) {\n      column-gap: 1.6rem;\n\n      &::after {\n        width: 3.2rem;\n        height: 1px;\n      }\n    }\n  }\n\n  &__txt {\n    color: $blue;\n  }\n}\n",".tabs {\n  &__navigation {\n    display: flex;\n    column-gap: 1.5rem;\n  }\n  &__body {\n    padding-top: 1rem;\n  }\n}\n\n.tab {\n  padding: 0 2.8rem;\n  display: inline-flex;\n  align-items: center;\n  height: 10rem;\n  background-color: $gray;\n  transition:\n    background-color 0.3s ease,\n    color 0.3s ease;\n\n  @media (max-width: 48em) {\n    padding: 0 2.4rem;\n    height: 11.2rem;\n  }\n\n  svg {\n    flex: 0 0 2.4rem;\n    width: 2.4rem;\n    height: 2.4rem;\n    transform: translate(0.3rem, -0.3rem);\n    transition: fill 0.3s ease;\n\n    @media (max-width: 48em) {\n      flex: 0 0 3.2rem;\n      width: 3.2rem;\n      height: 3.2rem;\n      transform: translate(0.6rem, -0.6rem);\n    }\n  }\n\n  &__num {\n    margin-right: 0.8rem;\n\n    @media (max-width: 48em) {\n      margin-right: 1.6rem;\n    }\n  }\n\n  &__txt {\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n  }\n\n  &._is-active {\n    background-color: $blue;\n    color: $white;\n\n    svg {\n      fill: $white;\n    }\n  }\n}\n",null],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsT0FBTyxpVkFBaVYsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLE9BQU8sV0FBVyxNQUFNLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxVQUFVLGFBQWEsT0FBTyxNQUFNLFdBQVcsV0FBVyxVQUFVLFVBQVUsV0FBVyxVQUFVLFVBQVUsTUFBTSxLQUFLLFVBQVUsTUFBTSxNQUFNLFdBQVcsTUFBTSxRQUFRLFVBQVUsVUFBVSxVQUFVLEtBQUssUUFBUSxVQUFVLEtBQUssUUFBUSxVQUFVLE9BQU8sVUFBVSxVQUFVLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxXQUFXLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxPQUFPLEtBQUssVUFBVSxVQUFVLFVBQVUsV0FBVyxVQUFVLFdBQVcsT0FBTyxNQUFNLFVBQVUsVUFBVSxPQUFPLE1BQU0sVUFBVSxVQUFVLFdBQVcsT0FBTyxNQUFNLFVBQVUsVUFBVSxPQUFPLE1BQU0sV0FBVyxPQUFPLE1BQU0sV0FBVyxVQUFVLE9BQU8sTUFBTSxXQUFXLE9BQU8sT0FBTyxVQUFVLFVBQVUsV0FBVyxNQUFNLE1BQU0sV0FBVyxXQUFXLE9BQU8sT0FBTyxXQUFXLE9BQU8sTUFBTSxXQUFXLE9BQU8sTUFBTSxVQUFVLFdBQVcsT0FBTyxNQUFNLFdBQVcsV0FBVyxNQUFNLE1BQU0sVUFBVSxXQUFXLE1BQU0sTUFBTSxVQUFVLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE9BQU8sTUFBTSxXQUFXLFdBQVcsT0FBTyxNQUFNLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxPQUFPLE1BQU0sV0FBVyxXQUFXLFVBQVUsTUFBTSxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxVQUFVLFlBQVksWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxZQUFZLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFlBQVksT0FBTyxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFVBQVUsVUFBVSxNQUFNLE1BQU0sVUFBVSxVQUFVLE1BQU0sTUFBTSxVQUFVLFVBQVUsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsT0FBTyxTQUFTLFdBQVcsV0FBVyxXQUFXLE9BQU8sT0FBTyxVQUFVLE9BQU8sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLE1BQU0sTUFBTSxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsVUFBVSxVQUFVLFdBQVcsTUFBTSxNQUFNLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsTUFBTSxNQUFNLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxXQUFXLFVBQVUsVUFBVSxXQUFXLFdBQVcsWUFBWSxXQUFXLE1BQU0sTUFBTSxXQUFXLE9BQU8sTUFBTSxXQUFXLFVBQVUsTUFBTSxNQUFNLFdBQVcsVUFBVSxVQUFVLFVBQVUsV0FBVyxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxXQUFXLFVBQVUsV0FBVyxNQUFNLE1BQU0sVUFBVSxXQUFXLE1BQU0sTUFBTSxXQUFXLFVBQVUsVUFBVSxXQUFXLE1BQU0sTUFBTSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxZQUFZLFdBQVcsT0FBTyxNQUFNLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxVQUFVLFVBQVUsVUFBVSxVQUFVLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVSxNQUFNLE1BQU0sVUFBVSxXQUFXLFVBQVUsVUFBVSxXQUFXLFlBQVksWUFBWSxNQUFNLE1BQU0sVUFBVSxXQUFXLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxZQUFZLFdBQVcsT0FBTyxPQUFPLFVBQVUsV0FBVyxXQUFXLE9BQU8sT0FBTyxVQUFVLFdBQVcsV0FBVyxPQUFPLE9BQU8sVUFBVSxVQUFVLFVBQVUsV0FBVyxPQUFPLE9BQU8sV0FBVyxRQUFRLE9BQU8sVUFBVSxXQUFXLE9BQU8sT0FBTyxXQUFXLFFBQVEsT0FBTyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxPQUFPLE9BQU8sV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLE9BQU8sT0FBTyxXQUFXLE9BQU8sT0FBTyxXQUFXLFdBQVcsV0FBVyxPQUFPLE9BQU8sWUFBWSxZQUFZLE9BQU8sT0FBTyxXQUFXLE9BQU8sT0FBTyxNQUFNLFVBQVUsTUFBTSxNQUFNLE1BQU0sTUFBTSxXQUFXLE1BQU0sS0FBSyxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsVUFBVSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxVQUFVLE1BQU0sTUFBTSxX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Q0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E0Qjs7QUFFNUI7O0FBRTBDOztBQUUxQztBQUNBRSxxREFBYyxDQUFDLENBQUM7O0FBRWhCOztBQUVBO0FBQ3VCOztBQUV2QjtBQUN5Qjs7QUFFekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQzJCOztBQUUzQjs7QUFFeUI7QUFDRSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy9tb2R1bGVzLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy91dGlscy9mb3Jtcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvdXRpbHMvbW9kYWxzLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy91dGlscy90YWJzLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy91dGlscy91dGlscy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvc2Nzcy9zdHlsZS5zY3NzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL3Njc3Mvc3R5bGUuc2Nzcz82YzJkIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL2pzL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgbW9kdWxlcyA9IHt9O1xuIiwiaW1wb3J0IHsgbW9kdWxlcyB9IGZyb20gXCIuLi9tb2R1bGVzLmpzXCI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNsYXNzIFZhbGlkYXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmF0dHJzID0ge1xuICAgICAgUkVRVUlSRUQ6IFwiZGF0YS1yZXF1aXJlZFwiLFxuICAgICAgSUdOT1JFX1ZBTElEQVRJT046IFwiZGF0YS1pZ25vcmUtdmFsaWRhdGlvblwiLFxuICAgICAgQUpBWDogXCJkYXRhLWFqYXhcIixcbiAgICAgIERFVjogXCJkYXRhLWRldlwiLFxuICAgICAgSUdOT1JFX0ZPQ1VTOiBcImRhdGEtaWdub3JlLWZvY3VzXCIsXG4gICAgICBTSE9XX1BMQUNFSE9MREVSOiBcImRhdGEtc2hvdy1wbGFjZWhvbGRlclwiLFxuICAgICAgVkFMSURBVEU6IFwiZGF0YS12YWxpZGF0ZVwiLFxuICAgIH07XG4gICAgdGhpcy5jbGFzc2VzID0ge1xuICAgICAgSEFTX0VSUk9SOiBcIl9oYXMtZXJyb3JcIixcbiAgICAgIEhBU19GT0NVUzogXCJfaGFzLWZvY3VzXCIsXG4gICAgICBJU19GSUxMRUQ6IFwiX2lzLWZpbGxlZFwiLFxuICAgICAgSVNfUkVWRUFMRUQ6IFwiX2lzLXJldmVhbGVkXCIsXG4gICAgfTtcbiAgfVxuXG4gIGdldEVycm9ycyhmb3JtKSB7XG4gICAgbGV0IGVyciA9IDA7XG4gICAgbGV0IHJlcXVpcmVkRmllbGRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKGAqWyR7dGhpcy5hdHRycy5SRVFVSVJFRH1dYCk7XG5cbiAgICBpZiAocmVxdWlyZWRGaWVsZHMubGVuZ3RoKSB7XG4gICAgICByZXF1aXJlZEZpZWxkcy5mb3JFYWNoKChyZXF1aXJlZEZpZWxkKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAocmVxdWlyZWRGaWVsZC5vZmZzZXRQYXJlbnQgIT09IG51bGwgfHxcbiAgICAgICAgICAgIHJlcXVpcmVkRmllbGQudGFnTmFtZSA9PT0gXCJTRUxFQ1RcIikgJiZcbiAgICAgICAgICAhcmVxdWlyZWRGaWVsZC5kaXNhYmxlZFxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgKz0gdGhpcy52YWxpZGF0ZUZpZWxkKHJlcXVpcmVkRmllbGQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGVycjtcbiAgfVxuXG4gIGFkZEVycm9yKHJlcXVpcmVkRmllbGQpIHtcbiAgICByZXF1aXJlZEZpZWxkLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkhBU19FUlJPUik7XG4gICAgcmVxdWlyZWRGaWVsZC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLklTX0ZJTExFRCk7XG4gICAgcmVxdWlyZWRGaWVsZC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkhBU19FUlJPUik7XG4gIH1cblxuICByZW1vdmVFcnJvcihyZXF1aXJlZEZpZWxkKSB7XG4gICAgcmVxdWlyZWRGaWVsZC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5IQVNfRVJST1IpO1xuICAgIHJlcXVpcmVkRmllbGQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5IQVNfRVJST1IpO1xuICB9XG5cbiAgdmFsaWRhdGVGaWVsZChyZXF1aXJlZEZpZWxkKSB7XG4gICAgbGV0IGVyciA9IDA7XG5cbiAgICBpZiAocmVxdWlyZWRGaWVsZC5kYXRhc2V0LnJlcXVpcmVkID09PSBcImVtYWlsXCIpIHtcbiAgICAgIHJlcXVpcmVkRmllbGQudmFsdWUgPSByZXF1aXJlZEZpZWxkLnZhbHVlLnJlcGxhY2UoXCIgXCIsIFwiXCIpO1xuXG4gICAgICBpZiAodGhpcy50ZXN0RW1haWwocmVxdWlyZWRGaWVsZCkpIHtcbiAgICAgICAgdGhpcy5hZGRFcnJvcihyZXF1aXJlZEZpZWxkKTtcbiAgICAgICAgZXJyKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUVycm9yKHJlcXVpcmVkRmllbGQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVxdWlyZWRGaWVsZC50eXBlID09PSBcImNoZWNrYm94XCIgJiYgIXJlcXVpcmVkRmllbGQuY2hlY2tlZCkge1xuICAgICAgdGhpcy5hZGRFcnJvcihyZXF1aXJlZEZpZWxkKTtcbiAgICAgIGVycisrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXJlcXVpcmVkRmllbGQudmFsdWUudHJpbSgpKSB7XG4gICAgICAgIHRoaXMuYWRkRXJyb3IocmVxdWlyZWRGaWVsZCk7XG4gICAgICAgIGVycisrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFcnJvcihyZXF1aXJlZEZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVycjtcbiAgfVxuXG4gIGNsZWFyRmllbGRzKGZvcm0pIHtcbiAgICBmb3JtLnJlc2V0KCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChcImlucHV0LHRleHRhcmVhXCIpO1xuICAgICAgY29uc3QgY2hlY2tib3hlcyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgIGlmIChpbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpbnB1dHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbaW5kZXhdO1xuXG4gICAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5IQVNfRk9DVVMpO1xuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19GT0NVUyk7XG4gICAgICAgICAgdGhpcy5yZW1vdmVFcnJvcihpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaGVja2JveGVzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY2hlY2tib3hlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBjb25zdCBjaGVja2JveCA9IGNoZWNrYm94ZXNbaW5kZXhdO1xuICAgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIDApO1xuICB9XG5cbiAgdGVzdEVtYWlsKHJlcXVpcmVkRmllbGQpIHtcbiAgICByZXR1cm4gIS9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7Miw4fSkrJC8udGVzdChcbiAgICAgIHJlcXVpcmVkRmllbGQudmFsdWUsXG4gICAgKTtcbiAgfVxufVxuY2xhc3MgRm9ybVN1Ym1pdGlvbiBleHRlbmRzIFZhbGlkYXRpb24ge1xuICBjb25zdHJ1Y3RvcihzaG91bGRWYWxpZGF0ZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zaG91bGRWYWxpZGF0ZSA9IHNob3VsZFZhbGlkYXRlID8gc2hvdWxkVmFsaWRhdGUgOiB0cnVlO1xuICAgIHRoaXMuZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiZm9ybVwiKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHNlbmRGb3JtKGZvcm0sIHJlc3BvbnNlUmVzdWx0ID0gYGApIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KFwic2VuZEZvcm1cIiwge1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBmb3JtOiBmb3JtLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIHNob3cgbW9kYWwsIGlmIHBvcHVwIG1vZHVsZSBpcyBjb25uZWN0ZWRcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChtb2R1bGVzLnBvcHVwKSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZm9ybS5kYXRhc2V0Lm1vZGFsTWVzc2FnZTtcbiAgICAgICAgbW9kYWwgPyBtb2R1bGVzLm1vZGFsLm9wZW4obW9kYWwpIDogbnVsbDtcbiAgICAgIH1cbiAgICB9LCAwKTtcblxuICAgIHRoaXMuY2xlYXJGaWVsZHMoZm9ybSk7XG5cbiAgICBjb25zb2xlLmxvZyhcImlzIHNlbnRcIik7XG4gIH1cblxuICBhc3luYyBoYW5kbGVTdWJtaXRpb24oZm9ybSwgZSkge1xuICAgIGNvbnN0IGVyciA9ICFmb3JtLmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJzLklHTk9SRV9WQUxJREFUSU9OKVxuICAgICAgPyB0aGlzLmdldEVycm9ycyhmb3JtKVxuICAgICAgOiAwO1xuXG4gICAgaWYgKGVyciA9PT0gMCkge1xuICAgICAgY29uc3QgYWpheCA9IGZvcm0uaGFzQXR0cmlidXRlKHRoaXMuYXR0cnMuQUpBWCk7XG5cbiAgICAgIGlmIChhamF4KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjb25zdCBhY3Rpb24gPSBmb3JtLmdldEF0dHJpYnV0ZShcImFjdGlvblwiKVxuICAgICAgICAgID8gZm9ybS5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIikudHJpbSgpXG4gICAgICAgICAgOiBcIiNcIjtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gZm9ybS5nZXRBdHRyaWJ1dGUoXCJtZXRob2RcIilcbiAgICAgICAgICA/IGZvcm0uZ2V0QXR0cmlidXRlKFwibWV0aG9kXCIpLnRyaW0oKVxuICAgICAgICAgIDogXCJHRVRcIjtcbiAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcblxuICAgICAgICBmb3JtLmNsYXNzTGlzdC5hZGQoXCJfaXMtc2VuZGluZ1wiKTtcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGFjdGlvbiwge1xuICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgIGJvZHk6IGRhdGEsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICBmb3JtLmNsYXNzTGlzdC5yZW1vdmUoXCJfaXMtc2VuZGluZ1wiKTtcbiAgICAgICAgICB0aGlzLnNlbmRGb3JtKGZvcm0sIHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnQoXCJlcnJvclwiKTtcbiAgICAgICAgICBmb3JtLmNsYXNzTGlzdC5yZW1vdmUoXCJfaXMtc2VuZGluZ1wiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChmb3JtLmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJzLkRFVikpIHtcbiAgICAgICAgLy8gaW4gZGV2ZWxvcG1lbnQgbW9kZVxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc2VuZEZvcm0oZm9ybSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBpbml0KCkge1xuICAgIGNvbnN0IF90aGlzID0gdGhpcztcbiAgICBjb25zdCBwYXNzd29yZEZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXJlcXVpcmVkPVwicGFzc1wiXScpO1xuXG4gICAgaWYgKHRoaXMuZm9ybXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZvcm1zLmZvckVhY2goKGZvcm0pID0+IHtcbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgX3RoaXMuaGFuZGxlU3VibWl0aW9uKGUudGFyZ2V0LCBlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInJlc2V0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgX3RoaXMuY2xlYXJGaWVsZHMoZS50YXJnZXQpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChwYXNzd29yZEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHBhc3N3b3JkRmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ0biA9IGZpZWxkLm5leHRFbGVtZW50U2libGluZztcblxuICAgICAgICBpZiAoYnRuKSB7XG4gICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gZmllbGQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXG4gICAgICAgICAgICAgIF90aGlzLmNsYXNzZXMuSVNfUkVWRUFMRUQsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgID8gXCJwYXNzd29yZFwiXG4gICAgICAgICAgICAgIDogXCJ0ZXh0XCI7XG4gICAgICAgICAgICBmaWVsZC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIHR5cGUpO1xuICAgICAgICAgICAgZmllbGQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKF90aGlzLmNsYXNzZXMuSVNfUkVWRUFMRUQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbmNsYXNzIEZvcm1GaWVsZHMgZXh0ZW5kcyBWYWxpZGF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dCx0ZXh0YXJlYVwiKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHNhdmVQbGFjZWhvbGRlcigpIHtcbiAgICBpZiAodGhpcy5maWVsZHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICBpZiAoIWZpZWxkLmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJzLlNIT1dfUExBQ0VIT0xERVIpKSB7XG4gICAgICAgICAgZmllbGQuZGF0YXNldC5wbGFjZWhvbGRlciA9IGZpZWxkLnBsYWNlaG9sZGVyO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVGb2N1c2luKGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgIGlmICh0YXJnZXQudGFnTmFtZSA9PT0gXCJJTlBVVFwiIHx8IHRhcmdldC50YWdOYW1lID09PSBcIlRFWFRBUkVBXCIpIHtcbiAgICAgIGlmICh0YXJnZXQuZGF0YXNldC5wbGFjZWhvbGRlcikgdGFyZ2V0LnBsYWNlaG9sZGVyID0gXCJcIjtcblxuICAgICAgaWYgKCF0YXJnZXQuaGFzQXR0cmlidXRlKHRoaXMuYXR0cnMuSUdOT1JFX0ZPQ1VTKSkge1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzZXMuSEFTX0ZPQ1VTKTtcbiAgICAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzZXMuSEFTX0ZPQ1VTKTtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19FUlJPUik7XG4gICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19FUlJPUik7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGFyZ2V0LnR5cGUgIT09IFwiZmlsZVwiICYmXG4gICAgICAgIHRhcmdldC50eXBlICE9PSBcImNoZWNrYm94XCIgJiZcbiAgICAgICAgdGFyZ2V0LnR5cGUgIT09IFwicmFkaW9cIiAmJlxuICAgICAgICAhdGFyZ2V0LmNsb3Nlc3QoXCIucXVhbnRpdHlcIilcbiAgICAgICkge1xuICAgICAgICB0YXJnZXQuY2xvc2VzdChcIi5pbnB1dFwiKS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5JU19GSUxMRUQpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZW1vdmVFcnJvcih0YXJnZXQpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZvY3Vzb3V0KGUpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT09IFwiSU5QVVRcIiB8fCB0YXJnZXQudGFnTmFtZSA9PT0gXCJURVhUQVJFQVwiKSB7XG4gICAgICBpZiAodGFyZ2V0LmRhdGFzZXQucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgdGFyZ2V0LnBsYWNlaG9sZGVyID0gdGFyZ2V0LmRhdGFzZXQucGxhY2Vob2xkZXI7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGFyZ2V0Lmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJzLklHTk9SRV9GT0NVUykpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19GT0NVUyk7XG4gICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19GT0NVUyk7XG4gICAgICB9XG4gICAgICBpZiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJzLlZBTElEQVRFKSkge1xuICAgICAgICB0aGlzLnZhbGlkYXRlRmllbGQodGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICB0YXJnZXQudHlwZSAhPT0gXCJmaWxlXCIgJiZcbiAgICAgICAgdGFyZ2V0LnR5cGUgIT09IFwiY2hlY2tib3hcIiAmJlxuICAgICAgICB0YXJnZXQudHlwZSAhPT0gXCJyYWRpb1wiICYmXG4gICAgICAgICF0YXJnZXQuY2xvc2VzdChcIi5xdWFudGl0eVwiKVxuICAgICAgKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNsYXNzZXMuSEFTX0VSUk9SKSAmJlxuICAgICAgICAgIHRhcmdldC52YWx1ZS50cmltKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoXCIuaW5wdXRcIikuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzZXMuSVNfRklMTEVEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQuY2xvc2VzdChcIi5pbnB1dFwiKS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5JU19GSUxMRUQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyBzYXZlIHBsYWNlaG9sZGVyIGluIGRhdGEgYXR0cmlidXRlXG4gICAgdGhpcy5zYXZlUGxhY2Vob2xkZXIoKTtcblxuICAgIC8vIGhhbmRsZSBzdWJtaXRpb25cbiAgICBuZXcgRm9ybVN1Ym1pdGlvbigpO1xuXG4gICAgLy8gZXZlbnRzXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNpblwiLCB0aGlzLmhhbmRsZUZvY3VzaW4uYmluZCh0aGlzKSk7XG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNvdXRcIiwgdGhpcy5oYW5kbGVGb2N1c291dC5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5uZXcgRm9ybUZpZWxkcygpO1xuIiwiaW1wb3J0IHsgbW9kdWxlcyB9IGZyb20gJy4uL21vZHVsZXMuanMnO1xuaW1wb3J0IHsgYm9keUxvY2tTdGF0dXMsIGJvZHlMb2NrLCBib2R5VW5sb2NrIH0gZnJvbSAnLi4vdXRpbHMvdXRpbHMuanMnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jbGFzcyBNb2RhbCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBsZXQgY29uZmlnID0ge1xuICAgICAgbG9nZ2luZzogdHJ1ZSxcbiAgICAgIGluaXQ6IHRydWUsXG4gICAgICBhdHRyaWJ1dGVPcGVuQnV0dG9uOiAnZGF0YS1tb2RhbCcsXG4gICAgICBhdHRyaWJ1dGVDbG9zZUJ1dHRvbjogJ2RhdGEtY2xvc2UnLFxuICAgICAgZml4RWxlbWVudFNlbGVjdG9yOiAnW2RhdGEtbHBdJyxcbiAgICAgIHlvdXR1YmVBdHRyaWJ1dGU6ICdkYXRhLW1vZGFsLXlvdXR1YmUnLFxuICAgICAgeW91dHViZVBsYWNlQXR0cmlidXRlOiAnZGF0YS1tb2RhbC15b3V0dWJlLXBsYWNlJyxcbiAgICAgIHNldEF1dG9wbGF5WW91dHViZTogdHJ1ZSxcbiAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgbW9kYWw6ICdtb2RhbCcsXG4gICAgICAgIC8vIG1vZGFsV3JhcHBlcjogJ21vZGFsX193cmFwcGVyJyxcbiAgICAgICAgbW9kYWxDb250ZW50OiAnbW9kYWxfX2NvbnRlbnQnLFxuICAgICAgICBtb2RhbEFjdGl2ZTogJ21vZGFsX3Nob3cnLFxuICAgICAgICBib2R5QWN0aXZlOiAnbW9kYWwtc2hvdycsXG4gICAgICB9LFxuICAgICAgZm9jdXNDYXRjaDogdHJ1ZSxcbiAgICAgIGNsb3NlRXNjOiB0cnVlLFxuICAgICAgYm9keUxvY2s6IHRydWUsXG4gICAgICBoYXNoU2V0dGluZ3M6IHtcbiAgICAgICAgbG9jYXRpb246IHRydWUsXG4gICAgICAgIGdvSGFzaDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBvbjoge1xuICAgICAgICBiZWZvcmVPcGVuOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgYWZ0ZXJPcGVuOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgYmVmb3JlQ2xvc2U6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgICBhZnRlckNsb3NlOiBmdW5jdGlvbiAoKSB7fSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB0aGlzLnlvdVR1YmVDb2RlO1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy50YXJnZXRPcGVuID0ge1xuICAgICAgc2VsZWN0b3I6IGZhbHNlLFxuICAgICAgZWxlbWVudDogZmFsc2UsXG4gICAgfTtcbiAgICB0aGlzLnByZXZpb3VzT3BlbiA9IHtcbiAgICAgIHNlbGVjdG9yOiBmYWxzZSxcbiAgICAgIGVsZW1lbnQ6IGZhbHNlLFxuICAgIH07XG4gICAgdGhpcy5sYXN0Q2xvc2VkID0ge1xuICAgICAgc2VsZWN0b3I6IGZhbHNlLFxuICAgICAgZWxlbWVudDogZmFsc2UsXG4gICAgfTtcbiAgICB0aGlzLl9kYXRhVmFsdWUgPSBmYWxzZTtcbiAgICB0aGlzLmhhc2ggPSBmYWxzZTtcblxuICAgIHRoaXMuX3Jlb3BlbiA9IGZhbHNlO1xuICAgIHRoaXMuX3NlbGVjdG9yT3BlbiA9IGZhbHNlO1xuXG4gICAgdGhpcy5sYXN0Rm9jdXNFbCA9IGZhbHNlO1xuICAgIHRoaXMuX2ZvY3VzRWwgPSBbXG4gICAgICAnYVtocmVmXScsXG4gICAgICAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pOm5vdChbdHlwZT1cImhpZGRlblwiXSk6bm90KFthcmlhLWhpZGRlbl0pJyxcbiAgICAgICdidXR0b246bm90KFtkaXNhYmxlZF0pOm5vdChbYXJpYS1oaWRkZW5dKScsXG4gICAgICAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuXSknLFxuICAgICAgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKTpub3QoW2FyaWEtaGlkZGVuXSknLFxuICAgICAgJ2FyZWFbaHJlZl0nLFxuICAgICAgJ2lmcmFtZScsXG4gICAgICAnb2JqZWN0JyxcbiAgICAgICdlbWJlZCcsXG4gICAgICAnW2NvbnRlbnRlZGl0YWJsZV0nLFxuICAgICAgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleF49XCItXCJdKScsXG4gICAgXTtcbiAgICAvL3RoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oY29uZmlnLCBvcHRpb25zKTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAuLi5jb25maWcsXG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgY2xhc3Nlczoge1xuICAgICAgICAuLi5jb25maWcuY2xhc3NlcyxcbiAgICAgICAgLi4ub3B0aW9ucz8uY2xhc3NlcyxcbiAgICAgIH0sXG4gICAgICBoYXNoU2V0dGluZ3M6IHtcbiAgICAgICAgLi4uY29uZmlnLmhhc2hTZXR0aW5ncyxcbiAgICAgICAgLi4ub3B0aW9ucz8uaGFzaFNldHRpbmdzLFxuICAgICAgfSxcbiAgICAgIG9uOiB7XG4gICAgICAgIC4uLmNvbmZpZy5vbixcbiAgICAgICAgLi4ub3B0aW9ucz8ub24sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5ib2R5TG9jayA9IGZhbHNlO1xuICAgIHRoaXMub3B0aW9ucy5pbml0ID8gdGhpcy5pbml0bW9kYWxzKCkgOiBudWxsO1xuICB9XG4gIGluaXRtb2RhbHMoKSB7XG4gICAgdGhpcy5ldmVudHNtb2RhbCgpO1xuICB9XG4gIGV2ZW50c21vZGFsKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2xpY2snLFxuICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc3QgYnV0dG9uT3BlbiA9IGUudGFyZ2V0LmNsb3Nlc3QoXG4gICAgICAgICAgYFske3RoaXMub3B0aW9ucy5hdHRyaWJ1dGVPcGVuQnV0dG9ufV1gXG4gICAgICAgICk7XG4gICAgICAgIGlmIChidXR0b25PcGVuKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX2RhdGFWYWx1ZSA9IGJ1dHRvbk9wZW4uZ2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmF0dHJpYnV0ZU9wZW5CdXR0b25cbiAgICAgICAgICApXG4gICAgICAgICAgICA/IGJ1dHRvbk9wZW4uZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5hdHRyaWJ1dGVPcGVuQnV0dG9uKVxuICAgICAgICAgICAgOiAnZXJyb3InO1xuICAgICAgICAgIHRoaXMueW91VHViZUNvZGUgPSBidXR0b25PcGVuLmdldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy55b3V0dWJlQXR0cmlidXRlXG4gICAgICAgICAgKVxuICAgICAgICAgICAgPyBidXR0b25PcGVuLmdldEF0dHJpYnV0ZSh0aGlzLm9wdGlvbnMueW91dHViZUF0dHJpYnV0ZSlcbiAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICBpZiAodGhpcy5fZGF0YVZhbHVlICE9PSAnZXJyb3InKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKSB0aGlzLmxhc3RGb2N1c0VsID0gYnV0dG9uT3BlbjtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0T3Blbi5zZWxlY3RvciA9IGAke3RoaXMuX2RhdGFWYWx1ZX1gO1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0b3JPcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBidXR0b25DbG9zZSA9IGUudGFyZ2V0LmNsb3Nlc3QoXG4gICAgICAgICAgYFske3RoaXMub3B0aW9ucy5hdHRyaWJ1dGVDbG9zZUJ1dHRvbn1dYFxuICAgICAgICApO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWUudGFyZ2V0LmNsb3Nlc3QoJyN1bmNvbmZpcm1lZEFnZU1vZGFsJykgJiZcbiAgICAgICAgICAhZS50YXJnZXQuY2xvc2VzdCgnI2NvbmZpcm1BZ2VNb2RhbCcpICYmXG4gICAgICAgICAgKGJ1dHRvbkNsb3NlIHx8XG4gICAgICAgICAgICAoIWUudGFyZ2V0LmNsb3Nlc3QoYC4ke3RoaXMub3B0aW9ucy5jbGFzc2VzLm1vZGFsQ29udGVudH1gKSAmJlxuICAgICAgICAgICAgICB0aGlzLmlzT3BlbikpXG4gICAgICAgICkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcylcbiAgICApO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAna2V5ZG93bicsXG4gICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5vcHRpb25zLmNsb3NlRXNjICYmXG4gICAgICAgICAgZS53aGljaCA9PSAyNyAmJlxuICAgICAgICAgIGUuY29kZSA9PT0gJ0VzY2FwZScgJiZcbiAgICAgICAgICB0aGlzLmlzT3BlblxuICAgICAgICApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZvY3VzQ2F0Y2ggJiYgZS53aGljaCA9PSA5ICYmIHRoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgdGhpcy5fZm9jdXNDYXRjaChlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKVxuICAgICk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmhhc2hTZXR0aW5ncy5nb0hhc2gpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnaGFzaGNoYW5nZScsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgICAgIHRoaXMuX29wZW5Ub0hhc2goKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSh0aGlzLnRhcmdldE9wZW4uc2VsZWN0b3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICApO1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgJ2xvYWQnLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICAgICAgICB0aGlzLl9vcGVuVG9IYXNoKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIG9wZW4oc2VsZWN0b3JWYWx1ZSkge1xuICAgIGlmIChib2R5TG9ja1N0YXR1cykge1xuICAgICAgdGhpcy5ib2R5TG9jayA9XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvY2snKSAmJiAhdGhpcy5pc09wZW5cbiAgICAgICAgICA/IHRydWVcbiAgICAgICAgICA6IGZhbHNlO1xuXG4gICAgICBpZiAoXG4gICAgICAgIHNlbGVjdG9yVmFsdWUgJiZcbiAgICAgICAgdHlwZW9mIHNlbGVjdG9yVmFsdWUgPT09ICdzdHJpbmcnICYmXG4gICAgICAgIHNlbGVjdG9yVmFsdWUudHJpbSgpICE9PSAnJ1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0T3Blbi5zZWxlY3RvciA9IHNlbGVjdG9yVmFsdWU7XG4gICAgICAgIHRoaXMuX3NlbGVjdG9yT3BlbiA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgdGhpcy5fcmVvcGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rvck9wZW4pXG4gICAgICAgIHRoaXMudGFyZ2V0T3Blbi5zZWxlY3RvciA9IHRoaXMubGFzdENsb3NlZC5zZWxlY3RvcjtcbiAgICAgIGlmICghdGhpcy5fcmVvcGVuKSB0aGlzLnByZXZpb3VzQWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIHRoaXMudGFyZ2V0T3Blbi5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgdGhpcy50YXJnZXRPcGVuLnNlbGVjdG9yXG4gICAgICApO1xuXG4gICAgICBpZiAodGhpcy50YXJnZXRPcGVuLmVsZW1lbnQpIHtcbiAgICAgICAgaWYgKHRoaXMueW91VHViZUNvZGUpIHtcbiAgICAgICAgICBjb25zdCBjb2RlVmlkZW8gPSB0aGlzLnlvdVR1YmVDb2RlO1xuICAgICAgICAgIGNvbnN0IHVybFZpZGVvID0gYGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLyR7Y29kZVZpZGVvfT9yZWw9MCZzaG93aW5mbz0wJmF1dG9wbGF5PTFgO1xuICAgICAgICAgIGNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2FsbG93ZnVsbHNjcmVlbicsICcnKTtcblxuICAgICAgICAgIGNvbnN0IGF1dG9wbGF5ID0gdGhpcy5vcHRpb25zLnNldEF1dG9wbGF5WW91dHViZSA/ICdhdXRvcGxheTsnIDogJyc7XG4gICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnYWxsb3cnLCBgJHthdXRvcGxheX07IGVuY3J5cHRlZC1tZWRpYWApO1xuXG4gICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsVmlkZW8pO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMudGFyZ2V0T3Blbi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgIGBbJHt0aGlzLm9wdGlvbnMueW91dHViZVBsYWNlQXR0cmlidXRlfV1gXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCB5b3V0dWJlUGxhY2UgPSB0aGlzLnRhcmdldE9wZW4uZWxlbWVudFxuICAgICAgICAgICAgICAucXVlcnlTZWxlY3RvcignLm1vZGFsX190ZXh0JylcbiAgICAgICAgICAgICAgLnNldEF0dHJpYnV0ZShgJHt0aGlzLm9wdGlvbnMueW91dHViZVBsYWNlQXR0cmlidXRlfWAsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50YXJnZXRPcGVuLmVsZW1lbnRcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKGBbJHt0aGlzLm9wdGlvbnMueW91dHViZVBsYWNlQXR0cmlidXRlfV1gKVxuICAgICAgICAgICAgLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5oYXNoU2V0dGluZ3MubG9jYXRpb24pIHtcbiAgICAgICAgICB0aGlzLl9nZXRIYXNoKCk7XG4gICAgICAgICAgdGhpcy5fc2V0SGFzaCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLm9uLmJlZm9yZU9wZW4odGhpcyk7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KCdiZWZvcmVtb2RhbE9wZW4nLCB7XG4gICAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgICAgbW9kYWw6IHRoaXMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy50YXJnZXRPcGVuLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLm9wdGlvbnMuY2xhc3Nlcy5tb2RhbEFjdGl2ZSk7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMub3B0aW9ucy5jbGFzc2VzLmJvZHlBY3RpdmUpO1xuXG4gICAgICAgIGlmICghdGhpcy5fcmVvcGVuKSB7XG4gICAgICAgICAgY29uc3QgbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5oYXNoKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICghdGhpcy5ib2R5TG9jayAmJiAhbS5oYXNBdHRyaWJ1dGUoJ2RhdGEtYmwtbW9iaWxlJykpIHx8XG4gICAgICAgICAgICAoIXRoaXMuYm9keUxvY2sgJiZcbiAgICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGggPD0gNzY4ICYmXG4gICAgICAgICAgICAgIG0uaGFzQXR0cmlidXRlKCdkYXRhLWJsLW1vYmlsZScpKVxuICAgICAgICAgICAgICA/IGJvZHlMb2NrKClcbiAgICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9IGVsc2UgdGhpcy5fcmVvcGVuID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy50YXJnZXRPcGVuLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgIHRoaXMucHJldmlvdXNPcGVuLnNlbGVjdG9yID0gdGhpcy50YXJnZXRPcGVuLnNlbGVjdG9yO1xuICAgICAgICB0aGlzLnByZXZpb3VzT3Blbi5lbGVtZW50ID0gdGhpcy50YXJnZXRPcGVuLmVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5fc2VsZWN0b3JPcGVuID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2ZvY3VzVHJhcCgpO1xuICAgICAgICB9LCA1MCk7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zLm9uLmFmdGVyT3Blbih0aGlzKTtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2FmdGVybW9kYWxPcGVuJywge1xuICAgICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICAgIG1vZGFsOiB0aGlzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjbG9zZShzZWxlY3RvclZhbHVlKSB7XG4gICAgaWYgKFxuICAgICAgc2VsZWN0b3JWYWx1ZSAmJlxuICAgICAgdHlwZW9mIHNlbGVjdG9yVmFsdWUgPT09ICdzdHJpbmcnICYmXG4gICAgICBzZWxlY3RvclZhbHVlLnRyaW0oKSAhPT0gJydcbiAgICApIHtcbiAgICAgIHRoaXMucHJldmlvdXNPcGVuLnNlbGVjdG9yID0gc2VsZWN0b3JWYWx1ZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzT3BlbiB8fCAhYm9keUxvY2tTdGF0dXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5vcHRpb25zLm9uLmJlZm9yZUNsb3NlKHRoaXMpO1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2JlZm9yZW1vZGFsQ2xvc2UnLCB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIG1vZGFsOiB0aGlzLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgaWYgKHRoaXMueW91VHViZUNvZGUpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy50YXJnZXRPcGVuLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgWyR7dGhpcy5vcHRpb25zLnlvdXR1YmVQbGFjZUF0dHJpYnV0ZX1dYFxuICAgICAgICApXG4gICAgICApXG4gICAgICAgIHRoaXMudGFyZ2V0T3Blbi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYFske3RoaXMub3B0aW9ucy55b3V0dWJlUGxhY2VBdHRyaWJ1dGV9XWBcbiAgICAgICAgKS5pbm5lckhUTUwgPSAnJztcbiAgICB9XG4gICAgdGhpcy5wcmV2aW91c09wZW4uZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgdGhpcy5vcHRpb25zLmNsYXNzZXMubW9kYWxBY3RpdmVcbiAgICApO1xuICAgIC8vIGFyaWEtaGlkZGVuXG4gICAgdGhpcy5wcmV2aW91c09wZW4uZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBpZiAoIXRoaXMuX3Jlb3Blbikge1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICAgIHRoaXMub3B0aW9ucy5jbGFzc2VzLmJvZHlBY3RpdmVcbiAgICAgICk7XG4gICAgICAhdGhpcy5ib2R5TG9jayA/IGJvZHlVbmxvY2soKSA6IG51bGw7XG4gICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLl9yZW1vdmVIYXNoKCk7XG4gICAgaWYgKHRoaXMuX3NlbGVjdG9yT3Blbikge1xuICAgICAgdGhpcy5sYXN0Q2xvc2VkLnNlbGVjdG9yID0gdGhpcy5wcmV2aW91c09wZW4uc2VsZWN0b3I7XG4gICAgICB0aGlzLmxhc3RDbG9zZWQuZWxlbWVudCA9IHRoaXMucHJldmlvdXNPcGVuLmVsZW1lbnQ7XG4gICAgfVxuICAgIHRoaXMub3B0aW9ucy5vbi5hZnRlckNsb3NlKHRoaXMpO1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoJ2FmdGVybW9kYWxDbG9zZScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgbW9kYWw6IHRoaXMsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX2ZvY3VzVHJhcCgpO1xuICAgIH0sIDUwKTtcbiAgfVxuICBfZ2V0SGFzaCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmhhc2hTZXR0aW5ncy5sb2NhdGlvbikge1xuICAgICAgdGhpcy5oYXNoID0gdGhpcy50YXJnZXRPcGVuLnNlbGVjdG9yLmluY2x1ZGVzKCcjJylcbiAgICAgICAgPyB0aGlzLnRhcmdldE9wZW4uc2VsZWN0b3JcbiAgICAgICAgOiB0aGlzLnRhcmdldE9wZW4uc2VsZWN0b3IucmVwbGFjZSgnLicsICcjJyk7XG4gICAgfVxuICB9XG4gIF9vcGVuVG9IYXNoKCkge1xuICAgIGxldCBjbGFzc0luSGFzaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgLiR7d2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKX1gXG4gICAgKVxuICAgICAgPyBgLiR7d2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgnIycsICcnKX1gXG4gICAgICA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7d2luZG93LmxvY2F0aW9uLmhhc2h9YClcbiAgICAgID8gYCR7d2luZG93LmxvY2F0aW9uLmhhc2h9YFxuICAgICAgOiBudWxsO1xuXG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgWyR7dGhpcy5vcHRpb25zLmF0dHJpYnV0ZU9wZW5CdXR0b259ID0gXCIke2NsYXNzSW5IYXNofVwiXWBcbiAgICApXG4gICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYFske3RoaXMub3B0aW9ucy5hdHRyaWJ1dGVPcGVuQnV0dG9ufSA9IFwiJHtjbGFzc0luSGFzaH1cIl1gXG4gICAgICAgIClcbiAgICAgIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgWyR7dGhpcy5vcHRpb25zLmF0dHJpYnV0ZU9wZW5CdXR0b259ID0gXCIke2NsYXNzSW5IYXNoLnJlcGxhY2UoXG4gICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAnIydcbiAgICAgICAgICApfVwiXWBcbiAgICAgICAgKTtcbiAgICBpZiAoYnV0dG9ucyAmJiBjbGFzc0luSGFzaCkgdGhpcy5vcGVuKGNsYXNzSW5IYXNoKTtcbiAgfVxuICBfc2V0SGFzaCgpIHtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIHRoaXMuaGFzaCk7XG4gIH1cbiAgX3JlbW92ZUhhc2goKSB7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLCB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdKTtcbiAgfVxuICBfZm9jdXNDYXRjaChlKSB7XG4gICAgY29uc3QgZm9jdXNhYmxlID0gdGhpcy50YXJnZXRPcGVuLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLl9mb2N1c0VsKTtcbiAgICBjb25zdCBmb2N1c0FycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9jdXNhYmxlKTtcbiAgICBjb25zdCBmb2N1c2VkSW5kZXggPSBmb2N1c0FycmF5LmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG5cbiAgICBpZiAoZS5zaGlmdEtleSAmJiBmb2N1c2VkSW5kZXggPT09IDApIHtcbiAgICAgIGZvY3VzQXJyYXlbZm9jdXNBcnJheS5sZW5ndGggLSAxXS5mb2N1cygpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpZiAoIWUuc2hpZnRLZXkgJiYgZm9jdXNlZEluZGV4ID09PSBmb2N1c0FycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIGZvY3VzQXJyYXlbMF0uZm9jdXMoKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cbiAgX2ZvY3VzVHJhcCgpIHtcbiAgICBjb25zdCBmb2N1c2FibGUgPSB0aGlzLnByZXZpb3VzT3Blbi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5fZm9jdXNFbCk7XG4gICAgaWYgKCF0aGlzLmlzT3BlbiAmJiB0aGlzLmxhc3RGb2N1c0VsKSB7XG4gICAgICB0aGlzLmxhc3RGb2N1c0VsLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvY3VzYWJsZVswXS5mb2N1cygpO1xuICAgIH1cbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGVzLm1vZGFsID0gbmV3IE1vZGFsKHt9KTtcbiIsImltcG9ydCB7IHNldEhhc2gsIGdldEhhc2ggfSBmcm9tIFwiLi91dGlsc1wiO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jbGFzcyBUYWJzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hdHRycyA9IHtcbiAgICAgIFRBQlM6IFwiZGF0YS10YWJzXCIsXG4gICAgICBJTkRFWDogXCJkYXRhLXRhYnMtaW5kZXhcIixcbiAgICAgIFRJVExFUzogXCJkYXRhLXRhYnMtdGl0bGVzXCIsXG4gICAgICBUSVRMRTogXCJkYXRhLXRhYnMtdGl0bGVcIixcbiAgICAgIFRBQl9JVEVNOiBcImRhdGEtdGFicy1pdGVtXCIsXG4gICAgICBCT0RZOiBcImRhdGEtdGFicy1ib2R5XCIsXG4gICAgICBIQVNIOiBcImRhdGEtdGFicy1oYXNoXCIsXG4gICAgfTtcbiAgICB0aGlzLmNsYXNzZXMgPSB7XG4gICAgICBJTklUOiBcIl90YWJzLWluaXRcIixcbiAgICAgIEFDVElWRTogXCJfaXMtYWN0aXZlXCIsXG4gICAgICBNT0RBTDogXCJtb2RhbFwiLFxuICAgIH07XG4gICAgdGhpcy50YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdGFic11gKTtcbiAgICB0aGlzLmFjdGl2ZUhhc2ggPSBbXTtcblxuICAgIGlmICh0aGlzLnRhYnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBoYXNoID0gZ2V0SGFzaCgpO1xuXG4gICAgICBpZiAoaGFzaCAmJiBoYXNoLnN0YXJ0c1dpdGgoXCJ0YWItXCIpKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSGFzaCA9IGhhc2gucmVwbGFjZShcInRhYi1cIiwgXCJcIikuc3BsaXQoXCItXCIpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRhYnMuZm9yRWFjaCgodGFic0Jsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgICB0YWJzQmxvY2suY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzZXMuSU5JVCk7XG4gICAgICAgIHRhYnNCbG9jay5zZXRBdHRyaWJ1dGUodGhpcy5hdHRycy5JTkRFWCwgaW5kZXgpO1xuICAgICAgICB0YWJzQmxvY2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuc2V0QWN0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5pbml0KHRhYnNCbG9jayk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXRTdGF0dXModGFic0Jsb2NrKSB7XG4gICAgbGV0IHRpdGxlcyA9IHRhYnNCbG9jay5xdWVyeVNlbGVjdG9yQWxsKGBbJHt0aGlzLmF0dHJzLlRJVExFfV1gKTtcbiAgICBsZXQgY29udGVudCA9IHRhYnNCbG9jay5xdWVyeVNlbGVjdG9yQWxsKGBbJHt0aGlzLmF0dHJzLlRBQl9JVEVNfV1gKTtcbiAgICBjb25zdCBpbmRleCA9IHRhYnNCbG9jay5kYXRhc2V0LnRhYnNJbmRleDtcblxuICAgIGlmIChjb250ZW50Lmxlbmd0aCkge1xuICAgICAgY29uc3QgaGFzSGFzaCA9IHRhYnNCbG9jay5oYXNBdHRyaWJ1dGUodGhpcy5hdHRycy5IQVNIKTtcblxuICAgICAgY29udGVudCA9IEFycmF5LmZyb20oY29udGVudCkuZmlsdGVyKFxuICAgICAgICAoaXRlbSkgPT4gaXRlbS5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRBQlN9XWApID09PSB0YWJzQmxvY2ssXG4gICAgICApO1xuXG4gICAgICB0aXRsZXMgPSBBcnJheS5mcm9tKHRpdGxlcykuZmlsdGVyKFxuICAgICAgICAoaXRlbSkgPT4gaXRlbS5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRBQlN9XWApID09PSB0YWJzQmxvY2ssXG4gICAgICApO1xuXG4gICAgICBjb250ZW50LmZvckVhY2goKGl0ZW0sIGluZHgpID0+IHtcbiAgICAgICAgaWYgKHRpdGxlc1tpbmR4XS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jbGFzc2VzLkFDVElWRSkpIHtcbiAgICAgICAgICBpdGVtLmhpZGRlbiA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKGhhc0hhc2ggJiYgIWl0ZW0uY2xvc2VzdChgLiR7dGhpcy5jbGFzc2VzLk1PREFMfWApKSB7XG4gICAgICAgICAgICBzZXRIYXNoKGB0YWItJHtpbmRleH0tJHtpbmR4fWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldEFjdGlvbnMoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgaWYgKHRhcmdldC5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRJVExFfV1gKSkge1xuICAgICAgY29uc3QgdGl0bGUgPSB0YXJnZXQuY2xvc2VzdChgWyR7dGhpcy5hdHRycy5USVRMRX1dYCk7XG4gICAgICBjb25zdCB0YWJzQmxvY2sgPSB0aXRsZS5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRBQlN9XWApO1xuXG4gICAgICBpZiAoIXRpdGxlLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNsYXNzZXMuQUNUSVZFKSkge1xuICAgICAgICBsZXQgYWN0aXZlVGl0bGUgPSB0YWJzQmxvY2sucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICBgWyR7dGhpcy5hdHRycy5USVRMRX1dLiR7dGhpcy5jbGFzc2VzLkFDVElWRX1gLFxuICAgICAgICApO1xuXG4gICAgICAgIGFjdGl2ZVRpdGxlLmxlbmd0aFxuICAgICAgICAgID8gKGFjdGl2ZVRpdGxlID0gQXJyYXkuZnJvbShhY3RpdmVUaXRsZSkuZmlsdGVyKFxuICAgICAgICAgICAgICAoaXRlbSkgPT4gaXRlbS5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRBQlN9XWApID09PSB0YWJzQmxvY2ssXG4gICAgICAgICAgICApKVxuICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgYWN0aXZlVGl0bGUubGVuZ3RoXG4gICAgICAgICAgPyBhY3RpdmVUaXRsZVswXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5BQ1RJVkUpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5BQ1RJVkUpO1xuICAgICAgICB0aGlzLnNldFN0YXR1cyh0YWJzQmxvY2spO1xuICAgICAgfVxuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgaW5pdCh0YWJzQmxvY2spIHtcbiAgICBsZXQgdGl0bGVzID0gdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoYFske3RoaXMuYXR0cnMuVElUTEVTfV0+KmApO1xuICAgIGxldCBjb250ZW50ID0gdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3JBbGwoYFske3RoaXMuYXR0cnMuQk9EWX1dPipgKTtcbiAgICBjb25zdCBpbmRleCA9IHRhYnNCbG9jay5kYXRhc2V0LnRhYnNJbmRleDtcbiAgICBjb25zdCBhY3RpdmVIYXNoQmxvY2sgPSB0aGlzLmFjdGl2ZUhhc2hbMF0gPT0gaW5kZXg7XG5cbiAgICBpZiAoYWN0aXZlSGFzaEJsb2NrKSB7XG4gICAgICBjb25zdCBhY3RpdmVUaXRsZSA9IHRhYnNCbG9jay5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgWyR7dGhpcy5hdHRycy5USVRMRVN9XT4uJHt0aGlzLmNsYXNzZXMuQUNUSVZFfWAsXG4gICAgICApO1xuICAgICAgYWN0aXZlVGl0bGUgPyBhY3RpdmVUaXRsZS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5BQ1RJVkUpIDogbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudC5sZW5ndGgpIHtcbiAgICAgIGNvbnRlbnQgPSBBcnJheS5mcm9tKGNvbnRlbnQpLmZpbHRlcihcbiAgICAgICAgKGl0ZW0pID0+IGl0ZW0uY2xvc2VzdChgWyR7dGhpcy5hdHRycy5UQUJTfV1gKSA9PT0gdGFic0Jsb2NrLFxuICAgICAgKTtcbiAgICAgIHRpdGxlcyA9IEFycmF5LmZyb20odGl0bGVzKS5maWx0ZXIoXG4gICAgICAgIChpdGVtKSA9PiBpdGVtLmNsb3Nlc3QoYFske3RoaXMuYXR0cnMuVEFCU31dYCkgPT09IHRhYnNCbG9jayxcbiAgICAgICk7XG5cbiAgICAgIGNvbnRlbnQuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgdGl0bGVzW2luZGV4XS5zZXRBdHRyaWJ1dGUodGhpcy5hdHRycy5USVRMRSwgXCJcIik7XG4gICAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKHRoaXMuYXR0cnMuVEFCX0lURU0sIFwiXCIpO1xuXG4gICAgICAgIGlmIChhY3RpdmVIYXNoQmxvY2sgJiYgaW5kZXggPT0gdGhpcy5hY3RpdmVIYXNoWzFdKSB7XG4gICAgICAgICAgdGl0bGVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5BQ1RJVkUpO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0uaGlkZGVuID0gIXRpdGxlc1tpbmRleF0uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY2xhc3Nlcy5BQ1RJVkUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm5ldyBUYWJzKCk7XG4iLCIvKipcbiAqIHNldCBoYXNoIHRvIHVybFxuICogQHBhcmFtIHtzdHJpbmd9IGhhc2hcbiAqL1xuZXhwb3J0IGNvbnN0IHNldEhhc2ggPSAoaGFzaCkgPT4ge1xuICBoYXNoID0gaGFzaCA/IGAjJHtoYXNofWAgOiB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdChcIiNcIilbMF07XG4gIGhpc3RvcnkucHVzaFN0YXRlKFwiXCIsIFwiXCIsIGhhc2gpO1xufTtcblxuLyoqXG4gKiBnZXQgaGFzaCBmcm9tIHVybFxuICogQHJldHVybnMgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRIYXNoID0gKCkgPT4ge1xuICBpZiAobG9jYXRpb24uaGFzaCkge1xuICAgIHJldHVybiBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xuICB9XG59O1xuXG4vKipcbiAqIGluaXRpYWxpemVzIGhhbWJ1cmdlciBtZW51XG4gKi9cbmV4cG9ydCBjb25zdCBtZW51SW5pdCA9ICgpID0+IHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaGFtYnVyZ2VyXCIpKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoYm9keUxvY2tTdGF0dXMgJiYgZS50YXJnZXQuY2xvc2VzdChcIi5oYW1idXJnZXJcIikpIHtcbiAgICAgICAgbWVudU9wZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGJvZHlMb2NrU3RhdHVzICYmXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJfbWVudS1vcGVuZWRcIikgJiZcbiAgICAgICAgKGUudGFyZ2V0LmNsb3Nlc3QoXCIubWVudV9fY2xvc2UtYnRuXCIpIHx8ICFlLnRhcmdldC5jbG9zZXN0KFwiLm1lbnVcIikpXG4gICAgICApIHtcbiAgICAgICAgbWVudUNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG4vKipcbiAqIG9wZW5zIGhhbWJ1cmdlciBtZW51XG4gKi9cbmV4cG9ydCBjb25zdCBtZW51T3BlbiA9ICgpID0+IHtcbiAgYm9keUxvY2soKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJfbWVudS1vcGVuZWRcIik7XG59O1xuLyoqXG4gKiBjbG9zZXMgaGFtYnVyZ2VyIG1lbnVcbiAqL1xuZXhwb3J0IGNvbnN0IG1lbnVDbG9zZSA9ICgpID0+IHtcbiAgYm9keVVubG9jaygpO1xuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIl9tZW51LW9wZW5lZFwiKTtcbn07XG5cbi8vIGJvZHkgbG9ja1xuZXhwb3J0IGxldCBib2R5TG9ja1N0YXR1cyA9IHRydWU7XG4vKipcbiAqIHRvZ2dsZXMgYm9keSBsb2NrXG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAqL1xuZXhwb3J0IGNvbnN0IGJvZHlMb2NrVG9nZ2xlID0gKGRlbGF5ID0gNTAwKSA9PiB7XG4gIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibG9ja1wiKSkge1xuICAgIGJvZHlVbmxvY2soZGVsYXkpO1xuICB9IGVsc2Uge1xuICAgIGJvZHlMb2NrKGRlbGF5KTtcbiAgfVxufTtcbi8qKlxuICogdW5sb2NrcyBib2R5XG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAqL1xuZXhwb3J0IGNvbnN0IGJvZHlVbmxvY2sgPSAoZGVsYXkgPSA1MDApID0+IHtcbiAgaWYgKGJvZHlMb2NrU3RhdHVzKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImxvY2tcIik7XG4gICAgfSwgZGVsYXkpO1xuICAgIGJvZHlMb2NrU3RhdHVzID0gZmFsc2U7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBib2R5TG9ja1N0YXR1cyA9IHRydWU7XG4gICAgfSwgZGVsYXkpO1xuICB9XG59O1xuLyoqXG4gKiBsb2NrcyBib2R5XG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAqL1xuZXhwb3J0IGNvbnN0IGJvZHlMb2NrID0gKGRlbGF5ID0gNTAwKSA9PiB7XG4gIGlmIChib2R5TG9ja1N0YXR1cykge1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibG9ja1wiKTtcblxuICAgIGJvZHlMb2NrU3RhdHVzID0gZmFsc2U7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBib2R5TG9ja1N0YXR1cyA9IHRydWU7XG4gICAgfSwgZGVsYXkpO1xuICB9XG59O1xuXG4vKipcbiAqIG1ha2UgdGhlIGFycmF5IHVuaXF1ZVxuICogQHBhcmFtIHthcnJheX0gYXJyYXlcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWVBcnJheShhcnJheSkge1xuICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgc2VsZikge1xuICAgIHJldHVybiBzZWxmLmluZGV4T2YoaXRlbSkgPT09IGluZGV4O1xuICB9KTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIHthcnJheX0gYXJyYXlcbiAqIEBwYXJhbSB7bnVtYmVyfSBkYXRhU2V0VmFsdWVcbiAqIHByb2Nlc3MgbWVkaWEgcmVxdWVzdHMgZnJvbSBhdHRyaWJ1dGVzXG4gKi9cbmV4cG9ydCBjb25zdCBkYXRhTWVkaWFRdWVyaWVzID0gKGFycmF5LCBkYXRhU2V0VmFsdWUpID0+IHtcbiAgLy8gZ2V0IG9iamVjdHMgd2l0aCBtZWRpYSBxdWVyaWVzXG4gIGNvbnN0IG1lZGlhID0gQXJyYXkuZnJvbShhcnJheSkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtLCBpbmRleCwgc2VsZikge1xuICAgIGlmIChpdGVtLmRhdGFzZXRbZGF0YVNldFZhbHVlXSkge1xuICAgICAgcmV0dXJuIGl0ZW0uZGF0YXNldFtkYXRhU2V0VmFsdWVdLnNwbGl0KFwiLFwiKVswXTtcbiAgICB9XG4gIH0pO1xuICAvLyBvYmplY3RzIHdpdGggbWVkaWEgcXVlcmllcyBpbml0aWFsaXphdGlvblxuICBpZiAobWVkaWEubGVuZ3RoKSB7XG4gICAgY29uc3QgYnJlYWtwb2ludHNBcnJheSA9IFtdO1xuICAgIG1lZGlhLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGl0ZW0uZGF0YXNldFtkYXRhU2V0VmFsdWVdO1xuICAgICAgY29uc3QgYnJlYWtwb2ludCA9IHt9O1xuICAgICAgY29uc3QgcGFyYW1zQXJyYXkgPSBwYXJhbXMuc3BsaXQoXCIsXCIpO1xuICAgICAgYnJlYWtwb2ludC52YWx1ZSA9IHBhcmFtc0FycmF5WzBdO1xuICAgICAgYnJlYWtwb2ludC50eXBlID0gcGFyYW1zQXJyYXlbMV0gPyBwYXJhbXNBcnJheVsxXS50cmltKCkgOiBcIm1heFwiO1xuICAgICAgYnJlYWtwb2ludC5pdGVtID0gaXRlbTtcbiAgICAgIGJyZWFrcG9pbnRzQXJyYXkucHVzaChicmVha3BvaW50KTtcbiAgICB9KTtcbiAgICAvLyBnZXQgdW5pcXVlIGJyZWFrcG9pbnRzXG4gICAgbGV0IG1kUXVlcmllcyA9IGJyZWFrcG9pbnRzQXJyYXkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBcIihcIiArXG4gICAgICAgIGl0ZW0udHlwZSArXG4gICAgICAgIFwiLXdpZHRoOiBcIiArXG4gICAgICAgIGl0ZW0udmFsdWUgK1xuICAgICAgICBcInB4KSxcIiArXG4gICAgICAgIGl0ZW0udmFsdWUgK1xuICAgICAgICBcIixcIiArXG4gICAgICAgIGl0ZW0udHlwZVxuICAgICAgKTtcbiAgICB9KTtcbiAgICBtZFF1ZXJpZXMgPSB1bmlxdWVBcnJheShtZFF1ZXJpZXMpO1xuICAgIGNvbnN0IG1kUXVlcmllc0FycmF5ID0gW107XG5cbiAgICBpZiAobWRRdWVyaWVzLmxlbmd0aCkge1xuICAgICAgLy8gd29yayB3aXRoIGV2ZXJ5IGJyZWFrcG9pbnRcbiAgICAgIG1kUXVlcmllcy5mb3JFYWNoKChicmVha3BvaW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcmFtc0FycmF5ID0gYnJlYWtwb2ludC5zcGxpdChcIixcIik7XG4gICAgICAgIGNvbnN0IG1lZGlhQnJlYWtwb2ludCA9IHBhcmFtc0FycmF5WzFdO1xuICAgICAgICBjb25zdCBtZWRpYVR5cGUgPSBwYXJhbXNBcnJheVsyXTtcbiAgICAgICAgY29uc3QgbWF0Y2hNZWRpYSA9IHdpbmRvdy5tYXRjaE1lZGlhKHBhcmFtc0FycmF5WzBdKTtcbiAgICAgICAgLy8gb2JqZWN0cyB3aXRoIGNvbmRpdGlvbnNcbiAgICAgICAgY29uc3QgaXRlbXNBcnJheSA9IGJyZWFrcG9pbnRzQXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IG1lZGlhQnJlYWtwb2ludCAmJiBpdGVtLnR5cGUgPT09IG1lZGlhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbWRRdWVyaWVzQXJyYXkucHVzaCh7XG4gICAgICAgICAgaXRlbXNBcnJheSxcbiAgICAgICAgICBtYXRjaE1lZGlhLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1kUXVlcmllc0FycmF5O1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBzbW9vdGhseSBzbGlkZXMgdXBcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNob3dtb3JlXG4gKi9cbmV4cG9ydCBjb25zdCBfc2xpZGVVcCA9ICh0YXJnZXQsIGR1cmF0aW9uID0gNTAwLCBzaG93bW9yZSA9IDApID0+IHtcbiAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiX3NsaWRlXCIpKSB7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJfc2xpZGVcIik7XG4gICAgdGFyZ2V0LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IFwiaGVpZ2h0LCBtYXJnaW4sIHBhZGRpbmdcIjtcbiAgICB0YXJnZXQuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gZHVyYXRpb24gKyBcIm1zXCI7XG4gICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9IGAke3RhcmdldC5vZmZzZXRIZWlnaHR9cHhgO1xuICAgIHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgdGFyZ2V0LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICB0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gc2hvd21vcmUgPyBgJHtzaG93bW9yZX1yZW1gIDogYDBgO1xuICAgIHRhcmdldC5zdHlsZS5wYWRkaW5nVG9wID0gMDtcbiAgICB0YXJnZXQuc3R5bGUucGFkZGluZ0JvdHRvbSA9IDA7XG4gICAgdGFyZ2V0LnN0eWxlLm1hcmdpblRvcCA9IDA7XG4gICAgdGFyZ2V0LnN0eWxlLm1hcmdpbkJvdHRvbSA9IDA7XG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGFyZ2V0LmhpZGRlbiA9ICFzaG93bW9yZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICFzaG93bW9yZSA/IHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImhlaWdodFwiKSA6IG51bGw7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwYWRkaW5nLXRvcFwiKTtcbiAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcInBhZGRpbmctYm90dG9tXCIpO1xuICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwibWFyZ2luLXRvcFwiKTtcbiAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1hcmdpbi1ib3R0b21cIik7XG4gICAgICAhc2hvd21vcmUgPyB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJvdmVyZmxvd1wiKSA6IG51bGw7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIpO1xuICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwidHJhbnNpdGlvbi1wcm9wZXJ0eVwiKTtcbiAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwiX3NsaWRlXCIpO1xuICAgICAgLy8gY3JlYXRlIGV2ZW50XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJzbGlkZVVwRG9uZVwiLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgfSwgZHVyYXRpb24pO1xuICB9XG59O1xuXG4vKipcbiAqIHNtb290aGx5IHNsaWRlcyBkb3duXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxuICogQHBhcmFtIHtib29sZWFufSBzaG93bW9yZVxuICovXG5leHBvcnQgY29uc3QgX3NsaWRlRG93biA9ICh0YXJnZXQsIGR1cmF0aW9uID0gNTAwLCBzaG93bW9yZSA9IDApID0+IHtcbiAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiX3NsaWRlXCIpKSB7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJfc2xpZGVcIik7XG4gICAgdGFyZ2V0LmhpZGRlbiA9IHRhcmdldC5oaWRkZW4gPyBmYWxzZSA6IG51bGw7XG4gICAgc2hvd21vcmUgPyB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJoZWlnaHRcIikgOiBudWxsO1xuICAgIGxldCBoZWlnaHQgPSB0YXJnZXQub2Zmc2V0SGVpZ2h0O1xuICAgIHRhcmdldC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XG4gICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9IHNob3dtb3JlID8gYCR7c2hvd21vcmV9cmVtYCA6IGAwYDtcbiAgICB0YXJnZXQuc3R5bGUucGFkZGluZ1RvcCA9IDA7XG4gICAgdGFyZ2V0LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAwO1xuICAgIHRhcmdldC5zdHlsZS5tYXJnaW5Ub3AgPSAwO1xuICAgIHRhcmdldC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAwO1xuICAgIHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgdGFyZ2V0LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IFwiaGVpZ2h0LCBtYXJnaW4sIHBhZGRpbmdcIjtcbiAgICB0YXJnZXQuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gZHVyYXRpb24gKyBcIm1zXCI7XG4gICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcbiAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwYWRkaW5nLXRvcFwiKTtcbiAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJwYWRkaW5nLWJvdHRvbVwiKTtcbiAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJtYXJnaW4tdG9wXCIpO1xuICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcIm1hcmdpbi1ib3R0b21cIik7XG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiaGVpZ2h0XCIpO1xuICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwib3ZlcmZsb3dcIik7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIpO1xuICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwidHJhbnNpdGlvbi1wcm9wZXJ0eVwiKTtcbiAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwiX3NsaWRlXCIpO1xuICAgICAgLy8gY3JlYXRlIGV2ZW50XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJzbGlkZURvd25Eb25lXCIsIHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICB9LCBkdXJhdGlvbik7XG4gIH1cbn07XG5cbi8qKlxuICogdG9nZ2xlcyBzbW9vdGggc2xpZGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gKiBAcmV0dXJucyBmdW5jdGlvblxuICovXG5leHBvcnQgY29uc3QgX3NsaWRlVG9nZ2xlID0gKHRhcmdldCwgZHVyYXRpb24gPSA1MDApID0+IHtcbiAgaWYgKHRhcmdldC5oaWRkZW4pIHtcbiAgICByZXR1cm4gX3NsaWRlRG93bih0YXJnZXQsIGR1cmF0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX3NsaWRlVXAodGFyZ2V0LCBkdXJhdGlvbik7XG4gIH1cbn07XG5cbi8qKlxuICogY29udmVydHMgcmVtIHRvIHBpeGVsc1xuICogQHBhcmFtIHtudW1iZXJ9IHJlbVZhbHVlXG4gKiBAcmV0dXJucyBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbVRvUHgocmVtVmFsdWUpIHtcbiAgY29uc3QgaHRtbEZvbnRTaXplID0gcGFyc2VGbG9hdChcbiAgICBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemUsXG4gICk7XG5cbiAgY29uc3QgcHhWYWx1ZSA9IHJlbVZhbHVlICogaHRtbEZvbnRTaXplO1xuXG4gIHJldHVybiBNYXRoLnJvdW5kKHB4VmFsdWUpICsgXCJweFwiO1xufVxuXG4vLyByZW1vdmUgY2xhc3MgZnJvbSBhbGwgYXJyYXkgZWxlbWVudHNcbmV4cG9ydCBjb25zdCByZW1vdmVDbGFzc2VzID0gKGFycmF5LCBjbGFzc05hbWUpID0+IHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGFycmF5W2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgfVxufTtcbiIsIi8vIEltcG9ydHNcbnZhciBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCIpO1xudmFyIF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Tm90bytTYW5zOndkdGhANzUmZGlzcGxheT1zd2FwKTtcIl0pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6IFwiQmFobnNjaHJpZnRcIjtcbiAgc3JjOiB1cmwoXCIuLi9hc3NldHMvZm9udHMvQmFobnNjaHJpZnQud29mZjJcIikgZm9ybWF0KFwid29mZjJcIik7XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cbiosXG4qOjpiZWZvcmUsXG4qOjphZnRlciB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmh0bWwge1xuICBmb250LWZhbWlseTogXCJOb3RvIFNhbnNcIjtcbiAgZm9udC1zaXplOiAwLjUyMDgzMzV2dztcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICAtd2Via2l0LWFuaW1hdGlvbjogYnVnZml4IGluZmluaXRlIDFzO1xuICBsaW5lLWhlaWdodDogMS4yO1xuICBtYXJnaW46IDA7XG4gIGhlaWdodDogMTAwJTtcbiAgcGFkZGluZzogMDtcbn1cblxuYm9keSB7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgLXdlYmtpdC1hbmltYXRpb246IGJ1Z2ZpeCBpbmZpbml0ZSAxcztcbiAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGZvbnQtc2l6ZTogMS44cmVtO1xuICBjb2xvcjogIzAwMWIzMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbn1cblxuaW5wdXQsXG50ZXh0YXJlYSB7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBidWdmaXggaW5maW5pdGUgMXM7XG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3JkZXI6IG5vbmU7XG4gIGNvbG9yOiBpbmhlcml0O1xufVxuXG5hIHtcbiAgY29sb3I6IHVuc2V0O1xufVxuXG5hLFxuYTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbn1cblxuYnV0dG9uLFxuaW5wdXQsXG5hLFxudGV4dGFyZWEge1xuICBvdXRsaW5lOiBub25lO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZvbnQ6IGluaGVyaXQ7XG59XG5idXR0b246Zm9jdXMsXG5pbnB1dDpmb2N1cyxcbmE6Zm9jdXMsXG50ZXh0YXJlYTpmb2N1cyB7XG4gIG91dGxpbmU6IG5vbmU7XG59XG5idXR0b246YWN0aXZlLFxuaW5wdXQ6YWN0aXZlLFxuYTphY3RpdmUsXG50ZXh0YXJlYTphY3RpdmUge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYge1xuICBmb250OiBpbmhlcml0O1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG59XG5cbnAge1xuICBtYXJnaW4tdG9wOiAwO1xuICBtYXJnaW4tYm90dG9tOiAwO1xufVxuXG5pbWcge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiBhdXRvO1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuYnV0dG9uIHtcbiAgYm9yZGVyOiBub25lO1xuICBjb2xvcjogaW5oZXJpdDtcbiAgZm9udDogaW5oZXJpdDtcbiAgdGV4dC1hbGlnbjogaW5oZXJpdDtcbiAgcGFkZGluZzogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cbnVsIHtcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luOiAwO1xufVxuXG51bCBsaSB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbn1cblxuLmNvbnRhaW5lciB7XG4gIHdpZHRoOiAxNzZyZW07XG4gIG1hcmdpbjogMCBhdXRvO1xufVxuXG5zZWN0aW9uIHtcbiAgbWFyZ2luLWJvdHRvbTogMTlyZW07XG59XG5cbmlucHV0W3R5cGU9bnVtYmVyXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcbmlucHV0W3R5cGU9bnVtYmVyXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgbWFyZ2luOiAwO1xufVxuXG5pbnB1dFt0eXBlPW51bWJlcl0ge1xuICAtbW96LWFwcGVhcmFuY2U6IHRleHRmaWVsZDtcbn1cblxuc3ZnLFxuaW1nIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbiAgb2JqZWN0LWZpdDogY29udGFpbjtcbn1cbmh0bWwubG9jayB7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG5odG1sLFxuYm9keSB7XG4gIG92ZXJmbG93LXg6IGNsaXA7XG59XG5cbm1haW4ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi53cmFwcGVyIHtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIG1heC13aWR0aDogMTkyMHB4O1xufVxuXG4uaCB7XG4gIGZvbnQtZmFtaWx5OiBcIkJhaG5zY2hyaWZ0XCI7XG4gIGxpbmUtaGVpZ2h0OiAxMjAlO1xufVxuLmhfaDEge1xuICBmb250LXNpemU6IDdyZW07XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG4uaF9oMiB7XG4gIGZvbnQtc2l6ZTogNnJlbTtcbn1cbi5oX2gzIHtcbiAgZm9udC1zaXplOiAzLjJyZW07XG59XG4uaF9oNCB7XG4gIGZvbnQtc2l6ZTogMi40cmVtO1xufVxuXG4udHh0MjQge1xuICBmb250LXNpemU6IDIuNHJlbTtcbiAgbGluZS1oZWlnaHQ6IDMuM3JlbTtcbn1cblxuLnR4dDIyIHtcbiAgZm9udC1zaXplOiAyLjJyZW07XG4gIGxpbmUtaGVpZ2h0OiAyLjZyZW07XG59XG4udHh0MjJfc2Ige1xuICBmb250LWZhbWlseTogXCJCYWhuc2NocmlmdFwiO1xufVxuXG4uYnRuIHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICNmZmZmZmY7XG59XG4uYnRuX3ByaW1hcnkge1xuICBwYWRkaW5nOiAxLjRyZW0gMi44cmVtO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwNDc4MDtcbiAgY2xpcC1wYXRoOiBwb2x5Z29uKDAgMCwgOTIlIDAsIDEwMCUgMjIlLCAxMDAlIDgwJSwgMTAwJSAxMDAlLCAwIDEwMCUsIDAlIDgwJSwgMCUgMjAlKTtcbiAgdHJhbnNpdGlvbjogY2xpcC1wYXRoIDAuM3MgZWFzZTtcbn1cbi5idG5fcHJpbWFyeSAuYnRuX190eHQge1xuICBsaW5lLWhlaWdodDogMi42cmVtO1xufVxuLmJ0bl9wcmltYXJ5OmRpc2FibGVkIHtcbiAgY29sb3I6ICM4NjkxOWE7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmMmYyZjI7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuLmJ0bl9wcmltYXJ5X3doaXRlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbn1cbi5idG5fcHJpbWFyeV93aGl0ZSAuYnRuX190eHQge1xuICBjb2xvcjogIzAwNDc4MDtcbn1cbi5idG5fc2Vjb25kYXJ5IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuLmJ0bl9zZWNvbmRhcnk6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IC0wLjNyZW07XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDFweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogbGVmdDtcbn1cbi5idG5fc2Vjb25kYXJ5IC5idG5fX3R4dCB7XG4gIGxpbmUtaGVpZ2h0OiAyLjRyZW07XG59XG4uYnRuX3NlY29uZGFyeV9ibHVlIHtcbiAgY29sb3I6ICMwMDQ3ODA7XG59XG4uYnRuX3NlY29uZGFyeV9ibHVlOjphZnRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDQ3ODA7XG59XG5cbi5hcnJvdy1idG4ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZmxleDogMCAwIDQuMnJlbTtcbiAgd2lkdGg6IDQuMnJlbTtcbiAgaGVpZ2h0OiA0LjJyZW07XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xufVxuLmFycm93LWJ0bjo6YmVmb3JlLCAuYXJyb3ctYnRuOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2ZmZmZmZjtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbn1cbi5hcnJvdy1idG46OmJlZm9yZSB7XG4gIHdpZHRoOiAzLjhyZW07XG4gIGhlaWdodDogMy44cmVtO1xuICBvcGFjaXR5OiAwLjQ7XG59XG4uYXJyb3ctYnRuOjphZnRlciB7XG4gIHdpZHRoOiAzLjRyZW07XG4gIGhlaWdodDogMy40cmVtO1xufVxuLmFycm93LWJ0biBzdmcge1xuICB3aWR0aDogMS41cmVtO1xuICBoZWlnaHQ6IDEuNXJlbTtcbn1cbi5hcnJvdy1idG5fYmx1ZSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMCwgNzEsIDEyOCwgMC4xKTtcbn1cbi5hcnJvdy1idG5fYmx1ZTo6YmVmb3JlLCAuYXJyb3ctYnRuX2JsdWU6OmFmdGVyIHtcbiAgYm9yZGVyOiAxcHggc29saWQgIzAwNDc4MDtcbn1cbi5hcnJvdy1idG5fYmx1ZSBzdmcge1xuICBmaWxsOiAjMDA0NzgwO1xufVxuXG5pbnB1dFt0eXBlPXRleHRdLFxuaW5wdXRbdHlwZT1lbWFpbF0sXG5pbnB1dFt0eXBlPXRlbF0sXG50ZXh0YXJlYSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xuICBhcHBlYXJhbmNlOiBub25lO1xufVxuXG50ZXh0YXJlYTpmb2N1cyxcbmlucHV0OmZvY3VzIHtcbiAgb3V0bGluZTogbm9uZTtcbn1cblxuLmlucHV0IHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuLmlucHV0X2ZpbGUgLmlucHV0X19maWVsZCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMjtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvcGFjaXR5OiAwO1xufVxuLmlucHV0X2ZpbGUgLmlucHV0X19wbGFjZWhvbGRlciB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2x1bW4tZ2FwOiAxLjJyZW07XG4gIGxpbmUtaGVpZ2h0OiAyLjZyZW07XG59XG4uaW5wdXRfZmlsZSAuaW5wdXRfX3BsYWNlaG9sZGVyOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGZsZXg6IDAgMCAyLjRyZW07XG4gIHdpZHRoOiAyLjRyZW07XG4gIGhlaWdodDogMi40cmVtO1xuICBiYWNrZ3JvdW5kOiB1cmwoXCIuL2Fzc2V0cy9pbWFnZXMvaWNvbnMvY2xpcC5zdmdcIikgY2VudGVyL2NvbnRhaW4gbm8tcmVwZWF0O1xufVxuLmlucHV0Om5vdCguaW5wdXRfZmlsZSkgLmlucHV0X19maWVsZCB7XG4gIHBhZGRpbmctYm90dG9tOiAxLjZyZW07XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTAwJTtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjYTZiZGQwO1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIGVhc2UsIGJvcmRlci1ib3R0b20gMC4zcyBlYXNlO1xufVxuLmlucHV0Om5vdCguaW5wdXRfZmlsZSkgLmlucHV0X19maWVsZDo6cGxhY2Vob2xkZXIge1xuICBjb2xvcjogIzRkNWY2ZTtcbiAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyBlYXNlO1xufVxuLmlucHV0Om5vdCguaW5wdXRfZmlsZSkuX2lzLWZpbGxlZCAuaW5wdXRfX2ZpZWxkIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICMwMDAwMDA7XG4gIGNvbG9yOiAjMDAwMDAwO1xufVxuLmlucHV0Om5vdCguaW5wdXRfZmlsZSkuX2hhcy1lcnJvcjo6YWZ0ZXIge1xuICBjb250ZW50OiBhdHRyKGRhdGEtaGludCk7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm90dG9tOiAtMC40cmVtO1xuICBsZWZ0OiAwO1xuICBmb250LXNpemU6IDEuNHJlbTtcbiAgY29sb3I6ICNkOTAwMDA7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxMDAlKTtcbn1cbi5pbnB1dDpub3QoLmlucHV0X2ZpbGUpLl9oYXMtZXJyb3IgLmlucHV0X19maWVsZCB7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZDkwMDAwO1xufVxuXG4ub3B0aW9uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4ub3B0aW9uX19pbnB1dCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3BhY2l0eTogMDtcbiAgYXBwZWFyYW5jZTogbm9uZTtcbn1cbi5vcHRpb25fX2lucHV0OmNoZWNrZWQgKyAub3B0aW9uX190eHQ6OmFmdGVyIHtcbiAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbn1cbi5vcHRpb25fX3R4dCB7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbHVtbi1nYXA6IDAuOHJlbTtcbn1cbi5vcHRpb25fX3R4dDo6YmVmb3JlLCAub3B0aW9uX190eHQ6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xufVxuLm9wdGlvbl9fdHh0OjpiZWZvcmUge1xuICBmbGV4OiAwIDAgMi40cmVtO1xuICB3aWR0aDogMi40cmVtO1xuICBoZWlnaHQ6IDIuNHJlbTtcbiAgYm9yZGVyOiAxLjVweCBzb2xpZCAjMDA0NzgwO1xufVxuLm9wdGlvbl9fdHh0OjphZnRlciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMC40cmVtO1xuICB0b3A6IDAuNHJlbTtcbiAgd2lkdGg6IDEuNnJlbTtcbiAgaGVpZ2h0OiAxLjZyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDQ3ODA7XG4gIHRyYW5zZm9ybTogc2NhbGUoMCk7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XG59XG5cbi5jaGVja2JveCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG59XG4uY2hlY2tib3hfX2lucHV0IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAyO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBvcGFjaXR5OiAwO1xuICBhcHBlYXJhbmNlOiBub25lO1xufVxuLmNoZWNrYm94X19pbnB1dDpjaGVja2VkICsgLmNoZWNrYm94X190eHQ6OmJlZm9yZSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICMwMDQ3ODA7XG59XG4uY2hlY2tib3hfX2lucHV0OmNoZWNrZWQgKyAuY2hlY2tib3hfX3R4dDo6YWZ0ZXIge1xuICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xufVxuLmNoZWNrYm94X190eHQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2x1bW4tZ2FwOiAwLjhyZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi5jaGVja2JveF9fdHh0OjpiZWZvcmUge1xuICBjb250ZW50OiBcIlwiO1xuICBmbGV4OiAwIDAgMi4ycmVtO1xuICB3aWR0aDogMi4ycmVtO1xuICBoZWlnaHQ6IDIuMnJlbTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2E2YmRkMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgdHJhbnNpdGlvbjogYm9yZGVyIDAuM3MgZWFzZTtcbn1cbi5jaGVja2JveF9fdHh0OjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwLjNyZW07XG4gIGxlZnQ6IDAuM3JlbTtcbiAgd2lkdGg6IDEuNnJlbTtcbiAgaGVpZ2h0OiAxLjZyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDQ3ODA7XG4gIHRyYW5zZm9ybTogc2NhbGUoMCk7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XG59XG5cbi5icmVhZGNydW1icyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbHVtbi1nYXA6IDEuMnJlbTtcbn1cbi5icmVhZGNydW1ic19fbGluayB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbHVtbi1nYXA6IDEuMnJlbTtcbn1cbi5icmVhZGNydW1ic19fbGluazo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICB3aWR0aDogMnJlbTtcbiAgaGVpZ2h0OiAwLjJyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICM4MDhkOTc7XG59XG4uYnJlYWRjcnVtYnNfX3R4dCB7XG4gIGNvbG9yOiAjMDA0NzgwO1xufVxuXG4udGFic19fbmF2aWdhdGlvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGNvbHVtbi1nYXA6IDEuNXJlbTtcbn1cbi50YWJzX19ib2R5IHtcbiAgcGFkZGluZy10b3A6IDFyZW07XG59XG5cbi50YWIge1xuICBwYWRkaW5nOiAwIDIuOHJlbTtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogMTByZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICNmMmYyZjI7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4zcyBlYXNlLCBjb2xvciAwLjNzIGVhc2U7XG59XG4udGFiIHN2ZyB7XG4gIGZsZXg6IDAgMCAyLjRyZW07XG4gIHdpZHRoOiAyLjRyZW07XG4gIGhlaWdodDogMi40cmVtO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwLjNyZW0sIC0wLjNyZW0pO1xuICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgZWFzZTtcbn1cbi50YWJfX251bSB7XG4gIG1hcmdpbi1yaWdodDogMC44cmVtO1xufVxuLnRhYl9fdHh0IHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuLnRhYi5faXMtYWN0aXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwNDc4MDtcbiAgY29sb3I6ICNmZmZmZmY7XG59XG4udGFiLl9pcy1hY3RpdmUgc3ZnIHtcbiAgZmlsbDogI2ZmZmZmZjtcbn1cbkBtZWRpYSAobWluLXdpZHRoOiAxOTIwcHgpe1xuICBodG1sIHtcbiAgICBmb250LXNpemU6IDEwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKXtcbiAgc2VjdGlvbiB7XG4gICAgbWFyZ2luLWJvdHRvbTogMjByZW07XG4gIH1cbiAgaHRtbCB7XG4gICAgZm9udC1zaXplOiA1cHg7XG4gICAgZm9udC1zaXplOiAxLjU2MjV2dztcbiAgICBmb250LXNpemU6IDEuMzMzMzMzMzMzM3Z3O1xuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcbiAgfVxuICBib2R5IHtcbiAgICBmb250LXNpemU6IDIuOHJlbTtcbiAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XG4gIH1cbiAgLmNvbnRhaW5lciB7XG4gICAgcGFkZGluZzogMCAyLjRyZW07XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbiAgLmhfaDEge1xuICAgIGZvbnQtc2l6ZTogNS42cmVtO1xuICB9XG4gIC5oX2gyIHtcbiAgICBmb250LXNpemU6IDUuNnJlbTtcbiAgfVxuICAuaF9oMyB7XG4gICAgZm9udC1zaXplOiA0LjRyZW07XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gIH1cbiAgLmhfaDQge1xuICAgIGZvbnQtc2l6ZTogNC40cmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxO1xuICB9XG4gIC50eHQyNCB7XG4gICAgZm9udC1zaXplOiA0cmVtO1xuICB9XG4gIC50eHQyMiB7XG4gICAgZm9udC1zaXplOiAzLjZyZW07XG4gIH1cbiAgLmJ0bl9wcmltYXJ5IHtcbiAgICBwYWRkaW5nOiAyLjhyZW0gNS42cmVtO1xuICB9XG4gIC5idG5fcHJpbWFyeSAuYnRuX190eHQge1xuICAgIGxpbmUtaGVpZ2h0OiA0LjJyZW07XG4gIH1cbiAgLmJ0bl9zZWNvbmRhcnkgLmJ0bl9fdHh0IHtcbiAgICBsaW5lLWhlaWdodDogNC44cmVtO1xuICB9XG4gIC5hcnJvdy1idG4ge1xuICAgIGZsZXg6IDAgMCAxMHJlbTtcbiAgICB3aWR0aDogMTByZW07XG4gICAgaGVpZ2h0OiAxMHJlbTtcbiAgfVxuICAuYXJyb3ctYnRuOjpiZWZvcmUge1xuICAgIHdpZHRoOiA5cmVtO1xuICAgIGhlaWdodDogOXJlbTtcbiAgfVxuICAuYXJyb3ctYnRuOjphZnRlciB7XG4gICAgd2lkdGg6IDhyZW07XG4gICAgaGVpZ2h0OiA4cmVtO1xuICB9XG4gIC5hcnJvdy1idG4gc3ZnIHtcbiAgICB3aWR0aDogMy4ycmVtO1xuICAgIGhlaWdodDogMy4ycmVtO1xuICB9XG4gIC5pbnB1dF9maWxlIC5pbnB1dF9fcGxhY2Vob2xkZXIge1xuICAgIGNvbHVtbi1nYXA6IDNyZW07XG4gICAgbGluZS1oZWlnaHQ6IDQuMXJlbTtcbiAgfVxuICAuaW5wdXRfZmlsZSAuaW5wdXRfX3BsYWNlaG9sZGVyOjphZnRlciB7XG4gICAgZmxleDogMCAwIDQuOHJlbTtcbiAgICB3aWR0aDogNC44cmVtO1xuICAgIGhlaWdodDogNC44cmVtO1xuICB9XG4gIC5pbnB1dDpub3QoLmlucHV0X2ZpbGUpLl9oYXMtZXJyb3I6OmFmdGVyIHtcbiAgICBib3R0b206IC0wLjhyZW07XG4gICAgZm9udC1zaXplOiAycmVtO1xuICB9XG4gIC5vcHRpb25fX3R4dCB7XG4gICAgY29sdW1uLWdhcDogMS42cmVtO1xuICB9XG4gIC5vcHRpb25fX3R4dDo6YmVmb3JlIHtcbiAgICBmbGV4OiAwIDAgNC44cmVtO1xuICAgIHdpZHRoOiA0LjhyZW07XG4gICAgaGVpZ2h0OiA0LjhyZW07XG4gIH1cbiAgLm9wdGlvbl9fdHh0OjphZnRlciB7XG4gICAgdG9wOiAwLjhyZW07XG4gICAgbGVmdDogMC44cmVtO1xuICAgIHdpZHRoOiAzLjJyZW07XG4gICAgaGVpZ2h0OiAzLjJyZW07XG4gIH1cbiAgLmNoZWNrYm94X190eHQge1xuICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcbiAgfVxuICAuY2hlY2tib3hfX3R4dDo6YmVmb3JlIHtcbiAgICBmbGV4OiAwIDAgNC40cmVtO1xuICAgIHdpZHRoOiA0LjRyZW07XG4gICAgaGVpZ2h0OiA0LjRyZW07XG4gIH1cbiAgLmNoZWNrYm94X190eHQ6OmFmdGVyIHtcbiAgICBsZWZ0OiAwLjZyZW07XG4gICAgdG9wOiAwLjZyZW07XG4gICAgd2lkdGg6IDMuMnJlbTtcbiAgICBoZWlnaHQ6IDMuMnJlbTtcbiAgfVxuICAuYnJlYWRjcnVtYnMge1xuICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcbiAgICBmb250LXNpemU6IDMuMnJlbTtcbiAgfVxuICAuYnJlYWRjcnVtYnNfX2xpbmsge1xuICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcbiAgfVxuICAuYnJlYWRjcnVtYnNfX2xpbms6OmFmdGVyIHtcbiAgICB3aWR0aDogMy4ycmVtO1xuICAgIGhlaWdodDogMXB4O1xuICB9XG4gIC50YWIge1xuICAgIHBhZGRpbmc6IDAgMi40cmVtO1xuICAgIGhlaWdodDogMTEuMnJlbTtcbiAgfVxuICAudGFiIHN2ZyB7XG4gICAgZmxleDogMCAwIDMuMnJlbTtcbiAgICB3aWR0aDogMy4ycmVtO1xuICAgIGhlaWdodDogMy4ycmVtO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAuNnJlbSwgLTAuNnJlbSk7XG4gIH1cbiAgLnRhYl9fbnVtIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDEuNnJlbTtcbiAgfVxufVxuQG1lZGlhIChhbnktaG92ZXI6IGhvdmVyKXtcbiAgLmJ0bl9wcmltYXJ5OmhvdmVyIHtcbiAgICBjbGlwLXBhdGg6IHBvbHlnb24oMCAwLCAxMDAlIDAsIDEwMCUgMCwgMTAwJSA4MCUsIDEwMCUgMTAwJSwgMCAxMDAlLCAwJSA4MCUsIDAlIDIwJSk7XG4gIH1cbiAgLmJ0bl9zZWNvbmRhcnk6aG92ZXI6OmFmdGVyIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWCgwLjA1KTtcbiAgfVxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3Njc3MvZm9udHMuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3Njc3Mvc3R5bGUuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3Njc3Mvc2V0LnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy91aS9fdHlwby5zY3NzXCIsXCJ3ZWJwYWNrOi8vLi9zcmMvdWkvX2J1dHRvbnMuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3VpL19pbnB1dC5zY3NzXCIsXCJ3ZWJwYWNrOi8vLi9zcmMvdWkvX2JyZWFkY3J1bWJzLnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy91aS9fdGFicy5zY3NzXCIsXCI8bm8gc291cmNlPlwiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLDBCQUFBO0VBQ0EsNkRBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FDRUY7QUNOQTs7O0VBR0ksc0JBQUE7QURRSjs7QUNOQTtFQUNJLHdCQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EscUNBQUE7RUFDQSxnQkFBQTtFQUNBLFNBQUE7RUFDQSxZQUFBO0VBQ0EsVUFBQTtBRFNKOztBQ05BO0VBQ0ksa0JBQUE7RUFDQSxtQkFBQTtFQUNBLHFDQUFBO0VBQ0EsZ0JBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtFQUNBLGNEZlE7RUNnQlIseUJEcEJJO0FBNkJSOztBQ05BOztFQUVJLHFDQUFBO0VBQ0Esb0JBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLDZCQUFBO0VBQ0EsWUFBQTtFQUNBLGNBQUE7QURTSjs7QUNQQTtFQUNJLFlBQUE7QURVSjs7QUNSQTs7RUFFSSxxQkFBQTtBRFdKOztBQ1JBOzs7O0VBSUksYUFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0FEV0o7QUNWSTs7OztFQUNJLGFBQUE7QURlUjtBQ2JJOzs7O0VBQ0ksYUFBQTtBRGtCUjs7QUNkQTs7Ozs7O0VBTUksYUFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0FEaUJK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O0VOc29CSjtBQXBERjtBTzluQkE7RUppRE07SUFDRSxvRkFBQTtFSHFQTjtFR2xOTTtJQUNFLHVCQUFBO0VIdU9SO0FBeVVGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJCYWhuc2NocmlmdFxcXCI7XFxuICBzcmM6IHVybChcXFwiLi4vYXNzZXRzL2ZvbnRzL0JhaG5zY2hyaWZ0LndvZmYyXFxcIikgZm9ybWF0KFxcXCJ3b2ZmMlxcXCIpO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG59XFxuXCIsXCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWl4aW5zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcbkBpbXBvcnQgXFxcIi4vbWl4aW5zXFxcIjtcXG5cXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB2YXJpYWJsZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcbi8vIGNvbG9yc1xcbiR3aGl0ZTogI2ZmZmZmZjtcXG4kYmxhY2s6ICMwMDAwMDA7XFxuJGJsdWU6ICMwMDQ3ODA7XFxuJGdyYXk6ICNmMmYyZjI7XFxuJGZvbnRDb2xvcjogIzAwMWIzMDtcXG4kbGlnaHRCbHVlOiAjYTZiZGQwO1xcbiRyZWQ6ICNkOTAwMDA7XFxuXFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmb250cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG5AaW1wb3J0IHVybChcXFwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Ob3RvK1NhbnM6d2R0aEA3NSZkaXNwbGF5PXN3YXBcXFwiKTtcXG5cXG4vLyBsb2NhbCBmb250c1xcbkBpbXBvcnQgXFxcIi4vZm9udHNcXFwiO1xcblxcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gYmFzZSBzdHlsZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuXFxuLy8gYmFzZSBzY3NzIGZpbGVcXG5AaW1wb3J0IFxcXCIuL3NldFxcXCI7XFxuXFxuLy8gaHRtbCwgYm9keVxcbmh0bWwge1xcbiAgJi5sb2NrIHtcXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICB9XFxufVxcbmh0bWwsXFxuYm9keSB7XFxuICBvdmVyZmxvdy14OiBjbGlwO1xcbn1cXG5cXG4vLyBtYWluXFxubWFpbiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbi53cmFwcGVyIHtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbiAgbWF4LXdpZHRoOiAxOTIwcHg7XFxufVxcblxcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuXFxuLy8gaGVhZGVyIC8gZm9vdGVyXFxuQGltcG9ydCBcXFwiLi9zZWN0aW9ucy9oZWFkZXJcXFwiO1xcbkBpbXBvcnQgXFxcIi4vc2VjdGlvbnMvZm9vdGVyXFxcIjtcXG5cXG4vLyB1aVxcbkBpbXBvcnQgXFxcIi4uL3VpL3VpXFxcIjtcXG5cXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcbkBpbXBvcnQgXFxcIi4vZGV2L3Z6bXNrMS5zY3NzXFxcIjtcXG5AaW1wb3J0IFxcXCIuL2Rldi9tYXJrdXNETS5zY3NzXFxcIjtcXG5AaW1wb3J0IFxcXCIuL2Rldi91a2lrMC5zY3NzXFxcIjtcXG5cIixcIiosXFxuKjo6YmVmb3JlLFxcbio6OmFmdGVyIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuaHRtbCB7XFxuICAgIGZvbnQtZmFtaWx5OiAnTm90byBTYW5zJzsgLy8g0YjRgNC40YTRgiDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQv9C+INGB0LDQudGC0YNcXG4gICAgZm9udC1zaXplOiAwLjUyMDgzMzV2dzsgLy8g0L3QsCDRgNCw0LfRgNC10YjQtdC90LjQuCAxOTIwIDAuNTIwODM1dncgPT09IDEwcHhcXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xcbiAgICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbjogYnVnZml4IGluZmluaXRlIDFzO1xcbiAgICBsaW5lLWhlaWdodDogMS4yO1xcbiAgICBtYXJnaW46IDA7XFxuICAgIGhlaWdodDogMTAwJTtcXG4gICAgcGFkZGluZzogMDtcXG59XFxuXFxuYm9keSB7XFxuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG4gICAgLXdlYmtpdC1hbmltYXRpb246IGJ1Z2ZpeCBpbmZpbml0ZSAxcztcXG4gICAgbGluZS1oZWlnaHQ6IDEuMjtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIGZvbnQtc2l6ZTogMS44cmVtO1xcbiAgICBjb2xvcjogJGZvbnRDb2xvcjsgLy8g0YbQstC10YIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0YLQtdC60YHRgtCwINC/0L4g0YHQsNC50YLRg1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkd2hpdGU7XFxufVxcblxcbmlucHV0LFxcbnRleHRhcmVhIHtcXG4gICAgLXdlYmtpdC1hbmltYXRpb246IGJ1Z2ZpeCBpbmZpbml0ZSAxcztcXG4gICAgbGluZS1oZWlnaHQ6IGluaGVyaXQ7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgY29sb3I6IGluaGVyaXQ7XFxufVxcbmEge1xcbiAgICBjb2xvcjogdW5zZXQ7XFxufVxcbmEsXFxuYTpob3ZlciB7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG59XFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbmEsXFxudGV4dGFyZWEge1xcbiAgICBvdXRsaW5lOiBub25lO1xcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxuICAgIGZvbnQ6IGluaGVyaXQ7XFxuICAgICY6Zm9jdXMge1xcbiAgICAgICAgb3V0bGluZTogbm9uZTtcXG4gICAgfVxcbiAgICAmOmFjdGl2ZSB7XFxuICAgICAgICBvdXRsaW5lOiBub25lO1xcbiAgICB9XFxufVxcblxcbmgxLFxcbmgyLFxcbmgzLFxcbmg0LFxcbmg1LFxcbmg2IHtcXG4gICAgZm9udDogaW5oZXJpdDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbn1cXG5wIHtcXG4gICAgbWFyZ2luLXRvcDogMDtcXG4gICAgbWFyZ2luLWJvdHRvbTogMDtcXG59XFxuXFxuaW1nIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGhlaWdodDogYXV0bztcXG4gICAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbmJ1dHRvbiB7XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgY29sb3I6IGluaGVyaXQ7XFxuICAgIGZvbnQ6IGluaGVyaXQ7XFxuICAgIHRleHQtYWxpZ246IGluaGVyaXQ7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG51bCB7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIG1hcmdpbjogMDtcXG59XFxuXFxudWwgbGkge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XFxufVxcblxcbi5jb250YWluZXIge1xcbiAgICB3aWR0aDogMTc2cmVtO1xcbiAgICBtYXJnaW46IDAgYXV0bztcXG59XFxuXFxuc2VjdGlvbiB7XFxuICAgIG1hcmdpbi1ib3R0b206IDE5cmVtO1xcbiAgICBcXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgIG1hcmdpbi1ib3R0b206IDIwcmVtO1xcbiAgICB9XFxufVxcblxcbmlucHV0W3R5cGU9J251bWJlciddOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcbmlucHV0W3R5cGU9J251bWJlciddOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbiAgICBtYXJnaW46IDA7XFxufVxcblxcbmlucHV0W3R5cGU9J251bWJlciddIHtcXG4gICAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XFxufVxcblxcbnN2ZyxcXG5pbWcge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiBhdXRvO1xcbiAgICBvYmplY3QtZml0OiBjb250YWluO1xcbn1cXG5cXG5AbWVkaWEgKG1pbi13aWR0aDogMTkyMHB4KSB7XFxuICAgIGh0bWwge1xcbiAgICAgICAgZm9udC1zaXplOiAxMHB4O1xcbiAgICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgIGh0bWwge1xcbiAgICAgICAgZm9udC1zaXplOiA1cHg7XFxuICAgICAgICBmb250LXNpemU6IDEuNTYyNXZ3O1xcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKCgxMDAgLyAzNzUpICogNXZ3KTsgLy8g0LPQtNC1IDM3NSDRjdGC0L4g0YjQuNGA0LjQvdCwINC80L7QsSDQstC10YDRgdC40Lgg0LzQsNC60LXRgtCwXFxuICAgICAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxuICAgIH1cXG5cXG4gICAgYm9keSB7XFxuICAgICAgICBmb250LXNpemU6IDIuOHJlbTtcXG4gICAgICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcXG4gICAgfVxcblxcbiAgICAuY29udGFpbmVyIHtcXG4gICAgICAgIHBhZGRpbmc6IDAgMi40cmVtOyAvLyDQsiDQvNC+0LEg0LLQtdGA0YHQuNC4INC+0YLRgdGC0YPQvyDQvtGCINC60YDQsNGPINC30LDQtNCw0LXQvCDQtNC70Y8g0LLRgdC10YUg0LrQvtC90YLQtdC50L3QtdGA0L7Qsiwg0LAg0YLQsNC8INCz0LTQtSDQvdC1INC90YPQttC90L4g0LzQvtC20LXQvCDRgtC+0YfQtdGH0L3QviDRg9Cx0YDQsNGC0YxcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICB9XFxufVxcblwiLFwiLmgge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJCYWhuc2NocmlmdFxcXCI7XFxuICBsaW5lLWhlaWdodDogMTIwJTtcXG5cXG4gICZfaDEge1xcbiAgICBmb250LXNpemU6IDdyZW07XFxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgZm9udC1zaXplOiA1LjZyZW07XFxuICAgIH1cXG4gIH1cXG5cXG4gICZfaDIge1xcbiAgICBmb250LXNpemU6IDZyZW07XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgZm9udC1zaXplOiA1LjZyZW07XFxuICAgIH1cXG4gIH1cXG5cXG4gICZfaDMge1xcbiAgICBmb250LXNpemU6IDMuMnJlbTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBmb250LXNpemU6IDQuNHJlbTtcXG4gICAgICBsaW5lLWhlaWdodDogMTtcXG4gICAgfVxcbiAgfVxcblxcbiAgJl9oNCB7XFxuICAgIGZvbnQtc2l6ZTogMi40cmVtO1xcblxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgIGZvbnQtc2l6ZTogNC40cmVtO1xcbiAgICAgIGxpbmUtaGVpZ2h0OiAxO1xcbiAgICB9XFxuICB9XFxufVxcblxcbi50eHQyNCB7XFxuICBmb250LXNpemU6IDIuNHJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAzLjNyZW07XFxuXFxuICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICBmb250LXNpemU6IDRyZW07XFxuICB9XFxufVxcblxcbi50eHQyMiB7XFxuICBmb250LXNpemU6IDIuMnJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAyLjZyZW07XFxuXFxuICAmX3NiIHtcXG4gICAgZm9udC1mYW1pbHk6IFxcXCJCYWhuc2NocmlmdFxcXCI7XFxuICB9XFxuXFxuICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICBmb250LXNpemU6IDMuNnJlbTtcXG4gIH1cXG59XFxuXCIsXCIuYnRuIHtcXG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6ICR3aGl0ZTtcXG5cXG4gICZfcHJpbWFyeSB7XFxuICAgIHBhZGRpbmc6IDEuNHJlbSAyLjhyZW07XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYmx1ZTtcXG4gICAgY2xpcC1wYXRoOiBwb2x5Z29uKFxcbiAgICAgIDAgMCxcXG4gICAgICA5MiUgMCxcXG4gICAgICAxMDAlIDIyJSxcXG4gICAgICAxMDAlIDgwJSxcXG4gICAgICAxMDAlIDEwMCUsXFxuICAgICAgMCAxMDAlLFxcbiAgICAgIDAlIDgwJSxcXG4gICAgICAwJSAyMCVcXG4gICAgKTtcXG4gICAgdHJhbnNpdGlvbjogY2xpcC1wYXRoIDAuM3MgZWFzZTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBwYWRkaW5nOiAyLjhyZW0gNS42cmVtO1xcbiAgICB9XFxuXFxuICAgIC5idG5fX3R4dCB7XFxuICAgICAgbGluZS1oZWlnaHQ6IDIuNnJlbTtcXG5cXG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgbGluZS1oZWlnaHQ6IDQuMnJlbTtcXG4gICAgICB9XFxuICAgIH1cXG5cXG4gICAgJjpkaXNhYmxlZCB7XFxuICAgICAgY29sb3I6ICM4NjkxOWE7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGdyYXk7XFxuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxuICAgIH1cXG5cXG4gICAgJl93aGl0ZSB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHdoaXRlO1xcblxcbiAgICAgIC5idG5fX3R4dCB7XFxuICAgICAgICBjb2xvcjogJGJsdWU7XFxuICAgICAgfVxcbiAgICB9XFxuXFxuICAgIEBtZWRpYSAoYW55LWhvdmVyOiBob3Zlcikge1xcbiAgICAgICY6aG92ZXIge1xcbiAgICAgICAgY2xpcC1wYXRoOiBwb2x5Z29uKFxcbiAgICAgICAgICAwIDAsXFxuICAgICAgICAgIDEwMCUgMCxcXG4gICAgICAgICAgMTAwJSAwLFxcbiAgICAgICAgICAxMDAlIDgwJSxcXG4gICAgICAgICAgMTAwJSAxMDAlLFxcbiAgICAgICAgICAwIDEwMCUsXFxuICAgICAgICAgIDAlIDgwJSxcXG4gICAgICAgICAgMCUgMjAlXFxuICAgICAgICApO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcblxcbiAgJl9zZWNvbmRhcnkge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFxuICAgICY6OmFmdGVyIHtcXG4gICAgICBjb250ZW50OiBcXFwiXFxcIjtcXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgYm90dG9tOiAtMC4zcmVtO1xcbiAgICAgIGxlZnQ6IDA7XFxuICAgICAgd2lkdGg6IDEwMCU7XFxuICAgICAgaGVpZ2h0OiAxcHg7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHdoaXRlO1xcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XFxuICAgICAgdHJhbnNmb3JtLW9yaWdpbjogbGVmdDtcXG4gICAgfVxcblxcbiAgICAuYnRuX190eHQge1xcbiAgICAgIGxpbmUtaGVpZ2h0OiAyLjRyZW07XFxuICAgIH1cXG5cXG4gICAgQG1lZGlhIChhbnktaG92ZXI6IGhvdmVyKSB7XFxuICAgICAgJjpob3ZlciB7XFxuICAgICAgICAmOjphZnRlciB7XFxuICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGVYKDAuMDUpO1xcbiAgICAgICAgfVxcbiAgICAgIH1cXG4gICAgfVxcblxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgIC5idG5fX3R4dCB7XFxuICAgICAgICBsaW5lLWhlaWdodDogNC44cmVtO1xcbiAgICAgIH1cXG4gICAgfVxcblxcbiAgICAmX2JsdWUge1xcbiAgICAgIGNvbG9yOiAkYmx1ZTtcXG5cXG4gICAgICAmOjphZnRlciB7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYmx1ZTtcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuLmFycm93LWJ0biB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGZsZXg6IDAgMCA0LjJyZW07XFxuICB3aWR0aDogNC4ycmVtO1xcbiAgaGVpZ2h0OiA0LjJyZW07XFxuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuXFxuICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICBmbGV4OiAwIDAgMTByZW07XFxuICAgIHdpZHRoOiAxMHJlbTtcXG4gICAgaGVpZ2h0OiAxMHJlbTtcXG4gIH1cXG5cXG4gICY6OmJlZm9yZSxcXG4gICY6OmFmdGVyIHtcXG4gICAgY29udGVudDogXFxcIlxcXCI7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiA1MCU7XFxuICAgIGxlZnQ6IDUwJTtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgJHdoaXRlO1xcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgfVxcblxcbiAgJjo6YmVmb3JlIHtcXG4gICAgd2lkdGg6IDMuOHJlbTtcXG4gICAgaGVpZ2h0OiAzLjhyZW07XFxuICAgIG9wYWNpdHk6IDAuNDtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICB3aWR0aDogOXJlbTtcXG4gICAgICBoZWlnaHQ6IDlyZW07XFxuICAgIH1cXG4gIH1cXG5cXG4gICY6OmFmdGVyIHtcXG4gICAgd2lkdGg6IDMuNHJlbTtcXG4gICAgaGVpZ2h0OiAzLjRyZW07XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgd2lkdGg6IDhyZW07XFxuICAgICAgaGVpZ2h0OiA4cmVtO1xcbiAgICB9XFxuICB9XFxuXFxuICBzdmcge1xcbiAgICB3aWR0aDogMS41cmVtO1xcbiAgICBoZWlnaHQ6IDEuNXJlbTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICB3aWR0aDogMy4ycmVtO1xcbiAgICAgIGhlaWdodDogMy4ycmVtO1xcbiAgICB9XFxuICB9XFxuXFxuICAmX2JsdWUge1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDcxLCAxMjgsIDAuMSk7XFxuXFxuICAgICY6OmJlZm9yZSxcXG4gICAgJjo6YWZ0ZXIge1xcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkICRibHVlO1xcbiAgICB9XFxuXFxuICAgIHN2ZyB7XFxuICAgICAgZmlsbDogJGJsdWU7XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXCJpbnB1dFt0eXBlPVxcXCJ0ZXh0XFxcIl0sXFxuaW5wdXRbdHlwZT1cXFwiZW1haWxcXFwiXSxcXG5pbnB1dFt0eXBlPVxcXCJ0ZWxcXFwiXSxcXG50ZXh0YXJlYSB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxuICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7XFxuICBhcHBlYXJhbmNlOiBub25lO1xcbn1cXG50ZXh0YXJlYTpmb2N1cyxcXG5pbnB1dDpmb2N1cyB7XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG5cXG4uaW5wdXQge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcblxcbiAgJl9maWxlIHtcXG4gICAgLmlucHV0IHtcXG4gICAgICAmX19maWVsZCB7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICB6LWluZGV4OiAyO1xcbiAgICAgICAgdG9wOiAwO1xcbiAgICAgICAgbGVmdDogMDtcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xcbiAgICAgICAgb3BhY2l0eTogMDtcXG4gICAgICB9XFxuXFxuICAgICAgJl9fcGxhY2Vob2xkZXIge1xcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XFxuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICAgICAgY29sdW1uLWdhcDogMS4ycmVtO1xcbiAgICAgICAgbGluZS1oZWlnaHQ6IDIuNnJlbTtcXG5cXG4gICAgICAgICY6OmFmdGVyIHtcXG4gICAgICAgICAgY29udGVudDogXFxcIlxcXCI7XFxuICAgICAgICAgIGZsZXg6IDAgMCAyLjRyZW07XFxuICAgICAgICAgIHdpZHRoOiAyLjRyZW07XFxuICAgICAgICAgIGhlaWdodDogMi40cmVtO1xcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB1cmwoXFxcIi4vYXNzZXRzL2ltYWdlcy9pY29ucy9jbGlwLnN2Z1xcXCIpIGNlbnRlciAvIGNvbnRhaW5cXG4gICAgICAgICAgICBuby1yZXBlYXQ7XFxuICAgICAgICB9XFxuXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgICBjb2x1bW4tZ2FwOiAzcmVtO1xcbiAgICAgICAgICBsaW5lLWhlaWdodDogNC4xcmVtO1xcblxcbiAgICAgICAgICAmOjphZnRlciB7XFxuICAgICAgICAgICAgZmxleDogMCAwIDQuOHJlbTtcXG4gICAgICAgICAgICB3aWR0aDogNC44cmVtO1xcbiAgICAgICAgICAgIGhlaWdodDogNC44cmVtO1xcbiAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuXFxuICAmOm5vdCgmX2ZpbGUpIHtcXG4gICAgLmlucHV0X19maWVsZCB7XFxuICAgICAgcGFkZGluZy1ib3R0b206IDEuNnJlbTtcXG4gICAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBsaW5lLWhlaWdodDogMTtcXG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJGxpZ2h0Qmx1ZTtcXG4gICAgICB0cmFuc2l0aW9uOlxcbiAgICAgICAgY29sb3IgMC4zcyBlYXNlLFxcbiAgICAgICAgYm9yZGVyLWJvdHRvbSAwLjNzIGVhc2U7XFxuXFxuICAgICAgJjo6cGxhY2Vob2xkZXIge1xcbiAgICAgICAgY29sb3I6ICM0ZDVmNmU7XFxuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIGVhc2U7XFxuICAgICAgfVxcbiAgICB9XFxuXFxuICAgICYuX2lzLWZpbGxlZCB7XFxuICAgICAgLmlucHV0X19maWVsZCB7XFxuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJGJsYWNrO1xcbiAgICAgICAgY29sb3I6ICRibGFjaztcXG4gICAgICB9XFxuICAgIH1cXG5cXG4gICAgJi5faGFzLWVycm9yIHtcXG4gICAgICAmOjphZnRlciB7XFxuICAgICAgICBjb250ZW50OiBhdHRyKGRhdGEtaGludCk7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICBib3R0b206IC0wLjRyZW07XFxuICAgICAgICBsZWZ0OiAwO1xcbiAgICAgICAgZm9udC1zaXplOiAxLjRyZW07XFxuICAgICAgICBjb2xvcjogJHJlZDtcXG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMTAwJSk7XFxuXFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgICBib3R0b206IC0wLjhyZW07XFxuICAgICAgICAgIGZvbnQtc2l6ZTogMnJlbTtcXG4gICAgICAgIH1cXG4gICAgICB9XFxuICAgICAgLmlucHV0X19maWVsZCB7XFxuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgJHJlZDtcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG4gIC8vXFxuICAvLyAgLy8gLmlucHV0X19sYWJlbFxcbiAgLy9cXG4gIC8vICAmX19sYWJlbCB7XFxuICAvLyAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAvLyAgICBkaXNwbGF5OiBmbGV4O1xcbiAgLy8gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIC8vICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIC8vICAgIGNvbHVtbi1nYXA6IDNyZW07XFxuICAvLyAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgLy8gIH1cXG4gIC8vXFxuICAvLyAgJi5faGFzLWZvY3VzIHtcXG4gIC8vICAgIC5pbnB1dF9fZmllbGQge1xcbiAgLy8gICAgICBib3JkZXI6IDFweCBzb2xpZCAkYmxhY2s7XFxuICAvLyAgICB9XFxuICAvLyAgfVxcbiAgLy8gICYuX2hhcy1lcnJvciB7XFxuICAvLyAgICAuaW5wdXRfX2xhYmVsIHtcXG4gIC8vICAgICAgY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgLy8gICAgICAmOjphZnRlciB7XFxuICAvLyAgICAgICAgY29udGVudDogYXR0cihkYXRhLWhpbnQpO1xcbiAgLy8gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIC8vICAgICAgICB0b3A6IDA7XFxuICAvLyAgICAgICAgbGVmdDogMDtcXG4gIC8vICAgICAgICBjb2xvcjogJHJlZDtcXG4gIC8vICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgLy8gICAgICB9XFxuICAvLyAgICB9XFxuICAvLyAgICAuaW5wdXRfX2ZpZWxkIHtcXG4gIC8vICAgICAgYm9yZGVyOiAxcHggc29saWQgJHJlZDtcXG4gIC8vICAgICAgY29sb3I6ICRyZWQ7XFxuICAvLyAgICAgICY6OnBsYWNlaG9sZGVyIHtcXG4gIC8vICAgICAgICBjb2xvcjogJHJlZDtcXG4gIC8vICAgICAgfVxcbiAgLy8gICAgfVxcbiAgLy8gIH1cXG59XFxuXFxuLm9wdGlvbiB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuXFxuICAmX19pbnB1dCB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGhlaWdodDogMTAwJTtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgYXBwZWFyYW5jZTogbm9uZTtcXG5cXG4gICAgJjpjaGVja2VkICsgLm9wdGlvbl9fdHh0OjphZnRlciB7XFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgfVxcbiAgfVxcblxcbiAgJl9fdHh0IHtcXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgY29sdW1uLWdhcDogMC44cmVtO1xcblxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcXG4gICAgfVxcblxcbiAgICAmOjpiZWZvcmUsXFxuICAgICY6OmFmdGVyIHtcXG4gICAgICBjb250ZW50OiBcXFwiXFxcIjtcXG4gICAgICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICAgIH1cXG5cXG4gICAgJjo6YmVmb3JlIHtcXG4gICAgICBmbGV4OiAwIDAgMi40cmVtO1xcbiAgICAgIHdpZHRoOiAyLjRyZW07XFxuICAgICAgaGVpZ2h0OiAyLjRyZW07XFxuICAgICAgYm9yZGVyOiAxLjVweCBzb2xpZCAkYmx1ZTtcXG5cXG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgZmxleDogMCAwIDQuOHJlbTtcXG4gICAgICAgIHdpZHRoOiA0LjhyZW07XFxuICAgICAgICBoZWlnaHQ6IDQuOHJlbTtcXG4gICAgICB9XFxuICAgIH1cXG5cXG4gICAgJjo6YWZ0ZXIge1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICBsZWZ0OiAwLjRyZW07XFxuICAgICAgdG9wOiAwLjRyZW07XFxuICAgICAgd2lkdGg6IDEuNnJlbTtcXG4gICAgICBoZWlnaHQ6IDEuNnJlbTtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYmx1ZTtcXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XFxuXFxuICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICAgIHRvcDogMC44cmVtO1xcbiAgICAgICAgbGVmdDogMC44cmVtO1xcbiAgICAgICAgd2lkdGg6IDMuMnJlbTtcXG4gICAgICAgIGhlaWdodDogMy4ycmVtO1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cXG4uY2hlY2tib3gge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XFxuXFxuICAmX19pbnB1dCB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgei1pbmRleDogMjtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGhlaWdodDogMTAwJTtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgYXBwZWFyYW5jZTogbm9uZTtcXG5cXG4gICAgJjpjaGVja2VkICsgLmNoZWNrYm94X190eHQge1xcbiAgICAgICY6OmJlZm9yZSB7XFxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAkYmx1ZTtcXG4gICAgICB9XFxuICAgICAgJjo6YWZ0ZXIge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG5cXG4gICZfX3R4dCB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGNvbHVtbi1nYXA6IDAuOHJlbTtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcblxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgIGNvbHVtbi1nYXA6IDEuNnJlbTtcXG4gICAgfVxcblxcbiAgICAmOjpiZWZvcmUge1xcbiAgICAgIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgICAgIGZsZXg6IDAgMCAyLjJyZW07XFxuICAgICAgd2lkdGg6IDIuMnJlbTtcXG4gICAgICBoZWlnaHQ6IDIuMnJlbTtcXG4gICAgICBib3JkZXI6IDFweCBzb2xpZCAkbGlnaHRCbHVlO1xcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICR3aGl0ZTtcXG4gICAgICB0cmFuc2l0aW9uOiBib3JkZXIgMC4zcyBlYXNlO1xcblxcbiAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgICBmbGV4OiAwIDAgNC40cmVtO1xcbiAgICAgICAgd2lkdGg6IDQuNHJlbTtcXG4gICAgICAgIGhlaWdodDogNC40cmVtO1xcbiAgICAgIH1cXG4gICAgfVxcblxcbiAgICAmOjphZnRlciB7XFxuICAgICAgY29udGVudDogXFxcIlxcXCI7XFxuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICAgIHRvcDogMC4zcmVtO1xcbiAgICAgIGxlZnQ6IDAuM3JlbTtcXG4gICAgICB3aWR0aDogMS42cmVtO1xcbiAgICAgIGhlaWdodDogMS42cmVtO1xcbiAgICAgIGJhY2tncm91bmQtY29sb3I6ICRibHVlO1xcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZTtcXG5cXG4gICAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgICAgbGVmdDogMC42cmVtO1xcbiAgICAgICAgdG9wOiAwLjZyZW07XFxuICAgICAgICB3aWR0aDogMy4ycmVtO1xcbiAgICAgICAgaGVpZ2h0OiAzLjJyZW07XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFwiLmJyZWFkY3J1bWJzIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgY29sdW1uLWdhcDogMS4ycmVtO1xcblxcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgY29sdW1uLWdhcDogMS42cmVtO1xcbiAgICBmb250LXNpemU6IDMuMnJlbTtcXG4gIH1cXG5cXG4gICZfX2xpbmsge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBjb2x1bW4tZ2FwOiAxLjJyZW07XFxuXFxuICAgICY6OmFmdGVyIHtcXG4gICAgICBjb250ZW50OiBcXFwiXFxcIjtcXG4gICAgICB3aWR0aDogMnJlbTtcXG4gICAgICBoZWlnaHQ6IDAuMnJlbTtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjODA4ZDk3O1xcbiAgICB9XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgY29sdW1uLWdhcDogMS42cmVtO1xcblxcbiAgICAgICY6OmFmdGVyIHtcXG4gICAgICAgIHdpZHRoOiAzLjJyZW07XFxuICAgICAgICBoZWlnaHQ6IDFweDtcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG5cXG4gICZfX3R4dCB7XFxuICAgIGNvbG9yOiAkYmx1ZTtcXG4gIH1cXG59XFxuXCIsXCIudGFicyB7XFxuICAmX19uYXZpZ2F0aW9uIHtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgY29sdW1uLWdhcDogMS41cmVtO1xcbiAgfVxcbiAgJl9fYm9keSB7XFxuICAgIHBhZGRpbmctdG9wOiAxcmVtO1xcbiAgfVxcbn1cXG5cXG4udGFiIHtcXG4gIHBhZGRpbmc6IDAgMi44cmVtO1xcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgaGVpZ2h0OiAxMHJlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICRncmF5O1xcbiAgdHJhbnNpdGlvbjpcXG4gICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIGVhc2UsXFxuICAgIGNvbG9yIDAuM3MgZWFzZTtcXG5cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgIHBhZGRpbmc6IDAgMi40cmVtO1xcbiAgICBoZWlnaHQ6IDExLjJyZW07XFxuICB9XFxuXFxuICBzdmcge1xcbiAgICBmbGV4OiAwIDAgMi40cmVtO1xcbiAgICB3aWR0aDogMi40cmVtO1xcbiAgICBoZWlnaHQ6IDIuNHJlbTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMC4zcmVtLCAtMC4zcmVtKTtcXG4gICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIGVhc2U7XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgZmxleDogMCAwIDMuMnJlbTtcXG4gICAgICB3aWR0aDogMy4ycmVtO1xcbiAgICAgIGhlaWdodDogMy4ycmVtO1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDAuNnJlbSwgLTAuNnJlbSk7XFxuICAgIH1cXG4gIH1cXG5cXG4gICZfX251bSB7XFxuICAgIG1hcmdpbi1yaWdodDogMC44cmVtO1xcblxcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgICAgIG1hcmdpbi1yaWdodDogMS42cmVtO1xcbiAgICB9XFxuICB9XFxuXFxuICAmX190eHQge1xcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICB9XFxuXFxuICAmLl9pcy1hY3RpdmUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYmx1ZTtcXG4gICAgY29sb3I6ICR3aGl0ZTtcXG5cXG4gICAgc3ZnIHtcXG4gICAgICBmaWxsOiAkd2hpdGU7XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsbnVsbF0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1syXS51c2VbMV0hLi4vLi4vbm9kZV9tb2R1bGVzL2dyb3VwLWNzcy1tZWRpYS1xdWVyaWVzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzJdLnVzZVsxXSEuLi8uLi9ub2RlX21vZHVsZXMvZ3JvdXAtY3NzLW1lZGlhLXF1ZXJpZXMtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5zY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuLi9zY3NzL3N0eWxlLnNjc3NcIjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB1dGlscyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSBcIi4vdXRpbHMvdXRpbHMuanNcIjtcblxuLy8gaGFtYnVyZ2VyIG1lbnVcbnV0aWxzLm1lbnVJbml0KCk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gY29tcG9uZW50cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIGZvcm1zXG5pbXBvcnQgXCIuL3V0aWxzL2Zvcm1zXCI7XG5cbi8vIHRhYnNcbmltcG9ydCBcIi4vdXRpbHMvdGFicy5qc1wiO1xuXG4vLyBhY2NvcmRpb25cbi8vIGltcG9ydCBcIi4vdXRpbHMvYWNjb3JkaW9uLmpzXCI7XG5cbi8vIHNlbGVjdFxuLy8gaW1wb3J0IFwiLi91dGlscy9zZWxlY3QuanNcIjtcblxuLy8gbW9kYWxzXG5pbXBvcnQgXCIuL3V0aWxzL21vZGFscy5qc1wiO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5pbXBvcnQgXCIuL2Rldi92em1zazEuanNcIjtcbmltcG9ydCBcIi4vZGV2L21hcmt1c0RNLmpzXCI7XG5pbXBvcnQgXCIuL2Rldi91a2lrMC5qc1wiO1xuIl0sIm5hbWVzIjpbIm1vZHVsZXMiLCJWYWxpZGF0aW9uIiwiY29uc3RydWN0b3IiLCJhdHRycyIsIlJFUVVJUkVEIiwiSUdOT1JFX1ZBTElEQVRJT04iLCJBSkFYIiwiREVWIiwiSUdOT1JFX0ZPQ1VTIiwiU0hPV19QTEFDRUhPTERFUiIsIlZBTElEQVRFIiwiY2xhc3NlcyIsIkhBU19FUlJPUiIsIkhBU19GT0NVUyIsIklTX0ZJTExFRCIsIklTX1JFVkVBTEVEIiwiZ2V0RXJyb3JzIiwiZm9ybSIsImVyciIsInJlcXVpcmVkRmllbGRzIiwicXVlcnlTZWxlY3RvckFsbCIsImxlbmd0aCIsImZvckVhY2giLCJyZXF1aXJlZEZpZWxkIiwib2Zmc2V0UGFyZW50IiwidGFnTmFtZSIsImRpc2FibGVkIiwidmFsaWRhdGVGaWVsZCIsImFkZEVycm9yIiwiY2xhc3NMaXN0IiwiYWRkIiwicGFyZW50RWxlbWVudCIsInJlbW92ZSIsInJlbW92ZUVycm9yIiwiZGF0YXNldCIsInJlcXVpcmVkIiwidmFsdWUiLCJyZXBsYWNlIiwidGVzdEVtYWlsIiwidHlwZSIsImNoZWNrZWQiLCJ0cmltIiwiY2xlYXJGaWVsZHMiLCJyZXNldCIsInNldFRpbWVvdXQiLCJpbnB1dHMiLCJjaGVja2JveGVzIiwiaW5kZXgiLCJpbnB1dCIsImNoZWNrYm94IiwidGVzdCIsIkZvcm1TdWJtaXRpb24iLCJzaG91bGRWYWxpZGF0ZSIsImZvcm1zIiwiZG9jdW1lbnQiLCJpbml0Iiwic2VuZEZvcm0iLCJyZXNwb25zZVJlc3VsdCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsInBvcHVwIiwibW9kYWwiLCJtb2RhbE1lc3NhZ2UiLCJvcGVuIiwiY29uc29sZSIsImxvZyIsImhhbmRsZVN1Ym1pdGlvbiIsImUiLCJoYXNBdHRyaWJ1dGUiLCJhamF4IiwicHJldmVudERlZmF1bHQiLCJhY3Rpb24iLCJnZXRBdHRyaWJ1dGUiLCJtZXRob2QiLCJkYXRhIiwiRm9ybURhdGEiLCJyZXNwb25zZSIsImZldGNoIiwiYm9keSIsIm9rIiwicmVzdWx0IiwianNvbiIsImFsZXJ0IiwiX3RoaXMiLCJwYXNzd29yZEZpZWxkcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0YXJnZXQiLCJmaWVsZCIsImJ0biIsIm5leHRFbGVtZW50U2libGluZyIsImNvbnRhaW5zIiwic2V0QXR0cmlidXRlIiwidG9nZ2xlIiwiRm9ybUZpZWxkcyIsImZpZWxkcyIsInNhdmVQbGFjZWhvbGRlciIsInBsYWNlaG9sZGVyIiwiaGFuZGxlRm9jdXNpbiIsImNsb3Nlc3QiLCJoYW5kbGVGb2N1c291dCIsImJpbmQiLCJib2R5TG9ja1N0YXR1cyIsImJvZHlMb2NrIiwiYm9keVVubG9jayIsIk1vZGFsIiwib3B0aW9ucyIsImNvbmZpZyIsImxvZ2dpbmciLCJhdHRyaWJ1dGVPcGVuQnV0dG9uIiwiYXR0cmlidXRlQ2xvc2VCdXR0b24iLCJmaXhFbGVtZW50U2VsZWN0b3IiLCJ5b3V0dWJlQXR0cmlidXRlIiwieW91dHViZVBsYWNlQXR0cmlidXRlIiwic2V0QXV0b3BsYXlZb3V0dWJlIiwibW9kYWxDb250ZW50IiwibW9kYWxBY3RpdmUiLCJib2R5QWN0aXZlIiwiZm9jdXNDYXRjaCIsImNsb3NlRXNjIiwiaGFzaFNldHRpbmdzIiwibG9jYXRpb24iLCJnb0hhc2giLCJvbiIsImJlZm9yZU9wZW4iLCJhZnRlck9wZW4iLCJiZWZvcmVDbG9zZSIsImFmdGVyQ2xvc2UiLCJ5b3VUdWJlQ29kZSIsImlzT3BlbiIsInRhcmdldE9wZW4iLCJzZWxlY3RvciIsImVsZW1lbnQiLCJwcmV2aW91c09wZW4iLCJsYXN0Q2xvc2VkIiwiX2RhdGFWYWx1ZSIsImhhc2giLCJfcmVvcGVuIiwiX3NlbGVjdG9yT3BlbiIsImxhc3RGb2N1c0VsIiwiX2ZvY3VzRWwiLCJpbml0bW9kYWxzIiwiZXZlbnRzbW9kYWwiLCJidXR0b25PcGVuIiwiYnV0dG9uQ2xvc2UiLCJjbG9zZSIsIndoaWNoIiwiY29kZSIsIl9mb2N1c0NhdGNoIiwid2luZG93IiwiX29wZW5Ub0hhc2giLCJzZWxlY3RvclZhbHVlIiwiZG9jdW1lbnRFbGVtZW50IiwicHJldmlvdXNBY3RpdmVFbGVtZW50IiwiYWN0aXZlRWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjb2RlVmlkZW8iLCJ1cmxWaWRlbyIsImlmcmFtZSIsImNyZWF0ZUVsZW1lbnQiLCJhdXRvcGxheSIsInlvdXR1YmVQbGFjZSIsImFwcGVuZENoaWxkIiwiX2dldEhhc2giLCJfc2V0SGFzaCIsIm0iLCJpbm5lcldpZHRoIiwiX2ZvY3VzVHJhcCIsImlubmVySFRNTCIsIl9yZW1vdmVIYXNoIiwiaW5jbHVkZXMiLCJjbGFzc0luSGFzaCIsImJ1dHRvbnMiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiaHJlZiIsInNwbGl0IiwiZm9jdXNhYmxlIiwiZm9jdXNBcnJheSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiZm9jdXNlZEluZGV4IiwiaW5kZXhPZiIsInNoaWZ0S2V5IiwiZm9jdXMiLCJzZXRIYXNoIiwiZ2V0SGFzaCIsIlRhYnMiLCJUQUJTIiwiSU5ERVgiLCJUSVRMRVMiLCJUSVRMRSIsIlRBQl9JVEVNIiwiQk9EWSIsIkhBU0giLCJJTklUIiwiQUNUSVZFIiwiTU9EQUwiLCJ0YWJzIiwiYWN0aXZlSGFzaCIsInN0YXJ0c1dpdGgiLCJ0YWJzQmxvY2siLCJzZXRBY3Rpb25zIiwic2V0U3RhdHVzIiwidGl0bGVzIiwiY29udGVudCIsInRhYnNJbmRleCIsImhhc0hhc2giLCJmcm9tIiwiZmlsdGVyIiwiaXRlbSIsImluZHgiLCJoaWRkZW4iLCJ0aXRsZSIsImFjdGl2ZVRpdGxlIiwiYWN0aXZlSGFzaEJsb2NrIiwibWVudUluaXQiLCJtZW51T3BlbiIsIm1lbnVDbG9zZSIsImJvZHlMb2NrVG9nZ2xlIiwiZGVsYXkiLCJ1bmlxdWVBcnJheSIsImFycmF5Iiwic2VsZiIsImRhdGFNZWRpYVF1ZXJpZXMiLCJkYXRhU2V0VmFsdWUiLCJtZWRpYSIsImJyZWFrcG9pbnRzQXJyYXkiLCJwYXJhbXMiLCJicmVha3BvaW50IiwicGFyYW1zQXJyYXkiLCJwdXNoIiwibWRRdWVyaWVzIiwibWFwIiwibWRRdWVyaWVzQXJyYXkiLCJtZWRpYUJyZWFrcG9pbnQiLCJtZWRpYVR5cGUiLCJtYXRjaE1lZGlhIiwiaXRlbXNBcnJheSIsIl9zbGlkZVVwIiwiZHVyYXRpb24iLCJzaG93bW9yZSIsInN0eWxlIiwidHJhbnNpdGlvblByb3BlcnR5IiwidHJhbnNpdGlvbkR1cmF0aW9uIiwiaGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0Iiwib3ZlcmZsb3ciLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsInJlbW92ZVByb3BlcnR5IiwiX3NsaWRlRG93biIsIl9zbGlkZVRvZ2dsZSIsInJlbVRvUHgiLCJyZW1WYWx1ZSIsImh0bWxGb250U2l6ZSIsInBhcnNlRmxvYXQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZm9udFNpemUiLCJweFZhbHVlIiwiTWF0aCIsInJvdW5kIiwicmVtb3ZlQ2xhc3NlcyIsImNsYXNzTmFtZSIsImkiLCJ1dGlscyJdLCJzb3VyY2VSb290IjoiIn0=