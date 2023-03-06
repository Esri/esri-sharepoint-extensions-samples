# Sample Consumer
## Summary

This web part can serve as a sample consumer to receive data from ArcGIS for SharePoint Map web part and then show quarterly sales bar chart for selected data points on the map.

![App](./sampleConsumer.gif)


## Sample dataset
The source layer data for this sample is a 12-month sales point dataset. It has JanuarySales/FebruarySales/.../NovemberSales/DecemberSales/TotalSales fields.

You can use either a SharePoint list or a public ArcGIS feature layer as the source layer for this sample.

#### Use a SharePointListLayer
- upload the [SampleData.csv](./SampleData.csv) dataset to a SharePoint list
- note: after the dataset is uploaded to SharePoint list, the field's internal names would be changed to field_1/field_2, etc

#### or use public ArcGIS layer
- https://m4ons.maps.arcgis.com/home/item.html?id=1a6ccd9736f44cc78576437b554b1bdb#overview
