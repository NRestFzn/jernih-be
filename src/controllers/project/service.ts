import db from '../../config/firebase.config';
import {
  CreateProjectType,
  projectSchema,
  ProjectType,
  UpdateProjectType,
} from './schema';
import {ServiceResponse} from '../../common/models/serviceResponse';
import {StatusCodes} from 'http-status-codes';
import {v4} from 'uuid';
import {del} from '@vercel/blob';
import ResponseError from '../../modules/response/ResponseError';

class ProjectService {
  async createProject(userId: string, formData: CreateProjectType) {
    const validateForm = projectSchema.validateSync(formData);

    const projectId = v4();

    const projectRef = db.collection('project');

    const projectData = await projectRef.doc(projectId).set({
      id: projectId,
      userId: userId,
      ...formData,
    });

    return ServiceResponse.success('success', projectData, StatusCodes.CREATED);
  }

  async getAllProject() {
    const projectRef = db.collection('project');

    const projectSnapshot = (await projectRef.get()).docs.map((e) => e.data());

    return ServiceResponse.success('success', projectSnapshot, StatusCodes.OK);
  }

  async getProjectByPk(id: string): Promise<ProjectType> {
    const projectRef = db.collection('project').doc(id);

    const projectSnapshot = await projectRef.get();

    if (!projectSnapshot.exists) {
      throw new ResponseError.NotFound('Data not found');
    }

    return projectSnapshot.data() as ProjectType;
  }

  async getProjectById(id: string) {
    const data = await this.getProjectByPk(id);

    return ServiceResponse.success('success', data, StatusCodes.OK);
  }

  async deleteProject(id: string) {
    const projectRef = db.collection('project').doc(id);

    const findProject = await projectRef.get();

    const projectData = findProject.data() as ProjectType;

    if (!findProject.exists) {
      throw new ResponseError.NotFound('Data not found');
    }

    await del([projectData.imagePreview]);

    await projectRef.delete();

    return ServiceResponse.success('success', null, StatusCodes.OK);
  }

  async updateProject(projectId: string, formData: UpdateProjectType) {
    const validateForm = projectSchema.validateSync(formData);

    const projectRef = db.collection('project').doc(projectId);

    const projectSnapshot = await projectRef.get();

    if (!projectSnapshot.exists) {
      throw new ResponseError.NotFound('Data not found');
    }

    const projectData = projectSnapshot.data() as ProjectType;

    await del([projectData.imagePreview]);

    await projectRef.update(formData);

    return ServiceResponse.success('success', projectData, StatusCodes.OK);
  }
}

const projectService = new ProjectService();

export default projectService;
