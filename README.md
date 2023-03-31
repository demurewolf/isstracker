# ISS Tracking Map

## About

This project is a webpage that displays a world map and shows the current location of the International Space Station (ISS) on that map.

Satellite data used to calculate the ISS' postion is from CelesTrak's public data [repository](https://celestrak.org/) ([here](https://celestrak.org/NORAD/elements/) for current stations).

Data for current astronauts in space is found using OpenNotify's [API](http://open-notify.org/).

## Requirements

### Base

The requirements are as follows:

- [x] Have a world map (google maps, open street map, etc)
- [x] Show ISS location in real time relative to the world map
- [x] Display other stats about ISS location
  - [x] Latitude
  - [x] Longitude
  - [x] Altitude
  - [x] Current Speed
  - [x] Convert between metric and imperial measurements

### Bonus

- [x] Host it on a Linode VPS with Docker
- [ ] ISS travel path until +/- 1 hour
