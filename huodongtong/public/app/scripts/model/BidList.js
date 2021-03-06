/**
 * Created by lishaodan on 14-7-29.
 */
function BidList(bid_name, status, bidMessages) {
    this.bid_name = bid_name;
    this.status = status;
    this.bidMessages = bidMessages;
}
BidList.prototype.add_saveItem = function () {
    var activities = Activity.getActivities();
    var innerAct = JSON.parse(localStorage.getItem("innerAct")) || {};
    _.findWhere(activities, {name: innerAct.name}).bidlists.unshift(this);
    Activity.setActivities(activities);
    innerAct.bid_name = this.bid_name;
    innerAct.bid_act = "true";
    InnerAct.setInnerAct(innerAct);
};
BidList.get_listBid = function () {
    var activities = Activity.getActivities();
    var innerAct = InnerAct.getInnerAct();
    var bidlists = _.findWhere(activities, {name: innerAct.name}).bidlists;
    return bidlists;
};
BidList.clickCertainbid = function (bid_name) {
    var innerAct = InnerAct.getInnerAct();
    innerAct.bid_name = bid_name;
    var bidlists = BidList.get_listBid();
    var bidlist = _.findWhere(bidlists, {bid_name: bid_name});
    bidlist.status == "status" ? innerAct.bid_act = "true" : innerAct.bid_act = "false";
    InnerAct.setInnerAct(innerAct);
};
BidList.getCertainBid = function () {
    var bidlists = BidList.get_listBid();
    var innerAct = InnerAct.getInnerAct();
    var certainbid = _.findWhere(bidlists, {bid_name: innerAct.bid_name});
    return certainbid;
};
BidList.stopBiddingAllFunctions = function ($scope, $location) {
    BidList.stopBidding($scope);
    BidList.stopBidding_SortAndCountActions();
    $location.path('/bid_results');
};
BidList.stopBidding = function ($scope) {
    var activities = Activity.getActivities();
    var innerAct = InnerAct.getInnerAct();
    var activitylists = _.findWhere(activities, {name: innerAct.name}).bidlists;
    _.findWhere(activitylists, {bid_name: innerAct.bid_name}).status = "";
    innerAct.bid_act = "false";
    Activity.setActivities(activities);
    InnerAct.setInnerAct(innerAct);
    $scope.startbid = false;
};
BidList.Bidding_SortAndCountActions = function () {
    var bidlists = BidList.get_listBid();
    var innerAct = InnerAct.getInnerAct();
    var bidMessages = _.findWhere(bidlists, {bid_name: innerAct.bid_name}).bidMessages;
    BidList.bid_pricegroup(bidMessages);
};
BidList.stopBidding_SortAndCountActions = function () {
    var bidlists = BidList.get_listBid();
    var innerAct = InnerAct.getInnerAct();
    var bidMessages = _.findWhere(bidlists, {bid_name: innerAct.bid_name}).bidMessages;
    BidList.sort_Bybidprice(bidMessages);
};
BidList.sort_Bybidprice = function (bidMessages) {
    var sort_bybidprice = _.sortBy(bidMessages, function (bidMessages) {
        return (bidMessages.bid_price);
    });
    localStorage.setItem("sort_bybidprice", JSON.stringify(sort_bybidprice));
};
BidList.bid_pricegroup = function (bidMessages) {
    var count_pricegroup = _.countBy(bidMessages, function (bidMessages) {
        return bidMessages.bid_price;
    });
    var bid_pricegroup = _.map(count_pricegroup, function (value, key) {
        return {"price": key, "count": value}
    });
    localStorage.setItem('bid_pricegroup', JSON.stringify(bid_pricegroup));
};
BidList.set_empty_bid_pricegroup=function(){

    var bid_pricegroup=[];
    localStorage.setItem('bid_pricegroup', JSON.stringify(bid_pricegroup));
};
BidList.bid_success = function (bid_pricegroup) {
    var result = _.findWhere(bid_pricegroup, {count: 1});

    typeof(result) == "undefined" ? BidList.Nobid_success() : BidList.hasbid_success(result);
};
BidList.Nobid_success = function () {
    var bid_success = {};
    bid_success.person_name = "";
    bid_success.bid_price = "";
    bid_success.phone_number = "";
    localStorage.setItem('bid_success', JSON.stringify(bid_success));
};
BidList.hasbid_success = function (result) {
    var sort_bybidprice = JSON.parse(localStorage.getItem("sort_bybidprice")) || [];
    var bid_success = _.find(sort_bybidprice, function (bid_success) {
        return bid_success.bid_price == result.price;
    });

    localStorage.setItem('bid_success', JSON.stringify(bid_success));
};
BidList.refresh = function () {
    var bidlists = BidList.get_listBid();
    var innerAct = InnerAct.getInnerAct();
    var bidMessages = _.findWhere(bidlists, {bid_name: innerAct.bid_name}).bidMessages;
    return bidMessages;
};
BidList.store_bid_success=function(){
    var bid_pricegroup = JSON.parse(localStorage.getItem("bid_pricegroup")) || [];
    BidList.bid_success(bid_pricegroup);
};
BidList.successResult = function ($scope) {
    var bid_success = JSON.parse(localStorage.getItem("bid_success")) || {};
    var bid_successphone = bid_success.phone_number.substr(0, 3);
    bid_success.person_name == "" ? BidList.successNo($scope) : BidList.successYes(bid_success, $scope, bid_successphone);

};
BidList.successNo = function ($scope) {
    $scope.bid_success = "竞价失败！";
    $scope.bid_successMessage = "竞价失败！";
};
BidList.successYes = function (bid_success, $scope, bid_successphone) {
    $scope.bid_success = bid_success.person_name + " " + "￥" + bid_success.bid_price + "  " + bid_success.phone_number;
    $scope.bid_successMessage = bid_success.person_name + " " + "￥" +
        bid_success.bid_price + "  " + bid_successphone + "XXXXXXXX" + " " + "竞价成功！";
};
BidList.getSortByPrice = function () {
    return JSON.parse(localStorage.getItem("sort_bybidprice")) || [];
};
BidList.getBidSuccess = function () {
    return JSON.parse(localStorage.getItem("bid_success")) || {};
};
BidList.getBidPriceGroup = function () {
    return JSON.parse(localStorage.getItem("bid_pricegroup")) || [];
};
BidList.getSortByPricelength = function () {
    return BidList.getSortByPrice().length;
};
BidList.judeBidSuccess = function ($scope) {
    var bid_success = BidList.getBidSuccess();
    bid_success.person_name == "" ? $scope.bid_success = "竞价失败！" : $scope.bid_success = bid_success.person_name + " " + "￥" + bid_success.bid_price + "  " + bid_success.phone_number;
};
BidList.post_bid_message = function () {
    var activities = Activity.getCurrentUser_activities();
    var bid_list_infos = [];
    for (var i in activities) {
        var username = activities[i].userName;
        var activity_name = activities[i].name;
        var bm_no = activities[i].bmMessages.length;
        for (var j in activities[i].bidlists) {
            var bidname = activities[i].bidlists[j].bid_name;
            var bid_name = BidList.transfer_bidname(bidname);
            var bid_message_no = activities[i].bidlists[j].bidMessages.length;
            var bid_list_info = {"username": username, "activity_name": activity_name,
                "bm_no": bm_no.toString(), "bid_name": bid_name, "bid_message_no": bid_message_no.toString()};
            bid_list_infos.unshift(bid_list_info);
        }

    }
    return bid_list_infos;
};
BidList.get_bid_detail = function () {
    var bid_details = JSON.parse(localStorage.getItem("bid_details")) || [];
    var current_user = CurrentUser.getCurrentUserName();
    var activity_name = InnerAct.getInnerAct().name;
    var bidname = InnerAct.getInnerAct().bid_name;
    var bid_name = BidList.transfer_bidname(bidname);
    var current_user_activities = Activity.getCurrentUser_activities();
    var bidlists = _.findWhere(current_user_activities, {"userName": current_user, "name": activity_name}).bidlists;
    var bidmessages = _.findWhere(bidlists, {"bid_name": bidname}).bidMessages;
    var status = InnerAct.getInnerAct().bid_act;
    if (bidmessages.length == 0) {
        var bid_detail = {};
        bid_detail.username = current_user;
        bid_detail.activity_name = activity_name;
        bid_detail.bid_name = bid_name;
        bid_detail.status = status;
        bid_detail.person_name = "";
        bid_detail.bid_price = "";
        bid_detail.phone_number = "";
        var result = _.findWhere(bid_details, {"username": current_user, "activity_name": activity_name, "bid_name": bid_name, "person_name": ""});
        if (typeof(result) == "undefined") {
            bid_details.push(bid_detail);
        }
    }
    else {
        for (var i = 0; i < bidmessages.length; i++) {
            var bid_detail = {};
            bid_detail.username = current_user;
            bid_detail.activity_name = activity_name;
            bid_detail.bid_name = bid_name;
            bid_detail.status = status;
            bid_detail.person_name = bidmessages[i].person_name;
            bid_detail.bid_price = bidmessages[i].bid_price;
            bid_detail.phone_number = bidmessages[i].phone_number;
            var result = _.findWhere(bid_details, {"username": current_user, "activity_name": activity_name, "bid_name": bid_name, "person_name": bid_detail.person_name});
            if (typeof(result) == "undefined") {
                var kongperson = _.findWhere(bid_details, {"username": current_user, "activity_name": activity_name, "bid_name": bid_name, "person_name": ""});
                if (typeof(kongperson) == "undefined") {
                    bid_details.push(bid_detail);
                } else {
                    kongperson.person_name = bidmessages[i].person_name;
                    kongperson.bid_price = bidmessages[i].bid_price;
                    kongperson.phone_number = bidmessages[i].phone_number;
                }

            }

        }
    }
    localStorage.setItem('bid_details', JSON.stringify(bid_details));
};
BidList.stop_bid_status = function () {
    var bid_details = JSON.parse(localStorage.getItem("bid_details")) || [];
    var current_user = CurrentUser.getCurrentUserName();
    var activity_name = InnerAct.getInnerAct().name;
    var bidname = InnerAct.getInnerAct().bid_name;
    var bid_name = BidList.transfer_bidname(bidname);
    var user_activity = _.filter(bid_details, function(bid_detail){
        return bid_detail.username==current_user ;
});
    var user_activity1 = _.filter(user_activity, function(bid_detail){
        return bid_detail.activity_name==activity_name ;
    });
    var user_activity2 = _.filter(user_activity1, function(bid_detail){
        return bid_detail.bid_name==bid_name  ;
    });
    var user_activity3 = _.filter(user_activity2, function(bid_detail){
        return bid_detail.status=='true';
    });

    for (var i = 0; i < user_activity3.length; i++) {
        user_activity3[i].status="false";
    }
    localStorage.setItem('bid_details', JSON.stringify(bid_details));
};
BidList.get_bid_success = function () {
    var bid_success_details = JSON.parse(localStorage.getItem("bid_success_details")) || [];
    var bid_success_detail = {};
    var current_user = CurrentUser.getCurrentUserName();
    var activity_name = InnerAct.getInnerAct().name;
    var bidname = InnerAct.getInnerAct().bid_name;
    var bid_name = BidList.transfer_bidname(bidname);
    bid_success_detail.username = current_user;
    bid_success_detail.activity_name = activity_name;
    bid_success_detail.bid_name = bid_name;
    var success = JSON.parse(localStorage.getItem("bid_success")) || {};
    bid_success_detail.person_name = success.person_name;
    bid_success_detail.success_price = success.bid_price;
    bid_success_detail.phone_number = success.phone_number;
    var result = _.findWhere(bid_success_details, {"username": current_user, "activity_name": activity_name, "bid_name": bid_name});
    if (typeof(result) == "undefined") {
        bid_success_details.unshift(bid_success_detail);
    }
    localStorage.setItem('bid_success_details', JSON.stringify(bid_success_details))
};
BidList.post_bid_detail = function () {
    var bid_details = JSON.parse(localStorage.getItem("bid_details")) || [];
    return bid_details;
};
BidList.post_bid_success = function () {
    var bid_success_details = JSON.parse(localStorage.getItem("bid_success_details")) || [];
    return bid_success_details;
};
BidList.get_bid_price_group = function () {
    var bid_price_group_details = JSON.parse(localStorage.getItem("bid_price_group_details")) || [];
    var bid_price_group = JSON.parse(localStorage.getItem("bid_pricegroup"))||[];
    var current_user = CurrentUser.getCurrentUserName();
    var activity_name = InnerAct.getInnerAct().name;
    var bidname = InnerAct.getInnerAct().bid_name;
    var bid_name = BidList.transfer_bidname(bidname);
    for (var i = 0; i < bid_price_group.length; i++) {
        var bid_price_group_detail = {};
        bid_price_group_detail.username = current_user;
        bid_price_group_detail.activity_name = activity_name;
        bid_price_group_detail.bid_name = bid_name;
        bid_price_group_detail.price = bid_price_group[i].price;
        bid_price_group_detail.count = bid_price_group[i].count;
        var price = bid_price_group_detail.price;
        var result = _.findWhere(bid_price_group_details, {
            "username": current_user,
            "activity_name": activity_name,
            "bid_name": bid_name,
            "price": price
        });
        if (typeof(result) == "undefined") {
            bid_price_group_details.push(bid_price_group_detail);
        }else{
            result.count=bid_price_group_detail.count;
        }
    }
    var bid_price_group_result1 = _.filter(bid_price_group_details,function(m) {
        return m.username==current_user;

    });
    var bid_price_group_result2 = _.filter(bid_price_group_result1,function(m) {
        return m.activity_name==activity_name;
    });
    var bid_price_group_result3 = _.filter(bid_price_group_result2,function(m) {
        return m.bid_name==bid_name;
    });
    bid_price_group_detail= _.sortBy(bid_price_group_result3,function(xgroup){
        return xgroup.price;
    });
    var j=0;
    for(var i=0;i<bid_price_group_details.length;i++){
        if(bid_price_group_details[i].username==current_user&&bid_price_group_details[i].activity_name==activity_name
            &&bid_price_group_details[i].bid_name==bid_name){
                bid_price_group_details[i]=bid_price_group_detail[j];
            j++;
        }
    }
    localStorage.setItem('bid_price_group_details', JSON.stringify(bid_price_group_details))
};
BidList.post_bid_price_group = function () {
    var bid_price_group_details = JSON.parse(localStorage.getItem("bid_price_group_details")) || [];
    return bid_price_group_details;
};
BidList.transfer_bidname = function (bidname) {
    var no = bidname.substr(2);
    var result = "第" + no + "次竞价";
    return result;
};