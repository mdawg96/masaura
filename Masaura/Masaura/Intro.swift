//
//  Intro.swift
//  Masaura
//
//  Created by Roan Bahri on 8/30/24.
//

import Foundation
import SwiftUI
import UserNotifications

struct Intro: View
{
    @State private var isLoading = true
    @State private var bOpacity: Double = 0.0
    @State private var permissionRequested = false
    @State private var loadingPaused = false
    
    var body: some View
    {
        if !isLoading
        {
            Login()
        }
        else
        {
            ZStack
            { 
                Image("intro_mountains")
                    .resizable()
                    .scaledToFill()
                    .edgesIgnoringSafeArea(.all)
                    .opacity(bOpacity)
                    .onAppear
                    {
                        withAnimation(.easeIn(duration: 4.0))
                        {
                            bOpacity = 1.0
                        }
                    }
                Text("Masaura")
                    .foregroundColor(.white)
                
            }
                .onAppear()
            {
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                    withAnimation
                    {
                        requestNotifPermission()
                    }
                }
            }
        }
      
        
    }
    
    func requestNotifPermission(){
        NotificationManager.instance.requestAutherization() { granted in
            if granted {
                print("Notif Permission Granted")
                NotificationManager.instance.scheduleNotification()
            }
            else
            {
                print("not granted")
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0)
            {
                withAnimation{
                    isLoading = false
                }
            }
        }
    }

    
}

struct Intro_Previews: PreviewProvider {
    static var previews: some View {
        Intro()
    }
}

