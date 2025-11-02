declare namespace Express {
  export interface Request {
    files: Array<Multer.File>;
  }
}

declare namespace Multer {
  interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }
}