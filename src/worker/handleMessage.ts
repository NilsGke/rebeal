declare let self: ServiceWorkerGlobalScope & { __WB_DISABLE_DEV_LOGS: boolean };

export type WorkerMessage = Ping;

interface Command {
  command: string;
  data?: any;
  response?: any;
}
// all commands

interface Ping extends Command {
  command: "ping";
  response: "pong";
}

export type MessageResponse = {
  initiatingCommand: WorkerMessage["command"];
  response: WorkerMessage["response"];
};

export const communicationChannel = new BroadcastChannel("sw-messages");

export default async function handleMessage(
  data: Omit<WorkerMessage, "response">
) {
  const respondToClient = (response: WorkerMessage["response"]) => {
    communicationChannel.postMessage({
      initiatingCommand: data.command,
      response,
    } as MessageResponse);
  };

  switch (data.command) {
    case "ping":
      respondToClient("pong");
      break;

    default:
      console.error("message has no known command to execute", data);
  }
}
