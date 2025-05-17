export interface IPatient {
  first:  string;
  last:   string;
  email:  string;
  phone?: string;
  age: number;
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

  /* Age filters */
  age?: string;               // exact
  minAge?: string;            // range lower-bound
  maxAge?: string;            // range upper-bound

  from?:  string;   // ISO date – createdAt >= from
  to?:    string;   // ISO date – createdAt <= to
}
