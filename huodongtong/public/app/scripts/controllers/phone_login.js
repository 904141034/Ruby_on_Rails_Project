/**
 * Created by lishaodan on 14-8-12.
 */
angular.module('yoDemoApp')

    .controller('phone_loginCtrl', function ($scope,$location, $http) {
        $scope.login=function(){
            $scope.display = false;
            var name=$scope.user_name;
            var password=$scope.user_password;
            $http.post('http://192.168.1.137/get_http_user_log.json',{
                "name":name,
                "password":password
            }).success(function(back){
                if(back.data=="true"){
                    var currentlogUser=new CurrentUser($scope.user_name);
                    CurrentUser.setCurrentUser(currentlogUser);
                    Activity.store_current_user_activities();
                    $location.path('activity_list');
                }else{
                    $scope.display = true
                }
            });

        }
    });