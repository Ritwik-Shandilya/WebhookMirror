require 'net/http'

class Api::RequestsController < ApplicationController
  before_action :set_endpoint, only: [ :index, :create, :destroy_all ]
  before_action :set_request, only: [ :show, :replay ]

  def index
    render json: @endpoint.requests.order(created_at: :desc)
  end

  def show
    render json: @request
  end

  def replay
    target = params[:target_url]
    return render(json: { error: 'target_url required' }, status: :bad_request) if target.blank?

    headers = begin
      JSON.parse(@request.headers)
    rescue JSON::ParserError
      {}
    end

    uri = URI.parse(target)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == 'https'
    path = uri.path.empty? ? '/' : uri.path
    path += "?#{uri.query}" if uri.query

    req_class = Net::HTTP.const_get(@request.method.capitalize)
    http_req = req_class.new(path)
    headers.each { |k, v| http_req[k] = v unless k.to_s.downcase == 'host' }
    http_req.body = @request.body if @request.body.present?
    res = http.request(http_req)

    render json: { status: res.code.to_i, headers: res.to_hash, body: res.body }
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
