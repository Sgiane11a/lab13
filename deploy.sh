#!/bin/bash
# DEPLOY EN EC2
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git nginx
sudo npm install -g pm2

# Clonar tu repo
git clone https://github.com/tuusuario/lab13-node.git
cd lab13-node
npm install

# Configurar variables
cp .env.example .env
nano .env  # (editar datos RDS y Cloudinary)

# Ejecutar
pm2 start src/app.js --name contacts-app
pm2 save
sudo systemctl enable nginx
sudo systemctl restart nginx
