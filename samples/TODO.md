MODELS
patients -> CRUD -> id, first, last, email, phone
doctors -> CRUD -> id, first, last, email, phone, speciality
labs -> CRUD -> id, type, cost
medicine -> CRUD -> id, name, cost
files -> id, path, mimeType, patient_id, doctor_id

COMPOSITES
appointments -> id, start, end, doctor_id, patient_id, lab
medicine_sold -> id, patient_id, doctor_id, time_sold(use time.now)

FUNCTIONS

GET -> In all functions will be list, filter by any property and also be done by time range
profit -> ByTimeRange(req), byPatient(first, last, email), byDoctor(first, last, email)