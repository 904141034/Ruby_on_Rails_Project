#encoding:utf-8
class UsersController < ApplicationController
  def welcome
  end

  def signup
    @user=User.new
  end

  def login
  end
  def create
    @user=User.new(user_params)
    if @user.save
      redirect_to :root,:notice=>"注册成功"
    else
      render :signup
    end
  end

  private
  def user_params
    params.require(:user).permit(:name,:password,:password_confirmation,:forget_password_question,:forget_password_answer)
  end
end
