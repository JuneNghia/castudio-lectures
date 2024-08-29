export async function loadPsList(): Promise<typeof import('ps-list')> {
  return import('ps-list')
}
