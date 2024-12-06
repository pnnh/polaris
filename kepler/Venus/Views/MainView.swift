import Foundation
import SwiftUI
import Combine
import MTQuantum

struct PSMainView: View {
    @State private var dataFiles: [String] = []

    @State var columnCount: Int = 10
    @State var sliderValue: Double = 10
    let publisher = PassthroughSubject<String, Never>()
    
    func printSize(_ tag: String, width: CGFloat, height: CGFloat) {
        print("printSize \(tag), \(width), \(height)")
    }
    
    var rightBorder: some View {
        HStack {
            Spacer()
            Rectangle()
                .fill(Color(hex: 0xcccccc))
                .frame(width: 1)
        }
     }
    var body: some View {
        HStack(spacing: 0) {
            VStack {
                HStack {
                    Text("相册").foregroundColor(Color.gray)
                        .fontWeight(.bold)
                        .font(Font.system(size: 14, design: .default))
                    Spacer()
                    Button(action: {
                        print("打开文件")
                        let url = promptForWorkingDirectoryPermission()
                        
                        if let mustUrl = url {
                            self.dataFiles.removeAll()
                            self.dataFiles = selectImages(path: mustUrl.path)
                        }
                        
                    } ) {
                        Image(nsImage: NSImage(systemSymbolName: "plus.circle", accessibilityDescription: nil)!)
                    }.buttonStyle(EmptyButtonStyle())
                }
                HStack{
                    Image(nsImage: NSImage(systemSymbolName: "folder", accessibilityDescription: nil)!)
                    Text("主目录").onTapGesture {
                        tapItem()
                    }
                    Spacer()
                }
                Spacer()
            }.frame(maxWidth: 320).padding(0)
                .background(rightBorder)
            Spacer()
        }.padding(0)
    }

    func getPath(index: Int) -> String {
        if index < dataFiles.count {
            return dataFiles[index]
        }
        return ""
    }
    
    func tapItem() {
        print("tapItem")
        
        let fileService = MTQuantum.quantum.FileServerBusiness("/Users/Larry/temp")
        let files = fileService.selectFilesVector()
        
        for file in files {
            print("file name \(file.Name)")
        }
        
        print("selectFiles: \(files)")
        
    }
}


struct PSMainView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            PSMainView()
        }
    }
}
