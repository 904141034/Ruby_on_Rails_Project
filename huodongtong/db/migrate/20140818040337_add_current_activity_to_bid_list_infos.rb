class AddCurrentActivityToBidListInfos < ActiveRecord::Migration
  def change
    add_column :bid_list_infos,:current_activity,:string
  end
end
