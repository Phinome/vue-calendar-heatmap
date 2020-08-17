<template>
  <svg class="vch__wrapper" :viewBox="viewbox">
    <g class="vch__months__labels__wrapper" :transform="monthsLabelWrapperTransform[position]">
      <text
        class="vch__month__label"
        v-for="(month, index) in heatmap.firstFullWeekOfMonths"
        :x="getMonthLabelPostion(month).x"
        :y="getMonthLabelPostion(month).y"
        :key="index"
      >
        {{ lo.months[month.value] }}
      </text>
    </g>
    <g class="vch__days__labels__wrapper" :transform="daysLabelWrapperTransform[position]">
      <text
        class="vch__day__label"
        :x="vertical ? SQUARE_SIZE * 1 : 0"
        :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 18"
      >
        {{ lo.days[1] }}
      </text>
      <text
        class="vch__day__label"
        :x="vertical ? SQUARE_SIZE * 3 : 0"
        :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 42"
      >
        {{ lo.days[3] }}
      </text>
      <text
        class="vch__day__label"
        :x="vertical ? SQUARE_SIZE * 5 : 0"
        :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 67"
      >
        {{ lo.days[5] }}
      </text>
    </g>
    <g
      :class="['vch__year__wrapper', this.clickedIndex !== -1 ? 'vch__days__selected' : '']"
      :transform="yearWrapperTransform"
    >
      <g
        class="vch__month__wrapper"
        v-for="(week, weekIndex) in heatmap.calendar"
        :key="weekIndex"
        :transform="getWeekPosition(weekIndex)"
      >
        <rect
          :class="[
            'vch__day__square',
            clickedIndex === `${weekIndex * 10 + dayIndex}` ? 'vch__day__square__actived' : '',
          ]"
          v-for="(day, dayIndex) in getFilterWeek(week)"
          :key="dayIndex"
          :transform="getDayPosition(dayIndex)"
          :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
          :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
          :style="{ fill: rangeColor[day.colorIndex] }"
          v-tooltip="tooltipOptions(day)"
          @click="handleSquareClick(day.date, `${weekIndex * 10 + dayIndex}`)"
        ></rect>
      </g>
    </g>
  </svg>
</template>

<script>
import { VTooltip } from 'v-tooltip';
import Heatmap from './Heatmap';
import { DAYS_IN_WEEK, DEFAULT_LOCALE, DEFAULT_RANGE_COLOR, SQUARE_SIZE } from './consts.js';

