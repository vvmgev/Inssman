/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/*!****************************!*\
  !*** ./src/popup/popup.ts ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
}; // Initialize butotn with users's prefered color


var changeColor = document.getElementById("changeColor");
chrome.storage.sync.get("color", function (_ref) {
  var color = _ref.color;
  changeColor.style.backgroundColor = color;
}); // When the button is clicked, inject setPageBackgroundColor into current page

changeColor.addEventListener("click", function () {
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var _yield$chrome$tabs$qu, _yield$chrome$tabs$qu2, tab;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return chrome.tabs.query({
              active: true,
              currentWindow: true
            });

          case 2:
            _yield$chrome$tabs$qu = _context.sent;
            _yield$chrome$tabs$qu2 = _slicedToArray(_yield$chrome$tabs$qu, 1);
            tab = _yield$chrome$tabs$qu2[0];

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
}); // The body of this function will be execuetd as a content script inside the
// current page

function setPageBackgroundColor() {
  chrome.storage.sync.get("color", function (_ref2) {
    var color = _ref2.color;
    document.body.style.backgroundColor = color;
  });
}

console.log(chrome.declarativeNetRequest.getDynamicRules);

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAvcG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsSUFBSUEsU0FBUyxHQUFJLFNBQUksSUFBSSxTQUFJLENBQUNBLFNBQWQsSUFBNEIsVUFBVUMsT0FBVixFQUFtQkMsVUFBbkIsRUFBK0JDLENBQS9CLEVBQWtDQyxTQUFsQyxFQUE2QztFQUNyRixTQUFTQyxLQUFULENBQWVDLEtBQWYsRUFBc0I7SUFBRSxPQUFPQSxLQUFLLFlBQVlILENBQWpCLEdBQXFCRyxLQUFyQixHQUE2QixJQUFJSCxDQUFKLENBQU0sVUFBVUksT0FBVixFQUFtQjtNQUFFQSxPQUFPLENBQUNELEtBQUQsQ0FBUDtJQUFpQixDQUE1QyxDQUFwQztFQUFvRjs7RUFDNUcsT0FBTyxLQUFLSCxDQUFDLEtBQUtBLENBQUMsR0FBR0ssT0FBVCxDQUFOLEVBQXlCLFVBQVVELE9BQVYsRUFBbUJFLE1BQW5CLEVBQTJCO0lBQ3ZELFNBQVNDLFNBQVQsQ0FBbUJKLEtBQW5CLEVBQTBCO01BQUUsSUFBSTtRQUFFSyxJQUFJLENBQUNQLFNBQVMsQ0FBQ1EsSUFBVixDQUFlTixLQUFmLENBQUQsQ0FBSjtNQUE4QixDQUFwQyxDQUFxQyxPQUFPTyxDQUFQLEVBQVU7UUFBRUosTUFBTSxDQUFDSSxDQUFELENBQU47TUFBWTtJQUFFOztJQUMzRixTQUFTQyxRQUFULENBQWtCUixLQUFsQixFQUF5QjtNQUFFLElBQUk7UUFBRUssSUFBSSxDQUFDUCxTQUFTLENBQUMsT0FBRCxDQUFULENBQW1CRSxLQUFuQixDQUFELENBQUo7TUFBa0MsQ0FBeEMsQ0FBeUMsT0FBT08sQ0FBUCxFQUFVO1FBQUVKLE1BQU0sQ0FBQ0ksQ0FBRCxDQUFOO01BQVk7SUFBRTs7SUFDOUYsU0FBU0YsSUFBVCxDQUFjSSxNQUFkLEVBQXNCO01BQUVBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjVCxPQUFPLENBQUNRLE1BQU0sQ0FBQ1QsS0FBUixDQUFyQixHQUFzQ0QsS0FBSyxDQUFDVSxNQUFNLENBQUNULEtBQVIsQ0FBTCxDQUFvQlcsSUFBcEIsQ0FBeUJQLFNBQXpCLEVBQW9DSSxRQUFwQyxDQUF0QztJQUFzRjs7SUFDOUdILElBQUksQ0FBQyxDQUFDUCxTQUFTLEdBQUdBLFNBQVMsQ0FBQ2MsS0FBVixDQUFnQmpCLE9BQWhCLEVBQXlCQyxVQUFVLElBQUksRUFBdkMsQ0FBYixFQUF5RFUsSUFBekQsRUFBRCxDQUFKO0VBQ0gsQ0FMTSxDQUFQO0FBTUgsQ0FSRCxFQVNBOzs7QUFDQSxJQUFJTyxXQUFXLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixhQUF4QixDQUFsQjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsQ0FBZUMsSUFBZixDQUFvQkMsR0FBcEIsQ0FBd0IsT0FBeEIsRUFBaUMsZ0JBQWU7RUFBQSxJQUFaQyxLQUFZLFFBQVpBLEtBQVk7RUFDNUNQLFdBQVcsQ0FBQ1EsS0FBWixDQUFrQkMsZUFBbEIsR0FBb0NGLEtBQXBDO0FBQ0gsQ0FGRCxHQUdBOztBQUNBUCxXQUFXLENBQUNVLGdCQUFaLENBQTZCLE9BQTdCLEVBQXNDO0VBQUEsT0FBTTdCLFNBQVMsQ0FBQyxLQUFLLENBQU4sRUFBUyxLQUFLLENBQWQsRUFBaUIsS0FBSyxDQUF0Qix1Q0FBeUI7SUFBQTs7SUFBQTtNQUFBO1FBQUE7VUFBQTtZQUFBO1lBQzlELE9BQU1zQixNQUFNLENBQUNRLElBQVAsQ0FBWUMsS0FBWixDQUFrQjtjQUFFQyxNQUFNLEVBQUUsSUFBVjtjQUFnQkMsYUFBYSxFQUFFO1lBQS9CLENBQWxCLENBQU47O1VBRDhEO1lBQUE7WUFBQTtZQUNyRUMsR0FEcUU7O1VBQUE7VUFBQTtZQUFBO1FBQUE7TUFBQTtJQUFBO0VBQUEsQ0FBekIsRUFBZjtBQUFBLENBQXRDLEdBT0E7QUFDQTs7QUFDQSxTQUFTQyxzQkFBVCxHQUFrQztFQUM5QmIsTUFBTSxDQUFDQyxPQUFQLENBQWVDLElBQWYsQ0FBb0JDLEdBQXBCLENBQXdCLE9BQXhCLEVBQWlDLGlCQUFlO0lBQUEsSUFBWkMsS0FBWSxTQUFaQSxLQUFZO0lBQzVDTixRQUFRLENBQUNnQixJQUFULENBQWNULEtBQWQsQ0FBb0JDLGVBQXBCLEdBQXNDRixLQUF0QztFQUNILENBRkQ7QUFHSDs7QUFDRFcsT0FBTyxDQUFDQyxHQUFSLENBQVloQixNQUFNLENBQUNpQixxQkFBUCxDQUE2QkMsZUFBekMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vdmVycmlkZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb3ZlcnJpZGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb3ZlcnJpZGVyLy4vc3JjL3BvcHVwL3BvcHVwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vIEluaXRpYWxpemUgYnV0b3RuIHdpdGggdXNlcnMncyBwcmVmZXJlZCBjb2xvclxubGV0IGNoYW5nZUNvbG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFuZ2VDb2xvclwiKTtcbmNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFwiY29sb3JcIiwgKHsgY29sb3IgfSkgPT4ge1xuICAgIGNoYW5nZUNvbG9yLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xufSk7XG4vLyBXaGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZCwgaW5qZWN0IHNldFBhZ2VCYWNrZ3JvdW5kQ29sb3IgaW50byBjdXJyZW50IHBhZ2VcbmNoYW5nZUNvbG9yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICBsZXQgW3RhYl0gPSB5aWVsZCBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9KTtcbiAgICAvLyBjaHJvbWUuc2NyaXB0aW5nLmV4ZWN1dGVTY3JpcHQoe1xuICAgIC8vICAgdGFyZ2V0OiB7IHRhYklkOiB0YWIuaWQgfSxcbiAgICAvLyAgIGZ1bmN0aW9uOiBzZXRQYWdlQmFja2dyb3VuZENvbG9yLFxuICAgIC8vIH0pO1xufSkpO1xuLy8gVGhlIGJvZHkgb2YgdGhpcyBmdW5jdGlvbiB3aWxsIGJlIGV4ZWN1ZXRkIGFzIGEgY29udGVudCBzY3JpcHQgaW5zaWRlIHRoZVxuLy8gY3VycmVudCBwYWdlXG5mdW5jdGlvbiBzZXRQYWdlQmFja2dyb3VuZENvbG9yKCkge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFwiY29sb3JcIiwgKHsgY29sb3IgfSkgPT4ge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICAgIH0pO1xufVxuY29uc29sZS5sb2coY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC5nZXREeW5hbWljUnVsZXMpO1xuZXhwb3J0IHt9O1xuIl0sIm5hbWVzIjpbIl9fYXdhaXRlciIsInRoaXNBcmciLCJfYXJndW1lbnRzIiwiUCIsImdlbmVyYXRvciIsImFkb3B0IiwidmFsdWUiLCJyZXNvbHZlIiwiUHJvbWlzZSIsInJlamVjdCIsImZ1bGZpbGxlZCIsInN0ZXAiLCJuZXh0IiwiZSIsInJlamVjdGVkIiwicmVzdWx0IiwiZG9uZSIsInRoZW4iLCJhcHBseSIsImNoYW5nZUNvbG9yIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImNocm9tZSIsInN0b3JhZ2UiLCJzeW5jIiwiZ2V0IiwiY29sb3IiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0YWJzIiwicXVlcnkiLCJhY3RpdmUiLCJjdXJyZW50V2luZG93IiwidGFiIiwic2V0UGFnZUJhY2tncm91bmRDb2xvciIsImJvZHkiLCJjb25zb2xlIiwibG9nIiwiZGVjbGFyYXRpdmVOZXRSZXF1ZXN0IiwiZ2V0RHluYW1pY1J1bGVzIl0sInNvdXJjZVJvb3QiOiIifQ==