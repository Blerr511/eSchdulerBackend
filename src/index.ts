import App from 'App';
import {config} from 'dotenv-flow';

config();

const app = new App();

app.init().then(({port}) => {
	console.log(`App listening port ${port}.`);
});
