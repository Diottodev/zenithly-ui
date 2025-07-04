/**
 * Returns the initials from a user's name or, if not available, the first letter of their email.
 *
 * @param user - An object containing at least a 'name' or 'email' property.
 * @returns The initials as an uppercase string.
 */
export function getInitialsName(user?: {
  name?: string;
  email?: string;
}): string {
  if (!user) return "";
  // If the user has a name, get the first letter of the first two words
  if (user.name) {
    return user.name
      .split(" ")
      .slice(0, 2)
      .map((name: string) => name[0])
      .join("")
      .toUpperCase();
  }
  if (!user.email) return "";
  // Otherwise, return the first letter of the email
  return user.email[0].toUpperCase();
}
