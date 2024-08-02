import { Municipality } from "@type/Municipality";

/**
 * Inspired in the Decorator design pattern, this class is a wrapper for an array of municipalities.
 *
 * While instances of this class are iterable and include some JS Array logic, I was not very much
 * interested in implementing the such an interface. Actually, I just wanted to prove a friend of mine
 * (Aral Roca) the benefits of introducing OO concepts in React apps.
 *
 * JS classes are great to encapsulate the logic of the real world objects they model, and if assured
 * to be inmutable, class instances can be used as state variables. You may think that this class may
 * look as an over-engineering effort, but since municipalities manipulation is pretty frequently done
 * in this code base, it well payed its price, as it simplified the implementation of some other code
 * elsewhere.
 */
export class Municipalities {
  private _getMunicipalities: () => Municipality[];

  constructor(municipalities?: Municipality[]) {
    const _municipalities: Municipality[] = municipalities ?? [];

    this._getMunicipalities = function () {
      return _municipalities;
    };
  }

  [Symbol.iterator](): Iterator<Municipality> {
    let index = 0;
    const municipalities = this._getMunicipalities();

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
    return municipalities;
  }

  add(municipality: Municipality | null): Municipalities {
    const municipalities = this._getMunicipalities();
    if (municipality) municipalities.push(municipality);
    return new Municipalities(municipalities);
  }

  length(): number {
    return this._getMunicipalities().length;
  }
}
