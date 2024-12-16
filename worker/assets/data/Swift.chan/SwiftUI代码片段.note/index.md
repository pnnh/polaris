---
image: cover.webp
---

### SwiftUI嵌入原生视图

```swift
struct MyButton: NSViewRepresentable {
    var text1: Int
    
    init(val: Int) {
        self.text1 = val
    }

    func makeNSView(context: NSViewRepresentableContext<MyButton>) -> NSView {
        print("makeNSView \(self.text1)")
        
        //scrolleView.addSubview(btn)
        
//        let txt = NSText()
//        txt.textColor = NSColor.blue
//        txt.string = "sssssss"
//
        //scrolleView.addSubview(txt)
        
        if self.text1 == 1 {
            let btn = NSButton();
            btn.title = "click"
            return btn
        } else if self.text1 == 2 {
           
            let txt = NSText()
            txt.string = "我是文本"
            return txt
        } else if self.text1 == 300 {
            return NSHostingView(rootView: Button2())       // 这个代码无法正常运行，会有个什么cycle错误
        } else {
            let url = URL(string: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568399815066&di=248f52ca4effe6c6699b34383eb12c61&imgtype=0&src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_ls%2F0%2F9944277690_200200%2F0.jpg")
            let img = NSImage(contentsOf: url!)!
            
            return NSImageView(image: img)
        }
        
    }
    
    func updateNSView(_ nsView: NSView, context: NSViewRepresentableContext<MyButton>) {
        print("updateNSView \(self.text1)")
    }
    
}


```

### 嵌入原生视图播放视频

```swift

struct PlayerView: NSViewRepresentable {
      
    func updateNSView(_ nsView: NSView, context: NSViewRepresentableContext<PlayerView>) {
        
    }
    func makeNSView(context: Context) -> NSView {
        return PlayerNSView(frame: .zero)
    }
}

class PlayerNSView: NSView{
    private let playerLayer = AVPlayerLayer()
    
    override init(frame: CGRect){
        super.init(frame: frame)
        let urlVideo = URL(string: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8")!
//        let urlVideo = URL(string: "http://api.tidal.com/v1/videos/98785108/hls/CAEQARgDIB8onxA=.m3u8?authtoken=exp~1566425270000.hmac~s-qcr5zT9d-h4lsKFGFzeZtPweknicoaO8tsMJZP4kM=")!
        let player = AVPlayer(url: urlVideo)
        player.play()
        playerLayer.player = player
        if layer == nil{
            layer = CALayer()
        }
        layer?.addSublayer(playerLayer)
    }
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    override func layout() {
        super.layout()
        playerLayer.frame = bounds
    }
}
```

### 嵌入原生视图处理滚动条

```swift
struct PatternView: NSViewRepresentable {
    @Binding var text1: String
    
    class Coordinator: NSObject, NSTextViewDelegate {
        var view: PatternView

        init(_ view: PatternView) {
            self.view = view
        }

        func textDidBeginEditing(_ notification: Notification) {
            //view.onEditingChanged(true)
            //print("sss")
        }

        func textDidChange(_ notification: Notification) {
            //print("sss2")
            guard let textView = notification.object as? NSTextView else {
                return
            }
            
            //print("sss4")
            view.text1 = textView.string

            //view.onEditingChanged(true)
        }

        func textDidEndEditing(_ notification: Notification) {
            //view.onEditingChanged(true)
            //print("sss3")
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeNSView(context: NSViewRepresentableContext<PatternView>) -> NSView {

        //let scrolleView = NSScrollView()
        let scrolleView = NSScrollView(frame: NSRect(origin: .zero, size: NSSize(width: 20, height: 30)))
        scrolleView.hasVerticalScroller = true
        scrolleView.hasHorizontalRuler = false
        scrolleView.backgroundColor = NSColor.blue

        let textView = NSTextView()
        //let textView = NSTextView(frame: NSRect(origin: .zero, size: size))
        textView.textContainerInset = NSSize(width: 5, height: 5)
        textView.font = NSFont.systemFont(ofSize: 20)
        //textView.minSize = NSSize(width: 0, height: size.height)
        //textView.maxSize = NSSize(width: CGFloat.infinity, height: CGFloat.infinity)
        textView.isVerticallyResizable = true       // 这两个字段影响swiftui的宽度和高度，也影响nsscrollview的宽度和高度
        textView.isHorizontallyResizable = true
        textView.textContainer?.containerSize = NSSize(width: CGFloat.infinity, height: CGFloat.infinity)
        textView.textContainer?.widthTracksTextView = true
        //textView.string = self.contentText
        textView.backgroundColor = NSColor.green
        

        //let text1: TextStorageDelegate = TextStorageDelegate(master: self)

        
        textView.delegate = context.coordinator
        //textView.textStorage?.delegate = text1
        
        scrolleView.documentView = textView
        
        return scrolleView
        //return textView
    }
    
    func updateNSView(_ nsView: NSView, context: NSViewRepresentableContext<PatternView>) {
        
    }
    
}
```

### Image View使用

```swift
struct ContentView6: View {
    @State var someInts = [1]
    var text1 = 2
    
    var body: some View {
        VStack {
            HStack {
                Button(action: {
                    self.someInts.append(3)
                }) {
                    Text("添加新图片")
                }
                Button(action: {
                    self.someInts.append(2)
                }) {
                    Text("添加新按钮")
                }
            }
            ScrollView {
                VStack {
                    ForEach(someInts, id: \.self) { user in
                        self.getSomeView(user)
                   }
                }
            }
        }
    }
     
    func getSomeView(_ vType: Int) -> some View {
        if vType == 1 {
            return getTextView(vType)
        }
        return getTextView(vType)
//        if vType == 2 {
//            return Button(action: {
//                self.someInts.append(1)
//            }) {
//                Text("我是按钮二")
//            }
//        }
//        if vType == 3 {
//            return getImageView()
//        }
//        return Button(action: {
//            self.someInts.append(1)
//        }) {
//            Text("t33")
//        }
    }
    
    func getTextView(_ vType: Int) -> Text {
        
       if vType == 1 {
           return Text("t11")
       } else if vType == 2 {
          
          return Text("t22")
       }
        return Text("ddddd")
    }
    
    func getButtonView(_ vType: Int) -> Button<Text> {
        return Button(action: {
            self.someInts.append(1)
        }) {
            Text("t33")
        }
    }
    
    func getImageView() -> Image {
        let url = URL(string: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568399815066&di=248f52ca4effe6c6699b34383eb12c61&imgtype=0&src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_ls%2F0%2F9944277690_200200%2F0.jpg")
           let img = NSImage(contentsOf: url!)!
        return Image(nsImage: img)
    }
}
```
