/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/background.ts":
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var RuleService_1 = __importDefault(__webpack_require__(/*! ../services/RuleService */ "./src/services/RuleService.ts"));
var postMessageAction_1 = __webpack_require__(/*! ../models/postMessageAction */ "./src/models/postMessageAction.ts");
var RuleActionType = chrome.declarativeNetRequest.RuleActionType;
var color = '#3aa757';
chrome.action.onClicked.addListener(function () { return chrome.runtime.openOptionsPage(); });
chrome.runtime.onInstalled.addListener(function () { });
chrome.declarativeNetRequest.getDynamicRules().then(function (data) {
    var qq = data.map(function (as) { return as.id; });
    // chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: qq})
});
// chrome.declarativeNetRequest.updateDynamicRules({
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
    switch (request.action) {
        case postMessageAction_1.PostMessageAction.AddRule:
            RuleService_1.default.add([RuleService_1.default.generateRule(request.data)]);
            sendResponse();
            break;
        case postMessageAction_1.PostMessageAction.UpdateRule:
            break;
        case postMessageAction_1.PostMessageAction.DeleteRule:
            break;
        case postMessageAction_1.PostMessageAction.GetRules:
            RuleService_1.default.getRules().then(sendResponse);
            return true;
            break;
        case postMessageAction_1.PostMessageAction.Log:
            console.log.apply(console, request.data);
            break;
        default:
            break;
    }
});


/***/ }),

/***/ "./src/models/postMessageAction.ts":
/*!*****************************************!*\
  !*** ./src/models/postMessageAction.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostMessageAction = void 0;
var PostMessageAction;
(function (PostMessageAction) {
    PostMessageAction[PostMessageAction["AddRule"] = 0] = "AddRule";
    PostMessageAction[PostMessageAction["UpdateRule"] = 1] = "UpdateRule";
    PostMessageAction[PostMessageAction["DeleteRule"] = 2] = "DeleteRule";
    PostMessageAction[PostMessageAction["GetRules"] = 3] = "GetRules";
    PostMessageAction[PostMessageAction["Log"] = 4] = "Log";
})(PostMessageAction = exports.PostMessageAction || (exports.PostMessageAction = {}));


/***/ }),

