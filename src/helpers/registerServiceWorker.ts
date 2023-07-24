import subscribeUserToPush, {
  sendSubscriptionToBackEnd,
} from "@/worker/subscribe";
import generateSubscriptionName from "./generateSubscriptionName";

export default async function registerServiceWorker() {
  // if (process.env.NODE_ENV === "development") return;

  if (!("serviceWorker" in navigator))
    throw new Error(
      "your browser does not support service workers\nNotifications will not work!\nplease try a different browsers"
    );

  await navigator.serviceWorker
    .register("/sw.js", {
      scope: "/app",
    })
    .then(
      (registration) =>
        new Promise<void>(async (resolve, reject) => {
          console.log("registered", registration);
          var serviceWorker;
          if (registration.installing) {
            serviceWorker = registration.installing;
            // console.log('Service worker installing');
          } else if (registration.waiting) {
            serviceWorker = registration.waiting;
            // console.log('Service worker installed & waiting');
          } else if (registration.active) {
            serviceWorker = registration.active;
            // console.log('Service worker active');
          }
          if (serviceWorker === undefined)
            return console.error(
              "service worker is undefined after registration"
            );

          // wait for service worker active
          serviceWorker.addEventListener("statechange", (e) => {
            if (e.target === null) return;
            if ((e.target as any).state == "activated") {
              const name = generateSubscriptionName();
              subscribeUserToPush(registration)
                .then((subscription) =>
                  sendSubscriptionToBackEnd(subscription, name)
                    .then(() => resolve())
                    .catch((err) => {
                      console.error(err);
                      reject(err);
                    })
                )
                .catch((err) => {
                  console.error(err);
                  reject(err);
                });
            }
          });
        }),
      (err) => {
        console.error("Service Worker registration failed: ", err);
        throw new Error("service worker registration failed!");
      }
    );
}
