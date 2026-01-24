const websocketServerURL = process.env.NEXT_PUBLIC_WEBSOCKET_MQTT_URL;

export class PATHS {
  static pcStatus(token: string, id: string) {
    return getWebSocketUrl(token, "/pc/" + id + "/status");
  }
}

export function getWebSocketUrl(token: string, path: string): string {
  const url = new URL(websocketServerURL + path);
  url.searchParams.append("token", token);
  return url.toString();
}