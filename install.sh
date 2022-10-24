sudo update
sudo apt install nginx -y

echo 
echo Installed nginx

sudo apt install python3-pip
sudo pip install flask
sudo pip install python-dotenv

echo Installed flask & python-dotenv

sudo apt install npm -y
cd scheduler-app 
sudo npm install
cd ../

echo Installed npm

sudo rm ../../../etc/nginx/sites-available/default
sudo cp ./default ./../../../etc/nginx/sites-available/
sudo nginx -s reload

echo
echo server runnning