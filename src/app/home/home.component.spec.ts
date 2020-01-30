import {HomeComponent} from './home.component';

describe('HomeComponent', () => {
  let homeComponent: HomeComponent;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be created', () => {
    homeComponent = new HomeComponent({});
    expect(homeComponent).toBeTruthy();
  });

  it('first page', () => {
    const mockResponse = {body: ['']};
    const mockSubscribe = jest.fn((cb) => cb(mockResponse));
    const mockPipe = jest.fn(() => ({subscribe: mockSubscribe}));
    const mockSendGetRequestToUrl = jest.fn(() => ({pipe: mockPipe}));
    const mockApiService = {
      sendGetRequestToUrl: mockSendGetRequestToUrl,
      first: 'teste',
    };
    homeComponent = new HomeComponent(mockApiService);

    homeComponent.firstPage();

    expect(mockSendGetRequestToUrl).toHaveBeenCalledWith('teste');
    expect(homeComponent.products.length).toBe(1);
  });
});
