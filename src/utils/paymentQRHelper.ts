/**
 * Returns the value of the first element in the provided record key.
 * If the provided record key does not exist, `undefined` is returned.
 *
 * @param key Record key to locate
 * @param record Record containing keys and values
 * @returns Value in provided record key as `string` if found, otherwise `undefined`
 */
export const findValueByKey = (
  key: string,
  record: Record<string, unknown>
): string | undefined => {
  for (const k in record) {
    if (k === key) {
      return record[k] as string;
    }

    if (record[k] instanceof Object) {
      const result = findValueByKey(key, record[k] as Record<string, unknown>);

      if (result) {
        return result;
      }
    }
  }

  return undefined;
};
