class UserActivityMessageInfo < ActiveRecord::Base
  #attr_accessible :username, :activity_name, :bm_no, :bid_no
  def self.show_user_info(user,activity_infos)
    UserActivityMessageInfo.delete_all(:username => user)
    activity_infos.each do |activity_message|
      username=activity_message[:username]
      activity_name=activity_message[:activity_name]
      bm_no=activity_message[:bm_no]
      bid_no=activity_message[:bid_no]
      @user_activities_info= UserActivityMessageInfo.new("username"=>username,"activity_name"=>activity_name,"bm_no"=>bm_no,"bid_no"=>bid_no)
      @user_activities_info.save
    end
  end
end
