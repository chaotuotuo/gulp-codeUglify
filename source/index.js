//加载树形菜单，各种点模块
define([
    'Graphic',
    'layers/GraphicsLayer',
    'widgets/PopupTemplate/PopupTemplate',
], function(Graphic, GraphicsLayer, PopupTemplate, SceneView) {
    return {
        name: 'dangerSourceGj',
        layers: {},
        alarmInterval: {},
        viewChange: {},
        hqLayers: {},
        zjlLayers: {},
        //加载危险源设备--start
        dangerEquipment: function(checkID, url, disName, selectGo) {
            var userid = ssStorage.getItem('userId');
            dengerLoadingPoint(checkID, url, disName);
            var self = this;
            //显示右侧设备列表
            $('#new-message').hide();
            // $('.equipment').css('right', '0');
            $('.equipment').css('right', '0');
            $('.right-button-nav').css('right', '430px');
            $('.esri-ui-top-left').css('left', 'calc(100% - 464px)');
            $('.equipment-btn').css('display', 'block');
            //HaiXin start
            $('#disDanger1').html('危险源设备图例');
            var _li =`
                    <li id="box_li_0" style="cursor:pointer">
                        <i class="" style="background-size: cover;"></i>
                        <span id="i_0"></span>
                        <span id='AllNumber'></span>
                    </li>`;
            $('.box3 ul').prepend(_li).find('li').width('20%');
            $('#i_0').html('<span class="span_0">全部</span>');
            $('#i_1').html('<span class="span_1">在线</span>');
            $('#i_2').html('<span class="span_2">离线</span>');
            $('#i_3').html('<span class="span_3">预警</span>');
            $('#i_4').html('<span class="span_4">告警</span>');
            var i_num = $('.box3 i');
            i_num[0].className = 'danger_0';
            i_num[1].className = 'danger_1';
            i_num[2].className = 'danger_2';
            i_num[3].className = 'danger_3';
            i_num[4].className = 'danger_4';
            $("#box_li_1").off("click");

            function dangerPointDelete() {
                dangerPoint = [];
                dangerGraphic = [];
                clearInterval(dangerPointSetinterval);
                dangerPointSetinterval = null;
                forPopuContent = [];
            };
            map.findLayerById('dangerPoint') && map.remove(map.findLayerById('dangerPoint'));
            $('#box_li_0').click(function() {
                dangerPointDelete();
                var ClickThis = this;
                var url = dataIPaddress + 'danger/listEquipmentDangerSource/' + userid;
                dengerLoadingPoint(checkID, url, disName, ClickThis);
            });
            $('#box_li_1').click(function() {
                dangerPointDelete();
                var ClickThis = this;
                var url = dataIPaddress + 'danger/listOnlineDangerSourceData/' + userid;
                dengerLoadingPoint(checkID, url, disName, ClickThis);
            });
            $("#box_li_2").off("click");
            $('#box_li_2').click(function() {
                dangerPointDelete();
                var ClickThis = this;
                var url = dataIPaddress + 'danger/listOfflineDangerSourceData/' + userid;
                dengerLoadingPoint(checkID, url, disName, ClickThis);
            });
            $("#box_li_3").off("click");
            $('#box_li_3').click(function() {
                dangerPointDelete();
                var ClickThis = this;
                var url = dataIPaddress + 'danger/listDangerDataWarning/' + userid;
                dengerLoadingPoint(checkID, url, disName, ClickThis);
            });
            $("#box_li_4").off("click");
            $('#box_li_4').click(function() {
                dangerPointDelete();
                var ClickThis = this;
                var url = dataIPaddress + 'danger/listDangerDataAlarm/' + userid;
                dengerLoadingPoint(checkID, url, disName, ClickThis);
            });
            //HaiXin end
            //    危险源设备绑定图层事件 JL start

            selectGo.off('click')
                    .on('click', function() {
                        dengerLoadingPoint(checkID, url, disName);
                    });
            console.log(selectGo);

            function dengerLoadingPoint(checkID, url, disName, ClickThis) {
                $('#equipment-list-head>thead').empty();
                $('#equipment-list>tbody').empty();
                $.ajax({
                    url: url,
                    type: "get",
                    xhrFields: {
                        withCredentials: true
                    },
                    data: {
                        areaCode: selectGo.attr('data-value'),
                        level: selectGo.attr('data-level')
                    },
                    crossDomain: true,
                    success: function(result) {
                        map.findLayerById("dangerSourceLayer")&&map.remove(map.findLayerById("dangerSourceLayer"));
                        map.findLayerById("dangerSourceZl")&&map.remove(map.findLayerById("dangerSourceZl"));
                        dangerPoint = [];
                        dangerGraphic = [];
                        clearInterval(dangerPointSetinterval);
                        dangerPointSetinterval = null;
                        forPopuContent = [];
                        map.findLayerById('dangerPoint') && map.remove(map.findLayerById('dangerPoint'));
                        //创建载点图层--start
                        var checkKey = checkID + '';
                        //定义图层
                        var graphicsLayerzl = new GraphicsLayer({
                            id: "dangerSourceZl"
                        });
                        map.add(graphicsLayerzl);
                        //创建载点图层--end
                        //获取数据
                        var data = result.data;
                        var onLineNumber = 0;
                        var AllNumber = 0;
                        var offLineNumber = 0;
                        var warningNumber = 0;
                        var alarmNumber = 0;

                        if (!data) {
                            console.log("数据为空!");
                            return;
                        }
                        //          console.log($(ClickThis).attr("id"));
                        //          if($(ClickThis).attr("id")=="box_li_2") {
                        //            console.log('a');
                        //重置告警/预警统计
                        if (/OfflineDangerSourceData/g.test(url)) {
                            $('#WarningNumber,#AlarmNumber').hide();
                        } else {
                            $('#WarningNumber,#AlarmNumber').show();
                        }
                        //          }
                        var deviceListHtmls = '';
                        if (!ClickThis) {
                            $('#AllNumber').html('(' + data.length + ')');
                            $('#OnLineNumber').html('(0)');
                            $('#OfflineNumber').html('(0)');
                            $('#WarningNumber').html('(0)');
                            $('#AlarmNumber').html('(0)');
                        };
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                if (!ClickThis) {
                                    if (data[i].onlineOroffline == 1) {
                                        onLineNumber++;
                                        $('#OnLineNumber').html('(' + onLineNumber + ')');
                                        if (!ClickThis && !/OfflineDangerSourceData/g.test(url)) {
                                            if (data[i].methane_concentration >= 60 && data[i].methane_concentration < 80) {
                                                warningNumber++;
                                                $('#WarningNumber').html('(' + warningNumber + ')');

                                            } else if (data[i].methane_concentration >= 80) {
                                                alarmNumber++;
                                                $('#AlarmNumber').html('(' + alarmNumber + ')');
                                            }
                                        }
                                    } else if (data[i].onlineOroffline == 2) {
                                        offLineNumber++;
                                        $('#OfflineNumber').html('(' + offLineNumber + ')');
                                    };

                                }

                                var popuContent = {
                                    title: data[i].station,
                                    content: '<iframe src="map/tpl/disDanger.html?disId=' +
                                        data[i].id + '&device_id=' + data[i].device_number + '" style="width:100%;height:285px;border:none;"></iframe>'
                                }
                                var picUrl = '';
                                var communicate_state = '';
                                if (data[i].onlineOroffline == '1') {
                                    communicate_state = '在线';
                                    picUrl = 'images/icon/danger-earlyWarn.png';
                                    if (!ClickThis && !/OfflineDangerSourceData/g.test(url)) {
                                        if (data[i].methane_concentration >= 60 && data[i].methane_concentration < 80) {
                                            picUrl = 'images/icon/danger-online.png';
                                        } else if (data[i].methane_concentration >= 80) {
                                            picUrl = 'images/icon/danger-warn.png';
                                        }
                                    }

                                } else if (data[i].onlineOroffline == '2') {
                                    communicate_state = '离线';
                                    picUrl = 'images/icon/danger-offline.png';
                                } else {
                                    picUrl = 'images/icon/danger.png';
                                }
                                // if (ClickThis && !/OfflineDangerSourceData/g.test(url)) {
                                //     if (data[i].methane_concentration >= 60 && data[i].methane_concentration < 80) {
                                //         picUrl = 'images/icon/danger-online.png';
                                //         warningNumber++;
                                //         $('#WarningNumber').html('(' + warningNumber + ')');
                                //     } else if (data[i].methane_concentration >= 80) {
                                //         picUrl = 'images/icon/danger-warn.png';
                                //         alarmNumber++;
                                //         $('#AlarmNumber').html('(' + alarmNumber + ')');
                                //     }
                                // }
                                if (data[i].methane_concentration >= 60 && data[i].methane_concentration < 80) {
                                    picUrl = 'images/icon/danger-online.png';
                                    // warningNumber++;
                                    // $('#WarningNumber').html('(' + warningNumber + ')');
                                } else if (data[i].methane_concentration >= 80) {
                                    picUrl = 'images/icon/danger-warn.png';
                                    // alarmNumber++;
                                    // $('#AlarmNumber').html('(' + alarmNumber + ')');
                                }
                                if ($(ClickThis).attr("id") == "box_li_1") {
                                    picUrl = 'images/icon/danger-earlyWarn.png';
                                }
                                //判断在线离线时是否统计告警预警的个数  end
                                //获取经纬度
                                if (data[i].lonlat) {
                                    var lonlatList = data[i].lonlat.split(",");
                                    var _lon = lonlatList[0] * 1;
                                    var _lat = lonlatList[1] * 1;
                                }
                                var zlgraphic1 = new Graphic({
                                    id: "dangerSourcezl" + (i + 1),
                                    geometry: {
                                        type: "point",
                                        longitude: _lon,
                                        latitude: _lat
                                    },
                                    symbol: {
                                        type: "picture-marker",
                                        width: 30,
                                        height: 30,
                                        url: picUrl
                                    },
                                    popupEnabled: true,
                                    popupTemplate: popuContent
                                });
                                if (picUrl == 'images/icon/danger-warn.png') {
                                    if ($(ClickThis).attr("id") != "box_li_1") {
                                        dangerPoint.push([_lon, _lat]);
                                        forPopuContent.push(popuContent);
                                    }
                                } else {
                                    graphicsLayerzl.add(zlgraphic1);
                                }
                                //载点--end
                                //水位状态
                                var water_state = '';
                                var water_state_img = '';
                                if (data[i].water_state == 1) {
                                    water_state = '正常';
                                    water_state_img = '<img src="./images/icon/danger-normal.png">';
                                } else if (data[i].water_state == 2) {
                                    water_state = '溢出';
                                    water_state_img = '<img src="./images/icon/danger-overflow.png">';
                                } else {
                                    //              return false;
                                }
                                //市电状态
                                var electricity_state = '';
                                var electricity_state_img = '';
                                if (data[i].electricity_state == '1') {
                                    electricity_state = '开';
                                    electricity_state_img = '<img src="./images/icon/danger-on.png">';
                                } else {
                                    electricity_state = '关';
                                    electricity_state_img = '<img src="./images/icon/danger-off.png">';
                                }

                                var communicate_state_img = '';

                                if (communicate_state === '在线') {
                                    communicate_state_img = './images/icon/danger-table-online.png'
                                } else {
                                    communicate_state_img = './images/icon/danger-table-offline.png"'
                                }

                                deviceListHtmls += '<tr>' +
                                    '<td width="6%">' + data[i].device_number + '</td>' + //设备编号
                                    '<td width="8%"><img src="' + communicate_state_img/*picUrl*/ + '"/> ' + communicate_state + '</td>' + //设备状态
                                    '<td width="24%"><span class="siteName">' + data[i].station + '</span></td>' + //站点名称
                                    '<td width="6%">' + (data[i].methane_concentration ? data[i].methane_concentration : data[i].methane_concentration) + ' LEL</td>' + //沼气浓度
                                    '<td width="7%">' + data[i].co_concentration + ' /PPM</td>' + //一氧化碳浓度
                                    '<td width="7%">' + data[i].so2_concentration + ' /PPM</td>' + //二氧化硫浓度
                                    '<td width="8%">' + water_state_img + water_state + '</td>' + //水位状态
                                    '<td width="7%">' + electricity_state_img + electricity_state + '</td>' + //市电状态
                                    '<td width="10%" style="text-align:left;padding-left:5px"><img src="./images/icon/danger-temperature.png">' + data[i].ambient_temperature + ' ℃</td>' + //环境温度
                                    '<td width="11%">' + data[i].realTime + '</td>' + //上次采样时间
                                    '<td width="6%"><span data-layerId="' + checkID + '" data-index="' + 'loadEquipmentLayer.graphics._items.length' + '" class="btn-location fa fa-location-arrow" ' +
                                    'onclick="viewSkipHig(' + _lon + ',' + _lat + ',' + '10,this)' +
                                    '" ></span></td>' + //操作定位
                                    '</tr>';
                            } //for-data--end
                        } else {
                            deviceListHtmls += '<tr><td colspan = "11">暂无数据</td></tr>'
                        }

                        function twinkle_1(type) {
                            if(dangerGraphic.length){
                                dangerGraphic.forEach(function(e,i,a){
                                    e.show = !e.show;
                                })
                            }else{
                                // viewer.scene.requestRenderMode = false;
                                if (type == 1) {
                                    var picUrl = 'images/icon/danger-warn.png';
                                } else {
                                    var picUrl = 'images/icon/danger-earlyWarn.png';
                                }
                                map.findLayerById('dangerPoint') && map.remove(map.findLayerById('dangerPoint'));
                                map.findLayerById('dangerSourceLayer') && map.remove(map.findLayerById('dangerSourceLayer'));
                                var dangerLayerzl = new GraphicsLayer({
                                    id: "dangerPoint"
                                });
                                map.add(dangerLayerzl);
                                for (var i = 0; i < dangerPoint.length; i++) {
                                    var zlgraphic2 = new Graphic({
                                        id: "dangerSourcezll" + (i + 1),
                                        geometry: {
                                            type: "point",
                                            longitude: dangerPoint[i][0],
                                            latitude: dangerPoint[i][1]
                                        },
                                        symbol: {
                                            type: "picture-marker",
                                            width: 20,
                                            height: 20,
                                            url: picUrl
                                        },
                                        popupEnabled: true,
                                        popupTemplate: forPopuContent[i]
                                    });
                                    dangerLayerzl.add(zlgraphic2);
                                    dangerGraphic.push(zlgraphic2);
                                };
                                // viewer.scene.requestRenderMode = true;
                            }
                        };
                        var num = 0;
                        dangerPointSetinterval = setInterval(function() {
                            if (num == 1) {
                                num = 0;
                            } else {
                                num = 1;
                            }
                            twinkle_1(num);
                        }, 500)
                        var deviceTitleHtmls;
                        deviceTitleHtmls += '<tr>' +
                            '<th width="6%">设备<br>编号</th>' +
                            '<th width="8%">设备<br>状态</th>' +
                            '<th width="24%">站点名称</th>' +
                            '<th width="6%">沼气<br>浓度</th>' +
                            '<th width="7%">硫化氢<br>浓度</th>' +
                            '<th width="7%">氨气<br>浓度</th>' +
                            '<th width="8%">水位<br>状态</th>' +
                            '<th width="7%">市电<br>状态</th>' +
                            '<th width="10%">环境<br>温度</th>' +
                            '<th width="11%">上次采样<br>时间</th>' +
                            '<th width="6%">查看<br>设备</th>' +
                            '</tr>';
                        $('#equipment-list-head>thead').append(deviceTitleHtmls);
                        $('#equipment-list>tbody').append(deviceListHtmls);
                        //模糊搜索
                        $("#shebeiKey").keyup(function() {
                            $("#equipment-list tbody tr").stop().hide()
                                .filter(":contains('" + ($(this).val()) + "')").show();
                        });
                    },
                    error: function(err) {
                        console.log("加载设备获取数据失败!", err);
                    }
                }); //ajax--end
            };
            $("body").on('click', "#siteName", function() {
                var html = $(this).html();
                var siteChild = $(this).parent().siblings()[$(this).parent().siblings().length - 1];
                $(siteChild).children().click();
                var pop = new PopupTemplate({
                    viewer: viewer
                });
                pop.autoPopOut(html);
            });
        },
        //加载危险源设备--end

        //移除危险源设备--start
        removeEquipment: function(checkID) {
            dangerPoint = [];
            $('.box3 ul>li:first').remove();
            clearInterval(dangerPointSetinterval);
            dangerPointSetinterval = null;
            forPopuContent = [];
            map.findLayerById('dangerPoint') && map.remove(map.findLayerById('dangerPoint'));
            viewer.popupTemplate.closePop();
            var checkKey = checkID + '';
            $('#new-message').show();
            $('.equipment').css('right', '-100%');
            $('.right-button-nav').css('right', '25px');
            $('.esri-ui-top-left').css('left', 'calc(100% - 59px)');
            $('.equipment-btn').css('display', 'none');
        }
        //移除危险源设备--end
    };
})