/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/models/formField.ts":
/*!*********************************!*\
  !*** ./src/models/formField.ts ***!
  \*********************************/
/***/ (() => {

throw new Error("Module build failed (from ./node_modules/ts-loader/index.js):\nError: TypeScript emitted no output for /Users/gevorgbaghdasaryan/test/overriderOld/src/models/formField.ts.\n    at makeSourceMapAndFinish (/Users/gevorgbaghdasaryan/test/overriderOld/node_modules/ts-loader/dist/index.js:52:18)\n    at successLoader (/Users/gevorgbaghdasaryan/test/overriderOld/node_modules/ts-loader/dist/index.js:39:5)\n    at Object.loader (/Users/gevorgbaghdasaryan/test/overriderOld/node_modules/ts-loader/dist/index.js:22:5)");

/***/ }),

/***/ "./src/models/postMessageAction.ts":
/*!*****************************************!*\
  !*** ./src/models/postMessageAction.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./src/options/options.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var formField_1 = __webpack_require__(/*! ../models/formField */ "./src/models/formField.ts");
var postMessageAction_1 = __webpack_require__(/*! ../models/postMessageAction */ "./src/models/postMessageAction.ts");
// const data: FormField = {
//   matchType: MatchType.CONTAIN,
//   condition : {
//     resourceTypes: [ResourceType.SCRIPT],
//     requestMethods: [],
//     // urlFilter: 'https://web-button.staging.getmati.com/button.js',
//     urlFilter: '*://web-button.staging.*.com/abutton.js',
//   },
//   action: {
//     type: RuleActionType.BLOCK,
//   },
// }
var data = {
    matchType: formField_1.MatchType.CONTAIN,
    "action": {
        "type": "redirect",
        "redirect": {
            "regexSubstitution": "https://\\1.xyz.com/"
        }
    },
    "condition": {
        "regexFilter": "^https://www\\.(abc|def)\\.xyz\\.com/",
        "resourceTypes": [
            "main_frame"
        ]
    }
};
chrome.runtime.sendMessage({ action: postMessageAction_1.PostMessageAction.AddRule, data: data });
// chrome.runtime.sendMessage({action: PostMessageAction.GetRules}, (rules: Rule[]) => {
// })

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy9vcHRpb25zLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxvREFBb0QseUJBQXlCLEtBQUs7Ozs7Ozs7VUNWbkY7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0JBQWtCLG1CQUFPLENBQUMsc0RBQXFCO0FBQy9DLDBCQUEwQixtQkFBTyxDQUFDLHNFQUE2QjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsbUVBQW1FO0FBQ2hHLCtCQUErQixtQ0FBbUM7QUFDbEUsSUFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL292ZXJyaWRlci8uL3NyYy9tb2RlbHMvcG9zdE1lc3NhZ2VBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vb3ZlcnJpZGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL292ZXJyaWRlci8uL3NyYy9vcHRpb25zL29wdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBvc3RNZXNzYWdlQWN0aW9uID0gdm9pZCAwO1xudmFyIFBvc3RNZXNzYWdlQWN0aW9uO1xuKGZ1bmN0aW9uIChQb3N0TWVzc2FnZUFjdGlvbikge1xuICAgIFBvc3RNZXNzYWdlQWN0aW9uW1Bvc3RNZXNzYWdlQWN0aW9uW1wiQWRkUnVsZVwiXSA9IDBdID0gXCJBZGRSdWxlXCI7XG4gICAgUG9zdE1lc3NhZ2VBY3Rpb25bUG9zdE1lc3NhZ2VBY3Rpb25bXCJVcGRhdGVSdWxlXCJdID0gMV0gPSBcIlVwZGF0ZVJ1bGVcIjtcbiAgICBQb3N0TWVzc2FnZUFjdGlvbltQb3N0TWVzc2FnZUFjdGlvbltcIkRlbGV0ZVJ1bGVcIl0gPSAyXSA9IFwiRGVsZXRlUnVsZVwiO1xuICAgIFBvc3RNZXNzYWdlQWN0aW9uW1Bvc3RNZXNzYWdlQWN0aW9uW1wiR2V0UnVsZXNcIl0gPSAzXSA9IFwiR2V0UnVsZXNcIjtcbiAgICBQb3N0TWVzc2FnZUFjdGlvbltQb3N0TWVzc2FnZUFjdGlvbltcIkxvZ1wiXSA9IDRdID0gXCJMb2dcIjtcbn0pKFBvc3RNZXNzYWdlQWN0aW9uID0gZXhwb3J0cy5Qb3N0TWVzc2FnZUFjdGlvbiB8fCAoZXhwb3J0cy5Qb3N0TWVzc2FnZUFjdGlvbiA9IHt9KSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZm9ybUZpZWxkXzEgPSByZXF1aXJlKFwiLi4vbW9kZWxzL2Zvcm1GaWVsZFwiKTtcbnZhciBwb3N0TWVzc2FnZUFjdGlvbl8xID0gcmVxdWlyZShcIi4uL21vZGVscy9wb3N0TWVzc2FnZUFjdGlvblwiKTtcbi8vIGNvbnN0IGRhdGE6IEZvcm1GaWVsZCA9IHtcbi8vICAgbWF0Y2hUeXBlOiBNYXRjaFR5cGUuQ09OVEFJTixcbi8vICAgY29uZGl0aW9uIDoge1xuLy8gICAgIHJlc291cmNlVHlwZXM6IFtSZXNvdXJjZVR5cGUuU0NSSVBUXSxcbi8vICAgICByZXF1ZXN0TWV0aG9kczogW10sXG4vLyAgICAgLy8gdXJsRmlsdGVyOiAnaHR0cHM6Ly93ZWItYnV0dG9uLnN0YWdpbmcuZ2V0bWF0aS5jb20vYnV0dG9uLmpzJyxcbi8vICAgICB1cmxGaWx0ZXI6ICcqOi8vd2ViLWJ1dHRvbi5zdGFnaW5nLiouY29tL2FidXR0b24uanMnLFxuLy8gICB9LFxuLy8gICBhY3Rpb246IHtcbi8vICAgICB0eXBlOiBSdWxlQWN0aW9uVHlwZS5CTE9DSyxcbi8vICAgfSxcbi8vIH1cbnZhciBkYXRhID0ge1xuICAgIG1hdGNoVHlwZTogZm9ybUZpZWxkXzEuTWF0Y2hUeXBlLkNPTlRBSU4sXG4gICAgXCJhY3Rpb25cIjoge1xuICAgICAgICBcInR5cGVcIjogXCJyZWRpcmVjdFwiLFxuICAgICAgICBcInJlZGlyZWN0XCI6IHtcbiAgICAgICAgICAgIFwicmVnZXhTdWJzdGl0dXRpb25cIjogXCJodHRwczovL1xcXFwxLnh5ei5jb20vXCJcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJjb25kaXRpb25cIjoge1xuICAgICAgICBcInJlZ2V4RmlsdGVyXCI6IFwiXmh0dHBzOi8vd3d3XFxcXC4oYWJjfGRlZilcXFxcLnh5elxcXFwuY29tL1wiLFxuICAgICAgICBcInJlc291cmNlVHlwZXNcIjogW1xuICAgICAgICAgICAgXCJtYWluX2ZyYW1lXCJcbiAgICAgICAgXVxuICAgIH1cbn07XG5jaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IGFjdGlvbjogcG9zdE1lc3NhZ2VBY3Rpb25fMS5Qb3N0TWVzc2FnZUFjdGlvbi5BZGRSdWxlLCBkYXRhOiBkYXRhIH0pO1xuLy8gY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2FjdGlvbjogUG9zdE1lc3NhZ2VBY3Rpb24uR2V0UnVsZXN9LCAocnVsZXM6IFJ1bGVbXSkgPT4ge1xuLy8gfSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==