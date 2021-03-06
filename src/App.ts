import * as admin from 'firebase-admin';
import {Scheduler} from 'helpers/Scheduler';
import * as server from 'http';
import * as cert from './eshedule-firebase-adminsdk-zfd3y-671e3ac3d7.json';

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
			databaseURL: String(process.env.DB_URL),
			projectId: cert.project_id,
			credential: admin.credential.cert({
				clientEmail: cert.client_email,
				privateKey: cert.private_key,
				projectId: cert.project_id
			})
		});
	}

	private initScheduler() {
		Scheduler.init();
	}
}

export default App;
