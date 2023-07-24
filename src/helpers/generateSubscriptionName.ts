import getBrowserInfo from "./getBrowserInfo";

export default function generateSubscriptionName() {
  const agent = getBrowserInfo();
  return [agent.browser.name, agent.browser.version, agent.browser.os]
    .filter((e) => e !== null)
    .join(" - ");
}
