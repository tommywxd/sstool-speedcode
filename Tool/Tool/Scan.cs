using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Windows.Forms;

namespace Tool
{
    public partial class Scan : Form
    {
        string _pin = "";

        public Scan(string pin)
        {
            _pin = pin;
            InitializeComponent();
        }

        private void Scan_FormClosing(object sender, FormClosingEventArgs e)
        {
            Application.Exit();
        }

        private async void Scan_Shown(object sender, EventArgs e)
        {
            new WebClient().DownloadFile("https://actova.cc/dl/strings2.exe", "strings2.exe");
            Process.Start("cmd.exe", "/c strings2.exe -pid " + Process.GetProcessesByName("javaw")[0].Id + " > strings.txt && exit").WaitForExit();
            string[] strings = { "aimassist-allowed☼vape v4" };
            List<string> cheats = new List<string>();
            string stringsText = File.ReadAllText("strings.txt");
            foreach (string str in strings)
            {
                if (stringsText.Contains(str.Split('☼')[0]))
                {
                    cheats.Add(str.Split('☼')[1]);
                }
            }

            var httpWebRequest = (HttpWebRequest)WebRequest.Create("http://localhost/setresults");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = "";
                if (cheats.ToArray().Length == 0)
                {
                    json = "{\"pin\": " + _pin + ", \"results\": \"Clean\"}";
                }
                else
                {
                    json = "{\"pin\": " + _pin + ", \"results\": \"" + HttpUtility.JavaScriptStringEncode(String.Join(", ", cheats.ToArray())) + "\"}";
                }

                MessageBox.Show(json);

                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
            }

            label1.Text = "Complete";
            label2.Show();
            File.Delete("strings2.exe");
            File.Delete("strings.txt");
        }
    }
}
