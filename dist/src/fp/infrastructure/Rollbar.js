import Rollbar from 'rollbar';
const rollbar = new Rollbar({
    accessToken: '164e1e9bd7954122b366a29bd0ff36d1',
    captureUncaught: true,
    captureUnhandledRejections: true,
});
export default rollbar;
