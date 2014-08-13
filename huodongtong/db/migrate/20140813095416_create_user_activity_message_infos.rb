class CreateUserActivityMessageInfos < ActiveRecord::Migration
  def change
    create_table :user_activity_message_infos do |t|
      t.string :username
      t.string :activity_name
      t.string :bm_no
      t.string :bid_no

      t.timestamps
    end
  end
end
