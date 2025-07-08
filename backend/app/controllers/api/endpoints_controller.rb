class Api::EndpointsController < ApplicationController
  def create
    endpoint = Endpoint.create!(uuid: SecureRandom.uuid)
    render json: { id: endpoint.id, uuid: endpoint.uuid }
  end
end
