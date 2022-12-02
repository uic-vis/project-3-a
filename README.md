# Project 2 Angelica Villegas Salazar

## Website

https://sites.google.com/uic.edu/cs424-p3


## Github Repository Description
This repository has the html I used on the google site, seperated by graph. 

## Data Set Description

### Data Set Information
Using Divvy bike data from July 1st to July 8th 2022([https://ride.divvybikes.com/system-data]). It has 157959 entries


Processed the data using Pandas in python. In doing this I added and removed columns. Additionally, the data was filtered to only contain dates from July 1st to July 8th so that the data could be uploaded to observable. I then pulled the json from my observable notebook (https://observablehq.com/@angelica-v/project-2) that contained any additional filtering I created.

### Data Fields

rideType: d['rideable_type']  (Bike type data: docked/electric/classic)</br>
member: d['member_casual'], (Member type: casual/member)</br>
startDates: d['StartDates'], (Start Dates: date that the trip started (format. 2022-07-05))</br>
endDates: d['EndDates'],(End Dates: date that the trip started (format. 2022-07-05))</br>
startTime: d['StartTime'],(Start Time: time that the trip started (format. 08:24:32, 24h time))</br>
endTime: d['EndTime'], (End Time: time that the trip ended (format. 08:24:32, 24h time))</br>
startStation: d['start_station_name'],(Start Station Name: the name of the station trip started at)</br>
endStation: d['end_station_name'],(End Station Name: the name of the station trip ended at)</br>
fullStartTime: d['started_at'], (Full Start Time: full start time includes date and time (format. 2022-07-06 13:47:18))</br>
fullEndTime: d['ended_at'], (Full End Time: full end time includes date and time (format. 2022-07-06 13:47:18))</br>
startLatitude: d['start_lat'], (Start Latitude: start latitude of trip in degrees)</br>
startLongitude: d['start_lng'],(Start Longitude: start longitude of trip in degrees)</br>
endLatitude: d['end_lat'], (End Latitude: end latitude of trip in degrees)</br>
endLongitude: d['end_lng'], (End Longitude: end longitude of trip in degrees)</br>
zipCode: d['zip'],(Zip Code: added using pandas, the zip code of where the trip started)</br>
roundTrip: d['StartEqEnd'], (Round Trip: added using pandas, returns 1 if the trip starts and ends at the same location else returns 0)</br>
timeTook: d['TimeTook'], (Time Took: added using pandas, The time in minutes that the trip took, calculated by subtracting start time from end time)</br>
rideId: d['ride_id'] (Ride Id: id for each ride)</br>

