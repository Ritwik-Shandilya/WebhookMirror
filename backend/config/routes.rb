Rails.application.routes.draw do
  namespace :api do
    get "endpoints/by_uuid/:uuid", to: "endpoints#show_by_uuid"
    resources :endpoints, only: [ :create ] do
      resources :requests, only: [ :index, :create ]
    end
    resources :requests, only: [ :show ]
  end

  match "/:uuid", to: "capture#receive", via: :all

  get "up" => "rails/health#show", as: :rails_health_check

  # root "posts#index"
end
