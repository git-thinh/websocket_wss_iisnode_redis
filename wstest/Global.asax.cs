using Microsoft.ServiceModel.WebSockets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;

namespace wstest
{
    public class NotifyServiceFactory : ServiceHostFactory
    {
        protected override ServiceHost CreateServiceHost(Type serviceType, Uri[] baseAddresses)
        {
            WebSocketHost host = new WebSocketHost(serviceType, baseAddresses);

            var bindingSsl = WebSocketHost.CreateWebSocketBinding(true);
            host.AddWebSocketEndpoint(bindingSsl);

            //host.AddWebSocketEndpoint();
            return host;
        }
    }

    public class NotifyService : WebSocketService
    {
        public override void OnOpen()
        {
        }

        public override void OnMessage(string message)
        {
            this.Send(message + DateTime.Now.ToString());
        }
 
        protected override void OnClose()
        {
            base.OnClose();
        }

        protected override void OnError()
        {
            base.OnError();
        }
    }

    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            RouteTable.Routes.Add(new ServiceRoute("ws/test", new NotifyServiceFactory(), typeof(NotifyService)));
        }



    }
}