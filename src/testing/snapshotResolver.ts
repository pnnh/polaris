import path from 'path'

export default {
    resolveSnapshotPath: (testPath: string, snapshotExtension: string) => {
        // Customize the path where snapshots are stored
        // For example, to store them in a 'custom-snapshots' directory:
        return path.join(
            path.dirname(testPath),
            'snapshots', // Your custom folder name
            path.basename(testPath) + snapshotExtension
        );
    },

    resolveTestPath: (snapshotFilePath: string, snapshotExtension: string) => {
        // Customize how Jest finds the test file from a snapshot file
        return snapshotFilePath.replace('snapshots' + path.sep, '').replace(snapshotExtension, '');
    },

    testPathForConsistencyCheck: 'some.test.js', // A dummy test path for consistency checks
};
