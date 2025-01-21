#!/bin/bash
# start-fullstack.sh

# 启动前端和后端服务
cd /root/Library-main
# 替换为实际node项目根目录
/usr/bin/yarn start-server-prod &

cd /var/www/dist
# 替换为实际生产环境目录
/usr/local/bin/serve -s . &

# 重启Nginx
sudo systemctl restart nginx

wait