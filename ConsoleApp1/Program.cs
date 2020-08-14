using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            var ws = new WebSocket("wss://test.iot.vn:4439/ws/test");
            //var ws = new WebSocket("ws://test.iot.vn:8080/ws/test");
            ws.SslConfiguration.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) =>
            {
                // Do something to validate the server certificate.
                return true; // If the server certificate is valid.
            };

            ws.OnClose += (s, e) =>
            {
                ;
            };
            ws.OnOpen += (s, e) =>
            {
                ;
            };
            ws.OnMessage += (sender, e) => Console.WriteLine("Laputa says: " + e.Data);
            ws.OnError += (sender, e) =>
            {
                ;
            };
            ws.Connect();

            ws.Send("BALUS");

            Console.ReadKey(true);
        }
    }
}
