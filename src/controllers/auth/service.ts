import db from 'config/firebase.config';
import {LoginType, RegisterType, loginSchema, registerSchema} from './schema';
import {ServiceResponse} from 'common/models/serviceResponse';
import {StatusCodes} from 'http-status-codes';
import {v4} from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {env} from 'common/utils/envConfig';

class AuthService {
  async signIn(formData: LoginType) {
    const validateForm = loginSchema.validateSync(formData);

    const userRef = db.collection('users');

    const findUser = await userRef.where('email', '==', formData.email).get();

    if (findUser.empty) {
      return ServiceResponse.failure(
        'User not found',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    const userData = findUser.docs[0].data();

    const validatePassword = bcrypt.compareSync(
      formData.password,
      userData.password
    );

    if (!validatePassword) {
      return ServiceResponse.failure(
        'Email and Password is incorrect',
        null,
        StatusCodes.UNAUTHORIZED
      );
    }

    delete userData.password;
    userData.createdAt = userData.createdAt.toDate();
    userData.updatedAt = userData.updatedAt.toDate();

    const payload = {userData};
    const token = jwt.sign(payload, env.JWT_SECRET_ACCESS_TOKEN as string, {
      expiresIn: '24h',
    });

    return ServiceResponse.success('success', token, StatusCodes.OK);
  }

  async signUp(formData: RegisterType) {
    const validateForm = registerSchema.validateSync(formData);

    const userRef = db.collection('users');

    const duplicateEmail = await userRef
      .where('email', '==', formData.email)
      .get();

    if (!duplicateEmail.empty) {
      return ServiceResponse.failure(
        'Email already used',
        null,
        StatusCodes.CONFLICT
      );
    }

    const userId = v4();

    await userRef.doc(userId).set({
      id: userId,
      fullname: formData.fullname,
      email: formData.email,
      password: bcrypt.hashSync(formData.password, bcrypt.genSaltSync(7)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userData = (
      await userRef.where('email', '==', formData.email).get()
    ).docs[0].data();

    delete userData.password;

    const user = {
      ...userData,
      createdAt: userData.createdAt.toDate(),
      updatedAt: userData.updatedAt.toDate(),
    };

    const payload = {user};
    const token = jwt.sign(payload, env.JWT_SECRET_ACCESS_TOKEN as string, {
      expiresIn: '24h',
    });

    return ServiceResponse.success('success', token, StatusCodes.CREATED);
  }
}

const authService = new AuthService();

export default authService;
