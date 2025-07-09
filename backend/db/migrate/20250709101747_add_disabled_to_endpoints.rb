class AddDisabledToEndpoints < ActiveRecord::Migration[8.0]
  def change
    add_column :endpoints, :disabled, :boolean, default: false
  end
end
