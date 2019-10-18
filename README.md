# VI13 - Information Visualization
> Data visualization class at Instituto Superior de Técnico Lisbon.

The Medium post: [Making a map with EU data on R: Erasmus exchanges by country
](https://medium.com/@jules.beley/making-a-map-with-eu-data-on-r-erasmus-exchanges-by-country-3f5734dcd4ff)


## Common columns in final datasets
column name          | found in 
-|-
CountryHosting       | geocodedMobility.csv 
CountryReceiving     | geocodedMobility.csv 
StudentIncomingCount | 
StudentOutgoingCount | 
CoordinatesSending   | geocodedMobility.csv 
CoordinatesHosting   | geocodedMobility.csv 
km                   | geocodedMobility.csv 


## Questions
0)	What is the flow of students doing Erasmus between countries?
    - [x] Original dataset
1)	Which countries are popular for being an Erasmus destination? 
    - [x] Original dataset
0) Is there any difference between bachelor and master’s degrees?
    - [x] Original dataset
5)	Does gender effects the choice?
    - [x] Original dataset
3)	Does distance from the home country to the Erasmus country matter?
    - [x] Can be calculated from the coordinates
0) Does the city size of target and home university matter?
    - [x] Geocity dataset 
4)	How does difference in cost of living in home and target country effect the selection?
    - [x] food_price_monitoring, also the price index

