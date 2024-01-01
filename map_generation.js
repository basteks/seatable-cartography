/*
 title: 'Cartography',
 description: 'A script that allows you to visualize your records on a map',
 author: Benjamin Hatton 
*/

//// Script configuration ////
// Map URL
const mapURL = "https://basteks.github.io/basemap.html";
// Current location : Would you like to display your current location on the map ?
const curPos = false;
// Table name
const tableStr = "Table1";
// View Name
const viewStr = "Default View";
// Latitude column name (must be a number-type column !)
const latStr = "Lat";
// Longitude column name (must be a number-type column !)
const lonStr = "Lon"
// Title : the column containing the title of each marker's popup
const titleStr = "Ville";
// Grouping : Would you like to group your records by the title field ?
const group = true;
// Popup content : the text to display in the popup for each record (you can use column names between curly brackets, for example {Name})
// Let this string empty if you don't whant to display anything else than the title
const popupContent = "{Name}";

//// Script run ////
const table = base.getTableByName(tableStr);
if (table) {
	const view = base.getViewByName(table, viewStr);
	const lat = base.getColumnByName(table, latStr);
	const lon = base.getColumnByName(table, lonStr);
    const title = base.getColumnByName(table, titleStr);
	if (view && lat && lon && title) {
        const mapTitle = encodeURI(table.name);

		function getFieldsFromPopupContent() {
            if (popupContent != "") {
			var tmpStr  = popupContent.split('{');
			var arrStr=[];
			for(var i=0; i<tmpStr.length; i++) {
				if (tmpStr[i].indexOf('}')>-1) {
					arrStr.push(tmpStr[i].split('}')[0]);
				}
			}
			for(var i=0; i<arrStr.length; i++) {
				try {
					let field = base.getColumnByName(table, arrStr[i]);
					fields.push(field);
				}
				catch {
					output.markdown("**⚠ Error while getting the "+arrStr[i]+" field**");
				}
			}
			if(fields.length==arrStr.length && fields.length>0) {
				return true;
			}
			else {
				return false;
			}
            }
          else { return true; }
		}

		function replaceWithFieldNames(record, template) {
            var arrStr=[];
			var tmpStr  = template.split('{');
			for(var i=0; i<tmpStr.length; i++) {
				if (tmpStr[i].indexOf('}')>-1) {
					arrStr.push(tmpStr[i].split('}')[0]);
				}
			}
			let str = template;
			for(var i=0; i<arrStr.length; i++) {
				str = str.replace('{'+arrStr[i]+'}',record[arrStr[i]].trim());
			}
			return str;
		}

		function find(mtitle) {
			var res = -1;
			for (let i=0;i<markers.length;i++) {
				let marker = markers[i];
				if (marker['title'] == mtitle) {
					res = markers.indexOf(marker);
					break;
				}
			}
			return res;
		};

		if (lat.type != 'number' || lon.type != 'number') {
			output.markdown("**⚠ the latitude field and/or the longitude field are not of _number_ type! Please modify them or choose other number type fields**");
		}
		else {
			var fields=[];
			if(!getFieldsFromPopupContent()) {
				output.markdown("**⚠ Error while trying to get the columns from your Popup Content. Please set it again !**")
			}
            else {
             let queryResult = base.getRows(table, view);

			var markers=[];

			for (let record of queryResult) {
				let dataStr = replaceWithFieldNames(record,popupContent);
				if (group) {
					if (record[title.name]!=""){
						if (find(record[title.name])>=0) {
							markers[find(record[title.name])].content.push(dataStr);
						}
						else {
							markers.push({"title": record[title.name], "lat" : record[lat.name], "lon" : record[lon.name],"content" : [dataStr]})
						}
					}
				}
				else {
					markers.push({"title": record[title.name], "lat" : record[lat.name], "lon" : record[lon.name],"content" : [dataStr]})
				}
			}
			var markersStr='';
			for (let i=0;i<markers.length; i++) {
				let marker = markers[i];
				if (markersStr!='') { markersStr+=';'}
				var listeData="";
				for (let j=0;j<marker.content.length;j++) {
					if (listeData!='') { listeData+=',';}
					listeData += marker.content[j];
				}
				markersStr+= encodeURI(marker["title"]+','+marker["lat"]+","+marker["lon"]+","+listeData)
			}
			if (curPos) {
				output.markdown("[Clic on this link to see the map]("+mapURL+"?t="+mapTitle+"?p=true?mrks="+markersStr+")");
			}
			else {
				output.markdown("[Clic on this link to see the map]("+mapURL+"?t="+mapTitle+"?mrks="+markersStr+")");
			}
			/*let displayMarkers = await input.buttonsAsync("Would you like to display the markers' data?", ['Yes', 'No']);
			if (displayMarkers == 'Yes') {
				output.markdown("**List of the markers on the map**:");
				//output.table(markers);
			}*/
			output.markdown("_Script completed successfully_");
            }
		}
		
	}
    else {
       if(!view) { output.markdown("⚠ Can't find the view! Please check view's name"); } 
       if(!lat) { output.markdown("⚠ Can't find the latitude column! Please check the name"); } 
       if(!lon) { output.markdown("⚠ Can't find the longitude column! Please check the name"); }
       if(!title) { output.markdown("⚠ Can't find then title column! Please check the name"); } 
    }
} else { output.markdown("⚠ Can't find table! Please check table's name"); }
