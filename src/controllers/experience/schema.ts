import * as yup from 'yup';

export const experienceSchema = yup.object().shape({
  position: yup.string().required('Posisi wajib di isi'),
  organizationName: yup
    .string()
    .required('Organisasi atau Tempat bekerja wajib di isi'),
  description: yup.string().required('Deskripsi wajib di isi'),
  periodeStart: yup.string().required('Periode mulai wajib di isi'),
  periodeEnd: yup.string().required('Periode selesai wajib di isi').nullable(),
});

export type CreateExperienceType = yup.InferType<typeof experienceSchema>;

export type ExperienceType = yup.InferType<typeof experienceSchema> & {
  id: string;
  icon: string;
};
