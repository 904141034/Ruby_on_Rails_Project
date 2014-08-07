#encoding:utf-8
class UsersController < ApplicationController
  def welcome
  end

  def signup
    @user=User.new
  end

  def login
  end

  def create_login_session
    user=User.find_by_name(params[:name])
    if user && user.authenticate(params[:password])
      cookies.permanent[:token]=user.token
      redirect_to :welcome,:notice=>"登录成功"
    else
      flash[:error]="无效的用户名和密码"
      redirect_to :root_path
    end
  end

  def create
    @user=User.new(user_params)
    if @user.save
      redirect_to :welcome, :notice => "注册成功"
    else
      render :signup
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :password, :password_confirmation, :forget_password_question, :forget_password_answer)
  end
end
