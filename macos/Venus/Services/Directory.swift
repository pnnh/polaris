
import SwiftUI


public func promptForWorkingDirectoryPermission() -> URL? {
   let openPanel = NSOpenPanel()
   openPanel.message = "Choose your directory"
   openPanel.prompt = "Choose"
   openPanel.allowedFileTypes = ["none"]
   openPanel.allowsOtherFileTypes = false
   openPanel.canChooseFiles = false
   openPanel.canChooseDirectories = true
   
//   let response = openPanel.runModal()
   print(openPanel.urls) // this contains the chosen folder
   return openPanel.urls.first
}


public func selectImages(path: String) -> [String] {

    let manager = FileManager.default
    
    print("ssss\(path) \(manager.currentDirectoryPath)")
        let contentsOfPath = try? manager.contentsOfDirectory(atPath: path)
        print("contentsOfPath:")

        if let paths = contentsOfPath {
            var imageArray: [String] = []
            for fileName in paths {
                print("file path: \(fileName)")
                if fileName.hasSuffix(".jpg") || fileName.hasSuffix(".png") || fileName.hasSuffix(".gif") {

                    imageArray.append(
                        "\(path)/\(fileName)"
                    )
                }
            }
            return imageArray
        }
    return []
    
}
