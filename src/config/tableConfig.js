const i = "名称"
import { valid } from 'mockjs';
import Vue from 'vue'
const userType = localStorage.getItem('userType'); //用户类型 1：企业，2：政府
const riskLevel = {
    text: "风险等级",
    key: "riskLevel",
    render: v => {
        let color = '#000';
        let text = '-';
        switch (v.riskLevel) {
            case '00':
                color = 'green';
                text = '安全';
                break;
            case '01':
                color = '#13aae1';
                text = '四级';
                break;
            case '02':
                color = 'rgb(218 218 60 / 85%)';
                text = '三级';
                break;
            case '03':
                color = '#fc9900';
                text = '二级';
                break;
            case '04':
                color = 'red';
                text = '一级';
                break;
            default:
                break;
        }
        return `<span style="color: ${color}">${text}</span>`;
    }
};

function formatTime(date) {
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
var tableConfig = {
    baseInfo: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "企业名称",
            key: "cmyName",
        },
        {
            text: "所属网格",
            key: "gridName",
            // plugs:"gridId"
        },
        {
            text: "公司地址",
            key: "cmyAddress",
        },
        {
            text: "安全生产标准化等级",
            key: "standLevel",
            render: v => {
                var color = "";
                if (v.standLevel == "01") {
                    color = "#d8090f";
                } else if (v.standLevel == "02") {
                    color = "#fd5c0c";
                } else if (v.standLevel == "03") {
                    color = "#ffd966";
                } else if (v.standLevel == "04") {
                    color = "#2f75b5";
                }
                return `<p style="background: ${color}; width: 32px; height: 16px; border-radius: 4px;"></p>`;
            },
        }
    ],
    promiseDetailInfo: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "企业名称",
            key: "enterpriseName",
        },
        {
            text: "承诺状态",
            key: "status",
            render: v => {
                let color = 'green';
                let text = '已承诺'
                switch (v.status) {
                    case '0':
                        color = 'red';
                        text = '未承诺';
                        break;
                
                    default:
                        break;
                }
                return `<span style="color: ${color}">${text}</span>`
            }
        },
    ],
    comintegral: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "企业名称",
            key: "cmyName",
        },
        {
            text: "记分状态",
            key: "type",
            render: v => {
                let color = '';
                let text = ''
                switch (v.type) {
                    case "1":
                        color = 'green';
                        text = '合格';
                        break;
                    case "2":
                        color = 'orange';
                        text = '约谈';
                        break;
                    case "3":
                        color = 'orange';
                        text = '教育';
                        break;
                    case "4":
                        color = 'red';
                        text = '通报';
                        break;
                
                    default:
                        break;
                }
                return `<span style="color: ${color}">${text}</span>`
            }
        },
    ],
    personnel: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "姓名",
            key: "name",
        },
        {
            text: "职位",
            key: "type",
            dictionary: "personnelType"
        },
        {
            text: "性别",
            key: "gender",
            dictionary: "sex"
        },
        {
            text: "联系电话",
            key: "phone"
        }
    ],
    workPlace: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "车间名称",
            key: "workName",
        },
        {
            text: "负责人",
            key: "chargeName",
        },
        riskLevel,
        {
            text: "联系号码",
            key: "phone",
        },
    ],
    popUser: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "姓名",
            key: "name",
        },
        {
            text: "职位",
            key: "type",
            dictionary: "personnelType"
        },
        {
            text: "联系电话",
            key: "phone"
        }
    ],
    dangerSource: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "危害因素名称",
            key: "name",
        },
        {
            text: "危险有害因素",
            key: "hazFactor",
            dictionary: "hazFactor"
        },
        {
            text: "可能导致的事故",
            key: "accident"
        },
        {
            text: "危害因素等级",
            key: "type",
            remote: {
                url: "remoteDict.url",
                parame: { dictCode: "wxyfl" },
                text: "subDictName",
                value: "subDictValue",
                valueType: "string",
            },
        },
        {
            text: "管控措施层级",
            key: "controlLevel",
            remote: {
                url: "remoteDict.url",
                parame: { dictCode: "gkcj" },
                text: "subDictName",
                value: "subDictValue",
                valueType: "string",
            },
        },
        {
            text: "固有等级",
            key: "hazGrade",
            remote: {
                url: "remoteDict.url",
                parame: { dictCode: "wxygydj" },
                text: "subDictName",
                value: "subDictValue",
                valueType: "string",
            },
            color: {
                "00": "text-success",
                "01": "text-danger",
                "02": "text-danger",
                "03": "text-danger",
                "04": "text-danger",
            }
        }
    ],
    dangerSourceDialog: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "危害因素名称",
            key: "hazardPojo.name",
        },
        {
            text: "危险有害因素",
            key: "hazardPojo.hazFactor",
            dictionary: "hazFactor"
        },
        {
            text: "危害因素分类",
            key: "hazardPojo.type",
            remote: {
                url: "remoteDict.url",
                parame: { dictCode: "wxyfl" },
                text: "subDictName",
                value: "subDictValue",
                valueType: "string",
            },
        },
        {
            text: "状态",
            key: "hazardPojo.hazStauts",
            render: v => {
                return v.hazardPojo.hazStauts == "00" ? "异常" : "正常"
            }
        },
        {
            text: "管控措施条数",
            key: "hazardPojo.ponderance"
        },
    ],
    dangerSourceRecordDialog: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "操作内容",
            key: "operateContent",
        },
        {
            text: "操作人",
            key: "userName",
        },
        {
            text: "操作时间",
            key: "operateTime",
            render: v => {
               return formatTime(v.operateTime) 
            }
        },
        {
            text: "操作类型",
            key: "operateType",
            render: v => {
                let text = '-';
                switch (v.operateType) {
                    case 1:
                        text = '新增';
                        break;
                    case 2:
                        text = '修改';
                        break;
                    case 3:
                        text = '删除';
                        break;
                    default:
                        break;
                }
                return text
            }
        },
    ],
    riskPoint: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "企业名称",
            key: "cmyName",
            visible: () => {
                return userType == 2
            }
        },
        {
            text: "风险点名称",
            key: "riskName",
        },
        {
            text: "生产工艺",
            key: "craft",
            dictionary: "craftType"
        },
        {
            text: "所属车间",
            key: "workName",
        },
        {
            text: "位置",
            key: "riskLocation",
        },
        {
            text: "危害因素数量",
            key: "hazardCount",
        },
        riskLevel
    ],
    riskIdentify: [
        {
            text: "序号",
            key: "id",
        },
        {
            text: "风险点名称",
            key: "riskName",
        },
        {
            text: "危险有害因素",
            key: "factor",
            emptyText: "-",
            dictionary: "hazFactor"
        },
        {
            text: "风险点所在位置",
            key: "riskLocation",
        },
        {
            text: "联系人",
            key: "contact",
        },
        riskLevel
    ],
    twoListInfo: [
        {
            text: "企业名称",
            key: "cmyName"
        },
        {
            text: "风险点名称",
            key: "riskName",
        },
        // {
        //     text: "风险点类型",
        //     key: "riskType",
        // },
        // {
        //     text: "危害因素",
        //     key: "factor",
        //     emptyText: "-",
        //     dictionary: "hazFactor"
        // },
        riskLevel,
        {
            text: "管控措施",
            key: "measures",
        },
        // {
        //     text: "现有控制措施",
        //     key: "nowMeasures",
        // },
        {
            text: "负责人",
            key: "responsePeople",
        },
        {
            text: "检查频次",
            key: "frequency",
            dictionary: 'frequency'
        },
    ],
    twoListInfos: [
        {
            text: "企业名称",
            key: "cmyName"
        },
        {
            text: "风险点名称",
            key: "riskName"
        },
        {
            text: "风险因素",
            key: "factor",
            dictionary: 'hazFactor'
        },
        {
            text: "场所区域",
            key: "riskLocation"
        },
        {
            text: "管控措施",
            key: "measures"
        },
        {
            text: "责任人",
            key: "responsePeople"
        },
        {
            text: "检查日期",
            key: "checkTime"
        },
    ],
    electronicInspection: [
        {
            text: "企业名称",
            key: "cmyName",
        },
        {
            text: "巡检名称",
            key: "patName",
        },
        {
            text: "巡检人",
            key: "patPerson",
        },
        {
            text: "计划巡检时间",
            key: "patTime",
        },
        {
            text: "实际时间",
            key: "actualTime",
        },
        {
            text: "状态",
            key: "patState",
            dictionary: "patState",
            color: {
                "01": "text-warning",
                "02": "text-info",
                "03": "text-success"
            }
        }
    ],
    workPermit: [
        {
            text: "企业名称",
            key: "cmyName",
            visible: () => {
                return userType == 2
            }
        },
        {
            text: "证书名称",
            key: "certificateName",
        },
        {
            text: "证书编号",
            key: "cardNum",
        },
        {
            text: "发证机构",
            key: "authority",
        },
        {
            text: "证书类别",
            key: "certificateType",
            dictionary: "certificateType"
        },
        {
            text: "部门名称",
            key: "deptName",
        },
        {
            text: "员工",
            key: "employee",
        },
        {
            text: "有效期",
            key: "termDate",
            render: v => {
                let isRed = false;
                //1.有复审日期，当前时间与复审日期间隔不足30天
                if(v.recheckTime) {
                    let diff = (new Date(v.recheckTime) -
                                new Date()) /
                                (24 * 60 * 60 * 1000);
                    isRed = diff < 30 ? true : false;
                }
                //2.没有发证日期和复审日期，与有效期间隔不足30天
                if(!v.recheckTime || !v.grantTime) {
                    let diff = (new Date(v.termDate) -
                                new Date()) /
                                (24 * 60 * 60 * 1000);
                    isRed = diff < 30 ? true : false;
                }
                return `<span style="color: ${isRed ? 'red' : '#000'}">${v.termDate || '-'}</span>`
            }
        },
        {
            text: "发证日期",
            key: "grantTime",
        },
        {
            text: "复审日期",
            key: "recheckTime",
        },
    ],
    checkstandard: [
        {
            text: "检查项目",
            key: "name",
        },
        {
            text: "标准描述",
            key: "description",
        },
        {
            text: "标准内容",
            key: "content",
        },
        {
            text: "适用对象",
            key: "checkObject",
        },
        {
            text: "参考依据项",
            key: "reference",
        },
        {
            text: "检查类型",
            key: "category",
            remote: {
                url: "remoteDict.url",
                parame: { dictCode: "yhjclx" },
                text: "subDictName",
                value: "subDictValue",
                valueType: "string",
            },
        }
    ],
    checkstandardDetails: [
        {
            text: "标准",
            key: "checkNorm",
        },
        {
            text: "内容",
            key: "content",
        },
        {
            text: "备注",
            key: "remark",
        }
    ],
    saferCheckList: [
        {
            text: "检查记录单名称",
            key: "recordName",
        },
        {
            text: "检查状态",
            key: "status",
            dictionary: "checkState",
            color: {
                1: "text-warning",
                2: "text-success"
            }
        },
        {
            text: "检查要求",
            key: "checkRequired",
        },
        {
            text: "检查人",
            key: "checkUser",
        },
        {
            text: "检查区域",
            key: "checkArea",
        },
        {
            text: "检查类型",
            key: "checkType",
            dictionary: "checkType"
        },
        {
            text: "检查时间",
            key: "checkTime",
        },
        {
            text: "检查结论",
            key: "checkResult",
        }
    ],
    latentControlList: [
        {
            text: "编号",
            key: "id",
        },
        {
            text: "企业名称",
            key: "cmyName",
            visible: () => {
                return userType == 2
            }
        },
        {
            text: "检查名称",
            key: "checkName",
        },
        {
            text: "隐患地点",
            key: "insLocation",
        },
        {
            text: "隐患等级",
            key: "insType",
            dictionary: "insTypes"
        },
        {
            text: "隐患类型",
            key: "type",
            remote: {
                url: "remoteDict.url",
                parame: { dictCode: "yhjclx" },
                text: "subDictName",
                value: "subDictValue",
                valueType: "string",
            },
        },
        {
            text: "隐患发现类型",
            key: "searchType",
            dictionary: "searchType"
        },
        {
            text: "检查人员",
            key: "insPerson",
        },
        {
            text: "检查时间",
            key: "checkTime",
        },
        {
            text: "状态",
            key: "status",
            dictionary: userType == 1 ? "latentControlStatus_1" : "latentControlStatus_2",
            color: {
                1: "text-danger",
                2: "text-warning",
                3: "text-success"
            }
        },
    ],
    emergencyThings: [
        {
            text: "物资名称",
            key: "name",
        },
        {
            text: "企业名称",
            key: "cmyName",
            visible: () => {
                return userType == 2
            }
        },
        {
            text: "物资类别",
            key: "type",
            dictionary: "emergencyThingsType"
        },
        {
            text: "单位",
            key: "unit",
        },
        {
            text: "数量",
            key: "count",
        },
        {
            text: "位置",
            key: "location",
        },
        {
            text: "发起人",
            key: "createBy",
        },
        {
            text: "联系电话",
            key: "chargePersonTel",
        },
        {
            text: "物资状态",
            key: "status",
            dictionary: 'emergencyThingsStatus',
            color: {
                '1': 'text-success',
                '2': 'text-info',
                '3': 'text-warning'
            }
        },
    ],
    emergencyThingsDetails: [
        {
            text: "记录类型",
            key: "type",
            dictionary: "emergencyThingsDetailsType"
        },
        {
            text: "记录数量",
            key: "count",
        },
        {
            text: "备注",
            key: "remark",
        },
    ],
    planManagement: [
        {
            text: "预案名称",
            key: "name",
        },
        {
            text: "企业名称",
            key: "cmyName",
            visible: () => {
                return userType == 2
            }
        },
        {
            text: "预案内容",
            key: "content",
            ellipsis: true
        },
        {
            text: "预案级别",
            key: "levelName",
        },
        {
            text: "预案类型",
            key: "typeName",
        },
        {
            text: "事故类型",
            key: "accidentType",
            dictionary: 'hazFactor'
        },
        {
            text: "负责人",
            key: "createBy",
        },
        {
            text: "备案状态",
            key: "filing",
        },
        {
            text: "提交状态",
            key: "status",
            dictionary: "planManagementStatus",
            color: {
                1: "text-danger",
                2: "text-warning",
                3: "text-success",
            }
        },
    ],
    emergencyDrill: [
        {
            text: "演练名称",
            key: "name",
        },
        {
            text: "企业名称",
            key: "cmyName",
            visible: () => {
                return userType == 2
            }
        },
        {
            text: "演练状态",
            key: "status",
            dictionary: "emergencyDrillStatus",
            color: {
                1: "text-danger",
                2: "text-success"
            }
        },
        {
            text: "开始时间",
            key: "time",
        },
        {
            text: "负责人",
            key: "person",
        },
        {
            text: "负责人电话",
            key: "phone",
        }
    ],
    accidentList: [
        {
            text: "企业名称",
            key: "cmyName",
            visible: () => {
                return userType == 2
            }
        },
        {
            text: "事件事故名称",
            key: "eventName",
        },
        {
            text: "事发地点",
            key: "happenLocaiton",
        },
        {
            text: "事件类型",
            key: "eventType",
            dictionary: "hazFactor"
        },
        {
            text: "负责人",
            key: "principalName",
        },
        {
            text: "负责人电话",
            key: "principalTel",
        },
        {
            text: "发生时间",
            key: "happenTime",
        },
        {
            text: "状态",
            key: "eventFlag",
            dictionary: userType == 1 ? "accidentList_1" : "accidentList_2",
            color: {
                "1": "text-danger",
                "2": "text-warning",
                "3": "text-success",
            }
        },
    ],
    eventRectify: [
        {
            text: "整改负责人",
            key: "meaUser",
        },
        {
            text: "整改期限",
            key: "rectifyTime",
            type: "date",
        },
        {
            text: "整改措施",
            key: "measure",
        },
        {
            text: "备注",
            key: "remark",
        },
    ],
    noticeList: [
        {
            text: "消息内容",
            key: "message",
        },
        {
            text: "发送人",
            key: "mesSender",
            // dictionary: "messageType"
        },
        {
            text: "消息类型",
            key: "type",
            dictionary: "eventList"
        },
        {
            text: "创建时间",
            key: "createTime",

        }
    ],
    hazardRisk: [
        {
            text: "企业名称",
            key: "cmyName",
        },
        {
            text: "风险点名称",
            key: "riskPojo",
            render: v => {
                return v.riskPojo.riskName
            }
        },
        {
            text: "危害因素名称",
            key: "name",
            render: v => {
                return v.hazardPojo.name
            }
        },
        {
            text: "危险有害因素",
            key: "hazardPojo.hazFactor",
            dictionary: "hazFactor"
        },
        {
            text: "危害因素分类",
            key: "hazardPojo.type",
            remote: {
                url: "remoteDict.url",
                parame: { dictCode: "wxyfl" },
                text: "subDictName",
                value: "subDictValue",
                valueType: "string",
            },
        },
        {
            text: "状态",
            key: "status",
            dictionary: "functionStatus",
            color: {
                "00": "text-success",
                "01": "text-danger"
            }

        }
    ],
    ElectronicInspection1: [
        {
            text: "企业名称",
            key: "cmyName",
        },
        {
            text: "风险点名称",
            key: "riskPojo",
            render: v => {
                return v.riskPojo.riskName
            }
        },
        {
            text: "危害因素名称",
            key: "name",
            render: v => {
                return v.hazardPojo.name
            }
        },
        {
            text: "危险有害因素",
            key: "hazardPojo.hazFactor",
            dictionary: "hazFactor"
        },
        {
            text: "危害因素分类",
            key: "hazardPojo.type",
            remote: {
                url: "remoteDict.url",
                parame: { dictCode: "wxyfl" },
                text: "subDictName",
                value: "subDictValue",
                valueType: "string",
            },
        },
        {
            text: "状态",
            key: "status",
            dictionary: "functionStatus",
            color: {
                "00": "text-success",
                "01": "text-danger"
            }

        }
    ],
    riskMeasureOrder: [
        {
            text: "企业名称",
            key: "cmyName",
        },
        {
            text: "风险点名称",
            key: "riskName"
        },
        {
            text: "危害因素名称",
            key: "hazName"
        },
        {
            text: "管控措施分类",
            key: "meaType",
            dictionary: "dgType"
        },
        {
            text: "责任人",
            key: "responsePeopleName",
        },
        {
            text: "管控措施描述",
            key: "measures"
        },

    ],
    task: [
        {
            text: "任务名称",
            key: "name",
        },
        {
            text: "任务描述",
            key: 'missionDesc'
        },
        {
            text: "截止时间",
            key: 'endTime'
        },
        {
            text: "关联考试",
            key: 'examName'
        },

    ],
    taskPerson: [
        {
            text: "姓名",
            key: "name",
        },
        {
            text: "所属企业",
            key: "company",
        },
        {
            text: "职位",
            key: "type",
            dictionary: 'personnelType'
        },
        {
            text: "联系方式",
            key: "peopleMobile",
        },
        {
            text: "课程完成率",
            key: "coursePercentage",
            render: v => {
                let coursePercentage = 0;
                if(v.finishedCount && v.courseCount && v.courseCount != 0) {
                    coursePercentage = (Math.round(v.courseCount / v.courseCount * 10000) / 100.00)
                }
                return coursePercentage + '%'
            }
        },
        {
            text: "考试任务",
            key: "examStatus",
            render: v => `<span style="color: ${v.examStatus == 1 ? 'green' : 'red'}">${v.examStatus == 1 ? '已完成' : '未完成'}</span>`
        },
        {
            text: "分数",
            key: "score",
        },
        {
            text: "已重新分配",
            key: "againFlag",
            render: v => `<span style="color: ${v.againFlag == 1 ? 'red' : 'green'}">${v.againFlag == 1 ? '否' : '是'}</span>`
        },
    ],
    chosePsonnel: [
        {
            text: "姓名",
            key: "userName",
        },
        {
            text: "职位",
            key: 'type',
            dictionary: 'userType'
        },
        {
            text: "电话",
            key: 'phone'
        },

    ],
    scoreManage: [
        {
            text: "企业名称",
            key: "cmyName",
        },
        {
            text: "事项",
            key: "content",
        },
        {
            text: "记分总数",
            key: "total",
        },
        {
            text: "类型",
            key: "type",
            dictionary: 'scoreManageType',
            color: {
                "0": "text-success",
                "1": "text-danger",
            }
        },
        {
            text: "分数",
            key: "score",
        },
    ],
    hazardRiskPojoList: [
        {
            text: "企业" + i,
            key: "cmyName",
        },
        {
            text: "风险点" + i,
            key: 'riskPojo.riskName',
        },
        {
            text: "危害因素" + i,
            key: 'hazardPojo.name'
        },
        {
            text: "危险有害因素",
            key: 'hazardPojo.hazFactor',
            dictionary: 'hazFactor'
        },
        {
            text: "危害因素等级",
            key: 'hazStauts',
            render: ({ hazStauts: v }) => {
                switch (v) {
                    case '01':
                        return "低";
                    case "02":
                        return "中";
                    default:
                        return "高";
                }
            }
        },
        {
            text: "状态",
            key: 'status',
            render: v => {
                let color = '#000';
                let text = '-'
                switch (v.status) {
                    case '00':
                        text = '正常';
                        color = 'rgb(221 176 228)';
                        break;
                    case "01":
                        text = '异常';
                        break;
                    default:
                        break;
                }
                return `<span style="color: ${color}">${text}</span>`
            }
        },
    ],
    orgSystem: [
        {
          text: "层级",
          type: "index",
          key: "index",
          width: 100,
        },
        {
          text: "组织名称",
          key: "orgName",
        },
    
        {
          text: "组织简称",
          key: "shortName",
        },
    
        {
          text: "显示顺序",
          key: "sort",
        },
    
        {
          text: "状态",
          key: "status",
          remote: {
            url: "remoteDict.url",
            text: "dictLabel",
            value: "dictValue",
            parame: {
              dictType: "sys_org_status",
            },
          },
          render: (v) => {
            let text = "-";
            switch (v.status) {
              case 0:
                text = "正常";
                break;
              case 1:
                text = "停用";
                break;
              default:
                break;
            }
            return text;
          },
        },
        {
          text: "创建时间",
          key: "createTime",
        },
      ],
      roleSystem: [
        {
          text: "角色名称",
          key: "roleName",
        },
        {
          text: "角色编号",
          key: "roleCode",
        },
        {
          text: "显示顺序",
          key: "sort",
        },
        {
          text: "状态",
          key: "status",
          render: (v) => {
            let text = "-";
            switch (v.status) {
              case 0:
                text = "正常";
                break;
              case 1:
                text = "停用";
                break;
              default:
                break;
            }
            return text;
          },
        },
        {
          text: "创建时间",
          key: "createTime",
        },
      ],
      paramSystem: [
        {
          text: "参数名称",
          key: "paramName",
        },
        {
          text: "参数编码",
          key: "paramCode",
        },
        {
          text: "参数值",
          key: "paramValue",
        },
    
        {
          text: "创建时间",
          key: "createTime",
        },
      ],
      dictTypeSystem: [
        {
          text: "字典名称",
          key: "dictName",
        },
        {
          text: "字典类型",
          key: "dictType",
        },
    
        {
          text: "字典状态",
          key: "status",
          remote: {
            url: "remoteDict.url",
            text: "dictLabel",
            value: "dictValue",
            parame: {
              dictType: "sys_dictType_status",	
              
            },
          },
          // render: (v,m) => {
          //   let text = "-";
          //   switch (v.status) {
          //     case 0:
          //       text = "正常";
          //       break;
          //     case 1:
          //       text = "停用";
          //       break;
          //     default:
          //       break;
          //   }
          //   return text;
          // },
        },
      ],
      dictDataSystem: [
        {
          text: "字典标签",
          key: "dictLabel",
        },
        {
          text: "字典类型",
          key: "dictType",
        },
        {
          text: "字典键值",
          key: "dictValue",
        },
        {
          text: "字典状态",
          key: "status",
        },
        {
          text: "排序",
          key: "dictSort",
        },
      ],
      userSystem: [
        {
          text: "用户姓名",
          key: "userName",
        },
        {
          text: "性别",
          key: "sex",
          remote: {
            url: "remoteDict.url",
            text: "dictLabel",
            value: "dictValue",
            parame: {
              dictType: "sys_user_sex",
            },
          },
        },
        {
          text: "登录名",
          key: "loginName",
        },
        {
          text: "手机号",
          key: "phone",
        },
        {
          text: "邮箱",
          key: "mail",
        },
        {
          text: "微信",
          key: "wxOpenid",
        },
     
        {
          text: "账号状态",
          key: "status",
          remote: {
            url: "remoteDict.url",
            text: "dictLabel",
            value: "dictValue",
            parame: {
              dictType: "sys_account_status",
            },
          },
        },
    
        {
          text: "创建时间",
          key: "createTime",
        },
      ],
      noticeSystem: [
        {
          text: "公告标题",
          align: "center",
          key: "noticeTitle",
        },
        {
          text: "公告内容",
          align: "center",
          key: "noticeContent",
        },
        {
          text: "公告类型", //sys_notice_type
          key: "noticeType",
          align: "center",
          remote: {
            url: "remoteDict.url",
            text: "dictLabel",
            value: "dictValue",
            parame: {
              dictType: "sys_notice_type",
            },
          },
          // render: (v, m) => {
          //   let text = "-";
          //   switch (v.noticeType) {
          //     case "1":
          //       text = "通知";
          //       break;
          //     case "2":
          //       text = "公告";
          //       break;
          //     default:
          //       break;
          //   }
          //   return text;
          // },
        },
        {
          text: "公告状态", //
          align: "center",
          key: "status",
          remote: {
            url: "remoteDict.url",
            text: "dictLabel",
            value: "dictValue",
            parame: {
              dictType: "sys_notice_status",
            },
          },
        },
    
        {
          text: "创建时间",
          align: "center",
          key: "createTime",
        },
      ],
      logSystem: [
        {
          text: "日志标题",
          key: "title",
        },
    
        {
          text: "日志类型",
          key: "type",
        },
        {
          text: "方法名称",
          key: "method",
        },
        {
          text: "访问ip",
          key: "ip",
        },
        {
          text: "请求URL",
          key: "url",
        },
        {
          text: "请求参数",
          key: "param",
        },
        {
          text: "操作员名称",
          key: "c",
        },
        {
          text: "操作时间",
          key: "operationTime",
        },
      ],
      jobSystem: [
        {
          text: "任务名称",
          key: "jobName",
        },
        {
          text: "任务描述",
          key: "remark",
        },
        {
          text: "服务名称",
          key: "methodName",
        },
        {
          text: "调用目标串",
          key: "strand",
        },
        {
          text: "cron表达式",
          key: "cron",
        },
    
        {
          text: "是否并发",
          key: "concurrent",
          remote: {
            url: "remoteDict.url",
            text: "dictLabel",
            value: "dictValue",
            parame: {
              dictType: "concurrentStatus",
            },
          },
        },
        {
          text: "状态",
          key: "status",
          remote: {
            url: "remoteDict.url",
            text: "dictLabel",
            value: "dictValue",
            parame: {
              dictType: "jobStatus",
            },
          },
        },
      ],
      popJobLog: [
        {
          text: "任务名称",
          key: "jobName",
        },
        {
          text: "日志内容",
          key: "content",
        },
        {
          text: "方法名称",
          key: "methodName",
        },
        {
          text: "执行状态",
          key: "status",
        },
        {
          text: "执行开始时间",
          key: "startTime",
        },
        {
          text: "执行结束时间",
          key: "stopTime",
        },
      ],
      activitiSystem: [
        {
          text: "模型Id",
          key: "jobName",
        },
        {
          text: "模型标识",
          key: "content",
        },
        {
          text: "模型名称",
          key: "methodName",
        },
        {
          text: "创建时间",
          key: "status",
        },
        {
          text: "版本",
          key: "startTime",
        },
        {
          text: "执行结束时间",
          key: "stopTime",
        },
      ],


}
export default tableConfig;