class CreateBidSuccessDetails < ActiveRecord::Migration
  def change
    create_table :bid_success_details do |t|
      t.string :username
      t.string :activity_name
      t.string :bid_name
      t.string :person_name
      t.string :success_price
      t.string :phone_number

      t.timestamps
    end
  end
end
