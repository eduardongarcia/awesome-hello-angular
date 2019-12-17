import {ApiService} from './api.service';
import {defer} from "rxjs";
import {HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";

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
const mockHeaders = new HttpHeaders({Link: '<http://localhost:3000/products?_page=1&_limit=4>; rel="first", <http://localhost:3000/products?_page=2&_limit=4>; rel="next", <http://localhost:3000/products?_page=75&_limit=4>; rel="last"'});
const mockResponse = new HttpResponse<any>({body: mockProducts, headers: mockHeaders});
const mockResponseWithoutHeaders = new HttpResponse<any>({body: mockProducts, headers: new HttpHeaders()});

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    apiService = new ApiService(provide(mockHttpClient))
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  it('should get first page of products when call sendGetRequest', done => {
    expect.assertions(3);
    mockHttpClient.get.mockImplementationOnce(() => asyncData(mockResponse));

    apiService.sendGetRequest().subscribe(res => {
      expect(res.body).toEqual(mockProducts);
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith('http://localhost:3000/products', {
        params: new HttpParams({fromString: "_page=1&_limit=4"}),
        observe: "response"
      });
      done();
    });
  });

  it('should get first page without links in header when call sendGetRequest', done => {
    expect.assertions(5);
    mockHttpClient.get.mockImplementationOnce(() => asyncData(mockResponseWithoutHeaders));

    apiService.sendGetRequest().subscribe(res => {
      expect(res.body).toEqual(mockProducts);
      expect(apiService.first).toBeUndefined();
      expect(apiService.prev).toBeUndefined();
      expect(apiService.next).toBeUndefined();
      expect(apiService.last).toBeUndefined();
      done();
    });
  });

  it('should get links from first page of products after call sendGetRequest', done => {
    expect.assertions(4);
    mockHttpClient.get.mockImplementationOnce(() => asyncData(mockResponse));

    apiService.sendGetRequest().subscribe(() => {
      expect(apiService.first).toEqual('http://localhost:3000/products?_page=1&_limit=4');
      expect(apiService.prev).toBeUndefined();
      expect(apiService.next).toEqual('http://localhost:3000/products?_page=2&_limit=4');
      expect(apiService.last).toEqual('http://localhost:3000/products?_page=75&_limit=4');
      done();
    });
  });

  it('should catch error when service handle ErrorEvent', done => {
    expect.assertions(1);
    jest.spyOn(window, 'alert').mockImplementation(() => {
    });
    mockHttpClient.get.mockImplementationOnce(() => asyncError({error: new ErrorEvent('type', {message: 'error message'})}));

    apiService.sendGetRequest().subscribe(() => {
    }, (error) => {
      expect(error).toEqual('Error: error message');
      done();
    });
  });

  it('should catch error when service handle Error', done => {
    expect.assertions(1);
    jest.spyOn(window, 'alert').mockImplementation(() => {
    });
    mockHttpClient.get.mockImplementationOnce(() => asyncError({status: '503', message: 'error message with code'}));

    apiService.sendGetRequest().subscribe(() => {
    }, (error) => {
      expect(error).toEqual('Error Code: 503\nMessage: error message with code');
      done();
    });
  });

  it('should get response when call sendGetRequestToUrl', done => {
    expect.assertions(3);
    mockHttpClient.get.mockImplementationOnce(() => asyncData(mockResponse));

    apiService.sendGetRequestToUrl('http://teste:3000/products?_page=2&_limit=4').subscribe(res => {
      expect(res.body).toEqual(mockProducts);
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith('http://teste:3000/products?_page=2&_limit=4', {observe: "response"});
      done();
    });
  });
});
