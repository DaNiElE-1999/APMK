export interface IMedicineSold {
  patient_id:  string;
  doctor_id:   string;
  medicine_id: string;
  quantity:    number;
  time_sold?:  string;   // ISO date
}

export interface CreateMedicineSoldBody extends IMedicineSold {}
export interface UpdateMedicineSoldBody extends Partial<IMedicineSold> {}

export interface ListMedicineSoldQuery {
  patient_id?:  string;
  doctor_id?:   string;
  medicine_id?: string;
  quantityMin?: string;
  quantityMax?: string;
  from?:        string;  // ISO date – time_sold >= from
  to?:          string;  // ISO date – time_sold <= to
}
