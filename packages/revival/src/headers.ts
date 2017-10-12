/**
 * Copyright (C) 2017-present Vincent Cheung
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Immutable set of http headers.
 */
export class RevivalHeaders {
  private readonly headers: Map<string, string[]> = new Map<string, string[]>();
  private readonly normalizedNames: Map<string, string> = new Map();

  constructor(headers?: string | { [name: string]: string | string[] }) {
    if (!headers) {
      return;
    }

    if (typeof headers === "string") {
      headers.split("\u000d\u000a").forEach(line => {
        let index = line.indexOf("\u003a\u0020");
        if (index > 0) {
          let name = line.slice(0, index);
          let value = line.slice(index + 1).trim();
          this.append(name, value);
        }
      });
    } else {
      Object.keys(headers).forEach(name => {
        let values: string | string[] = headers[name];
        let key = name.toLowerCase();
        if (typeof values === "string") {
          values = [values];
        }
        if (values.length > 0) {
          this.headers.set(name, values);
          this.setNormalizedName(key, name);
        }
      });
    }
  }

  private setNormalizedName(lowerCaseName: string, name: string) {
    if (!this.normalizedNames.has(lowerCaseName)) {
      this.normalizedNames.set(lowerCaseName, name);
    }
  }

  /**
   * Returns the names of the headers
   */
  keys(): string[] {
    return Array.from(this.normalizedNames.values());
  }

  /**
   * Checks for existence of header by given name.
   */
  has(name: string): boolean {
    return this.headers.has(name.toLowerCase());
  }

  /**
   * Get the first header which matches given name.
   *
   * @param name name of the header
   * @returns first header
   */
  get(name: string): string | null {
    let values = this.headers.get(name.toLowerCase());
    return values && values.length > 0 ? values[0] : null;
  }

  /**
   * Get all headers which matches given name.
   *
   * @param name name of the header
   * @returns all headers matches given name
   */
  getAll(name: string): string[] | null {
    return this.headers.get(name.toLowerCase()) || null;
  }

  /**
   * Append key-value into current headers. This will not override existed
   * value with the same key.
   *
   * @param name name to append
   * @param value to append
   * @see set
   */
  append(name: string, value: string | string[]): void {
    let key = name.toLowerCase();
    this.setNormalizedName(key, name);
    if (this.headers.has(key)) {
      this.headers.get(key)!.push(...value);
    } else {
      this.headers.set(key, typeof value === "string" ? [value] : value);
    }
  }

  /**
   * Append key-value into current headers. This will override existed
   * value with the same key.
   *
   * @param name name to append
   * @param value to append
   * @see append
   */
  set(name: string, value: string | string[]): void {
    let key = name.toLowerCase();
    this.setNormalizedName(key, name);
    this.headers.set(key, typeof value === "string" ? [value] : value);
  }

  /**
   * Delete key-value from current headers.
   *
   * @param name name in headers
   * @param value to delete
   */
  delete(name: string, value?: string | string[]): void {
    let key = name.toLowerCase();
    if (!this.headers.has(key)) {
      return;
    }

    if (!value) {
      this.headers.delete(key);
      this.normalizedNames.delete(key);
    } else {
      let existing = this.headers.get(key);
      if (!existing) {
        return;
      }
      existing = existing.filter(v => value.indexOf(v) === -1);
      if (existing.length === 0) {
        this.headers.delete(key);
        this.normalizedNames.delete(key);
      } else {
        this.headers.set(key, existing);
      }
    }
  }

  /**
   * Performs the specified action for each element in current headers.
   *
   * @param callbackfn calls the callbackfn function one time
   * for each element in headers.
   */
  forEach(callbackfn: (name: string, values: string[]) => void) {
    Array.from(this.normalizedNames.keys()).forEach(key =>
      callbackfn(this.normalizedNames.get(key)!, this.headers.get(key)!)
    );
  }
}
