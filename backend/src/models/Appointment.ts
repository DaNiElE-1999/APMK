export interface IAppointment {
  start:      string; // ISO date string
  end:        string; // ISO date string
  doctor_id:  string; // ObjectId
  patient_id: string; // ObjectId
  lab?:       string; // ObjectId
}

/* ─────── Request bodies ─────── */
export interface CreateAppointmentBody extends IAppointment {}
export interface UpdateAppointmentBody extends Partial<IAppointment> {}

/* ─────── Query params for list/filter ─────── */
export interface ListAppointmentsQuery {
  doctor_id?:  string;
  patient_id?: string;
  lab?:        string;
  from?:       string; // ISO date – start >= from
  to?:         string; // ISO date – start <= to
}
