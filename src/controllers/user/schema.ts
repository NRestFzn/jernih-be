import * as yup from 'yup';

export const userSchema = yup.object().shape({
  fullname: yup.string().required('Fullname is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password min 8 character')
    .required('Password is required'),
});

export type UserType = yup.InferType<typeof userSchema> & {
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
