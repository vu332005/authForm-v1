// src/utils/wrapperAsync.ts

export async function wrapperAsync<T>(
  asyncFunc: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const response = await asyncFunc();
    return [response, null];
  } catch (err: any) {
    return [null, err];
  }
}