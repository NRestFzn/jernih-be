import db from '../../config/firebase.config';
import {CreateContactMeType, contactMeSchema, ContactMeType} from './schema';
import {ServiceResponse} from '../../common/models/serviceResponse';
import {StatusCodes} from 'http-status-codes';
import {v4} from 'uuid';
import {del} from '@vercel/blob';
import ResponseError from '../../modules/response/ResponseError';
import {MailSmpt} from '../../modules/MailSmtp';

class ContactMeService {
  async createContactMe(formData: CreateContactMeType) {
    const validateForm = contactMeSchema.validateSync(formData);

    const contactMeId = v4();

    const contactMeRef = db.collection('contactMe');

    await MailSmpt.sendMail(
      formData.senderAddress,
      formData.subject,
      formData.description
    );

    const contactMeData = await contactMeRef.doc(contactMeId).set({
      id: contactMeId,
      ...formData,
    });

    return ServiceResponse.success(
      'success',
      contactMeData,
      StatusCodes.CREATED
    );
  }

  async getAllContactMe() {
    const contactMeRef = db.collection('contactMe');

    const contactMeSnapshot = (await contactMeRef.get()).docs.map((e) =>
      e.data()
    );

    return ServiceResponse.success(
      'success',
      contactMeSnapshot,
      StatusCodes.OK
    );
  }

  async getContactMeById(id: string) {
    const contactMeRef = db.collection('contactMe').doc(id);

    const contactMeSnapshot = await contactMeRef.get();

    if (!contactMeSnapshot.exists) {
      throw new ResponseError.NotFound('Data not found');
    }

    return ServiceResponse.success(
      'success',
      contactMeSnapshot.data(),
      StatusCodes.OK
    );
  }

  async deleteContactMe(id: string) {
    const contactMeRef = db.collection('contactMe').doc(id);

    const findContactMe = await contactMeRef.get();

    if (!findContactMe.exists) {
      throw new ResponseError.NotFound('Data not found');
    }

    await contactMeRef.delete();

    return ServiceResponse.success('success', null, StatusCodes.OK);
  }
}

const contactMeService = new ContactMeService();

export default contactMeService;
