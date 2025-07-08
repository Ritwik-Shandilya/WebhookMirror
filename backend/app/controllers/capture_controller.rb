class CaptureController < ActionController::API
  def receive
    endpoint = Endpoint.find_by!(uuid: params[:uuid])
    req = endpoint.requests.create!(
      method: request.method,
      headers: request.headers.to_h.select { |k, _| k.start_with?("HTTP_") },
      body: request.raw_post
    )

    if request.get? && request.headers["Accept"].to_s.include?("text/html")
      redirect_to "#{request.base_url}/endpoint/#{endpoint.uuid}" and return
    end

    render json: { id: req.id }
  end
end
