class CaptureController < ActionController::API
  def receive
    endpoint =
      if params[:custom_subdomain].present? || request.subdomain.present?
        Endpoint.find_by!(custom_subdomain: params[:custom_subdomain] || request.subdomain)
      elsif params[:uuid].present?
        Endpoint.find_by!(uuid: params[:uuid])
      else
        head :not_found and return
      end
    headers = request.headers.to_h.select { |k, _| k.start_with?("HTTP_") }
    req = endpoint.requests.create!(
      method: request.method,
      headers: headers.to_json,
      body: request.raw_post
    )

    if request.get? && request.headers["Accept"].to_s.include?("text/html")
      redirect_to "#{request.base_url}/endpoint/#{endpoint.uuid}" and return
    end

    render json: { id: req.id }
  end
end
