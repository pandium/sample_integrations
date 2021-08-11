using System;
using System.Globalization;
using System.IO;
using System.Linq;
using CsvHelper;
using Newtonsoft.Json;
using NLog;
using RestSharp;

namespace hubspot2s3
{
    class Program
    {
        private static readonly NLog.Logger s_logger = NLog.LogManager.GetCurrentClassLogger();

        static void Main(string[] args)
        {
            var _config = new NLog.Config.LoggingConfiguration();
            var _logfile = new NLog.Targets.FileTarget("logfile") { FileName = "file.txt" };
            var _logconsole = new NLog.Targets.ConsoleTarget("logconsole");
            _config.AddRule(LogLevel.Info, LogLevel.Fatal, _logconsole);
            _config.AddRule(LogLevel.Debug, LogLevel.Fatal, _logfile);
            NLog.LogManager.Configuration = _config;

            Config.FromEnv();
            Secrets.FromEnv();
            Context.FromEnv();

            Console.WriteLine($"This run is in mode: {Context.GetValue("run_mode")}");

            HubSpot _hubSpot = new HubSpot(Secrets.GetValue("hubspot-basic_api_key"),
                    Secrets.GetValue("hubspot-oauth_access_token"));

            S3 _s3File = new S3(Secrets.GetValue("aws_access_key_id"), Secrets.GetValue("aws_secret_access_key"),
                    Config.GetValue("s3_bucket_name"), Config.GetValue("s3_file_name"), Config.GetValue("s3_region_name"));

            using (var _csv = new CsvReader(new StreamReader(_s3File.S3InputStream), CultureInfo.InvariantCulture))
            {
                _csv.Read();
                _csv.ReadHeader();
                while (_csv.Read())
                {
                    if (bool.Parse(Config.GetValue("make_contact")))
                    {
                        var _dataRecord = Enumerable.ToList(_csv.GetRecord<dynamic>());
                        s_logger.Info($"Creating Contact: {string.Join(",", _dataRecord)}");
                        IRestResponse _resp = _hubSpot.Create("contacts", HubSpotContactFromRow(_csv));
                        s_logger.Info(_resp.StatusCode.ToString());
                    }
                    if (bool.Parse(Config.GetValue("make_company")))
                    {
                        var _dataRecord = Enumerable.ToList(_csv.GetRecord<dynamic>());
                        s_logger.Info($"Creating Company: {string.Join(",", _dataRecord)}");
                        IRestResponse _resp = _hubSpot.Create("companies", HubSpotCompanyFromRow(_csv));
                        s_logger.Info(_resp.StatusCode.ToString());
                    }
                }
            }
        }

        public static string HubSpotContactFromRow(CsvReader Record)
        {
            var _contact = new
            {
                properties = new[]
                {
                    new { property = "email", value = Record.GetField<string>("email") },
                    new { property = "firstname", value = Record.GetField<string>("first_name") },
                    new { property = "lastname", value = Record.GetField<string>("last_name") },
                    new { property = "company", value = Record.GetField<string>("company") },
                    new { property = "city", value = Record.GetField<string>("city") },
                    new { property = "state", value = Record.GetField<string>("state") },
                    new { property = "country", value = Record.GetField<string>("country") },
                    new { property = "zip", value = Record.GetField<string>("zip") }
                }
            };

            return JsonConvert.SerializeObject(_contact);
        }

        public static string HubSpotCompanyFromRow(CsvReader Record)
        {
            var _company = new
            {
                properties = new[]
                {
                    new { name = "name", value = Record.GetField<string>("company") },
                    new { name = "description", value = Record.GetField<string>("desc") }
                }
            };

            return JsonConvert.SerializeObject(_company);
        }
    }
}