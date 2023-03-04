from math import degrees

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .utils import convert_elevation, angularv_to_linearv, setup_tle, setup_astros


iss_tle = setup_tle()
astros = setup_astros()


app = FastAPI()

origins = [
    "http://localhost",
    "localhost",
    "http://iss.jrwedgwood.net",
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


@app.get("/now")
async def iss_now(units: str = "metric"):
    """
    Request Parameters:
    * units: string with values as ["metric" | "imperial"] for unit conversion. Anything other than the two keys mentioned before defaults to "metric".
    """
    iss_tle.compute()
    metric_units = False if units == "imperial" else True
    
    return {
        "latitude": degrees(iss_tle.sublat),
        "longitude": degrees(iss_tle.sublong),
        "altitude": convert_elevation(iss_tle.elevation, metric_units),
        "velocity": angularv_to_linearv(iss_tle.n, iss_tle.elevation, metric_units),
        "units": "kilometers" if metric_units else "miles"
    }


@app.get("/astros")
async def astros_now(craft: str = None):
    """
    Returns the same avaiable json information from the Open-Notify API, but with https protection.
    
    Request Parameters:
    If parameter craft is provided, only returns astronauts on board that craft. By default it returns all astronauts currently in space.
    """
    to_send = []
    for a in astros:
        if not craft or (craft and a["craft"] == craft):
            to_send.append(a)

    return {
        "number": len(to_send),
        "people": to_send
    }