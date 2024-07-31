import { Municipality } from "./Municipality";

export class Municipalities {
  private _getMunicipalities: () => Municipality[];
  getLength: () => number;
  private _setLength: (value: number) => void;

  constructor(municipalities?: Municipality[]) {
    const _municipalities: Municipality[] = municipalities ?? [];
    let _length = municipalities?.length ?? 0;

    this.getLength = function () {
      return _length;
    };

    this._setLength = function (value: number) {
      _length = value;
    };

    this._getMunicipalities = function () {
      return _municipalities;
    };
  }

  get length() {
    return this.getLength();
  }

  [Symbol.iterator](): Iterator<Municipality> {
    let index = 0;
    const municipalities = this._getMunicipalities(); // Capture the array in a local variable

    return {
      next(): IteratorResult<Municipality> {
        if (index < municipalities.length) {
          return { value: municipalities[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }

  map<U>(
    callbackfn: (value: Municipality, index: number, array: Municipality[]) => U
  ): U[] {
    return this._getMunicipalities().map(callbackfn);
  }

  getIds(): string[] {
    return this._getMunicipalities().reduce((municipalityIds: string[], municipality) => {
      municipalityIds.push(municipality.id);
      return municipalityIds;
    }, []);
  }

  removeById(id: string): Municipalities {
    const municipalities = new Municipalities(
      this._getMunicipalities().filter(
        (currentMunicipality) => currentMunicipality.id !== id
      )
    );
    this._setLength(municipalities.length);
    return municipalities;
  }

  add(municipality: Municipality | null): Municipalities {
    const municipalities = this._getMunicipalities();
    if (municipality) municipalities.push(municipality);
    return new Municipalities(municipalities);
  }
}
