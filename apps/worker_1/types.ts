export type Payload = {
  sessionId: string;
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: {
      type: string;
      data: Uint8Array;
    };
    size: number;
  };
  taskId: string;
};
