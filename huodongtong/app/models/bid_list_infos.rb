class BidListInfos < ActiveRecord::Base
  def self.show_bid_list_info(user,bid_list_infos)
    BidListInfos.delete_all(:username => user)
    bid_list_infos.each do |bid_list_info|

      @username=bid_list_info[:username]
      @activity_name=bid_list_info[:activity_name]
      @bm_no=bid_list_info[:bm_no]
      @bid_name=bid_list_info[:bid_name]
      @bid_message_no=bid_list_info[:bid_message_no]
      @bid_list_info=BidListInfos.new("username"=>@username,"activity_name"=>@activity_name,"bm_no"=>@bm_no,"bid_name"=>@bid_name,"bid_message_no"=>@bid_message_no)
      @bid_list_info.save
    end
    return "true"
  end
end
