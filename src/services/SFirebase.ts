import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, child, Database, DataSnapshot } from 'firebase/database';
import firebaseConfig from "../../firebase_account_service.json";
import SLog, { LogType } from './SLog';
import firebaseNodeProps from "../../firebase_node_props.json";

export enum FirebaseNode {
    MAJOR = 0,
    CLASS = 1,
    CV = 2,
    USER = 3,
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

    public static trackAll(firebaseNode: FirebaseNode, onNext: () => void) {
        this.init();
        const firebaseReference = ref(this.firebaseDatabase, firebaseNodeProps[firebaseNode].node);

        onValue(firebaseReference,
            () => {
                SLog.log(
                    LogType.Info,
                    "trackAll " + firebaseNodeProps[firebaseNode].plural_name,
                    "track all " + firebaseNodeProps[firebaseNode].plural_name,
                    "track successfully"
                );
                onNext();
            },
            (error) => {
                SLog.log(
                    LogType.Error,
                    "trackAll " + firebaseNodeProps[firebaseNode].plural_name,
                    "track all " + firebaseNodeProps[firebaseNode].plural_name + " found error",
                    error
                );
                onNext();
            }
        );
    }

    public static trackOne(firebaseNode: FirebaseNode, key: number | string, onNext: () => void) {
        this.init();
        const firebaseReference = ref(this.firebaseDatabase, `${firebaseNodeProps[firebaseNode].node}/${firebaseNodeProps[firebaseNode].key}:${key}`);

        onValue(firebaseReference,
            (data) => {
                SLog.log(
                    LogType.Info,
                    `trackOne ${firebaseNodeProps[firebaseNode].singular_name}`,
                    `track the ${firebaseNodeProps[firebaseNode].singular_name} with key ${firebaseNodeProps[firebaseNode].key} = ${key}`,
                    `track successfully, last updated at: ${new Date(+(data?.val() ?? 0)).toUTCString()}`
                );
                onNext();
            },
            (error) => {
                SLog.log(
                    LogType.Error,
                    "trackOne " + firebaseNodeProps[firebaseNode].singular_name,
                    `track the ${firebaseNodeProps[firebaseNode].singular_name} with key ${firebaseNodeProps[firebaseNode].key} = ${key} found error`,
                    error
                );
                onNext();
            }
        );
    }

    public static getClassCreationFee(onNext: (fee: number | undefined) => void) {
        this.init();
        const firebaseReference = ref(this.firebaseDatabase, `CLASSES/CLASS_CREATION_FEE`);

        onValue(firebaseReference,
            (data) => {
                SLog.log(
                    LogType.Info,
                    `getCreationClassFee`,
                    `get successfully`,
                    data
                );
                onNext(data.val() as number ?? undefined);
            },
            (error) => {
                SLog.log(
                    LogType.Info,
                    `getCreationClassFee`,
                    `get unsuccessfully`,
                    error
                );
                onNext(undefined);
            }
        );

    }
}