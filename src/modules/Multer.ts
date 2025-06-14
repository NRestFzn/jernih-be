import fs from 'fs';
import fsSync from 'fs/promises';
import _ from 'lodash';
import path from 'path';
import multer from 'multer';
import slugify from 'slugify';
import ResponseError from './response/ResponseError';
import {put} from '@vercel/blob';
const defaultFieldSize = 100 * 1024 * 1024; // 100mb
const defaultFileSize = 100 * 1024 * 1024; // 100mb
const defaultDestination = 'public/uploads';

// extension
export const allowedZIP = ['.zip', '.7z'];
export const allowedPDF = ['.pdf'];
export const allowedImage = ['.png', '.jpg', '.jpeg', '.svg'];
export const allowedExcel = ['.xlsx', '.xls'];
export const allowedDoc = ['.doc', '.docx'];
export const allowedVideo = ['.mkv', '.mp4', '.webm'];

const defaultAllowedExt = [
  ...allowedZIP,
  ...allowedPDF,
  ...allowedImage,
  ...allowedExcel,
  ...allowedDoc,
];

// mimetype
export const allowedMimetypeZIP = [
  'application/zip',
  'application/x-zip-compressed',
  'application/x-7z-compressed',
];
export const allowedMimetypePDF = ['application/pdf'];
export const allowedMimetypeImage = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
];
export const allowedMimetypeVideo = ['video/mkv', 'video/mp4', 'video/webm'];
export const allowedMimetypeExcel = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
export const allowedMimetypeDoc = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const defaultAllowedMimetype = [
  ...allowedMimetypeZIP,
  ...allowedMimetypePDF,
  ...allowedMimetypeImage,
  ...allowedMimetypeExcel,
  ...allowedMimetypeDoc,
  ...allowedMimetypeVideo,
];

interface UseMulterProps {
  dest?: string;
  allowedMimetype?: string[];
  allowedExt?: string[];
  limit?: {
    fieldSize?: number;
    fileSize?: number;
  };
}

const useMulter = (props: UseMulterProps) => {
  // always check destination
  const destination = props.dest ?? defaultDestination;

  // config storage
  // const storage = multer.diskStorage({
  //   destination,
  //   filename(req, file, cb) {
  //     const slugFilename = slugify(file.originalname, {
  //       replacement: '_',
  //       lower: true,
  //     });
  //     cb(null, [Date.now(), slugFilename].join('-'));
  //   },
  // });

  const storage = multer.memoryStorage();

  // config multer upload
  const configMulter = multer({
    storage,
    fileFilter(req, file, cb) {
      const allowedMimetype = props.allowedMimetype ?? defaultAllowedMimetype;
      const allowedExt = props.allowedExt ?? defaultAllowedExt;
      const mimetype = file.mimetype.toLowerCase();

      console.log({mimetype});

      if (!allowedMimetype.includes(mimetype)) {
        return cb(
          new ResponseError.BadRequest(
            `Only ${allowedExt.join(', ')} ext are allowed`
          )
        );
      }

      cb(null, true);
    },
    limits: props.limit ?? {
      fieldSize: defaultFieldSize,
      fileSize: defaultFileSize,
    },
  });

  return configMulter;
};

interface UploadFileOptionsParams {
  dest?: string;
  maxSizeUpload?: number;
  onlyImages?: boolean;
  onlyDocuments?: boolean;
  allowedExt?: string[];
  allowedMimetype?: string[];
}

function getDefaultUploadFileOptions(params: UploadFileOptionsParams = {}) {
  const {
    dest = 'public/uploads/',
    maxSizeUpload = 25,
    onlyImages = false,
    onlyDocuments = false,
    allowedExt = [],
    allowedMimetype = [],
  } = params;

  return {
    dest: params.dest ? params.dest : dest,
    allowedExt: [
      // Images
      ...(onlyDocuments ? [] : ['.png', '.jpeg', '.jpg']),
      // Documents
      ...(onlyImages ? [] : ['.docx', '.pdf', '.xlsx', '.doc', '.xls']),
      ...allowedExt,
    ],
    allowedMimetype: [
      // Images
      ...(onlyDocuments ? [] : ['image/jpeg', 'image/png']),
      // Documents
      ...(onlyImages
        ? []
        : [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword',
            'application/vnd.ms-excel',
          ]),
      ...allowedMimetype,
    ],
    limit: {
      fieldSize: maxSizeUpload * 1024 * 1024,
      fileSize: maxSizeUpload * 1024 * 1024,
    },
  };
}

async function memoryStorageHandler(files: {
  [fieldname: string]: Express.Multer.File[];
}) {
  if (!files) return [];
  const destinationDir = 'public/uploads';

  await fsSync.mkdir(destinationDir, {recursive: true});

  const savedFilePaths: string[] = [];

  for (const file of Object.values(files).flat()) {
    const slugFilename = slugify(file.originalname, {
      replacement: '_',
      lower: true,
    });
    const newFilename = `${Date.now()}-${slugFilename}`;

    const fullPath = path.join(destinationDir, newFilename);

    await fsSync.writeFile(fullPath, file.buffer);

    savedFilePaths.push(`${destinationDir.split('/')[1]}/${newFilename}`);
  }

  return savedFilePaths;
}

async function vercelBlobHandler(files: {
  [fieldname: string]: Express.Multer.File[];
}): Promise<string[]> {
  const savedFilePaths: string[] = [];

  if (files && Object.keys(files).length > 0) {
    for (const fieldname in files) {
      const fileArray = files[fieldname];

      for (const file of fileArray) {
        const filename = `${Date.now()}-${slugify(file.originalname)}`;

        const blob = await put(`posts/${filename}`, file.buffer, {
          access: 'public',
          contentType: file.mimetype,
        });

        savedFilePaths.push(blob.url);
      }
    }
  }

  return savedFilePaths;
}

export default {
  useMulter,
  getDefaultUploadFileOptions,
  memoryStorageHandler,
  vercelBlobHandler,
};
