(function() {
  goog.provide('ga_draw_controller');

  var module = angular.module('ga_draw_controller', [
    'pascalprecht.translate',
    'ga_styles_service'
  ]);

  module.controller('GaDrawController',
      function($rootScope, $scope, $translate, gaGlobalOptions, gaStyleFactory) {
        
        $scope.$on('gaPopupFocusChange', function(evt, isFocus) {
          $scope.options.hasPopupFocus = isFocus;
        });

        // Defines static styles
        var white = [255, 255, 255];
        var black = [0, 0, 0];

        $scope.options = $scope.options || {};
         
        // Add popup options
        $scope.options.popupOptions = {
          title: 'measure',
          help:'66',
          x: 0,
          y: 'auto',
          container: 'body',
          position: 'bottom-left'
        };

        // Add measure options
        $scope.options.measureOptions = {
        };
 
        // Add profile options
        $scope.options.profileOptions = {
          xLabel: 'profile_x_label',
          yLabel: 'profile_y_label',
          margin: {
             top: 0,
             right: 20,
             bottom: 40,
             left: 60
          },
          height: 145,
          elevationModel: 'COMB'
        };

        // Defines directive options
        $scope.options.showExport =
            angular.isDefined($scope.options.showExport) ?
            $scope.options.showExport : true;

        $scope.options.broadcastLayer =
            angular.isDefined($scope.options.broadcastLayer) ?
            $scope.options.broadcastLayer : false;

        $scope.options.translate = $translate; // For translation of ng-options

        $scope.options.name = '';

        $scope.options.description = '';

        $scope.options.colors = [
          {name: 'black',  fill: [0, 0, 0]},
          {name: 'blue',   fill: [0, 0, 255]},
          {name: 'gray',   fill: [128, 128, 128]},
          {name: 'green',  fill: [0, 128, 0]},
          {name: 'orange', fill: [255, 165, 0]},
          {name: 'red',    fill: [255, 0, 0]},
          {name: 'white',  fill: [255, 255, 255]},
          {name: 'yellow', fill: [255, 255, 0]}
        ];

        $scope.options.iconSizes = [
          {label:'24 px', value: [24, 24], scale: 0.5},
          {label:'36 px', value: [36, 36], scale: 0.75},
          {label:'48 px', value: [48, 48], scale: 1}
        ];

        $scope.options.icons = [
            
            // Basics
            {id: 'marker'},
            {id: 'marker-stroked'},
            {id: 'circle'},
            {id: 'circle-stroked'},
            {id: 'square'},
            {id: 'square-stroked'},
            {id: 'triangle'},
            {id: 'triangle-stroked'},
            {id: 'star'},
            {id: 'star-stroked'},
            {id: 'cross'},
            {id: 'disability'},
            {id: 'danger'},
            
            // Shops 
            {id: 'art-gallery'},
            {id: 'alcohol-shop'},
            {id: 'bakery'},
            {id: 'bank'},
            {id: 'bar'},
            {id: 'beer'},
            {id: 'cafe'},
            {id: 'cinema'},
            {id: 'commercial'},
            {id: 'clothing-store'},
            {id: 'grocery'},
            {id: 'fast-food'},
            {id: 'hairdresser'},
            {id: 'fuel'},
            {id: 'laundry'},
            {id: 'library'},
            {id: 'lodging'},
            {id: 'pharmacy'},
            {id: 'restaurant'},
            {id: 'shop'},
            
            // Transport
            {id: 'airport'},
            {id: 'bicycle'},
            {id: 'bus'},
            {id: 'car'},
            {id: 'ferry'},
            {id: 'london-underground'},
            {id: 'rail'},
            {id: 'rail-above'},
            {id: 'rail-light'},
            {id: 'rail-metro'},
            {id: 'rail-underground'},
            {id: 'scooter'},

            // Sport 
            {id: 'america-football'},
            {id: 'baseball'},
            {id: 'basketball'},
            {id: 'cricket'},
            {id: 'golf'},
            {id: 'skiing'},
            {id: 'soccer'},
            {id: 'swimming'},
            {id: 'tennis'},
            
            // Places 
            {id: 'airfield'},
            {id: 'building'},
            {id: 'campsite'},
            {id: 'cemetery'},
            {id: 'city'},
            {id: 'college'},
            {id: 'dog-park'},
            {id: 'embassy'},
            {id: 'farm'},
            {id: 'fire-station'},
            {id: 'garden'},
            {id: 'harbor'},
            {id: 'heliport'},
            {id: 'hospital'},
            {id: 'industrial'},
            {id: 'land-use'},
            {id: 'lighthouse'},
            {id: 'monument'},
            {id: 'minefield'},
            {id: 'museum'},
            {id: 'oil-well'},
            {id: 'park2'},
            {id: 'park'},
            {id: 'parking'},
            {id: 'parking-garage'},
            {id: 'pitch'},
            {id: 'place-of-worship'},
            {id: 'playground'},
            {id: 'police'},
            {id: 'polling-place'},
            {id: 'post'},
            {id: 'religious-christian'},
            {id: 'religious-jewish'},
            {id: 'religious-muslim'},
            {id: 'prison'},
            {id: 'school'},
            {id: 'slaughterhouse'},
            {id: 'theatre'},
            {id: 'toilets'},
            {id: 'town'},
            {id: 'town-hall'},
            {id: 'village'},
            {id: 'warehouse'},
            {id: 'wetland'},
            {id: 'zoo'},

            
            {id: 'camera'},
            {id: 'chemist'},
            {id: 'dam'},
            {id: 'emergency-telephone'},
            {id: 'entrance'},
            {id: 'heart'},
            {id: 'logging'},
            {id: 'mobilephone'},
            {id: 'music'},
            {id: 'roadblock'},
            {id: 'rocket'},
            {id: 'suitcase'},
            {id: 'telephone'},
            {id: 'waste-basket'},
            {id: 'water'}
        ];
        
        // Set default color
        $scope.options.color = $scope.options.colors[5];
        
        // Set default icon
        $scope.options.icon = $scope.options.icons[0];
        
        // Set default icon
        $scope.options.iconSize = $scope.options.iconSizes[2];
 
        // Define icons properties
        for (var i = 0, ii = $scope.options.icons.length; i < ii; i++) {
          var icon = $scope.options.icons[i];
          icon.url = gaGlobalOptions.resourceUrl + 'img/maki/' + icon.id + '-24@2x.png';
        }
        $scope.getIconUrl = function(i) {
          return i.url;
        };
        // Get the current style defined by inputs 
        $scope.options.updateStyle = function(feature) {
          var style;
          var oldStyles = feature.getStyle();
          if (oldStyles.length) {
            style = oldStyles[0];
          } else {
            // No style to update
            return;         
          }

          // Update Fill if it exists
          var color;
          if (style.getImage() instanceof ol.style.Icon) {
            color = $scope.options.colors[5]; // red
          } else {
            color = $scope.options.color;
          }
          var fill = style.getFill();
          if (fill) {
            fill.setColor(color.fill.concat([0.4]));
          }
          // Update Stroke if it exists
          var stroke = style.getStroke();
          if (stroke) {
            stroke.setColor(color.fill.concat([1]));
          }
          
          var sketchCircle = new ol.style.Circle({
            radius: 4,
            fill: fill,
            stroke: stroke
          });
          
          // Update/create text style
          var text;
          if ($scope.options.name) {
            text = new ol.style.Text({
              font: gaStyleFactory.FONT,
              text: $scope.options.name,
              fill: new ol.style.Fill({
                color: color.fill.concat([1])
              }),
              stroke: gaStyleFactory.getTextStroke(color.fill.concat([1]))
            });
          } 

          // Update Icon style if it exists
          var icon = style.getImage();
          if (icon instanceof ol.style.Icon &&
              angular.isDefined($scope.options.icon)) {
            icon = new ol.style.Icon({
              src: $scope.getIconUrl($scope.options.icon),
              scale: $scope.options.iconSize.scale
            });
          }
          
          // Set feature's properties
          feature.set('name', $scope.options.name);
          feature.set('description', $scope.options.description);


          var styles = [
            new ol.style.Style({
              fill: fill,
              stroke: stroke,
              text: text,
              image: icon || sketchCircle,
              zIndex: style.getZIndex()
            })
          ];

          return styles;
        };
        
        var markerDrawStyleFunc = function(feature, resolution) {

          var icon = new ol.style.Icon({
            src: $scope.getIconUrl($scope.options.icon),
            scale: $scope.options.iconSize.scale
          });

          var styles = [
            new ol.style.Style({
              image: icon,
              zIndex: gaStyleFactory.ZICON
            })
          ];

          return styles;
        }
        

        // Draw a text
        var annotationDrawStyleFunc = function(feature, resolution) {
          var color = $scope.options.color;
          var fill = new ol.style.Fill({
            color: color.fill.concat([0.4])
          })
          var stroke = new ol.style.Stroke({
            color: color.fill.concat([1]),
            width: 3
          });
          var text = new ol.style.Text({
              font: gaStyleFactory.FONT,
              text: $scope.options.name || 'Text',
              fill: new ol.style.Fill({
                color: stroke.getColor()
              }),
              stroke: gaStyleFactory.getTextStroke(stroke.getColor())
          });

          feature.set('name', $scope.options.name);
          feature.set('description', $scope.options.description);

          var styles = [
            new ol.style.Style({
              text: text,
              image: new ol.style.Circle({
                radius: 4,
                fill: fill,
                stroke: stroke
              }),
              zIndex: gaStyleFactory.ZICON
            })
          ];
          return styles;
        };

        // Draw a line or polygon 
        var linepolygonDrawStyleFunc = function(feature) {
          var zIndex = gaStyleFactory.ZPOLYGON;
          var text, icon;
          var color = $scope.options.color;
          var fill = new ol.style.Fill({
            color: color.fill.concat([0.4])
          });
          var stroke = new ol.style.Stroke({
            color: color.fill.concat([1]),
            width: 3
          });
          
          feature.set('name', $scope.options.name);
          feature.set('description', $scope.options.description);

          var styles = [
            new ol.style.Style({
              fill: fill,
              stroke: stroke,
              zIndex: zIndex
            })
          ];

          return styles;
        };

        // Draw freehand 
        var freehandDrawStyleFunc = function(feature) {
          var zIndex = gaStyleFactory.ZLINE;
          var stroke = new ol.style.Stroke({
            color: [255, 255, 0, 0.7],
            width: 6
          });
          
          feature.set('name', $scope.options.name);
          feature.set('description', $scope.options.description);
          var styles = [
            new ol.style.Style({
              stroke: stroke,
              zIndex: zIndex
            })
          ];

          return styles;
        };

        // Draw a dashed line or polygon 
        var measureDrawStyleFunc = function(feature) {
          var zIndex = gaStyleFactory.ZPOLYGON;
          var color = $scope.options.color;
          feature.set('name', $scope.options.name);
          feature.set('description', $scope.options.description);

          var styles = [
            new ol.style.Style({
              fill: new ol.style.Fill({
                color: color.fill.concat([0.4])
              }),
              stroke: new ol.style.Stroke({
                color: color.fill.concat([1]),
                width: 3,
                lineDash: [8]
              }),
              zIndex: zIndex
            })
          ];

          return styles;
        };

        var generateDrawStyleFunc = function(styleFunction) {
          var sketchPolygon = new ol.style.Style({
            fill: new ol.style.Fill({
              color: [255, 255, 255, 0.4]
            }),
            stroke: new ol.style.Stroke({
              color: [255, 255, 255, 0],
              width: 0
            })
          });
          
          return function(feature, resolution) {
            var styles;
            if (feature.getGeometry().getType() === 'Polygon') {
              styles =  [sketchPolygon];
            } else if (feature.getGeometry().getType() === 'Point') {
              var color = $scope.options.color;
              var fill = new ol.style.Fill({
                color: color.fill.concat([0.4])
              });
              var stroke = new ol.style.Stroke({
                color: color.fill.concat([1]),
                width: 3
              });
              var sketchCircle = new ol.style.Style({
                image: new ol.style.Circle({
                  radius: 4,
                  fill: fill,
                  stroke: stroke
                })
              });
              styles =  [sketchCircle];
            } else {
              styles = styleFunction(feature, resolution);
            }
            return styles;
          };
        };
         
        $scope.options.selectStyleFunction = (function() {
          var fill = new ol.style.Fill({
            color: white.concat([0.4])
          });
          var stroke = new ol.style.Stroke({
            color: white.concat([0.6]),
            width: 3 
          });
          var defaultCircle = new ol.style.Circle({
            radius: 4,
            fill: fill,
            stroke: stroke
          }); 
          var vertexStyle = new ol.style.Style({
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: white.concat([1])
              }),
              stroke: new ol.style.Stroke({
                color: black.concat([1])
              })
            }), 
            zIndex: gaStyleFactory.ZSKETCH 
          });
           
          return function(feature, resolution) {
            if (!feature.getStyleFunction() ||
                feature.getStyleFunction()()=== null) {
              return [vertexStyle];
            }
            var styles = feature.getStyleFunction()(resolution);
            var style = styles[0];
            var text = style.getText();
            if (text) {
              text = new ol.style.Text({
                font: text.getFont(),
                text: text.getText(),
                fill: fill,
                stroke: stroke
              });
            }
            
            // When a feature is selected we apply its current style and a white
            // transparent style on top.
            return [
              style, 
              new ol.style.Style({
                fill: fill,
                stroke: stroke,
                text: text,
                image: (text) ? style.getImage() : defaultCircle,
                zIndex: gaStyleFactory.ZSELECT                
              })
            ];
          }
        })();

        // Define tools
        $scope.options.tools = [{
          id: 'marker',
          drawOptions: {
            type: 'Point',
            style: markerDrawStyleFunc
          },
          style: markerDrawStyleFunc
        }, {
          id: 'annotation',
          drawOptions: {
            type: 'Point',
            style: annotationDrawStyleFunc
          },
          style: annotationDrawStyleFunc
        }, {
          id: 'linepolygon',
          drawOptions: {
            type: 'Polygon',
            style: generateDrawStyleFunc(linepolygonDrawStyleFunc)
          },
          style: linepolygonDrawStyleFunc
        }, {
          id: 'freehand',
          drawOptions: {
            type: 'LineString',
            condition: ol.events.condition.shiftKeyOnly,
            freehandCondition: ol.events.condition.noModifierKeys,
            style: generateDrawStyleFunc(freehandDrawStyleFunc)
          },
          style: freehandDrawStyleFunc
        }, {
          id: 'measure',
          drawOptions: {
            type: 'Polygon',
            style: generateDrawStyleFunc(measureDrawStyleFunc)
          },
          style: measureDrawStyleFunc
        }];
        
        for (var i = 0, ii = $scope.options.tools.length; i < ii; i++) {
          var tool = $scope.options.tools[i];
          tool.activeKey = 'is' + tool.id.charAt(0).toUpperCase() + tool.id.slice(1) + 'Active';
          tool.cssClass = 'icon-ga-mapfunction';//'ga-draw-' + tool.id + '-bt';
          tool.title = 'draw_' + tool.id;
          if (!tool.drawOptions.featureStyleFunction) {
            tool.drawOptions.featureStyleFunction = $scope.options.styleFunction;
          }
          //tool.description = 'draw_' + tool.id + '_description';
          //tool.instructions = 'draw_' + tool.id + '_instructions';
        }


      });
})();
