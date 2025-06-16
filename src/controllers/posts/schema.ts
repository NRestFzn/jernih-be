import * as yup from 'yup';

export const postsSchema = yup.object().shape({
  title: yup.string().required('Judul wajib di isi'),
  description: yup.string().required('Deskripsi wajib di isi'),
  // contactPerson: yup
  //   .array(yup.string().required('Contact person is required'))
  //   .required('Contact person is required')
  //   .min(1, 'Input atleast 1 contact person'),
  province: yup.string().required('Provinsi wajib di isi'),
  city: yup.string().required('Kabupaten/Kota wajib di isi'),
  district: yup.string().required('Kecamatan'),
  detailLocation: yup.string().required('Detail lokasi wajib di isi'),
  contactPerson: yup.string().required('Detail lokasi wajib di isi'),
  embedMaps: yup.string().nullable(),
  // banner: yup.string().required(),
  donationLink: yup.string().required('Link donasi wajib di isi'),
});

export type CreatePostType = yup.InferType<typeof postsSchema>;

export type PostsType = yup.InferType<typeof postsSchema> & {
  id: string;
};
