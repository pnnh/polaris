import Cocoa

public class FilesystemHandler {
    // 选择单个文件夹
    public static func chooseDirectory() throws -> String? {

        let openPanel = NSOpenPanel()
        openPanel.allowsMultipleSelection = false
        openPanel.canChooseDirectories = true
        openPanel.canChooseFiles = false
        if openPanel.runModal() == .OK, openPanel.urls.count > 0 {
            let selectedPath = openPanel.urls[0].path
            try saveBookmark(target: selectedPath)
            return selectedPath
        }
        return nil
    }

    private static func saveBookmark(target: String) throws {
        let url = URL(fileURLWithPath: target, isDirectory: true)

        try saveBookmark(target: url)
    }

    // 保存 bookmarkData 到 UserDefaults
    private static func saveBookmark(target: URL) throws {
        let bookmarkData = try target.bookmarkData(
            options: [.withSecurityScope]
        )
        UserDefaults.standard.set(bookmarkData, forKey: "bookmark:\(target.path)")
    }

    private static func loadBookmark(path: String) throws -> URL? {
        let url = URL(fileURLWithPath: path, isDirectory: true)

        return try loadBookmark(url: url)
    }

    // 从 UserDefaults 中加载保存的 bookmarkData 并还原为文件路径
    private static func loadBookmark(url: URL) throws -> URL? {
        if let bookmarkData = UserDefaults.standard.data(forKey: "bookmark:\(url.path)") {
            var isStale = false
            let url = try URL(
                resolvingBookmarkData: bookmarkData,
                options: [.withoutUI, .withSecurityScope],
                relativeTo: nil,
                bookmarkDataIsStale: &isStale
            )
            return url
        }
        return nil
    }

    // 遍历某个文件夹下的文件，并返回文件地址列表
    public static func scanDirectory(path: String, filter: String) throws -> [String] {
        let url = URL(fileURLWithPath: path, isDirectory: true)
        return try scanDirectory(url: url, filter: filter)
    }

    // 遍历某个文件夹下的文件，并返回文件地址列表
    public static func scanDirectory(url: URL, filter: String) throws -> [String] {
        let realUrl = try loadBookmark(url: url)
        if realUrl == nil {
            return []
        }
        let success = url.startAccessingSecurityScopedResource()
        if !success {
            return []
        }
        defer {
            url.stopAccessingSecurityScopedResource()
        }
        let fileManager = FileManager.default
        let contents: [URL] = try fileManager.contentsOfDirectory(
            at: url, includingPropertiesForKeys: [.isDirectoryKey],
            options: [
                FileManager.DirectoryEnumerationOptions.skipsHiddenFiles,
                FileManager.DirectoryEnumerationOptions.skipsSubdirectoryDescendants,
            ]
        )

        let filesOnly = contents.filter { url -> Bool in
            do {
                let resourceValues = try url.resourceValues(forKeys: [.isDirectoryKey])
                return !resourceValues.isDirectory!
            } catch { return false }
        }

        let paths = filesOnly.map {
            $0.path
        }
        return paths
    }
}
