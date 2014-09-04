using System;
using System.Collections.Generic;

namespace sniper.Models
{
    public class SearchConfig
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Keywords { get; set; }
        public double? TargetPrice { get; set; }
        public bool FoilOk { get; set; }
        public double? FoilTargetPrice { get; set; }
        public SearchData LatestRun { get; set; }
    }

    public class SearchData
    {
        public int SearchConfigId { get; set; }
        public DateTime SearchTime { get; set; }
        public List<SearchResult> Results { get; set; }
    }

    public class SearchResult
    {
        public DateTime SearchTime { get; set; }

        public string UnitPrice { get; set; }
        public string Condition { get; set; }
        public string Country { get; set; }
        public string GalleryUrl { get; set; }
        public string ItemId { get; set; }
        public ListingInfo ListingInfo { get; set; }
        public SellingStatus SellingStatus { get; set; }
        public ShippingInfo ShippingInfo { get; set; }
        public string Title { get; set; }
        public bool TopRatedListing { get; set; }
        public string ViewItemURL { get; set; }
        public bool IsFoil { get; set; }
    }

    public class ShippingInfo
    {
        public string ShippingType { get; set; }
    }

    public class ListingInfo
    {
        public bool BestOfferEnabled { get; set; }
        public bool BuyItNowAvailable { get; set; }
        public DateTime? EndTime { get; set; }
        public string ListingType { get; set; }
        public DateTime? StartTime { get; set; }
    }

    public class SellingStatus
    {
        public double? ConvertedCurrentPrice { get; set; }
        public double? CurrentPrice { get; set; }
        public double? SellingState { get; set; }
        public string TimeLeft { get; set; }

    }
}