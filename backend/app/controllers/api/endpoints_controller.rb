class Api::EndpointsController < ApplicationController
  def create
    endpoint = Endpoint.create!(uuid: SecureRandom.uuid)
    render json: { id: endpoint.id, uuid: endpoint.uuid }
  end

  def show_by_uuid
    endpoint = Endpoint.find_by!(uuid: params[:uuid])
    render json: { id: endpoint.id, uuid: endpoint.uuid }
  end
end