# Datasets
## Dataset Student_mobility (2009 - 2014)
RAW datasets are available at [data.europa.eu](https://data.europa.eu/euodp/en/data/dataset?q=Raw+data+of+Erasmus+student+mobility&ext_boolean=all&sort=). However only for the years 2009 - 2014. The latest 2013-14 dataset is available [here](https://data.europa.eu/euodp/en/data/dataset/erasmus-mobility-statistics-2013-14).

The 2013/2014 dataset consists of 272 497 records and contains the following columns:

``` text
Action, CallYear, ProjectNumber, MobiilityID, SendingCountry, ReceivingCountry, MobilityType, SpecialNeeds, SubjectAreaCode, SubjectAreaName, CombinedMobilityYesNo, StartDate, EndDate, DurationInMonths, DurationInDays, SubsistenceTravel, LevelOfStudy, ParticipantID, ParticipantGender, ParticipantType, Language, SendingPartnerErasmusID, SendingPartnerName, HostingPartnerErasmusID, HostingPartnerName, HostingPartnerCountry, HostingPartnerCity
```

Whole description of dataset and each attribute can be obtained from [European Open Data Portal](https://data.europa.eu/euodp/en/data/dataset/erasmus-mobility-statistics-2013-14/resource/ebf302e3-0300-48c4-a713-c795325e7034). The dataset contains an entry for each student participating in the Erasmus+ programme. Length of the stay can be calculated from *StartDate* and *EndDate* as well as *DurationInMonths* and *DurationInDays* columns. 

The dataset contains information about the sending and receiving institution (*SendingPartnerErasmusID, SendingPartnerName, HostingPartnerErasmusID, HostingPartnerName, HostingPartnerCountry, HostingPartnerCity*), the area of studies (*SubjectAreaCode, SubjectAreaName*), sending and receiving country code (*SendingCountry, ReceivingCountry*), information about the degree (*LevelOfStudy*) as well as participant's gender (*ParticipantGender*), language (*Language*) and identification whether the participant requires any special needs (*SpecialNeeds*). City of the sending institution is not available however should be obtainable from other dataset which maps the code to the institution.

<!---
 Make sure that the index is not called Action. 
 The table was generated with https://www.tablesgenerator.com/markdown_tables.
 --->
| | Action | CallYear | ProjectNumber | MobiilityID | SendingCountry | ReceivingCountry | MobilityType | SpecialNeeds | SubjectAreaCode | SubjectAreaName | CombinedMobilityYesNo | StartDate | EndDate | DurationInMonths | DurationInDays | SubsistenceTravel | LevelOfStudy | ParticipantID | ParticipantGender | ParticipantType | Language | SendingPartnerErasmusID | SendingPartnerName | HostingPartnerErasmusID | HostingPartnerName | HostingPartnerCountry | HostingPartnerCity |
|--------|----------|---------------|------------------------|-----------------------|------------------|--------------|--------------|-----------------|-----------------|------------------------------------------------|-----------|----------------------|----------------------|----------------|-------------------|--------------|---------------|---------------------|-----------------|----------|-------------------------|--------------------|------------------------------------------------|--------------------|--------------------------------------------------|--------------------|-------------------------|
| 162835 | ERA02 | 2013 | 2013-1-GR1-ERA02-15244 | GRSMS13314752160 | GR | DE | Mob-SMS | 0.0 | 380 | Law | NO | 21-OCT-2013 00.00.00 | 02-AUG-2014 00.00.00 | 9 | 0 | 4037.5 | First Cycle |  | F | Students | DE | G  ATHINE01 | ETHNIKO KAI KAPODISTRIAKO PANEPISTIMIO ATHINON | D  FREIBUR01 | ALBERT-LUDWIGS-UNIVERSITÃ„T FREIBURG IM BREISGAU | DE | Freiburg |
| 146880 | ERA02 | 2013 | 2013-1-GB1-ERA02-24406 | 104 | GB | ES | Mob-SMP | 0.0 | 222 | Foreign languages |  | 01-OCT-2013 00.00.00 | 31-MAY-2014 00.00.00 | 8 | 0 | 3093.75 | First Cycle | UK1110643295271 | F | Students | ES | UK LEEDS02 | Leeds Metropolitan University |  | IES El Bohio | ES | Murcia |
| 88811 | ERA02 | 2013 | 2013-1-ES1-ERA02-74180 | 39464320TSMS | ES | LT | Mob-SMS | 0.0 | 481 | Computer science | NO | 01-SEP-2013 00.00.00 | 26-JUN-2014 00.00.00 | 9 | 0 | 1450.0 | First Cycle | 39464320T | M | Students | EN | E  VIGO01 | UNIVERSIDADE DE VIGO | LT VILNIUS10 | VILNIAUS KOLEGIJA | LT | Vilnius |
| 232503 | ERA02 | 2013 | 2013-1-PL1-ERA02-39278 | 39278-MOB-00009 | PL | PT | Mob-SMS | 0.0 | 340 | Business and administration (broad programmes) | NO | 28-AUG-2013 00.00.00 | 31-JAN-2014 00.00.00 | 5 | 0 | 1575.0 | Second Cycle |  | F | Students | EN | PL WARSZAW21 | Akademia Leona KoÅºmiÅ„skiego | P  LISBOA07 | ISCTE-INSTITUTO UNIVERSITÃRIO DE LISBOA | PT | LISBOA |
| 92053 | ERA02 | 2013 | 2013-1-ES1-ERA02-74197 | 74197-MOB-00071 | ES | PT | Mob-SMS | 0.0 | 14 | Teacher training and education science | NO | 21-AUG-2013 00.00.00 | 03-JUL-2014 00.00.00 | 10 | 0 | 1750.0 | First Cycle | 71306410Q | F | Students | PT | E  BURGOS01 | UNIVERSIDAD DE BURGOS | P  LEIRIA01 | INSTITUTO POLITÃˆCNICO DE LEIRIA (IPL) | PT | LEIRIA |
| 55489 | ERA02 | 2013 | 2013-1-DE1-ERA02-02508 | 23107 | DE | GB | Mob-SMS | 0.0 | 22 | Humanities | NO | 15-SEP-2013 00.00.00 | 06-JUN-2014 00.00.00 | 8 | 0 | 2520.0 | First Cycle | 17211 | F | Students | EN | D  LEIPZIG01 | UniversitÃ¤t Leipzig | UK MANCHES01 | THE UNIVERSITY OF MANCHESTER | GB | MANCHESTER |
| 10505 | ERA02 | 2013 | 2013-1-BE3-ERA02-07678 | 214-2013-2014 | BE | IT | Mob-SMS | 0.0 | 225 | History and archeology | NO | 29-JAN-2014 00.00.00 | 18-JUN-2014 00.00.00 | 4 | 0 | 1850.0 | First Cycle |  | M | Students | IT | B  ANTWERP01 | UNIVERSITEIT ANTWERPEN | I  BOLOGNA01 | UNIVERSITÃ€ DI BOLOGNA - ALMA MATER STUDIORUM | IT | BOLOGNA |
| 170547 | ERA02 | 2013 | 2013-1-HU1-ERA02-10358 | 13/003-E-1013/SMS/212 | HU | IS | Mob-SMS | 0.0 | 312 | Sociology and cultural studies | NO | 03-JAN-2014 00.00.00 | 10-MAY-2014 00.00.00 | 4 | 0 | 1664.0 | Second Cycle | HU BUDAPES01 SM 193 | F | Students | EN | HU BUDAPES01 | EÃ¶tvÃ¶s LorÃ¡nd TudomÃ¡nyegyetem | IS REYKJAV01 | HASKOLI ISLANDS | IS | Reykjavik |
| 57082 | ERA02 | 2013 | 2013-1-DE1-ERA02-02527 | 02527-MOB-00009 | DE | GB | Mob-SMS | 0.0 | 214 | Design | NO | 16-SEP-2013 00.00.00 | 24-JAN-2014 00.00.00 | 4 | 0 | 1182.0 | First Cycle |  | F | Students | EN | D  MANNHEI03 | Hochschule Mannheim | UK LEEDS01 | UNIVERSITY OF LEEDS | GB | Leeds |
| 151116 | ERA02 | 2013 | 2013-1-GB1-ERA02-25231 | 25231-MOB-00018 | GB | FR | Mob-SMS | 0.0 | 380 | Law | NO | 28-AUG-2013 00.00.00 | 14-DEC-2013 00.00.00 | 3 | 0 | 1406.25 | First Cycle | UK1111682321277 | F | Students | FR | UK GLASGOW01 | University of Glasgow | F  MARSEIL84 | UNIVERSITE D'AIX-MARSEILLE | FR | AIX-EN-PROVENCE CEDEX 1 |

---
## Dataset EUC_for_academic (2007 - 2014)
This datasets consist of all universities participating in ERASMUS program for the specific academic year. Years 2007 - 2013 are in a dataset called EUC_Consolidated_Table_2007_2013, year 2013-2014 is in the dataset EUC_for_academic_year_2013_2014.


**Join on the Erasmus code?**
> This is useful for mapping the erasmus code to the city name?

The 2007 - 2013 dataset consists of 4918 records and contains the following columns:

``` text
Country, Charter type code, Organisation Name, Erasmus code, Street, Postcode, City
```

The 2013/2014 dataset consists of 4919 records and contains the following columns:

``` text
Institutional code, Application Reference Number, Name of Organisation, Country, City, Code
```

The datasets can be used for mapping of university code to city name.

---
## Dataset Comparative_food_price
Whole dataset can be obtained from [Eurostat](
https://ec.europa.eu/eurostat/databrowser/view/tec00120/default/table?lang=en). Check the link to see barchart and map graphics.

**Join on country name. Whole time period.**

> Nice that it contains the whole time we need. It is also normalized which will save us some work.

This dataset contains comparative price levels if final consumption by private households. Comparative price levels are the ratio between Purchasing power partities (PPPs) and market exchange rate for each country. PPPs are currency conversion rates that convert economic indicators expressed in national currencies to a common currency, called Purchasing Power Standard (PPS). Because of this is allows meaningful comparison.

The ratio is shown in relation to the EU average which is 100. If the index of the country is higher/lower than 100, the country concerned is relatively expensive/cheap as compared to EU average.

Sample:

| TIME                                             | 2007  |   | 2008  |   | 2009  |   | 2010  |   | 2011  |   | 2012  |   | 2013  |   | 2014  |   | 2015  |   | 2016  |   |
|--------------------------------------------------|-------|---|-------|---|-------|---|-------|---|-------|---|-------|---|-------|---|-------|---|-------|---|-------|---|
| GEO (Labels)                                     |       |   |       |   |       |   |       |   |       |   |       |   |       |   |       |   |       |   |       |   |
| European Union - 28 countries                    | 100   |   | 100   |   | 100   |   | 100   |   | 100   |   | 100   |   | 100   |   | 100   |   | 100   |   | 100   |   |
| European Union - 27 countries (2007-2013)        | 100,1 |   | 100,1 |   | 100,1 |   | 100,1 |   | 100,1 |   | 100,2 |   | 100,2 |   | 100,2 |   | 100,2 |   | 100,2 |   |
| Euro area (19 countries)                         | 99    |   | 101,5 |   | 103,9 |   | 102,8 |   | 102,9 |   | 101,8 |   | 102,1 |   | 101,2 |   | 99,2  |   | 101,5 |   |
| Euro area (18 countries)                         | 99,2  |   | 101,7 |   | 104,1 |   | 103   |   | 103,1 |   | 102   |   | 102,4 |   | 101,4 |   | 99,5  |   | 101,7 |   |
| Belgium                                          | 105,1 |   | 108,2 |   | 110,3 |   | 109,2 |   | 109,1 |   | 107,9 |   | 108,7 |   | 106,8 |   | 104,5 |   | 108,8 |   |
| Bulgaria                                         | 45,8  |   | 50,1  |   | 53,1  |   | 52    |   | 51,1  |   | 50,1  |   | 49,4  |   | 47,4  |   | 46,7  |   | 47,7  |   |
| Czechia                                          | 63    |   | 72,3  |   | 68,9  |   | 71,6  |   | 73,5  |   | 71,2  |   | 68,2  |   | 62,8  |   | 62,8  |   | 65,6  |   |
| Denmark                                          | 132   |   | 135,2 |   | 138,6 |   | 137,5 |   | 139   |   | 138   |   | 138,2 |   | 138   |   | 134,2 |   | 140,3 |   |
| Germany (until 1990 former territory of the FRG) | 101,1 |   | 103,4 |   | 105,6 |   | 104,1 |   | 102,9 |   | 101,5 |   | 103,2 |   | 101,8 |   | 100,6 |   | 103,2 |   |
| Estonia                                          | 69,8  |   | 73,8  |   | 73,2  |   | 71,7  |   | 72,8  |   | 73,1  |   | 74,6  |   | 74,4  |   | 72,8  |   | 75,1  |   |
| Ireland                                          | 121,1 |   | 126,5 |   | 124,3 |   | 118   |   | 118,9 |   | 117,9 |   | 120,6 |   | 122,9 |   | 120,6 |   | 124,4 |   |
| Greece                                           | 88,6  |   | 90,6  |   | 94,1  |   | 95,8  |   | 95,7  |   | 93,1  |   | 89,8  |   | 85,2  |   | 82,9  |   | 84,3  |   |

---
## Dataset Food_price_monitoring_tool with only beer price indice (2011-2018)
This dataset uses Harmonised index of consumer prices. Average in Europe is therefore 100. There is value by every month in the different european contries from January 2013 (2013M1) until December 2015 (2015M12).

**Join based on the name of the country**

> Pretty good, however does not include the whole time period. If used, we would need to only use the year 2014 (it would IMHO make no sense to create the visualization along the time if we would only include 2 years). Otherwise we would only pick one priceline and neglect the change between the years.

| GEO/TIME                                         | 2013M01 | 2013M02 | 2013M03 | 2013M04 | 2013M05 | 2013M06 | 2013M07 | 2013M08 | 2013M09 | 2013M10 | 2013M11 |
|--------------------------------------------------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|
| Belgium                                          | 90,30   | 91,60   | 92,47   | 92,07   | 91,89   | 92,04   | 92,03   | 92,10   | 92,85   | 92,70   | 93,64   |
| Bulgaria                                         | 94,54   | 95,23   | 95,98   | 95,64   | 96,69   | 96,51   | 96,86   | 96,87   | 96,52   | 97,52   | 98,16   |
| Czechia                                          | 99,6    | 98,1    | 98,8    | 100,1   | 99,0    | 98,1    | 98,3    | 97,5    | 96,5    | 98,9    | 98,0    |
| Denmark                                          | 108,1   | 107,7   | 107,9   | 109,5   | 111,3   | 111,1   | 110,0   | 109,2   | 108,6   | 106,2   | 108,8   |
| Germany (until 1990 former territory of the FRG) | 93,8    | 94,8    | 94,6    | 95,1    | 95,2    | 94,7    | 94,8    | 94,2    | 94,9    | 95,8    | 96,9    |
| Estonia                                          | 91,39   | 91,85   | 92,22   | 92,56   | 93,13   | 90,46   | 92,19   | 93,48   | 92,22   | 92,33   | 91,28   |
| Ireland                                          | 100,1   | 101,3   | 99,5    | 99,6    | 97,4    | 97,6    | 100,2   | 99,5    | 100,6   | 99,5    | 101,1   |
| Greece                                           | 104,66  | 105,84  | 104,01  | 105,03  | 102,84  | 100,06  | 99,44   | 98,75   | 98,62   | 98,97   | 98,21   |
| Spain                                            | 97,04   | 97,25   | 97,05   | 96,79   | 96,51   | 96,69   | 95,96   | 96,30   | 96,27   | 97,11   | 97,39   |
| France                                           | 96,85   | 99,89   | 100,98  | 101,12  | 101,13  | 101,26  | 101,28  | 101,19  | 101,54  | 101,37  | 101,72  |
| Croatia                                          | 91,54   | 93,34   | 93,86   | 94,20   | 94,01   | 94,12   | 94,50   | 94,71   | 95,29   | 95,94   | 96,13   |

### Dataset cost-of-living-2016
Found on [Kaggle](https://www.kaggle.com/andytran11996/cost-of-living/version/3). 

This dataset shows cost-of-living in different cities around the world. Hope it includes all the european countries.

> Contains city and country. Are all of the cities found in the main dataset covered?

| City                    | Country                | Cost.of.Living.Index | Rent.Index | Cost.of.Living.Plus.Rent.Index | Groceries.Index | Restaurant.Price.Index | Local.Purchasing.Power.Index | Milk(regular)(1 liter) | Monthly.Pass | Apartment(1.bedroom).in.City.Centre | Internet(10 Mbps, Unlimited Data, Cable/ADSL) | Cappuccino(regular) | Water(0.33 liter bottle) | Eggs(12) | Water(1.5 liter bottle) | Domestic Beer (0.5 liter bottle) | One-way Ticket (Local Transport) | Basic (Electricity, Heating, Water, Garbage) for 85m2 Apartment | Cinema, International Release, 1 Seat | Apples (1kg) |
|-------------------------|------------------------|----------------------|------------|--------------------------------|-----------------|------------------------|------------------------------|------------------------|--------------|-------------------------------------|-----------------------------------------------|---------------------|--------------------------|----------|-------------------------|----------------------------------|----------------------------------|-----------------------------------------------------------------|---------------------------------------|--------------|
| Aachen                  | Germany                | 62.14                | 22.3       | 43.38                          | 52.39           | 56.62                  | 153.14                       | 0.71                   | 55.8         | 509.62                              | 29.33                                         | 2.55                | 1.67                     | 1.38     | 0.66                    | 1.00                             | 2.93                             | 169.11                                                          | 8.93                                  | 2.05         |
| Aalborg                 | Denmark                | 81.71                | 23.53      | 54.31                          | 63.84           | 95.81                  | 118.42                       | 0.94                   | 57.64        | 618.33                              | 30.7                                          | 4.16                | 2.05                     | 3.35     | 1.43                    | 2.05                             | 3.3                              | 176.8                                                           | 14.99                                 | 2.29         |
| Aberdeen                | United Kingdom         | 82.12                | 33.49      | 59.22                          | 62.94           | 97.71                  | 124.41                       | 1.3                    | 78.64        | 871.27                              | 29.95                                         | 3.58                | 1.18                     | 2.76     | 1.83                    | 2.15                             | 3.41                             | 307.68                                                          | 13.11                                 | 2.79         |
| Abu Dhabi               | United Arab Emirates   | 62.74                | 69.91      | 66.12                          | 53.59           | 61.65                  | 134.74                       | 1.76                   | 21.78        | 1868.95                             | 87.22                                         | 4.57                | 0.32                     | 2.69     | 0.65                    | 2.42                             | 0.54                             | 78.84                                                           | 9.53                                  | 2.35         |
| Accra                   | Ghana                  | 64.16                | 46.19      | 55.7                           | 59.38           | 49.11                  | 15.31                        | 2.39                   | 200          | 1041.59                             | 57.78                                         | 2.52                | 1.05                     | 2.41     | 0.72                    | 1.95                             | 0.84                             | 64.59                                                           | 7.33                                  | 2.88         |
| Ad Dammam               | Saudi Arabia           | 67.75                | 13.5       | 42.21                          | 79.66           | 34.24                  | 108.9                        | 1.28                   | 50.67        | 333.34                              | 50.67                                         | 2.58                | 0.24                     | 2.8      | 0.53                    | NA                               | 0.8                              | 36.21                                                           | 13.33                                 | 1.9          |
| Addis Ababa             | Ethiopia               | 45.17                | 21.85      | 34.19                          | 37.27           | 23.8                   | 17.63                        | 1                      | 10           | 215.5                               | 197.71                                        | 0.81                | 0.54                     | 2.02     | 0.84                    | 0.97                             | 0.25                             | 15.68                                                           | 2.75                                  | 4.83         |
| Adelaide                | Australia              | 79.34                | 33.66      | 57.83                          | 74              | 78.34                  | 137.87                       | 1.08                   | 90.14        | 988.98                              | 47.48                                         | 3.14                | 1.84                     | 3.61     | 1.77                    | 3.79                             | 3.01                             | 154.08                                                          | 14.11                                 | 2.96         |
| Ahmedabad               | India                  | 23.99                | 5.32       | 15.2                           | 24.59           | 15.88                  | 72.71                        | 0.7                    | 7.08         | 125.92                              | 17.31                                         | 1.3                 | 0.2                      | 0.92     | 0.42                    | 1.96                             | 0.3                              | 45.29                                                           | 2.98                                  | 1.82         |
| Akron                   | OH                     | 86.83                | 21.98      | 56.3                           | 94.44           | 74.23                  | 82.19                        | 0.83                   | 47.5         | 666.67                              | 40                                            | 3.12                | 1.17                     | 3.03     | 1.47                    | 2.75                             | 1.25                             | 226.67                                                          | 10.00                                 | 6.09         |
| Al Khobar               | Saudi Arabia           | 47.54                | 15.95      | 32.67                          | 40.29           | 33.96                  | 279.02                       | 1.17                   | 53.34        | 430.01                              | 34.23                                         | 2.87                | 0.27                     | 1.78     | 0.53                    | NA                               | 0.67                             | 41.74                                                           | 9.33                                  | 1.73         |
| Albany                  | NY                     | 82.22                | 33.3       | 59.19                          | 88.75           | 73.91                  | 158.04                       | 0.8                    | 65           | 950.42                              | 63.17                                         | 4.03                | 1.57                     | 2.71     | 1.51                    | 2.33                             | 1.5                              | 178.27                                                          | 12.75                                 | 5.28         |
| Albuquerque             | NM                     | 64.46                | 25.22      | 45.98                          | 61.95           | 68.67                  | 138.87                       | 0.78                   | 30           | 754.17                              | 47.93                                         | 3.89                | 1.23                     | 2.47     | 1.55                    | 2.83                             | 1                                | 142.51                                                          | 11.00                                 | 2.71         |
| Alessandria             | Italy                  | 85.32                | 9.01       | 49.39                          | 78.69           | 76.42                  | 119.38                       | 0.81                   | 44.08        | 223.19                              | 30.13                                         | 1.38                | 1.12                     | 2.79     | 0.42                    | 0.78                             | 1.67                             | 214.82                                                          | 8.93                                  | 1.67         |
| Algiers                 | Algeria                | 33.92                | 10.12      | 22.71                          | 34.02           | 26.54                  | 41.82                        | 0.25                   | 10.97        | 262.01                              | 35.64                                         | 1.14                | 0.21                     | 1.13     | 0.27                    | 1.48                             | 0.27                             | 32.3                                                            | 4.57                                  | 1.59         |
| Alicante                | Spain                  | 57.09                | 15.7       | 37.6                           | 43.99           | 49.6                   | 85.68                        | 0.9                    | 36.16        | 502.18                              | 38.92                                         | 1.69                | 1.33                     | 1.56     | 0.48                    | 0.69                             | 1.62                             | 113.23                                                          | 8.93                                  | 1.17         |

## Datasets from Geonames
All datasets can be accessed at [https://download.geonames.org/export/dump/](https://download.geonames.org/export/dump/).
### countryInfo.txt
[https://download.geonames.org/export/dump/countryInfo.txt](https://download.geonames.org/export/dump/countryInfo.txt)

Contains mapping between ISO (CZ) / ISO3 (CZE) and the country name, area, population, currency etc. Is only available for 2019. We could also use information about the neighbour countries, and the currency. 

| ISO | ISO3 | ISO-Numeric | fips | Country | Capital | Area(in sq km) | Population | Continent | tld | CurrencyCode | CurrencyName | Phone | Postal Code Format | Postal Code Regex | Languages | geonameid | neighbours | EquivalentFipsCode |  |
|-----|------|-------------|------|---------|------------------------|----------------|------------|-----------|-----|--------------|--------------|----------|--------------------|-------------------|-------------------|---------------------------------------|------------|-------------------------|---|
| 124 | KY | CYM | 136 | CJ | Cayman Islands | George Town | 262.0 | 44270 |  | .ky | KYD | Dollar | +1-345 |  |  | en-KY | 3580718 |  |  |
| 248 | ZM | ZMB | 894 | ZA | Zambia | Lusaka | 752614.0 | 13460305 | AF | .zm | ZMW | Kwacha | 260 | ##### | ^(\d{5})$ | en-ZM,bem,loz,lun,lue,ny,toi | 895949 | ZW,TZ,MZ,CD,NA,MW,AO |  |
| 83 | GL | GRL | 304 | GL | Greenland | Nuuk | 2166086.0 | 56375 |  | .gl | DKK | Krone | 299 | #### | ^(\d{4})$ | kl,da-GL,en | 3425505 |  |  |
| 186 | PY | PRY | 600 | PA | Paraguay | Asuncion | 406750.0 | 6375830 | SA | .py | PYG | Guarani | 595 | #### | ^(\d{4})$ | es-PY,gn | 3437598 | BO,BR,AR |  |
| 202 | SJ | SJM | 744 | SV | Svalbard and Jan Mayen | Longyearbyen | 62049.0 | 2550 | EU | .sj | NOK | Krone | 47 | #### | ^(\d{4})$ | no,ru | 607072 |  |  |
| 72 | FM | FSM | 583 | FM | Micronesia | Palikir | 702.0 | 107708 | OC | .fm | USD | Dollar | 691 | ##### | ^(\d{5})$ | en-FM,chk,pon,yap,kos,uli,woe,nkr,kpg | 2081918 |  |  |
| 225 | TR | TUR | 792 | TU | Turkey | Ankara | 780580.0 | 77804122 | AS | .tr | TRY | Lira | 90 | ##### | ^(\d{5})$ | tr-TR,ku,diq,az,av | 298795 | SY,GE,IQ,IR,GR,AM,AZ,BG |  |

### Cities15000.txt
[https://download.geonames.org/export/dump/cities15000.zip](https://download.geonames.org/export/dump/cities15000.zip)

```
erasmus dataset -> erasmus code (get city name) -> this dataset
```

~~Contains information about the cities - most importantly **coordinates** as well as the country where the country belongs and also the **localized names** of the cities: e.g. localized names for the Prague are *PRG, Praag, Prag, Praga, Pragae, Prago, Prague, Praha* and so on. We could calculate the distances between the cities from the coordinates easily. I don't think that we will find a dataset of precalculated distances between cities as that would be 15000^2 = 225mil records.~~

EDIT: The same information is inside the allCountries dataset which is bigger and therefore contains more cities.
| | | | | | | | | | | | | | | | | | | | |
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|  3924 | 2037712 | Dehui              | Dehui              | Chang-chia-wan,Dehui,Te-hui,Te-hui-chen,Tszhantszyavan',Tszhantszyavan’,Yao-men                                                                    |  44.5333 | 125.7     | P   | PPL   | CN  | nan | 05   | nan  | nan     |  nan | 108818 |  nan |  180 | Asia/Shanghai        | 2012-01-18 |
| 19390 | 1610505 | Kaeng Khro         | Kaeng Khro         | Amphoe Kaeng Khlo,Amphoe Kaeng Khro,Kaeng Khlo,Kaeng Khro,แก้งคร้อ               |  16.1086 | 102.258   | P   | PPLA2 | TH  | nan | 26   | nan  | nan     |  nan |  29056 |  nan |  205 | Asia/Bangkok         | 2012-01-16 |
|  7603 | 2635785 | Tipton             | Tipton             | typtwn,تیپتون                                                                    |  52.5296 |  -2.06773 | P   | PPL   | GB  | nan | ENG  | L7   | 41UF    |  nan |  47000 |  nan |  144 | Europe/London        | 2012-03-29 |
| 10873 | 1270291 | Harpālpur          | Harpalpur          | Harpalpur,Harpālpur                                                                 |  25.2877 |  79.3328  | P   | PPL   | IN  | nan | 35   | 425  | nan     |  nan |  17731 |  nan |  214 | Asia/Kolkata         | 2014-10-14 |
| 19068 | 3583158 | Sensuntepeque      | Sensuntepeque      | Sensuntepeque,Sensuntepque,Sensutepeke,Сенсутепеке                                             |  13.8667 | -88.6333  | P   | PPLA  | SV  | nan | 02   | nan  | nan     |  nan |  20386 |  nan |  734 | America/El_Salvador  | 2012-01-14 |
| 20071 |  154097 | Mgandu             | Mgandu             | Mgandu          |  -5.95   |  34.1333  | P   | PPL   | TZ  | nan | 16   | 1303 | 1303171 |  nan |  23718 |  nan | 1486 | Africa/Dar_es_Salaam | 2016-07-26 |
| 21819 | 4890507 | East Garfield Park | East Garfield Park | nan                                                                                  |  41.8809 | -87.7028  | P   | PPLX  | US  | nan | IL   | 031  | 14000   |  nan |  20656 |  182 |  183 | America/Chicago      | 2017-12-13 |

### allCountries.txt
[https://download.geonames.org/export/dump/allCountries.zip](https://download.geonames.org/export/dump/allCountries.zip)

1.6GB daraser containing 12M rows. I extracted only the rows conatining the countries from Europe (which is pretty wide term tho, it's not only EU). The size is reduced to 300MB. 

|         |   geonameid | name                | asciiname           | alternatenames                                  |   latitude |   longitude | feature class   | feature code   | country code   | cc2   |   admin1 code |   admin2 code |   admin3 code |     admin4 code |   population |   elevation |   dem | timezone        | modification date   |
|--------:|------------:|:--------------------|:--------------------|:------------------------------------------------|-----------:|------------:|:----------------|:---------------|:---------------|:------|--------------:|--------------:|--------------:|----------------:|-------------:|------------:|------:|:----------------|:--------------------|
| 2363976 |      320711 | Gökyar Burnu        | Gokyar Burnu        | Boz Burun,Gokyar Burnu,Gökyar Burnu,Skizo Point |    36.8123 |    28.4613  | T               | PT             | TR             | nan   |            48 |           nan |           nan |   nan           |            0 |         nan | -9999 | Europe/Istanbul | 2019-01-14          |
| 2101867 |      569859 | Chashchinskiy       | Chashchinskiy       | nan                                             |    58.9139 |    49.4267  | P               | PPL            | RU             | nan   |            33 |           nan |           nan |   nan           |            0 |         nan |   177 | Europe/Kirov    | 2007-05-30          |
|  410672 |     2907743 | Heidkaten           | Heidkaten           | nan                                             |    53.9667 |    10.2333  | S               | FRM            | DE             | nan   |            10 |             0 |          1060 |     1.06009e+06 |            0 |         nan |    38 | Europe/Berlin   | 2015-09-04          |
| 1857455 |    11844412 | Rødvet Sykehjem     | Rodvet Sykehjem     | Rodvet Sykehjem,Rødvet Sykehjem                 |    59.9546 |    10.8658  | P               | PPL            | NO             | nan   |            12 |           301 |           nan |   nan           |            0 |         nan |   172 | Europe/Oslo     | 2018-05-11          |
|   26454 |     2766166 | Schalzbachvorsäß    | Schalzbachvorsass   | Schalzbach,Schalzbachvorsass,Schalzbachvorsäß   |    47.2936 |    10.0375  | P               | PPL            | AT             | AT    |             9 |           nan |           nan |   nan           |            0 |         nan |  1077 | Europe/Vienna   | 2012-01-18          |
| 1297058 |     3213954 | Sletta              | Sletta              | nan                                             |    69.5667 |    19.15    | S               | FRM            | NO             | nan   |            18 |          1902 |           nan |   nan           |            0 |         nan |     2 | Europe/Oslo     | 2010-10-15          |
|  741645 |     3008811 | La Haie de Ligné    | La Haie de Ligne    | La Haie,La Haie de Ligne,La Haie de Ligné       |    47.3984 |    -1.40476 | P               | PPL            | FR             | nan   |            52 |            44 |           445 | 44082           |            0 |         nan |    38 | Europe/Paris    | 2019-03-26          |
|  485922 |     8394446 | Heilig-Geist-Spital | Heilig-Geist-Spital | nan                                             |    48.3603 |    10.9033  | S               | BLDG           | DE             | nan   |             2 |            97 |          9761 |     9.761e+06   |            0 |         nan |   491 | Europe/Berlin   | 2013-02-19          |
| 1708312 |     9646370 | Flyi                | Flyi                | Flyi                                            |    61.5598 |     9.17281 | T               | HLL            | NO             | nan   |            11 |           515 |           nan |   nan           |            0 |         nan |  1056 | Europe/Oslo     | 2014-10-08          |
| 1932534 |     2734671 | Santa Marta         | Santa Marta         | nan                                             |    41.6075 |    -8.41815 | P               | PPL            | PT             | nan   |             4 |           301 |         30113 |   nan           |            0 |         nan |    62 | Europe/Lisbon   | 2011-08-28          |
