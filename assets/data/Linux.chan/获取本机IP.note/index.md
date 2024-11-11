---
image: cover.jpg
---

hostname -I | awk '{print $1}'
export EXTERNAL_IP=$(hostname -I | awk '{print $1}')