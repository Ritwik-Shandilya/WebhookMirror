class Api::RequestsController < ApplicationController
  before_action :set_endpoint, only: [ :index, :create, :destroy_all ]
  before_action :set_request, only: [ :show ]

  def index
    render json: @endpoint.requests.order(created_at: :desc)
  end

  def show
    render json: @request
  end

  def create
    req = @endpoint.requests.create!(method: params[:method], headers: params[:headers].to_json, body: params[:body])
    render json: req, status: :created
  end

  def destroy_all
    @endpoint.requests.delete_all
    head :no_content
  end

  private

  def set_endpoint
    @endpoint = Endpoint.find(params[:endpoint_id])
  end

  def set_request
    @request = Request.find(params[:id])
  end
end
