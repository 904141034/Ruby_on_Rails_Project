class AddCurrentBid < ActiveRecord::Migration
  def change
    add_column :current_user_activities,:current_bid,:string
  end
end
