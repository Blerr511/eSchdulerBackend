import * as admin from 'firebase-admin';
import {Scheduler} from 'helpers/Scheduler';

class App {
	public init(): void {
		this.initAdmin();
		this.initScheduler();

		console.info('App initialized');
	}

	private initAdmin(): void {
		admin.initializeApp({
			databaseURL: process.env.DB_URL,
			projectId: 'eshedule',
			credential: admin.credential.cert(process.env.FIREBASE_CERT_PATH)
		});
	}

	private initScheduler() {
		Scheduler.init();
	}
}

export default App;
