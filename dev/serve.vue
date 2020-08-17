<script>
import Vue from 'vue';
import { VueCalendarHeatmap } from '@/entry';

function getVirtulData() {
  var today = +new Date();
  var dayTime = 3600 * 24 * 1000;
  var thatday = today - dayTime * 60;

  var data = [];
  for (var time = thatday; time <= today; time += dayTime) {
    data.push({
      date: new Date(time),
      count: Math.ceil(Math.random() * 10 <= 1 ? 0 : Math.random() * 100),
    });
  }
  return data;
}

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueCalendarHeatmap,
  },
  methods: {
    getVirtulData,
  },
});
</script>

<template>
  <div id="app">
    <vue-calendar-heatmap :values="getVirtulData()" isAutoFillWeek />
  </div>
</template>
