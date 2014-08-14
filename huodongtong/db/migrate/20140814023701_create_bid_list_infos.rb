class CreateBidListInfos < ActiveRecord::Migration
  def change
    create_table :bid_list_infos do |t|
      t.string :username
      t.string :activity_name
      t.string :bm_no
      t.string :bid_name
      t.string :bid_message_no

      t.timestamps
    end
  end
end
