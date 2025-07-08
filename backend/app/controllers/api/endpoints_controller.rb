class Api::EndpointsController < ApplicationController
  def create
    render json: { id: SecureRandom.uuid }
  end
end
