import ephem
from os.path import getmtime
from subprocess import call
from math import pi

from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

CURRENT_TLE_FILE = "current-tle.txt"
KILOMETERS_TO_MILE_FACTOR = 0.6213711922 # 0.6213711922 miles to 1 km

NOMINAL_EQUATORIAL_EARTH_RADIUS = 6_378_137 # meters
ARITHMETIC_MEAN_EARTH_RADIUS = 6_371_008.8 # meters
NOMINAL_POLAR_EARTH_RADIUS = 6_356_752 # meters

# This appears to fix the deviations between reported speeds
# and my calculated speed
TEST_EARTH_RADIUS = NOMINAL_EQUATORIAL_EARTH_RADIUS + 10_000 
AVG_EARTH_RADIUS = NOMINAL_EQUATORIAL_EARTH_RADIUS
SPEED_FACTOR = pi / 12
app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

last_modified_time = 0
call(["bash", "./get-tle.sh"])

if not last_modified_time or getmtime(CURRENT_TLE_FILE) > last_modified_time:
    print("TLE has more recent time")
    last_modified_time = getmtime(CURRENT_TLE_FILE)
    with open(CURRENT_TLE_FILE) as tle_file:
        name = tle_file.readline().rstrip()
        line1 = tle_file.readline().rstrip()
        line2 = tle_file.readline().rstrip()

    iss_tle = ephem.readtle(name, line1, line2)

def angularv_to_linearv(rev_per_day, altitude, metric_units=True):
    meters_per_hour = SPEED_FACTOR * (AVG_EARTH_RADIUS + altitude) * rev_per_day
    kph_speed = meters_per_hour / 1000
    return kph_speed if metric_units else kph_speed * KILOMETERS_TO_MILE_FACTOR

def convert_elevation(elevation, metric_units=True):
    return elevation if metric_units else elevation * KILOMETERS_TO_MILE_FACTOR / 1000

"""
iss_tle data:
iss_tle.n is in revolutions/day
Need to approximate a linearspeed
iss_tle.elevation is in meters by default
Only need to convert if requested units is in miles
Param units: string with values as "metric" | "imperial" for unit conversion
"""
@app.get("/now")
async def iss_now(units: str = "metric"):
    iss_tle.compute()
    metric_units = True if units == "metric" else False
    
    return {
        "latitutde": str(iss_tle.sublat),
        "longitude": str(iss_tle.sublong),
        "altidude": convert_elevation(iss_tle.elevation, metric_units),
        "velocity": angularv_to_linearv(iss_tle.n, iss_tle.elevation, metric_units),
        "eclipsed": iss_tle.eclipsed
    }

class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope) -> Response:
        try:
            return await super().get_response(path, scope)
        except HTTPException as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            else:
                raise ex
    
app.mount("/", SPAStaticFiles(directory="dist", html=True), name="app")
