/**
 * Created by lishaodan on 14-8-12.
 */
angular.module('yoDemoApp')

    .controller('phone_loginCtrl', function ($scope,$location, $http) {
        $scope.login=function(){
            $scope.display = false;
            var name=$scope.user_name;
            var password=$scope.user_password;
            $http.post('/get_http_user_log.json',{
                "name":name,
                "password":password
            }).success(function(back){
                if(back.data=="true"){
                    var currentlogUser=new CurrentUser($scope.user_name);
                    CurrentUser.setCurrentUser(currentlogUser);
                    $location.path('activity_list');
                }else{
                    $scope.display = true
                }
            });

        }
    });