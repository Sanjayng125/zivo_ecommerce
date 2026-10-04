import * as SecureStore from 'expo-secure-store';

export async function getToken() {
    const res = await SecureStore.getItemAsync("access-token")

    if (res) return res
    else return null
}

export async function setToken(value: string) {
    await SecureStore.setItemAsync("access-token", value);
}

export async function getRefreshToken() {
    const res = await SecureStore.getItemAsync("refresh-token")

    if (res) return res
    else return null
}

export async function setRefreshToken(value: string) {
    await SecureStore.setItemAsync("refresh-token", value);
}

export async function clearTokens() {
    await SecureStore.deleteItemAsync("access-token")
    await SecureStore.deleteItemAsync("refresh-token")
}
