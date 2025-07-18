import db from '../../config/firebase.config';
import {CreateTechStackType, techStackSchema, TechStackType} from './schema';
import {ServiceResponse} from '../../common/models/serviceResponse';
import {StatusCodes} from 'http-status-codes';
import {v4} from 'uuid';
import {del} from '@vercel/blob';

class TechStackService {
  async createTechStack(userId: string, formData: CreateTechStackType) {
    const validateForm = techStackSchema.validateSync(formData);

    const techStackId = v4();

    const techStackRef = db.collection('techStack');

    const techStackData = await techStackRef.doc(techStackId).set({
      id: techStackId,
      userId: userId,
      ...formData,
    });

    return ServiceResponse.success(
      'success',
      techStackData,
      StatusCodes.CREATED
    );
  }

  async getAllTechStack() {
    const techStackRef = db.collection('techStack');

    const techStackSnapshot = (await techStackRef.get()).docs.map((e) =>
      e.data()
    );

    return ServiceResponse.success(
      'success',
      techStackSnapshot,
      StatusCodes.OK
    );
  }

  async getTechStackById(id: string) {
    const techStackRef = db.collection('techStack').doc(id);

    const techStackSnapshot = await techStackRef.get();

    if (!techStackSnapshot.exists) {
      return ServiceResponse.failure(
        'Data not found',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    return ServiceResponse.success(
      'success',
      techStackSnapshot.data(),
      StatusCodes.OK
    );
  }

  async deleteTechStack(id: string) {
    const techStackRef = db.collection('techStack').doc(id);

    const findTechStack = await techStackRef.get();

    const techStackData = findTechStack.data() as TechStackType;

    if (!findTechStack.exists) {
      return ServiceResponse.failure(
        'Data not found',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    await del(techStackData.icon);

    await techStackRef.delete();

    return ServiceResponse.success('success', null, StatusCodes.OK);
  }

  async updateTechStack(techStackId: string, formData: CreateTechStackType) {
    const validateForm = techStackSchema.validateSync(formData);

    const techStackRef = db.collection('techStack').doc(techStackId);

    const techStackSnapshot = await techStackRef.get();

    if (!techStackSnapshot.exists) {
      return ServiceResponse.failure(
        'Data not found',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    const techStackData = techStackSnapshot.data() as TechStackType;

    await del(techStackData.icon);

    await techStackRef.update(formData);

    return ServiceResponse.success(
      'success',
      techStackSnapshot.data(),
      StatusCodes.OK
    );
  }
}

const techStackService = new TechStackService();

export default techStackService;
