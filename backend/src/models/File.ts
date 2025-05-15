export interface IFile {
  name:       string;
  path:       string;
  mimeType:   string;
  patient_id?: string;  // ObjectId – at least one of patient_id / doctor_id must be present
  doctor_id?:  string;  // ObjectId
}

/* ─── Request bodies ─── */
export interface CreateFileBody extends IFile {}
export interface UpdateFileBody extends Partial<IFile> {}

/* ─── Query params for list/filter ─── */
export interface ListFilesQuery {
  name?:       string;
  patient_id?: string;
  doctor_id?:  string;
  mimeType?:   string;
  path?:       string;
  from?:       string; // ISO date – createdAt >= from
  to?:         string; // ISO date – createdAt <= to
}
