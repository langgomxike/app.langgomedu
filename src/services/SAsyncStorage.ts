import AsyncStorage from "@react-native-async-storage/async-storage";

export enum AsyncStorageKeys {
    TOKEN = "TOKEN",
    LANGUAGE = "LANGUAGE",
}

const emptyFunc = () => { };

export default class SAsyncStorage {
    public static getData(key: AsyncStorageKeys, onSuccess: (value: string) => void = emptyFunc, onError: (error: any) => void = emptyFunc, onComplete: () => void = emptyFunc) {
        AsyncStorage.getItem(key)
            .then((value: string | null) => {
                if (!value) {
                    onError(null);
                } else {
                    onSuccess(value);
                }
            })
            .catch((error: any) => {
                onError(error);
            })
            .finally(() => {
                onComplete();
            });
    }

    public static setData(key: AsyncStorageKeys, valueAsJsonString: string, onSuccess: () => void = emptyFunc, onError: (error: any) => void = emptyFunc, onComplete: () => void = emptyFunc) {
        AsyncStorage.setItem(key, valueAsJsonString)
            .then(() => {
                onSuccess();
            })
            .catch((error: any) => {
                onError(error);
            }).finally(() => {
                onComplete();
            });

    }

    public static removeData(key: AsyncStorageKeys, onSuccess: () => void = emptyFunc, onError: (error: any) => void = emptyFunc, onComplete: () => void = emptyFunc) {
        AsyncStorage.removeItem(key)
            .then(() => {
                onSuccess();
            })
            .catch((error: any) => {
                onError(error);
            })
            .finally(() => {
                onComplete();
            });
    }
}