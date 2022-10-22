# Team Members #
Brandon Tu  
Affan Khan  
Himmat Mahal  
Chris Fitzgerald  
Mussab Bin Imran  
Ibrahim Rather  

# Installation #
run the installation script with $ ./install.sh  
run the uninstallation script with $ ./uninstall.sh

# How to Develop #
This app works with an end user talking to the url, Nginx lives on the Socs VM where it redirects traffic to Flask. Below is brief diagram of how things work.
![Screen_Shot_2022-10-22_at_6.30.03_PM](/uploads/3d7080ce709d0ad64021f396037d4bf0/Screen_Shot_2022-10-22_at_6.30.03_PM.png)

 - When developing locally, the main functionality of the app relies on Flask which runs via python. These instructions work best on a *nix system (e.g. WSL for windows, macOS).
 1. Make sure Python is installed
 2. If using virtualenv, install it via `pip3 install virtualenv`. Create a virtulenv and activate it via `virtualenv env`. Then activate it via `source env/bin/activate`
 3. Install Flask via `pip3 install flask`.
 4. Make your code changes.
 5. Run `python3 app.py` to deploy the Flask app locally. (If you get a ModuleNotFound Error, make sure you installed flask into the right python version).
 6. Your app is now locally running on http://localhost:PORT, where PORT is specified in app.py. You can access it via cURL or your web browser.

# After Installation #
To start the server run the command 'sudo nginx'.  
If the server is already running you can reload it with 'sudo nginx -s reload'.  
Stop the server with 'sudo nginx -s quit'.  

# Files Included #
'/BeforeSprint-4' is a folder that contains work from previous sprints that is unrealated to work for sprint-4 or later.  
'/MeetingNotes' is a folder that contains notes from our startup sprint meetings.  
'deafult' is a configuration file that is copied to /etc/nginx/sites-available during the installation of nginx.  
'install.sh' will install nginx, copy over configuration files, and start the server.  
'uninstall.sh' will stop the server and uninstall nginx.  

# Our Site #
Our site can be accessed at: http://cis3760f22-04.socs.uoguelph.ca