/***/ "./src/services/RuleService.ts":
/*!*************************************!*\
  !*** ./src/services/RuleService.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var RuleService = /** @class */ (function () {
    function RuleService() {
    }
    RuleService.prototype.add = function (rules) {
        var qq = rules.map(function (as) { return as.id; });
        return this.updateDynamicRules({ addRules: rules, removeRuleIds: qq });
    };
    RuleService.prototype.remove = function (rules) {
        var removeRuleIds = rules.map(function (rule) { return rule.id; });
        return this.updateDynamicRules({ removeRuleIds: removeRuleIds });
    };
    RuleService.prototype.getRuleById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var rules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRules()];
                    case 1:
                        rules = _a.sent();
                        return [2 /*return*/, rules.find(function (rule) { return rule.id === id; })];
                }
            });
        });
    };
    RuleService.prototype.updateDynamicRules = function (updateRuleOptions) {
        return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
    };
    RuleService.prototype.getRules = function () {
        return chrome.declarativeNetRequest.getDynamicRules();
    };
    RuleService.prototype.generateRule = function (formField) {
        var _a, _b, _c, _d;
        var condition = __assign(__assign({ urlFilter: formField.condition.urlFilter, regexFilter: formField.condition.regexFilter }, (((_b = (_a = formField.condition) === null || _a === void 0 ? void 0 : _a.resourceTypes) === null || _b === void 0 ? void 0 : _b.length) && { resourceTypes: formField.resourceTypes })), (((_d = (_c = formField.condition) === null || _c === void 0 ? void 0 : _c.requestMethods) === null || _d === void 0 ? void 0 : _d.length) && { requestMethods: formField.requestMethods }));
        // const rule: Rule = {
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
        var rule = {
            "id": 4,
            "priority": 1,
            "action": { "type": "redirect", "redirect": { "url": "https://example.com" } },
            "condition": { "urlFilter": " /^search$/", "resourceTypes": ["main_frame"] }
        };
        console.log('rule', rule);
        return rule;
    };
    return RuleService;
}());
exports["default"] = new RuleService();


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/background/background.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb3ZlcnJpZGVyLy4vc3JjL2JhY2tncm91bmQvYmFja2dyb3VuZC50cyIsIndlYnBhY2s6Ly9vdmVycmlkZXIvLi9zcmMvbW9kZWxzL3Bvc3RNZXNzYWdlQWN0aW9uLnRzIiwid2VicGFjazovL292ZXJyaWRlci8uL3NyYy9zZXJ2aWNlcy9SdWxlU2VydmljZS50cyIsIndlYnBhY2s6Ly9vdmVycmlkZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb3ZlcnJpZGVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vb3ZlcnJpZGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9vdmVycmlkZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFJ1bGVTZXJ2aWNlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3NlcnZpY2VzL1J1bGVTZXJ2aWNlXCIpKTtcbnZhciBwb3N0TWVzc2FnZUFjdGlvbl8xID0gcmVxdWlyZShcIi4uL21vZGVscy9wb3N0TWVzc2FnZUFjdGlvblwiKTtcbnZhciBSdWxlQWN0aW9uVHlwZSA9IGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QuUnVsZUFjdGlvblR5cGU7XG52YXIgY29sb3IgPSAnIzNhYTc1Nyc7XG5jaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7IHJldHVybiBjaHJvbWUucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKTsgfSk7XG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7IH0pO1xuY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC5nZXREeW5hbWljUnVsZXMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHFxID0gZGF0YS5tYXAoZnVuY3Rpb24gKGFzKSB7IHJldHVybiBhcy5pZDsgfSk7XG4gICAgLy8gY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVEeW5hbWljUnVsZXMoe3JlbW92ZVJ1bGVJZHM6IHFxfSlcbn0pO1xuLy8gY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVEeW5hbWljUnVsZXMoe1xuLy8gICBhZGRSdWxlczogW1xuLy8gICAgIHtcbi8vICAgICAgIFwiaWRcIjogMyxcbi8vICAgICAgIFwicHJpb3JpdHlcIjogMSxcbi8vICAgICAgIFwiYWN0aW9uXCI6IHsgXCJ0eXBlXCI6IFwiYmxvY2tcIiBhcyBhbnkgfSxcbi8vICAgICAgIFwiY29uZGl0aW9uXCI6IHtcInVybEZpbHRlclwiOiBcImh0dHBzOi8vd2ViLWJ1dHRvbi5zdGFnaW5nLmdldG1hdGkuY29tL2J1dHRvbi5qc1wiLCBcInJlc291cmNlVHlwZXNcIjogW1wic2NyaXB0XCIgYXMgYW55XX1cbi8vICAgICB9LFxuLy8gICBdLFxuLy8gICByZW1vdmVSdWxlSWRzOiBbMiwxLCAzXVxuLy8gfSk7XG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgc3dpdGNoIChyZXF1ZXN0LmFjdGlvbikge1xuICAgICAgICBjYXNlIHBvc3RNZXNzYWdlQWN0aW9uXzEuUG9zdE1lc3NhZ2VBY3Rpb24uQWRkUnVsZTpcbiAgICAgICAgICAgIFJ1bGVTZXJ2aWNlXzEuZGVmYXVsdC5hZGQoW1J1bGVTZXJ2aWNlXzEuZGVmYXVsdC5nZW5lcmF0ZVJ1bGUocmVxdWVzdC5kYXRhKV0pO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBwb3N0TWVzc2FnZUFjdGlvbl8xLlBvc3RNZXNzYWdlQWN0aW9uLlVwZGF0ZVJ1bGU6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBwb3N0TWVzc2FnZUFjdGlvbl8xLlBvc3RNZXNzYWdlQWN0aW9uLkRlbGV0ZVJ1bGU6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBwb3N0TWVzc2FnZUFjdGlvbl8xLlBvc3RNZXNzYWdlQWN0aW9uLkdldFJ1bGVzOlxuICAgICAgICAgICAgUnVsZVNlcnZpY2VfMS5kZWZhdWx0LmdldFJ1bGVzKCkudGhlbihzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBwb3N0TWVzc2FnZUFjdGlvbl8xLlBvc3RNZXNzYWdlQWN0aW9uLkxvZzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIHJlcXVlc3QuZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBvc3RNZXNzYWdlQWN0aW9uID0gdm9pZCAwO1xudmFyIFBvc3RNZXNzYWdlQWN0aW9uO1xuKGZ1bmN0aW9uIChQb3N0TWVzc2FnZUFjdGlvbikge1xuICAgIFBvc3RNZXNzYWdlQWN0aW9uW1Bvc3RNZXNzYWdlQWN0aW9uW1wiQWRkUnVsZVwiXSA9IDBdID0gXCJBZGRSdWxlXCI7XG4gICAgUG9zdE1lc3NhZ2VBY3Rpb25bUG9zdE1lc3NhZ2VBY3Rpb25bXCJVcGRhdGVSdWxlXCJdID0gMV0gPSBcIlVwZGF0ZVJ1bGVcIjtcbiAgICBQb3N0TWVzc2FnZUFjdGlvbltQb3N0TWVzc2FnZUFjdGlvbltcIkRlbGV0ZVJ1bGVcIl0gPSAyXSA9IFwiRGVsZXRlUnVsZVwiO1xuICAgIFBvc3RNZXNzYWdlQWN0aW9uW1Bvc3RNZXNzYWdlQWN0aW9uW1wiR2V0UnVsZXNcIl0gPSAzXSA9IFwiR2V0UnVsZXNcIjtcbiAgICBQb3N0TWVzc2FnZUFjdGlvbltQb3N0TWVzc2FnZUFjdGlvbltcIkxvZ1wiXSA9IDRdID0gXCJMb2dcIjtcbn0pKFBvc3RNZXNzYWdlQWN0aW9uID0gZXhwb3J0cy5Qb3N0TWVzc2FnZUFjdGlvbiB8fCAoZXhwb3J0cy5Qb3N0TWVzc2FnZUFjdGlvbiA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFJ1bGVTZXJ2aWNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJ1bGVTZXJ2aWNlKCkge1xuICAgIH1cbiAgICBSdWxlU2VydmljZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHJ1bGVzKSB7XG4gICAgICAgIHZhciBxcSA9IHJ1bGVzLm1hcChmdW5jdGlvbiAoYXMpIHsgcmV0dXJuIGFzLmlkOyB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRHluYW1pY1J1bGVzKHsgYWRkUnVsZXM6IHJ1bGVzLCByZW1vdmVSdWxlSWRzOiBxcSB9KTtcbiAgICB9O1xuICAgIFJ1bGVTZXJ2aWNlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAocnVsZXMpIHtcbiAgICAgICAgdmFyIHJlbW92ZVJ1bGVJZHMgPSBydWxlcy5tYXAoZnVuY3Rpb24gKHJ1bGUpIHsgcmV0dXJuIHJ1bGUuaWQ7IH0pO1xuICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVEeW5hbWljUnVsZXMoeyByZW1vdmVSdWxlSWRzOiByZW1vdmVSdWxlSWRzIH0pO1xuICAgIH07XG4gICAgUnVsZVNlcnZpY2UucHJvdG90eXBlLmdldFJ1bGVCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBydWxlcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgdGhpcy5nZXRSdWxlcygpXTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXMgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcnVsZXMuZmluZChmdW5jdGlvbiAocnVsZSkgeyByZXR1cm4gcnVsZS5pZCA9PT0gaWQ7IH0pXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSdWxlU2VydmljZS5wcm90b3R5cGUudXBkYXRlRHluYW1pY1J1bGVzID0gZnVuY3Rpb24gKHVwZGF0ZVJ1bGVPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LnVwZGF0ZUR5bmFtaWNSdWxlcyh1cGRhdGVSdWxlT3B0aW9ucyk7XG4gICAgfTtcbiAgICBSdWxlU2VydmljZS5wcm90b3R5cGUuZ2V0UnVsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LmdldER5bmFtaWNSdWxlcygpO1xuICAgIH07XG4gICAgUnVsZVNlcnZpY2UucHJvdG90eXBlLmdlbmVyYXRlUnVsZSA9IGZ1bmN0aW9uIChmb3JtRmllbGQpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICB2YXIgY29uZGl0aW9uID0gX19hc3NpZ24oX19hc3NpZ24oeyB1cmxGaWx0ZXI6IGZvcm1GaWVsZC5jb25kaXRpb24udXJsRmlsdGVyLCByZWdleEZpbHRlcjogZm9ybUZpZWxkLmNvbmRpdGlvbi5yZWdleEZpbHRlciB9LCAoKChfYiA9IChfYSA9IGZvcm1GaWVsZC5jb25kaXRpb24pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZXNvdXJjZVR5cGVzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IubGVuZ3RoKSAmJiB7IHJlc291cmNlVHlwZXM6IGZvcm1GaWVsZC5yZXNvdXJjZVR5cGVzIH0pKSwgKCgoX2QgPSAoX2MgPSBmb3JtRmllbGQuY29uZGl0aW9uKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MucmVxdWVzdE1ldGhvZHMpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5sZW5ndGgpICYmIHsgcmVxdWVzdE1ldGhvZHM6IGZvcm1GaWVsZC5yZXF1ZXN0TWV0aG9kcyB9KSk7XG4gICAgICAgIC8vIGNvbnN0IHJ1bGU6IFJ1bGUgPSB7XG4gICAgICAgIC8vICAgICBpZDogMSxcbiAgICAgICAgLy8gICAgIHByaW9yaXR5OiAxLFxuICAgICAgICAvLyAgICAgYWN0aW9uOiB7XG4gICAgICAgIC8vICAgICAgICAgLi4uZm9ybUZpZWxkLmFjdGlvblxuICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgLy8gICAgIGNvbmRpdGlvbixcbiAgICAgICAgLy8gfTtcbiAgICAgICAgLy8gY29uc3QgcnVsZTogYW55ID0gIHtcbiAgICAgICAgLy8gICAgIFwiaWRcIjogNyxcbiAgICAgICAgLy8gICAgIFwicHJpb3JpdHlcIjogMSxcbiAgICAgICAgLy8gICAgIFwiYWN0aW9uXCI6IHtcbiAgICAgICAgLy8gICAgICAgXCJ0eXBlXCI6IFwicmVkaXJlY3RcIixcbiAgICAgICAgLy8gICAgICAgXCJyZWRpcmVjdFwiOiB7XG4gICAgICAgIC8vICAgICAgICAgXCJyZWdleFN1YnN0aXR1dGlvblwiOiBcImh0dHBzOi8vXFxcXDEuYmFhYS5jb21cIlxuICAgICAgICAvLyAgICAgICB9XG4gICAgICAgIC8vICAgICB9LFxuICAgICAgICAvLyAgICAgXCJjb25kaXRpb25cIjoge1xuICAgICAgICAvLyAgICAgICBcInJlZ2V4RmlsdGVyXCI6IFwiXmh0dHBbc10/Oi8vKGFiY3xkZWYpLnh5ei5jb21cIixcbiAgICAgICAgLy8gICAgICAgXCJyZXNvdXJjZVR5cGVzXCI6IFtcbiAgICAgICAgLy8gICAgICAgICBcIm1haW5fZnJhbWVcIlxuICAgICAgICAvLyAgICAgICBdXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgfTtcbiAgICAgICAgLy8gZXhhY3QgbWF0Y2hcbiAgICAgICAgLy8gL15hJC87XG4gICAgICAgIHZhciBydWxlID0ge1xuICAgICAgICAgICAgXCJpZFwiOiA0LFxuICAgICAgICAgICAgXCJwcmlvcml0eVwiOiAxLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogeyBcInR5cGVcIjogXCJyZWRpcmVjdFwiLCBcInJlZGlyZWN0XCI6IHsgXCJ1cmxcIjogXCJodHRwczovL2V4YW1wbGUuY29tXCIgfSB9LFxuICAgICAgICAgICAgXCJjb25kaXRpb25cIjogeyBcInVybEZpbHRlclwiOiBcIiAvXnNlYXJjaCQvXCIsIFwicmVzb3VyY2VUeXBlc1wiOiBbXCJtYWluX2ZyYW1lXCJdIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2coJ3J1bGUnLCBydWxlKTtcbiAgICAgICAgcmV0dXJuIHJ1bGU7XG4gICAgfTtcbiAgICByZXR1cm4gUnVsZVNlcnZpY2U7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gbmV3IFJ1bGVTZXJ2aWNlKCk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9