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

  helper_method :current_user
  helper_method :current_admin

end
