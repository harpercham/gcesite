update:
1.upload to digitalocean

corrective: 
1. <% include partials/script-table %> ==> <%- include ('partials/script-table') %>
2. giv up using env...all confg directly bind to client id ,secret and domain

cmd:
1. pm2 start node ./bin/www (pm2 execute app)
2. rm -rd [dirname]  (remove directory)
3. pm2 stop all (stop all pm2 running app)
4. ls (show all dir)
5. sudo npm install -g pm2  (install pm2 in ubuntu)