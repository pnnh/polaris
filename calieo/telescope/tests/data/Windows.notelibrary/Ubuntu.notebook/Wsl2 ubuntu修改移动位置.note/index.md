wsl --export Ubuntu-20.04 f:\wsl2\ubuntu20.04.tar

wsl --unregister Ubuntu-20.04

wsl --import Ubuntu-20.04 f:\wsl2\ubuntu20.04 f:\wsl2\ubuntu20.04.tar --version 2

ubuntu2004 config --default-user larry

del f:\wsl2\ubuntu20.04.tar