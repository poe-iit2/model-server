Model Frontend
==============

Web interface for model.

Local Dev
---------

```sh
npm install
npm start
```

Then navigate to http://localhost:3000

Installation on Pi
------------------

NGINX is used to host a static build of the frontend. On any machine:

```sh
npm run build
```

scp the `build/` directory and `install.sh` script to the Pi.

On the Pi, install with:

```sh
sudo apt install nginx
sudo ./install.sh
sudo systemctl daemon-reload
sudo systemctl enable nginx
sudo systemctl restart nginx
```
