import ephem
from os.path import getmtime
from subprocess import call

from fastapi import FastAPI, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

CURRENT_TLE_FILE = "current-tle.txt"
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
    # help(iss)

"""
iss_tle data:
iss_tle.n is in revolutions/day
Need to approximate a landspeed
iss_tle.elevation is in meters by default
Only need to convert if requested units is in miles
"""
@app.get("/now")
async def reIssData():
    iss_tle.compute()
    return {
        "latitutde": str(iss_tle.sublat),
        "longitude": str(iss_tle.sublong),
        "altidude": iss_tle.elevation, # in meters
        "velocity": iss_tle.n,
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
