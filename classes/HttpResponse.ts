import { HttpResponseCode } from "@/enums";

export interface IHttpResponse {
  status: HttpResponseCode;
  data?: object;
  errorMessage?: string;
}

export default class HttpResponse implements IHttpResponse {
  public status: HttpResponseCode;
  public data?: object;
  public errorMessage?: string;

  constructor({ status, data, errorMessage }: IHttpResponse) {
    this.status = status;
    this.data = data;
    this.errorMessage = errorMessage;
  }
}

export class OKHttpResponse extends HttpResponse {
  constructor(data: object) {
    super({ status: HttpResponseCode.OK, data });
  }
}
