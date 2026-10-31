# The Minair Report

https://minair.me 

The Minair Report came to life during the height of the pandemic.
On the surface, the website is a real-time data visualization for an indoor air
quality sensor named “Minair” that lives in Brooklyn, NY. During the lockdown, a
group of friends met virtually every Friday night for some socializing/games.
It was during these meetups that Minair was created. At each weekly meeting, the
group would iterate on the latest developments. Eventually, it became highly
self-referential, leading to memes, original songs, erotica stories, and more.

Watch the Minair Seminair for a deeper dive
https://minair.me/minair-seminair


## Stack
### Google Cloud
Initially I wrote a Flask app that ran on GCP (App Engine) and connected to a MySQL database on GCP. The Flask app hosted the index.html file for the frontend SPA. Assets such as JS / CSS scripts, audio, images, and videos were hosted on a public GCP bucket. I also used a cron job on GCP to curl an endpoint that grabs the sensor data and stores it in the database.
That cost about $30 / month. It was very fast to set up that stack and allowed me to quickly host the app and get started.

### Raspberry Pi
After a few months, I decided to get a Raspberry Pi.
I now have the Flask app running on the Pi. It took minimal work to get that set up on the Pi with Python 3.7.
The backend reads the PurpleAir sensor data and continuously pushes JSON files to a Google Cloud Storage bucket. A cron job on the Pi calls the Flask API endpoint every minute. The endpoint does a few things:
* reads the latest sensor data
* stores it in the database
* calculates a few windowed averages: 1 hour, 6 hours, 12 hours, 24 hours, and 1 week
* uploads the current reading and the averages as JSON files to the Google Cloud Storage bucket 

The files have no TTL so they don't get cached. 

The frontend reads the JSON files and renders the data. The frontend also refetches the files every 30 seconds.

This is the cheapest setup, costing ~$1/month for the Google Cloud Storage bucket.

Firebase Hosting is free for the frontend.

The [Raspberry Pi 400](https://www.raspberrypi.com/products/raspberry-pi-400/) cost me $100.

### Frontend

|                           Next.js                            |                            React                             |                         Material UI                          |                          Highcharts                          |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| [Next.js App Router](https://nextjs.org) | ![react-color](https://github.com/minair-affair/minair-report/assets/327971/01a14705-9574-4a65-8c92-5476755d380b) | ![mui-color](https://github.com/minair-affair/minair-report/assets/327971/39712485-03e0-4fd0-adc6-dd2c1943d674) | ![highcharts](https://github.com/minair-affair/minair-report/assets/327971/d1a825d0-72d9-4ca6-8ae6-28c873b72c53) |


### Backend

|                        Raspberry Pi 4                        |                            Flask                             |                           MariaDB                            |                           Firebase                           |                         Google Cloud                         |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![raspberrypi-color](https://github.com/minair-affair/minair-report/assets/327971/71620722-df93-4452-978e-f577ba76d11e) | ![flask-color](https://github.com/minair-affair/minair-report/assets/83786415/8cf78e82-575e-4842-8b05-b5a459b72a30) | ![mariadb-color](https://github.com/minair-affair/minair-report/assets/327971/5b32edee-8311-4da9-ad74-1b45e788db8a) | ![firebase-color](https://github.com/minair-affair/minair-report/assets/327971/d78d0e31-c31a-433d-b103-95944f90b4bb) | ![googlecloud-color](https://github.com/minair-affair/minair-report/assets/327971/0b2c6b82-5cdb-42b9-b94e-8cbac34aca14) |

## Local development

The client uses Next.js 16, React 19, Material UI 9, TypeScript 7, and pnpm 12.

```sh
cd client
nvm use
pnpm install
pnpm dev
```

Open http://localhost:3000. `pnpm start` is also an alias for the development server.
Linting runs separately with `pnpm lint` and does not block development or builds.

```sh
pnpm typecheck
pnpm build
```

The build exports every page to `client/out/`, including the existing video URLs.
From `client/`, deploy to the existing Firebase Hosting site:

```sh
pnpm exec firebase login # only needed if you are not already signed in
pnpm run deploy
```

`pnpm run deploy` builds the client, then publishes `out/` to the `minair` site in
project `api-project-992432653598`. The Firebase CLI is a local dev dependency;
`client/firebase.json` and `client/.firebaserc` hold the hosting configuration.
A failed build stops deployment. The Python server and Google Cloud Storage
data/media URLs are unchanged. Next.js serves its own `_next` assets; the old
CRA `/static/` rewrite is no longer needed.

The all-time report reads generated JSON/CSV files from
`https://storage.googleapis.com/www.minair.me/data/history/`. Local exports remain
gitignored in `client/public/data/history/`; upload them to
`gs://www.minair.me/data/history/` when regenerating the report.
