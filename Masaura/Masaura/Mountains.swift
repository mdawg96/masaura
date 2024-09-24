import SwiftUI

struct Mountains: View {
    var elo: Double = 5.3
    var level: Double
    {
        elo.truncatingRemainder(dividingBy: 1.0)
    }
    
    var body: some View
    {
        VStack
        {
            HStack
            {
                ProgressView(value: level)
                    .progressViewStyle(LinearProgressViewStyle())
                    .frame(width: 150, height: 10)
                Text("Level \(Int(elo))")
                    .font(.headline)
                    .padding(.leading, 10)
            }
            .padding()
            Spacer()
        }
    }
    
    
}

