(function() {
  goog.provide('ga_draw_directive');

  goog.require('ga_export_kml_service');
  goog.require('ga_map_service');

  var module = angular.module('ga_draw_directive', [
    'ga_export_kml_service',
    'ga_map_service',
    'pascalprecht.translate'
  ]);

  module.directive('gaDraw',
    function($timeout, $translate, $window, $rootScope, gaBrowserSniffer,
        gaDefinePropertiesForLayer, gaDebounce, gaLayerFilters, gaExportKml,
        gaMapUtils, gaPopup) {

      // Find the corresponding style
      var findIcon = function(olIcon, icons) {
        var id = olIcon.getSrc();
        for (var i = 0; i < icons.length; i++) {
          var regex = new RegExp('/' + icons[i].id + '-24');
          if (regex.test(id)) {
            return icons[i];
          }
        }
        return icons[0];
      };

      var findIconSize = function(olIcon, iconSizes) {
        var scale = olIcon.getScale();
        for (var i = 0; i < iconSizes.length; i++) {
          if (scale == iconSizes[i].scale) {
            return iconSizes[i];
          }
        }
        return iconSizes[0];
      };

      var findColor = function(olColor, colors) {
        var rgb = ol.color.asString(olColor.slice(0, 3));
        for (var i = 0; i < colors.length; i++) {
          if (rgb == ol.color.asString(colors[i].fill)) {
            return colors[i];
          }
        }
        return colors[0];
      };

      return {
        restrict: 'A',
        templateUrl: 'components/draw/partials/draw.html',
        scope: {
          map: '=gaDrawMap',
          options: '=gaDrawOptions',
          isActive: '=gaDrawActive'
        },
        link: function(scope, element, attrs, controller) {
          var draw, lastActiveTool;
          var map = scope.map;
          var source = new ol.source.Vector();
          scope.isPropsActive = true;
          scope.options.isProfileActive = false;
          scope.pointTools = [
            scope.options.tools[0],
            scope.options.tools[1]
          ];
          scope.complexTools = [
            scope.options.tools[2],
            scope.options.tools[3],
            scope.options.tools[4]
          ];

          var layer = new ol.layer.Vector({
            source: source,
            visible: true
          });

          gaDefinePropertiesForLayer(layer);
          layer.displayInLayerManager = false;
          scope.layers = scope.map.getLayers().getArray();
          scope.layerFilter = gaLayerFilters.selected;

          if (scope.options.broadcastLayer) {
            $rootScope.$broadcast('gaDrawingLayer', layer);
          }

          // Add select interaction
          var select = new ol.interaction.Select({
            layers: [layer],
            style: scope.options.selectStyleFunction,
            multi: false
          });
          var propsToggle = function(feature) {
            if (feature) {
              scope.feature = feature;
              scope.popupToggle = true;
            } else {
              scope.feature = undefined;
              scope.popupToggle = false;
            }
          };
          select.getFeatures().on('add', function(evt) {
            // Apply the select style
            var styles = scope.options.selectStyleFunction(evt.element);
            evt.element.setStyle(styles);
            updateUseStyles();
            propsToggle(evt.element);
            //console.debug('add');
          });
          select.getFeatures().on('remove', function(evt) {
            // Remove the select style
            var styles = evt.element.getStyle();
            styles.pop();
            evt.element.setStyle(styles);
            updateUseStyles();
            propsToggle();
            //console.debug('remove');
          });
          select.setActive(false);
          map.addInteraction(select);

          // Add modify interaction
          var modify = new ol.interaction.Modify({
            features: select.getFeatures(),
            style: scope.options.selectStyleFunction
          });
          modify.setActive(false);
          map.addInteraction(modify);

          // Activate the component
          var activate = function() {
            if (map.getLayers().getArray().indexOf(layer) == -1) {
              map.addLayer(layer);
              // Move draw layer on each changes in the list of layers
              // in the layer manager.
              scope.$watchCollection('layers | filter:layerFilter', function() {
                gaMapUtils.moveLayerOnTop(map, layer);
              });
            }
            //map.addOverlay(overlay);
            activateSelectInteraction();
          };

          // Deactivate the component: remove layer and interactions.
          var deactivate = function() {
            deactivateDrawInteraction();
            deactivateSelectInteraction();
            //map.removeOverlay(overlay);
          };

          // Deactivate other tools
          var activateTool = function(tool) {
            layer.visible = true;
            gaMapUtils.moveLayerOnTop(map, layer);
            lastActiveTool = tool;
            var tools = scope.options.tools;
            for (var i = 0, ii = tools.length; i < ii; i++) {
              scope.options[tools[i].activeKey] = (tools[i].id == tool.id);
            }
            activateDrawInteraction(lastActiveTool);
          };

          var deactivateTool = function(tool) {
            scope.options[tool.activeKey] = false;
          };

          // Set the draw interaction with the good geometry
          var deregDrawStart, deregDrawEnd;
          var activateDrawInteraction = function(tool) {
            deactivateSelectInteraction();
            deactivateDrawInteraction();
            draw = new ol.interaction.Draw(tool.drawOptions);
            var isFinishOnFirstPoint, deregFeatureChange;
            deregDrawStart = draw.on('drawstart', function(evt) {
              var nbPoint = 1;
              var isSnapOnLastPoint = false;

              deregFeatureChange = evt.feature.on('change', function(evt) {
                var geom = evt.target.getGeometry();
                if (geom instanceof ol.geom.Polygon) {
                  var lineCoords = geom.getCoordinates()[0];
                  if (nbPoint != lineCoords.length) {
                    // A point is added
                    nbPoint++;
                  } else {
                    var firstPoint = lineCoords[0];

                    // We update features and measures
                    var lastPoint = lineCoords[lineCoords.length - 1];
                    var lastPoint2 = lineCoords[lineCoords.length - 2];

                    var isSnapOnFirstPoint = (lastPoint[0] == firstPoint[0] &&
                        lastPoint[1] == firstPoint[1]);

                    // When the last change event is triggered the polygon is
                    // closed so isSnapOnFirstPoint is true. We need to know
                    // if on the change event just before, the snap on last
                    // point was active.
                    isFinishOnFirstPoint = (!isSnapOnLastPoint &&
                        isSnapOnFirstPoint);

                    isSnapOnLastPoint = (lastPoint[0] == lastPoint2[0] &&
                        lastPoint[1] == lastPoint2[1]);

                    if (isSnapOnLastPoint) {
                      // In that case the 2 last points of the coordinates
                      // array are identical, so we remove the useless one.
                      lineCoords.pop();
                    }
                  }
                }
              });
            });

            deregDrawEnd = draw.on('drawend', function(evt) {
              var featureToAdd = evt.feature;
              var geom = featureToAdd.getGeometry();
              if (geom instanceof ol.geom.Polygon && !isFinishOnFirstPoint) {
                // The sketchFeatureArea is automatically closed by the draw
                // interaction even if the user has finished drawing on the
                // last point. So we remove the useless coordinates.
                var lineCoords = featureToAdd.getGeometry().getCoordinates()[0];
                lineCoords.pop();
                featureToAdd = new ol.Feature(
                    new ol.geom.LineString(lineCoords));
              }

              // Unregister the change event
              ol.Observable.unByKey(deregFeatureChange);

              // Set the definitve style of the feature
              source.addFeature(featureToAdd);
              var styles = tool.style(featureToAdd);
              featureToAdd.setStyle(styles);
              scope.$apply();
              deactivateDrawInteraction();
              deactivateTool(lastActiveTool);
              activateSelectInteraction();
              select.getFeatures().push(featureToAdd);
            });
            map.addInteraction(draw);
          };
          var deactivateDrawInteraction = function() {
            ol.Observable.unByKey(deregDrawStart);
            ol.Observable.unByKey(deregDrawEnd);
            map.removeInteraction(draw);
          };


          // Activate/Deactivate select interaction
          var deregPointerMove;
          var activateSelectInteraction = function() {
            select.setActive(true);
            if (!gaBrowserSniffer.mobile) {
              deregPointerMove = map.on('pointermove',
                  updateCursorStyleDebounced);
            }
            activateModifyInteraction();
          };
          var deactivateSelectInteraction = function() {
            deactivateModifyInteraction();
            if (deregPointerMove) {
              ol.Observable.unByKey(deregPointerMove,
                  updateCursorStyleDebounced);
            }
            select.getFeatures().clear();
            select.setActive(false);
          };

          // Activate/Deactivate modifiy interaction
          var activateModifyInteraction = function() {
            modify.setActive(true);
          };

          var deactivateModifyInteraction = function() {
            modify.setActive(false);
          };


          // Update selected feature with a new style
          var updateSelectedFeatures = function() {
            if (select.getActive()) {
              var features = select.getFeatures();
              if (features) {
                features.forEach(function(feature) {
                  // Update the style of the feature with the current style
                  var styles = scope.options.updateStyle(feature);
                  feature.setStyle(styles);
                  // then apply the select style
                  styles = scope.options.selectStyleFunction(feature);
                  feature.setStyle(styles);
                });
              }
            }
          };

          // Determines which styles are used by selected features
          var updateUseStyles = function() {
            var features = select.getFeatures().getArray();
            var feature = features[0];
            var useIconStyle = false;
            var useColorStyle = false;
            if (feature) {
              // The select interaction select only one feature
              var styles = feature.getStyleFunction()();
              var featStyle = styles[0];
              if (featStyle.getImage() instanceof ol.style.Icon) {
                useIconStyle = true;
                scope.options.icon = findIcon(featStyle.getImage(),
                    scope.options.icons);
                scope.options.iconSize = findIconSize(featStyle.getImage(),
                    scope.options.iconSizes);
              }
              if (featStyle.getStroke()) {
                useColorStyle = true;
                scope.options.color = findColor(
                    featStyle.getStroke().getColor(), scope.options.colors);

              }
              if (featStyle.getText()) {
                useColorStyle = true;
                scope.options.name = featStyle.getText().getText();
                //scope.options.textSize
                //scope.options.textColor
                scope.options.color = findColor(
                featStyle.getText().getFill().getColor(), scope.options.colors);
              }

              scope.options.name = feature.get('name') || '';
              scope.options.description = feature.get('description') || '';

            } else {
              scope.options.name = '';
              scope.options.description = '';
            }
            scope.useIconStyle = useIconStyle;
            scope.useColorStyle = useColorStyle;
            scope.$evalAsync();
          };

          // Delete all features of the layer
          scope.deleteAllFeatures = function() {
            if (confirm($translate.instant('confirm_remove_all_features'))) {
              select.getFeatures().clear();
              layer.getSource().clear();
            }
          };

          // Activate/deactivate a tool
          scope.toggleTool = function(evt, tool) {
            if (scope.options[tool.activeKey]) {
              // Deactivate all tools
              deactivate();
              lastActiveTool = undefined;
            } else {
              activateTool(tool);
            }
            evt.preventDefault();
          };

          scope.exportKml = function(evt) {
            gaExportKml.createAndDownload(layer, map.getView().getProjection());
            evt.preventDefault();
          };

          scope.canExport = function() {
            return source.getFeatures().length > 0;
          };

          scope.aToolIsActive = function() {
            return !!lastActiveTool;
          };

          // Watchers
          scope.$watch('isActive', function(active) {
            if (active) {
              activate();
            } else {
              deactivate();
            }
          });

          scope.$watchGroup(['options.iconSize', 'options.icon',
              'options.color', 'options.name', 'options.description'],
              function() {
            updateSelectedFeatures();
          });

          $rootScope.$on('$translateChangeEnd', function() {
            layer.label = $translate.instant('draw');
          });

          // Utils

          // Change cursor style on mouse move, only on desktop
          var updateCursorStyle = function(evt) {
            var featureFound;
            map.forEachFeatureAtPixel(evt.pixel, function(feature, olLayer) {
              featureFound = feature;
            }, this, function(olLayer) {
              return (layer == olLayer);
            });
            map.getTarget().style.cursor = (featureFound) ? 'pointer' : '';
          };
          var updateCursorStyleDebounced = gaDebounce.debounce(
              updateCursorStyle, 10, false, false);
        }
      };
    }
  );
})();
