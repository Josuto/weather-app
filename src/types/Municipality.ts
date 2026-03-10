export class Municipality {
  readonly id!: string;
  readonly name!: string;

  constructor(municipality: Pick<Municipality, "id" | "name">) {
    Object.assign(this, municipality);
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export const municipalityFixture = ({
  ...props
}: Partial<Municipality> = {}): Municipality => {
  const defaults = new Municipality({
    id: "00001",
    name: "Some municipality",
  });
  return new Municipality({ ...defaults, ...props });
};
