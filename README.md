# The Minair Report

https://minair.me 

The Minair Report came to life during the height of the pandemic.
On the surface, the website is a real-time data visualization for an indoor air
quality sensor named “Minair” that lives in Brooklyn, NY. During the lockdown, a
group of friends met virtually every Friday night for some socializing/games.
It was during these meet ups that Minair was created. Each weekly meeting the
group would iterate on the latest developments. Eventually it became highly
self-referential, leading to memes, original songs, erotica stories, and more.

Watch the Minair Seminair for a deeper dive
https://minair.me/minair-seminair


## Stack
Flask app running on a Raspberry Pi 4. The backend reads the sensor data and continously pushes JSON files to a Google Cloud Storage bucket. A cron job on the Pi calls the Flask API endpoint every minute. The endpoint does a few things:
* reads the latest sensor data
* stores it in the database
* calculates a few windowed averages: 1 hour, 6 hours, 12 hours, 24 hours, 1 week
* uploads the current reading and the averages as JSON files to the Google Cloud Storage bucket 
The files have no TTL so they dont get cached. 
The frontend reads the JSON files and renders the data. The frontend also refreshes the data every 30 seconds.
This is the cheapest setup, costing ~$1/month for the Google Cloud Storage bucket.
Firebase hosting is free for the frontend.

### Frontend
* next.js
* Material UI
* React
* Highcharts


### Backend
* Flask
* MariaDB
* Firebase for hosting the frontend
* Google Cloud SDK
