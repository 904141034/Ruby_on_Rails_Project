/**
 * Created by lishaodan on 14-8-12.
 */
function CurrentUser(user_name){
    this.userName = user_name;
}
CurrentUser.getCurrentUser=function(){
    return JSON.parse(localStorage.getItem("currentlogUser"))||{};
};
CurrentUser.setCurrentUser=function(currentlogUser){
    localStorage.setItem('currentlogUser',JSON.stringify(currentlogUser)) ;
};
CurrentUser.getCurrentUserName=function(){
    var current_user_name=CurrentUser.getCurrentUser().userName;
    return current_user_name;
};
