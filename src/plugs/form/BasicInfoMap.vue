<template>
    <div>
        <div class="el-form-item">
          <label for="enter-map" class="el-form-item__label" style="width: 160px;">位置</label>
          <div class="el-form-item__content" style="margin-left: 160px;">
            <span class="enterMaps" @click="getCoor">
                <i class="icon"></i>进入地图
            </span>
          </div>
        </div>
        <el-dialog
            append-to-body
            :close-on-click-modal="false"
            title="经纬度信息"
            :visible.sync="DialogVisible"
        >
            <div class="mapBox" style="position: relative">
                <p class="tips">
                    地图中 企业名称 为
                    <span style="color: red">红色</span>的，是当前编辑的企业
                </p>
                <div class="lendgen">
                    <p><i style="background: rgba(255, 0, 0, 0.4)"></i><span>一级</span></p>
                    <p><i style="background: rgba(255, 165, 0, 0.4)"></i><span>二级</span></p>
                    <p><i style="background: rgba(255, 255, 0, 0.5)"></i><span>三级</span></p>
                    <p><i style="background: rgba(0, 0, 255, 0.4)"></i><span>四级</span></p>
                </div>
                <div id="map" class="mapView"></div>
                <button @click="draw()" class="btnApp" v-if="type != 'detail'">绘制企业</button>
                <button @click="check()" class="btnApp" style="top: 60px; right: 15px">
                2D/卫星
                </button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: "BasicInfoMap",
  props: ["value", "config", "fulldata"],
  data() {
    return {
      flag:false,
      DialogVisible: false,
      cmyCoor: [],
      cmyCenter: [],
      standLevel: '',
      type: '',
      rowInfo: null,
    };
  },
  methods: {
    getCoor() {
        this.standLevel = this.fulldata.standLevel || this.rowInfo.standLevel || '4';

        this.getCmyCoor();//获取公司经纬度和中心点信息
        this.DialogVisible = true;
    },
    getCmyCoor() {
      if(this.type != 'add' && this.rowInfo.coor && this.rowInfo.coorCenter) {
          //编辑
          this.cmyCoor = this.fulldata.coor ? JSON.parse(this.fulldata.coor) : JSON.parse(this.rowInfo.coor);
          this.cmyCenter = [JSON.parse(this.rowInfo.coorCenter)];
      } else {
          //新建
          this.cmyCoor = [];
          this.cmyCenter = [{lng: 119.41834225700588, lat: 32.327373594789194}];
      }

      setTimeout(() => {
          this.initMap();
      });
    },
    /**
     * 初始化地图对象
     */
    initMap() {
        //初始化三维地图控件
        const that = this;
        //设置中心点[119.414849, 32.34109]
        let center = [this.cmyCenter[0].lng, this.cmyCenter[0].lat];
        
        this.map3d = new BrightMap3D.Map("map", {
            mapType: BrightMap2D.MapType.NORMAL_OSM,
            // mapType: BrightMap3D.MapType.NORMAL_TIANDITU, //设置地图类型; lat--
            // || [118.858815, 31.962297]
            center, //设置地图初始中心点
            rotation: [-90, -30, 800], //设置地图初始姿态
            tk: that.$store.state.brightMapTk, //开发许可
            hdr: false, //设置底图的类型
        });
        this.map3d.scene.screenSpaceCameraController.enableTilt = false;
        this.drawPolygon = new BrightMap3D.DrawPolygonControl({
            fill: new BrightMap3D.Color(204, 204, 204, 0.1), //设置填充色
            lineColor: new BrightMap3D.Color(102, 102, 102, 1), //设置线颜色
            editing: false, //设置是否可编辑绘制好的图形
            midPoint: false, //在调整节点时，自动添加折线中点
            midPoint: true,
        });
        //绘制
        this.map3d.addControls(this.drawPolygon);
        //绘制公司范围
        if (this.cmyCoor.length > 0) {
            //添加公司名 文字
            this.addLabel(this.cmyCenter[0], this.fulldata.cmyName || this.rowInfo.cmyName, Cesium.Color.RED)
            this.drawCmy(this.cmyCoor);
        }
    },
    //绘制公司范围
    drawCmy(cmyCoor) {
      var coor = cmyCoor;
      var test = [];
      test.push(coor);
      //背景色控制
      var color = "";
      switch (this.standLevel) {
        case "04":
          color = new BrightMap3D.Color(0, 0, 0, 0.1);
          break;
        case "03":
          color = new BrightMap3D.Color(255, 0, 0, 0.5);
          break;
        case "02":
          color = new BrightMap3D.Color(255, 165, 0, 0.4);
          break;
        case "01":
          color = new BrightMap3D.Color(255, 0, 0, 0.4);
          break;
        default:
          break;
      }
      //固定的颜色，需要几个写几个
      for (var m = 0; m < test.length; m++) {
        var pointArr = [];
        var testarr = test[m];
        var col = color;
        for (var i = 0; i < testarr.length; i++) {
          var lonlat = testarr[i];
          pointArr.push(lonlat.lng, lonlat.lat);
        }
        var editEntitys = new BrightMap3D.Polygon({
          position: pointArr, //设置坐标点数组，长度必须大于等于6
          color: col, //设置填充颜色，未设置纹理时有效
          outlineColor: new BrightMap3D.Color(0, 0, 0, 1), //可选，设置轮廓颜色
          clampToGround: false,
          height: 0.0,
          extrudedHeight: 0.0,
        });
        this.map3d.addOverlay(editEntitys);
      }
    },
    
    //开始绘制按钮执行
    draw() {
      if(this.rowInfo && this.rowInfo.coorCenter) {
        //需要提示用户是否重新绘制的情况
        this.$confirm('确认要重新绘制公司范围吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.drawPolygon.deactive();
          this.drawPolygon.active(this.drawComplete1);
        }).catch(() => {})
      } else {
          this.drawPolygon.deactive();
          this.drawPolygon.active(this.drawComplete1);
      }
      
    },
    //绘制结束回调
    drawComplete1(positions) {
      var pointArr = [];
      this.coorArr = [];
      for (var i = 0; i < positions.length; i++) {
        var lonlat = BrightMap3D.Convertor.worldToDegree(positions[i]);
        var lng = lonlat.lng;
        var lat = lonlat.lat;
        pointArr.push([lng, lat]);
        this.coorArr.push({
          lng: lng,
          lat: lat,
        });
      }
      this.drawPolygon.deactive();
      this.fulldata.coor = JSON.stringify(this.coorArr);
      return;
    },
    //绘制文字
    addLabel(Centerlonlat, textLabel, fontColor) {
      var lng = Centerlonlat.lng;
      var lat = Centerlonlat.lat;
      this.map3d.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 20.61),
        label: {
          text: textLabel,
          font: "14pt Source Han Sans CN", //字体样式
          fillColor: fontColor,
          // fillColor: "red",       //字体颜色
          backgroundColor: Cesium.Color.AQUA, //背景颜色
          showBackground: false, //是否显示背景颜色
          style: Cesium.LabelStyle.FILL, //label样式
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直位置
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
          // pixelOffset:new Cesium.Cartesian2(10,0)            //偏移
        },
        distanceDisplay: 1200, //可选，设置在离相机多少距离时显示，单位米
      });
    },
    check() {
        if (!this.flag) {
            this.flag = true;
            this.map3d.setMapType(BrightMap3D.MapType.SATELLITE_ARCGIS);
        } else {
            this.flag = false;
            this.map3d.setMapType(BrightMap3D.MapType.NORMAL_OSM);
        }
    }
  },
  created() {
    if(this.config._this.currentRowData.id && this.fulldata.id) {
      this.type = 'detail'
      this.rowInfo = this.config._this.currentRowData;
    } else {
      this.type = this.config._this.$refs.list.popType;
      if(this.type == 'edit') {
        this.rowInfo = this.config._this.$refs.list.$refs.list.rowInfo;
      }
    }

    console.log(this.type)
  },
  
};
</script>

