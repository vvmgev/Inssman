/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/models/formField.ts":
/*!*********************************!*\
  !*** ./src/models/formField.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormType": () => (/* binding */ FormType),
/* harmony export */   "FormTypeMap": () => (/* binding */ FormTypeMap),
/* harmony export */   "MatchType": () => (/* binding */ MatchType)
/* harmony export */ });
var RuleActionType = chrome.declarativeNetRequest.RuleActionType;
var FormType;

(function (FormType) {
  FormType["REDIRECT"] = "Redirect Request";
  FormType["BLOCK"] = "Block Request";
  FormType["REPLACE"] = "Replace Reuqest";
  FormType["MODIFYHEADER"] = "Modify Request Header";
  FormType["INSERTSCRIPT"] = "Insert Script";
  FormType["MODIFYRESPONSE"] = "Modify Response";
  FormType["DELAY"] = "Delay Request";
  FormType["QUERYPARAM"] = "Query Param";
})(FormType || (FormType = {}));

var FormTypeMap = {
  REDIRECT: RuleActionType.REDIRECT,
  BLOCK: RuleActionType.BLOCK,
  MODIFYRESPONSE: RuleActionType.REDIRECT
};
var MatchType;

(function (MatchType) {
  MatchType["CONTAIN"] = "Contain";
  MatchType["EQUAL"] = "Equl";
  MatchType["REGEXP"] = "Regexp";
  MatchType["WILDCARD"] = "Wildcard";
})(MatchType || (MatchType = {}));

/***/ }),

/***/ "./src/models/postMessageAction.ts":
/*!*****************************************!*\
  !*** ./src/models/postMessageAction.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PostMessageAction": () => (/* binding */ PostMessageAction)
/* harmony export */ });
var PostMessageAction;

(function (PostMessageAction) {
  PostMessageAction[PostMessageAction["AddRule"] = 0] = "AddRule";
  PostMessageAction[PostMessageAction["UpdateRule"] = 1] = "UpdateRule";
  PostMessageAction[PostMessageAction["DeleteRule"] = 2] = "DeleteRule";
  PostMessageAction[PostMessageAction["GetRules"] = 3] = "GetRules";
  PostMessageAction[PostMessageAction["Log"] = 4] = "Log";
})(PostMessageAction || (PostMessageAction = {}));

/***/ }),

/***/ "./src/services/RuleService.ts":
/*!*************************************!*\
  !*** ./src/services/RuleService.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _models_formField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/formField */ "./src/models/formField.ts");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};



var RuleService = /*#__PURE__*/function () {
  function RuleService() {
    _classCallCheck(this, RuleService);
  }

  _createClass(RuleService, [{
    key: "add",
    value: function add(rules) {
      var qq = rules.map(function (as) {
        return as.id;
      });
      return this.updateDynamicRules({
        addRules: rules,
        removeRuleIds: qq
      });
    }
  }, {
    key: "remove",
    value: function remove(rules) {
      var removeRuleIds = rules.map(function (rule) {
        return rule.id;
      });
      return this.updateDynamicRules({
        removeRuleIds: removeRuleIds
      });
    }
  }, {
    key: "getRuleById",
    value: function getRuleById(id) {
      return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var rules;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.getRules();

              case 2:
                rules = _context.sent;
                return _context.abrupt("return", rules.find(function (rule) {
                  return rule.id === id;
                }));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
    }
  }, {
    key: "updateDynamicRules",
    value: function updateDynamicRules(updateRuleOptions) {
      return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
    }
  }, {
    key: "getRules",
    value: function getRules() {
      return chrome.declarativeNetRequest.getDynamicRules();
    }
  }, {
    key: "generateAction",
    value: function generateAction(formField) {
      return {
        type: _models_formField__WEBPACK_IMPORTED_MODULE_0__.FormTypeMap[formField.type],
        redirect: Object.assign(Object.assign(Object.assign({}, formField.redirectTo && {
          url: formField.redirectTo
        }), formField.extensionPath && {
          extensionPath: formField.extensionPath
        }), formField.regexSubstitution && {
          regexSubstitution: formField.regexSubstitution
        })
      };
    }
  }, {
    key: "generateCondition",
    value: function generateCondition(formField) {
      return Object.assign(Object.assign(Object.assign({}, formField.urlFilter && {
        urlFilter: formField.urlFilter
      }), formField.regexFilter && {
        regexFilter: formField.regexFilter
      }), {
        resourceTypes: ["main_frame", "sub_frame"]
      });
    }
  }, {
    key: "generateRule",
    value: function generateRule(formField) {
      var rule = {
        id: 1,
        priority: 1,
        action: this.generateAction(formField),
        condition: this.generateCondition(formField)
      };
      console.log('rule', rule);
      return rule;
    }
  }]);

  return RuleService;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new RuleService());

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
/******/ 			// no module.id needed
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_RuleService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/RuleService */ "./src/services/RuleService.ts");
/* harmony import */ var _models_postMessageAction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/postMessageAction */ "./src/models/postMessageAction.ts");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



