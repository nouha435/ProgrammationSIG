require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer", // Importation de GraphicsLayer
    "esri/widgets/Sketch" // Importation correcte de Sketch
], function (esriConfig, Map, MapView, FeatureLayer, GraphicsLayer, Sketch) {

    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurJqJHuAOWtOeDglllaI2VkFwO1rbxtjUrYI3FQtGSrsxxHBIkcC6jL3fHJwtysH3yJWPX9xyvtUM4LJzrp7nUc1H6-CiQkU_BlQ7Y_G6ed9PlJi59BGIYPYaCmJ6wAqVFvePHzOfwe8lBbbplfHipzfKCpaIMFaT5qoSyQB4bGqsXCWZp-Xfbwihbl668Ll9HDZ4N51aqpYczuUn0BqV6m7_fi7HgPorB1CQmtTWxh6zAT1_SmziIOm6";

    const map = new Map({
        basemap: "arcgis-topographic" // Fond de carte
    });

    const view = new MapView({
        map: map,
        center: [-7.62, 33.59], // Longitude, latitude
        zoom: 13, // Niveau de zoom
        container: "viewDiv"
    });

    const commune = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/Communes/FeatureServer"
    });

    map.add(commune);

    // Ajout de la couche graphique
    const maCoucheGraphique = new GraphicsLayer();
    map.add(maCoucheGraphique);

    // Ajout du widget Sketch
    const sketch = new Sketch({
        layer: maCoucheGraphique,
        view: view,
        creationMode: "update"
    });

    view.ui.add(sketch, "top-right");
     // Add sketch events to listen for and execute query
     sketch.on("update", (event) => {
        // Create
        if (event.state === "start") {
            queryFeaturelayer(event.graphics[0].geometry);
        }
        if (event.state === "complete") {
            maCoucheGraphique.remove(event.graphics[0]); // Clear the graphic when a user clicks off of it or sketches new one
        }
        // Change
        if (event.toolEventInfo && (event.toolEventInfo.type === "scale-stop" ||
            event.toolEventInfo.type === "reshape-stop" || event.toolEventInfo.type ===
            "move-stop")) {
            queryFeaturelayer(event.graphics[0].geometry);
        }
    });


    function queryFeaturelayer(geometry) {
        const communeQuery = {
            spatialRelationship: "intersects", // Relationship operation to apply
            geometry: geometry, // The sketch feature geometry
            outFields: ["PREFECTURE", "COMMUNE_AR", "PLAN_AMENA", "Shape_Area"], // Attributes to return
            returnGeometry: true
        };
        commune.queryFeatures(communeQuery).then(function(results)  {
            console.log(results.features)
            displayResults(results);
        });
    }

    



    
    // Show features (graphics)
function displayResults(results) {
// Create a blue polygon
const symbol = {
type: "simple-fill",
color: [ 20, 130, 200, 0.5 ],
outline: {
color: "white",
width: .5
},
};
const popupTemplate = {
title: "Commune {COMMUNE_AR}",
content: "Prefecture : {PREFECTURE} <br> Commune : {COMMUNE_AR} <br> Plan Aménagement : {PLAN_AMENA} <br> Surface : {Shape_Area}"
};
// Set symbol and popup
results.features.map((feature) => {
    feature.symbol = symbol;
    feature.popupTemplate = popupTemplate;
    return feature;
});
}
});
