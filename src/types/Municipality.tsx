export type MunicipalityType = {
  id: string;
  name: string;
  provinceId: string;
  provinceName: string;
};

export class Municipality {
  readonly id: string;
  readonly name: string;
  readonly provinceId: string;
  readonly provinceName: string;

  constructor(municipality: MunicipalityType) {
    this.id = municipality.id;
    this.name = municipality.name;
    this.provinceId = municipality.provinceId;
    this.provinceName = municipality.provinceName;
  }
}

export const municipalityFixture = ({
  ...props
}: Partial<MunicipalityType> = {}): Municipality => {
  const defaults = new Municipality({
    id: "00001",
    name: "Some municipality",
    provinceId: "01",
    provinceName: "Some province",
  });
  return new Municipality({...defaults, ...props});
};
