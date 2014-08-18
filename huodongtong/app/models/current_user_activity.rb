class CurrentUserActivity < ActiveRecord::Base
  def self.store_current_activity(user,activity_name)
    CurrentUserActivity.delete_all(:username => user)
    @current_user_activity=CurrentUserActivity.new("username"=>user,"activity_name"=>activity_name)
    @current_user_activity.save
    return "true"
  end
end
