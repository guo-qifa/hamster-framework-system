var port = {
  default: 8080,
  user: 1001,
  manager: 1001,
  region: 1005,
  organization: 1004,
  goods: 1003,
  order: 1002,
  scene: 1006,
  device: 1007,
  taskScheduler: 1100,
};
var list = {
  common: {
    page: [],
    pageEx: [],
    insert: [],
    _delete: [],
    update: [],
    find: [],
    selectEx: [],
  },
  remoteDict: {
    url: ['get', "system/dict/selectByCode"]
  },
  exportInterface: {
    BaseInfoList: ["post", "risksafety/enterprise/export"],
    DangerSourceList: ["post", "risksafety/hazard/export"],
    RiskPointList: ["post", "risksafety/risk/export"],
    UserList: ["post", "risksafety/personnel/export"],
    WorkPlaceList: ["post", "risksafety/workshop/export"],
  },
  total: {
    info: ['post', "risksafety/information/getInfo", 'data'],
    ScoreType: ['get', 'risksafety/enterprise/getEnterpriseScoreType', 'data'],
    Statistics: ['post', 'risksafety/promiseCardRecord/enterprisePromiseStatistics', 'data'],
    queryBean: ['post', 'risksafety/promiseCardRecord/queryBean', 'data']
  },
  promiseDetailInfo: {
    page: ['post', "risksafety/promiseCardRecord/queryPage", 'data']
  },
  comintegral: {
    page: ['get', "risksafety/enterprise/getListEnterpriseScoreType"]
  },
  userType: {
    find: ["post", "system/getAuthenticationVO", "data"],
  },
  menu: {
    find: ["get", "system/menu/getByPidAndUrl"],
  },
  user: {
    page: ["post", "user/user/page"],
    pageEx: ["post", "user/user/pageEx"],
    insert: ["post", "user/user/insert"],
    update: ["post", "user/user/update"],
    _delete: ["post", "user/user/delete"],
    login: ["post", "system/auth/login"],
    select: ["post", "system/user/queryBean"],
  },
  baseInfo: {
    page: ["post", "risksafety/enterprise/queryPage"],
    insert: ["post", "risksafety/enterprise/save"],
    update: ["post", "risksafety/enterprise/update"],
    _delete: ["post", "risksafety/enterprise/logicDeleteId", "params"],
    enterMap: ["post", "risksafety/enterprise/queryBean"],
  },
  grid: {
    select: ["post", "system/grid/queryBean", "data"],
  },
  personnel: {
    page: ["post", "risksafety/personnel/queryPage"],
    insert: ["post", "risksafety/personnel/save"],
    update: ["post", "risksafety/personnel/update"],
    _delete: ["post", "risksafety/personnel/deleteId", "params"],
    export: ["post", "risksafety/personnel/export"],
  },
  workPlace: {
    page: ["post", "risksafety/workshop/queryPage"],
    insert: ["post", "risksafety/workshop/save"],
    _delete: ["post", "risksafety/workshop/deleteId", "params"],
    update: ["post", "risksafety/workshop/update"],
    tree: ["get", "risksafety/risk/getGridCompanyWorkshopList?workName="],
    map: ["post", "risksafety/workshop/queryBean", "data"],
    coor: ["post", "risksafety/enterprise/queryBean"],
    enter: ["post", "risksafety/enterprise/queryBean", "data"],
  },
  dangerSource: {
    page: ["post", "risksafety/hazard/queryPage"],
    insert: ["post", "risksafety/hazard/save"],
    update: ["post", "risksafety/hazard/update"],
    _delete: ["post", "risksafety/hazard/logicDeleteId", "params"],
    find: ["get", "risksafety/risk/getHazardRiskListByRiskId"],
    record: ["post", "risksafety/OperateLog/record", "data"],
  },
  riskPoint: {
    page: ["post", "risksafety/risk/queryPage"],
    insert: ["post", "risksafety/risk/save"],
    update: ["post", "risksafety/risk/update"],
    _delete: ["post", "risksafety/risk/logicDeleteId", "params"],
    cupdate: ["post", "risksafety/risk/updateHazardRiskList"],
  },
  riskIdentify: {
    page: ["post", "risksafety/riskIdentifyInfoManage/getRiskOrder"],
    insert: ["post", "risksafety/risk/save"],
    update: ["post", "risksafety/risk/update"],
    _delete: ["post", "risksafety/risk/logicDeleteId", "params"],
  },
  riskMeasureOrder: {
    page: ["post", "risksafety/riskIdentifyInfoManage/getRiskMeasureOrder"],
  },
  twoListInfo: {
    page: ["post", "risksafety/safeRiskManageOrder/queryPage", "formdata"],
  },
  twoListInfos: {
    page: ["post", "risksafety/dangerCheckOrder/queryPage", "formdata"],
  },
  electronicInspection: {
    page: ["post", "risksafety/inspectRecord/queryPage"],
    insert: ["post", "risksafety/inspectRecord/save"],
    urgent: ["get", "risksafety/inspectRecord/urgent"],
  },
  workPermit: {
    page: ["post", "risksafety/jobLucese/queryPage"],
    insert: ["post", "risksafety/jobLucese/save"],
    update: ["post", "risksafety/jobLucese/update"],
    _delete: ["post", "risksafety/jobLucese/deleteId", "params"],
  },
  accidentList: {
    page: ["post", "risksafety/eventAccident/queryPage"],
    eventRectify: ["post", "risksafety/eventRectify/queryBean"],
    insert: ["post", "risksafety/eventAccident/save"],
    suggest_update: ["post", "risksafety/defectManageRectify/update"],
    publish: ["post", "risksafety/defectManage/submit"],
  },
  emergencyDrill: {
    page: ["post", "risksafety/urgentManeuver/queryPage"],
    insert: ["post", "risksafety/urgentManeuver/save"],
    update: ["post", "risksafety/urgentManeuver/update"],
    _delete: ["post", "risksafety/urgentManeuver/logicDeleteId", "params"],
  },
  emergencyThings: {
    page: ["post", "risksafety/urgentMaterial/queryPage"],
    insert: ["post", "risksafety/urgentMaterial/save"],
    update: ["post", "risksafety/urgentMaterial/update"],
    _delete: ["post", "risksafety/urgentMaterial/deleteId", "params"],
    select: ["post", "risksafety/urgentMaterial/queryBean"],
    details: ["post", "risksafety/urgentMaterialRecord/queryBean"],
  },
  emergencyThingsDetails: {
    insert: ["post", "risksafety/urgentMaterialRecord/save"],
    update: ["post", "risksafety/urgentMaterialRecord/update"],
    _delete: [
      "post",
      "risksafety/urgentMaterialRecord/logicDeleteId",
      "params",
    ],
  },
  planManagement: {
    page: ["post", "risksafety/urgentPlan/queryPage"],
    insert: ["post", "risksafety/urgentPlan/save"],
    update: ["post", "risksafety/urgentPlan/update"],
    _delete: ["post", "risksafety/urgentPlan/deleteId", "params"],
  },
  noticeList: {
    page: ["post", "risksafety/information/queryPage"],
    find: ["post", "risksafety/information/queryBean"],
    enclosed: ['post', 'risksafety/information/handleMessage']
  },
  latentControlList: {
    page: ["post", "risksafety/defectManage/queryPage"],
    insert: ["post", "risksafety/defectManage/save"],
    update: ["post", "risksafety/defectManage/update"],
    _delete: ["post", "risksafety/defectManage/deleteId", "params"],
    details: ["post", "risksafety/defectManageRectify/queryBean"],
    suggest_insert: ["post", "risksafety/defectManageRectify/save"],
    suggest_update: ["post", "risksafety/defectManageRectify/update"],
    publish: ["post", "risksafety/defectManage/pulish"],
  },
  rectifyRecord: {
    record: ["post", "risksafety/rectifyRecord/queryBean"],
  },
  saferCheckList: {
    page: ["post", "risksafety/checkRecord/queryPage"],
    details: ["post", "risksafety/checkRecordItem/queryBean"],
    detailsUpdate: ["post", "risksafety/checkRecordItem/update"],
  },
  hazardRisk: {
    page: ["post", "risksafety/hazardRisk/queryPage"],
    details: ['post', 'risksafety/inspectHazardItem/queryPage', 'data'],
    check: ['post', 'risksafety/inspectHazardItem/updateInspectRecord'],
  },
  checkstandard: {
    page: ["post", "risksafety/defectStandard/queryPage"],
    insert: ["post", "risksafety/defectStandard/save"],
    update: ["post", "risksafety/defectStandard/update"],
    _delete: ["post", "risksafety/defectStandard/deleteId", "params"],
    details: ["post", "risksafety/defectStandardItem/queryBean", "data"],
  },
  threeCardInfo: {
    list: ["post", "xxh/xturn/assWorkshop/selecetWorkshopsByT", "formdata"],
    find: ["get", "risksafety/emergencyCard/selectByEnterpriseIdAndWorkId"],
    getInfoTab1: [
      "get",
      "risksafety/promiseCard/getByEnterpriseId",
    ],
    getInfoTab2: ["get", "risksafety/knowCard/getByEnterpriseId"],
    getInfoTab3: [
      "get",
      "risksafety/emergencyCard/getByEnterpriseId",
    ],
  },
  charts: {
    riskLeve: ["get", "risksafety/riskLevelInfoManage/getRiskLevelCount"],
    categroy: ["get", "risksafety/riskLevelInfoManage/getAccidentTypeCount"], // 柱状图
    eiskType: ["get", "risksafety/riskLevelInfoManage/getRiskTypeCount"],
    count: ["get", "system/dict/selectByCode?dictCode=scgy"],
  },
  modal: {
    zd: ['get', 'system/dict/selectByCode?dictCode=yhjclx'],
    uuid: ['post', 'risksafety/hazardMeasure/queryBean', 'data']
  },
  exam: {
    Count: ['get', 'education/train/mission/getExamPeopleCount', 'params'],
    People: ['get', 'education/train/mission/getPassPeopleCount', "params"],
    JoinPeople: ['get', 'education/train/mission/getJoinPeopleCount', 'params']
  },
  searchCom: {
    riskList: ['get', 'riskdistr/areaRisk/getCmyRiskList'],
    companyList: ['get', 'risksafety/inspectRecord/getGridCompanyList', 'params']
  },
  task: {
    page: ['post', 'education/train/mission/pageInfo', 'data'],
    error: ['get', 'education/app/train/exam/appExamResultDetail'],
    personPage: ['post', 'education/train/mission/missionPeople', 'data'],
  },
  scoreManagement: {
    page: ['post', 'risksafety/enterpriseScore/queryPage', 'data'],
    insert: ["post", "risksafety/enterpriseScore/save"],
  },
  polling: {
    search: ['get', 'risksafety/inspectRecord/getById'],
    details: ['get', 'risksafety/inspectHazardItem/getById'],
    diotcode: ['get', 'system/dict/selectByCode?dictCode=yhjclx'],
    personnel: ['post', 'risksafety/personnel/queryBean'],
    personnelQueryPage: ['post', 'risksafety/personnel/queryPage']
  },
  chosePsonnel: {
    page: ["post", "risksafety/personnel/queryPage"],
    insert: ["post", "risksafety/personnel/save"],
    update: ["post", "risksafety/personnel/update"],
    _delete: ["post", "risksafety/personnel/deleteId", "params"],
    export: ["post", "risksafety/personnel/export"],
  },
  menuSystem: {
    find: ["post", "system/menu/treeselect"],
    insert: ["post", "system/menu/save"],
    update: ["post", "system/menu/update"],
    _delete: ["post", "system/menu/deleteId", "apendValue"],
    export: ["post", "system/menu/export"],
  },
  roleSystem: {
    page: ["post", "system/role/queryPage"],
    insert: ["post", "system/role/save"],
    update: ["post", "system/role/update"],
    _delete: ["post", "system/role/deleteId", "params"],
    export: ["post", "system/role/export"],
    treeselectByRole: ["post", "system/role/treeselectByRole"],
  },
  orgSystem: {
    page: ["post", "system/org/treeselectPage"],
    //page: ["post", "system/org/queryPage"],
    insert: ["post", "system/org/save"],
    update: ["post", "system/org/update"],
    _delete: ["post", "system/org/deleteId", "params"],
    export: ["post", "system/org/export"],
    treeselect: ["post", "system/org/treeselect"],
  },
  paramSystem: {
    page: ["post", "system/param/queryPage"],
    insert: ["post", "system/param/save"],
    update: ["post", "system/param/update"],
    _delete: ["post", "system/param/deleteId", "params"],
  },
  dictTypeSystem: {
    page: ["post", "system/dictType/queryPage"],
    insert: ["post", "system/dictType/save"],
    update: ["post", "system/dictType/update"],
    _delete: ["post", "system/dictType/deleteId", "params"],
  },
  dictDataSystem: {
    page: ["post", "system/dictData/queryPage"],
    queryBean: ["post", "system/dictData/queryBean"],
    insert: ["post", "system/dictData/save"],
    update: ["post", "system/dictData/update"],
    _delete: ["post", "system/dictData/deleteId", "params"],
  },
  remoteDict: {
    url: ["post", "system/dictData/queryBean"],
  },
  userSystem: {
    page: ["post", "system/user/queryPage"],
    insert: ["post", "system/user/save"],
    update: ["post", "system/user/update"],
    _delete: ["post", "system/user/deleteId", "params"],
  },
  userRolesAbout: {
    page: ["post", "system/user/queryPage"],
    insert: ["post", "system/user/save"],
    update: ["post", "system/user/update"],
    _delete: ["post", "system/user/deleteId", "params"],
  },
  noticeSystem: {
    page: ["post", "system/notice/queryPage"],
    insert: ["post", "system/notice/save"],
    update: ["post", "system/notice/update"],
    _delete: ["post", "system/notice/deleteId", "params"],
  },
  jobSystem: {
    page: ["post", "system/job/queryPage"],
    insert: ["post", "system/job/save"],
    update: ["post", "system/job/update"],
    _delete: ["post", "system/job/deleteId", "params"],

    run: ["post", "system/job/run"], //  批量立即执行
    resume: ["post", "system/job/resume"], // 批量恢复
    pause: ["post", "system/job/pause"], // 批量暂停
  },
  popJobLog: {
    page: ["post", "system/jobLog/queryPage"],
  },

  logSystem: {
    page: ["post", "system/log/queryPage"],
    insert: ["post", "system/log/save"],
    update: ["post", "system/log/update"],
    _delete: ["post", "system/log/deleteId", "params"],
  },
  activitiSystem: {
    page: ["post", "system/processDefinition/queryPage"],
    update: ["post", "system/processDefinition/getDefinitionXML", "formdata"],
    insert: [
      "post",
      "system/processDefinition/addDeploymentByString",
      "formdata",
    ],
    _delete: ["post", "system/processDefinition/remove", "apendValue"],
  },
};

export default {
  port,
  list,
};
