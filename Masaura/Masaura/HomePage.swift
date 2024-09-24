import SwiftUI

struct HomePage: View {
    var body: some View {
        NavigationView {
            GeometryReader { geometry in
                ZStack {
                    NavigationLink(destination: Mountains()) {
                        Image("home_mountains")
                            .resizable()
                            .scaledToFill()
                            .edgesIgnoringSafeArea(.all)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                VStack
                {
                    Spacer()
                    HStack
                    {
                        NavigationLink(destination: Map()) {
                            Image("home_village_boy")
                                .resizable()
                                .edgesIgnoringSafeArea(.all)
                                .frame(width: geometry.size.width * 0.4, height: geometry.size.height * 0.4) 
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
        }

    }
}

struct HomePage_Previews: PreviewProvider {
    static var previews: some View {
        HomePage()
    }
}

