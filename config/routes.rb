Rails.application.routes.draw do

  root to: 'application#index'

  resources :notes, except: [:new, :edit]
  
end
