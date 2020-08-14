using Fleck;
using System;
using System.Security.Cryptography;
using System.Security.Permissions;
using System.IO;
using System.Security.Cryptography.X509Certificates;

namespace wss_test
{
    class Program
    {
        static void Main(string[] args)
        {
            test_wss();
        }

        static void test_wss()
        {
            string url_ws = "ws://127.0.0.1:8080";

            Console.Title = url_ws;
            var ws = new WebSocketServer(url_ws);
            ws.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    Console.WriteLine("Open!");
                };
                socket.OnClose = () =>
                {
                    Console.WriteLine("Close!");
                };
                socket.OnError = (e) => {
                    ;
                };
                socket.OnMessage = message => socket.Send(message + " - " + DateTime.Now.ToString());
            });

            //var wss = new WebSocketServer(url_wss);
            //wss.Certificate = new X509Certificate2("test.iot.vn.pfx", "Thinh@12345");
            //wss.Start(socket =>
            //{
            //    socket.OnOpen = () => Console.WriteLine("Open!");
            //    socket.OnClose = () => Console.WriteLine("Close!");
            //    socket.OnMessage = message => socket.Send(message + " - " + DateTime.Now.ToString());
            //});

            Console.ReadLine();
        }

    }
}
