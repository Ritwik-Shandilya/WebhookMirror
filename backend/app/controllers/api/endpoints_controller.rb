class Api::EndpointsController < ApplicationController
  def index
    endpoints = Endpoint.order(created_at: :desc)
    render json: endpoints
  end

  def create
    endpoint = Endpoint.create!(uuid: SecureRandom.uuid)
    render json: { id: endpoint.id, uuid: endpoint.uuid }
  end

  def show_by_uuid
    endpoint = Endpoint.find_by!(uuid: params[:uuid])
    render json: { id: endpoint.id, uuid: endpoint.uuid }
  end

  def update
    endpoint = Endpoint.find(params[:id])
    endpoint.update!(disabled: params[:disabled])
    render json: endpoint
  end

  def destroy
    endpoint = Endpoint.find(params[:id])
    if endpoint.destroy
      head :no_content
    else
      render json: { error: endpoint.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end
end
