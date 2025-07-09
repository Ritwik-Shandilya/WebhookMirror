Rails.application.routes.draw do
  namespace :api do
    get "endpoints/by_uuid/:uuid", to: "endpoints#show_by_uuid"
    resources :endpoints, only: [ :create, :index, :update, :destroy ] do
      resources :requests, only: [ :index, :create ] do
        delete '/', to: 'requests#destroy_all', on: :collection
      end
    end
    resources :requests, only: [ :show ]
  end

  match "/:uuid", to: "capture#receive", via: :all

  get "up" => "rails/health#show", as: :rails_health_check

  # root "posts#index"
end
