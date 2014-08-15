'use strict';
/**
 * Created by lishaodan on 14-7-9.
 */
angular.module('yoDemoApp')
    .controller('activity_listCtrl', function ($scope,$location,$http) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        //活动为空直接跳转创建活动
        if (Activity.getLength()=="false") {
            $location.path('/activity_create');
        };
        Activity.list_activities($scope);
        //创建活动
        $scope.createActivity = function () {
            $location.path('/activity_create');
        };
        //点击单个活动事件
        $scope.activity_register = function (name) {

            //活动名传值
            Activity.activity_register(name);
            $location.path('/activity_register');
        };
        $scope.upload=function(){
            var currentlogUser=CurrentUser.getCurrentUser().userName;
            var post_user_activity_message=Activity.post_user_activity_message();
            var post_bid_list_infos=BidList.post_bid_message();
            var post_bm_infos=BmMessage.post_bm_message();
            var post_bid_details= BidList.post_bid_detail();
            var post_bid_success=BidList.post_bid_success();
            var post_bid_price_group=BidList.post_bid_price_group();
            $http.post('/upload.json',{
                "currentlogUser":currentlogUser,
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


        }

    });