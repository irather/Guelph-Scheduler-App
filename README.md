# Team Members

Brandon Tu  
Affan Khan  
Himmat Mahal  
Chris Fitzgerald  
Mussab Bin Imran  
Ibrahim Rather

# Installation

run the installation script with $ ./install.sh  
 During the installation the config file 'default' is moved to:
'etc/nginx/sites-available/'.  
 node_modules are also created in 'scheduler-app/node_modules'
You do NOT need to move any files yourself because the installation script does it for you.  
 This script will also automatically start the nginx server with the basic webpage with no  
 need to reload nginx.

run the uninstallation script with $ ./uninstall.sh
This will quit nginx and uninstall it.

# After Installation

𝐻𝑜𝓌 𝓉𝑜 𝓇𝑒𝓈𝓉𝒶𝓇𝓉 𝓉𝒽𝑒 𝓈𝑒𝓇𝓋𝑒𝓇 𝒶𝒻𝓉𝑒𝓇 𝒸𝒽𝒶𝓃𝑔𝑒𝓈

𝒾𝒻 𝓎𝑜𝓊 𝓂𝒶𝒹𝑒 𝒸𝒽𝒶𝓃𝑔𝑒𝓈 𝓉𝑜 𝓉𝒽𝑒 𝒻𝓁𝒶𝓈𝓀 𝓅𝑜𝓇𝓉𝒾𝑜𝓃 (𝒾𝑒 𝒶𝓅𝓅.𝓅𝓎)
Save your changes
Type: “sudo systemctl daemon-reload” to end the daemon/process that running the flask program
Type “sudo systemctl start scheduler-app” to let a process run the flask portion

𝒾𝒻 𝓎𝑜𝓊 𝓂𝒶𝒹𝑒 𝒸𝒽𝒶𝓃𝑔𝑒𝓈 𝓉𝑜 𝓉𝒽𝑒 𝓇𝑒𝒶𝒸𝓉 𝓅𝑜𝓇𝓉𝒾𝑜𝓃 (𝒾𝑒 𝒶𝓅𝓅.𝒿𝓈)
Cd to home/socs/CIS3760-team-302/scheduler-app and run “npm run build”
afterwards Nginx should always be watching the react portion and you should already see the changes on the server but if not
Run “sudo nginx -s reload”

To start the server run the command 'sudo nginx'.  
If the server is already running you can reload it with 'sudo nginx -s reload'.  
Stop the server with 'sudo nginx -s quit'.

# Files Included

'/BeforeSprint-4' is a folder that contains work from previous sprints that is unrealated to work for sprint-4 or later.  
'/MeetingNotes' is a folder that contains notes from our startup sprint meetings.  
'/scheduler-app' holds the backend flask and js files.  
'/static' holds some dummy css and js files.  
'/templates' holds a copy of our basic webpage.
'default' is a configuration file that is copied to /etc/nginx/sites-available during the installation of nginx.  
'index.html' is the basic webpage displayed on our site.  
'install.sh' will install nginx, copy over configuration files, and start the server.  
'uninstall.sh' will stop the server and uninstall nginx.  
'copyDefault.sh' will copy the file 'default' from our repository directory to the correct directory on the VM.

# Our Site

Our site can be accessed at: http://cis3760f22-04.socs.uoguelph.ca

# Our Wiki

Our wiki can be found here: https://gitlab.socs.uoguelph.ca/cis3760-team-302/cis3760-team-302/-/wikis/Group-302-Webpage

# For Developers

This app works with an end user talking to the url, Nginx lives on the Socs VM where it redirects traffic to Flask. Below is brief diagram of how things work.
![Screen_Shot_2022-10-22_at_6.30.03_PM](/diagram.png)

- When developing locally, the main functionality of the app relies on Flask which runs via python. These instructions work best on a \*nix system (e.g. WSL for windows, macOS).

1.  Make sure Python is installed
2.  If using virtualenv, install it via `pip3 install virtualenv`. Create a virtulenv and activate it via `virtualenv env`. Then activate it via `source env/bin/activate`.
3.  Install Flask via `pip3 install flask`.
4.  Make your code changes.
5.  Run `python3 app.py` to deploy the Flask app locally. (If you get a ModuleNotFound Error, make sure you installed flask into the right python version).
6.  Your app is now locally running on http://localhost:PORT, where PORT is specified in app.py. You can access it via cURL or your web browser.
7.  If using virtualenv, you can exit it by simply entering `deactivate` into the terminal.

To get the server running

1.  Run the install script
2.  cd to scheduler_app and run $npm start
3.  In a new terminal cd to the flask folder inside scheduler_app
4.  Run the command $npm run start-flask

# For Developers: Unit Testing

run unit tests with 'npm test' in the 'scheduler-app' directory.

Currently tests can only be done on functions in 'functions.js', so any functions that 'App.js' uses that you want to create a test for must be
in 'functions.js'.
When writing functions in 'functions.js', make sure to to add it to the module.exports at the bottom so that the unit testing file can use the function.
Add the function to module.exports like so: 'module.exports.FUNCTION_NAME = FUNCTION_NAME;'.
Just follow what is already in 'functions.js' and you should be fine.

# Developer Debugging

On windows the install script may not work. In that case you may need to install things manually. You do not need nginx or gunicorn

if you encounter the error: "options.allowedHosts[0] should be a non-empty string," try downgrading 'react-scripts' to 4.0.3 and 'npm install'

on windows you may need to run flask with 'python -m flask run' in the flask directory
