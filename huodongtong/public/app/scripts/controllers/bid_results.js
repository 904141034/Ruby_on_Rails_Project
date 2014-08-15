'use strict'
/**
 * Created by lishaodan on 14-7-24.
 */
angular.module('yoDemoApp')

    .controller('bid_resultsCtrl', function ($scope, $location, $timeout) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.showsuccess = "false";
        $('#bid_resultsModal').modal("show");
        $timeout(function () {
            $('#bid_resultsModal').modal('hide');
            $scope.showsuccess = "true";
        }, 3000);
        BidList.successResult($scope);

        $scope.return = function () {
            $location.path('/bid_list');
        };
        $scope.bid_name = InnerAct.getInnerAct().bid_name;
        $scope.bidMessageNO = BidList.getSortByPrice().length;
        $scope.bidMessages = BidList.getSortByPrice();
        BidList.get_bid_detail();
        BidList.get_bid_success();
        BidList.get_bid_price_group();
    });