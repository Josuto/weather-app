import {
  mapToMunicipalities,
  ExternalMunicipality,
} from "@infrastructure/ExternalMunicipality";

describe("Given the mapToMunicipalities function", () => {
  describe("Happy path - data transformation", () => {
    it("should map an array of external municipalities to municipalities", () => {
      const externalMunicipalities: ExternalMunicipality[] = [
        { id: "id28001", nombre: "Madrid" },
        { id: "id28002", nombre: "Alcalá de Henares" },
        { id: "id28003", nombre: "Getafe" },
      ];

      const result = mapToMunicipalities(externalMunicipalities);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ id: "28001", name: "Madrid" });
      expect(result[1]).toEqual({ id: "28002", name: "Alcalá de Henares" });
      expect(result[2]).toEqual({ id: "28003", name: "Getafe" });
    });

    it("should remove 'id' prefix from municipality IDs", () => {
      const externalMunicipalities: ExternalMunicipality[] = [
        { id: "id46001", nombre: "Valencia" },
        { id: "id46002", nombre: "Torrent" },
      ];

      const result = mapToMunicipalities(externalMunicipalities);

      expect(result[0].id).toBe("46001");
      expect(result[1].id).toBe("46002");
    });

    it("should trim trailing spaces from municipality names", () => {
      const externalMunicipalities: ExternalMunicipality[] = [
        { id: "id48001", nombre: "Bilbao " },
        { id: "id48002", nombre: "  Getxo" },
        { id: "id48003", nombre: "  Baracaldo  " },
      ];

      const result = mapToMunicipalities(externalMunicipalities);

      expect(result[0].name).toBe("Bilbao");
      expect(result[1].name).toBe("Getxo");
      expect(result[2].name).toBe("Baracaldo");
    });

    it("should deduplicate municipalities by name in a single pass", () => {
      const externalMunicipalities: ExternalMunicipality[] = [
        { id: "id28001", nombre: "Madrid" },
        { id: "id28002", nombre: "Madrid" },
        { id: "id28003", nombre: "Alcalá de Henares" },
        { id: "id28004", nombre: "Alcalá de Henares" },
        { id: "id28005", nombre: "Madrid" },
      ];

      const result = mapToMunicipalities(externalMunicipalities);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: "28001", name: "Madrid" });
      expect(result[1]).toEqual({ id: "28003", name: "Alcalá de Henares" });
    });

    it("should deduplicate municipalities with trailing spaces", () => {
      const externalMunicipalities: ExternalMunicipality[] = [
        { id: "id28001", nombre: "Madrid " },
        { id: "id28002", nombre: "Madrid " },
        { id: "id28003", nombre: "  Madrid  " },
      ];

      const result = mapToMunicipalities(externalMunicipalities);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: "28001", name: "Madrid" });
    });

    it("should handle an empty array", () => {
      const externalMunicipalities: ExternalMunicipality[] = [];

      const result = mapToMunicipalities(externalMunicipalities);

      expect(result).toEqual([]);
    });

    it("should handle a single municipality", () => {
      const externalMunicipalities: ExternalMunicipality[] = [
        { id: "id34001", nombre: "Palencia " },
      ];

      const result = mapToMunicipalities(externalMunicipalities);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ id: "34001", name: "Palencia" });
    });

    it("should preserve order based on first occurrence", () => {
      const externalMunicipalities: ExternalMunicipality[] = [
        { id: "id50001", nombre: "Zaragoza" },
        { id: "id50002", nombre: "Huesca" },
        { id: "id50003", nombre: "Zaragoza" },
        { id: "id50004", nombre: "Teruel" },
        { id: "id50005", nombre: "Huesca" },
      ];

      const result = mapToMunicipalities(externalMunicipalities);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("Zaragoza");
      expect(result[1].name).toBe("Huesca");
      expect(result[2].name).toBe("Teruel");
    });
  });
});
