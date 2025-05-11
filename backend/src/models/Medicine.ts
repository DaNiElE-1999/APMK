export interface IMedicine {
  name: string;
  cost: number;
}

export interface CreateMedicineBody extends IMedicine {}
export interface UpdateMedicineBody extends Partial<IMedicine> {}

export interface ListMedicinesQuery {
  name?:    string;
  costMin?: string;   // numeric strings in query
  costMax?: string;
  from?:    string;   // ISO date – createdAt >= from
  to?:      string;   // ISO date – createdAt <= to
}
