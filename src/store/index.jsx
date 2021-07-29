import Vue from "vue";
import Store from "vuex";

Vue.use(Store);

const store = new Store.Store({
  state: {
    noticeShow:false,
    brightMapTk:
      "00142BE1756963DFA020B666AB3AD72477D04A06E492EBF2DB6AFA1F577211D4AA26D32B8D5B701CCA9E84D7330135C5",// 地图密钥
    userInfo: {
      userName: "",
      userType: 1,
      orgId: ""
    },
  },
  mutations: {
    setUserType(state, data) {
      state.userInfo.userName = data.userName;
      state.userInfo.userType = data.userType;
      state.userInfo.orgId = data.orgId
    },
  },
  actions: {},
  getters: {},
  module: {},
});

export default store;
