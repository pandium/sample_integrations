using System;
using System.Collections;
using System.Collections.Generic;

namespace hubspot2s3
{
    public static class Config
    {
        private static readonly Dictionary<string, string> s_dic = new Dictionary<string, string>();

        public static void FromEnv()
        {
            foreach (DictionaryEntry de in Environment.GetEnvironmentVariables())
            {
                if (de.Key.ToString().StartsWith("PAN_CFG_"))
                {
                    s_dic.Add(de.Key.ToString().Replace("PAN_CFG_", "").ToLower(),
                        de.Value.ToString().Replace("\\n", "").Replace("\n", ""));
                }
            }
        }

        public static string GetValue(string Key)
        {
            if (s_dic.ContainsKey(Key))
            {
                return s_dic[Key];
            }
            else
            {
                return "";
            }
        }
    }

    public static class Secrets
    {
        private static readonly Dictionary<string, string> s_dic = new Dictionary<string, string>();

        public static void FromEnv()
        {
            foreach (DictionaryEntry de in Environment.GetEnvironmentVariables())
            {
                if (de.Key.ToString().StartsWith("PAN_SEC_"))
                {
                    s_dic.Add(de.Key.ToString().Replace("PAN_SEC_", "").ToLower(),
                        de.Value.ToString().Replace("\\n", "").Replace("\n", ""));
                }
            }
        }

        public static string GetValue(string Key)
        {
            if (s_dic.ContainsKey(Key))
            {
                return s_dic[Key];
            }
            else
            {
                return "";
            }
        }
    }

    public static class Context
    {
        private static readonly Dictionary<string, string> s_dic = new Dictionary<string, string>();

        public static void FromEnv()
        {
            foreach (DictionaryEntry de in Environment.GetEnvironmentVariables())
            {
                if (de.Key.ToString().StartsWith("PAN_CTX_"))
                {
                    s_dic.Add(de.Key.ToString().Replace("PAN_CTX_", "").ToLower(),
                            de.Value.ToString().Replace("\\n", "").Replace("\n", ""));
                }
            }
        }

        public static string GetValue(string Key)
        {
            if (s_dic.ContainsKey(Key))
            {
                return s_dic[Key];
            }
            else
            {
                return "";
            }
        }
    }
}
