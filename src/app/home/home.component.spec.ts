import { HomeComponent } from './home.component';
import {createComponentFactory, mockProvider, Spectator} from "@ngneat/spectator/jest";
import {ApiService} from "../api.service";

describe('HomeComponent', () => {

  // const mockApiService = <ApiService><unknown>{
  //   sendGetRequestToUrl: jest.fn(),
  //   sendGetRequest: jest.fn()
  // };
  //
  // const homeComp = new HomeComponent(mockApiService);

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [],
    providers: [
      mockProvider(ApiService)
    ],
    declarations: [],
    entryComponents: [],
    componentProviders: [], // Override the component's providers
    mocks: [], // Providers that will automatically be mocked
    componentMocks: [], // Component providers that will automatically be mocked
    detectChanges: false, // Defaults to true
    // declareComponent: false, // Defaults to true
    // disableAnimations: false, // Defaults to true
    shallow: true, // Defaults to false
  });

  let spectator: Spectator<HomeComponent>;

  beforeEach(() => spectator = createComponent({}));

  it('should create', () => {
    const component = spectator.component;
    expect(component).toBeTruthy();
    // expect(homeComp.products).toBeTruthy();
  });
});
