sudo nginx -s quit

sudo pip uninstall gunicorn -y

echo
echo uninstalled gunicorn
echo

cd scheduler-app/node_modules
sudo npm uninstall *
cd ../
cd ../
sudo apt-get remove nodejs -y
sudo apt-get purge nodejs -y

echo 
echo uninstalled npm
echo

sudo apt-get remove python3-pip -y
sudo pip uninstall flask -y
sudo pip uninstall python-dotenv -y

echo
echo Uninstalled flask & python-dotenv
echo

sudo apt-get purge nginx nginx-common -y
echo
echo Uninstalled nginx
