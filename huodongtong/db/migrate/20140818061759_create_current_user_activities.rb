class CreateCurrentUserActivities < ActiveRecord::Migration
  def change
    create_table :current_user_activities do |t|
      t.string :username
      t.string :activity_name

      t.timestamps
    end
  end
end
