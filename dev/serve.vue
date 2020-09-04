<script>
import Vue from 'vue';
import { VueCalendarHeatmap } from '@/entry';

function getVirtulData() {
  var today = +new Date();
  var dayTime = 3600 * 24 * 1000;
  var thatday = today - dayTime * 365;

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
    <div class="chart-container">
      <vue-calendar-heatmap :values="getVirtulData()" />
    </div>
  </div>
</template>
<style>
#app {
  max-width: 1280px;
  margin: 0 auto;
}

.chart-container {
  width: 100%;
  height: 250px;
  overflow: hidden;
}
</style>
