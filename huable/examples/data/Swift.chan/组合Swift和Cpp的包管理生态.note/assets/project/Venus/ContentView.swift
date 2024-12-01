import SwiftUI
import Alamofire

struct ContentView: View {
    var body: some View {
        VStack {
            HStack {
                Spacer()
                Text("Hello Swift")
                Spacer()
            }
            Spacer()
            HStack {
                Spacer()
                Button(action: {
                         httpRequest()
                }){
                    Text("Click Me")
                }
                Spacer()
            }
            Spacer()
        }
    }
}

func httpRequest() {
    // 尝试获取并打印IP
    AF.request("https://icanhazip.com", method: .get).responseString { response in
   
        debugPrint(response.result)
    }
}
