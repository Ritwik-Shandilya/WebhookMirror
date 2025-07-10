class CreateRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :requests do |t|
      t.references :endpoint, null: false, foreign_key: true
      t.string :method
      t.text :headers
      t.text :body

      t.timestamps
    end
  end
end
