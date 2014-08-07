class UsersController < ApplicationController
  def welcome
  end

  def signup
    @user=User.new
  end

  def login
  end
end
