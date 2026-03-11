export type Municipality = {
  id: string;
  name: string;
};

export const municipalityFixture = ({
  ...props
}: Partial<Municipality> = {}): Municipality => {
  const defaults = {
    id: "00001",
    name: "Some municipality",
  };
  return { ...defaults, ...props };
};
