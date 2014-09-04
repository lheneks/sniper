var cacheId = new Date().toString('M-d-yyyy-HH-mm-ss');
sniper.constant("cacheId", cacheId);

sniper.config(['$routeProvider', '$httpProvider', '$provide', function ($routeProvider, $httpProvider, $provide) {

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    var t = function (templateUrl) {
        var url = templateUrl + '?cacheId=' + cacheId;
        return url;
    };
    
    // NOTE: Please keep the routes alphabetically organized, at least for the root (accounting, candidate, company etc)

    // it'd be nice to just add a permission parameter to the route parameter in when
    // however that doesn't get passed when listening to a broadcast of routes changing
    $routeProvider.
		when('/search/add-config', { templateUrl: t('partials/search/add-config.html'), controller: CreateOrEditSearchConfigCtrl }).
		when('/search/list', { templateUrl: t('partials/search/list.html'), controller: SearchListCtrl }).
		when('/search/edit/:id', { templateUrl: t('partials/search/add-config.html'), controller: CreateOrEditSearchConfigCtrl }).
		when('/', { redirectTo: '/search/list/' });
}]);

var SearchListCtrl = ['$scope', 'searchConfigService', 'ebayService',
    function ($scope, searchConfigService, ebayService) {

        $scope.init = function() {
            searchConfigService.list().then(function (response) {
                $scope.searchConfigs = response;
            });
        };

        $scope.runSearch = function (config) {
            ebayService.search(config.Keywords).then(function(data) {
                searchConfigService.saveRun(config.Id, data);
            }).then(function() {
                config.hasRun = true;
            });
        };
        
        $scope.init();
    }];

var CreateOrEditSearchConfigCtrl = ['$scope', '$http', '$routeParams', 'searchConfigService', 'parsers',
    function ($scope, $http, $routeParams, searchConfigService, parsers) {

        $scope.model = {};
        $scope.latestRun = {};
        $scope.showSavedMessage = false;
        $scope.model.filterText = "";

        $scope.init = function () {
            searchConfigService.getConfig($scope.configId)
                .then(function(response) {
                    $scope.latestRun = response.LatestRun;
                    response.latestRun = [];
                    $scope.model = response;
                    $scope.latestRun.SearchTime = parsers.date($scope.latestRun.SearchTime).toDateString();
//                    console.log(response);
                });
        };

        $scope.saveConfig = function() {
            searchConfigService.save( $scope.model ).then(function() {
                $scope.showSavedMessage = true;
            });
        };
        
        $scope.filterFn = function (item) {
            if (!$scope.model.filterText || $scope.model.filterText == "")
                return true;
            
            return item.Title.toLowerCase().indexOf($scope.model.filterText) > -1;
        };

        $scope.calculateItemClass = function (model, item) {
            
            if (!model || !item)
                return '';

            if (!model.FoilOk && item.IsFoil)
                return 'remove-foil';
            
            console.log(String.format('item.UnitPrice: {0} < model.TargetPrice: {1}', item.UnitPrice, model.TargetPrice));
            
            if (Number(item.UnitPrice) < Number(model.TargetPrice))
                return 'match';

            return '';
        };
       
        if ($routeParams && $routeParams.id) {
            $scope.configId = $routeParams.id;
            $scope.init();
        }
    }];

sniper.controller(SearchListCtrl);
sniper.controller(CreateOrEditSearchConfigCtrl);