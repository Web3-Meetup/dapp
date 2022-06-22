// @TODO this could be exported from Meetup API project and imported here as a dependency
export interface Meetup {
  id: string; // Arweave transaction id
  title: string;
  slug: string; // The slug version of the title
  date: string; // ISO 8601 format (es: 2022-04-29T14:30:44.660Z)
  desc: string;
  organizationId: string;
  smartcontractAddress: string;
}