require(["esri/config", "esri/Map", "esri/views/MapView", "esri/widgets/BasemapToggle", "esri/widgets/BasemapGallery", "esri/layers/FeatureLayer","esri/PopupTemplate","esri/widgets/Legend","esri/renderers/PieChartRenderer"],


    function(esriConfig, Map, MapView, BasemapToggle, BasemapGallery, FeatureLayer,PopupTemplate,Legend,PieChartRenderer) {

   

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

 

    // Basemap Toggle

    let basemapToggle = new BasemapToggle({

      view: view,  

      nextBasemap: "hybrid"

    });

    view.ui.add(basemapToggle, "bottom-left");

 

    // Basemap Gallery

    let basemapGallery = new BasemapGallery({

      view: view

    });

    view.ui.add(basemapGallery, {

      position: "top-right"

    });

 

    // Ajout d'une couche FeatureLayer

    const Communes = new FeatureLayer({

      url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/Communes/FeatureServer"

    });

    map.add(Communes);
    
    const Sites = new FeatureLayer({

      url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/sites/FeatureServer"

    });

    map.add(Sites);





  // Rendu pour la population avec symbologie proportionnelle
      
    let popRenderer = {
      type: "simple", // Utilisation de SimpleRenderer
      symbol: {
        type: "simple-marker", // Utilisation de SimpleMarkerSymbol
        size: 6,
        color: "green",
        outline: {
          width: 0.5,
          color: "white"
        }
      }
      
    };
    const sizeVisualVariable = {
      type: "size",
      field: "TOTAL2004",
      minDataValue: 3365,
      maxDataValue: 323944,
      minSize: 4,
      maxSize: 15
      };
      popRenderer.visualVariables = [ sizeVisualVariable ];
      // Rendu pour les communes
    /*let communeRenderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [ 51,51, 204, 0.9 ],
     
      style: "solid",
      outline: { // autocasts as new SimpleLineSymbol()
      color: "white",
      width: 1
      }
      }
      };*/

      let communeRenderer = {
        type: "class-breaks",
        field: "Shape_Area",
        classBreakInfos: [
          { minValue: 0, maxValue: 6000000, symbol: { type: "simple-fill", color: [255, 255, 212], style: "solid", outline: { color: "white", width: 1 } } },
          { minValue: 6000001, maxValue: 12000000, symbol: { type: "simple-fill", color: [254, 227, 145], style: "solid", outline: { color: "white", width: 1 } } },
          { minValue: 12000001, maxValue: 20000000, symbol: { type: "simple-fill", color: [254, 196, 79], style: "solid", outline: { color: "white", width: 1 } } },
          { minValue: 20000001, maxValue: 32000000, symbol: { type: "simple-fill", color: [254, 153, 41], style: "solid", outline: { color: "white", width: 1 } } },
          { minValue: 32000001, maxValue: 50000000, symbol: { type: "simple-fill", color: [217, 95, 14], style: "solid", outline: { color: "white", width: 1 } } },
          { minValue: 50000001, maxValue: 80000000, symbol: { type: "simple-fill", color: [153, 52, 4], style: "solid", outline: { color: "white", width: 1 } } },
          { minValue: 80000001, maxValue: 140000000, symbol: { type: "simple-fill", color: [102, 37, 6], style: "solid", outline: { color: "white", width: 1 } } },
          { minValue: 80000001, maxValue: 140000000, symbol: { type: "simple-fill", color: [102, 37, 6], style: "solid", outline: { color: "white", width: 1 } } }
        ]
      };
      

      let pieChartRenderer = {
        type: "pie-chart", // Type de rendu en camembert
        attributes: [
          {
            field: "TOTAL2004",
            label: "Population 2004",
            color: "red"
          },
          {
            field: "TOTAL1994",
            label: "Population 1994",
            color: "blue"
          }
        ]
      };
       

  // Popup pour les communes

    let popupCommune = new PopupTemplate({
      title: "<b>Commune: {COMMUNE_AR}</b>",
      content: "<p><b>PREFECTURE :</b> {PREFECTURE}</p>" +
               "<p><b>Communes :</b> {COMMUNE_AR}</p>" +
               "<p><b>Surface :</b> {Shape_Area} m²</p>"
               
    });
  
    const communes = new FeatureLayer({
      url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/Communes/FeatureServer",
      outFields: ["PREFECTURE", "COMMUNE_AR", "Shape_Area"],
      popupTemplate: popupCommune,
      renderer:communeRenderer
    });
    map.add(communes);


  
    // ----------------------- Popup pour la Population -----------------------
    let popupPopulation = new PopupTemplate({
      title: "<b>Population de : {ARRONDISSE}</b>",
      content: [{
        type: "media",
        mediaInfos: [{
          type: "column-chart",
          caption: "Statistiques de Casablanca",
          value: {
            fields: ["TOTAL1994", "TOTAL2004"]
          }
        }]
      }]
    });
  
    const population = new FeatureLayer({
      url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/casa_population1/FeatureServer",
      outFields: ["ARRONDISSE", "TOTAL1994", "TOTAL2004"],
      popupTemplate: popupPopulation,
      //renderer: popRenderer
      renderer: pieChartRenderer

    });
    map.add(population);
   
    
    
    
    
    
    let legend = new Legend({
        view: view
      });
      
      view.ui.add(legend, "bottom-right");
   

  });
  