//
//  RegisterView.swift
//  Masaura
//
//  Created by Roan Bahri on 9/21/24.
//

import SwiftUI

struct RegisterView: View {
    
    @State private var username: String = ""
    @State private var email: String = ""
    @State private var password: String = ""
    
    var body: some View {
        NavigationView
        {
            VStack
            {
                Text("Username")
                TextField("Username", text: $username)
                    .background(Color.gray.opacity(0.2))
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                
                Text("Email")
                TextField("Email", text: $email)
                    .background(Color.gray.opacity(0.2))
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                
                Text("Password")
                TextField("Password", text: $password)
                    .background(Color.gray.opacity(0.2))
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                
                let home = HomePage()
                NavigationLink(destination: home) {
                    Text("Register")
                        .font(.headline)
                        .background(.blue)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.top)
                    
                }
            }
        }
    }
}

#Preview {
    RegisterView()
}
