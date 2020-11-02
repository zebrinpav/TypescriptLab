#!/bin/sh

echo 'deb http://archive.ubuntu.com/ubuntu/ bionic main restricted universe multiverse' >> /etc/apt/sources.list
echo 'deb http://archive.ubuntu.com/ubuntu/ bionic-updates main restricted universe multiverse' >> /etc/apt/sources.list
echo 'deb http://archive.ubuntu.com/ubuntu/ bionic-security main restricted universe multiverse' >> /etc/apt/sources.list
apt-get update
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt install nodejs
apt install node-typescript
