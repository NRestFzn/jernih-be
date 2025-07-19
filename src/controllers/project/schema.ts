import * as yup from 'yup';

export const projectSchema = yup.object().shape({
  title: yup.string().required('Judul wajib di isi'),
  description: yup.string().required('Deskripsi wajib di isi'),
  imagePreview: yup.string().required('Preview gambar wajib di isi'),
  techStacks: yup
    .array(yup.string().required('Tech stack wajib di isi'))
    .required('Tech stacks wajib di isi')
    .min(1, 'Masukan minimal satu tech stack'),
});

export const updateProjectSchema = projectSchema.omit(['techStacks']).shape({
  techStacks: yup
    .array(yup.string().required('Tech stack wajib di isi'))
    .notRequired(),
});

export type UpdateProjectType = yup.InferType<typeof updateProjectSchema>;

export type CreateProjectType = yup.InferType<typeof projectSchema>;

export type ProjectType = yup.InferType<typeof projectSchema> & {
  id: string;
};
