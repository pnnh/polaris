import {beforeEach, describe, expect, it, vi} from 'vitest'
import {
    browserLogDebugMeta,
    browserLogErrorMeta,
    browserLogInfoMeta,
    browserLogWarnMeta,
} from '@/components/client/logger'

const {mockDebug, mockInfo, mockWarn, mockError} = vi.hoisted(() => ({
    mockDebug: vi.fn(),
    mockInfo: vi.fn(),
    mockWarn: vi.fn(),
    mockError: vi.fn(),
}))

// Mock loglevel before importing logger
vi.mock('loglevel', () => ({
    default: {
        setLevel: vi.fn(),
        debug: mockDebug,
        info: mockInfo,
        warn: mockWarn,
        error: mockError,
    },
}))

// Mock config so isProduction is false (test env)
vi.mock('@/components/client/config/config', () => ({
    isProduction: false,
}))

beforeEach(() => {
    vi.clearAllMocks()
})

// ─── browserLogDebugMeta ────────────────────────────────────────────────────

describe('browserLogDebugMeta', () => {
    it('calls browserLogger.debug with enriched object meta', () => {
        const meta = {key: 'value'}
        browserLogDebugMeta('debug message', meta)

        expect(mockDebug).toHaveBeenCalledOnce()
        const arg = mockDebug.mock.calls[0][0]
        expect(arg.message).toBe('debug message')
        expect(arg.level).toBe('debug')
        expect(arg.key).toBe('value')
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls browserLogger.debug with synthesized meta when no meta provided', () => {
        browserLogDebugMeta('debug only')

        expect(mockDebug).toHaveBeenCalledOnce()
        const arg = mockDebug.mock.calls[0][0]
        expect(arg.message).toBe('debug only')
        expect(arg.level).toBe('debug')
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls browserLogger.debug with synthesized meta when meta is a string', () => {
        browserLogDebugMeta('debug msg', 'not-an-object')

        expect(mockDebug).toHaveBeenCalledOnce()
        const arg = mockDebug.mock.calls[0][0]
        expect(arg.message).toBe('debug msg')
        expect(arg.level).toBe('debug')
    })
})

// ─── browserLogInfoMeta ─────────────────────────────────────────────────────

describe('browserLogInfoMeta', () => {
    it('calls browserLogger.info with enriched object meta', () => {
        const meta = {requestId: '123'}
        browserLogInfoMeta('info message', meta)

        expect(mockInfo).toHaveBeenCalledOnce()
        const arg = mockInfo.mock.calls[0][0]
        expect(arg.message).toBe('info message')
        expect(arg.level).toBe('info')
        expect(arg.requestId).toBe('123')
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls browserLogger.info with synthesized meta when no meta provided', () => {
        browserLogInfoMeta('info only')

        expect(mockInfo).toHaveBeenCalledOnce()
        const arg = mockInfo.mock.calls[0][0]
        expect(arg.message).toBe('info only')
        expect(arg.level).toBe('info')
    })
})

// ─── browserLogWarnMeta ─────────────────────────────────────────────────────

describe('browserLogWarnMeta', () => {
    it('calls browserLogger.warn with enriched object meta', () => {
        const meta = {component: 'App'}
        browserLogWarnMeta('warn message', meta)

        expect(mockWarn).toHaveBeenCalledOnce()
        const arg = mockWarn.mock.calls[0][0]
        expect(arg.message).toBe('warn message')
        expect(arg.level).toBe('warn')
        expect(arg.component).toBe('App')
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls browserLogger.warn with synthesized meta when no meta provided', () => {
        browserLogWarnMeta('warn only')

        expect(mockWarn).toHaveBeenCalledOnce()
        const arg = mockWarn.mock.calls[0][0]
        expect(arg.message).toBe('warn only')
        expect(arg.level).toBe('warn')
    })
})

// ─── browserLogErrorMeta ────────────────────────────────────────────────────

describe('browserLogErrorMeta', () => {
    it('calls browserLogger.error with enriched object meta', () => {
        const meta = {code: 500}
        browserLogErrorMeta('error message', meta)

        expect(mockError).toHaveBeenCalledOnce()
        const arg = mockError.mock.calls[0][0]
        expect(arg.message).toBe('error message')
        expect(arg.level).toBe('error')
        expect(arg.code).toBe(500)
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls browserLogger.error with synthesized meta when no meta provided', () => {
        browserLogErrorMeta('error only')

        expect(mockError).toHaveBeenCalledOnce()
        const arg = mockError.mock.calls[0][0]
        expect(arg.message).toBe('error only')
        expect(arg.level).toBe('error')
    })

    it('calls browserLogger.error with synthesized meta when meta is a string', () => {
        browserLogErrorMeta('error msg', 'string-meta')

        expect(mockError).toHaveBeenCalledOnce()
        const arg = mockError.mock.calls[0][0]
        expect(arg.message).toBe('error msg')
        expect(arg.level).toBe('error')
    })
})

