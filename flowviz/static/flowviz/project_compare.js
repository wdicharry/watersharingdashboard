(function (exports) {

    var usgsHucUrl = 'http://services.nationalmap.gov/arcgis/rest/services/nhd/MapServer/';

    function pandasIndexToCedar(dataset) {
        var features = []
        for (var indexValue in dataset) {
            if (dataset.hasOwnProperty(indexValue)) {
                var record = dataset[indexValue];
                record['index'] = indexValue;
                features.push({
                    "attributes": record
                });
            }
        }
        return features;
    }

    function initializeCedar(dataUrl) {
        // Consider using Cedar or Vega later if this becomes a real thing.
        // For now we're not using this function at all.
        var chart = new Cedar({"type": "bar"});
        var data = Cedar.getJson(dataUrl, function (err, data) {
            if (!err) {
                var cedarData = pandasIndexToCedar(data);

                console.log(cedarData);

                var dataset = {
                    "data": cedarData,
                    "mappings": {
                        "x": {"field": "index", "label": "Date"},
                        "y": {"field": "Mill Creek - Baseline", "label": "% of days in deficit"}
                    }
                };
                chart.dataset = dataset
                chart.show({
                    elementId: "#pct-plot"
                });
            } else {
                console.error("Error loading data");
            }
        });

        vg.parse.spec("/static/flowviz/pct_deficit.vega.json", function (chart) {
            chart({el: "#vega-plot"}).update();
        })
    }

    /**
     * Create a table from a url providing a CSV document and a selector
     * for an element in which to place the table.
     * The params object is optional and can contain the following parameters:
     * columnFormatters - An object mapping column names to functions for formatting fields
     * defaultFormatter - A function to use by default for formatting fields.
     */
    function createTable(dataUrl, selector, params) {
        var defaultParams = {
            "columnFormatters": {},
            "defaultFormatter": function (value) {
                return value;
            },
            "done": function() {
                // nothing
            }
        };

        if (arguments.length === 2) {
            params = defaultParams
        } else {
            params = $.extend(defaultParams, params);
        }

        if (params.hasOwnProperty("columnFormatters")) {
            columnFormatters = params.columnFormatters;
        } else {
            columnFormatters = {};
        }

        d3.csv(dataUrl, function (data) {
            if (data && data.length > 0) {
                // Get the column names
                var columns = Object.keys(data[0])

                var table = d3.select(selector)
                    .append("table")
                    .attr("class", "table table-striped table-condensed table-hover");
                var thead = table.append("thead");
                var tbody = table.append("tbody");

                // Create the header.
                thead.append("tr")
                    .selectAll("th")
                    .data(columns)
                    .enter()
                    .append("th")
                    .text(function (col) { return col; });

                // Fill the rows.
                var rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr");
                var cells = rows.selectAll("td")
                    .data(function (row) {
                        return columns.map(function (column) {
                            var value;
                            if (params.columnFormatters.hasOwnProperty(column)) {
                                value = params.columnFormatters[column](row[column]);
                            } else {
                                value = params.defaultFormatter(row[column]);
                            }
                            return {column: column, value: value};
                        });
                    })
                    .enter()
                    .append("td")
                    .text(function (d) { return d.value; });
            }
            params.done();
        });
    }

    function createMap() {
        var map = L.map('map', {
            scrollWheelZoom: false,
        })
        .setView([45.526, -122.667], 5);
        L.esri.basemapLayer('Topographic').addTo(map);
        return map;
    }

    function addHucRegions(map, scale, regions) {
        var query = regions.map(function (region) {
            return "HUC" + scale + "='" + region + "'";
        }).join(' OR ');

        var baseUrl = usgsHucUrl;
        // The NHD feature service provides each huc scale as a separate feature
        // service indexed from 1 to 6, so the needed url is half the huc scale.
        var hucUrl = baseUrl + scale / 2;

        var boundaries = L.esri.featureLayer({
            url: hucUrl,
            simplifyFactor: 0.5,
            where: query,
            style: function (feature) {
                return {
                    color: "blue",
                    fill: false,
                    weight: 4,
                }
            }
        }).addTo(map);

        return [boundaries];
    }

    function addGISLayers(map, gisLayers) {
        var layers = [];
        var layerLength = gisLayers.length;
        for (var i = 0; i < layerLength; i++) {
            var layer = L.esri.featureLayer({
                url: gisLayers[i],
            }).addTo(map);
            layers.push(layer);
        }
        return layers;
    }

    function addGageLocations(map, usgsGages) {
        var query = usgsGages.map(function (gageId) {
            return "SOURCE_FEATUREID='" + gageId + "'";
        }).join(" OR ");

        var gages = L.esri.featureLayer({
            url: 'http://services.nationalmap.gov/arcgis/rest/services/nhd/MapServer/9',
            where: query
        }).addTo(map);

        gages.bindPopup(function (feature) {
            return L.Util.template(
                '<p><h4><a href="{FEATUREDETAILURL}" target="_blank">{SOURCE_FEATUREID}</a></h4></p>',
                feature.properties);
        });

        return [gages];
    }

    function addPointLocations(map, pointCoordinates) {
        var markers = $.map(pointCoordinates, function (location) {
            var popupContent = "<a href='" + location.url + "'>" +
                location.name + "</a>";
            return L.marker([location.latitude, location.longitude])
                .bindPopup(popupContent)
                .addTo(map);
        });
        return new L.featureGroup(markers)
    }

    function fitLayers(map, layergroup, pointLayer) {
        var bounds = L.latLngBounds([]);
        layergroup.eachLayer(function (layer) {
            layer.eachFeature(function (feature) {
                if (feature.getBounds) {
                    var featureBounds = feature.getBounds();
                    bounds.extend(featureBounds);
                }
                else if (feature.getLatLng) {
                    bounds.extend(feature.getLatLng());
                }
            });
        });
        if (pointLayer) {
            bounds.extend(pointLayer.getBounds());
        }
        map.fitBounds(bounds);
    }

    function initializeMap(scale, regions) {

        boundaries.on('load', function (evt) {
            var bounds = L.latLngBounds([]);
            boundaries.eachFeature(function (layer) {
                if (layer.getBounds) {
                    var layerBounds = layer.getBounds();
                    bounds.extend(layerBounds);
                }
            });
            map.fitBounds(bounds);
            boundaries.off('load');
        });

        return map;
    }

    function addRelationship(postUrl, selectId, projectId, relatedAttribute, modalId) {
        objectId = $("#" + selectId + " option:selected").val();

        data = {
            project: projectId,
        };
        data[relatedAttribute] = objectId;

        $.ajax({
            url: postUrl,
            data: data,
            type: "POST",
        }).done(function (data) {
            $("#" + modalId).modal("hide");
            location.reload();
        })
    }

    function deleteRelationship(baseUrl, relationshipId) {
        var url = baseUrl + relationshipId;
        $.ajax({
            url: url,
            type: "DELETE"
        }).done(function () {
            location.reload();
        });
    }

    function initializeAttainment(tables, imgUrls) {
        var tableCount = Object.keys(tables).length;
        var imgCount = Object.keys(imgUrls).length;
        var dataCount = new Common.CountDownLatch(tableCount + imgCount, function () {
            $("#pleaseWaitDialog").modal("hide");
        });

        function imgDone() {
            dataCount.countDown();
        }

        jQuery("#pleaseWaitDialog").modal();

        var monthFormatter = function (value) {
            return value;
        };

        Common.downloadImage(imgUrls.percent, "percent-plot", imgDone);
        Common.downloadImage(imgUrls.deficit, "deficit-plot", imgDone);
        Common.downloadImage(imgUrls.deficit_pct, "deficit-pct-plot", imgDone);

        createTable(tables["deficit-pct-table-monthly"], "#deficit-pct-table-monthly", {
            columnFormatters: { 'Month': monthFormatter },
            defaultFormatter: d3.format(",.1%"),
            done: imgDone
        });

        createTable(tables["deficit-stats-monthly-table"], "#deficit-stats-monthly-table", {
            columnFormatters: { 'Month': monthFormatter },
            defaultFormatter: d3.format(".3r"),
            done: imgDone
        });

        createTable(tables["deficit-stats-monthly-pct-table"], "#deficit-stats-monthly-pct-table",{
            columnFormatters: { 'Month': monthFormatter },
            defaultFormatter: d3.format(",.1%"),
            done: imgDone
        });
    }

    function initialize(tables, imgUrls, hucInfo, usgsGages, gisLayers) {

        if (hasScenarios) {
            initializeAttainment(tables, imgUrls);
        }

        var map = null;
        var layers = [];

        if (hucInfo.scale && hucInfo.regions) {
            map = map || createMap();
            var huc = addHucRegions(map, hucInfo.scale, hucInfo.regions);
            layers.push.apply(layers, huc);
        }

        if (gisLayers && gisLayers.length > 0) {
            map = map || createMap();
            var gis = addGISLayers(map, gisLayers);
            layers.push.apply(layers, gis);
        }

        if (usgsGages && usgsGages.length > 0) {
            map = map || createMap();
            var gages = addGageLocations(map, usgsGages);
            layers.push.apply(layers, gages);
        }

        if (pointLocations && pointLocations.length > 0) {
            map = map || createMap();
            var pointLayer = addPointLocations(map, pointLocations);
        }

        if (!map) {
            $("#map").hide();
        }
        else {
            var layerGroup = L.featureGroup(layers);
            var count = new Common.CountDownLatch(layers.length, function () {
                fitLayers(map, layerGroup, pointLayer || null);
            });
            layerGroup.eachLayer(function (layer) {
                layer.on('load', function (evt) {
                    count.countDown();
                    layer.off('load');
                });
            });
        }

        $("#add-scenario-button").click(function () {
            addRelationship(addScenarioPostUrl, scenarioSelectId, projectId, "scenario",
                "add-scenario-modal");
        });

        $(".remove-scenario-button").click(function () {
            var relationshipId = $(this).data("rel-id");
            if (relationshipId) {
                deleteRelationship(addScenarioPostUrl, relationshipId);
            }
        });

        $("#add-cropmix-button").click(function () {
            addRelationship(addCropMixPostUrl, cropmixSelectId, projectId, "crop_mix",
                "add-cropmix-modal");
        });

        $(".remove-cropmix-button").click(function () {
            var relationshipId = $(this).data("rel-id");
            if (relationshipId) {
                deleteRelationship(addCropMixPostUrl, relationshipId);
            }
        });


    }
    exports.initialize = initialize;

})(this.ProjectCompare = {})
