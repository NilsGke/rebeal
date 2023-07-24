export default async function getNotificationSubscription() {
  const registration = await window.navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription === undefined || subscription === null)
    throw Error("Not subscribed Error: no subscription");

  return await fetch("/api/notifications/checkSubscription", {
    method: "POST",
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.subscriptionOnServer) {
        return subscription;
      } else {
        subscription.unsubscribe();
        throw Error("Not subscribed Error: subscription not on server");
      }
    });
}
