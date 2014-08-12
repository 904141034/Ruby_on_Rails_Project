#encoding:utf-8
class UsersController < ApplicationController
  protect_from_forgery with: :null_session, if: Proc.new { |c| c.request.format == 'application/json' }
  def welcome
  end

  def signup
    @user=User.new
  end

  def login
    create_admin
  end

  def create_login_session
    flash[:error].display
    user=User.find_by_name(params[:name])
    if user && user.authenticate(params[:password])
      cookies.permanent[:token]=user.token
      if user.role=='Ordinary_user'
        redirect_to :welcome
      else
        if user.role=='admin'
          redirect_to :manager_index
        end
      end
    else
      flash[:error]="用户名或密码错误"
      redirect_to :root
    end
  end


  def logout
    cookies.delete(:token)
    flash[:error].display
    redirect_to root_url
  end

  def create
    if current_user
      if current_user.role=='admin'
        @user=User.new(user_params)
        if @user.save
          redirect_to :add_user
        else
          render :add_user
        end
      end
    else
      @user=User.new(user_params)
      if @user.save
        cookies.permanent[:token]=@user.token
        redirect_to :welcome
      else
        render :signup
      end
    end
  end

  def create_admin
    if User.any?
    else
      @user=User.new(:name => 'admin', :password => 'admin', :password_confirmation => 'admin', :forget_password_question => 'admin', :forget_password_answer => 'admin', :role => 'admin')
      if @user.save
        cookies.permanent[:token]=@user.token
      end
    end
  end

  def manager_index
    session[:result]=''
    if current_user
      puts(current_user.name)
      user=User.where(:role => 'Ordinary_user')
      @user=user.paginate(page: params[:page], per_page: 10)
    else
      redirect_to :root
    end
  end

  def add_user
    @user=User.new
  end

  def delete_user
    User.find_by_name(params[:name]).delete
    redirect_to :manager_index
  end

  def change_password_action
    user=User.find_by_name(session[:name])
    if params[:password]==params[:password_confirmation]
      user.password=params[:password]
      user.password_confirmation=params[:password_confirmation]
      user.save
      @result='success'
      session[:result]= @result
      redirect_to :change_password
    else
      flash[:error]="两次密码输入不一致，请重新输入！"
      render :change_password
    end
  end

  def change_password
    if session[:name]==''
      session[:name]=params[:name]
    end
  end

  def forget_one

  end

  def next_one
    user=User.find_by_name(params[:name])
    if user
      session[:name]=user.name
      session[:forget_password_question]=user.forget_password_question
      session[:forget_password_answer]=user.forget_password_answer
      redirect_to :forget_two
    else
      if params[:name]==""
        flash[:error]="帐号不能为空"
        render :forget_one
      else
        flash[:error]="该帐号不存在"
        render :forget_one
      end
    end
  end

  def forget_two

  end

  def next_two
    if session[:forget_password_answer]==params[:answer]
      redirect_to :forget_three
    else
      flash[:error]="忘记密码答案错误"
      redirect_to :forget_two
    end
  end

  def forget_three

  end

  def next_three
    if params[:password]==params[:password_confirmation]&&params[:password]!=""
      user=User.find_by_name(session[:name])
      user.password=params[:password]
      user.password_confirmation=params[:password_confirmation]
      if user.save
        cookies.permanent[:token]=user.token
        redirect_to :welcome
      end
    else
      if params[:password]==""||params[:password_confirmation]==""
        flash[:error]="密码或确认密码不能为空"
        render :forget_three
      else
        if params[:password]!=params[:password_confirmation]
          flash[:error]="两次密码输入不一致，请重新输入"
          render :forget_three
        end
      end
    end
  end

  def get_http_user_log
    user=User.find_by_name(params[:name])
    respond_to do |format|
      if user && user.authenticate(params[:password])
        format.json { render json: {data: 'true'} }
      else
        format.json { render json: {data: 'false'} }
      end
    end
  end

  private
  def user_params
    params[:user][:role]='Ordinary_user'
    params.require(:user).permit(:name, :password, :password_confirmation, :forget_password_question, :forget_password_answer, :role)
  end
end

