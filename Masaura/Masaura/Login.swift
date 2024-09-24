//
//  Login.swift
//  Masaura
//
//  Created by Roan Bahri on 9/20/24.
//

import SwiftUI

struct Login: View {
    
    @State private var username: String = ""
    @State private var password: String = ""
    
    var body: some View {
        NavigationView
        {
            ZStack
            {
                VStack
                {
                    Text("Masaura")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.blue)
                        .padding(.bottom)
                    
                    TextField("Username", text: $username)
                        .background(Color.gray.opacity(0.2))
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                    
                    SecureField("Password", text: $password)
                        .background(Color.gray.opacity(0.2))
                        .autocapitalization(.none)
                        .disableAutocorrection(true)
                    
                    let entry  = HomePage()
                    NavigationLink(destination: entry) {
                        Text("Login")
                            .font(.headline)
                            .background(.blue)
                            .foregroundColor(.white)
                            .cornerRadius(81)
                            .frame(maxWidth: .infinity)
                            .padding(.top)
                        
                    }
                    let registerView = RegisterView()
                    NavigationLink(destination: registerView) {
                        Text("Register")
                            .font(.headline)
                            .background(.blue)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                        
                    }
                    
                    
                }
            }
        }
    }
}

#Preview {
    Login()
}
