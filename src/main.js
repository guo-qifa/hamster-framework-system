import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import bubble from "./common/hamster-framework/src/bubble";
import "hamster-framework/lib/hamster-framework.css";
import ElementUI from "element-ui";
import componentConfig from "./config/index.js";
import plugs from "./plugs";
import "element-ui/lib/theme-chalk/index.css";
const bus = new Vue();
import store from "@/store";
import moment from "moment";
Vue.prototype.$time = moment;
Vue.prototype.$bus = bus;
window.$channel = new Vue()
import $popup from './common/components/popUp'
Vue.prototype.$newPopup=$popup;
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css'; 
Vue.use(ViewUI);
Vue.use(ElementUI);

// const baseUrl = "https://yzanjian.rfyfb.com/";
const baseUrl = "http://47.117.129.125:9000/";
Vue.use(bubble, {
  // Host: {
  //     default: "https://yzanjian.rfyfb.com/",
  //     // "user.login":"/api/",
  //     // "grid.select":"/api/"
  //
  // },
  Host: {
    // 线上环境
    // default: "https://yzanjian.rfyfb.com/",
    // 测试环境
    // default:"http://risk.rfyfb.com/",
    default: baseUrl,
    // "user.login":"/api/",
    // "baseInfo.insert":'/api/',
    // "baseInfo.page":'/api/',
    // "baseInfo._delete":'/api/',
    //  "workPlace":"/api/"
  },

  // UploadHost: "https://yzanjian.rfyfb.com/risksafety/fileUpload/upload",
  UploadHost: baseUrl + "risksafety/fileUpload/upload",
  uploadPrefix: baseUrl + "risksafety/fileDownload/downloadPic?pic=",//自定义公共变量，图片保存地址
  MockMode: false,
  requestPlug: "AnJian",
  title: "企业风险管控子系统",
  miniTitle: "企业风险管控子系统",
  Logo: "logo1.png",
  //显示路由历史
  navHistory: {
    show: true,
  },
  plugs,
  router: router,
  componentConfig,
  globeConfig: {
    BubbleBasicManage: {
      deleteParame: (v) => {
        return { id: v.id };
      },
    },
    beforePageLoad(data, info, callback) {
      if (data.id) {
        this.request("menu.find", {
          pId: data.id,
          url: info.path.replace("/", ""),
        })
          .then((v) => {
            callback({
              auth: v.record,
            });
          })
          .catch((v) => {
            callback();
          });
      } else {
        callback();
      }
    },
  },
});
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeMount() {
    
    // console.log(router.options.routes);
  },
}).$mount("#app");
