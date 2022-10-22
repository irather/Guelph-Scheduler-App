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

# After Installation #
To start the server run the command 'sudo nginx'. 
If the server is already running you can reload it with 'sudo nginx -s reload'. 
Stop the server with 'sudo nginx -s quit'

# Files Included #
'/BeforeSprint-4' is a folder that contains work from previous sprints that is unrealated to
work for sprint-4 or later.
'/MeetingNotes' is a folder that contains notes from our startup sprint meetings
'deafult' is a configuration file that is copied to /etc/nginx/sites-available during
the installation of nginx.
'install.sh' will install nginx, copy over configuration files, and start the server
'uninstall.sh' will stop the server and uninstall nginx

# Our Site #
Our site can be accessed at: http://cis3760f22-04.socs.uoguelph.ca