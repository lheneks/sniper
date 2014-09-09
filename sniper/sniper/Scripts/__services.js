sniper.factory('searchConfigService', ['$http', function ($http) {
    var get = function(url, params) {
        var promise = $http.get(url, params)
            .then(function(response) {
                return response.data;
            });

        return promise;
    };

    return {
        getConfig: function(id) {
            return get("/SearchConfigApi/GetConfig", { params: { id: id } });
        },
        list:function() {
            return get("/SearchConfigApi/List");
        },
        save: function (config) {
            return $http.post('/SearchConfigApi/AddOrUpdateSearchConfig/', { config: config });
        },
        saveRun: function(configId, runData) {
            $http.post('/SearchConfigApi/SaveRunData/', { SearchTime: new Date(), SearchConfigId: configId, Results: runData });
        }
    };
}]);



sniper.factory('parsers',[ function() {
    return {
        date: function(value) {
            var a;
            if (typeof value === 'string') {
                a = /\/Date\((\d*)\)\//.exec(value);
                if (a) {
                    return new Date(+a[1]);
                }
            }
            return value;
        }
    };
}]);

sniper.factory('ebayService', ['$http', function ($http) {
  
    var searchUrl = function (keywords) {
        keywords = "mtg " + keywords + " -alter -altered -custom -proxy";
        keywords = keywords.replace(" ", "%20");

        function buildURLArray(filterArray) {
            var urlFilter = "";
            // Iterate through each filter in the array
            for (var i = 0; i < filterArray.length; i++) {
                //Index each item filter in filterarray
                var itemfilter = filterArray[i];
                // Iterate through each parameter in each item filter
                for (var index in itemfilter) {
                    // Check to see if the paramter has a value (some don't)
                    if (itemfilter[index] !== "") {
                        if (itemfilter[index] instanceof Array) {
                            for (var r = 0; r < itemfilter[index].length; r++) {
                                var value = itemfilter[index][r];
                                urlFilter += "&itemFilter\(" + i + "\)." + index + "\(" + r + "\)=" + value;
                            }
                        } else {
                            urlFilter += "&itemFilter\(" + i + "\)." + index + "=" + itemfilter[index];
                        }
                    }
                }
            }
            return urlFilter;
        }

        var filters = buildURLArray([
//                {
//                    "name": "MaxPrice",
//                    "value": "25",
//                    "paramName": "Currency",
//                    "paramValue": "USD"
//                },
//            {
//                "name": "FreeShippingOnly",
//                "value": "true",
//                "paramName": "",
//                "paramValue": ""
//            },
            {
                "name": "ListingType",
                "value": ["AuctionWithBIN", "FixedPrice"],
                "paramName": "",
                "paramValue": ""
            }
        ]);

        var url = "http://svcs.ebay.com/services/search/FindingService/v1";
        url += "?X-EBAY-SOA-OPERATION-NAME=findItemsByKeywords";
        url += "&SERVICE-VERSION=1.0.0";
        url += "&SECURITY-APPNAME=LucasHen-ceda-4979-a077-97524ee5e32b";
        url += "&GLOBAL-ID=EBAY-US";
        url += "&RESPONSE-DATA-FORMAT=JSON";
        url += "&callback=JSON_CALLBACK";
        url += "&REST-PAYLOAD";
        url += "&keywords=" + keywords;
        url += "&paginationInput.entriesPerPage=100";
        url += filters;

        return url;
    };
    
    return {
        search: function(keywords) {
            var url = searchUrl(keywords);

            var a = function (array) {
                return array ? array[0] : {};
            };
            
            var p = function (title, currentPrice, buyItNow, shippingInfo) {

                var shippingCost = a(shippingInfo.shippingServiceCost).__value__;
                var price = shippingCost ? Number(shippingCost) : 0.0;


                if (buyItNow && buyItNow.length > 0) {
                    price += Number(buyItNow[0].__value__);
                    console.log(title + " ----- price: " + price + " ------ buy it now: " + buyItNow[0].__value__ + " shippingCost: " + shippingCost);
                } else {
                    price += Number(currentPrice);
                    console.log(title + " ----- price: " + price + " ------ currentPrice: " + currentPrice + " shippingCost: " + shippingCost);
                }

                if (title.toLowerCase().indexOf("4x") > -1 || title.toLowerCase().indexOf("x4") > -1) {
                    return price / 4;
                }
                if (title.toLowerCase().indexOf("3x") > -1 || title.toLowerCase().indexOf("x3") > -1) {
                    return price / 3;
                }
                if (title.toLowerCase().indexOf("2x") > -1 || title.toLowerCase().indexOf("x2") > -1) {
                    return price / 2;
                }

                return price;
            };
            
           return $http.jsonp(url)
                .then(function(data) {
                    var results = [];

                    var items = data.data.findItemsByKeywordsResponse[0].searchResult[0].item;
//                    console.log("raw");
//                    console.log(items);
//                    console.log("shippingInfo");

                    _.each(items, function(item) {
                        var listingInfo = item.listingInfo[0];
                        var sellingStatus = item.sellingStatus[0];
                        var shippingInfo = a(item.shippingInfo);

                        //                        console.log(shippingInfo);

                        results.push({
                            UnitPrice: p(a(item.title), sellingStatus.currentPrice[0].__value__,listingInfo.buyItNowPrice, shippingInfo),
                            Condition: a(item.condition),
                            Country: a(item.country),
                            GalleryUrl: a(item.galleryURL),
                            ItemId: a(item.itemId),
                            ListingInfo: {
                                BestOfferEnabled: a(listingInfo.bestOfferEnabled),
                                BuyItNowAvailable: a(listingInfo.buyItNowAvailable),
                                BuyItNowPrice: a(listingInfo.buyItNowPrice).__value__,
                                EndTime: a(listingInfo.endTime),
                                ListingType: a(listingInfo.listingType),
                                StartTime: a(listingInfo.startTime)
                            },
                            SellingStatus: {
                                ConvertedCurrentPrice: sellingStatus.convertedCurrentPrice[0].__value__,
                                CurrentPrice: sellingStatus.currentPrice[0].__value__,
                                SellingState: a(sellingStatus.sellingState),
                                TimeLeft: a(sellingStatus.timeLeft)
                            },
                            ShippingInfo: { ShippingType: a(shippingInfo.shippingType), ShippingServiceCost:a(shippingInfo.shippingServiceCost).__value__ },
                            Title: a(item.title),
                            TopRatedListing: a(item.topRatedListing),
                            ViewItemUrl: a(item.viewItemURL)
                        });
                    });

                    return results;
                });
        }
    };
}]);