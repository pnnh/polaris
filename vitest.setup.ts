import {expect} from 'vitest'
import {createSerializer} from '@emotion/jest'

expect.addSnapshotSerializer(createSerializer())
