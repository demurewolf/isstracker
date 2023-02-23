import ephem
from os.path import getmtime
from subprocess import call
from fastapi import FastAPI

CURRENT_TLE_FILE = "current-tle.txt"
last_modified_time = 0
app = FastAPI()


call(["bash", "./get-tle.sh"])

if not last_modified_time or getmtime(CURRENT_TLE_FILE) > last_modified_time:
    print("TLE has more recent time")
    last_modified_time = getmtime(CURRENT_TLE_FILE)
    with open(CURRENT_TLE_FILE) as tle_file:
        name = tle_file.readline().rstrip()
        line1 = tle_file.readline().rstrip()
        line2 = tle_file.readline().rstrip()

    iss = ephem.readtle(name, line1, line2)
    # help(iss)

@app.get("/issnow")
async def reIssData():
    iss.compute()
    return {
        "latitutde": str(iss.sublat),
        "longitude": str(iss.sublong),
        "altidude": iss.elevation, # in meters
        "velocity": iss.n,
        "eclipsed": iss.eclipsed
    }

@app.get("/")
async def root():
    return {"message": "Hello World"}






