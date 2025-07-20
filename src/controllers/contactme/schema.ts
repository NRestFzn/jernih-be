import * as yup from 'yup';

export const contactMeSchema = yup.object().shape({
  senderAddress: yup
    .string()
    .email('Invalid email')
    .required('Sender address is required'),
  subject: yup.string().required('Subject is required'),
  description: yup.string().required('Description is required'),
});

export type CreateContactMeType = yup.InferType<typeof contactMeSchema>;

export type ContactMeType = yup.InferType<typeof contactMeSchema> & {
  id: string;
  icon: string;
};
