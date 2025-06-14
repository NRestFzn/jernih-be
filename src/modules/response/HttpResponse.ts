class HttpResponse {
  static baseResponse(dataResponse: any) {
    const {
      message = 'data has been received',
      code = 200,
      ...rest
    } = dataResponse;

    return {code, message, ...rest};
  }

  static get(dataResponse: any) {
    const message = 'data received';

    return this.baseResponse({message, ...dataResponse});
  }

  static created(dataResponse: any) {
    const message = 'data successfully created';

    return this.baseResponse({code: 201, message, ...dataResponse});
  }

  static updated(dataResponse: any) {
    const message = 'data successfully updated';

    return this.baseResponse({message, ...dataResponse});
  }

  static deleted(dataResponse: any) {
    const message = 'data successfully deleted';

    return this.baseResponse({message, ...dataResponse});
  }
}

export default HttpResponse;
