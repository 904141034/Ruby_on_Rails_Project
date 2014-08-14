/**
 * Created by lishaodan on 14-7-29.
 */
function BidList(bid_name,status,bidMessages){
    this.bid_name = bid_name;
    this.status=status;
    this.bidMessages=bidMessages;
}
BidList.prototype.add_saveItem=function(){
    var activities=Activity.getActivities();
    var innerAct=JSON.parse(localStorage.getItem("innerAct"))||{};
    _.findWhere(activities,{name:innerAct.name}).bidlists.unshift(this);
    Activity.setActivities(activities);
    innerAct.bid_name=this.bid_name;
    innerAct.bid_act="true";
    InnerAct.setInnerAct(innerAct);
};
BidList.get_listBid=function(){
    var activities=Activity.getActivities();
    var innerAct=InnerAct.getInnerAct();
    var bidlists= _.findWhere(activities,{name:innerAct.name}).bidlists;
    return bidlists;
};
BidList.clickCertainbid=function(bid_name){
    var innerAct=InnerAct.getInnerAct();
    innerAct.bid_name=bid_name;
    var bidlists=BidList.get_listBid();
    var bidlist=_.findWhere(bidlists,{bid_name:bid_name});
    bidlist.status=="status"?innerAct.bid_act="true":innerAct.bid_act="false";
    InnerAct.setInnerAct(innerAct);
};
BidList.getCertainBid=function(){
    var bidlists=BidList.get_listBid();
    var innerAct=InnerAct.getInnerAct();
    var certainbid=_.findWhere(bidlists,{bid_name:innerAct.bid_name});
    return certainbid;
};
BidList.stopBiddingAllFunctions=function($scope,$location){
    BidList.stopBidding($scope);
    BidList.stopBidding_SortAndCountActions();
    $location.path('/bid_results');
};
BidList.stopBidding=function($scope){
    var activities=Activity.getActivities();
    var innerAct=InnerAct.getInnerAct();
    var activitylists= _.findWhere(activities,{name:innerAct.name}).bidlists;
    _.findWhere(activitylists,{bid_name:innerAct.bid_name}).status="";
    innerAct.bid_act = "false";
    Activity.setActivities(activities);
    InnerAct.setInnerAct(innerAct);
    $scope.startbid = false;
};
BidList.stopBidding_SortAndCountActions=function(){
    var bidlists=BidList.get_listBid();
    var innerAct=InnerAct.getInnerAct();
    var bidMessages=_.findWhere(bidlists,{bid_name:innerAct.bid_name}).bidMessages;
    BidList.sort_Bybidprice(bidMessages);
    BidList.bid_pricegroup(bidMessages);
};
BidList.sort_Bybidprice=function(bidMessages){
    var sort_bybidprice = _.sortBy(bidMessages,function(bidMessages){
        return (bidMessages.bid_price);
    });
    localStorage.setItem("sort_bybidprice", JSON.stringify(sort_bybidprice));
};
BidList.bid_pricegroup=function(bidMessages){
    var count_pricegroup = _.countBy(bidMessages, function (bidMessages) {
        return bidMessages.bid_price;
    });
    var bid_pricegroup = _.map(count_pricegroup, function (value, key) {
        return {"price": key, "count": value}
    });
    localStorage.setItem('bid_pricegroup',JSON.stringify(bid_pricegroup));
    BidList.bid_success(bid_pricegroup);
};
BidList.bid_success=function(bid_pricegroup){
    var result=_.findWhere(bid_pricegroup,{count:1});
    typeof(result)=="undefined"?BidList.Nobid_success():BidList.hasbid_success(result);
};
BidList.Nobid_success=function(){
    var bid_success = JSON.parse(localStorage.getItem("bid_success")) || [];
    bid_success.person_name="";
    bid_success.bid_price="";
    bid_success.phone_number="";
    localStorage.setItem('bid_success',JSON.stringify(bid_success));
};
BidList.hasbid_success=function(result){
   var sort_bybidprice =JSON.parse(localStorage.getItem("sort_bybidprice"))||[];
   var bid_success = _.find(sort_bybidprice, function(bid_success){
        return bid_success.bid_price == result.price; });
   localStorage.setItem('bid_success',JSON.stringify(bid_success));
};
BidList.refresh=function(){
    var bidlists=BidList.get_listBid();
    var innerAct=InnerAct.getInnerAct();
    var bidMessages=_.findWhere(bidlists,{bid_name:innerAct.bid_name}).bidMessages;
    return bidMessages;
};
BidList.successResult=function($scope){
    var bid_success = JSON.parse(localStorage.getItem("bid_success")) || {};
    var bid_successphone = bid_success.phone_number.substr(0, 3);
    bid_success.person_name == "" ? BidList.successNo($scope):BidList.successYes(bid_success,$scope,bid_successphone);

};
BidList.successNo=function($scope){
    $scope.bid_success = "竞价失败！";
    $scope.bid_successMessage = "竞价失败！";
};
BidList.successYes=function(bid_success,$scope,bid_successphone){
    $scope.bid_success = bid_success.person_name + " " + "￥" + bid_success.bid_price + "  " + bid_success.phone_number;
    $scope.bid_successMessage = bid_success.person_name + " " + "￥" +
    bid_success.bid_price + "  " + bid_successphone + "XXXXXXXX" + " " + "竞价成功！";
};
BidList.getSortByPrice=function(){
    return JSON.parse(localStorage.getItem("sort_bybidprice"))||[];
};
BidList.getBidSuccess=function(){
    return JSON.parse(localStorage.getItem("bid_success"))||{};
};
BidList.getBidPriceGroup=function(){
    return JSON.parse(localStorage.getItem("bid_pricegroup"))||[];
};
BidList.getSortByPricelength=function(){
   return BidList.getSortByPrice().length;
};
BidList.judeBidSuccess=function($scope){
   var bid_success= BidList.getBidSuccess();
   bid_success.person_name==""? $scope.bid_success="竞价失败！": $scope.bid_success = bid_success.person_name + " " + "￥" + bid_success.bid_price + "  " + bid_success.phone_number;
};
BidList.post_bid_message=function(){
    var activities=Activity.getCurrentUser_activities();
    var bid_list_infos=[];
    for(var i in activities){
        var username=activities[i].userName;
        var activity_name=activities[i].name;
        var bm_no=activities[i].bmMessages.length;
        for(var j in activities[i].bidlists){
            var bid_name=activities[i].bidlists[j].bid_name;

            var bid_message_no=activities[i].bidlists[j].bidMessages.length;
            var bid_list_info={"username":username,"activity_name":activity_name,
                "bm_no":bm_no.toString(),"bid_name":bid_name,"bid_message_no":bid_message_no.toString()};
            bid_list_infos.unshift(bid_list_info);
        }

    }
    return bid_list_infos;
};
BidList.get_bid_detail=function(){
    var bid_details=JSON.parse(localStorage.getItem("bid_details"))||[];
    var current_user=CurrentUser.getCurrentUserName();
    var activity_name=InnerAct.getInnerAct().name;
    var bid_name=InnerAct.getInnerAct().bid_name;
    var current_user_activities=Activity.getCurrentUser_activities();
    var bidlists= _.findWhere(current_user_activities,{"userName":current_user,"name":activity_name}).bidlists;
    var bidmessages=_.findWhere(bidlists,{"bid_name":bid_name}).bidMessages;
    for(var i=0;i<bidmessages.length;i++){
        var bid_detail={};
        bid_detail.username=current_user;
        bid_detail.activity_name=activity_name;
        bid_detail.bid_name=bid_name;
        bid_detail.person_name=bidmessages[i].person_name;
        bid_detail.bid_price=bidmessages[i].bid_price;
        bid_detail.phone_number=bidmessages[i].phone_number;
        var result= _.findWhere(bid_details,{"username":current_user,"activity_name":activity_name,"bid_name":bid_name,"person_name":bid_detail.person_name});
       if(typeof(result)=="undefined"){
           bid_details.unshift(bid_detail);
       }

    }
    console.log(bid_details);
    localStorage.setItem('bid_details',JSON.stringify(bid_details)) ;
};
BidList.get_bid_success=function(){
    var bid_success_details=JSON.parse(localStorage.getItem("bid_success_details"))||[];
    var bid_success_detail={};
    var current_user=CurrentUser.getCurrentUserName();
    var activity_name=InnerAct.getInnerAct().name;
    var bid_name=InnerAct.getInnerAct().bid_name;
    bid_success_detail.username=current_user;
    bid_success_detail.activity_name=activity_name;
    bid_success_detail.bid_name=bid_name;
    var success=JSON.parse(localStorage.getItem("bid_success"))||{};
    bid_success_detail.person_name=success.person_name;
    bid_success_detail.success_price=success.bid_price;
    bid_success_detail.phone_number=success.phone_number;
    var result= _.findWhere(bid_success_details,{"username":current_user,"activity_name":activity_name,"bid_name":bid_name});
    if(typeof(result)=="undefined"){
        bid_success_details.unshift(bid_success_detail);
    }
    console.log(bid_success_details);
    localStorage.setItem('bid_success_details',JSON.stringify(bid_success_details))
};