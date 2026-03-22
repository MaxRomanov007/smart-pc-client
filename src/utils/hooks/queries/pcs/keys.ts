export class pcsQueryKeys {
  static pcs = ["pcs"];

  static slugPc(slug: string) {
    return [...this.pcs, slug];
  }
}
