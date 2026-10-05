// import { createMMKV } from 'react-native-mmkv'
// import { StateStorage } from 'zustand/middleware'

// const storage = createMMKV()

// export const zustandMMKVStorage: StateStorage = {
//     setItem: (name, value) => storage.set(name, value),
//     getItem: (name) => storage.getString(name) ?? null,
//     removeItem: (name) => storage.remove(name),
// }

import AsyncStorage from '@react-native-async-storage/async-storage'
export const zustandMMKVStorage = AsyncStorage
