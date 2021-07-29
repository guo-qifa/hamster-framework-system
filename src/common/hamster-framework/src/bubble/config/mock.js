var MockList = [
    {
        url: "http://localhost:8080/api/user/selectAll",
        option: {
            "errorcode": 0,
            "record": {
                "totalSize": 10,
                "currentPage": 1,
                "pageSize": 10,
                'data|1-10': [{
                    "userid|1-100": 1,
                    username: '@string',
                    "isadmin|0-1": 1,
                    "phone|11111111111-99999999999": 1,
                }]
            }
        },
        disabled: true
    },
    {
        url: "http://localhost:8080/api/department/tree",
        option: {
            "errorcode": 0,
            "record|1-3": [{
                "dptid|1-100": 1,
                dptname: '@string',
                model: '@string',
                dptType: '@string',
                'children|1-10': [{
                    "dptid|1-100": 1,
                    dptname: '@string',
                    model: '@string',
                    dptType: '@string',
                }]
            }]
        },
        disabled: true
    },
    {
        url: "http://localhost:8080/api/user/login",
        option: {
            "errorcode": 0,
            "record": {
                "id|1-100": 1,
                username: '@string',
                "isadmin|0-1": 1,
                "phone|11111111111-99999999999": 1,
            }
        },
        disabled: true
    },
    {
        url: "http://localhost:8080/api/equipment/equipmentType/selectAll",
        option: {
            "errorcode": 0,
            "record": {
                "totalSize": 10,
                "currentPage": 1,
                "pageSize": 10,
                'data|1-10': [{
                    "equipmenttypeid|1-100": 1,
                    name: '@string',
                    code: '@string'
                }]
            }
        },
        disabled: true
    },
    {
        url: "http://localhost:8080/api/Station/selectAll",
        option: {
            "errorcode": 0,
            "record": {
                "totalSize": 10,
                "currentPage": 1,
                "pageSize": 10,
                'data|1-10': [{
                    "equipmenttypeid|1-100": 1,
                    stationid: '@string',
                    s_name: '@string',
                    s_code: '@string',
                    worklineid: '@string',
                    "s_islaststation|0-1": 1
                }]
            }
        },
        disabled: true
    },
    {
        url: "http://localhost:8080/api/station/stationEquipment/selectAll",
        option: {
            "errorcode": 0,
            "record": {
                "totalSize": 10,
                "currentPage": 1,
                "pageSize": 10,
                'data|1-10': [{
                    "stationequipmentid|1-100": 1,
                    stationid: '@string',
                    equipmentid: '@string',
                    "se_count|0-10": 1,
                    se_filepath: '/src/de/tmp'
                }]
            }
        },
        disabled: true
    },
    {
        url: "http://localhost:8080/api/Workline/selectAll",
        option: {
            "errorcode": 0,
            "record": {
                "totalSize": 10,
                "currentPage": 1,
                "pageSize": 10,
                'data|1-10': [{
                    "worklineid|1-100": 1,
                    w_name: '@string',
                    w_code: '@string',
                    "w_isupload|0-1": 1,
                    w_uploadfilepath: '/src/de/tmp'
                }]
            }
        },
        disabled: true
    },
    {
        url: "http://localhost:8080/api/tightening/tightening/selectAll",
        option: {
            "errorcode": 0,
            "record": {
                "totalSize": 10,
                "currentPage": 1,
                "pageSize": 10,
                'data|1-10': [{
                    "presscsv_id|1-100": 1,
                    stationequipmentid: '@string',
                    produce_time: '@date',
                    channel_id: '@string',
                    angle_target: '@string',
                    id_code: '@string',
                    cno: '@string',
                    torque_threshold: '@string',
                    torque_lower: '@string',
                    torque_upper: '@string',
                    torque: '@string',
                    angle_upper: '@string',
                    angle_lower: '@string',
                    angle: '@string',
                    real_time: '@date',
                    max_time: '@string',
                    min_time: '@string',
                    program_no: '@string',
                    axle_no: '@string',
                    "result|0-1": 1
                }]
            }
        },
        disabled: true
    },
    {
        url: "http://localhost:8080/api/press/press/selectAll",
        option: {
            "errorcode": 0,
            "record": {
                "totalSize": 10,
                "currentPage": 1,
                "pageSize": 10,
                'data|1-10': [{
                    "presscsv_id|1-100": 1,
                    stationequipmentid: '@string',
                    produce_time: '@date',
                    channel_id: '@string',
                    angle_target: '@string',
                    id_code: '@string',
                    cno: '@string',
                    torque_threshold: '@string',
                    torque_lower: '@string',
                    torque_upper: '@string',
                    torque: '@string',
                    angle_upper: '@string',
                    angle_lower: '@string',
                    angle: '@string',
                    real_time: '@date',
                    max_time: '@string',
                    min_time: '@string',
                    program_no: '@string',
                    axle_no: '@string',
                    "result|0-1": 1
                }]
            }
        },
        disabled: true
    }
]

export default MockList;