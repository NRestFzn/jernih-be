import * as yup from 'yup';

export const techStackSchema = yup.object().shape({
  title: yup.string().required('Judul wajib di isi'),
  description: yup.string().required('Deskripsi wajib di isi'),
  icon: yup.string().required('Icon wajib di isi'),
});

export type CreateTechStackType = yup.InferType<typeof techStackSchema>;

export type TechStackType = yup.InferType<typeof techStackSchema> & {
  id: string;
  icon: string;
};
