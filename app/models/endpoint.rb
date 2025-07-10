class Endpoint < ApplicationRecord
  has_many :requests

  before_destroy :ensure_no_requests

  def can_delete
    requests.none?
  end

  def delete_reason
    can_delete ? nil : "Cannot delete endpoint with existing requests"
  end

  private

  def ensure_no_requests
    if requests.exists?
      errors.add(:base, "Cannot delete endpoint with existing requests")
      throw(:abort)
    end
  end
end
