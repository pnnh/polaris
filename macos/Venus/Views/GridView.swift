import Foundation
import SwiftUI
import Combine

struct GridView: View {
    @Binding var columnCount: Int
    @Binding var dataFiles: [String]
    var publisher: PassthroughSubject<String, Never>
    
    init(colCount: Binding<Int>, files: Binding<[String]>, publisher: PassthroughSubject<String, Never> ) {
        self._columnCount = colCount
        self._dataFiles = files
        self.publisher = publisher
    }
    
    @State var active:(Int, Int) = (0, 0)
    
    func getPath(index: Int) -> String {
        if index < dataFiles.count {
            return dataFiles[index]
        }
        return ""
    }
    
    var body: some View {
        
        
        Button(action: {
            print("jjjdfs3")
            // 打开窗口
            //showWindow(imgPath: getPath(index: rowIndex * Int(columnCount) + colIndex))
        }) {
            EmoView2(path: getPath(index: 0 * Int(columnCount) + 0),
                     colWidth: 0, publisher: self.publisher)
                .frame(  maxWidth: .infinity)
                .background(Color.white).cornerRadius(2).overlay(
            
                    RoundedRectangle(cornerRadius: 2)
                        .stroke(Color.blue, lineWidth: self.active == (0, 0) ? 2 : 0 )
                )
        }.buttonStyle(EmptyButtonStyle()).padding(2)
        
//        VStack(alignment: .leading, spacing: 8){
//            
//            ForEach(0..<dataFiles.count / Int(columnCount) + 1, id: \.self) { rowIndex in
//                HStack(alignment: .top, spacing: 8) {
//                    ForEach(0..<Int(columnCount), id: \.self) { colIndex in
//                        
//                        Button(action: {
//                            print("jjjdfs3")
//                            self.active = (rowIndex, colIndex)
//                            // 打开窗口
//                            showWindow(imgPath: getPath(index: rowIndex * Int(columnCount) + colIndex))
//                        }) {
//                            EmoView2(path: getPath(index: rowIndex * Int(columnCount) + colIndex),
//                                     colWidth: 0 )
//                                .frame(  maxWidth: .infinity)
//                                .background(Color.white).cornerRadius(2).overlay(
//                            
//                                    RoundedRectangle(cornerRadius: 2)
//                                        .stroke(Color.blue, lineWidth: self.active == (rowIndex, colIndex) ? 2 : 0 )
//                                )
//                        }.buttonStyle(EmptyButtonStyle()).padding(2)
//                        Text("sss")
//                        
//                    }
//                }
//            }
//        }
    }
    
}


class Model: ObservableObject {
   init() {
       print("Model Created")
   }
   @Published var imageText: String = "图片备注"
   @Published var show: Bool = false
}

struct EmoView2: View {
    
    private var columnWidth: Double
        @State private var model: ArticleModel
    @State private var show: Bool = false
    private var path: String
    var publisher: PassthroughSubject<String, Never>
    
    @ObservedObject var model2 = Model() 
    
    init(path: String, colWidth: Double, publisher: PassthroughSubject<String, Never>) {
        self.path = path
        self.columnWidth = colWidth
        self.model = ArticleModel(Path: path, Text: "新")
        _show = State(initialValue: false)
//                self.model2.show = false
        print("onAppear \(path)")
        self.publisher =  publisher
    }
    
    
    func getNSImage() -> ImageWrapper? {
        
        
                if model.Path == "" {
                    return nil
                }
        let imgPath = self.path
//                if !imgPath.hasPrefix("/") {
//                    imgPath = "Documents/\(self.model.Path)"
//                }
        print("aaa \(self.model) \(imgPath)")
        
        if let nsImg = NSImage(contentsOfFile: imgPath) {
            //print("width height \(nsImg.size.width) \(nsImg.size.height)")
            let width = CGFloat(columnWidth)
            let height = CGFloat(columnWidth) / nsImg.size.width * nsImg.size.height
            //print("width2 \(height)")
            
            return ImageWrapper(Image: nsImg, width: width, height: height,
                                filePath: imgPath)
            
        }
        
        return nil
        
    }
    
    
    var body: some View {
        VStack(alignment: .center, spacing: nil) {
            
            if let nsImg = getNSImage() {
                Spacer(minLength: 0)
                HStack(alignment: .center) {
                    Spacer(minLength: 0)
                    Button(action: {
                        print("jjjdfs3")
                        self.model2.show.toggle()
                        self.show.toggle()
                        //self.prevModel.TestPrint(path: nsImg.filePath)
                        self.publisher.send("呵呵呵呵")
                        self.publisher.send(nsImg.filePath)
                    }) {
                        Image(nsImage: nsImg.Image)
                            .resizable()
                            .aspectRatio(contentMode: .fit)//.background(Color.pink)
                            .frame(maxWidth: .infinity)//.border(Color.gray, width: 0.5)
                        //.frame(width: nsImg.width, height: nsImg.height)
                        
                    }.buttonStyle(EmptyButtonStyle())
                    .popover(isPresented: $model2.show,attachmentAnchor: .point(.bottom),
                             arrowEdge: .bottom){
                        // 通过这种方式设置大小有问题，图片被裁剪了
                        PSImageView(image: nsImg.Image)
                            .frame(
                                minWidth: 150, idealWidth:  nil, maxWidth: 350, minHeight: 150, idealHeight: nil,  maxHeight: 350)
                        
                        
                                                    Image(nsImage: nsImg.Image)
                                                        .resizable()
                                                        .aspectRatio(contentMode: .fit)//.background(Color.pink)
                                                        .frame(maxWidth: 400, maxHeight: 400)//.border(Color.gray, width: 0.5)
                    }
                    Spacer(minLength: 0)
                }//
                Spacer(minLength: 0)
                HStack {
                    Text("图片备注").foregroundColor(Color.gray)
                        .font(Font.system(size: 10, design: .default))
                    Spacer()
                }.padding(2)//.frame(height:20)
            }
        }
        
        
    }
    
    
}

struct ImageWrapper {
    var Image: NSImage
    var width: CGFloat
    var height: CGFloat
    var filePath: String
}

struct EmptyButtonStyle: ButtonStyle {
    func makeBody(configuration: Self.Configuration) -> some View {
        configuration.label
    }
}
