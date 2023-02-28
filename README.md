# Toronto Fire Incidents Project
![Toronto Fire logo](https://upload.wikimedia.org/wikipedia/en/0/03/Toronto_Fire_Services_Logo.svg)
## Description

A leading insurance company wants to start offering fire insurance for the residents of the city of Toronto. It has hired our team of data scientists to help them determine what are the best variables to include in their risk assessment. This should help them to best determine what potential clients should pay in premiums based on where they live. 

The variables we will be studying are:

•	Population density
•	The number of fire incidents in the city by ward
•	The dollar loss sustained following the incidents
•	The time it takes to extinguish the fires

We’re trying to figure out which of these variables are tightly correlated with dollar losses and therefore, insurance payouts so that the client can make an informed decision.

The questions we are asking are:

•	Does population density in each ward correlate with the number of fire incidents?
•	Does the number of fire incidents in a ward correlate with the average dollar losses sustained by incident?
•	Do the average dollar losses by incident in a given ward correlate with the average time it takes to extinguish a fire?

The narrative we want to present is based on the following hypotheses: 

•	First, we believe a higher population density is correlated with a greater number of fire incidents. If this is the case, the client should charge more to customers who live in densely populated areas. 

•	Secondly, we believe that a greater number of fire incidents is correlated with a higher average dollar loss sustained by customers, as fires tend to spread from one dwelling to another. If this is the case, the client should charge more to customers who live in areas that have many fires. 

•	Lastly, we believe that the faster a fire is extinguished, the smaller the average loss sustained by that fire should be. If that is the case, the client should charge less to customers that live in areas with more effective fire control services. 


### Analysing fire data created by the city of Toronto
Using the [city of Toronto's fire incident data](https://open.toronto.ca/dataset/fire-incidents/) to understand fires in [Toronto's wards](https://open.toronto.ca/dataset/city-wards/). This data with the use of the [fire station location](https://open.toronto.ca/dataset/fire-station-locations/) and [fire hydrant location](https://open.toronto.ca/dataset/fire-hydrants/) is used to improve our understanding of the nature of fire in the city. 


## Workflow

We have built this project using the following method (present flow chart):
•	We created a MongoDB database that is hosted on a remote server. The database is using data scraped from the city of Toronto open data portal
•	We connected the database to a Flask API
•	Our team pulled the GeoJSON data from the API to analyze it and test our hypotheses
•	We created visualizations of the data in the form of heat & choropleth maps as well as added a few markers of fire stations and fire hydrants. 

![image](https://user-images.githubusercontent.com/115593434/221733883-9cdf9225-67cc-44da-a5a9-621b41ad4fe2.png)

## Analysis

# Does population density in each ward correlate with the number of fire incidents?
We found no correlation between the number of incidents in a ward and the density of the population in that ward. This is a surprising finding, but our analysis shows that our client cannot use this variable to make an assessment a potential customer’s risk.

![image](https://user-images.githubusercontent.com/115593434/221733991-e3293cb3-3265-4b7f-96e4-7e6937442a5d.png)

# Does the number of fire incidents historically correlate with the average dollar damage sustained by incident? 

We found no correlation between the number of incidents and the average dollar loss per ward. Meaning our client can't assume a potential customer living in a ward that has a high number of fire incidents historically is likely to cost them more in insurance payouts. 

![image](https://user-images.githubusercontent.com/115593434/221734196-61b8084f-3437-4fcf-91cc-8b7d4051c0f0.png)


# Does the average dollar losses by incident in a given ward correlate with the average time it takes to extinguish a fire?

We found there is a significant relationship between the average dollar loss per incident in a ward and the time it takes to extinguish it. This means we must reject the null hypothesis. There is indeed an effect between how quickly a fire is put out and how much damage that fire can cause in dollar terms. 
However, the low r-squared value shows a high level of variability in the data. This means the insurance company cannot use extinguishing time as the sole predictor variable to get an accurate assessment of what fires will cost them in insurance payouts. Other variables must be taken into consideration. 

![image](https://user-images.githubusercontent.com/115593434/221734276-dfa9c5af-db2d-400a-8bcd-a8bc2d6f1a67.png)

# Summary 
Our research has yielded only one useful variable for our client. The speed at which fire control services in a given ward put out fires could help in assessing the financial risk tied with a customer’s insurance policy. 
We had a few challenges in getting solid data from the open data portal from the city of Toronto. One was the lack of detailed information about fire control services in the data. 
20% of the incidents didn’t include information about whether a fire alarm was present or not. The same can be said for 10% of incidents with regards to fire sprinklers. This made it difficult to assess whether the presence of these types of safety mechanisms contribute meaningfully to reducing dollar losses.
Given more time, we would further deepen our client’s risk assessment framework by controlling for property value. We believe this would be a powerful way to reduce the noise in the data. 
This way, we adhere to rule number one of consulting, always find more ways to bill your client. 

## Visualisations
Using JavaScript we created multiple different visulisations from the initial data to answer three primary questions. 

# Heat map of fire incidents since 2011
The map shows the frequency of fire incidents also includes a timeline of daily fire incidents with clickable markers that include a popup with additional information.

![image](https://user-images.githubusercontent.com/115593434/221734399-91e16cd0-4513-469c-811e-c1998adfc2b4.png)

# Choropleth map of total dollar loss by ward
The map shows the level of dollar loss caused by fire incidents by Toronto wards. It includes optional markers with fire stations and fire hydrants. 
The fire hydrants are clustered for visibility purposes. 

![image](https://user-images.githubusercontent.com/115593434/221734945-04299e93-ebaf-42ce-9bfb-40ca057780bf.png)

![image](https://user-images.githubusercontent.com/115593434/221734961-f4886550-9f81-4187-85ed-bef9c68a4854.png)

There is also a popup of a plotly pie chart that shows the % of the total dollar loss associated with that ward vs the city

![image](https://user-images.githubusercontent.com/115593434/221735234-4a0730ea-d295-4d1c-91e8-b948e4cd50ed.png)

# Choropleth map of population density by ward

This map includes clickable wards that have popups showing the population density for each ward. 

![image](https://user-images.githubusercontent.com/115593434/221735366-d69f96f9-3701-4b81-adb9-fb9879e66562.png)

# Choropleth map of average dollar loss by ward

The map also includes clickable wards that have popups showing the average dollar damage for each ward.

![image](https://user-images.githubusercontent.com/115593434/221735626-f3c6caaf-821c-4cc6-85d1-3d618c8cb341.png)

# Choropleth map of extinguishing time by ward

The map also includes clickable wards that have popups showing the average time in minutes to put out fires in each ward. 

![image](https://user-images.githubusercontent.com/115593434/221735965-6885b89d-b4c0-417d-84b5-c96995ffdb5b.png)


## Authors
This data has been collected, aggregated, and visualised by Natalia Ebralidze, Eric Liu, Youssouf Ismael Youssouf, and David Chartrand.
