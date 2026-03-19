import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Navbar & General
      "app_name": "BusBooking",
      "home": "Home",
      "my_bookings": "My Bookings",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "hi": "Hi",

      // Booking Summary & Fare
      "booking_summary": "Booking Summary",
      "fare_summary": "Fare Summary",
      "base_fare": "Base Fare",
      "gst": "GST (5%)",
      "insurance": "Travel Insurance",
      "total_amount": "Total Amount",
      "seats": "Seats",
      "bus": "Bus",
      "edit_info": "Edit Information",
      "boarding": "Boarding",
      "dropping": "Dropping",
      "age": "Age",

      // Form Fields & Placeholders
      "passenger_details": "Passenger Details",
      "full_name": "Full Name",
      "email_address": "Email ID",
      "mobile_number": "Mobile Number",
      "enter_name": "Enter Full Name",
      "enter_email": "Enter Email ID",
      "enter_mobile": "Enter Mobile Number",
      "password": "Password",
      "set_password": "Set Password",

      // Policies & Checkboxes
      "secure_trip": "Secure my trip with insurance",
      "view_benefits": "View Benefits",
      "agree_text": "I agree to",
      "terms": "Terms",
      "cancellation_policy": "Cancellation Policy",
      "got_it": "Got It",

      // Buttons & OTP
      "confirm_book": "Confirm & Book",
      "proceed_otp": "PROCEED TO OTP",
      "otp_verification": "OTP Verification",
      "verify_pay": "VERIFY & PAY",
      "sent_to": "Sent to",
      "seats_locked": "Seats locked for",

      // Alerts & Popups
      "accept_terms_alert": "Please accept Terms and Conditions!",
      "terms_text": "1. Ticket cannot be transferred. 2. Carry original ID proof. 3. Reach 15 mins before departure.",
      "insurance_text": "1. Accidental cover up to ₹5,00,000. 2. Hospitalization expenses covered. 3. Baggage loss protection.",
      "cancellation_text": "1. 70% refund if cancelled 24hrs before. 2. 50% refund for 12hrs. 3. No refund on travel day.",
      "email_exists_alert": "This email is already registered!",
      "register_success_alert": "Registration successful! Please login.",
      "login_error": "Invalid email or password!",
      "already_have_account": "Already have an account?",
      "no_account": "Don't have an account?",

      // --- Ticket Success Page (Newly Added) ---
      "booking_success": "Booking Successful!",
      "passenger_name": "Passenger Name",
      "print_ticket": "Download Ticket (Print)",
      "go_home": "Go to Home",
      "info_not_available": "Information not available!"
    }
  },
  mr: {
    translation: {
      "app_name": "बस-बुकिंग",
      "home": "मुख्यपृष्ठ",
      "my_bookings": "माझे बुकिंग",
      "login": "लॉगिन",
      "register": "नोंदणी",
      "logout": "लॉगआऊट",
      "hi": "नमस्कार",

      "booking_summary": "बुकिंगचा तपशील",
      "fare_summary": "भाड्याचा तपशील",
      "base_fare": "मूळ भाडे",
      "gst": "जीएसटी (५%)",
      "insurance": "प्रवास विमा",
      "total_amount": "एकूण रक्कम",
      "seats": "जागा",
      "bus": "बस",
      "edit_info": "माहिती बदला",
      "boarding": "चढण्याचे ठिकाण",
      "dropping": "उतरण्याचे ठिकाण",
      "age": "वय",

      "passenger_details": "प्रवाशाची माहिती",
      "full_name": "पूर्ण नाव",
      "email_address": "ईमेल आयडी",
      "mobile_number": "मोबाईल नंबर",
      "enter_name": "तुमचे पूर्ण नाव टाका",
      "enter_email": "ईमेल आयडी टाका",
      "enter_mobile": "मोबाईल नंबर टाका",
      "password": "पासवर्ड",
      "set_password": "पासवर्ड सेट करा",

      "secure_trip": "विम्यासह माझा प्रवास सुरक्षित करा",
      "view_benefits": "फायदे पहा",
      "agree_text": "मला मान्य आहे",
      "terms": "अटी",
      "cancellation_policy": "रद्दीकरण धोरण",
      "got_it": "समजले",

      "confirm_book": "खात्री करा आणि बुक करा",
      "proceed_otp": "ओटीपी साठी पुढे जा",
      "otp_verification": "ओटीपी पडताळणी",
      "verify_pay": "पडताळणी आणि पेमेंट",
      "sent_to": "पाठवला आहे",
      "seats_locked": "जागा लॉक केल्या आहेत",

      "accept_terms_alert": "कृपया नियम आणि अटी मान्य करा!",
      "terms_text": "१. तिकीट बुक केल्यावर ते दुसऱ्याच्या नावे करता येणार नाही. २. प्रवासाच्या वेळी मूळ ओळखपत्र सोबत असणे अनिवार्य आहे. ३. बस सुटण्याच्या वेळेच्या १५ मिनिटे आधी बस स्टॉपवर उपस्थित राहावे.",
      "insurance_text": "१. अपघाती मृत्यू किंवा कायमचे अपंगत्व आल्यास ₹५,००,००० पर्यंत कव्हर. २. अपघाती हॉस्पिटल खर्चासाठी ₹५०,००० पर्यंत रोख मदत. ३. प्रवासादरम्यान सामानाची चोरी किंवा नुकसान झाल्यास संरक्षण.",
      "cancellation_text": "१. २४ तास आधी तिकीट रद्द केल्यास ७०% परतावा मिळेल. २. १२ तास आधी ५०% परतावा. ३. प्रवासाच्या दिवशी कोणतेही पैसे परत मिळणार नाहीत.",
      "email_exists_alert": "हा ईमेल आधीच वापरला आहे!",
      "register_success_alert": "नोंदणी यशस्वी! आता लॉगिन करा.",
      "login_error": "ईमेल किंवा पासवर्ड चुकीचा आहे!",
      "already_have_account": "आधीच खाते आहे?",
      "no_account": "खाते नाही?",

      // --- Ticket Success Page (Newly Added) ---
      "booking_success": "बुकिंग यशस्वी!",
      "passenger_name": "प्रवासी नाव",
      "print_ticket": "तिकीट डाउनलोड (Print)",
      "go_home": "Home कडे जा",
      "info_not_available": "माहिती उपलब्ध नाही!"
    }
  },
  hi: {
    translation: {
      "app_name": "बस-बुकिंग",
      "home": "होम",
      "my_bookings": "मेरी बुकिंग",
      "login": "लॉगिन",
      "register": "पंजीकरण",
      "logout": "लॉगआउट",
      "hi": "नमस्ते",

      "booking_summary": "बुकिंग विवरण",
      "fare_summary": "किराया विवरण",
      "base_fare": "मूल किराया",
      "gst": "जीएसटी (५%)",
      "insurance": "यात्रा बीमा",
      "total_amount": "कुल राशि",
      "seats": "सीटें",
      "bus": "बस",
      "edit_info": "जानकारी बदलें",
      "boarding": "चढ़ने का स्थान",
      "dropping": "उतरने का स्थान",
      "age": "आयु",

      "passenger_details": "यात्री विवरण",
      "full_name": "पूरा नाम",
      "email_address": "ईमेल आईडी",
      "mobile_number": "मोबाइल नंबर",
      "enter_name": "अपना पूरा नाम दर्ज करें",
      "enter_email": "ईमेल आईडी दर्ज करें",
      "enter_mobile": "मोबाइल नंबर दर्ज करें",
      "password": "पासवर्ड",
      "set_password": "पासवर्ड सेट करें",

      "secure_trip": "बीमा के साथ मेरी यात्रा सुरक्षित करें",
      "view_benefits": "लाभ देखें",
      "agree_text": "मैं सहमत हूँ",
      "terms": "नियम",
      "cancellation_policy": "रद्दीकरण नीति",
      "got_it": "समझ गया",

      "confirm_book": "पुष्टि करें और बुक करें",
      "proceed_otp": "ओटीपी के लिए आगे बढ़ें",
      "otp_verification": "ओटीपी सत्यापन",
      "verify_pay": "सत्यापित करें और भुगतान करें",
      "sent_to": "भेजा गया",
      "seats_locked": "सीटें लॉक की गई हैं",

      "accept_terms_alert": "कृपया नियम और शर्तें स्वीकार करें!",
      "terms_text": "१. टिकट ट्रांसफर नहीं किया जा सकता। २. मूल पहचान पत्र साथ रखें। ३. प्रस्थान से १५ मिनट पहले पहुंचें।",
      "insurance_text": "१. ₹५,००,००० तक का दुर्घटना कवर। २. अस्पताल के खर्चों के लिए सहायता। ३. सामान चोरी या नुकसान के खिलाफ सुरक्षा।",
      "cancellation_text": "१. २४ घंटे पहले रद्द करने पर ७०% रिफंड। २. १२ घंटे पहले ५०% रिफंड। ३. यात्रा के दिन कोई रिफंड नहीं।",
      "email_exists_alert": "यह ईमेल पहले से ही पंजीकृत है!",
      "register_success_alert": "पंजीकरण सफल! अब लॉगिन करें।",
      "login_error": "ईमेल या पासवर्ड गलत है!",
      "already_have_account": "पहले से ही खाता है?",
      "no_account": "खाता नहीं है?",

      // --- Ticket Success Page (Newly Added) ---
      "booking_success": "बुकिंग सफल!",
      "passenger_name": "यात्री का नाम",
      "print_ticket": "टिकट डाउनलोड करें (Print)",
      "go_home": "होम पर जाएं",
      "info_not_available": "जानकारी उपलब्ध नहीं है!"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;