export default {
  name: 'CalendarHeatmap',
  directives: {
    tooltip: VTooltip,
  },
  props: {
    max: {
      type: Number,
    },
    rangeColor: {
      type: Array,
      default: () => DEFAULT_RANGE_COLOR,
    },
    values: {
      required: true,
      type: Array,
    },
    locale: {
      type: Object,
    },
    tooltip: {
      type: Boolean,
      default: true,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    noDataText: {
      type: String,
      default: null,
    },
    isAutoFillWeek: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      clickedIndex: -1,
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
      return new Heatmap(this.values, this.max);
    },
    width() {
      return {
        horizontal: this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * this.heatmap.weekCount + this.SQUARE_BORDER_SIZE,
        vertical: this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * DAYS_IN_WEEK + this.RIGHT_SECTION_WIDTH,
      };
    },
    heigth() {
      return {
        horizontal:
          this.TOP_SECTION_HEIGTH +
          this.SQUARE_SIZE * DAYS_IN_WEEK +
          this.SQUARE_BORDER_SIZE +
          this.BOTTOM_SECTION_HEIGTH,
        vertical: this.TOP_SECTION_HEIGTH + this.SQUARE_SIZE * this.heatmap.weekCount + this.SQUARE_BORDER_SIZE,
      };
    },
    viewbox() {
      return `0 0 ${this.width[this.position]} ${this.heigth[this.position]}`;
    },
    daysLabelWrapperTransform() {
      return {
        horizontal: `translate(0, ${this.TOP_SECTION_HEIGTH})`,
        vertical: `translate(${this.LEFT_SECTION_WIDTH}, 0)`,
      };
    },
    monthsLabelWrapperTransform() {
      return {
        horizontal: `translate(${this.LEFT_SECTION_WIDTH}, 0)`,
        vertical: `translate(0, ${this.TOP_SECTION_HEIGTH})`,
      };
    },
    legendWrapperTransform() {
      return {
        horizontal: `translate(${this.width[this.position] - this.SQUARE_SIZE * this.rangeColor.length - 30}, ${
          this.heigth[this.position] - this.BOTTOM_SECTION_HEIGTH
        })`,
        vertical: `translate(${this.LEFT_SECTION_WIDTH + this.SQUARE_SIZE * DAYS_IN_WEEK}, ${this.TOP_SECTION_HEIGTH})`,
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
          tooltipUnit: this.locale.tooltipUnit || DEFAULT_LOCALE.tooltipUnit,
          tooltipEmptyUnit: this.locale.tooltipEmptyUnit || DEFAULT_LOCALE.tooltipEmptyUnit,
        };
      }
      return DEFAULT_LOCALE;
    },
  },
  watch: {
    values: {
      handler() {
        this.clickedIndex = -1;
      },
      immediate: true,
    },
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
      const defaultTooltipContent = `<b>${
        day.count
          ? [day.count, this.lo.tooltipUnit].join(' ')
          : [this.lo.tooltipEmptyUnit, this.lo.tooltipUnit].join('')
      }</b> ${this.lo.on} ${day.date.getFullYear()}-${day.date.getMonth() + 1}-${day.date.getDate()}`;
      if (this.tooltip) {
        if (day.count != null) {
          return {
            content: defaultTooltipContent,
            delay: { show: 300, hide: 50 },
          };
        } else if (this.noDataText) {
          return {
            content: `${this.noDataText}`,
            delay: { show: 300, hide: 50 },
          };
        }
      }
      return false;
    },
    getFilterWeek(week) {
      return this.isAutoFillWeek ? week : week.filter(({ date }) => date <= new Date());
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
      let position = { x: 0, y: 0 };
      position.x = this.vertical ? 3 : this.SQUARE_SIZE * month.index;
      position.y = this.vertical
        ? this.SQUARE_SIZE * this.heatmap.weekCount - this.SQUARE_SIZE * month.index - this.SQUARE_SIZE / 4
        : this.SQUARE_SIZE - this.SQUARE_BORDER_SIZE;
      return position;
    },
  },
};
</script>

<style scoped>
div.vch__container {
  position: relative;
}
svg.vch__wrapper {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  line-height: 10px;
}

svg.vch__wrapper .vch__months__labels__wrapper text.vch__month__label {
  font-size: 5px;
}

svg.vch__wrapper .vch__days__labels__wrapper text.vch__day__label {
  font-size: 5px;
}

svg.vch__wrapper .vch__months__labels__wrapper text.vch__month__label,
svg.vch__wrapper .vch__days__labels__wrapper text.vch__day__label {
  fill: #767676;
}

svg.vch__wrapper rect.vch__day__square:focus {
  outline: none;
}

svg.vch__wrapper g.vch__days__selected rect {
  opacity: 0.5;
}

svg.vch__wrapper g.vch__year__wrapper rect.vch__day__square__actived {
  opacity: 1;
}
</style>

<style>
.vue-tooltip-theme.tooltip {
  display: block !important;
  z-index: 10000;
}

.vue-tooltip-theme.tooltip .tooltip-inner {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  color: #ebedf0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  font-size: 12px;
  line-height: 16px;
  padding: 14px 10px;
}

.vue-tooltip-theme.tooltip .tooltip-inner b {
  color: white;
}

.vue-tooltip-theme.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.vue-tooltip-theme.tooltip[x-placement^='top'] {
  margin-bottom: 5px;
}

.vue-tooltip-theme.tooltip[x-placement^='top'] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.vue-tooltip-theme.tooltip[x-placement^='bottom'] {
  margin-top: 5px;
}

.vue-tooltip-theme.tooltip[x-placement^='bottom'] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.vue-tooltip-theme.tooltip[x-placement^='right'] {
  margin-left: 5px;
}

.vue-tooltip-theme.tooltip[x-placement^='right'] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.vue-tooltip-theme.tooltip[x-placement^='left'] {
  margin-right: 5px;
}

.vue-tooltip-theme.tooltip[x-placement^='left'] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.vue-tooltip-theme.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.vue-tooltip-theme.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