var RuleActionType = chrome.declarativeNetRequest.RuleActionType;
chrome.action.onClicked.addListener(function () {
  return chrome.runtime.openOptionsPage();
});
chrome.runtime.onInstalled.addListener(function () {});
chrome.declarativeNetRequest.getDynamicRules().then(function (data) {
  var qq = data.map(function (as) {
    return as.id;
  }); // chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: qq})
}); // chrome.declarativeNetRequest.updateDynamicRules({
//   addRules: [
//     {
//       "id": 3,
//       "priority": 1,
//       "action": { "type": "block" as any },
//       "condition": {"urlFilter": "https://web-button.staging.getmati.com/button.js", "resourceTypes": ["script" as any]}
//     },
//   ],
//   removeRuleIds: [2,1, 3]
// });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  var _console;

  switch (request.action) {
    case _models_postMessageAction__WEBPACK_IMPORTED_MODULE_1__.PostMessageAction.AddRule:
      _services_RuleService__WEBPACK_IMPORTED_MODULE_0__["default"].add([_services_RuleService__WEBPACK_IMPORTED_MODULE_0__["default"].generateRule(request.data)]).then(sendResponse).catch(function (error) {
        console.log('error', error);
        sendResponse({
          error: error
        });
      });
      return true;
      break;

    case _models_postMessageAction__WEBPACK_IMPORTED_MODULE_1__.PostMessageAction.UpdateRule:
      break;

    case _models_postMessageAction__WEBPACK_IMPORTED_MODULE_1__.PostMessageAction.DeleteRule:
      break;

    case _models_postMessageAction__WEBPACK_IMPORTED_MODULE_1__.PostMessageAction.GetRules:
      _services_RuleService__WEBPACK_IMPORTED_MODULE_0__["default"].getRules().then(sendResponse);
      return true;
      break;

    case _models_postMessageAction__WEBPACK_IMPORTED_MODULE_1__.PostMessageAction.Log:
      (_console = console).log.apply(_console, _toConsumableArray(request.data));

      break;

    default:
      break;
  }
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QU8sQ0FBQ0MsR0FBUixDQUFZLE9BQVosRUFBcUJlLEtBQXJCO1FBQ0FMLFlBQVksQ0FBQztVQUFFSyxLQUFLLEVBQUxBO1FBQUYsQ0FBRCxDQUFaO01BQ0gsQ0FMRDtNQU1BLE9BQU8sSUFBUDtNQUNBOztJQUNKLEtBQUtuRSxtRkFBTDtNQUNJOztJQUNKLEtBQUtBLG1GQUFMO01BQ0k7O0lBQ0osS0FBS0EsaUZBQUw7TUFDSW9CLHNFQUFBLEdBQXVCRixJQUF2QixDQUE0QjRDLFlBQTVCO01BQ0EsT0FBTyxJQUFQO01BQ0E7O0lBQ0osS0FBSzlELDRFQUFMO01BQ0ksWUFBQW1ELE9BQU8sRUFBQ0MsR0FBUixvQ0FBZVEsT0FBTyxDQUFDRixJQUF2Qjs7TUFDQTs7SUFDSjtNQUNJO0VBdEJSO0FBd0JILENBekJELEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vdmVycmlkZXIvLi9zcmMvbW9kZWxzL2Zvcm1GaWVsZC50cyIsIndlYnBhY2s6Ly9vdmVycmlkZXIvLi9zcmMvbW9kZWxzL3Bvc3RNZXNzYWdlQWN0aW9uLnRzIiwid2VicGFjazovL292ZXJyaWRlci8uL3NyYy9zZXJ2aWNlcy9SdWxlU2VydmljZS50cyIsIndlYnBhY2s6Ly9vdmVycmlkZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb3ZlcnJpZGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vdmVycmlkZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vdmVycmlkZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vdmVycmlkZXIvLi9zcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBSdWxlQWN0aW9uVHlwZSA9IGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QuUnVsZUFjdGlvblR5cGU7XG5leHBvcnQgdmFyIEZvcm1UeXBlO1xuKGZ1bmN0aW9uIChGb3JtVHlwZSkge1xuICAgIEZvcm1UeXBlW1wiUkVESVJFQ1RcIl0gPSBcIlJlZGlyZWN0IFJlcXVlc3RcIjtcbiAgICBGb3JtVHlwZVtcIkJMT0NLXCJdID0gXCJCbG9jayBSZXF1ZXN0XCI7XG4gICAgRm9ybVR5cGVbXCJSRVBMQUNFXCJdID0gXCJSZXBsYWNlIFJldXFlc3RcIjtcbiAgICBGb3JtVHlwZVtcIk1PRElGWUhFQURFUlwiXSA9IFwiTW9kaWZ5IFJlcXVlc3QgSGVhZGVyXCI7XG4gICAgRm9ybVR5cGVbXCJJTlNFUlRTQ1JJUFRcIl0gPSBcIkluc2VydCBTY3JpcHRcIjtcbiAgICBGb3JtVHlwZVtcIk1PRElGWVJFU1BPTlNFXCJdID0gXCJNb2RpZnkgUmVzcG9uc2VcIjtcbiAgICBGb3JtVHlwZVtcIkRFTEFZXCJdID0gXCJEZWxheSBSZXF1ZXN0XCI7XG4gICAgRm9ybVR5cGVbXCJRVUVSWVBBUkFNXCJdID0gXCJRdWVyeSBQYXJhbVwiO1xufSkoRm9ybVR5cGUgfHwgKEZvcm1UeXBlID0ge30pKTtcbmV4cG9ydCBjb25zdCBGb3JtVHlwZU1hcCA9IHtcbiAgICBSRURJUkVDVDogUnVsZUFjdGlvblR5cGUuUkVESVJFQ1QsXG4gICAgQkxPQ0s6IFJ1bGVBY3Rpb25UeXBlLkJMT0NLLFxuICAgIE1PRElGWVJFU1BPTlNFOiBSdWxlQWN0aW9uVHlwZS5SRURJUkVDVFxufTtcbmV4cG9ydCB2YXIgTWF0Y2hUeXBlO1xuKGZ1bmN0aW9uIChNYXRjaFR5cGUpIHtcbiAgICBNYXRjaFR5cGVbXCJDT05UQUlOXCJdID0gXCJDb250YWluXCI7XG4gICAgTWF0Y2hUeXBlW1wiRVFVQUxcIl0gPSBcIkVxdWxcIjtcbiAgICBNYXRjaFR5cGVbXCJSRUdFWFBcIl0gPSBcIlJlZ2V4cFwiO1xuICAgIE1hdGNoVHlwZVtcIldJTERDQVJEXCJdID0gXCJXaWxkY2FyZFwiO1xufSkoTWF0Y2hUeXBlIHx8IChNYXRjaFR5cGUgPSB7fSkpO1xuIiwiZXhwb3J0IHZhciBQb3N0TWVzc2FnZUFjdGlvbjtcbihmdW5jdGlvbiAoUG9zdE1lc3NhZ2VBY3Rpb24pIHtcbiAgICBQb3N0TWVzc2FnZUFjdGlvbltQb3N0TWVzc2FnZUFjdGlvbltcIkFkZFJ1bGVcIl0gPSAwXSA9IFwiQWRkUnVsZVwiO1xuICAgIFBvc3RNZXNzYWdlQWN0aW9uW1Bvc3RNZXNzYWdlQWN0aW9uW1wiVXBkYXRlUnVsZVwiXSA9IDFdID0gXCJVcGRhdGVSdWxlXCI7XG4gICAgUG9zdE1lc3NhZ2VBY3Rpb25bUG9zdE1lc3NhZ2VBY3Rpb25bXCJEZWxldGVSdWxlXCJdID0gMl0gPSBcIkRlbGV0ZVJ1bGVcIjtcbiAgICBQb3N0TWVzc2FnZUFjdGlvbltQb3N0TWVzc2FnZUFjdGlvbltcIkdldFJ1bGVzXCJdID0gM10gPSBcIkdldFJ1bGVzXCI7XG4gICAgUG9zdE1lc3NhZ2VBY3Rpb25bUG9zdE1lc3NhZ2VBY3Rpb25bXCJMb2dcIl0gPSA0XSA9IFwiTG9nXCI7XG59KShQb3N0TWVzc2FnZUFjdGlvbiB8fCAoUG9zdE1lc3NhZ2VBY3Rpb24gPSB7fSkpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBGb3JtVHlwZU1hcCB9IGZyb20gXCIuLi9tb2RlbHMvZm9ybUZpZWxkXCI7XG5jbGFzcyBSdWxlU2VydmljZSB7XG4gICAgYWRkKHJ1bGVzKSB7XG4gICAgICAgIGNvbnN0IHFxID0gcnVsZXMubWFwKGFzID0+IGFzLmlkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRHluYW1pY1J1bGVzKHsgYWRkUnVsZXM6IHJ1bGVzLCByZW1vdmVSdWxlSWRzOiBxcSB9KTtcbiAgICB9XG4gICAgcmVtb3ZlKHJ1bGVzKSB7XG4gICAgICAgIGNvbnN0IHJlbW92ZVJ1bGVJZHMgPSBydWxlcy5tYXAocnVsZSA9PiBydWxlLmlkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRHluYW1pY1J1bGVzKHsgcmVtb3ZlUnVsZUlkcyB9KTtcbiAgICB9XG4gICAgZ2V0UnVsZUJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bGVzID0geWllbGQgdGhpcy5nZXRSdWxlcygpO1xuICAgICAgICAgICAgcmV0dXJuIHJ1bGVzLmZpbmQocnVsZSA9PiBydWxlLmlkID09PSBpZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1cGRhdGVEeW5hbWljUnVsZXModXBkYXRlUnVsZU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QudXBkYXRlRHluYW1pY1J1bGVzKHVwZGF0ZVJ1bGVPcHRpb25zKTtcbiAgICB9XG4gICAgZ2V0UnVsZXMoKSB7XG4gICAgICAgIHJldHVybiBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LmdldER5bmFtaWNSdWxlcygpO1xuICAgIH1cbiAgICBnZW5lcmF0ZUFjdGlvbihmb3JtRmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IEZvcm1UeXBlTWFwW2Zvcm1GaWVsZC50eXBlXSxcbiAgICAgICAgICAgIHJlZGlyZWN0OiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgKGZvcm1GaWVsZC5yZWRpcmVjdFRvICYmIHsgdXJsOiBmb3JtRmllbGQucmVkaXJlY3RUbyB9KSksIChmb3JtRmllbGQuZXh0ZW5zaW9uUGF0aCAmJiB7IGV4dGVuc2lvblBhdGg6IGZvcm1GaWVsZC5leHRlbnNpb25QYXRoIH0pKSwgKGZvcm1GaWVsZC5yZWdleFN1YnN0aXR1dGlvbiAmJiB7IHJlZ2V4U3Vic3RpdHV0aW9uOiBmb3JtRmllbGQucmVnZXhTdWJzdGl0dXRpb24gfSkpXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdlbmVyYXRlQ29uZGl0aW9uKGZvcm1GaWVsZCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIChmb3JtRmllbGQudXJsRmlsdGVyICYmIHsgdXJsRmlsdGVyOiBmb3JtRmllbGQudXJsRmlsdGVyIH0pKSwgKGZvcm1GaWVsZC5yZWdleEZpbHRlciAmJiB7IHJlZ2V4RmlsdGVyOiBmb3JtRmllbGQucmVnZXhGaWx0ZXIgfSkpLCB7IHJlc291cmNlVHlwZXM6IFtcIm1haW5fZnJhbWVcIiwgXCJzdWJfZnJhbWVcIl0gfSk7XG4gICAgfVxuICAgIGdlbmVyYXRlUnVsZShmb3JtRmllbGQpIHtcbiAgICAgICAgY29uc3QgcnVsZSA9IHtcbiAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgcHJpb3JpdHk6IDEsXG4gICAgICAgICAgICBhY3Rpb246IHRoaXMuZ2VuZXJhdGVBY3Rpb24oZm9ybUZpZWxkKSxcbiAgICAgICAgICAgIGNvbmRpdGlvbjogdGhpcy5nZW5lcmF0ZUNvbmRpdGlvbihmb3JtRmllbGQpLFxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmxvZygncnVsZScsIHJ1bGUpO1xuICAgICAgICByZXR1cm4gcnVsZTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBuZXcgUnVsZVNlcnZpY2UoKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFJ1bGVTZXJ2aWNlIGZyb20gJy4uL3NlcnZpY2VzL1J1bGVTZXJ2aWNlJztcbmltcG9ydCB7IFBvc3RNZXNzYWdlQWN0aW9uIH0gZnJvbSAnLi4vbW9kZWxzL3Bvc3RNZXNzYWdlQWN0aW9uJztcbmNvbnN0IHsgUnVsZUFjdGlvblR5cGUgfSA9IGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3Q7XG5jaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigoKSA9PiBjaHJvbWUucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKSk7XG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7IH0pO1xuY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC5nZXREeW5hbWljUnVsZXMoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgY29uc3QgcXEgPSBkYXRhLm1hcChhcyA9PiBhcy5pZCk7XG4gICAgLy8gY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVEeW5hbWljUnVsZXMoe3JlbW92ZVJ1bGVJZHM6IHFxfSlcbn0pO1xuLy8gY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVEeW5hbWljUnVsZXMoe1xuLy8gICBhZGRSdWxlczogW1xuLy8gICAgIHtcbi8vICAgICAgIFwiaWRcIjogMyxcbi8vICAgICAgIFwicHJpb3JpdHlcIjogMSxcbi8vICAgICAgIFwiYWN0aW9uXCI6IHsgXCJ0eXBlXCI6IFwiYmxvY2tcIiBhcyBhbnkgfSxcbi8vICAgICAgIFwiY29uZGl0aW9uXCI6IHtcInVybEZpbHRlclwiOiBcImh0dHBzOi8vd2ViLWJ1dHRvbi5zdGFnaW5nLmdldG1hdGkuY29tL2J1dHRvbi5qc1wiLCBcInJlc291cmNlVHlwZXNcIjogW1wic2NyaXB0XCIgYXMgYW55XX1cbi8vICAgICB9LFxuLy8gICBdLFxuLy8gICByZW1vdmVSdWxlSWRzOiBbMiwxLCAzXVxuLy8gfSk7XG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgc3dpdGNoIChyZXF1ZXN0LmFjdGlvbikge1xuICAgICAgICBjYXNlIFBvc3RNZXNzYWdlQWN0aW9uLkFkZFJ1bGU6XG4gICAgICAgICAgICBSdWxlU2VydmljZS5hZGQoW1J1bGVTZXJ2aWNlLmdlbmVyYXRlUnVsZShyZXF1ZXN0LmRhdGEpXSlcbiAgICAgICAgICAgICAgICAudGhlbihzZW5kUmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgZXJyb3IgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUG9zdE1lc3NhZ2VBY3Rpb24uVXBkYXRlUnVsZTpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBvc3RNZXNzYWdlQWN0aW9uLkRlbGV0ZVJ1bGU6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQb3N0TWVzc2FnZUFjdGlvbi5HZXRSdWxlczpcbiAgICAgICAgICAgIFJ1bGVTZXJ2aWNlLmdldFJ1bGVzKCkudGhlbihzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQb3N0TWVzc2FnZUFjdGlvbi5Mb2c6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5yZXF1ZXN0LmRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcbiJdLCJuYW1lcyI6WyJSdWxlQWN0aW9uVHlwZSIsImNocm9tZSIsImRlY2xhcmF0aXZlTmV0UmVxdWVzdCIsIkZvcm1UeXBlIiwiRm9ybVR5cGVNYXAiLCJSRURJUkVDVCIsIkJMT0NLIiwiTU9ESUZZUkVTUE9OU0UiLCJNYXRjaFR5cGUiLCJQb3N0TWVzc2FnZUFjdGlvbiIsIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsImFkb3B0IiwidmFsdWUiLCJyZXNvbHZlIiwiUHJvbWlzZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIlJ1bGVTZXJ2aWNlIiwicnVsZXMiLCJxcSIsIm1hcCIsImFzIiwiaWQiLCJ1cGRhdGVEeW5hbWljUnVsZXMiLCJhZGRSdWxlcyIsInJlbW92ZVJ1bGVJZHMiLCJydWxlIiwiZ2V0UnVsZXMiLCJmaW5kIiwidXBkYXRlUnVsZU9wdGlvbnMiLCJnZXREeW5hbWljUnVsZXMiLCJmb3JtRmllbGQiLCJ0eXBlIiwicmVkaXJlY3QiLCJPYmplY3QiLCJhc3NpZ24iLCJyZWRpcmVjdFRvIiwidXJsIiwiZXh0ZW5zaW9uUGF0aCIsInJlZ2V4U3Vic3RpdHV0aW9uIiwidXJsRmlsdGVyIiwicmVnZXhGaWx0ZXIiLCJyZXNvdXJjZVR5cGVzIiwicHJpb3JpdHkiLCJhY3Rpb24iLCJnZW5lcmF0ZUFjdGlvbiIsImNvbmRpdGlvbiIsImdlbmVyYXRlQ29uZGl0aW9uIiwiY29uc29sZSIsImxvZyIsIm9uQ2xpY2tlZCIsImFkZExpc3RlbmVyIiwicnVudGltZSIsIm9wZW5PcHRpb25zUGFnZSIsIm9uSW5zdGFsbGVkIiwiZGF0YSIsIm9uTWVzc2FnZSIsInJlcXVlc3QiLCJzZW5kZXIiLCJzZW5kUmVzcG9uc2UiLCJBZGRSdWxlIiwiYWRkIiwiZ2VuZXJhdGVSdWxlIiwiY2F0Y2giLCJlcnJvciIsIlVwZGF0ZVJ1bGUiLCJEZWxldGVSdWxlIiwiR2V0UnVsZXMiLCJMb2ciXSwic291cmNlUm9vdCI6IiJ9