<style lang="scss" scoped>
.enterMaps {
  width: 97px;
  //   padding:5px 10px ;
  display: inline-block;
  height: 33px;
  border-radius: 5px;
  cursor: pointer;
  line-height: 31px;
  background: #fff;
  border: 1px solid #ccc;
  padding-left: 8px;
  .icon {
    background: url("../../assets/total/ditu.png") no-repeat;
    display: inline-block;
    width: 17px;
    height: 17px;
    position: relative;
    top: 3px;
    background-size: cover !important;
  }
}

/*地图窗口样式定义*/
.mapBox {
  overflow: hidden;
  height: 500px;
}
.lendgen {
  p {
    margin: 10px 0;
    i {
      display: inline-block;
      width: 30px;
      height: 20px;
      border-radius: 5px;
      margin-right: 10px;
      vertical-align: text-bottom;
    }
    span {
      display: inline-block;
      width: 30px;
      height: 20px;
      line-height: 20px;
    }
  }
  position: absolute;
  top: 60px;
  left: 30px;
  padding: 8px 10px;
  background: #fff;
  font-size: 15px;
  font-weight: 700;
  border-radius: 8px;
  z-index: 9999;
}
.tips {
  position: absolute;
  top: 10px;
  left: 30px;
  padding: 8px 10px;
  background: #fff;
  font-size: 18px;
  font-weight: 700;
  border-radius: 8px;
  z-index: 9999;
}
.mapView {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/*页面功能按钮*/
.btnApp {
  cursor: pointer;
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 14px;
  width: 120px;
  height: 32px;
}
</style>