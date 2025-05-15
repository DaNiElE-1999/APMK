export interface IPatient {
  first:  string;
  last:   string;
  email:  string;
  phone?: string;
}

/* ────── Request bodies ────── */
export interface CreatePatientBody extends IPatient {}
export interface UpdatePatientBody extends Partial<IPatient> {}

/* ────── Query params for list/filter ────── */
export interface ListPatientsQuery {
  first?: string;
  last?:  string;
  email?: string;
  phone?: string;
  from?:  string;   // ISO date – createdAt >= from
  to?:    string;   // ISO date – createdAt <= to
}
