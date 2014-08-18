class BmInfo < ActiveRecord::Base
  def self.show_bm_infos(user, bm_infos)
    BmInfo.delete_all(:username => user)
    if bm_infos!=nil
      bm_infos.each do |bm_info|
        username=bm_info[:username]
        activity_name=bm_info[:activity_name]
        person_name=bm_info[:person_name]
        phone_number=bm_info[:phone_number]
        @bm_info=BmInfo.new("username" => username, "activity_name" => activity_name, "person_name" => person_name, "phone_number" => phone_number)
        @bm_info.save
      end
    end
    return "true"
  end
end
