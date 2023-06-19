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
* ![nextdotjs-color](https://github.com/minair-affair/minair-report/assets/327971/a497f915-f991-4124-852c-731b08cf9ff4)
next.js
* ![react-color](https://github.com/minair-affair/minair-report/assets/327971/01a14705-9574-4a65-8c92-5476755d380b)
React
* ![mui-color](https://github.com/minair-affair/minair-report/assets/327971/39712485-03e0-4fd0-adc6-dd2c1943d674)
Material UI
* ![highcharts](https://github.com/minair-affair/minair-report/assets/327971/d1a825d0-72d9-4ca6-8ae6-28c873b72c53)
Highcharts

<br />

### Backend
* ![raspberrypi-color](https://github.com/minair-affair/minair-report/assets/327971/71620722-df93-4452-978e-f577ba76d11e)
Raspberry Pi 4
* ![flask-color](https://github.com/minair-affair/minair-report/assets/327971/039d276c-b78c-4489-8de3-a4f612c35a4b)
Flask
* ![mariadb-color](https://github.com/minair-affair/minair-report/assets/327971/5b32edee-8311-4da9-ad74-1b45e788db8a)
MariaDB
* ![firebase-color](https://github.com/minair-affair/minair-report/assets/327971/d78d0e31-c31a-433d-b103-95944f90b4bb)
Firebase for hosting the frontend
* ![googlecloud-color](https://github.com/minair-affair/minair-report/assets/327971/0b2c6b82-5cdb-42b9-b94e-8cbac34aca14)
Google Cloud SDK
