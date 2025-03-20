require([
    "esri/config", 
    "esri/Map", 
    "esri/views/MapView", 
    "esri/layers/GraphicsLayer", 
    "esri/geometry/Point", 
    "esri/geometry/Polyline", 
    "esri/geometry/Polygon", 
    "esri/Graphic",
    "esri/widgets/Sketch" // Ajout du module Sketch
  ], function(esriConfig, Map, MapView, GraphicsLayer, Point, Polyline, Polygon, Graphic, Sketch) {
  
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
      // Ajout du GraphicsLayer
  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);
// Création d'un point
const point = new Point({
    longitude: -7.62,
    latitude: 33.59
  });

  // Définition du symbole
  let symbol = {
    type: "simple-marker", // Utilisation de SimpleMarkerSymbol
    style: "diamond",
    color: "blue",
    size: "15px", // Taille en pixels
    outline: { 
      color: [255, 255, 0], // Couleur jaune
      width: 3 // Largeur du contour
    }
  };

  // Création du graphique et ajout au GraphicsLayer
  const pointGraphic = new Graphic({
    geometry: point,
    symbol: symbol
  });

  graphicsLayer.add(pointGraphic);


// Définition de la polyligne
const polyline = new Polyline({
    paths: [
      [-7.66, 33.54], // Longitude, latitude
      [-7.64, 33.56], // Longitude, latitude
      [-7.57, 33.58]  // Longitude, latitude
    ]
  });

  // Définition du symbole de la ligne
  const simpleLineSymbol = {
    type: "simple-line",
    color: "blue", // Couleur de la ligne
    width: 2
  };

  // Création du graphique et ajout au GraphicsLayer
  const lineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol
  });

  graphicsLayer.add(lineGraphic);
    // Définition du polygone
    const polygon = new Polygon({
        rings: [
          [-7.51, 33.61], // Longitude, latitude
          [-7.47, 33.64], // Longitude, latitude
          [-7.45, 33.61], // Longitude, latitude
          [-7.48, 33.60], // Longitude, latitude
          [-7.51, 33.61]  // Fermeture du polygone
        ]
      });
    
      // Définition du style de remplissage
      const simpleFillSymbol = {
        type: "simple-fill",
        color: [0, 0, 255, 0.8], // Bleu avec 80% d'opacité
        outline: {
          color: [255, 255, 255], // Contour blanc
          width: 1
        }
      };
    
      // Création du graphique et ajout au GraphicsLayer
      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol
      });
    
      graphicsLayer.add(polygonGraphic);
    
   // Ajout du widget Sketch
   let sketch = new Sketch({
    layer: graphicsLayer,
    view: view
  });

  // Positionner Sketch en haut à gauche
  view.ui.add(sketch, "top-left");

});





