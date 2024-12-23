
```bash
sudo apt remove plasma-desktop --autoremove
sudo apt remove kubuntu-desktop --autoremove
sudo apt-get remove kde* --autoremove
sudo apt-get remove plasma* --autoremove
sudo update-alternatives --config default.plymouth # select an option
sudo update-initramfs -u
sudo update-grub
sudo systemctl disable sddm
sudo systemctl stop sddm
sudo systemctl enable gdm3
sudo systemctl start gdm3
reboot
```