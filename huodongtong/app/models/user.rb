class User < ActiveRecord::Base
  before_create{ generate_token(:token)}
  validates :name, :presence=> true,uniqueness: {:case_sensitive => false}
  validates :password,:presence => true, :on => :create
  has_secure_password
  validates :forget_password_question,presence: true
  validates :forget_password_answer,presence: true
  def generate_token(column)
    begin
      self[column]=SecureRandom.urlsafe_base64
    end while User.exists?(column=>self[column])
  end

end
