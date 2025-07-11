class AddCustomSubdomainToEndpoints < ActiveRecord::Migration[8.0]
  def change
    add_column :endpoints, :custom_subdomain, :string
    add_index :endpoints, :custom_subdomain, unique: true
  end
end
