import * as admin from 'firebase-admin';
import {Scheduler} from 'helpers/Scheduler';
import * as server from 'http';

const PORT = Number(process.env.PORT) || 8080;

class App {
	public init(port = PORT): Promise<{port: number}> {
		return new Promise((res, rej) => {
			this.initAdmin();
			this.initScheduler();
			server
				.createServer((req, res) => {
					res.end('Server Running');
				})
				.listen(port, () => res({port}));
		});
	}

	private initAdmin(): void {
		admin.initializeApp({
			databaseURL: process.env.DB_URL,
			projectId: 'eshedule',
			credential: admin.credential.cert({
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY,
				projectId: process.env.FIREBASE_PROJECT_ID
			})
		});
	}

	private initScheduler() {
		Scheduler.init();
	}
}

export default App;
