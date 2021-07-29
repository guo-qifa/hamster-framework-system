import Vue from "vue";
import VueRouter from "vue-router";
//login 页面 单独放到一个页面
import Login from "../components/Login.vue";

import total from "../components/totalPage/total.vue";
// 管控措施 页面
import Home from "../components/risksafety/Home.vue";
import BaseInfoList from "../components/risksafety/BaseInfoList.vue";
// import UserList from "../components/risksafety/UserList.vue";
import UserList from "../components/risksafety/UserList_current.vue";
import WorkPlaceList from "../components/risksafety/WorkPlaceList.vue";
import DangerSourceList from "../components/risksafety/DangerSourceList.vue";
import RiskPointList from "../components/risksafety/RiskPointList.vue";
import LeveMangment from "../components/risksafety/LeveMangment.vue";
import IdentifyMangement from "../components/risksafety/IdentifyMangement.vue";
import TwoListInfoManagement from "../components/risksafety/TwoListInfoManagement.vue";
import ThreeCardInfoManagement from "../components/risksafety/ThreeCardInfoManagement.vue";
import ElectronicInspection from "../components/risksafety/ElectronicInspection.vue";
import WorkPermit from "../components/risksafety/WorkPermit.vue";
import CheckStandard from "../components/risksafety/CheckStandard.vue";
import SaferCheckList from "../components/risksafety/SaferCheckList.vue";
import LatentControlList from "../components/risksafety/LatentControlList.vue";
import EmergencyThings from "../components/risksafety/EmergencyThings.vue";
import PlanManagement from "../components/risksafety/PlanManagement.vue";
import EmergencyDrill from "../components/risksafety/EmergencyDrill.vue";
import AccidentList from "../components/risksafety/AccidentList.vue";
import NoticeList from "../components/risksafety/NoticeList.vue";
import hazardRisk from "../components/risksafety/hazardRisk"
import taskRecord from "../components/risksafety/taskRecord"
import PersonnelExaminationStatistics from "../components/risksafety/PersonnelExaminationStatistics"
import riskFourColorChart from '../components/risksafety/riskFourColorChart'
import scoreManagement from '../components/risksafety/scoreManagement'
import map from '../plugs/map/map.vue'
import riskConfig from '../plugs/riskConfig/index.vue'



