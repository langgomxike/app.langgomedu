import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, child, Database, DataSnapshot } from 'firebase/database';
import firebaseConfig from "../../firebase_account_service.json";
import SLog, { LogType } from './SLog';

export enum FirebaseNode {
    "PROJECTS",
    "ACTIVITIES",
    "MESSAGES",
}

export default class SFirebase {
    private static app: FirebaseApp;
    private static firebaseDatabase: Database;

    private static init() {
        if (!this.app) {
            this.app = initializeApp(firebaseConfig);
            SLog.log(LogType.Warning, "Initializing Firebase", "initialed app");
        }

        if (!this.firebaseDatabase) {
            this.firebaseDatabase = getDatabase(this.app);
            SLog.log(LogType.Warning, "Initializing Firebase", "initialed database");
        }
    }

    static trackMajors(onNext: () => void) {
        this.init();
        const firebaseReference = ref(this.firebaseDatabase, "MAJORS");

        onValue(firebaseReference,
            () => {
                SLog.log(LogType.Info, "trackMajors", "track all majors", "track successfully");
                onNext();
            },
            (error) => {
                SLog.log(LogType.Error, "trackMajors", "track all majors" + " found error", error);
                onNext();
            }
        );
    }

    static trackMajor(id: number = -1, onNext: () => void) {
        this.init();
        const firebaseReference = ref(this.firebaseDatabase, `MAJORS/MAJOR_ID:${id}`);

        SLog.log(LogType.Warning, "trackAMajor", `track the major with id = ${id}`, firebaseReference);

        onValue(firebaseReference,
            (data) => {
                SLog.log(LogType.Info, "trackMajor", `track the major with id = ${id}`, "last updated: " + new Date(+(data?.val() ?? 0)).toISOString());
                onNext();
            },
            (error) => {
                SLog.log(LogType.Error, "trackMajor", `track the major with id = ${id}` + " found error", error);
                onNext();
            }
        );
    }
}