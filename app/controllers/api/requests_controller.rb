class Api::RequestsController < ApplicationController
  before_action :set_endpoint, only: [ :index, :create, :destroy_all ]
  before_action :set_request, only: [ :show, :replay ]

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

  def replay
    begin
      # Parse headers from the original request or use edited ones
      headers = params[:headers] || JSON.parse(@request.headers)
      
      # Use edited body or original body
      body = params[:body] || @request.body
      
      # Use custom URL or original endpoint URL
      target_url = params[:target_url] || "#{request.base_url}/#{@request.endpoint.uuid}"
      
      # Make the HTTP request
      response = make_http_request(
        method: @request.method,
        url: target_url,
        headers: headers,
        body: body
      )
      
      render json: {
        success: true,
        status: response.code,
        response_body: response.body,
        response_headers: response.headers.to_h
      }
    rescue => e
      render json: {
        success: false,
        error: e.message
      }, status: :unprocessable_entity
    end
  end

  private

  def set_endpoint
    @endpoint = Endpoint.find(params[:endpoint_id])
  end

  def set_request
    @request = Request.find(params[:id])
  end

  def make_http_request(method:, url:, headers:, body:)
    uri = URI(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == 'https'
    
    request_class = case method.upcase
                   when 'GET' then Net::HTTP::Get
                   when 'POST' then Net::HTTP::Post
                   when 'PUT' then Net::HTTP::Put
                   when 'PATCH' then Net::HTTP::Patch
                   when 'DELETE' then Net::HTTP::Delete
                   else Net::HTTP::Post
                   end
    
    request = request_class.new(uri)
    
    # Set headers
    headers.each do |key, value|
      request[key] = value
    end
    
    # Set body for non-GET requests
    if method.upcase != 'GET' && body.present?
      request.body = body
    end
    
    http.request(request)
  end
end
