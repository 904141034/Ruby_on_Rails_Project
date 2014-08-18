class AddCurrentBidStatus < ActiveRecord::Migration
  def change
    add_column :current_user_activities,:bid_status,:string
  end
end
