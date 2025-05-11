export interface IDoctor {
  first:      string;
  last:       string;
  email:      string;
  phone?:     string;
  speciality: string;
}

export interface CreateDoctorBody extends IDoctor {}
export interface UpdateDoctorBody extends Partial<IDoctor> {}

export interface ListDoctorsQuery {
  first?:      string;
  last?:       string;
  email?:      string;
  phone?:      string;
  speciality?: string;
  from?:       string;   // ISO date
  to?:         string;   // ISO date
}
