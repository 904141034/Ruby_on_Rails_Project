class CreateBmInfos < ActiveRecord::Migration
  def change
    create_table :bm_infos do |t|
      t.string :username
      t.string :activity_name
      t.string :person_name
      t.string :phone_number

      t.timestamps
    end
  end
end
