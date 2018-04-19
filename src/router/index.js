import Vue from 'vue';
import Router from 'vue-router';
import Aside from '../components/Aside';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'aside',
      component: Aside
    }
  ]
})
