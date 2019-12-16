import { ApiService } from './api.service';
import {defer, Observable, of} from "rxjs";
import {HttpResponse} from "@angular/common/http";

const provide = (mock: any): any => mock;
const mockHttpClient = {
  get: jest.fn()
};
const mockProducts = [{
  id: 1,
  name: "Name",
  description: "Description",
  price: "75.00",
  imageUrl: "https://source.unsplash.com/1600x900/?product",
  quantity: 56349
}];
const mockResponse = new HttpResponse<any>({body: mockProducts});

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService(provide(mockHttpClient))
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  it('should get first page of products when call sendGetRequest', async function () {
    expect.assertions(2);
    mockHttpClient.get.mockImplementationOnce(() => asyncData(mockResponse));

    await apiService.sendGetRequest().subscribe((res: HttpResponse<any>) => {
      expect(res.body).toEqual(mockProducts)
    });

    expect(mockHttpClient.get).toHaveBeenCalledTimes(1);

  });
});
