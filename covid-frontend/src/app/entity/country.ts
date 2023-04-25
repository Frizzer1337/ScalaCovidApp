export class Country {
  country : string;
  slug : string;
  iso2 : string;

  constructor(country : string, slug: string, iso2 : string) {
    this.country = country
    this.slug = slug
    this.iso2 = iso2
  }
}
