import Vue from 'vue';
import Router from 'vue-router';
import MapView from '@/components/MapView';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: MapView,
    },
  ],
});
