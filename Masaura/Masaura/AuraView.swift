//
//  AuraView.swift
//  Masaura
//
//  Created by Pranav on 9/24/24.
//

import Foundation

import SwiftUI

struct RadarChartView: View {
    @State var dataPoints: [Double] = [1.0, 1.0, 1.0, 1.0]
    @State var maxValue: Double = 1.5
    var numberOfAxes: Int = 4
    var labels: [String] = ["🏋️", "💻", "📚", "🌲"]
    
    @State private var selectedLabel: String? = nil
    
    
    var body: some View {
        if selectedLabel == nil {
            
            VStack {
                
                Text("Total Aura level: \(Int(dataPoints.reduce(0, +)))")
                    .font(.system(size: 20))
                    .fontWeight(.bold)
                
                Spacer()
                
                GeometryReader { geometry in
                    ZStack {
                        // Draw the web/grid
                        drawGrid(in: geometry.size)
                        
                        // Draw the data points and fill the area
                        drawData(in: geometry.size)
                        
                        // Draw the labels
                        drawLabels(in: geometry.size)
                    }
                }
                .aspectRatio(1, contentMode: .fit)
                .padding()
            }
            
        }
        else {
            ZStack {
                
                GeometryReader { geometry in
                    ZStack {
                        // Draw the web/grid
                        drawGrid(in: geometry.size)
                        
                        // Draw the data points and fill the area
                        drawData(in: geometry.size)
                        
                        // Draw the labels
                        drawLabels(in: geometry.size)
                    }
                }
                .aspectRatio(1, contentMode: .fit)
                .blur(radius: 5)
            }
            
            AuraCardView(data: $dataPoints, selectedLabel: $selectedLabel, maxValue: $maxValue)
        }
    }
    
    private func drawGrid(in size: CGSize) -> some View {
        let center = CGPoint(x: size.width / 2, y: size.height / 2)
        let angle = 2 * .pi / CGFloat(numberOfAxes)
        
        return ForEach(0..<numberOfAxes, id: \.self) { i in
            Path { path in
                path.move(to: center)
                let end = CGPoint(
                    x: center.x + cos(CGFloat(i) * angle - .pi / 2) * size.width / 2,
                    y: center.y + sin(CGFloat(i) * angle - .pi / 2) * size.height / 2
                )
                path.addLine(to: end)
            }
            .stroke(Color.black, lineWidth: 1)
        }
    }
    
    private func drawData(in size: CGSize) -> some View {
        let center = CGPoint(x: size.width / 2, y: size.height / 2)
        let angle = 2 * .pi / CGFloat(numberOfAxes)
        
        // Create the path for the filled area
        let dataPath = Path { path in
            for i in 0..<numberOfAxes {
                let value = dataPoints[i] / maxValue
                let point = CGPoint(
                    x: center.x + cos(CGFloat(i) * angle - .pi / 2) * CGFloat(value) * size.width / 2,
                    y: center.y + sin(CGFloat(i) * angle - .pi / 2) * CGFloat(value) * size.height / 2
                )
                
                if i == 0 {
                    path.move(to: point)
                } else {
                    path.addLine(to: point)
                }
            }
            path.closeSubpath()
        }
        
        return ZStack {
            // Fill the area with a different color
            dataPath
                .fill(Color.blue.opacity(0.2)) // Change the fill color here
            
            // Add an outline with a different color
            dataPath
                .stroke(Color.blue, lineWidth: 2) // Change the stroke color and width here
        }
    }
    
    private func drawLabels(in size: CGSize) -> some View {
        let center = CGPoint(x: size.width / 2, y: size.height / 2)
        let angle = 2 * .pi / CGFloat(numberOfAxes)
        let labelRadius = size.width / 2 + 30  // Adjust the distance of the labels from the center
        
        return ForEach(0..<numberOfAxes, id: \.self) { i in
            let labelPosition = CGPoint(
                x: center.x + cos(CGFloat(i) * angle - .pi / 2) * labelRadius,
                y: center.y + sin(CGFloat(i) * angle - .pi / 2) * labelRadius
            )
            
            
            Button(action: {
                selectedLabel = labels[i]  // Trigger action by setting selected label
                print(selectedLabel)
            }) {
                Text(labels[i])
                    .font(.system(size: 50))
                    .position(labelPosition)
                    .foregroundColor(.black) // Ensure label looks like text
            }
            .buttonStyle(PlainButtonStyle()) // Remove button styling to look like labels
        }
    }
}

struct AuraCardView: View {
    
    @Binding var data: [Double]
    @Binding var selectedLabel: String?
    @Binding var maxValue: Double
    
    private var index: Int {
        switch selectedLabel {
        case "🏋️":
            return 0
        case "💻":
            return 1
        case "📚":
            return 2
        default:
            return 3
        }
    }
    
    func subtract() {
        data[index] = data[index] - 1
        if data[index] < 1 {
            data[index] = 1
        }
        maxValue = (data.max() ?? 1) + 0.5
    }
    
    func add() {
        data[index] = data[index] + 1
        maxValue = (data.max() ?? 1) + 0.5
    }
    
    var body: some View {
        VStack() {
            Text("Aura Points for \(selectedLabel ?? "")")
                .font(.system(size: 20))
                .fontWeight(.bold)
            
            Spacer()
            
            HStack {
                Button(action: {
                    subtract()
                }) {
                    ZStack {
                        // White circular background
                        Circle()
                            .fill(Color.white)
                            .frame(width: 50, height: 50) // Adjust the size as needed
                        
                        // Black plus sign
                        Image(systemName: "minus")
                            .foregroundColor(.black)
                            .font(.system(size: 24, weight: .bold)) // Adjust the size and weight of the plus sign
                    }
                }
                .shadow(radius: 3)
                
                Spacer()
                
                Text("\(Int(data[index]))")
                    .font(.system(size: 20))
                    .fontWeight(.bold)
                
                Spacer()
                
                Button(action: {
                    add()
                }) {
                    ZStack {
                        // White circular background
                        Circle()
                            .fill(Color.white)
                            .frame(width: 50, height: 50) // Adjust the size as needed
                        
                        // Black plus sign
                        Image(systemName: "plus")
                            .foregroundColor(.black)
                            .font(.system(size: 24, weight: .bold)) // Adjust the size and weight of the plus sign
                    }
                }
                .shadow(radius: 3) // Optional: Add a shadow for some depth
            }
            
            Spacer()
            
            Button(action: {
                selectedLabel = nil
                let _ = print(data)
            }) {
                Text("Done")
                    .font(.system(size: 20, weight: .bold)) // Set font size and weight
                    .foregroundColor(.black) // Set the text color to black
                    .padding() // Add padding for a larger touch area
                    .background(Color.white) // Set background color to white
                    .cornerRadius(10) // Add corner radius for rounded button
                    .shadow(radius: 3) // Optional: Add shadow for depth
            }
            .frame(maxWidth: .infinity)
        }
        .padding()
        .background(.white)  // Apply background color here
        .cornerRadius(12)
        .shadow(radius: 20)
        .frame(width: 250, height: 225)
        .edgesIgnoringSafeArea(.all)
    }
}

struct AuraChartView: View {
    
    var body: some View {
        RadarChartView(
        )
        .frame(width: 250, height: 250)
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        AuraChartView()
    }
}
