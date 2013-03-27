require 'rubygems'
require 'sinatra'

set :public_folder, 'public'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/noscript/index' do
  indexOrg = File.read(File.join(settings.public_folder, 'org/index.org'))
  indexOrg.gsub!(%r{\[\[(?:\./org/)?(.*?)\.org\]\[(.*?)\]\]}, '<a target="_parent" href="/article/\1?raw">\2</a>')
end

get '/article/*' do |path|
  puts request.query_string
  if request.query_string == 'raw'
    File.read(File.join(settings.public_folder, 'org/' + path + '.org'))
  else
    redirect to('/#!/article/' + path), 303
  end
end

