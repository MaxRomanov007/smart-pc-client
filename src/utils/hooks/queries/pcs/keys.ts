export class pcsQueryKeys {
  static pcs = ["pcs"];

  static slugPc(slug: string) {
    return [...this.pcs, "slug:" + slug];
  }
}

export class pcsMutationKeys {
  static editPc(id: string) {
    return ["editPc", id];
  }
}
