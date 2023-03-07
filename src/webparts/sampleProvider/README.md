# Sample Provider
## Summary

This webpart can serve as a sample provider. Click on donut chart to filter US county polygons on the map.

![App](./sampleProvider.gif)


## Sample dataset
1. state samples
```
{
    "sampleStates": [
        {
            "name": "Alabama",
            "value": 3
        },
        {
            "name": "Florida",
            "value": 2
        },
        {
            "name": "Louisiana",
            "value": 2
        },
        {
            "name": "Texas",
            "value": 2
        },
        {
            "name": "Mississippi",
            "value": 1
        }
    ]
}
```
2. layer in map
USA Census State - https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Census_States/FeatureServer



## Steps

1. Add ArcGIS map web part to SharePoint page;

2. Add the above "USA Census State" hosted feature layer from ArcGIS to the map;

3. Add the SampleProvider web part to the same SharePoint page;

4. Configure the connection:

     4.1. In the Map web part edit pane, turn on "Connect Web parts" and then click on "Add connection";

     4.2. Choose "SampleProvider" web part as the Web part source;

     4.3. Choose "USA Census State" as Map Layer;

     4.4. Choose "State Name" as the connecting field;

  ![](./editpane.png)

5. Click on a slice of the donut chart and see the state layer gets filtered.
