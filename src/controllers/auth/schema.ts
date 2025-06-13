import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const registerSchema = yup.object().shape({
  fullname: yup.string().required('Fullname is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password min 8 character')
    .required('Password is required'),
});

export type LoginType = yup.InferType<typeof loginSchema>;
export type RegisterType = yup.InferType<typeof registerSchema>;
