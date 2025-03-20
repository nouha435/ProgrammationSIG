require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer" // Ajout du module Sketch
], function (esriConfig, Map, MapView, FeatureLayer) {

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
  // Ajout d'une couche FeatureLayer

  const featureLayer = new FeatureLayer({

    url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/Communes/FeatureServer"

  });
  map.add(featureLayer);

  const populationlayer = new FeatureLayer({
    url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/casa_population1/FeatureServer",
  });
  map.add(populationlayer);
 
  const sqlExpressions = ["------Choisir le filtre-----", "TOTAL2004>100000","MÉNAGES200>30000","Shape_Area < 5000000", "PREFECTURE = 'PROVINCE DE MEDIOUNA'", "PLAN_AMENA = 'PA HOMOLOGUE'"];
 
  const selectFilter = document.createElement("select");
  sqlExpressions.forEach(function (sql) {
    let option = document.createElement("option");
    option.value = sql;
    option.innerHTML = sql;
    selectFilter.appendChild(option);
  });
  view.ui.add(selectFilter, "top-right");
  // Server-side filter
  function setFeatureLayerFilter(expression) {
    featureLayer.definitionExpression = expression;
    populationlayer.definitionExpression = expression;
  }

  // Event listener
  selectFilter.addEventListener('change', function (event) {
    setFeatureLayerFilter(event.target.value);
  });

});
