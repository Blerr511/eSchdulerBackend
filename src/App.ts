import * as admin from 'firebase-admin';
import {Scheduler} from 'helpers/Scheduler';

class App {
	public init(): void {
		console.log({
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY,
			projectId: process.env.FIREBASE_PROJECT_ID
		});
		this.initAdmin();
		this.initScheduler();
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
