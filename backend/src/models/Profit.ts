export interface ListProfitQuery {
  patient_id?:  string;
  doctor_id?:   string;
  medicine_id?: string; // filters medicine revenue
  lab?:         string; // filters lab revenue
  from?:        string; // ISO date
  to?:          string; // ISO date
}
