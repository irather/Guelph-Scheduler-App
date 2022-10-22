sudo update
sudo apt install nginx -y

echo 
echo Installed nginx
echo

sudo rm ../../../etc/nginx/sites-available/default
sudo cp ./default ./../../../etc/nginx/sites-available/
sudo nginx -s reload

echo
echo server runnning
echo