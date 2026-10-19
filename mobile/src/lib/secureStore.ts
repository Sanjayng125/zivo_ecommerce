import * as SecureStore from 'expo-secure-store';

export async function getToken() {
    const res = await SecureStore.getItemAsync("access-token")

    if (res) return res
    else return null
}

export async function setToken(value: string) {
    await SecureStore.setItemAsync("access-token", value);
}

export async function clearToken() {
    await SecureStore.deleteItemAsync("access-token")
}
