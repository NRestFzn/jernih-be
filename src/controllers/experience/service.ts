import db from '../../config/firebase.config';
import {CreateExperienceType, experienceSchema, ExperienceType} from './schema';
import {ServiceResponse} from '../../common/models/serviceResponse';
import {StatusCodes} from 'http-status-codes';
import {v4} from 'uuid';
import {del} from '@vercel/blob';
import ResponseError from 'modules/response/ResponseError';

class ExperienceService {
  async createExperience(userId: string, formData: CreateExperienceType) {
    const validateForm = experienceSchema.validateSync(formData);

    const experienceId = v4();

    const experienceRef = db.collection('experience');

    const experienceData = await experienceRef.doc(experienceId).set({
      id: experienceId,
      userId: userId,
      ...formData,
    });

    return ServiceResponse.success(
      'success',
      experienceData,
      StatusCodes.CREATED
    );
  }

  async getAllExperience() {
    const experienceRef = db.collection('experience');

    const experienceSnapshot = (await experienceRef.get()).docs.map((e) =>
      e.data()
    );

    return ServiceResponse.success(
      'success',
      experienceSnapshot,
      StatusCodes.OK
    );
  }

  async getExperienceById(id: string) {
    const experienceRef = db.collection('experience').doc(id);

    const experienceSnapshot = await experienceRef.get();

    if (!experienceSnapshot.exists) {
      throw new ResponseError.NotFound('Data not found');
    }

    return ServiceResponse.success(
      'success',
      experienceSnapshot.data(),
      StatusCodes.OK
    );
  }

  async deleteExperience(id: string) {
    const experienceRef = db.collection('experience').doc(id);

    const findExperience = await experienceRef.get();

    if (!findExperience.exists) {
      throw new ResponseError.NotFound('Data not found');
    }

    await experienceRef.delete();

    return ServiceResponse.success('success', null, StatusCodes.OK);
  }

  async updateExperience(experienceId: string, formData: CreateExperienceType) {
    const validateForm = experienceSchema.validateSync(formData);

    const experienceRef = db.collection('experience').doc(experienceId);

    const experienceSnapshot = await experienceRef.get();

    if (!experienceSnapshot.exists) {
      throw new ResponseError.NotFound('Data not found');
    }

    await experienceRef.update(formData);

    return ServiceResponse.success(
      'success',
      experienceSnapshot.data(),
      StatusCodes.OK
    );
  }
}

const experienceService = new ExperienceService();

export default experienceService;
