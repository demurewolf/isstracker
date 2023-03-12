from ephem import readtle
from os.path import getmtime
from subprocess import call
from math import pi
from requests import get

import json

CELESTRAK_TLE_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle"
ASTRO_NOTIFY_API_URL = "http://api.open-notify.org/astros.json"

KILOMETERS_TO_MILE_FACTOR = 0.6213711922 # 0.6213711922 miles to 1 km

NOMINAL_EQUATORIAL_EARTH_RADIUS = 6_378_137 # meters

# This appears to fix the deviations between reported speeds
# and my calculated speed
TEST_EARTH_RADIUS = NOMINAL_EQUATORIAL_EARTH_RADIUS + 10_000 
AVG_EARTH_RADIUS = NOMINAL_EQUATORIAL_EARTH_RADIUS
SPEED_FACTOR = pi / 12

def angularv_to_linearv(rev_per_day, altitude, metric_units=True):
    meters_per_hour = SPEED_FACTOR * (AVG_EARTH_RADIUS + altitude) * rev_per_day
    kph_speed = meters_per_hour / 1000
    return kph_speed if metric_units else kph_speed * KILOMETERS_TO_MILE_FACTOR

def convert_elevation(elevation, metric_units=True):
    # elevation is in meters => convert to km
    km_elevation = elevation / 1000
    return km_elevation if metric_units else km_elevation * KILOMETERS_TO_MILE_FACTOR

def update_tle_data():
    celestrak_resp = get(CELESTRAK_TLE_URL)
    iss_tle_data = []

    if celestrak_resp.ok:
        all_tle_lines = celestrak_resp.text.split("\r\n")
        
        # ISS is always first in the list
        for i in range(3):
            iss_tle_data.append(all_tle_lines[i])

    return iss_tle_data   


def setup_tle():
    last_modified_time = 0

    tle_data = update_tle_data()
    return readtle(tle_data[0], tle_data[1], tle_data[2])

def setup_astros():
    astros_api_resp = get(ASTRO_NOTIFY_API_URL)
    astros_list = []
    if astros_api_resp.ok:
        astros_list = json.loads(astros_api_resp.text)["people"]
    
    return astros_list
