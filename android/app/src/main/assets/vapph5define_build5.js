

;(function(){
    var historyPushState = window.history.pushState;
    var historyReplaceState = window.history.replaceState;
    var defineStore = {
        sdStore : null,
        getDefineTags : function (child){
            var arr = [];
            var DefineTagNum = 0;

            function targetHandle(target,index){
                var tagstore = {
                    level : index,
                    id : 'h' + DefineTagNum
                };
                DefineTagNum ++;
                target.sensorsDefineStore = tagstore;
                arr.push(target);
            }
            //递归便利获取所有可圈选元素的信息 obj
            function func(obj,index){ 
                for(var i=0;i<obj.length;i++){
                    var target = obj[i];
                    var tags = ['input','a','button','textarea'];
                    var tagname = target.tagName.toLowerCase();
                    
                    if(tags.indexOf(tagname) > -1){
                        targetHandle(target,index);
                    }
        　　　　　　  if(target.children){
                        func(target.children,index+1);
        　　　　　    }
        　　　　 } 
            }    
            func(child,1);
            return arr;

        },
        getVisibility : function(el){
             
            var po = el.getBoundingClientRect(); 
            return (_isVisible(el)); 
            function _isVisible(el) {
                var p = el.parentNode;
                
                if ( 9 === p.nodeType ) {
                    return true;
                }
                if (
                        '0' === _getStyle(el, 'opacity') ||
                        'none' === _getStyle(el, 'display') ||
                        'hidden' === _getStyle(el, 'visibility')
                ) {
                    return false;
                }
               
                if ( p ) {
                    var parentPo = p.getBoundingClientRect();
                    if ( ('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow')) ) {
                        if (
                            (po.bottom <= parentPo.top)||
                            (po.top >= parentPo.bottom)||
                            (po.right <= parentPo.left)||
                            (po.left >= parentPo.right)
                        ) {  
                            return false;
                        }
                    }else if('hidden' === _getStyle(p, 'overflow-y') || 'scroll' === _getStyle(p, 'overflow-y')){
                        if(
                            (po.bottom <= parentPo.top)||
                            (po.top >= parentPo.bottom)
                        ){
                            return false;
                        }
                    }else if('hidden' === _getStyle(p, 'overflow-x') || 'scroll' === _getStyle(p, 'overflow-x')){
                        if(
                            (po.right <= parentPo.left)||
                            (po.left >= parentPo.right)
                        ){
                            return false;
                        }
                    }
                    return _isVisible(p);
                }
                return true;
            }
        
            function _getStyle(el, property) {
                if ( window.getComputedStyle ) {
                    return document.defaultView.getComputedStyle(el,null)[property];
                }
                if ( el.currentStyle ) {
                    return el.currentStyle[property];
                }
            }
        
            
        },
        //zIndex 取值为 level+zIndex
        getZIndex : function(el){
            var zIndex = window.getComputedStyle(el,null).getPropertyValue("z-index");
            var indexNum = 0;
            if(zIndex && !isNaN(+zIndex)){
                indexNum = +zIndex;
            }
            if(this.sdStore._.isObject(el.sensorsDefineStore)){
                indexNum += el.sensorsDefineStore.level;
            }
            return indexNum;
        },
        //获取可圈选子元素
        getSubElements : function(el){
            var elementsArr = [];
            function testTag(el){
                if(el.children){
                    for(var i=0;i<el.children.length;i++){
                        if(typeof(el.children[i].sensorsDefineStore) == 'object' && el.children[i].sensorsDefineStore.id){
                             elementsArr.push(el.children[i].sensorsDefineStore.id);
                        }
                        testTag(el.children[i]);
                    }
                }
            }
            testTag(el);
            return elementsArr;
        },
        getElementInfo : function(el){
            var po = el.getBoundingClientRect();
            var tagname = el.tagName;
            var obj = {
                // el:el,
                id : el.sensorsDefineStore.id,
                $element_content : this.sdStore._.getElementContent(el,tagname),
                $element_selector : this.sdStore.heatmap.getDomSelector(el),
                tagName : tagname,
                top : po.top,
                left : po.left,
                scrollX : window.pageXOffset,
                scrollY : window.pageYOffset,
                width : po.width,
                height : po.height,
                scale : window.devicePixelRatio,
                visibility : this.getVisibility(el),
                $url : location.href,
                $title : document.title,
                zIndex : this.getZIndex(el),
                subelements : this.getSubElements(el)
            };
            return obj;
        },
        //获取圈选元素信息返回按序排列好的
        getAllTagsInfo : function(tags){
            var arr = [];
            for(var i=0;i<tags.length;i++){
                arr.push(this.getElementInfo(tags[i]));
            }
            return this.sortIndex(arr);
        },
        //根据元素层级排序，前端要求 zIndex 为不重复的值
        sortIndex : function(arr){
            arr.sort(function(a,b){
                return a.zIndex - b.zIndex;
            });
            //app 拿到排好序的数组进行依次 +1，不需要 zindex 字段
            for(var i=0;i<arr.length;i++){
                delete arr[i].zIndex;
            }
            return arr;
        },
        //获取可视化 H5 data
        getDefineInfo : function(){
            var tags = defineStore.getDefineTags(document.children);
            var tagDataArr = defineStore.getAllTagsInfo(tags);
            var dataObj = {
                callType : 'visualized_track',
                data : tagDataArr
            };
            console.log(tagDataArr);
            defineStore.postData(dataObj); 
        },
        //发送数据给 App 
        postData:function(data){
            console.log('definejs 发送页面信息');
            if(typeof window.SensorsData_App_Visual_Bridge === 'object' && window.SensorsData_App_Visual_Bridge.sensorsdata_visualized_mode && window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.sensorsdataNativeTracker){
                window.webkit.messageHandlers.sensorsdataNativeTracker.postMessage(JSON.stringify(data));
            }else if(typeof window.SensorsData_App_Visual_Bridge === 'object' && window.SensorsData_App_Visual_Bridge.sensorsdata_visualized_mode() && window.SensorsData_App_Visual_Bridge.sensorsdata_hover_web_nodes){
                window.SensorsData_App_Visual_Bridge.sensorsdata_hover_web_nodes(JSON.stringify(data));
            } 
        },
        //添加可视化监听器
        addDefineListener : function(callback){
            var that = this;
            function observe (el, options, callback) {
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                var observer = new MutationObserver(callback);
                observer.observe(el, options);
            }
            var options = {
                childList: true,
                subtree: true,
                attributes: true
            }; 
            
            var changeFunc = (function listener(){
                return defineStore.sdStore._.throttle(callback,1000);
            })();
            observe(document.body, options, changeFunc);
            that.sdStore._.addEvent(window,'scroll',changeFunc);
            that.sdStore._.addEvent(window,'resize',changeFunc);
            that.sdStore._.addEvent(window,'load',changeFunc);
        },
        //发送页面信息
        postPageInfo:function(){
            var that = this;
            function getPageInfo(){
                var dataObj = {
                    callType:"page_info",
                    data:{
                        "$title": document.title,  
                        "$url": location.href 
                    }
                };
                that.postData(dataObj);
            }
            getPageInfo();
            var hashEvent = ('pushState' in window.history ? 'popstate' : 'hashchange');
            history.pushState = function() {
                historyPushState.apply(window.history, arguments);
                getPageInfo();
            };
            history.replaceState = function() {
                historyReplaceState.apply(window.history, arguments);
                getPageInfo();
            };
            window.addEventListener(hashEvent,getPageInfo);
        },
        init : function(){
            var that = this;
            var timer = null;
            console.log('definejs 加载成功');
            window.sa_jssdk_app_define_mode = function(sd,isLoaded){
                console.log('definejs 采集页面信息',isLoaded);
                if(isLoaded){
                    that.postPageInfo();
                    that.getDefineInfo();//获取元素信息
                }else{
                    that.sdStore = sd;
                    that.postPageInfo();
                    window.addEventListener('load',function(){
                        this.clearTimeout(timer);
                        that.getDefineInfo();//获取元素信息
                        that.addDefineListener(that.getDefineInfo);//添加监控器
                    });
                    timer = setTimeout(function(){
                        that.getDefineInfo();
                        that.addDefineListener(that.getDefineInfo);
                    },1000);
                } 
            };
        }
    };

    defineStore.init();

})();