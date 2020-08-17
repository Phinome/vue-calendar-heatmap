import { VTooltip } from 'v-tooltip';

const DEFAULT_RANGE_COLOR = ['#ebedf0', '#f5f6f7', '#D6E8FF', '#3370ff', '#1237B3', '#041466'];
const DEFAULT_LOCALE = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  on: 'on',
  tooltipUnit: 'contributions'
};
const DAYS_IN_WEEK = 7;
const SQUARE_SIZE = 10;

class CalendarHeatmap {
  constructor(values, max) {
    if (!values.length) {
      throw new Error('values must not be empty');
    }

    this.values = values;
    this.startDate = this._parseDate(values[0].date);
    this.endDate = this._parseDate(values[values.length - 1].date);
    this.max = max || Math.ceil(Math.max(...values.map(day => day.count)) / 5 * 4);
  }

  get activities() {
    return this.values.reduce((newValues, day) => {
      newValues[this._keyDayParser(day.date)] = {
        count: day.count,
        colorIndex: this.getColorIndex(day.count)
      };
      return newValues;
    }, {});
  }

  get weekCount() {
    const count = this.getDaysCount() / DAYS_IN_WEEK;
    return this.getDaysCount() % DAYS_IN_WEEK === 0 ? count : count + 1;
  }

  get calendar() {
    let date = new Date(this.startDate);
    return Array.from({
      length: this.weekCount
    }, () => Array.from({
      length: DAYS_IN_WEEK
    }, () => {
      let dDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      let dayValues = this.activities[this._keyDayParser(dDate)];

      date.setDate(date.getDate() + 1);
      return {
        date: dDate,
        count: dayValues ? dayValues.count : null,
        colorIndex: dayValues ? dayValues.colorIndex : 0
      };
    }));
  }

  get firstFullWeekOfMonths() {
    return this.calendar.reduce((months, week, index, weeks) => {
      if (index > 0) {
        let lastWeek = weeks[index - 1][0].date;
        let currentWeek = week[0].date;

        if (lastWeek.getFullYear() < currentWeek.getFullYear() || lastWeek.getMonth() < currentWeek.getMonth()) {
          months.push({
            value: currentWeek.getMonth(),
            index
          });
        }
      }

      return months;
    }, []);
  }

