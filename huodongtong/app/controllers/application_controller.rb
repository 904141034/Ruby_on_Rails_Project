class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def current_user
    @current_user ||=User.find_by_token(cookies[:token]) if cookies[:token]
  end

  def current_admin
    @current_admin ||=User.find_by_token(cookies[:token_admin]) if cookies[:token_admin]
  end

  def current_activity
    @current_activity ||=BidListInfos.find_by_activity_name(cookies[:current_activity]) if cookies[:current_activity]
    puts('22222222222222222222222222222222222222')
    puts(cookies[:current_activity])
  end

  helper_method :current_user
  helper_method :current_admin

end
