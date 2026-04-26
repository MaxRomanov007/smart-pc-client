export abstract class pcsQueryKeys {
  static index = ["pcs"];

  static pcs = [...this.index, "pcs"];

  static slugPc(slug: string) {
    return [...this.pcs, "slug:" + slug];
  }

  static idPc(id: string) {
    return [...this.pcs, id];
  }
}

export abstract class pcsMutationKeys {
  static editPc(id: string) {
    return ["edit-pc", id];
  }

  static deletePc(id: string) {
    return ["delete-pc", id];
  }
}
