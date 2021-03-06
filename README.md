# vue-calendar-heatmap

![](https://i.imgur.com/ntYYTKX.png)

[![npm](https://img.shields.io/npm/v/vue-calendar-heatmap.svg)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

A lightweight calendar heatmap Vuejs component built on SVG, inspired by github's contribution calendar graph. With vertical mode, tooltip powered by [v-tooltip](https://github.com/Akryum/v-tooltip). Fork From: [vue-calendar-heatmap](https://github.com/julienr114/vue-calendar-heatmap)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)

# Installation

```
npm install --save @byted-light/vue-calendar-heatmap
```

## Default import

Global Install:

```javascript
import Vue from 'vue';
import VueCalendarHeatmap from '@byted-light/vue-calendar-heatmap';

Vue.use(VueCalendarHeatmap);
```

Use specific components:

```javascript
import Vue from 'vue';
import { CalendarHeatmap } from '@byted-light/vue-calendar-heatmap';

Vue.component('calendarHeatmap', CalendarHeatmap);
```

or in a parent components `.vue` file

```html
<script>
  import { CalendarHeatmap } from '@byted-light/vue-calendar-heatmap';

  export default {
    components: {
      CalendarHeatmap,
    },
    // ...
  };
</script>
```

**⚠️ A css file is included when importing the package. You may have to setup your bundler to embed the css in your page.**

## Distribution import

Global Install:

```javascript
import '@byted-light/vue-calendar-heatmap/dist/vue-calendar-heatmap.css';
import VueCalendarHeatmap from '@byted-light/vue-calendar-heatmap/dist/vue-calendar-heatmap.common';

Vue.use(VueCalendarHeatmap);
```

Use specific components:

```javascript
import '@byted-light/vue-calendar-heatmap/dist/vue-calendar-heatmap.css';
import { CalendarHeatmap } from '@byted-light/vue-calendar-heatmap/dist/vue-calendar-heatmap.common';

Vue.component('calendarHeatmap', CalendarHeatmap);
```

**⚠️ You may have to setup your bundler to embed the css file in your page.**

## Browser

```html
<link rel="stylesheet" href="@byted-light/vue-calendar-heatmap/dist/vue-calendar-heatmap.css" />

<script src="vue.js"></script>
<script src="@byted-light/vue-calendar-heatmap/dist/vue-calendar-heatmap.browser.js"></script>
```

The plugin should be auto-installed. If not, you can install it manually with the instructions below.

Install all the components:

```javascript
Vue.use(VueCalendarHeatmap);
```

Use specific components:

```javascript
Vue.component('calendarHeatmap', VueCalendarHeatmap.CalendarHeatmap);
```

# Usage

## Availables props

### **values** - `values` - _required_

Array of objects with `date` and `count` keys. `date` values can be a date parseable string, a millisecond timestamp, or a Date object. `count` value should be a number.

```html
<calendar-heatmap :values="[{ date: '2018-9-22', count: 6 }, ...]" ... />
```

### **locale** - `locale`

Object of 5 keys which represents the locale text.

- `month`: `['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']`
- `days`: `['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']`
- `on`: `on`
- `tooltipUnit`: `contributions`,
- `tooltipEmptyUnit`: `No`

```html
<calendar-heatmap :locale="locale" ... />
```

### **rangeColor** - `range-color`

Array of 6 strings which represents the colors of the progression.

- The color at `rangeColor[0]` will always represent the values for a `count: null`
- The color at `rangeColor[1]` will always represent the values for a `count: 0`
- The others are automatically distributed over the maximum value of count, unless you specify `max` props.

Default value is equal to the example.

```html
<calendar-heatmap :range-color="['ebedf0', 'dae2ef', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e']" ... />
```

### **max** - `max`

Any number which should be the max color.

```html
<calendar-heatmap :max="10" ... />
```

### **noDataText** - `no-data-text`

Tooltip text to display on days without data. `null` by default (shows no tooltip at all).

```html
<calendar-heatmap :no-data-text="no data for this day" ... />
```

### **tooltip** - `tooltip`

Boolean for enable/disable tooltip on square hover. `true` by default.

```html
<calendar-heatmap :tooltip="false" ... />
```

### **vertical** - `vertical`

Boolean to switch to vertical mode. `false` by default.

```html
<calendar-heatmap :vertical="true" ... />
```

### **isAutoFillWeek** - `isAutoFillWeek`

Boolean to switch to enable fill week. `false` by default.

```html
<calendar-heatmap :vertical="true" ... />
```

## License

[MIT](http://opensource.org/licenses/MIT)
