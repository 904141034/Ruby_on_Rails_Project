class CreateBidPriceGroupDetails < ActiveRecord::Migration
  def change
    create_table :bid_price_group_details do |t|
      t.string :username
      t.string :activity_name
      t.string :bid_name
      t.string :price
      t.string :count

      t.timestamps
    end
  end
end
