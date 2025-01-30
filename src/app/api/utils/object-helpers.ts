export function isPresent(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }
  if (Array.isArray(obj) && obj.length === 0) {
    return false;
  }
  if (obj === '') {
    return false;
  }

  return true;
}

export function isNil(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }

  return false;
}
