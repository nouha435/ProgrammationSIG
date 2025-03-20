require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch",
    "esri/widgets/Editor",
  ], function (
    esriConfig,
    Map,
    MapView,
    FeatureLayer,
    GraphicsLayer,
    Sketch,
    Editor
  ) {
    esriConfig.apiKey =
      "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQjGo86DS-uaJIhkMBuxeMMH-GAoiwXzENrEPWpPxnbsntw0GAMRqK9iXPTDHlRRHyAptGrpjdyimQml6PYg9APpvW00A45Zv-aUZvOAbaDAgMBpsk3isc9Isf2olkX3QDmhGnhJTD6zwrI01GRT4RStyyFO8epz5bSlSuQNIO3oc5M7A2_RbvNrkEQ-xRQIwtAT1_HNOoAM8o";
   
    const map = new Map({
      basemap: "arcgis-topographic",
    });
   
    const view = new MapView({
      map: map,
      center: [-7.62, 33.59],
      zoom: 13,
      container: "viewDiv",
    });
    const sites = new FeatureLayer({
      url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/site_acceuil/FeatureServer",
    });
    map.add(sites);
    const population = new FeatureLayer({
      url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/casa_population1/FeatureServer",
    });
    map.add(population);
   
    const editor = new Editor({
      view: view,
      layerInfos: [
        {
          layer: sites, // pass in the feature layer,
          formTemplate: {
            // autocastable to FormTemplate
            elements: [
              {
                // autocastable to FieldElement
                type: "field",
                fieldName: "PREFECTURE",
                label: "PREFECTURE",
                domain: {
                  type: "coded-value",
                  name: "PREFECTURE",
                  codedValues: [
                    {
                      name: "PREFECTURE DE CASABLANCA",
                      code: "PREFECTURE DE CASABLANCA",
                    },
                    {
                      name: "PROVINCE DE MEDIOUNA",
                      code: "PROVINCE DE MEDIOUNA",
                    },
                    {
                      name: "PREFECTURE DE MOHAMMEDIA",
                      code: "PREFECTURE DE MOHAMMEDIA",
                    },
                    {
                      name: "PROVINCE DE NOUACEUR",
                      code: "PROVINCE DE NOUACEUR",
                    },
                    {
                      name: "PROVINCE DE BEN SLIMANE",
                      code: "PROVINCE DE BEN SLIMANE",
                    },
                  ],
                },
              },
              {
                // autocastable to FieldElement
                type: "field",
                fieldName: "Commune_Ce",
                label: "Commune/Arrondissement",
              },
              {
                // autocastable to FieldElement
                type: "field",
                fieldName: "REFERENCE",
                label: "REFERENCE",
              },
              {
                // autocastable to FieldElement
                type: "field",
                fieldName: "Site",
                label: "Site",
              },
            ],
          },
        },
        {
          layer: population, // pass in the population feature layer,
          formTemplate: {
              // autocastable to FormTemplate
              elements: [
                  {
                      // Champ PREFECTURE avec liste déroulante
                      type: "field",
                      fieldName: "PREFECTURE",
                      label: "PREFECTURE",
                      domain: {
                          type: "coded-value",
                          name: "PREFECTURE",
                          codedValues: [
                              { name: "PREFECTURE DE CASABLANCA", code: "PREFECTURE DE CASABLANCA" },
                              { name: "PROVINCE DE MEDIOUNA", code: "PROVINCE DE MEDIOUNA" },
                              { name: "PREFECTURE DE MOHAMMEDIA", code: "PREFECTURE DE MOHAMMEDIA" },
                              { name: "PROVINCE DE NOUACEUR", code: "PROVINCE DE NOUACEUR" },
                              { name: "PROVINCE DE BEN SLIMANE", code: "PROVINCE DE BEN SLIMANE" }
                          ]
                      }
                  },
                  {
                      // Commune / Arrondissement
                      type: "field",
                      fieldName: "ARRONDISSE",
                      label: "Commune/Arrondissement"
                  },
                  {
                      // Zone de population
                      type: "field",
                      fieldName: "MAROCAINS",
                      label: "Zone de Population"
                  },
                  {
                      // Nombre d'habitants
                      type: "field",
                      fieldName: "ETRANGERS",
                      label: "Population"
                  },
                  {
                      // Densité de population
                      type: "field",
                      fieldName: "TOTAL1994",
                      label: "Densité de Population"
                  }
              ]
          }
      }
     
      ],
      enabled: true, // Default is true, set to false to disable editing functionality.
      addEnabled: true, // Default is true, set to false to disable the ability to add a new feature.
      updateEnabled: true, // Default is true, set to false to disable the ability toedit an existing feature.
      deleteEnabled: false, // Default is true, set to false to disable the ability todelete features.
      attributeUpdatesEnabled: true, // Default is true, set to false to disable theability to edit attributes in the update workflow.
      geometryUpdatesEnabled: true, // Default is true, set to false to disable theability to edit feature geometries in the update workflow.
      attachmentsOnCreateEnabled: true, //Default is true, set to false to disable theability to work with attachments while creating features.
      attachmentsOnUpdateEnabled: true, //Default is true, set to false to disable theability to work with attachments while updating/deleting features.
    });
    // Add widget to the view
    view.ui.add(editor, "top-right");
  });
   