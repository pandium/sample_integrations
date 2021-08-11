using System;
using System.Collections.Generic;
using RestSharp;

namespace hubspot2s3
{
    public class HubSpot
    {

        private static readonly NLog.Logger s_logger = NLog.LogManager.GetCurrentClassLogger();
        private readonly string _headers = "";
        private readonly string _queryString = "";

        public HubSpot(string HubSpotApiKey, string HubSpotAccessToken)
        {
            if (HubSpotApiKey != "")
            {
                _queryString = HubSpotApiKey;
            }
            else if (HubSpotAccessToken != "")
            {
                _headers = $"Bearer {HubSpotAccessToken}";
            }
        }

        public static string RelativeEntityUrl(string Entity, string Key)
        {
            Dictionary<string, string> _v1 = new Dictionary<string, string>()
            {
                { "contacts", "contact" }
            };
            Dictionary<string, string> _v2 = new Dictionary<string, string>()
            {
                {  "companies", "companies" }
            };

            string _rtn = "";

            if (_v1.ContainsKey(Entity))
            {
                _rtn = $"{Entity}/v1/{_v1[Entity]}";
            }
            else
            {
                _rtn = $"{Entity}/v2/{_v2[Entity]}";
            }

            if (Key != "")
            {
                _rtn += $"/{Key}";
            }

            return _rtn;
        }

        public string AbsoluteUrl(string Relative)
        {
            return $"https://api.hubapi.com/{Relative}";
        }

        public string GetFqdn(string Entity, string Key)
        {
            return AbsoluteUrl(RelativeEntityUrl(Entity, Key));
        }

        private IRestResponse Get(string Url, string Data)
        {
            var _client = new RestClient();
            var _request = new RestRequest(Url, Method.GET);
            _request.AddQueryParameter("hapikey", _queryString);
            _request.AddHeader("Content-Type", "application/json");
            _request.AddHeader("Authorization", _headers);

            return _client.Execute(_request);
        }

        private IRestResponse Post(string Url, string Data)
        {
            var _client = new RestClient();
            var _request = new RestRequest(Url, Method.POST);
            _request.AddQueryParameter("hapikey", _queryString);
            _request.AddHeader("Content-Type", "application/json");
            _request.AddHeader("Authorization", _headers);
            _request.AddJsonBody(Data);

            return _client.Execute(_request);
        }

        private IRestResponse Put(string Url, string Data)
        {
            var _client = new RestClient();
            var _request = new RestRequest(Url, Method.PUT);
            _request.AddQueryParameter("hapikey", _queryString);
            _request.AddHeader("Content-Type", "application/json");
            _request.AddHeader("Authorization", _headers);
            _request.AddJsonBody(Data);

            return _client.Execute(_request);
        }

        public IRestResponse Create(string Entity, string Data)
        {
            s_logger.Info($"Attempting to create a {Entity}");
            return Post(GetFqdn(Entity, ""), Data);

        }

        public IRestResponse Replace(string Entity, string Key, string Data)
        {
            s_logger.Info($"Attempting to replace a {Entity}/{Key}");
            return Put(GetFqdn(Entity, Key), Data);
        }
    }
}