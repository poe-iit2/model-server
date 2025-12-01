mkdir -p /var/www
cp -r build /var/www/model-frontend
mkdir -p /etc/nginx/sites-available/
cp nginx.conf /etc/nginx/sites-available/model-frontend
ln -s /etc/nginx/sites-available/model-frontend /etc/nginx/sites-enabled/model-frontend