import paramSystem from "../components/system/paramSystem.vue";
import menuSystem from "../components/system/menuSystem.vue";
import roleSystem from "../components/system/roleSystem.vue"; 
import orgSystem from "../components/system/orgSystem.vue";
import dictTypeSystem from "../components/system/dictTypeSystem.vue";
import userSystem from "../components/system/userSystem.vue";
import noticetSystem from "../components/system/noticetSystem.vue";
import logSystem from "../components/system/logSystem.vue";
import jobSystem from "../components/system/jobSystem.vue"; 
import activitiSystem from "../components/system/activitiSystem.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/",
        name: "Home",
        component: Home,
        redirect: to => {
            if (Vue.prototype.$bubble.getLoginInfo()) {
                return {path: '/basicInfo', query: {id: 119}}
            } else {
                return '/login'
            }
        },
        children: [
            {
                path:"/taskRecord",
                name:"taskRecord",
                component: taskRecord,
                meta:'学习任务'
            },
            {
                path:"/PersonnelExaminationStatistics",
                name:"PersonnelExaminationStatistics",
                component: PersonnelExaminationStatistics,
                meta:'考试统计'
            },
            {
                path:"/total",
                name:"total",
                component: total,
                meta:'工作台'
            },
            // 调试插件使用的路由  需删掉  start
            {
                path:"/map",
                name:"map",
                component:map,
            },
            {
                path:"/riskConfig",
                name:"riskConfig",
                component:riskConfig,
            },
            // 调试插件使用的路由  需删掉  end
            {
                path: "/basicInfo",
                name: "BaseInfoList",
                component: BaseInfoList,
                meta: "基本情况"
            },
            {
                path: "/basicInfo",
                name: "BaseInfoList",
                component: BaseInfoList,
                meta: "学习任务"
            },
            {
                path: "/personInfos",
                name: "UserList",
                component: UserList,
                meta: "人员情况"
            },
            {
                path: "/workPlaceInfos",
                name: "workPlaceInfos",
                component: WorkPlaceList,
                meta: "车间场所"
            },
            {
                path: "/dangerousSourcesManagement",
                name: "dangerousSourcesManagement",
                component: DangerSourceList,
                meta: "危害因素管理"
            },
            {
                path: "/riskPointManagements",
                name: "riskPointManagements",
                component: RiskPointList,
                meta: "风险点管理"
            },
            {
                path: "/leveMangment",
                name: "LeveMangment",
                component: LeveMangment,
                meta: "风险分级信息管理"
            },
            {
                path: "/identifyMangement",
                name: "leveMangment",
                component: IdentifyMangement,
                meta: "风险辨识信息管理"
            },
            {
                path: "/twoListInfoManagement",
                name: "twoListInfoManagement",
                component: TwoListInfoManagement,
                meta: "两单信息管理"
            },
            {
                path: "/threeCardInfoManagement",
                name: "threeCardInfoManagement",
                component: ThreeCardInfoManagement,
                meta: "三卡信息管理"
            },
            {
                path: "/scoreManagement",
                name: "scoreManagement",
                component: scoreManagement,
                meta: "记分管理"
            },
            {
                path: "/electronicInspection",
                name: "ElectronicInspection",
                component: ElectronicInspection,
                meta: "电子巡视"
            },
            {
                path: "/workPermit",
                name: "WorkPermit",
                component: WorkPermit,
                meta: "作业许可"
            },
            {
                path: "/checkstandard",
                name: "CheckStandard",
                component: CheckStandard,
                meta: "隐患排查标准"
            },
            {
                path: "/saferCheckListTable",
                name: "SaferCheckList",
                component: SaferCheckList,
                meta: "安全检查记录单"
            },
            {
                path: "/controlList",
                name: "LatentControlList",
                component: LatentControlList,
                meta: "隐患管控清单"
            },
            {
                path: "/inspectionRecord",
                name: "inspectionRecord",
                component: hazardRisk,
                meta: "巡检记录单"
            },
            {
                path: "/emergencyThings",
                name: "EmergencyThings",
                component: EmergencyThings,
                meta: "应急物资"
            },
            {
                path: "/planManagement",
                name: "PlanManagement",
                component: PlanManagement,
                meta: "预案管理"
            },
            {
                path: "/emergencyDrill",
                name: "EmergencyDrill",
                component: EmergencyDrill,
                meta: "应急演练"
            },
            {
                path: "/accidentList",
                name: "AccidentList",
                component: AccidentList,
                meta: "事故档案台账"
            },
            {
                path: "/dangerNoticeList",
                name: "NoticeList",
                component: NoticeList,
                meta: "消息通知列表"
            },
            {
                path: "/riskFourColorChart",
                name: "riskFourColorChart",
                component: riskFourColorChart,
                meta: "危险四色图"
            },
                   
            {
                path: "/paramSystem",
                name: "paramSystem",
                component: paramSystem,
                meta: "参数管理"
            },
            {
                path: "/menuSystem",
                name: "menuSystem",
                component: menuSystem,
                meta: "菜单管理"
            },
            {
                path: "/userSystem",
                name: "userSystem",
                component: userSystem,
                meta: "用户管理"
            },
            {
                path: "/noticetSystem",
                name: "noticetSystem",
                component: noticetSystem,
                meta: "通知公告"
            },
            {
                path: "/logSystem",
                name: "logSystem",
                component: logSystem,
                meta: "日志管理"
            },
            {
                path: "/jobSystem",
                name: "jobSystem",
                component: jobSystem,
                meta: "定时任务"
            },
            {
                path: "/activitiSystem",
                name: "activitiSystem",
                component: activitiSystem,
                meta: "工作流"
            }, 
            {
                path: "/dictTypeSystem",
                name: "dictTypeSystem",
                component: dictTypeSystem,
                meta: "字典管理"
            },
            {
                path: "/orgSystem",
                name: "orgSystem",
                component: orgSystem,
                meta: "组织管理"
            },
            {
                path: "/roleSystem",
                name: "roleSystem",
                component: roleSystem,
                meta: "角色管理"
            },

        ]
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

router.beforeEach((to, from, next) => {
    if (Vue.prototype.$bubble && Vue.prototype.$bubble.getLoginInfo()) {
        if (to.path === "/login") {
            next({path: '/basicInfo', query: {id: 119}})
        } else {
            next();
        }
    } else {
        if (to.path !== "/login") {
            next({path: '/login'})
        } else {
            next();
        }
    }
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default router;
