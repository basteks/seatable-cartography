# SeaTable Cartography

A [SeaTable script](https://developer.seatable.io/scripts/) that allows you to display your GPS coordinates as markers on a map.

## Usage
- the content of the cartography-seatable.js file needs to be copied in a [new JavaScript script](https://seatable.io/en/docs/javascript-python/anlegen-und-loeschen-eines-skriptes/) or [imported](https://seatable.io/en/docs/javascript-python/import-und-export-eines-skriptes/), in your Seatable table.
- the content of the html folder needs to be hosted somewhere (you can use [https://basteks.github.io/cartography/basemap.html](https://basteks.github.io/cartography/basemap.html) for testing purpose)

Then, you will have to set the following information in the upper `//// Script configuration ////` part of the script :
- *URL*: URL of the basemap.html file
- *Current location*: Would you like to display your current location on the map ?. The options are "no", "static" (gets current location only once) or "track" (updates the marker each time the current location changes)
- *Table*: the table containing the rows you want to visualize
- *View*: the view containing the rows
- *Latitude*: the latitude column (**number type**)
- *Longitude*: the longitude column (**number type**)
- *Title*: the column containing the title of each marker's popup
- *Grouping*: do you want to group your records by title ? If you do so, a single marker will be shown for every record having the same *title* column, the marker's popup then containing a `<ul></ul>` list of *popup contents* (see bellow) for every row. The options are "yes" or "no"
- *Popup content*: the text to display in the popup for each row. You can create the desired string here, composed of columns' names between curly brackets, for example `{First Name} {Last Name} : {Age}`. You can also let it empty if you don't want to dosplay anything else that the popup's title

## Limitations
As all the displayed data (GPS coordinates and data to display on popup) are passed through the URI of the map, you may encounter a _414 URI Too Long_ error if you try to display too much markers or too much data for each marker on your map.

## ToDo
- Add support for special column rendering like URLs, mails or attachment by creating an html `href` link, or images
- Convert this script to a proper plugin in order to avoid the basemap.html file hosting and to get rid of the potential _414 URI Too Long_ error

## Credits
Based on the great [Leaflet](https://leafletjs.com/) JavaScript library for interactive maps, and on the [leaflet-color-markers](https://github.com/pointhi/leaflet-color-markers) repo (directly getting images URL from the repo)
