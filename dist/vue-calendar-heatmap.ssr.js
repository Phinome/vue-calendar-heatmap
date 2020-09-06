'use strict';Object.defineProperty(exports,'__esModule',{value:true});var vTooltip=require('v-tooltip');function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var DEFAULT_RANGE_COLOR = ['#ebedf0', '#f5f6f7', '#D6E8FF', '#3370ff', '#1237B3', '#041466'];
var DEFAULT_LOCALE = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  on: 'on',
  tooltipUnit: 'contributions',
  tooltipEmptyUnit: 'No '
};
var DAYS_IN_ONE_YEAR = 365;
var DAYS_IN_WEEK = 7;
var SQUARE_SIZE = 10;var CalendarHeatmap = /*#__PURE__*/function () {
  function CalendarHeatmap(values, max) {
    _classCallCheck(this, CalendarHeatmap);

    this.values = values;
    this.max = max || Math.ceil(Math.max.apply(Math, _toConsumableArray(values.map(function (day) {
      return day.count;
    }))) / 5 * 4);

    if (values.length) {
      this.startDate = this._parseDate(values[0].date);
      this.endDate = this._parseDate(values[values.length - 1].date);
    } else {
      this.startDate = this._shiftDate(new Date(), -DAYS_IN_ONE_YEAR);
      this.endDate = new Date();
    }
  }

  _createClass(CalendarHeatmap, [{
    key: "getColorIndex",
    value: function getColorIndex(value) {
      if (value == null || value === undefined) {
        return 0;
      } else if (value <= 0) {
        return 1;
      } else if (value >= this.max) {
        return 5;
      } else {
        return Math.ceil(value * 100 / this.max * 0.03) + 1;
      }
    }
  }, {
    key: "getCountEmptyDaysAtStart",
    value: function getCountEmptyDaysAtStart() {
      return this.startDate.getDay();
    }
  }, {
    key: "getCountEmptyDaysAtEnd",
    value: function getCountEmptyDaysAtEnd() {
      return DAYS_IN_WEEK - 1 - this.endDate.getDay();
    }
  }, {
    key: "getDaysCount",
    value: function getDaysCount() {
      return this.values.length;
    }
  }, {
    key: "_shiftDate",
    value: function _shiftDate(date, numDays) {
      var newDate = new Date(date);
      newDate.setDate(newDate.getDate() + numDays);
      return newDate;
    }
  }, {
    key: "_parseDate",
    value: function _parseDate(entry) {
      return entry instanceof Date ? entry : new Date(entry);
    }
  }, {
    key: "_keyDayParser",
    value: function _keyDayParser(date) {
      var day = this._parseDate(date);

      return "".concat(day.getFullYear(), "-").concat(day.getMonth(), "-").concat(day.getDate());
    }
  }, {
    key: "activities",
    get: function get() {
      var _this = this;

      return this.values.reduce(function (newValues, day) {
        newValues[_this._keyDayParser(day.date)] = {
          count: day.count,
          colorIndex: _this.getColorIndex(day.count)
        };
        return newValues;
      }, {});
    }
  }, {
    key: "weekCount",
    get: function get() {
      var count = this.getDaysCount() / DAYS_IN_WEEK;
      return this.getDaysCount() % DAYS_IN_WEEK === 0 ? count : count + 1;
    }
  }, {
    key: "calendar",
    get: function get() {
      var _this2 = this;

      var date = new Date(this.startDate);
      return Array.from({
        length: this.weekCount
      }, function () {
        return Array.from({
          length: DAYS_IN_WEEK
        }, function () {
          var dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

          var dayValues = _this2.activities[_this2._keyDayParser(dDate)];

          date.setDate(date.getDate() + 1);
          return {
            date: dDate,
            count: dayValues ? dayValues.count : null,
            colorIndex: dayValues ? dayValues.colorIndex : 0
          };
        });
      });
    }
  }, {
    key: "firstFullWeekOfMonths",
    get: function get() {
      return this.calendar.reduce(function (months, week, index, weeks) {
        if (index > 0) {
          var lastWeek = weeks[index - 1][0].date;
          var currentWeek = week[0].date;

          if (lastWeek.getFullYear() < currentWeek.getFullYear() || lastWeek.getMonth() < currentWeek.getMonth()) {
            months.push({
              value: currentWeek.getMonth(),
              index: index
            });
          }
        } else {
          months.push({
            value: week[0].date.getMonth(),
            index: 0
          });
        }

        return months;
      }, []);
    }
  }]);

  return CalendarHeatmap;
}();//
var script = {
  name: 'CalendarHeatmap',
  directives: {
    tooltip: vTooltip.VTooltip
  },
  props: {
    max: {
      type: Number
    },
    rangeColor: {
      type: Array,
      default: function _default() {
        return DEFAULT_RANGE_COLOR;
      }
    },
    values: {
      required: true,
      type: Array
    },
    locale: {
      type: Object
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    vertical: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: String,
      default: null
    },
    isAutoFillWeek: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      clickedIndex: -1
    };
  },
  computed: {
    position: function position() {
      return this.vertical ? 'vertical' : 'horizontal';
    },
    tooltipTransform: function tooltipTransform() {
      return "translate(".concat(this.tooltipX, ", ").concat(this.tooltipY, ")");
    },
    heatmap: function heatmap() {
      return new CalendarHeatmap(this.values, this.max);
    },
    width: function width() {
      return {
        horizontal: this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * this.heatmap.weekCount + this.SQUARE_BORDER_SIZE,
        vertical: this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * DAYS_IN_WEEK + this.RIGHT_SECTION_WIDTH
      };
    },
    heigth: function heigth() {
      return {
        horizontal: this.TOP_SECTION_HEIGTH + this.SQUARE_SIZE * DAYS_IN_WEEK + this.SQUARE_BORDER_SIZE + this.BOTTOM_SECTION_HEIGTH,
        vertical: this.TOP_SECTION_HEIGTH + this.SQUARE_SIZE * this.heatmap.weekCount + this.SQUARE_BORDER_SIZE
      };
    },
    viewbox: function viewbox() {
      return "0 0 ".concat(this.width[this.position], " ").concat(this.heigth[this.position]);
    },
    daysLabelWrapperTransform: function daysLabelWrapperTransform() {
      return {
        horizontal: "translate(0, ".concat(this.TOP_SECTION_HEIGTH, ")"),
        vertical: "translate(".concat(this.LEFT_SECTION_WIDTH, ", 0)")
      };
    },
    monthsLabelWrapperTransform: function monthsLabelWrapperTransform() {
      return {
        horizontal: "translate(".concat(this.LEFT_SECTION_WIDTH, ", 0)"),
        vertical: "translate(0, ".concat(this.TOP_SECTION_HEIGTH, ")")
      };
    },
    legendWrapperTransform: function legendWrapperTransform() {
      return {
        horizontal: "translate(".concat(this.width[this.position] - this.SQUARE_SIZE * this.rangeColor.length - 30, ", ").concat(this.heigth[this.position] - this.BOTTOM_SECTION_HEIGTH, ")"),
        vertical: "translate(".concat(this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * DAYS_IN_WEEK, ", ").concat(this.TOP_SECTION_HEIGTH, ")")
      };
    },
    yearWrapperTransform: function yearWrapperTransform() {
      return "translate(".concat(this.LEFT_SECTION_WIDTH, ", ").concat(this.TOP_SECTION_HEIGTH, ")");
    },
    SQUARE_BORDER_SIZE: function SQUARE_BORDER_SIZE() {
      return SQUARE_SIZE / 5;
    },
    SQUARE_SIZE: function SQUARE_SIZE$1() {
      return SQUARE_SIZE + this.SQUARE_BORDER_SIZE;
    },
    TOP_SECTION_HEIGTH: function TOP_SECTION_HEIGTH() {
      return this.SQUARE_SIZE * 1.8;
    },
    RIGHT_SECTION_WIDTH: function RIGHT_SECTION_WIDTH() {
      return this.SQUARE_SIZE * 3;
    },
    BOTTOM_SECTION_HEIGTH: function BOTTOM_SECTION_HEIGTH() {
      return SQUARE_SIZE + SQUARE_SIZE / 2;
    },
    LEFT_SECTION_WIDTH: function LEFT_SECTION_WIDTH() {
      return Math.ceil(SQUARE_SIZE * 2.5);
    },
    lo: function lo() {
      if (this.locale) {
        return {
          months: this.locale.months || DEFAULT_LOCALE.months,
          days: this.locale.days || DEFAULT_LOCALE.days,
          on: this.locale.on || DEFAULT_LOCALE.on,
          tooltipUnit: this.locale.tooltipUnit || DEFAULT_LOCALE.tooltipUnit,
          tooltipEmptyUnit: this.locale.tooltipEmptyUnit || DEFAULT_LOCALE.tooltipEmptyUnit
        };
      }

      return DEFAULT_LOCALE;
    },
    startDayIndex: function startDayIndex() {
      return (this.heatmap.startDate.getDate() + 1) % 7;
    }
  },
  watch: {
    values: {
      handler: function handler() {
        this.clickedIndex = -1;
      },
      immediate: true
    }
  },
  methods: {
    getDateIndex: function getDateIndex(offset) {
      return (this.heatmap.startDate.getDay() + offset) % 7;
    },
    handleSquareClick: function handleSquareClick(day, dayIndex) {
      if (this.clickedIndex === dayIndex) {
        this.clickedIndex = -1;
      } else {
        this.clickedIndex = dayIndex;
      }

      this.$emit('day-click', day);
    },
    tooltipOptions: function tooltipOptions(day) {
      var defaultTooltipContent = "<b>".concat(day.count ? [day.count, this.lo.tooltipUnit].join(' ') : [this.lo.tooltipEmptyUnit, this.lo.tooltipUnit].join(''), "</b> ").concat(this.lo.on, " ").concat(day.date.getFullYear(), "-").concat(day.date.getMonth() + 1, "-").concat(day.date.getDate());

      if (this.tooltip) {
        if (day.count != null) {
          return {
            content: defaultTooltipContent,
            delay: {
              show: 300,
              hide: 50
            }
          };
        } else if (this.noDataText) {
          return {
            content: "".concat(this.noDataText),
            delay: {
              show: 300,
              hide: 50
            }
          };
        }
      }

      return false;
    },
    getFilterWeek: function getFilterWeek(week) {
      return this.isAutoFillWeek ? week : week.filter(function (_ref) {
        var date = _ref.date;
        return date <= new Date();
      });
    },
    getWeekPosition: function getWeekPosition(index) {
      if (this.vertical) {
        return "translate(0, ".concat(this.SQUARE_SIZE * this.heatmap.weekCount - (index + 1) * this.SQUARE_SIZE, ")");
      }

      return "translate(".concat(index * this.SQUARE_SIZE, ", 0)");
    },
    getDayPosition: function getDayPosition(index) {
      if (this.vertical) {
        return "translate(".concat(index * this.SQUARE_SIZE, ", 0)");
      }

      return "translate(0, ".concat(index * this.SQUARE_SIZE, ")");
    },
    getMonthLabelPostion: function getMonthLabelPostion(month) {
      var position = {
        x: 0,
        y: 0
      };
      position.x = this.vertical ? 3 : this.SQUARE_SIZE * month.index;
      position.y = this.vertical ? this.SQUARE_SIZE * this.heatmap.weekCount - this.SQUARE_SIZE * month.index - this.SQUARE_SIZE / 4 : this.SQUARE_SIZE - this.SQUARE_BORDER_SIZE;
      return position;
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    staticClass: "vch__wrapper",
    attrs: {
      "viewBox": _vm.viewbox
    }
  }, [_vm._ssrNode("<g" + _vm._ssrAttr("transform", _vm.monthsLabelWrapperTransform[_vm.position]) + " class=\"vch__months__labels__wrapper\" data-v-881ae6c6>" + _vm._ssrList(_vm.heatmap.firstFullWeekOfMonths, function (month, index) {
    return "<text" + _vm._ssrAttr("x", _vm.getMonthLabelPostion(month).x) + _vm._ssrAttr("y", _vm.getMonthLabelPostion(month).y) + " class=\"vch__month__label\" data-v-881ae6c6>" + _vm._ssrEscape("\n      " + _vm._s(_vm.lo.months[month.value]) + "\n    ") + "</text>";
  }) + "</g> <g" + _vm._ssrAttr("transform", _vm.daysLabelWrapperTransform[_vm.position]) + " class=\"vch__days__labels__wrapper\" data-v-881ae6c6><text" + _vm._ssrAttr("x", _vm.vertical ? _vm.SQUARE_SIZE * 1 : 0) + _vm._ssrAttr("y", _vm.vertical ? _vm.SQUARE_SIZE - _vm.SQUARE_BORDER_SIZE : 18) + " class=\"vch__day__label\" data-v-881ae6c6>" + _vm._ssrEscape("\n      " + _vm._s(_vm.lo.days[_vm.getDateIndex(1)]) + "\n    ") + "</text> <text" + _vm._ssrAttr("x", _vm.vertical ? _vm.SQUARE_SIZE * 3 : 0) + _vm._ssrAttr("y", _vm.vertical ? _vm.SQUARE_SIZE - _vm.SQUARE_BORDER_SIZE : 42) + " class=\"vch__day__label\" data-v-881ae6c6>" + _vm._ssrEscape("\n      " + _vm._s(_vm.lo.days[_vm.getDateIndex(3)]) + "\n    ") + "</text> <text" + _vm._ssrAttr("x", _vm.vertical ? _vm.SQUARE_SIZE * 5 : 0) + _vm._ssrAttr("y", _vm.vertical ? _vm.SQUARE_SIZE - _vm.SQUARE_BORDER_SIZE : 67) + " class=\"vch__day__label\" data-v-881ae6c6>" + _vm._ssrEscape("\n      " + _vm._s(_vm.lo.days[_vm.getDateIndex(5)]) + "\n    ") + "</text></g> "), _vm._ssrNode("<g" + _vm._ssrAttr("transform", _vm.yearWrapperTransform) + _vm._ssrClass(null, ['vch__year__wrapper', this.clickedIndex !== -1 ? 'vch__days__selected' : '']) + " data-v-881ae6c6>", "</g>", _vm._l(_vm.heatmap.calendar, function (week, weekIndex) {
    return _vm._ssrNode("<g" + _vm._ssrAttr("transform", _vm.getWeekPosition(weekIndex)) + " class=\"vch__month__wrapper\" data-v-881ae6c6>", "</g>", _vm._l(_vm.getFilterWeek(week), function (day, dayIndex) {
      return _c('rect', {
        directives: [{
          name: "tooltip",
          rawName: "v-tooltip",
          value: _vm.tooltipOptions(day),
          expression: "tooltipOptions(day)"
        }],
        key: dayIndex,
        class: ['vch__day__square', _vm.clickedIndex === "" + (weekIndex * 10 + dayIndex) ? 'vch__day__square__actived' : ''],
        style: {
          fill: _vm.rangeColor[day.colorIndex]
        },
        attrs: {
          "transform": _vm.getDayPosition(dayIndex),
          "width": _vm.SQUARE_SIZE - _vm.SQUARE_BORDER_SIZE,
          "height": _vm.SQUARE_SIZE - _vm.SQUARE_BORDER_SIZE
        },
        on: {
          "click": function click($event) {
            return _vm.handleSquareClick(day.date, "" + (weekIndex * 10 + dayIndex));
          }
        }
      }, []);
    }), 0);
  }), 0)], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-881ae6c6_0", {
    source: "div.vch__container[data-v-881ae6c6]{position:relative}svg.vch__wrapper[data-v-881ae6c6]{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;line-height:10px}svg.vch__wrapper .vch__months__labels__wrapper text.vch__month__label[data-v-881ae6c6]{font-size:8px}svg.vch__wrapper .vch__days__labels__wrapper text.vch__day__label[data-v-881ae6c6]{font-size:8px}svg.vch__wrapper .vch__days__labels__wrapper text.vch__day__label[data-v-881ae6c6],svg.vch__wrapper .vch__months__labels__wrapper text.vch__month__label[data-v-881ae6c6]{fill:#767676}svg.vch__wrapper rect.vch__day__square[data-v-881ae6c6]:focus{outline:0}svg.vch__wrapper g.vch__days__selected rect[data-v-881ae6c6]{opacity:.5}svg.vch__wrapper g.vch__year__wrapper rect.vch__day__square__actived[data-v-881ae6c6]{opacity:1}",
    map: undefined,
    media: undefined
  }), inject("data-v-881ae6c6_1", {
    source: ".vue-tooltip-theme.tooltip{display:block!important;z-index:10000}.vue-tooltip-theme.tooltip .tooltip-inner{background:rgba(0,0,0,.7);border-radius:3px;color:#ebedf0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size:12px;line-height:16px;padding:14px 10px}.vue-tooltip-theme.tooltip .tooltip-inner b{color:#fff}.vue-tooltip-theme.tooltip .tooltip-arrow{width:0;height:0;border-style:solid;position:absolute;margin:5px;border-color:#000;z-index:1}.vue-tooltip-theme.tooltip[x-placement^=top]{margin-bottom:5px}.vue-tooltip-theme.tooltip[x-placement^=top] .tooltip-arrow{border-width:5px 5px 0 5px;border-left-color:transparent!important;border-right-color:transparent!important;border-bottom-color:transparent!important;bottom:-5px;left:calc(50% - 5px);margin-top:0;margin-bottom:0}.vue-tooltip-theme.tooltip[x-placement^=bottom]{margin-top:5px}.vue-tooltip-theme.tooltip[x-placement^=bottom] .tooltip-arrow{border-width:0 5px 5px 5px;border-left-color:transparent!important;border-right-color:transparent!important;border-top-color:transparent!important;top:-5px;left:calc(50% - 5px);margin-top:0;margin-bottom:0}.vue-tooltip-theme.tooltip[x-placement^=right]{margin-left:5px}.vue-tooltip-theme.tooltip[x-placement^=right] .tooltip-arrow{border-width:5px 5px 5px 0;border-left-color:transparent!important;border-top-color:transparent!important;border-bottom-color:transparent!important;left:-5px;top:calc(50% - 5px);margin-left:0;margin-right:0}.vue-tooltip-theme.tooltip[x-placement^=left]{margin-right:5px}.vue-tooltip-theme.tooltip[x-placement^=left] .tooltip-arrow{border-width:5px 0 5px 5px;border-top-color:transparent!important;border-right-color:transparent!important;border-bottom-color:transparent!important;right:-5px;top:calc(50% - 5px);margin-left:0;margin-right:0}.vue-tooltip-theme.tooltip[aria-hidden=true]{visibility:hidden;opacity:0;transition:opacity .15s,visibility .15s}.vue-tooltip-theme.tooltip[aria-hidden=false]{visibility:visible;opacity:1;transition:opacity .15s}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-881ae6c6";
/* module identifier */

var __vue_module_identifier__ = "data-v-881ae6c6";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);/* eslint-disable import/prefer-default-export */var components=/*#__PURE__*/Object.freeze({__proto__:null,VueCalendarHeatmap: __vue_component__});var install = function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        componentName = _ref2[0],
        component = _ref2[1];

    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Default export is library as a whole, registered via Vue.use()
exports.VueCalendarHeatmap=__vue_component__;exports.default=plugin;