
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Editor" // Importation du module Editor
], function (esriConfig, Map, MapView, FeatureLayer, Editor) {


    esriConfig.apiKey="AAPTxy8BH1VEsoebNVZXo8HurJqJHuAOWtOeDglllaI2VkFYAsnt_LAJU_DdMvuovjNdcxL2WBTOHmSZe18KNGGxXQQSEtfAA2SllX7erbK7lEL3rNSRZeTG5zfAXFqFsGzpyAKGVK7qhMQaFBf6VscCm4s5wvSDblVB5zdziO37uDKVl736TpDkqt1zzPqxWac_hqF2mIWRg8R6ZhApEqDw1Cw_RTurqwEInoYDg_CxCxqlv09nkMdYBFDneBaqhh-WAT1_SmziIOm6"

    const map = new Map({
        basemap: "arcgis-topographic" // Fond de carte
    });

    const view = new MapView({
        map: map,
        center: [-7.62, 33.59], // Longitude, latitude
        zoom: 13, // Niveau de zoom
        container: "viewDiv"
    });


    const sites = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/sites/FeatureServer",
    });
    
    map.add(sites);
    const population = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/casa_population1/FeatureServer",
    });
    
    map.add(population);
    const editor = new Editor({
        view: view,
        layerInfos: [
            {
                layer: sites,
                formTemplate: {
                    elements: [
                        { type: "field", fieldName: "Site", label: "Site" },
                        { type: "field", fieldName: "ETAT", label: "ETAT" },
                        { type: "field", fieldName: "REFERENCE", label: "REFERENCE" },
                        { 
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
                        }
                    ]
                },
                enabled: true,
                addEnabled: true,
                updateEnabled: true,
                deleteEnabled: false,
                attributeUpdatesEnabled: true,
                geometryUpdatesEnabled: true,
                attachmentsOnCreateEnabled: true,
                attachmentsOnUpdateEnabled: true
            },
            {
                layer: population,
                formTemplate: {
                    elements: [
                        { type: "field", fieldName: "NOM", label: "Nom" },
                        { type: "field", fieldName: "AGE", label: "Âge" },
                        { type: "field", fieldName: "SEXE", label: "Sexe" },
                        { type: "field", fieldName: "EMPLOI", label: "Emploi Actuel" },
                        { type: "field", fieldName: "SECTEUR", label: "Secteur d'Activité" }
                    ]
                },
                enabled: true,
                addEnabled: true,
                updateEnabled: true,
                deleteEnabled: false,
                attributeUpdatesEnabled: true,
                geometryUpdatesEnabled: true,
                attachmentsOnCreateEnabled: true,
                attachmentsOnUpdateEnabled: true
            }
        ]
    });
    // Add widget to the view
    view.ui.add(editor, "top-right");

}); 