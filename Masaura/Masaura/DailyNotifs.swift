//
//  DailyNotications.swift
//  Masaura
//
//  Created by Roan Bahri on 9/19/24.
//

import SwiftUI
import UserNotifications

class NotificationManager{
    static let instance = NotificationManager()
    
    func requestAutherization(completion: @escaping(Bool) -> Void){
        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        UNUserNotificationCenter.current().requestAuthorization(options: options) { (sucess, error) in
            if let error = error {
                print("ERROR: \(error)")
            }
            else
            {
                print("SUCESS")
                completion(sucess)
            }
        }
        
    }
    
    func scheduleNotification(){
        let content = UNMutableNotificationContent()
        content.title = "Title"
        content.subtitle = "Sub"
        content.sound = .default
        content.badge = 1
        
        
        var dateComponents = DateComponents()
        dateComponents.hour = Int.random(in: 0...23)
        dateComponents.minute = Int.random(in: 0...59)
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        
        let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request)
    }
}

struct DailyNotications: View {
    var body: some View {
        VStack
        {
            
        }
    }
}

#Preview {
    DailyNotications()
}
