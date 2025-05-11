export interface ILab {
  type: string;
  cost: number;
}

export interface CreateLabBody extends ILab {}
export interface UpdateLabBody extends Partial<ILab> {}

export interface ListLabsQuery {
  type?:     string;
  costMin?:  string;   // numeric strings in query
  costMax?:  string;
  from?:     string;   // ISO date – createdAt >= from
  to?:       string;   // ISO date – createdAt <= to
}
