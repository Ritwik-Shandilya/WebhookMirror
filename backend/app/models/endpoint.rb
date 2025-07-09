class Endpoint < ApplicationRecord
  has_many :requests

  before_destroy :ensure_no_requests

  private

  def ensure_no_requests
    if requests.exists?
      errors.add(:base, "Cannot delete endpoint with existing requests")
      throw(:abort)
    end
  end
end
