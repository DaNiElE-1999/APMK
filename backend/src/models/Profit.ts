export interface ListProfitQuery {
  patient_id?:  string;
  doctor_id?:   string;
  medicine_id?: string; // filters medicine revenue
  lab_id?:      string; // filters lab revenue
  from?:        string; // ISO date
  to?:          string; // ISO date
}
