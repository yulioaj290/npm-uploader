# NPM Uploader (Web App)

Web App for uploading NPM packages to npmjs.com.

## Requirements

----------------

* NodeJS 8.4.0 or higher.
* NPM 5.3.0 or higher.
* P7zip-full 16.02 or higher.
* Git

To prepare the environment for the script follow this steps (based on Ubuntu 14.04):

0. (Optional) Update your linux repositories and upgrade all packages.

```bash
$ sudo apt-get update
$ sudo apt-get upgrade
```

1. Install p7zip-full, NodeJS and Git on your system.

```bash
$ sudo apt-get install p7zip-full nodejs git
```

2. Clone this repository, give permissions, and move inside it on the terminal.

```bash
$ git clone https://github.com/yulioaj290/npm-uploader.git
$ sudo chmod -R 777 npm-uploader
$ cd npm-uploader
```

3. Install NPM dependencies.

```bash
$ npm install
```

4. Execute the following command to run the app on the port 3000 and the integrated NodeJS server in the port 4000.

```bash
$ npm run execute
```
  
## Access to the app

Open in browser `http://localhost:3000` or `http://127.0.0.1:3000`, or feel free to configure with your custom domain preferences.