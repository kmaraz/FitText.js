/* ng-FitText.js v3.1.0
 * https://github.com/patrickmarabeas/ng-FitText.js
 *
 * Original jQuery project: https://github.com/davatron5000/FitText.js
 * Includes use of Underscore's debounce function
 *
 * Copyright 2014, Patrick Marabeas http://marabeas.io
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 18/10/2014
 */

(function(window, document, angular, undefined) {

  'use strict';

  angular.module('ngFitText', [])
    .value( 'config', {
      'debounce': false,
      'delay': 250,
      'min': undefined,
      'max': undefined
    })

    .directive('fittext', ['$timeout', 'config', 'fitTextConfig', '$window', function($timeout, config, fitTextConfig, $window) {
      return {
        restrict: 'A',
        scope: true,
        link: function(scope, element, attrs) {
          angular.extend(config, fitTextConfig.config);

          var parent = document.getElementsByTagName('aside');
          var compressor = attrs.fittext || 0.9;
          var minFontSize = attrs.fittextMin || config.min || Number.NEGATIVE_INFINITY;
          var maxFontSize = attrs.fittextMax || config.max || Number.POSITIVE_INFINITY;
          var temp_size = 0;

          var resizer = function() {
            $timeout( function() {
              var ratio = element[0].offsetHeight / element[0].offsetWidth;
              var size = Math.max(
                Math.min(parent[0].offsetWidth * ratio * compressor,
                  parseFloat(maxFontSize)
                ),
                parseFloat(minFontSize)
              )
              element[0].style.fontSize = size + 'px';
              if(Math.round(temp_size) !== Math.round(size)) {
                temp_size = size
                resizer();
              }
            }, 50);
          };
          resizer();

          scope.$watch(attrs.ngModel, function() { resizer() });

          config.debounce
            ? angular.element(window).bind('resize', config.debounce(function(){ scope.$apply(resizer)}, config.delay))
            : angular.element(window).bind('resize', function(){ scope.$apply(resizer)});
        }
      }
    }])

    .provider('fitTextConfig', function() {
      var self = this;
      this.config = {};
      this.$get = function() {
        var extend = {};
        extend.config = self.config;
        return extend;
      };
      return this;
    });

})(window, document, angular);
