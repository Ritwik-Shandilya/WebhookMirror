class CreateEndpoints < ActiveRecord::Migration[8.0]
  def change
    create_table :endpoints do |t|
      t.string :uuid

      t.timestamps
    end
  end
end
