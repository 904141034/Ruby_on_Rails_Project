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
      redirect_to :welcome, :notice => "登录成功"
    else
      flash[:error]="用户名或密码错误"
      redirect_to :root
    end
  end

  def logout
    cookies.delete(:token)
    redirect_to root_url, :notice => "已经退出登录"
  end

  def create
    if User.any?
      # user={}
      p "dsgdsgsgksdjgjsdjgkdsjgkdsgkdkafjaf"
      p user_params
      @user=User.new(user_params)

      if @user.save
        cookies.permanent[:token]=@user.token
        redirect_to :welcome, :notice => "注册成功"
      else
        render :signup
      end
    else
      @user=User.new(name: "admin", password: "admin", password_confirmation: "admin", role: "admin")
      if @user.save
        cookies.permanent[:token]=@user.token
        redirect_to :manager_index
      end
    end
  end

  private
  def user_params
    params[:user][:role]='user'
    params.require(:user).permit(:name, :password, :password_confirmation, :forget_password_question, :forget_password_answer,:role)

  end
end
