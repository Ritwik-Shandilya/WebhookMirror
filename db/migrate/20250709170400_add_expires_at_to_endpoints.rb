class AddExpiresAtToEndpoints < ActiveRecord::Migration[8.0]
  def change
    add_column :endpoints, :expires_at, :datetime
  end
end
