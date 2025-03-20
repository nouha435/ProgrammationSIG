
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer","esri/widgets/BasemapToggle" // Ajout du module Sketch
     // Ajout du module Sketch
], function (esriConfig, Map, MapView, FeatureLayer,BasemapToggle) {
 
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
    let basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "hybrid",
    });
    view.ui.add(basemapToggle, "bottom-right");
 
    const featureLayer = new FeatureLayer({
 
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/Communes/FeatureServer"
 
    });
    map.add(featureLayer);
 
    const populationlayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/casa_population1/FeatureServer",
    });
    map.add(populationlayer);
 
    const sqlQueries = ["-- Critère de recherche --", " PREFECTURE='PREFECTURE DE CASABLANCA'", "COMMUNE_AR='MUNICIPALITE BOUSKOURA'", "PLAN_AMENA='PA ENQUETE PUBLIQUE'", "Shape_Area>40000000", "PREFECTURE='PROVINCE DE NOUACEUR' and PLAN_AMENA='PA ENQUETE PUBLIQUE'" ];
    let whereClause =sqlQueries[0]; // Valeur par défaut
 
 
 
 
     
  // Création du menu déroulant (Select)
  const select = document.createElement("select");
  select.style.position = "absolute";
  select.style.top = "10px";
  select.style.right = "10px";
  select.style.padding = "5px";
 
  sqlQueries.forEach(query => {
      let option = document.createElement("option");
      option.value = query;
      option.innerHTML = query;
      select.appendChild(option);
  });
 
  document.body.appendChild(select);
 
  // Fonction pour exécuter la requête SQL
  function queryFeatureLayer(extent) {
      const parcelQuery = {
          where: whereClause,  // Défini par le select
          geometry: extent,     // Restreint à l'étendue visible de la carte
          outFields: ["PREFECTURE", "COMMUNE_AR", "PLAN_AMENA", "Shape_Area"],
         
          returnGeometry: true
      };
 
      featureLayer.queryFeatures(parcelQuery)
          .then((results) => {
              displayResults(results);
          })
          .catch((error) => {
              console.log(error);
          });
  }
 
  // Fonction pour afficher les résultats
  function displayResults(results) {
      // Style des polygones
      const symbol = {
          type: "simple-fill",
          color: [226, 135, 67],
          outline: { color: "black", width: 1 }
      };
 
      const popupTemplate = {
          title: "Commune {COMMUNE_AR}",
          content: "Préfecture : {PREFECTURE} <br> Plan d'Aménagement : {PLAN_AMENA} <br> Surface : {Shape_Area}"
      };
 
      // Appliquer le style et la popup aux entités retournées
      results.features.map((feature) => {
          feature.symbol = symbol;
          feature.popupTemplate = popupTemplate;
          return feature;
      });
 
      // Nettoyage avant d'afficher les nouveaux résultats
      view.popup.close();
      view.graphics.removeAll();
      view.graphics.addMany(results.features);
  }
 
  // Écouteur d'événements pour changer le filtre
  select.addEventListener('change', (event) => {
      whereClause = event.target.value;
      queryFeatureLayer(view.extent);
  });
 
});