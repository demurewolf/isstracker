from ephem import readtle
from os.path import getmtime
from subprocess import call
from math import pi
from requests import get

import json

ASTRO_NOTIFY_API_URL = "http://api.open-notify.org/astros.json"
CURRENT_TLE_FILE = "current-tle.txt"

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
    return elevation if metric_units else elevation * KILOMETERS_TO_MILE_FACTOR / 1000

def setup_tle(tle_file: str = "current-tle.txt"):
    last_modified_time = 0
    call(["get-tle"])

    if not last_modified_time or getmtime(CURRENT_TLE_FILE) > last_modified_time:
        print("TLE has more recent time")
        last_modified_time = getmtime(CURRENT_TLE_FILE)
        with open(CURRENT_TLE_FILE) as tle_file:
            name = tle_file.readline().rstrip()
            line1 = tle_file.readline().rstrip()
            line2 = tle_file.readline().rstrip()

    return readtle(name, line1, line2)

def setup_astros():
    astros_api_resp = get(ASTRO_NOTIFY_API_URL)
    astros_list = []
    if astros_api_resp.ok:
        astros_list = json.loads(astros_api_resp.text)["people"]
        print(astros_list)
    return astros_list
