export const USERS_TOPIC = "users";

export class TopicFactory {
  constructor(private readonly userID: string) {}

  makeUserTopic(topic: string): string {
    return `${USERS_TOPIC}/${this.userID}/${topic}`.replace(/\/+/g, "/");
  }

  parseUserTopic(fullTopic: string): { userID: string; topic: string } | null {
    const parts = fullTopic.split("/").filter(Boolean);
    if (
      parts[0] === USERS_TOPIC &&
      parts[1] === this.userID &&
      parts.length >= 3
    ) {
      return {
        userID: parts[1],
        topic: parts.slice(2).join("/"),
      };
    }
    return null;
  }

  isUserTopic(fullTopic: string): boolean {
    return this.parseUserTopic(fullTopic) !== null;
  }
}
