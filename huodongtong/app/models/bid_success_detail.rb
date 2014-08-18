class BidSuccessDetail < ActiveRecord::Base
  def self.show_bid_success_details(user, bid_success_details)
    BidSuccessDetail.delete_all(:username => user)
    if bid_success_details!=nil
      bid_success_details.each do |bid_success_detail|
        @username=bid_success_detail[:username]
        @activity_name=bid_success_detail[:activity_name]
        @bid_name=bid_success_detail[:bid_name]
        @person_name=bid_success_detail[:person_name]
        @success_price=bid_success_detail[:success_price]
        @phone_number=bid_success_detail[:phone_number]
        @bid_success_details=BidSuccessDetail.new("username" => @username, "activity_name" => @activity_name, "bid_name" => @bid_name, "person_name" => @person_name, "success_price" => @success_price, "phone_number" => @phone_number)
        @bid_success_details.save
      end
    end
    return "true"
  end
end
