
import SwiftUI


public func promptForWorkingDirectoryPermission() -> URL? {
   let openPanel = NSOpenPanel()
   openPanel.message = "Choose your directory"
   openPanel.prompt = "Choose"
   openPanel.allowedFileTypes = ["none"]
   openPanel.allowsOtherFileTypes = false
   openPanel.canChooseFiles = false
   openPanel.canChooseDirectories = true
   
   let response = openPanel.runModal()
   print(openPanel.urls) // this contains the chosen folder
   return openPanel.urls.first
}

