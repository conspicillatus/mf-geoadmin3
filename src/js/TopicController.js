(function() {
  goog.provide('ga_topic_controller');

  var module = angular.module('ga_topic_controller', []);

  module.controller('GaTopicController',
      ['$scope', 'gaPermalink', 'gaGlobalOptions',
        function($scope, gaPermalink, gaGlobalOptions) {
          $scope.options = {
            defaultTopicId: 'inspire',
            url: gaGlobalOptions.serviceUrl + '/FIXME'
          };
      }]);
})();
