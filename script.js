require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/widgets/Sketch",
  "esri/widgets/Editor",
    "esri/widgets/FeatureForm",
], function (
  esriConfig,
  Map,
  MapView,
  FeatureLayer,
    GraphicsLayer,
    Sketch,
    Editor,
    FeatureForm
 
) {
  esriConfig.apiKey =
    "AAPTxy8BH1VEsoebNVZXo8HurIJbcyg--Z0NSed8P7Wqjib8XaB6ReHxsI9uVRBG4mOQjGo86DS-uaJIhkMBuxeMMH-GAoiwXzENrEPWpPxnbsntw0GAMRqK9iXPTDHlRRHyAptGrpjdyimQml6PYg9APpvW00A45Zv-aUZvOAbaDAgMBpsk3isc9Isf2olkX3QDmhGnhJTD6zwrI01GRT4RStyyFO8epz5bSlSuQNIO3oc5M7A2_RbvNrkEQ-xRQIwtAT1_HNOoAM8o";
    let editFeature;
    let highlight;
 
  const map = new Map({
    basemap: "arcgis-topographic",
   
  });
 
  const view = new MapView({
    map: map,
    center: [-7.62, 33.59],
        zoom: 13,
        container: "viewDiv",
   
  });
  const featureLayer = new FeatureLayer({
    url: "https://services5.arcgis.com/FlfGDAZ77bDVEcE9/arcgis/rest/services/site_acceuil/FeatureServer",
    outFields: ["*"],
    formTemplate: {
      // Autocasts to new FormTemplate
      title: "État d'avancement des travaux",
      description: "Saisir les informations sur les travaux",
      elements: [
        {
          // Autocasts to new GroupElement
          type: "group",
          label: "Secteur Administratif",
          description: "Lieu du site",
          elements: [
            {
              // Autocasts to new FieldElement
              type: "field",
              fieldName: "PREFECTURE",
              label: "Préfecture",
            },
            {
              type: "field",
              fieldName: "Commune_Ce",
              label: "Commune/Arrondissement",
            },
          ],
        },
        {
          // Groupe d'informations sur le site
          type: "group",
          label: "Informations sur le site",
          description: "Saisir les informations sur le site",
          elements: [
            {
              type: "field",
              fieldName: "Site",
              label: "Nom du projet",
            },
            {
              type: "field",
              fieldName: "REFERENCE",
              label: "Titre foncier",
            },
            {
              type: "field",
              fieldName: "Site_ID",
              label: "Numéro du projet",
            },
            {
              type: "field",
              fieldName: "ETAT",
              label: "État des travaux",
            },
          ],
        },
      ],
    },
  });
 
  map.add(featureLayer);
 
  view.ui.add("update", "bottom-left");
  // Add a new feature form with grouped fields
  const form = new FeatureForm({
    view: view, // required if using Arcade expressions using the $map globalvariable
    container: "form",
    groupDisplay: "sequential", // only display one group at a time
    layer: featureLayer,
  });
  view.on("click", (event) => {
    // Unselect any currently selected features
    unselectFeature();
    // Listen for when the user clicks on the view
    view.hitTest(event).then((response) => {
      // If user selects a feature, select it
      const results = response.results;
      if (
        results.length > 0 &&
        results[0].graphic &&
        results[0].graphic.layer === featureLayer
      ) {
        selectFeature(
          results[0].graphic.attributes[featureLayer.objectIdField]
        );
      } else {
        // Hide theform
        document.getElementById("update").classList.add("esri-hidden");
      }
    });
  });
  // Function to unselect features
  function unselectFeature() {
    if (highlight) {
      highlight.remove();
    }
  }
  function selectFeature(objectId) {
    // query feature from the server
    featureLayer
      .queryFeatures({
        objectIds: [objectId],
        outFields: ["*"],
        returnGeometry: true,
      })
      .then((results) => {
        if (results.features.length > 0) {
          editFeature = results.features[0];
          // display the attributes of selected feature in the form
          form.feature = editFeature;
          // highlight the feature on the view
          view.whenLayerView(editFeature.layer).then((layerView) => {
            highlight = layerView.highlight(editFeature);
          });
          if (
            document.getElementById("update").classList.contains("esri-hidden")
          ) {
            //sdocument.getElementById("info").classList.add("esri-hidden");
            document.getElementById("update").classList.remove("esri-hidden");
          }
        }
      });
  }
  // Listen to the feature form's submit event.
  form.on("submit", () => {
    if (editFeature) {
      // Grab updated attributes from the form.
      const updated = form.getValues();
      // Loop through updated attributes and assign
      // the updated values to feature attributes.
      Object.keys(updated).forEach((name) => {
        editFeature.attributes[name] = updated[name];
      });
      // Setup the applyEdits parameter with updates.
      const edits = {
        updateFeatures: [editFeature],
      };
      applyAttributeUpdates(edits);
    }
  });
  // Call FeatureLayer.applyEdits() with specified params.
  function applyAttributeUpdates(params) {
    document.getElementById("btnUpdate").style.cursor = "progress";
    featureLayer
      .applyEdits(params)
      .then((editsResult) => {
        // Get the objectId of the newly added feature.
        // Call selectFeature function to highlight the new feature.
        if (editsResult.addFeatureResults.length > 0) {
          const objectId = editsResult.addFeatureResults[0].objectId;
          selectFeature(objectId);
        }
        document.getElementById("btnUpdate").style.cursor = "pointer";
      })
      .catch((error) => {
        console.log("===============================================");
        console.error(
          "[ applyEdits ] FAILURE: ",
          error.code,
          error.name,
          error.message
        );
        console.log("error = ", error);
        document.getElementById("btnUpdate").style.cursor = "pointer";
      });
  }
  document.getElementById("btnUpdate").onclick = () => {
    // Fires feature form's submit event.
    form.submit();
  };
});