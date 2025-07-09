Rails.application.routes.draw do
  namespace :api do
    get "endpoints/by_uuid/:uuid", to: "endpoints#show_by_uuid"
    resources :endpoints, only: [ :create, :index, :update, :destroy ] do
      resources :requests, only: [ :index, :create ] do
        delete "/", to: "requests#destroy_all", on: :collection
      end
    end
    resources :requests, only: [ :show ] do
      post :replay, on: :member
    end
  end

  match "/:uuid", to: "capture#receive", via: :all, constraints: { uuid: /[0-9a-fA-F\-]{36}/ }

  get "up" => "rails/health#show", as: :rails_health_check

  root "static#index"
  get "*path", to: "static#index"
end