  getColorIndex(value) {
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

  getCountEmptyDaysAtStart() {
    return this.startDate.getDay();
  }

  getCountEmptyDaysAtEnd() {
    return DAYS_IN_WEEK - 1 - this.endDate.getDay();
  }

  getDaysCount() {
    return this.values.length;
  }

  _parseDate(entry) {
    return entry instanceof Date ? entry : new Date(entry);
  }

  _keyDayParser(date) {
    let day = this._parseDate(date);

    return `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
  }

}

//

var script = {
  name: 'VueCalendarHeatmap',
  directives: {
    tooltip: VTooltip
  },
  props: {
    max: {
      type: Number
    },
    rangeColor: {
      type: Array,
      default: () => DEFAULT_RANGE_COLOR
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
    tooltipContent: {
      type: String
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

  data() {
    return {
      clickedIndex: -1
    };
  },

  computed: {
    position() {
      return this.vertical ? 'vertical' : 'horizontal';
    },

    tooltipTransform() {
      return `translate(${this.tooltipX}, ${this.tooltipY})`;
    },

    heatmap() {
      return new CalendarHeatmap(this.values, this.max);
    },

    width() {
      return {
        horizontal: this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * this.heatmap.weekCount + this.SQUARE_BORDER_SIZE,
        vertical: this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * DAYS_IN_WEEK + this.RIGHT_SECTION_WIDTH
      };
    },

    heigth() {
      return {
        horizontal: this.TOP_SECTION_HEIGTH + this.SQUARE_SIZE * DAYS_IN_WEEK + this.SQUARE_BORDER_SIZE + this.BOTTOM_SECTION_HEIGTH,
        vertical: this.TOP_SECTION_HEIGTH + this.SQUARE_SIZE * this.heatmap.weekCount + this.SQUARE_BORDER_SIZE
      };
    },

    viewbox() {
      return `0 0 ${this.width[this.position]} ${this.heigth[this.position]}`;
    },

    daysLabelWrapperTransform() {
      return {
        horizontal: `translate(0, ${this.TOP_SECTION_HEIGTH})`,
        vertical: `translate(${this.LEFT_SECTION_WIDTH}, 0)`
      };
    },

    monthsLabelWrapperTransform() {
      return {
        horizontal: `translate(${this.LEFT_SECTION_WIDTH}, 0)`,
        vertical: `translate(0, ${this.TOP_SECTION_HEIGTH})`
      };
    },

    legendWrapperTransform() {
      return {
        horizontal: `translate(${this.width[this.position] - this.SQUARE_SIZE * this.rangeColor.length - 30}, ${this.heigth[this.position] - this.BOTTOM_SECTION_HEIGTH})`,
        vertical: `translate(${this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * DAYS_IN_WEEK}, ${this.TOP_SECTION_HEIGTH})`
      };
    },

    yearWrapperTransform() {
      return `translate(${this.LEFT_SECTION_WIDTH}, ${this.TOP_SECTION_HEIGTH})`;
    },

    SQUARE_BORDER_SIZE: () => SQUARE_SIZE / 5,

    SQUARE_SIZE() {
      return SQUARE_SIZE + this.SQUARE_BORDER_SIZE;
    },

    TOP_SECTION_HEIGTH() {
      return SQUARE_SIZE + SQUARE_SIZE / 2;
    },

    RIGHT_SECTION_WIDTH() {
      return this.SQUARE_SIZE * 3;
    },

    BOTTOM_SECTION_HEIGTH() {
      return SQUARE_SIZE + SQUARE_SIZE / 2;
    },

    LEFT_SECTION_WIDTH() {
      return Math.ceil(SQUARE_SIZE * 2.5);
    },

    lo() {
      if (this.locale) {
        return {
          months: this.locale.months || DEFAULT_LOCALE.months,
          days: this.locale.days || DEFAULT_LOCALE.days,
          on: this.locale.on || DEFAULT_LOCALE.on,
          tooltipUnit: this.locale.tooltipUnit || DEFAULT_LOCALE.tooltipUnit
        };
      }

      return DEFAULT_LOCALE;
    }

  },
  methods: {
    handleSquareClick(day, dayIndex) {
      if (this.clickedIndex === dayIndex) {
        this.clickedIndex = -1;
      } else {
        this.clickedIndex = dayIndex;
      }

      this.$emit('day-click', day);
    },

    tooltipOptions(day) {
      const defaultTooltipContent = `<b>${day.count} ${this.lo.tooltipUnit}</b> ${this.lo.on} ${this.lo.months[day.date.getMonth()]} ${day.date.getDate()}, ${day.date.getFullYear()}`;

      if (this.tooltip) {
        if (day.count != null) {
          return {
            content: this.tooltipContent ? this.tooltipContent : defaultTooltipContent,
            delay: {
              show: 300,
              hide: 50
            }
          };
        } else if (this.noDataText) {
          return {
            content: `${this.noDataText}`,
            delay: {
              show: 300,
              hide: 50
            }
          };
        }
      }

      return false;
    },

    getFilterWeek(week) {
      return this.isAutoFillWeek ? week : week.filter(({
        date
      }) => date <= new Date());
    },

    getWeekPosition(index) {
      if (this.vertical) {
        return `translate(0, ${this.SQUARE_SIZE * this.heatmap.weekCount - (index + 1) * this.SQUARE_SIZE})`;
      }

      return `translate(${index * this.SQUARE_SIZE}, 0)`;
    },

    getDayPosition(index) {
      if (this.vertical) {
        return `translate(${index * this.SQUARE_SIZE}, 0)`;
      }

      return `translate(0, ${index * this.SQUARE_SIZE})`;
    },

    getMonthLabelPostion(month) {
      let position = {
        x: 0,
        y: 0
      };
      position.x = this.vertical ? 3 : this.SQUARE_SIZE * month.index;
      position.y = this.vertical ? this.SQUARE_SIZE * this.heatmap.weekCount - this.SQUARE_SIZE * month.index - this.SQUARE_SIZE / 4 : this.SQUARE_SIZE - this.SQUARE_BORDER_SIZE;
      return position;
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('svg', {
    staticClass: "vch__wrapper",
    attrs: {
      "viewBox": _vm.viewbox
    }
  }, [_c('g', {
    staticClass: "vch__months__labels__wrapper",
    attrs: {
      "transform": _vm.monthsLabelWrapperTransform[_vm.position]
    }
  }, _vm._l(_vm.heatmap.firstFullWeekOfMonths, function (month, index) {
    return _c('text', {
      key: index,
      staticClass: "vch__month__label",
      attrs: {
        "x": _vm.getMonthLabelPostion(month).x,
        "y": _vm.getMonthLabelPostion(month).y
      }
    }, [_vm._v("\n      " + _vm._s(_vm.lo.months[month.value]) + "\n    ")]);
  }), 0), _vm._v(" "), _c('g', {
    staticClass: "vch__days__labels__wrapper",
    attrs: {
      "transform": _vm.daysLabelWrapperTransform[_vm.position]
    }
  }, [_c('text', {
    staticClass: "vch__day__label",
    attrs: {
      "x": _vm.vertical ? _vm.SQUARE_SIZE * 1 : 0,
      "y": _vm.vertical ? _vm.SQUARE_SIZE - _vm.SQUARE_BORDER_SIZE : 20
    }
  }, [_vm._v("\n      " + _vm._s(_vm.lo.days[1]) + "\n    ")]), _vm._v(" "), _c('text', {
    staticClass: "vch__day__label",
    attrs: {
      "x": _vm.vertical ? _vm.SQUARE_SIZE * 3 : 0,
      "y": _vm.vertical ? _vm.SQUARE_SIZE - _vm.SQUARE_BORDER_SIZE : 44
    }
  }, [_vm._v("\n      " + _vm._s(_vm.lo.days[3]) + "\n    ")]), _vm._v(" "), _c('text', {
    staticClass: "vch__day__label",
    attrs: {
      "x": _vm.vertical ? _vm.SQUARE_SIZE * 5 : 0,
      "y": _vm.vertical ? _vm.SQUARE_SIZE - _vm.SQUARE_BORDER_SIZE : 69
    }
  }, [_vm._v("\n      " + _vm._s(_vm.lo.days[5]) + "\n    ")])]), _vm._v(" "), _c('g', {
    class: ['vch__year__wrapper', this.clickedIndex !== -1 ? 'vch__days__selected' : ''],
    attrs: {
      "transform": _vm.yearWrapperTransform
    }
  }, _vm._l(_vm.heatmap.calendar, function (week, weekIndex) {
    return _c('g', {
      key: weekIndex,
      staticClass: "vch__month__wrapper",
      attrs: {
        "transform": _vm.getWeekPosition(weekIndex)
      }
    }, _vm._l(_vm.getFilterWeek(week), function (day, dayIndex) {
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
          "click": function ($event) {
            return _vm.handleSquareClick(day.date, "" + (weekIndex * 10 + dayIndex));
          }
        }
      });
    }), 0);
  }), 0)]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-1aa791a0_0", {
    source: "div.vch__container[data-v-1aa791a0]{position:relative}svg.vch__wrapper[data-v-1aa791a0]{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;line-height:10px}svg.vch__wrapper .vch__months__labels__wrapper text.vch__month__label[data-v-1aa791a0]{font-size:10px}svg.vch__wrapper .vch__days__labels__wrapper text.vch__day__label[data-v-1aa791a0]{font-size:9px}svg.vch__wrapper .vch__days__labels__wrapper text.vch__day__label[data-v-1aa791a0],svg.vch__wrapper .vch__months__labels__wrapper text.vch__month__label[data-v-1aa791a0]{fill:#767676}svg.vch__wrapper rect.vch__day__square[data-v-1aa791a0]:focus{outline:0}svg.vch__wrapper g.vch__days__selected rect[data-v-1aa791a0]{opacity:.5}svg.vch__wrapper g.vch__year__wrapper rect.vch__day__square__actived[data-v-1aa791a0]{opacity:1}",
    map: undefined,
    media: undefined
  }), inject("data-v-1aa791a0_1", {
    source: ".vue-tooltip-theme.tooltip{display:block!important;z-index:10000}.vue-tooltip-theme.tooltip .tooltip-inner{background:rgba(0,0,0,.7);border-radius:3px;color:#ebedf0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size:12px;line-height:16px;padding:14px 10px}.vue-tooltip-theme.tooltip .tooltip-inner b{color:#fff}.vue-tooltip-theme.tooltip .tooltip-arrow{width:0;height:0;border-style:solid;position:absolute;margin:5px;border-color:#000;z-index:1}.vue-tooltip-theme.tooltip[x-placement^=top]{margin-bottom:5px}.vue-tooltip-theme.tooltip[x-placement^=top] .tooltip-arrow{border-width:5px 5px 0 5px;border-left-color:transparent!important;border-right-color:transparent!important;border-bottom-color:transparent!important;bottom:-5px;left:calc(50% - 5px);margin-top:0;margin-bottom:0}.vue-tooltip-theme.tooltip[x-placement^=bottom]{margin-top:5px}.vue-tooltip-theme.tooltip[x-placement^=bottom] .tooltip-arrow{border-width:0 5px 5px 5px;border-left-color:transparent!important;border-right-color:transparent!important;border-top-color:transparent!important;top:-5px;left:calc(50% - 5px);margin-top:0;margin-bottom:0}.vue-tooltip-theme.tooltip[x-placement^=right]{margin-left:5px}.vue-tooltip-theme.tooltip[x-placement^=right] .tooltip-arrow{border-width:5px 5px 5px 0;border-left-color:transparent!important;border-top-color:transparent!important;border-bottom-color:transparent!important;left:-5px;top:calc(50% - 5px);margin-left:0;margin-right:0}.vue-tooltip-theme.tooltip[x-placement^=left]{margin-right:5px}.vue-tooltip-theme.tooltip[x-placement^=left] .tooltip-arrow{border-width:5px 0 5px 5px;border-top-color:transparent!important;border-right-color:transparent!important;border-bottom-color:transparent!important;right:-5px;top:calc(50% - 5px);margin-left:0;margin-right:0}.vue-tooltip-theme.tooltip[aria-hidden=true]{visibility:hidden;opacity:0;transition:opacity .15s,visibility .15s}.vue-tooltip-theme.tooltip[aria-hidden=false]{visibility:visible;opacity:1;transition:opacity .15s}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-1aa791a0";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VueCalendarHeatmap: __vue_component__
});

// Import vue components

const install = function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install on non-es builds, when vue is found

export default plugin;
export { __vue_component__ as VueCalendarHeatmap };
