class BidDetail < ActiveRecord::Base
  def self.show_bid_details(user, bid_details)
    BidDetail.delete_all(:username => user)
    if bid_details!=nil
      bid_details.each do |bid_detail|
        @username=bid_detail[:username]
        @activity_name=bid_detail[:activity_name]
        @bid_name=bid_detail[:bid_name]
        @person_name=bid_detail[:person_name]
        @bid_price=bid_detail[:bid_price]
        @phone_number=bid_detail[:phone_number]
        @status=bid_detail[:status]
        @bid_details=BidDetail.new("username" => @username, "activity_name" => @activity_name, "bid_name" => @bid_name, "person_name" => @person_name, "bid_price" => @bid_price, "phone_number" => @phone_number, "status" => @status)
        @bid_details.save
      end
    end
    return "true"
  end
end
