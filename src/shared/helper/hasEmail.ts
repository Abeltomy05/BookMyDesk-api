export function hasEmail(entity: any): entity is { email: string } {
  return typeof entity.email === 'string';
}
