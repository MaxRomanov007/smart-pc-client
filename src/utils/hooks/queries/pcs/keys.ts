export abstract class pcsQueryKeys {
  static pcs = ["pcs"];

  static slugPc(slug: string) {
    return [...this.pcs, "slug:" + slug];
  }

  static idPc(id: string) {
    return [...this.pcs, id];
  }
}

export abstract class pcsMutationKeys {
  static editPc(id: string) {
    return ["editPc", id];
  }
}
