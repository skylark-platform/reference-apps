export const hasProperty = <T, K extends PropertyKey>(
  object: T,
  property: K
): object is T & Record<K, unknown> => {
  return Object.prototype.hasOwnProperty.call(object, property);
};
