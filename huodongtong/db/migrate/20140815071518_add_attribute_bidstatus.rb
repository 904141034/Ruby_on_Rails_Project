class AddAttributeBidstatus < ActiveRecord::Migration
  def change
    add_column :bid_details,:status,:string
  end
end
