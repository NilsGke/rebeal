import { NotificationData } from "@/helpers/sendNotification";
import handleMessage, {
  WorkerMessage,
  communicationChannel,
} from "./handleMessage";

declare let self: ServiceWorkerGlobalScope & { __WB_DISABLE_DEV_LOGS: boolean };

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
self.__WB_DISABLE_DEV_LOGS = true;

// listen to message event from window

self.addEventListener("message", async (event) => {
  // HOW TO TEST THIS?
  // Run this in your browser console:
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})

  console.log("recieved message: ", event?.data);
});

self.addEventListener("activate", (event) => {
  console.log("\x1b[33mactive");
  communicationChannel.addEventListener(
    "message",
    (e: MessageEvent<Omit<WorkerMessage, "response">>) => {
      if (e.data.command !== undefined) handleMessage(e.data);
    }
  );
});

self.addEventListener("push", (event) => {
  const data = JSON.parse(event?.data.text() || "{}") as NotificationData;
  event?.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.content,
      icon: "/logo/icon-384x384.png",
      data: {
        url: data.url,
      },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event?.notification.close();
  const url: string | undefined = event?.notification.data.url;
  event?.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          // do something with `client`
        }
        return self.clients.openWindow(url || "/app");
      })
  );
});

// eslint-disable-next-line import/no-anonymous-default-export
export default "";
