import {beforeEach, describe, expect, it, vi} from 'vitest'
import {serverLogDebugMeta, serverLogErrorMeta, serverLogInfoMeta, serverLogWarnMeta,} from '@/components/server/logger'

// Mock pino-pretty to avoid ESM/top-level-await issues in test env
vi.mock('pino-pretty', () => ({
    default: vi.fn(() => ({write: vi.fn()})),
}))

const {mockDebug, mockInfo, mockWarn, mockError} = vi.hoisted(() => ({
    mockDebug: vi.fn(),
    mockInfo: vi.fn(),
    mockWarn: vi.fn(),
    mockError: vi.fn(),
}))

vi.mock('pino', () => {
    const pino = vi.fn(() => ({
            debug: mockDebug,
            info: mockInfo,
            warn: mockWarn,
            error: mockError,
        }))
    ;(pino as any).stdTimeFunctions = {isoTime: vi.fn()}
    return {default: pino}
})

beforeEach(() => {
    vi.clearAllMocks()
})

// ─── serverLogDebugMeta ──────────────────────────────────────────────────────

describe('serverLogDebugMeta', () => {
    it('calls serverLogger.debug with enriched object meta', () => {
        const meta = {key: 'value'}
        serverLogDebugMeta('debug message', meta)

        expect(mockDebug).toHaveBeenCalledOnce()
        const arg = mockDebug.mock.calls[0][0]
        expect(arg.message).toBe('debug message')
        expect(arg.level).toBe('debug')
        expect(arg.key).toBe('value')
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls serverLogger.debug with synthesized meta when no meta provided', () => {
        serverLogDebugMeta('debug only')

        expect(mockDebug).toHaveBeenCalledOnce()
        const arg = mockDebug.mock.calls[0][0]
        expect(arg.message).toBe('debug only')
        expect(arg.level).toBe('debug')
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls serverLogger.debug with synthesized meta when meta is a string', () => {
        serverLogDebugMeta('debug msg', 'not-an-object')

        expect(mockDebug).toHaveBeenCalledOnce()
        const arg = mockDebug.mock.calls[0][0]
        expect(arg.message).toBe('debug msg')
        expect(arg.level).toBe('debug')
    })
})

// ─── serverLogInfoMeta ───────────────────────────────────────────────────────

describe('serverLogInfoMeta', () => {
    it('calls serverLogger.info with enriched object meta', () => {
        const meta = {requestId: 'abc'}
        serverLogInfoMeta('info message', meta)

        expect(mockInfo).toHaveBeenCalledOnce()
        const arg = mockInfo.mock.calls[0][0]
        expect(arg.message).toBe('info message')
        expect(arg.level).toBe('info')
        expect(arg.requestId).toBe('abc')
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls serverLogger.info with synthesized meta when no meta provided', () => {
        serverLogInfoMeta('info only')

        expect(mockInfo).toHaveBeenCalledOnce()
        const arg = mockInfo.mock.calls[0][0]
        expect(arg.message).toBe('info only')
        expect(arg.level).toBe('info')
    })
})

// ─── serverLogWarnMeta ───────────────────────────────────────────────────────

describe('serverLogWarnMeta', () => {
    it('calls serverLogger.warn with enriched object meta', () => {
        const meta = {component: 'Server'}
        serverLogWarnMeta('warn message', meta)

        expect(mockWarn).toHaveBeenCalledOnce()
        const arg = mockWarn.mock.calls[0][0]
        expect(arg.message).toBe('warn message')
        expect(arg.level).toBe('warn')
        expect(arg.component).toBe('Server')
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls serverLogger.warn with synthesized meta when no meta provided', () => {
        serverLogWarnMeta('warn only')

        expect(mockWarn).toHaveBeenCalledOnce()
        const arg = mockWarn.mock.calls[0][0]
        expect(arg.message).toBe('warn only')
        expect(arg.level).toBe('warn')
    })
})

// ─── serverLogErrorMeta ──────────────────────────────────────────────────────

describe('serverLogErrorMeta', () => {
    it('calls serverLogger.error with enriched object meta', () => {
        const meta = {statusCode: 500}
        serverLogErrorMeta('error message', meta)

        expect(mockError).toHaveBeenCalledOnce()
        const arg = mockError.mock.calls[0][0]
        expect(arg.message).toBe('error message')
        expect(arg.level).toBe('error')
        expect(arg.statusCode).toBe(500)
        expect(typeof arg.timestamp).toBe('string')
    })

    it('calls serverLogger.error with synthesized meta when no meta provided', () => {
        serverLogErrorMeta('error only')

        expect(mockError).toHaveBeenCalledOnce()
        const arg = mockError.mock.calls[0][0]
        expect(arg.message).toBe('error only')
        expect(arg.level).toBe('error')
    })

    it('calls serverLogger.error with synthesized meta when meta is a string', () => {
        serverLogErrorMeta('error msg', 'string-meta')

        expect(mockError).toHaveBeenCalledOnce()
        const arg = mockError.mock.calls[0][0]
        expect(arg.message).toBe('error msg')
        expect(arg.level).toBe('error')
    })
})
