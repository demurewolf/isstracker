
CELESTRAK_URL="https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle";
TEMP_TLE_FILE="tmp-tle.txt"
CURRENT_TLE_FILE="current-tle.txt"

curl -N $CELESTRAK_URL | head -n 3 > $TEMP_TLE_FILE

if [[ -n $(diff $TEMP_TLE_FILE $CURRENT_TLE_FILE) ]]; then
    # Need to update tle file
    echo "Updating tle file"
    cp $TEMP_TLE_FILE $CURRENT_TLE_FILE
else
    echo "No need to update"
fi

# Cleanup
rm $TEMP_TLE_FILE