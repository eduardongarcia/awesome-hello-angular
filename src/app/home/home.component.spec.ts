import { HomeComponent } from './home.component';
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
  sendGetRequest: jest.fn(() => asyncData(mockResponse))
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
      declarations: [ HomeComponent ],
      providers: [
        { provide: ApiService, useValue: mockApiService}
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
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
