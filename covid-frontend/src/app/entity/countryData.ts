export class CountryData {
  id: string;
  country: string;
  confirmedTotal: number;
  date: string;
  confirmedToday: number;

  constructor(id: string, country: string, confirmedTotal: number, date: string, confirmedToday: number) {
    this.id = id
    this.country = country
    this.confirmedTotal = confirmedTotal
    this.date = date
    this.confirmedToday = confirmedToday
  }
}
