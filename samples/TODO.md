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




- to moshen tek Pacienti.
liste me barna tek medicines mos ket perplasje me emrat (rapidol-s ose Rapidol S) + cmimni mos shkoje minus dhe te mare vetem numer (int)

- tek mjeket mendoja te specialitysh te benim t njejten gje (liste me specializimet psh 6 ose 7 lloj doktoresh max) dhe te vendosim nje opsion per raste te vacanta qe ta shkruajm vet(sesht shum e rendesishme)

- tek takimet te vendosej nje minikalendar mendoja qe te zgjedhim direkt vitin daten muajin qe mos i shrkuajm vet po pra sesht shum neccesary(e diskutojm)

- 