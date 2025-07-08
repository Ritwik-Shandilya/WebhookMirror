class CaptureController < ActionController::API
  def receive
    endpoint = Endpoint.find_by!(uuid: params[:uuid])
    req = endpoint.requests.create!(
      method: request.method,
      headers: request.headers.to_h.select { |k, _| k.start_with?("HTTP_") },
      body: request.raw_post
    )
    render json: { id: req.id }
  end
end
