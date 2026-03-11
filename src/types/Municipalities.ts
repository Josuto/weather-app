import { Municipality } from "@type/Municipality";

/**
 * Inspired in the Decorator design pattern, this class is a wrapper for an array of municipalities.
 *
 * While instances of this class are iterable and include some JS Array logic, I was not very much
 * interested in implementing the Array interface. Actually, I just wanted to prove a friend of mine
 * (Aral Roca) the benefits of introducing OO concepts in React apps.
 *
 * JS classes are great to encapsulate the logic of the real world objects they model, and if assured
 * to be inmutable, class instances can be used as state variables. You may think that this class may
 * look as an over-engineering effort, but since municipalities manipulation is pretty frequently done
 * in this code base, it well payed its price, as it simplified the implementation of some other code
 * elsewhere.
 */
export class Municipalities {
  // Use a private property. Jest's toEqual can inspect this during deep equality checks.
  private readonly _municipalities: ReadonlyArray<Municipality>;

  constructor(items?: Municipality[]) {
    this._municipalities = this.deepCopy(items || []);
  }

  private deepCopy(items: Municipality[]): ReadonlyArray<Municipality> {
    // Ensure the array and its objects are immutable
    return Object.freeze(items);
  }

  [Symbol.iterator](): Iterator<Municipality> {
    let index = 0;
    const items = this._municipalities;

    return {
      next(): IteratorResult<Municipality> {
        if (index < items.length) {
          return { value: items[index++], done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }

  map<U>(
    callbackfn: (
      value: Municipality,
      index: number,
      array: ReadonlyArray<Municipality>
    ) => U
  ): U[] {
    return this._municipalities.map(callbackfn);
  }

  getIds(): string[] {
    return this._municipalities.map((municipality) => municipality.id);
  }

  removeById(id: string): Municipalities {
    const filtered = this._municipalities.filter(
      (municipality) => municipality.id !== id
    );
    return new Municipalities(filtered as Municipality[]);
  }

  add(municipality: Municipality | null): Municipalities {
    if (municipality) {
      return new Municipalities([...this._municipalities, municipality]);
    }
    return new Municipalities([...this._municipalities]);
  }

  length(): number {
    return this._municipalities.length;
  }
}
