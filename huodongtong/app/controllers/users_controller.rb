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
    if current_admin
      redirect_to :manager_index
    else
      if current_user
        redirect_to :user_index
      end
    end
  end

  def create_login_session
    user=User.find_by_name(params[:name])
    if user && user.authenticate(params[:password])
      if user.role=='Ordinary_user'
        cookies.permanent[:token]=user.token
        redirect_to :user_index
      else
        if user.role=='admin'
          cookies.permanent[:token_admin]=user.token
          redirect_to :manager_index
        end
      end
    else
      flash[:error]="用户不存在或密码错误"
      redirect_to :root
    end
  end

  def logout
    if current_admin
      if current_user
        cookies.delete(:token_admin)
        cookies.delete(:token)
      else
        cookies.delete(:token_admin)
      end
    end
    if current_user && !current_admin
      cookies.delete(:token)
    end
    flash[:error].display
    redirect_to root_url
  end

  def create
    if current_admin
      @user=User.new(user_params)
      if @user.save
        redirect_to :add_user
      else
        render :add_user
      end
    else
      @user=User.new(user_params)
      if @user.save
        cookies.permanent[:token]=@user.token
        redirect_to :user_index
      else
        render :signup
      end
    end
  end

  def create_admin
    if User.any?
    else
      @user=User.new(:name => 'admin', :password => 'admin', :password_confirmation => 'admin', :forget_password_question => 'admin', :forget_password_answer => 'admin', :role => 'admin')
      @user.save
    end
  end

  def manager_index
    session[:result]=''
    if current_admin
      user=User.where(:role => 'Ordinary_user')
      @user=user.paginate(page: params[:page], per_page: 10)
      if params[:page].to_i==0
        @page_index=1
      else
        @page_index=params[:page].to_i
      end
    else
      redirect_to :root
    end
  end

  def add_user
    if current_admin
      @user=User.new
    else
      redirect_to :root
    end
  end

  def delete_user
    if current_admin
      User.find_by_name(params[:name]).delete
      redirect_to :manager_index
    else
      redirect_to :root
    end
  end

  def change_password_action
    session[:result]=""
    user=User.find_by_name(session[:name])
    if params[:password]==params[:password_confirmation] && params[:password]!=""
      user.password=params[:password]
      user.password_confirmation=params[:password_confirmation]
      user.save
      @result='success'
      session[:result]= @result
      flash[:error].display
      redirect_to :change_password
    else
      if params[:password]==""|| params[:password_confirmation]==""
        flash[:error]="密码或确认密码不能为空！"
        render :change_password
      else
        flash[:error]="两次密码输入不一致，请重新输入！"
        render :change_password
      end
    end

  end

  def change_password
    if current_admin
      session[:name]=params[:name]
    else
      redirect_to :root
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
        redirect_to :forget_one
      else
        flash[:error]="该帐号不存在"
        redirect_to :forget_one
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
        if user.role=='admin'
          cookies.permanent[:token_admin]=user.token
          redirect_to :manager_index
        else
          if user.role=='Ordinary_user'
            cookies.permanent[:token]=user.token
            redirect_to :user_index
          end
        end
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

  def upload
    @currentlogUser=params[:currentlogUser]
    @current_activity=params[:current_activity]
    @current_bid=params[:current_bid]
    @post_user_activity_message=params[:post_user_activity_message]
    @post_bid_list_infos=params[:post_bid_list_infos]
    @post_bm_infos=params[:post_bm_infos]
    @post_bid_details=params[:post_bid_details]
    @post_bid_success=params[:post_bid_success]
    @post_bid_price_group=params[:post_bid_price_group]
    result1=UserActivityMessageInfo.show_user_info(@currentlogUser, @post_user_activity_message)
    result2=BidListInfos.show_bid_list_info(@currentlogUser, @post_bid_list_infos, @current_activity)
    result3=BmInfo.show_bm_infos(@currentlogUser, @post_bm_infos)
    result4=BidDetail.show_bid_details(@currentlogUser, @post_bid_details)
    result5=BidSuccessDetail.show_bid_success_details(@currentlogUser, @post_bid_success)
    result6=BidPriceGroupDetail.show_bid_price_group_details(@currentlogUser, @post_bid_price_group)
    result7=CurrentUserActivity.store_current_activity(@currentlogUser, @current_activity, @current_bid)
    respond_to do |format|
      if result1=='true'&& result2=='true'&& result3=='true'&&result4=='true'&& result5=="true" && result6=='true' &&result7=='true'
        format.json { render json: {data: 'true'} }
      else
        format.json { render json: {data: 'false'} }
      end
    end
  end

  def user_index
    if current_admin && !current_user
      @user=User.find_by_name(params[:username])
      cookies.permanent[:token]=@user.token
    end
    if current_user
      user_activity_message_info=UserActivityMessageInfo.where(username: current_user.name)
      @user_activity_message_info=user_activity_message_info.paginate(page: params[:page], per_page: 10)
      if params[:page].to_i==0
        @page_index=1
      else
        @page_index=params[:page].to_i
      end
      @current_activity_user=CurrentUserActivity.find_by_username(current_user.name)
      @current_activity_name=@current_activity_user.activity_name
      @bid_details=BidDetail.where(username: current_user.name, activity_name: @current_activity_name, status: 'true')
      if @bid_details==[]
        @start="false"
      else
        @start="true"
      end
    else
      redirect_to :root
    end
  end

  def bid_list
    if current_user
      session[:activity_name]=params[:activity_name]
      bid_list_infos=BidListInfos.where(username: current_user.name, activity_name: session[:activity_name])
      @bid_list_infos=bid_list_infos.paginate(page: params[:page], per_page: 10)
      if params[:page].to_i==0
        @page_index=1
      else
        @page_index=params[:page].to_i
      end
    end
  end

  def baoming
    if current_user
      session[:activity_name]=params[:activity_name]
      bm_infos=BmInfo.where(username: current_user.name, activity_name: params[:activity_name])
      @bm_infos=bm_infos.paginate(page: params[:page], per_page: 10)
      if params[:page].to_i==0
        @page_index=1
      else
        @page_index=params[:page].to_i
      end
    end
  end

  def bid_details
    session[:bid_name]=params[:bid_name]
    @activity_name=params[:activity_name]
    @bid_name=params[:bid_name]
    @bid_detailss=BidDetail.where(username: current_user.name, activity_name: @activity_name, bid_name: @bid_name)
    @bid_details=@bid_detailss.paginate(page: params[:page], per_page: 10)
    @bid_details.each do |bid_detail|
      @bid_status=bid_detail.status
      @bid_person_name=bid_detail.person_name
    end
    if params[:page].to_i==0
      @page_index=1
    else
      @page_index=params[:page].to_i
    end
    @bid_success_details=BidSuccessDetail.where(username: current_user.name, activity_name: @activity_name, bid_name: @bid_name)
    @bid_success_details.each do |bid_success_detail|
      @bid_success_detail=bid_success_detail
      @person_name=@bid_success_detail.person_name
      @success_price=@bid_success_detail.success_price
      @phone_number=@bid_success_detail.phone_number
      if @person_name==""
        @success="false"
      else
        @success="true"
      end
    end
  end

  def price_count
    @person_name=params[:person_name]
    @success_price=params[:success_price]
    @phone_number=params[:phone_number]
    @activity_name=params[:activity_name]
    @bid_name=params[:bid_name]
    price_group_details=BidPriceGroupDetail.where(username: current_user.name, activity_name: @activity_name, bid_name: @bid_name)
    @price_group_detailss=price_group_details.paginate(page: params[:page], per_page: 10)
    if @person_name==""||@person_name==nil
      @success="false"
    else
      @success="true"
    end
    @bid_details=BidDetail.where(username: current_user.name, activity_name: @activity_name, bid_name: @bid_name)
    @bid_status=@bid_details.first.status
  end

  def tongbu_show
    @current_activity_user=CurrentUserActivity.find_by_username(current_user.name)
    @current_activity_name=@current_activity_user.activity_name
    @bid_details=BidDetail.where(username: current_user.name, activity_name: @current_activity_name, status: 'true')
    if  @bid_details!=[]
      @tongbu="true"
      @bid_details.each do |bid_detail|
        @bid_name=bid_detail.bid_name
      end
      @bid_list=BidListInfos.where(username: current_user.name, activity_name: @current_activity_name, bid_name: @bid_name)
      @bid_list.each do |bid_list|
        @bm_no=bid_list.bm_no
        @bid_message_no=bid_list.bid_message_no
        @num_result=@bid_message_no+'/'+@bm_no
      end
      @bid_price_group=BidPriceGroupDetail.where(username: current_user.name, activity_name: @current_activity_name, bid_name: @bid_name, count: 1)
      @bid=[]
      @bid_price_group.each do |bid_price_group|
        @bid.push(BidDetail.find_by_bid_price(bid_price_group.price))
      end
      else
        redirect_to :show_over, session[:activity_name] => @current_activity_name
      end
  end

  def show_over
    @current_activity_name=session[:activity_name]
    @ccurrent_user=CurrentUserActivity.where(username: current_user.name, activity_name: @current_activity_name)
    @ccurrent_user.each do |current_user|
      @bidname=current_user.current_bid
    end
    @bid_name="第"+@bidname[2]+"次竞价"
    @bid_success=BidSuccessDetail.where(username: current_user.name, activity_name: @current_activity_name, bid_name: @bid_name)
    @person_name=@bid_success[0].person_name
    @success_price=@bid_success[0].success_price
    @phone_number=@bid_success[0].phone_number
  end

  private
  def user_params
    params[:user][:role]='Ordinary_user'
    params.require(:user).permit(:name, :password, :password_confirmation, :forget_password_question, :forget_password_answer, :role)
  end

end

