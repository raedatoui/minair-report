kill $(ps aux | grep uwsgi | awk '{print $2}')
