sudo docker stop AWSIOT2
sudo docker rm AWSIOT2
sudo docker run -ti --name AWSIOT2 -p 80:80 -v /vagrant/apps/aws-iot-stateful-button:/myapp awsiot2 /bin/bash