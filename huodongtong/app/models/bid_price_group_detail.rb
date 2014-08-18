class BidPriceGroupDetail < ActiveRecord::Base
  def self.show_bid_price_group_details(user, price_group_details)
    BidPriceGroupDetail.delete_all(:username => user)
    if price_group_details!=nil
      price_group_details.each do |price_group_detail|
        @username=price_group_detail[:username]
        @activity_name=price_group_detail[:activity_name]
        @bid_name=price_group_detail[:bid_name]
        @price=price_group_detail[:price]
        @count=price_group_detail[:count]
        @bid_price_group_details=BidPriceGroupDetail.new("username" => @username, "activity_name" => @activity_name, "bid_name" => @bid_name, "price" => @price, "count" => @count)
        @bid_price_group_details.save
      end
    end
    return 'true'
  end
end
