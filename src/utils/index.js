const getToken = () => "Bearer" + JSON.parse(window.localStorage.getItem("bubbleCache")).token;

const formatTime = (date) => {
    if(!date) {return ""}
    let currentDate = new Date(date);
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1 < 10) ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
    let day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();

    let hours = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours();
    let minutes = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
    let seconds = currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
/**
 * 用于首页工作台带时间参数跳转，当前为 今天的0点至23：59：59
 */
const getToday = (flag) => {
    var date = new Date();
    var yesDay = new Date();

    var seperator1 = "-";
    var year1 = date.getFullYear();
    var month1 = date.getMonth();
    var strDate1 = date.getDate();
    

    var year2 = yesDay.getFullYear();
    var month2 = yesDay.getMonth();
    var strDate2 = yesDay.getDate();

    strDate2 = strDate2 - flag;

    return [new Date(year2, month2, strDate2, 0, 0, 0), new Date(year1, month1, strDate1, 23, 59, 59)]
}

const getQueryVariable = (variable) => {
    var query = window.location.href.split("?")[1];
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
        return pair[1];
    }
    }
    return "";
}

/**
 * 
 * @param {} auth 权限数组 
 * @returns 
 */
const initRightControl = (auth) => {
    let allowShowDetail = false;
    let allowAdd = false;
    let allowEdit = false;
    let allowDelete = false;
    let allowImport = false;
    let allowExport = false;
    let allowInspect = false;
    let allowReportUp = false;
    let allowWZTZ = false;
    if(auth instanceof Array) {
        auth.map(v => {
            if(v.menuName == '查询' || v.menuName == '查看') allowShowDetail = true;
            if(v.menuName == '新建') allowAdd = true;
            if(v.menuName == '修改') allowEdit = true;
            if(v.menuName == '删除') allowDelete = true;
            if(v.menuName == '导入') allowImport = true;
            if(v.menuName == '导出') allowExport = true;
            if(v.menuName == '巡检') allowInspect = true;
            if(v.menuName == '上报') allowReportUp = true;
            if(v.menuName == '物资台账') allowWZTZ = true;
        })
    }
    return {allowShowDetail, allowAdd, allowEdit, allowDelete, allowImport, allowExport, allowInspect, allowReportUp, allowWZTZ}
}

/**
 * 
 * @param {*} fn 发请求的函数
 * @param {*} param1 $bubble.requestExport规定的地址参数
 * @param {*} param2 请求参数
 * @param {*} param3 导出后的文件名
 */
const publicExportFn = (fn, param1, param2, param3) => {
    fn(param1, param2).then((v) => {
        let url = window.URL.createObjectURL(new Blob([v.data], { type: "application/octet-stream" }));
        let a = document.createElement("a");
        a.href = url;
        a.download=param3 + ".xls"
        console.log(a);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
}

const importTemplateInfo = () => {
    return {
        BaseInfoList: {
            importUrl: 'risksafety/enterprise/import',
            templateName: 'company',
            templateText: '企业导入模板',
        },
        DangerSourceList: {
            importUrl: 'risksafety/hazard/import',
            templateName: 'danger',
            templateText: '危害因素导入模板',
        },
        UserList: {
            importUrl: 'risksafety/personnel/import',
            templateName: 'person',
            templateText: '企业人员导入模板',
        },
        RiskPointList: {
            importUrl: 'risksafety/risk/import',
            templateName: 'risk',
            templateText: '风险点导入模板',
        },
        WorkPlaceList: {
            importUrl: 'risksafety/workshop/import',
            templateName: 'workPlace',
            templateText: '车间导入模板',
        },
        WorkPermit: {
            importUrl: 'risksafety/jobLucese/importExcel',
            templateName: 'book',
            templateText: '证书许可导入模板',
        },
    }
}

export { 
    getToken,//获取token
    formatTime,//格式化时间
    initRightControl,//权限
    importTemplateInfo,//导入模板参数信息
    publicExportFn,//导出公用方法
    getToday,
    getQueryVariable
};