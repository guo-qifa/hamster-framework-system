import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import bubble from "./bubble"
import ElementUI from 'element-ui';
import componentConfig from './config'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(bubble, {
    Host: "http://localhost:@port/api/",
    MockMode: true,
    requestPlug: "Grape",
    title: "暴走金丝熊系统",
    miniTitle: "金丝熊系统",
    Logo: "logo.png",
    //显示路由历史
    navHistory: {
        show: true,
    },
    componentConfig
});
Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
