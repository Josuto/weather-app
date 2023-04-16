export class Municipality {
  readonly id!: string;
  readonly name!: string;
  readonly provinceId!: string;
  readonly provinceName!: string;

  constructor(municipality: Municipality) {
    Object.assign(this, municipality);
  }
}

export const municipalityFixture = ({
  ...props
}: Partial<Municipality> = {}): Municipality => {
  const defaults = new Municipality({
    id: "00001",
    name: "Some municipality",
    provinceId: "01",
    provinceName: "Some province",
  });
  return new Municipality({...defaults, ...props});
};

export const anotherMunicipalityFixture = ({
  ...props
}: Partial<Municipality> = {}): Municipality => {
  const defaults = new Municipality({
    id: "00002",
    name: "Another municipality",
    provinceId: "01",
    provinceName: "Some province",
  });
  return new Municipality({...defaults, ...props});
};
