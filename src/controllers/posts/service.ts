import db from '../../config/firebase.config';
import {CreatePostType, PostsType} from './schema';
import {ServiceResponse} from '../../common/models/serviceResponse';
import {StatusCodes} from 'http-status-codes';
import {v4} from 'uuid';

class PostsService {
  async createPosts(
    userId: string,
    formData: CreatePostType,
    postImagesPath: string[]
  ) {
    const postId = v4();

    const postsRef = db.collection('posts');

    const postData = await postsRef.doc(postId).set({
      id: postId,
      userId: userId,
      ...formData,
    });

    if (postImagesPath.length > 0) {
      for (let i = 0; i < postImagesPath.length; i++) {
        postsRef.doc(postId).collection('postsImages').doc(v4()).set({
          postId,
          filePath: postImagesPath[i],
        });
      }
    }

    return ServiceResponse.success('success', postData, StatusCodes.CREATED);
  }

  async getAllPosts() {
    const postRef = db.collection('posts');
    const postsSnapshot = await postRef.get();

    const usersWithPostsPromises = postsSnapshot.docs.map(async (postsDoc) => {
      const postData = postsDoc.data();

      const postsImageSnapshot = await postsDoc.ref
        .collection('postsImages')
        .get();

      const postsImagesData = postsImageSnapshot.docs.map((postsImageDoc) =>
        postsImageDoc.data()
      );

      return {
        ...postData,
        postsImage: postsImagesData,
      };
    });

    const finalResult = await Promise.all(usersWithPostsPromises);

    return ServiceResponse.success('success', finalResult, StatusCodes.OK);
  }

  async getPostsById(id: string) {
    const postsRef = db.collection('posts').doc(id);

    const postsSnapshot = await postsRef.get();

    if (!postsSnapshot.exists) {
      return ServiceResponse.failure(
        'Data not found',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    const postData = postsSnapshot.data() as PostsType;

    const postsImagesRef = db
      .collection('posts')
      .doc(id)
      .collection('postsImages');

    const postsImagesData = await postsImagesRef
      .where('postId', '==', postData.id)
      .get();

    const finalData = {
      ...postData,
      postsImagesData: postsImagesData.docs.map((e) => e.data()),
    };

    return ServiceResponse.success('success', finalData, StatusCodes.OK);
  }

  async deletePosts(id: string) {
    const postsRef = db.collection('posts').doc(id);

    const findPosts = await postsRef.get();

    if (!findPosts.exists) {
      return ServiceResponse.failure(
        'Data not found',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    await postsRef.delete();

    return ServiceResponse.success('success', null, StatusCodes.OK);
  }
}

const postsService = new PostsService();

export default postsService;
