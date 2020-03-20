import ReactGA from 'react-ga';

jest.mock('react-ga');

window.URL.createObjectURL = () => {};
window.HTMLCanvasElement.prototype.getContext = () => {}