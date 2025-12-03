Model Server
============

Performs routing, and holds prototype state.

Frontend code is in [frontend/](https://github.com/poe-iit2/model-server/tree/main/frontend)

Local Dev
---------

```sh
npm install
npm start
```

Then navigate to http://localhost:5000

Installation on Pi
------------------

[mkosi](https://github.com/systemd/mkosi) is used to create a system image
that bundles all the dependencies of the server into one package for easy
deployment. This image can also be used to test another machine using the
same exact dependencies as on the Pi. (qemu-user is useful if said machine
is x86_64 and not arm64).

```sh
mkosi
```

On the Pi `systemd-container` must be installed:

```sh
sudo apt install systemd-container
```

`mkosi.output/model-server.raw` can then be scp'd to the Pi and installed to
`/usr/local/lib/portables/`. The image can then be attached with:

```sh
portablectl attach -p trusted --enable --now model-server.raw
```
