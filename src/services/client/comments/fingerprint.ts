import FingerprintJS from '@fingerprintjs/fingerprintjs'

export async function getVisitorId() {
    const fpPromise = await FingerprintJS.load()

    const getResult = await fpPromise.get()
    return getResult['visitorId']
}