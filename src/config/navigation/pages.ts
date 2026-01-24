export class PAGES {
  static index = "/";

  static dashboard = this.index + "dashboard";

  static pc(slug: string) {
    return this.dashboard + "/" + slug;
  }
}
