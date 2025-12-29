import Toast from "react-native-toast-message";

export function notifySuccess(message: string) {
    Toast.show({
        type: "success",
        text1: message,
        position: "bottom",
        visibilityTime: 4000,
    });
}

export function notifyError(message: string) {
    Toast.show({
        type: "error",
        text1: message,
        position: "bottom",
        visibilityTime: 4500,
    });
}

export function notifyWarning(message: string) {
    Toast.show({
        type: "info",
        text1: message,
        position: "bottom",
        visibilityTime: 4500,
    });
}

export function notifyLoading(message: string) {
    Toast.show({
        type: "info",
        text1: message,
        autoHide: false,
        position: "bottom",
    });
}

export function dismissToast() {
    Toast.hide();
}
