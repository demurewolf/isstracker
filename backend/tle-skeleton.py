import ephem
from os.path import getmtime
from subprocess import call


CURRENT_TLE_FILE = "current-tle.txt"
last_modified_time = 0

call(["bash", "./get-tle.sh"])

if not last_modified_time or getmtime(CURRENT_TLE_FILE) > last_modified_time:
    print("TLE has more recent time")
    last_modified_time = getmtime(CURRENT_TLE_FILE)
    with open(CURRENT_TLE_FILE) as tle_file:
        name = tle_file.readline().rstrip()
        line1 = tle_file.readline().rstrip()
        line2 = tle_file.readline().rstrip()

# name = "ISS (ZARYA)"
# line1 = "1 25544U 98067A   23054.08647934  .00016425  00000+0  30306-3 0  9997"
# line2 = "2 25544  51.6387 173.6946 0005244  18.7627 155.7322 15.49238117384094"

tle_rec = ephem.readtle(name, line1, line2)
tle_rec.compute()

print(tle_rec.sublong, tle_rec.sublat)