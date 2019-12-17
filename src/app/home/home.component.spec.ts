import {HomeComponent} from './home.component';
import {createComponentFactory, mockProvider, Spectator} from "@ngneat/spectator/jest";
import {ApiService} from "../api.service";
import {defer} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {async, ComponentFixture, fakeAsync, flushMicrotasks, TestBed} from "@angular/core/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";

const mockProducts = [{
  id: 1,
  name: "Name",
  description: "Description",
  price: "75.00",
  imageUrl: "https://source.unsplash.com/1600x900/?product",
  quantity: 56349
}];
const mockResponse = new HttpResponse<any>({body: mockProducts});

const mockApiService = {
  sendGetRequest: jest.fn(() => asyncData(mockResponse)),
};

function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('HomeComponent - Spectator', () => {

  const createComponent = createComponentFactory({
    component: HomeComponent,
    providers: [
      mockProvider(ApiService, mockApiService)
      // { provide: ApiService, useValue: mockApiService}
    ],
    detectChanges: false,
    shallow: true, // Defaults to false
  });

  let spectator: Spectator<HomeComponent>;

  beforeEach(() => {
    spectator = createComponent({})
  });

  it('should create', () => {
    const component = spectator.component;
    expect(component).toBeTruthy();
  });

  it('should populate products on init', fakeAsync(() => {
    const component = spectator.component;
    spectator.detectChanges();
    flushMicrotasks();
    spectator.detectChanges();
    expect(component.products).toEqual(mockProducts);
    expect(spectator.queryAll('[data-loading]').length).toBe(0);
    expect(spectator.queryAll('[data-card-header]').length).toBe(1);
  }));
});

describe('HomeComponent - TestBed', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockApiService = {
    sendGetRequest: jest.fn(() => asyncData(mockResponse))
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        {provide: ApiService, useValue: mockApiService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate products on init', fakeAsync(() => {
    fixture.detectChanges();
    flushMicrotasks();
    const compiled = fixture.debugElement.nativeElement;
    expect(component.products).toEqual(mockProducts);
    expect(compiled.querySelectorAll('[data-loading]').length).toBe(0);
    expect(compiled.querySelectorAll('[data-card-header]').length).toBe(1);
  }));
});

describe('HomeComponent - Unit', () => {
  let homeComponent: HomeComponent;
  let mockApiServiceComponent;
  const provide = (mock: any): any => mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockApiServiceComponent = {
      sendGetRequest: jest.fn(() => asyncData(mockResponse)),
      sendGetRequestToUrl: jest.fn(() => asyncData(mockResponse)),
      first: 'http://localhost:3000/products?_page=1&_limit=4',
      last: 'http://localhost:3000/products?_page=100&_limit=4',
      prev: 'http://localhost:3000/products?_page=2&_limit=4',
      next: 'http://localhost:3000/products?_page=4&_limit=4'
    };
    homeComponent = new HomeComponent(provide(mockApiServiceComponent))
  });

  it('should be created', () => {
    expect(homeComponent).toBeTruthy();
  });

  it('should populate products when call firstPage', fakeAsync(() => {
    const mockProductsFirstPage = [{
      id: 1,
      name: "Name page 1",
      description: "Description page 1",
      price: "75.00",
      imageUrl: "https://source.unsplash.com/1600x900/?product",
      quantity: 56349
    }];
    const mockResponseFirstPage = new HttpResponse<any>({body: mockProductsFirstPage});
    mockApiServiceComponent.sendGetRequestToUrl.mockImplementationOnce(() => asyncData(mockResponseFirstPage));

    homeComponent.firstPage();
    flushMicrotasks();

    expect(homeComponent.products).toEqual(mockProductsFirstPage);
    expect(mockApiServiceComponent.sendGetRequestToUrl).toHaveBeenCalledWith(mockApiServiceComponent.first);
  }));

  it('should populate products when call previuousPage', fakeAsync(() => {
    const mockProductsPreviousPage = [{
      id: 1,
      name: "Name previous page",
      description: "Description previous page",
      price: "75.00",
      imageUrl: "https://source.unsplash.com/1600x900/?product",
      quantity: 56349
    }];
    const mockResponsePreviousPage = new HttpResponse<any>({body: mockProductsPreviousPage});
    mockApiServiceComponent.sendGetRequestToUrl.mockImplementationOnce(() => asyncData(mockResponsePreviousPage));

    homeComponent.previousPage();
    flushMicrotasks();

    expect(homeComponent.products).toEqual(mockProductsPreviousPage);
    expect(mockApiServiceComponent.sendGetRequestToUrl).toHaveBeenCalledWith(mockApiServiceComponent.prev);
  }));

  it('should populate products when call nextPage', fakeAsync(() => {
    const mockProductsNextPage = [{
      id: 1,
      name: "Name next page",
      description: "Description next page",
      price: "75.00",
      imageUrl: "https://source.unsplash.com/1600x900/?product",
      quantity: 56349
    }];
    const mockResponseNextPage = new HttpResponse<any>({body: mockProductsNextPage});
    mockApiServiceComponent.sendGetRequestToUrl.mockImplementationOnce(() => asyncData(mockResponseNextPage));

    homeComponent.nextPage();
    flushMicrotasks();

    expect(homeComponent.products).toEqual(mockProductsNextPage);
    expect(mockApiServiceComponent.sendGetRequestToUrl).toHaveBeenCalledWith(mockApiServiceComponent.next);
  }));

  it('should populate products when call lastPage', fakeAsync(() => {
    const mockProductsLastPage = [{
      id: 1,
      name: "Name last page",
      description: "Description last page",
      price: "75.00",
      imageUrl: "https://source.unsplash.com/1600x900/?product",
      quantity: 56349
    }];
    const mockResponseLastPage = new HttpResponse<any>({body: mockProductsLastPage});
    mockApiServiceComponent.sendGetRequestToUrl.mockImplementationOnce(() => asyncData(mockResponseLastPage));

    homeComponent.lastPage();
    flushMicrotasks();

    expect(homeComponent.products).toEqual(mockProductsLastPage);
    expect(mockApiServiceComponent.sendGetRequestToUrl).toHaveBeenCalledWith(mockApiServiceComponent.last);
  }));
});
