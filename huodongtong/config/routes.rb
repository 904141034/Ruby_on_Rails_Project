Rails.application.routes.draw do
  resources :users
  root to:'users#login'
  match '/signup', to: 'users#signup', via: 'get'
  match '/welcome', to: 'users#welcome', via: 'get'
  post '/create_login_session',to:'users#create_login_session'
  delete'logout',to:'users#logout',:as =>'logout'
  get 'manager_index',to:'users#manager_index',:as => 'manager_index'
  match '/add_user',to:'users#add_user',via:'get'
  delete '/delete_user',to:'users#delete_user',:as =>'delete_user'
  get '/change_password',to:'users#change_password',:as=>'change_password'
  post '/change_password_action',to:'users#change_password_action'
  get '/forget_one',to:'users#forget_one', :as => 'forget_one'
  post '/next_one',to:'users#next_one'
  get '/forget_two',to:'users#forget_two', :as => 'forget_two'
  post '/next_two',to:'users#next_two'
  get '/forget_three',to:'users#forget_three', :as => 'forget_three'
  post '/next_three',to:'users#next_three'
  post '/get_http_user_log',to:'users#get_http_user_log'
  post'/upload',to:'users#upload'
  get '/user_index',to:'users#user_index',:as=>'user_index'
  get'/bid_list',to:'users#bid_list',:as=>'bid_list'
  get '/baoming',to:'users#baoming',:as=>'baoming'
  get '/bid_details',to:'users#bid_details',:as=>'bid_details'
  get '/price_count',to:'users#price_count',:ad=>'price_count'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
