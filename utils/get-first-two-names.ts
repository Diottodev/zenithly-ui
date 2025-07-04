/**
 * Returns the first two names from a full name string.
 *
 * @param fullName - The full name as a string (e.g., "John Doe Smith").
 * @returns The first two names separated by a space, or the single name if only one is provided.
 *
 * @example
 * getFirstTwoNames("John Doe Smith"); // Returns "John Doe"
 * getFirstTwoNames("Alice"); // Returns "Alice"
 */
export function getFirstTwoNames(fullName: string): string {
  const names = fullName.trim().split(" ");
  if (names.length === 1) {
    return names[0];
  }
  return `${names[0]} ${names[1]}`;
}
