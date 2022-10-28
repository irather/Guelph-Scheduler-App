sudo apt update
sudo apt install nginx -y

echo 
echo Installed nginx
echo

sudo apt install python3-pip -y
sudo pip install flask
sudo pip install python-dotenv

echo
echo Installed flask & python-dotenv
echo

sudo apt install npm -y
cd scheduler-app 
sudo npm install react
sudo npm install react-scripts
sudo npm install react-dom
sudo npm install bootstrap
cd ../

echo
echo Installed npm
echo

pip install gunicorn

echo
echo installed gunicorn
echo

sudo rm ../../../etc/nginx/sites-available/default
sudo cp ./default ./../../../etc/nginx/sites-available/
sudo nginx -s reload

echo
echo server runnning