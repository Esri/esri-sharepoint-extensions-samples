# esri-sharepoint-extensions-samples

Samples around ArcGIS map web part to demonstrate different capabilities and possibilities on the dynamic web part connectivity feature. Each sample has it's own dedicated readme file to explain setup instructions and demonstrated capability.

If you are first time user, please refer to the [instructions](../../#instructions) section. All samples share the same installation process. Once installation is completed, all sample web parts will be available within SharePoint pages.

You can head directly to the folders below and start looking around if you'd like.

If you are interested in the current supported data format, please refer to [Current Structure](../../#current-structure) section

![App](./arcgis-sharepoint-extensions.gif)

## Features

* [Sample consumer](./src/webparts/sampleConsumer)
* [Sample provider](./src/webparts/sampleProvider)
* [Search sample provider](./src/webparts/searchSampleProvider)

## Instructions

* clone this repo
* move to right folder
* in the command line run:
  * `npm install`
  * `gulp bundle --ship`
  * `gulp package-solution --ship`
* from the `sharepoint/solution` folder, deploy the `.sppkg` file to the App catalog in your tenant
* in the site where you want to test this solution
  * add the app named _arc-gis-spfx-examples_
  * edit a page
  * You should be able to see all the web parts samples available in your page

### Current Structure

#### Standard for sending data to ArcGIS map web part

#### Detail message requirement (what you can send)

```
interface PublishedDataToEsriMapWebPart {
  // strings for constructing where clause to filter feature layer features on Esri Map Web Part side
  filterText?: string[];
  // ... more to come
}
```

##### Provider property requirement (how to establish connection and send data)

```
// Please make sure the data from your web part is published through this property id.
const SourcePropertyId = "esri-dynamic-data";
// Data store for your message
private currentMessage:  PublishedDataToEsriMapWebPart = undefined;

public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
  return [
    { id: SourcePropertyId, title: 'ArcGIS Dynamic data' }
  ];
}

public async onInit(): Promise<void> {
  // this line below is important! This enables this web part as a publisher for dynamic data.
  this.context.dynamicDataSourceManager.initializeSource(this);
  return super.onInit();
}

private _onPropertyChanged = (input:  PublishedDataToEsriMapWebPart): void => {
  this.currentMessage = input;
  // notify subscribers that the selected event has changed
  this.context.dynamicDataSourceManager.notifyPropertyChanged(SourcePropertyId);
  this.render();
}

public getPropertyValue(propertyId: string) {
  switch (propertyId) {
    case SourcePropertyId:
      return this.currentMessage;
    }
    throw new Error('Bad property id');
}
```

##### Notify SPFx page context with your message update when needed

```
private _onPropertyChanged = (input:  PublishedDataToEsriMapWebPart): void => {
  this.currentMessage = input;
  // notify subscribers that the selected event has changed
  this.context.dynamicDataSourceManager.notifyPropertyChanged(SourcePropertyId);
  this.render();
}

this._onPropertyChanged(newValue);

```

#### Standard for receiving data from ArcGIS map web part 

##### Available dynamic data property Id definitions (what you can receive)

```
// use this.context.dynamicDataProvider.getAvailableSources() to fetch DynamicDataProvider
DynamicDataProvider.getPropertyDefinitions()
// Expected result:
//[
//  { id: 'esri-dynamic-data-updates', title: 'Generic property id for all properties changes.' },
//  { id: 'layer-selection', title: 'Information about selected features and the corresponding layer.' },
//  { id: 'layer-filter', title: 'Information about filtered features and the corresponding layers.' }
//]

```

##### How to set up connection to receive data

```
// This is an example for layer selection event
// use this.context.dynamicDataProvider.getAvailableSources() to fetch <ESRI_MAP_WEB_PART_INSTANCE_ID>
const DynamicDataPropertyId = "layer-selection" 
// change DynamicDataPropertyId to 'layer-filter' for filter info, change to 'esri-dynamic-data-updates' to receive both event

this.context.dynamicDataProvider.registerPropertyChanged(<ESRI_MAP_WEB_PART_INSTANCE_ID>, DynamicDataPropertyId, async ()=>{
    const selectionInfo: ArcGISSelectionData = await mapWebPartSource.getPropertyValueAsync(DynamicDataPropertyId);
    // write your own code to work with selectionInfo
});
```

##### Expected message format ('layer-selection' example)

````
interface ArcGISSelectionData<T = any> {
    // layerInfo contains all the layer related metadata based on the selection
    layerInfo: LayerInfo;
    // SelectedItems contains all the features attributes based on the selection
    selectedItems: Item<T>[];
}

interface LayerInfo {
    // layerSource provides the data source type of the layer
    layerSource: "Sharepoint" | "ArcGIS";
    // spListInfo (optional): contains all the list related metadata is the layer is created from a SharePoint list
    spListInfo?: SPListInfo;
    geometryType: "point" | "polyline" | "polygon";
    title?: string;
    // layerUrl (optional): provides the layer url for ArcGIS layers
    layerUrl?: string;
}

export interface SPListInfo {
    webId: string;
    listId: string;
    viewId: string;
}

interface Item<T = any> {
    // listItemID (optional): contains the item index for the feature in SharePoint list
    listItemID?: string;
    attributes: T;
}
````
## Requirements

* Notepad or your favorite HTML editor
* Web browser with access to the Internet
* Access to Microsoft SharePoint
* Access to ArcGIS for SharePoint product

## Resources

* [ArcGIS for SharePoint Documentation](https://doc.arcgis.com/en/sharepoint/latest/use-maps/get-started-with-arcgis-maps.htm)
* [ArcGIS for SharePoint Blog](https://www.esri.com/arcgis-blog/?s=#&products=esri-maps-sharepoint)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2023 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( ./license.txt) file.
