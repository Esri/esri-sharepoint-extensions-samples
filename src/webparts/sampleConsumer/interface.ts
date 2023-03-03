/*
 Copyright 2023 ESRI

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

export interface ArcGISSelectionData<T=any> {

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

// This interface is based on sample data for this demo, update the interface to your layer return
export interface SalesData {
    Title: string;
    JanuarySales: number;
    FebruarySales: number;
    MarchSales: number;
    AprilSales: number;
    MaySales: number;
    JuneSales: number;
    JulySales: number;
    AugustSales: number;
    SeptemberSales: number;
    OctoberSales: number;
    NovemberSales: number;
    DecemberSales: number;
    TotalSales: number;
}