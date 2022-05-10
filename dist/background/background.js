/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
    key: "generateRule",
    value: function generateRule(formField) {
      var _a, _b, _c, _d;

      var condition = Object.assign(Object.assign({
        urlFilter: formField.condition.urlFilter,
        regexFilter: formField.condition.regexFilter
      }, ((_b = (_a = formField.condition) === null || _a === void 0 ? void 0 : _a.resourceTypes) === null || _b === void 0 ? void 0 : _b.length) && {
        resourceTypes: formField.resourceTypes
      }), ((_d = (_c = formField.condition) === null || _c === void 0 ? void 0 : _c.requestMethods) === null || _d === void 0 ? void 0 : _d.length) && {
        requestMethods: formField.requestMethods
      }); // const rule: Rule = {
      //     id: 1,
      //     priority: 1,
      //     action: {
      //         ...formField.action
      //     },
      //     condition,
      // };
      // const rule: any =  {
      //     "id": 7,
      //     "priority": 1,
      //     "action": {
      //       "type": "redirect",
      //       "redirect": {
      //         "regexSubstitution": "https://\\1.baaa.com"
      //       }
      //     },
      //     "condition": {
      //       "regexFilter": "^http[s]?://(abc|def).xyz.com",
      //       "resourceTypes": [
      //         "main_frame"
      //       ]
      //     }
      //   };
      // exact match
      // /^a$/;
      // {
      //     "id": 4,
      //     "priority": 1,
      //     "action": { "type": "redirect", "redirect": { "url": "https://example.com" } },
      //     "condition": { "urlFilter": "google.com", "resourceTypes": ["main_frame"] }
      //   },

      var rule = {
        "id": 4,
        "priority": 1,
        "action": {
          "type": "redirect",
          "redirect": {
            "url": "https://example.com"
          }
        },
        "condition": {
          "urlFilter": " /^search$/",
          "resourceTypes": ["main_frame"]
        }
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
var color = '#3aa757';
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
      _services_RuleService__WEBPACK_IMPORTED_MODULE_0__["default"].add([_services_RuleService__WEBPACK_IMPORTED_MODULE_0__["default"].generateRule(request.data)]);
      sendResponse();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7O0FBQ0FRLE1BQU0sQ0FBQ3VCLE9BQVAsQ0FBZUksU0FBZixDQUF5QkwsV0FBekIsQ0FBcUMsVUFBQ00sT0FBRCxFQUFVQyxNQUFWLEVBQWtCQyxZQUFsQixFQUFtQztFQUFBOztFQUNwRSxRQUFRRixPQUFPLENBQUNSLE1BQWhCO0lBQ0ksS0FBS3JELGdGQUFMO01BQ0lvQixpRUFBQSxDQUFnQixDQUFDQSwwRUFBQSxDQUF5QnlDLE9BQU8sQ0FBQ0YsSUFBakMsQ0FBRCxDQUFoQjtNQUNBSSxZQUFZO01BQ1o7O0lBQ0osS0FBSy9ELG1GQUFMO01BQ0k7O0lBQ0osS0FBS0EsbUZBQUw7TUFDSTs7SUFDSixLQUFLQSxpRkFBTDtNQUNJb0Isc0VBQUEsR0FBdUJGLElBQXZCLENBQTRCNkMsWUFBNUI7TUFDQSxPQUFPLElBQVA7TUFDQTs7SUFDSixLQUFLL0QsNEVBQUw7TUFDSSxZQUFBaUQsT0FBTyxFQUFDQyxHQUFSLG9DQUFlVyxPQUFPLENBQUNGLElBQXZCOztNQUNBOztJQUNKO01BQ0k7RUFqQlI7QUFtQkgsQ0FwQkQsRSIsInNvdXJjZXMiOlsid2VicGFjazovL292ZXJyaWRlci8uL3NyYy9tb2RlbHMvcG9zdE1lc3NhZ2VBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vb3ZlcnJpZGVyLy4vc3JjL3NlcnZpY2VzL1J1bGVTZXJ2aWNlLnRzIiwid2VicGFjazovL292ZXJyaWRlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vdmVycmlkZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL292ZXJyaWRlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL292ZXJyaWRlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL292ZXJyaWRlci8uL3NyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHZhciBQb3N0TWVzc2FnZUFjdGlvbjtcbihmdW5jdGlvbiAoUG9zdE1lc3NhZ2VBY3Rpb24pIHtcbiAgICBQb3N0TWVzc2FnZUFjdGlvbltQb3N0TWVzc2FnZUFjdGlvbltcIkFkZFJ1bGVcIl0gPSAwXSA9IFwiQWRkUnVsZVwiO1xuICAgIFBvc3RNZXNzYWdlQWN0aW9uW1Bvc3RNZXNzYWdlQWN0aW9uW1wiVXBkYXRlUnVsZVwiXSA9IDFdID0gXCJVcGRhdGVSdWxlXCI7XG4gICAgUG9zdE1lc3NhZ2VBY3Rpb25bUG9zdE1lc3NhZ2VBY3Rpb25bXCJEZWxldGVSdWxlXCJdID0gMl0gPSBcIkRlbGV0ZVJ1bGVcIjtcbiAgICBQb3N0TWVzc2FnZUFjdGlvbltQb3N0TWVzc2FnZUFjdGlvbltcIkdldFJ1bGVzXCJdID0gM10gPSBcIkdldFJ1bGVzXCI7XG4gICAgUG9zdE1lc3NhZ2VBY3Rpb25bUG9zdE1lc3NhZ2VBY3Rpb25bXCJMb2dcIl0gPSA0XSA9IFwiTG9nXCI7XG59KShQb3N0TWVzc2FnZUFjdGlvbiB8fCAoUG9zdE1lc3NhZ2VBY3Rpb24gPSB7fSkpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5jbGFzcyBSdWxlU2VydmljZSB7XG4gICAgYWRkKHJ1bGVzKSB7XG4gICAgICAgIGNvbnN0IHFxID0gcnVsZXMubWFwKGFzID0+IGFzLmlkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRHluYW1pY1J1bGVzKHsgYWRkUnVsZXM6IHJ1bGVzLCByZW1vdmVSdWxlSWRzOiBxcSB9KTtcbiAgICB9XG4gICAgcmVtb3ZlKHJ1bGVzKSB7XG4gICAgICAgIGNvbnN0IHJlbW92ZVJ1bGVJZHMgPSBydWxlcy5tYXAocnVsZSA9PiBydWxlLmlkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRHluYW1pY1J1bGVzKHsgcmVtb3ZlUnVsZUlkcyB9KTtcbiAgICB9XG4gICAgZ2V0UnVsZUJ5SWQoaWQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bGVzID0geWllbGQgdGhpcy5nZXRSdWxlcygpO1xuICAgICAgICAgICAgcmV0dXJuIHJ1bGVzLmZpbmQocnVsZSA9PiBydWxlLmlkID09PSBpZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1cGRhdGVEeW5hbWljUnVsZXModXBkYXRlUnVsZU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QudXBkYXRlRHluYW1pY1J1bGVzKHVwZGF0ZVJ1bGVPcHRpb25zKTtcbiAgICB9XG4gICAgZ2V0UnVsZXMoKSB7XG4gICAgICAgIHJldHVybiBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LmdldER5bmFtaWNSdWxlcygpO1xuICAgIH1cbiAgICBnZW5lcmF0ZVJ1bGUoZm9ybUZpZWxkKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHsgdXJsRmlsdGVyOiBmb3JtRmllbGQuY29uZGl0aW9uLnVybEZpbHRlciwgcmVnZXhGaWx0ZXI6IGZvcm1GaWVsZC5jb25kaXRpb24ucmVnZXhGaWx0ZXIgfSwgKCgoX2IgPSAoX2EgPSBmb3JtRmllbGQuY29uZGl0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVzb3VyY2VUeXBlcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmxlbmd0aCkgJiYgeyByZXNvdXJjZVR5cGVzOiBmb3JtRmllbGQucmVzb3VyY2VUeXBlcyB9KSksICgoKF9kID0gKF9jID0gZm9ybUZpZWxkLmNvbmRpdGlvbikgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLnJlcXVlc3RNZXRob2RzKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QubGVuZ3RoKSAmJiB7IHJlcXVlc3RNZXRob2RzOiBmb3JtRmllbGQucmVxdWVzdE1ldGhvZHMgfSkpO1xuICAgICAgICAvLyBjb25zdCBydWxlOiBSdWxlID0ge1xuICAgICAgICAvLyAgICAgaWQ6IDEsXG4gICAgICAgIC8vICAgICBwcmlvcml0eTogMSxcbiAgICAgICAgLy8gICAgIGFjdGlvbjoge1xuICAgICAgICAvLyAgICAgICAgIC4uLmZvcm1GaWVsZC5hY3Rpb25cbiAgICAgICAgLy8gICAgIH0sXG4gICAgICAgIC8vICAgICBjb25kaXRpb24sXG4gICAgICAgIC8vIH07XG4gICAgICAgIC8vIGNvbnN0IHJ1bGU6IGFueSA9ICB7XG4gICAgICAgIC8vICAgICBcImlkXCI6IDcsXG4gICAgICAgIC8vICAgICBcInByaW9yaXR5XCI6IDEsXG4gICAgICAgIC8vICAgICBcImFjdGlvblwiOiB7XG4gICAgICAgIC8vICAgICAgIFwidHlwZVwiOiBcInJlZGlyZWN0XCIsXG4gICAgICAgIC8vICAgICAgIFwicmVkaXJlY3RcIjoge1xuICAgICAgICAvLyAgICAgICAgIFwicmVnZXhTdWJzdGl0dXRpb25cIjogXCJodHRwczovL1xcXFwxLmJhYWEuY29tXCJcbiAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIFwiY29uZGl0aW9uXCI6IHtcbiAgICAgICAgLy8gICAgICAgXCJyZWdleEZpbHRlclwiOiBcIl5odHRwW3NdPzovLyhhYmN8ZGVmKS54eXouY29tXCIsXG4gICAgICAgIC8vICAgICAgIFwicmVzb3VyY2VUeXBlc1wiOiBbXG4gICAgICAgIC8vICAgICAgICAgXCJtYWluX2ZyYW1lXCJcbiAgICAgICAgLy8gICAgICAgXVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgIH07XG4gICAgICAgIC8vIGV4YWN0IG1hdGNoXG4gICAgICAgIC8vIC9eYSQvO1xuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBcImlkXCI6IDQsXG4gICAgICAgIC8vICAgICBcInByaW9yaXR5XCI6IDEsXG4gICAgICAgIC8vICAgICBcImFjdGlvblwiOiB7IFwidHlwZVwiOiBcInJlZGlyZWN0XCIsIFwicmVkaXJlY3RcIjogeyBcInVybFwiOiBcImh0dHBzOi8vZXhhbXBsZS5jb21cIiB9IH0sXG4gICAgICAgIC8vICAgICBcImNvbmRpdGlvblwiOiB7IFwidXJsRmlsdGVyXCI6IFwiZ29vZ2xlLmNvbVwiLCBcInJlc291cmNlVHlwZXNcIjogW1wibWFpbl9mcmFtZVwiXSB9XG4gICAgICAgIC8vICAgfSxcbiAgICAgICAgY29uc3QgcnVsZSA9IHtcbiAgICAgICAgICAgIFwiaWRcIjogNCxcbiAgICAgICAgICAgIFwicHJpb3JpdHlcIjogMSxcbiAgICAgICAgICAgIFwiYWN0aW9uXCI6IHsgXCJ0eXBlXCI6IFwicmVkaXJlY3RcIiwgXCJyZWRpcmVjdFwiOiB7IFwidXJsXCI6IFwiaHR0cHM6Ly9leGFtcGxlLmNvbVwiIH0gfSxcbiAgICAgICAgICAgIFwiY29uZGl0aW9uXCI6IHsgXCJ1cmxGaWx0ZXJcIjogXCIgL15zZWFyY2gkL1wiLCBcInJlc291cmNlVHlwZXNcIjogW1wibWFpbl9mcmFtZVwiXSB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnNvbGUubG9nKCdydWxlJywgcnVsZSk7XG4gICAgICAgIHJldHVybiBydWxlO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IG5ldyBSdWxlU2VydmljZSgpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgUnVsZVNlcnZpY2UgZnJvbSAnLi4vc2VydmljZXMvUnVsZVNlcnZpY2UnO1xuaW1wb3J0IHsgUG9zdE1lc3NhZ2VBY3Rpb24gfSBmcm9tICcuLi9tb2RlbHMvcG9zdE1lc3NhZ2VBY3Rpb24nO1xuY29uc3QgeyBSdWxlQWN0aW9uVHlwZSB9ID0gY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdDtcbmxldCBjb2xvciA9ICcjM2FhNzU3JztcbmNocm9tZS5hY3Rpb24ub25DbGlja2VkLmFkZExpc3RlbmVyKCgpID0+IGNocm9tZS5ydW50aW1lLm9wZW5PcHRpb25zUGFnZSgpKTtcbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHsgfSk7XG5jaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LmdldER5bmFtaWNSdWxlcygpLnRoZW4oKGRhdGEpID0+IHtcbiAgICBjb25zdCBxcSA9IGRhdGEubWFwKGFzID0+IGFzLmlkKTtcbiAgICAvLyBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LnVwZGF0ZUR5bmFtaWNSdWxlcyh7cmVtb3ZlUnVsZUlkczogcXF9KVxufSk7XG4vLyBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LnVwZGF0ZUR5bmFtaWNSdWxlcyh7XG4vLyAgIGFkZFJ1bGVzOiBbXG4vLyAgICAge1xuLy8gICAgICAgXCJpZFwiOiAzLFxuLy8gICAgICAgXCJwcmlvcml0eVwiOiAxLFxuLy8gICAgICAgXCJhY3Rpb25cIjogeyBcInR5cGVcIjogXCJibG9ja1wiIGFzIGFueSB9LFxuLy8gICAgICAgXCJjb25kaXRpb25cIjoge1widXJsRmlsdGVyXCI6IFwiaHR0cHM6Ly93ZWItYnV0dG9uLnN0YWdpbmcuZ2V0bWF0aS5jb20vYnV0dG9uLmpzXCIsIFwicmVzb3VyY2VUeXBlc1wiOiBbXCJzY3JpcHRcIiBhcyBhbnldfVxuLy8gICAgIH0sXG4vLyAgIF0sXG4vLyAgIHJlbW92ZVJ1bGVJZHM6IFsyLDEsIDNdXG4vLyB9KTtcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBzd2l0Y2ggKHJlcXVlc3QuYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgUG9zdE1lc3NhZ2VBY3Rpb24uQWRkUnVsZTpcbiAgICAgICAgICAgIFJ1bGVTZXJ2aWNlLmFkZChbUnVsZVNlcnZpY2UuZ2VuZXJhdGVSdWxlKHJlcXVlc3QuZGF0YSldKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgUG9zdE1lc3NhZ2VBY3Rpb24uVXBkYXRlUnVsZTpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFBvc3RNZXNzYWdlQWN0aW9uLkRlbGV0ZVJ1bGU6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQb3N0TWVzc2FnZUFjdGlvbi5HZXRSdWxlczpcbiAgICAgICAgICAgIFJ1bGVTZXJ2aWNlLmdldFJ1bGVzKCkudGhlbihzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBQb3N0TWVzc2FnZUFjdGlvbi5Mb2c6XG4gICAgICAgICAgICBjb25zb2xlLmxvZyguLi5yZXF1ZXN0LmRhdGEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59KTtcbiJdLCJuYW1lcyI6WyJQb3N0TWVzc2FnZUFjdGlvbiIsIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsImFkb3B0IiwidmFsdWUiLCJyZXNvbHZlIiwiUHJvbWlzZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsIlJ1bGVTZXJ2aWNlIiwicnVsZXMiLCJxcSIsIm1hcCIsImFzIiwiaWQiLCJ1cGRhdGVEeW5hbWljUnVsZXMiLCJhZGRSdWxlcyIsInJlbW92ZVJ1bGVJZHMiLCJydWxlIiwiZ2V0UnVsZXMiLCJmaW5kIiwidXBkYXRlUnVsZU9wdGlvbnMiLCJjaHJvbWUiLCJkZWNsYXJhdGl2ZU5ldFJlcXVlc3QiLCJnZXREeW5hbWljUnVsZXMiLCJmb3JtRmllbGQiLCJfYSIsIl9iIiwiX2MiLCJfZCIsImNvbmRpdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsInVybEZpbHRlciIsInJlZ2V4RmlsdGVyIiwicmVzb3VyY2VUeXBlcyIsImxlbmd0aCIsInJlcXVlc3RNZXRob2RzIiwiY29uc29sZSIsImxvZyIsIlJ1bGVBY3Rpb25UeXBlIiwiY29sb3IiLCJhY3Rpb24iLCJvbkNsaWNrZWQiLCJhZGRMaXN0ZW5lciIsInJ1bnRpbWUiLCJvcGVuT3B0aW9uc1BhZ2UiLCJvbkluc3RhbGxlZCIsImRhdGEiLCJvbk1lc3NhZ2UiLCJyZXF1ZXN0Iiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwiQWRkUnVsZSIsImFkZCIsImdlbmVyYXRlUnVsZSIsIlVwZGF0ZVJ1bGUiLCJEZWxldGVSdWxlIiwiR2V0UnVsZXMiLCJMb2ciXSwic291cmNlUm9vdCI6IiJ9