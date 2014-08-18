/**
 * Created by lishaodan on 14-7-28.
 */
function Activity(activity_name,userName){
    this.userName=userName;
    this.name = activity_name;
    this.status="";
    this.bmMessages=[];
    this.bidlists=[];
}
Activity.prototype.add_saveItem=function()
{
    var activities=Activity.getActivities();
    activities.unshift(this);
    Activity.setActivities(activities);

};
Activity.getActivities=function(){
    var activities=JSON.parse(localStorage.getItem("activities"))||[];
    return activities;
};
Activity.setActivities=function(activities){
    localStorage.setItem('activities',JSON.stringify(activities)) ;
    Activity.store_current_user_activities();
};
Activity.store_current_user_activities=function(){
    var currentUser=CurrentUser.getCurrentUser();
    var activitiesAll=Activity.getActivities();
    var current_activities= _.filter(activitiesAll,function(activity){return activity.userName==currentUser.userName});
    Activity.setCurrentUser_activities(current_activities);
};
Activity.setCurrentUser_activities=function(current_activities){
    localStorage.setItem('current_user_activities',JSON.stringify(current_activities)) ;
};
Activity.getCurrentUser_activities=function(){
    return JSON.parse(localStorage.getItem("current_user_activities"))||[];
};
Activity.isRename=function(activity_name){

   var activities= Activity.judgeActivityName(activity_name);
   var result=!(activities==[]||typeof(activities)=="undefined");
   return String(result);

};
Activity.judgeActivityName=function(activity_name){
    var activities=Activity.getActivities();
    if(activities.length!=0){
        var activity=_.find(activities,function(activity){
            return activity.name==activity_name;
        });
        return activity;
    }
    return activities.toString();
};
Activity.getLength=function(){
    var activities= Activity.getCurrentUser_activities();
    return String((activities.length!=0));
};

Activity.list_activities=function($scope){
    var activities= Activity.getCurrentUser_activities();
    var innerAct=JSON.parse(localStorage.getItem("innerAct"))||{};
    $scope.activities=activities;
    if(innerAct.bid_act=="true"||innerAct.act=="true"){
        _.findWhere(activities,{name:innerAct.name}).status="status";
        $scope.activities=activities;
    }

};
Activity.activity_register=function(name){
    var activities=Activity.getActivities();
    var innerAct=JSON.parse(localStorage.getItem("innerAct"))||{};
    innerAct.name=name;
    var activity= _.find(activities,function(activity){
        return activity.name==name && activity.status=="status";
    });
    typeof(activity)=="undefined"? innerAct.act="false":innerAct.act="true";
    InnerAct.setInnerAct(innerAct);
};
Activity.Start_StopButton=function($scope,$location){
   $scope.start_stop =="开始" ? Activity.start($scope):Activity.stop($scope,$location);
};
Activity.start=function($scope){
    $scope.start_stop ="结束";
    var activities=Activity.getActivities();
    var innerAct=JSON.parse(localStorage.getItem("innerAct"));
    _.findWhere(activities,{name:innerAct.name}).status = "status";
    innerAct.act = "true";
    Activity.setActivities(activities);
    InnerAct.setInnerAct(innerAct);
};
Activity.stop=function($scope,$location){
    event.returnValue = confirm("确认要结束本次报名吗？");
    if (event.returnValue) {
        $scope.start_stop = "开始";
        var activities = Activity.getActivities();
        var innerAct = JSON.parse(localStorage.getItem("innerAct"))||{};
        innerAct.act = "";
        _.findWhere(activities, {name: innerAct.name}).status = "";
        Activity.setActivities(activities);
        InnerAct.setInnerAct(innerAct);
        $location.path('/bid_list');
    }
};
Activity.return_bmMessages=function(){
    var activities=Activity.getActivities();
    var innerAct=InnerAct.getInnerAct();
    var bmMessages= _.findWhere(activities,{name:innerAct.name}).bmMessages;
    return bmMessages;

};
Activity.ActActivity=function($scope){
    var activities=Activity.getActivities();
    var activityAct=_.findWhere(activities,{status:"status"});
    typeof(activityAct)=="undefined"? Activity.hasNoActActivity($scope):Activity.hasActActivity(activityAct,$scope);
};
Activity.hasNoActActivity=function($scope){
    $scope.start_stop = "开始";
    var activities=Activity.getActivities();
    var innerAct=JSON.parse(localStorage.getItem("innerAct"))||{};
    var bidlists=_.findWhere(activities,{name:innerAct.name}).bidlists;
    var bidlist= _.findWhere(bidlists,{status:"status"});
    typeof(bidlist)=="undefined"? $scope.startButton = true:$scope.startButton = false;
};
Activity.hasActActivity=function(activityAct,$scope){
    var actName=activityAct.name;
    var innerAct=JSON.parse(localStorage.getItem("innerAct"))||{};
    innerAct.name==actName ? Activity.setbutton1($scope):Activity.setbutton2($scope);
};
Activity.setbutton1=function($scope){
    $scope.startButton = true ;
    $scope.start_stop = "结束";

};
Activity.setbutton2=function($scope){
    $scope.startButton = false;
    $scope.start_stop = "开始";
};
Activity.bidLength=function(){
    var activities=Activity.getActivities();
    var innerAct=JSON.parse(localStorage.getItem("innerAct"))||{};
    var bidlists=_.findWhere(activities,{name:innerAct.name}).bidlists;
    return bidlists.length;
};
Activity.post_user_activity_message=function(){
    var user_activities=Activity.getCurrentUser_activities();
    var current_user_activity_messages=[];
    for(var i in user_activities){
        var activity_message={"username":user_activities[i].userName,"activity_name":user_activities[i].name,
            "bm_no":user_activities[i].bmMessages.length.toString(),"bid_no":user_activities[i].bidlists.length.toString()};
        current_user_activity_messages.unshift(activity_message);
    }
    return current_user_activity_messages;
};
Activity.upload=function($http){
    var currentlogUser=CurrentUser.getCurrentUser().userName;
    var current_activity=InnerAct.getInnerAct().name;
    var post_user_activity_message=Activity.post_user_activity_message();
    var post_bid_list_infos=BidList.post_bid_message();
    var post_bm_infos=BmMessage.post_bm_message();
    var post_bid_details= BidList.post_bid_detail();
    var post_bid_success=BidList.post_bid_success();
    var post_bid_price_group=BidList.post_bid_price_group();
    $http.post('/upload.json',{
        "currentlogUser":currentlogUser,
        "current_activity":current_activity,
        "post_user_activity_message" :post_user_activity_message,
        "post_bid_list_infos":post_bid_list_infos,
        "post_bm_infos":post_bm_infos,
        "post_bid_details":post_bid_details,
        "post_bid_success":post_bid_success,
        "post_bid_price_group":post_bid_price_group
    }).success(function(back){
        if(back.data=="true"){
            alert("同步成功！");
        }else{
            alert("同步失败，请重新同步！");
        }
    });
};





