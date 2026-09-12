export interface WorldLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const ALL_WORLD_LANGUAGES: WorldLanguage[] = [
  // Indian Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'Maharashtra, India' },
  { code: 'en', name: 'English', nativeName: 'English (Global)', flag: '🌐', region: 'Global' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Gujarat, India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', region: 'West Bengal / Bangladesh' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Tamil Nadu, India' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Andhra / Telangana' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Punjab, India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Karnataka, India' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'Kerala, India' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', region: 'South Asia' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'Odisha, India' },

  // Global World Languages
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain & Latin America' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France & Francophonie' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany / Austria' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East & North Africa' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Russia & Eastern Europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', region: 'Brazil & Portugal' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', region: 'Italy' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', region: 'China' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'South Korea' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', region: 'Turkey' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Indonesia' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', region: 'Netherlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Poland' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Thailand' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', region: 'Iran' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Ukraine' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', region: 'Greece' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', region: 'Sweden' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'East Africa' }
];

export interface SimpleSummaryLocale {
  headerTitle: string;
  headerSubtitle: string;
  verdicts: {
    rain: { title: string; subtitle: string; badge: string };
    hot: { title: string; subtitle: string; badge: string };
    cold: { title: string; subtitle: string; badge: string };
    cool: { title: string; subtitle: string; badge: string };
    pleasant: { title: string; subtitle: string; badge: string };
    normal: { title: string; subtitle: string; badge: string };
  };
  deciders: {
    umbrella: { title: string; yes: string; maybe: string; no: string; clearSky: string; rainChanceSuffix: string };
    clothes: { title: string; warm: string; light: string; casual: string };
    outside: { title: string; great: string; avoidSun: string; checkRain: string; wearMask: string; highUv: string; fairAir: string };
    air: { title: string; clean: string; moderate: string; polluted: string; safeBreathe: string; takePrecautions: string };
  };
  timing: {
    dayLabel: string;
    nightLabel: string;
    engineNote: string;
  };
}

export const SUMMARY_LOCALES: Record<string, SimpleSummaryLocale> = {
  hi: {
    headerTitle: "आज का सरल मौसम सारांश",
    headerSubtitle: "सरल शब्दों में — कोई कठिन डेटा नहीं, सीधा आपके काम की बात",
    verdicts: {
      rain: {
        title: "आज बारिश की संभावना है!",
        subtitle: "दिन में बारिश हो सकती है। घर से बाहर निकलते समय छाता साथ जरूर रखें।",
        badge: "छाता साथ रखें"
      },
      hot: {
        title: "आज काफी तेज धूप और गर्मी रहेगी!",
        subtitle: "तापमान काफी अधिक रहेगा। दोपहर में सीधी धूप से बचें और खूब पानी पीते रहें।",
        badge: "तेज धूप व गर्मी"
      },
      cold: {
        title: "आज कड़ाके की ठंडक रहने वाली है!",
        subtitle: "सुबह और रात में पारा काफी गिरेगा। मोटे गर्म कपड़े पहनकर ही बाहर निकलें।",
        badge: "ठंडा मौसम"
      },
      cool: {
        title: "हल्की ठंडक और सुहाना मौसम रहेगा!",
        subtitle: "दिन में हल्की धूप खिलेगी, लेकिन सुबह-शाम ठंडी हवा चल सकती है।",
        badge: "हल्की ठंडक"
      },
      pleasant: {
        title: "आज मौसम बेहद सुहाना और आरामदायक रहेगा!",
        subtitle: "धूप-छांव का बढ़िया तालमेल रहेगा। बाहर घूमने या काम करने के लिए बेहतरीन दिन है।",
        badge: "एकदम बढ़िया दिन"
      },
      normal: {
        title: "दिन सामान्य और शांत रहेगा!",
        subtitle: "मौसम अनुकूल रहेगा। बारिश का कोई खतरा नहीं है।",
        badge: "सामान्य दिन"
      }
    },
    deciders: {
      umbrella: { title: "छाता चाहिए?", yes: "हाँ, साथ रखें!", maybe: "हल्की बूंदाबांदी संभव", no: "बिल्कुल नहीं", clearSky: "आसमान साफ रहेगा", rainChanceSuffix: "बारिश के आसार" },
      clothes: { title: "क्या पहनें?", warm: "गर्म स्वेटर या जैकेट", light: "हल्के सूती (कॉटन) कपड़े", casual: "आरामदायक सामान्य कपड़े" },
      outside: { title: "बाहर निकलना?", great: "एकदम बढ़िया समय है", avoidSun: "दोपहर में धूप से बचें", checkRain: "संभलकर निकलें", wearMask: "मास्क लगाकर निकलें", highUv: "धूप तेज है", fairAir: "हवा सामान्य है" },
      air: { title: "हवा और प्रदूषण", clean: "साफ और ताजी हवा", moderate: "मध्यम हवा", polluted: "प्रदूषित हवा", safeBreathe: "सांस लेने में सुरक्षित", takePrecautions: "मास्क पहनें" }
    },
    timing: {
      dayLabel: "दोपहर:",
      nightLabel: "शाम / रात:",
      engineNote: "इंद्रा एआई इंजन द्वारा विश्लेषित"
    }
  },

  mr: {
    headerTitle: "आजचा सोपा हवामान अंदाज",
    headerSubtitle: "सोप्या शब्दात — कोणताही तांत्रिक डेटा न देता, थेट कामाची माहिती",
    verdicts: {
      rain: {
        title: "आज पावसाची दाट शक्यता आहे!",
        subtitle: "दिवसभरात पाऊस पडू शकतो. घराबाहेर पडताना छत्री नक्की सोबत ठेवा.",
        badge: "छत्री सोबत ठेवा"
      },
      hot: {
        title: "आज कडक ऊन आणि उकाडा जाणवेल!",
        subtitle: "तापमान वाढेल. दुपारच्या कडक उन्हात जाणे टाळा आणि भरपूर पाणी प्या.",
        badge: "कडक ऊन"
      },
      cold: {
        title: "आज गारवा आणि थंडी राहील!",
        subtitle: "सकाळी आणि संध्याकाळी गार वारे वाहतील. अंगात उबदार गरम कपडे घाला.",
        badge: "थंडीचा दिवस"
      },
      cool: {
        title: "हल्की थंडी आणि प्रसन्न हवामान राहील!",
        subtitle: "दिवसभर छान वातावरण असेल, सकाळी-संध्याकाळी हलका गारवा जाणवेल.",
        badge: "हलका गारवा"
      },
      pleasant: {
        title: "आजचे हवामान अगदी मन प्रसन्न करणारे आहे!",
        subtitle: "ऊन-सावलीचा छान खेळ राहील. बाहेर फिरण्यासाठी आणि कामासाठी उत्तम दिवस.",
        badge: "उत्तम हवामान"
      },
      normal: {
        title: "आजचा दिवस सामान्य व शांत राहील!",
        subtitle: "कोणताही त्रास होणार नाही. पावसाची अजिबात शक्यता नाही.",
        badge: "सामान्य दिवस"
      }
    },
    deciders: {
      umbrella: { title: "छत्री हवी का?", yes: "होय, नक्की घ्या!", maybe: "हलकी सर येऊ शकते", no: "नाही, गरज नाही", clearSky: "आकाश निरभ्र राहील", rainChanceSuffix: "पावसाची शक्यता" },
      clothes: { title: "काय कपडे घालावे?", warm: "स्वेटर किंवा जॅकेट", light: "हलके सुती कपडे", casual: "साधे आरामदायी कपडे" },
      outside: { title: "बाहेर पडणे?", great: "उत्तम वेळ आहे", avoidSun: "दुपारचे ऊन टाळा", checkRain: "काळजीपूर्वक पडा", wearMask: "मास्क वापरा", highUv: "ऊन तीव्र आहे", fairAir: "हवा सामान्य आहे" },
      air: { title: "हवेचा दर्जा", clean: "हवा अतिशय स्वच्छ", moderate: "मध्यम दर्जा", polluted: "हवा प्रदूषित", safeBreathe: "आरोग्यास उत्तम", takePrecautions: "मास्क घाला" }
    },
    timing: {
      dayLabel: "दुपारी:",
      nightLabel: "संध्याकाळी:",
      engineNote: "इंद्रा वेदर इंजिन"
    }
  },

  en: {
    headerTitle: "Today's Simple Weather Summary",
    headerSubtitle: "In plain everyday words — zero confusing jargon, just pure practical facts",
    verdicts: {
      rain: {
        title: "Rain is expected today — keep an umbrella handy!",
        subtitle: "Wet spells are on the way. Don't forget to take rain protection when stepping out.",
        badge: "Bring Umbrella"
      },
      hot: {
        title: "Hot and sunny day ahead — stay well hydrated!",
        subtitle: "Daytime heat will be strong. Avoid direct midday sun and wear lightweight clothes.",
        badge: "Hot & Sunny"
      },
      cold: {
        title: "Cold weather today — bundle up!",
        subtitle: "Temperatures will dip sharply in the morning and night. Wear heavy warm layers.",
        badge: "Cold Weather"
      },
      cool: {
        title: "Pleasantly cool day with mild breeze!",
        subtitle: "Comfortable sunshine with a crisp nip in the air during morning and evening.",
        badge: "Cool & Crisp"
      },
      pleasant: {
        title: "Delightful and pleasant weather today!",
        subtitle: "Gentle skies and ideal temperatures. Great conditions for outdoor work or travel.",
        badge: "Pleasant Day"
      },
      normal: {
        title: "Calm and steady weather all day!",
        subtitle: "Normal temperatures with no immediate rain threats in sight.",
        badge: "Fair Weather"
      }
    },
    deciders: {
      umbrella: { title: "Need Umbrella?", yes: "Yes, take one!", maybe: "Possible drizzle", no: "No, not needed", clearSky: "Clear skies ahead", rainChanceSuffix: "chance of rain" },
      clothes: { title: "What to Wear?", warm: "Warm jacket or sweater", light: "Light breathable cotton", casual: "Comfortable casual wear" },
      outside: { title: "Going Outside?", great: "Great time to go out", avoidSun: "Avoid midday sun", checkRain: "Check skies first", wearMask: "Wear a protective mask", highUv: "High UV sunlight", fairAir: "Fair conditions" },
      air: { title: "Air Quality", clean: "Clean & fresh air", moderate: "Moderate quality", polluted: "Unhealthy air", safeBreathe: "Safe to breathe", takePrecautions: "Wear a mask" }
    },
    timing: {
      dayLabel: "Daytime:",
      nightLabel: "Night:",
      engineNote: "Analyzed by Indra Engine"
    }
  },

  gu: {
    headerTitle: "આજનો સરળ હવામાન સારાંશ",
    headerSubtitle: "સરળ શબ્દોમાં — કોઈ અટપટા આંકડા નહીં, સીધી કામની વાત",
    verdicts: {
      rain: {
        title: "આજે વરસાદની શક્યતા છે!",
        subtitle: "દિવસ દરમિયાન વરસાદ પડી શકે છે. બહાર નીકળતી વખતે છત્રી સાથે રાખજો.",
        badge: "છત્રી સાથે રાખો"
      },
      hot: {
        title: "આજે ખૂબ જ તડકો અને ગરમી રહેશે!",
        subtitle: "બપોરે આકરો તડકો પડશે. પુષ્કળ પાણી પીઓ અને હળવા કપડાં પહેરો.",
        badge: "કઠણ ગરમી"
      },
      cold: {
        title: "આજે જોરદાર ઠંડી રહેશે!",
        subtitle: "સવારે અને રાત્રે તાપમાન નીચું જશે. ગરમ કપડાં પહેરીને જ નીકળવું.",
        badge: "ઠંડું હવામાન"
      },
      cool: {
        title: "હળવી ઠંડક અને ખુશનુમા હવામાન રહેશે!",
        subtitle: "દિવસ દરમિયાન મીઠો તડકો અને સવાર-સાંજ ઠંડો પવન રહેશે.",
        badge: "હળવી ઠંડક"
      },
      pleasant: {
        title: "આજે હવામાન ખૂબ જ સરસ અને આહલાદક રહેશે!",
        subtitle: "બહાર ફરવા કે કામકાજ માટે એકદમ ઉત્તમ દિવસ છે.",
        badge: "ઉત્તમ દિવસ"
      },
      normal: {
        title: "આજનો દિવસ સામાન્ય અને શાંત રહેશે!",
        subtitle: "વરસાદનો કોઈ ભય નથી, વાતાવરણ અનુકૂળ રહેશે.",
        badge: "સામાન્ય દિવસ"
      }
    },
    deciders: {
      umbrella: { title: "છત્રી જોઈએ?", yes: "હા, સાથે રાખો!", maybe: "હળવા છાંટા પડી શકે", no: "ના, જરૂર નથી", clearSky: "આકાશ ચોખ્ખું રહેશે", rainChanceSuffix: "વરસાદની શક્યતા" },
      clothes: { title: "શું પહેરવું?", warm: "ગરમ સ્વેટર કે જેકેટ", light: "હળવા સુતરાઉ કપડાં", casual: "સામાન્ય આરામદાયક કપડાં" },
      outside: { title: "બહાર જવું?", great: "બહાર જવા માટે ઉત્તમ સમય", avoidSun: "બપોરે તડકો ટાળો", checkRain: "સાવચેતીથી નીકળો", wearMask: "માસ્ક પહેરો", highUv: "તીવ્ર તડકો", fairAir: "હવા સામાન્ય" },
      air: { title: "હવાની ગુણવત્તા", clean: "સ્વચ્છ અને તાજી હવા", moderate: "મધ્યમ ગુણવત્તા", polluted: "પ્રદૂષિત હવા", safeBreathe: "શ્વાસ માટે સલામત", takePrecautions: "સાવચેતી રાખો" }
    },
    timing: {
      dayLabel: "બપોરે:",
      nightLabel: "રાત્રે:",
      engineNote: "ઈન્દ્રા વેધર એન્જિન"
    }
  },

  bn: {
    headerTitle: "আজকের সহজ আবহাওয়া সারাংশ",
    headerSubtitle: "সহজ কথায় — কোনো জটিল মেট্রিক ছাড়া সরাসরি কাজের তথ্য",
    verdicts: {
      rain: {
        title: "আজ বৃষ্টির সম্ভাবনা রয়েছে!",
        subtitle: "দিনের কোনো এক সময় বৃষ্টি হতে পারে। বাইরে বের হলে অবশ্যই ছাতা সঙ্গে রাখুন।",
        badge: "ছাতা সাথে রাখুন"
      },
      hot: {
        title: "আজ তীব্র গরম ও চড়া রোদ থাকবে!",
        subtitle: "দুপুরে রোদ এড়িয়ে চলুন এবং পর্যাপ্ত জল পান করুন।",
        badge: "প্রচণ্ড গরম"
      },
      cold: {
        title: "আজ বেশ ঠান্ডা অনুভূত হবে!",
        subtitle: "সকাল ও রাতে তাপমাত্রা বেশ কমবে। গরম পোশাক পরে বের হন।",
        badge: "শীতল আবহাওয়া"
      },
      cool: {
        title: "হালকা ঠান্ডা ও মনোরম আবহাওয়া!",
        subtitle: "সকালে ও সন্ধ্যায় স্নিগ্ধ বাতাস বইবে।",
        badge: "হালকা শীত"
      },
      pleasant: {
        title: "আজ আবহাওয়া অত্যন্ত মনোরম ও চমৎকার থাকবে!",
        subtitle: "বাইরে ঘোরাঘুরি বা কাজের জন্য একদম নিখুঁত দিন।",
        badge: "সুন্দর দিন"
      },
      normal: {
        title: "দিনটি শান্ত ও স্বাভাবিক থাকবে!",
        subtitle: "বৃষ্টির আশঙ্কা নেই, আবহাওয়া অনুকূল থাকবে।",
        badge: "স্বাভাবিক দিন"
      }
    },
    deciders: {
      umbrella: { title: "ছাতা লাগবে?", yes: "হ্যাঁ, সাথে রাখুন!", maybe: "হালকা গুঁড়ি গুঁড়ি বৃষ্টি", no: "না, দরকার নেই", clearSky: "পরিষ্কার আকাশ", rainChanceSuffix: "বৃষ্টির সম্ভাবনা" },
      clothes: { title: "কী পোশাক পরবেন?", warm: "গরম সোয়েটার বা জ্যাকেট", light: "হালকা সুতির জামাকাপড়", casual: "আরামদায়ক সাধারণ পোশাক" },
      outside: { title: "বাইরে যাওয়া?", great: "বাইরে যাওয়ার জন্য দারুণ সময়", avoidSun: "দুপুরের রোদ এড়িয়ে চলুন", checkRain: "সাবধানে বের হবেন", wearMask: "মাস্ক ব্যবহার করুন", highUv: "কড়া রোদ", fairAir: "বায়ু স্বাভাবিক" },
      air: { title: "বাতাসের মান", clean: "পরিষ্কার ও সতেজ বাতাস", moderate: "মাঝারি মান", polluted: "দূষিত বাতাস", safeBreathe: "শ্বাস নেওয়ার জন্য ভালো", takePrecautions: "সতর্ক থাকুন" }
    },
    timing: {
      dayLabel: "দুপুরে:",
      nightLabel: "রাতে:",
      engineNote: "ইন্দ্র ওয়েদার ইঞ্জিন"
    }
  },

  ta: {
    headerTitle: "இன்றைய எளிய வானிலை சுருக்கம்",
    headerSubtitle: "எளிய வார்த்தைகளில் — சிக்கலான விவரங்கள் இன்றி பயனுள்ள தகவல்",
    verdicts: {
      rain: {
        title: "இன்று மழை பெய்ய வாய்ப்புள்ளது!",
        subtitle: "வெளியே செல்லும்போது குடையை மறக்காமல் எடுத்துச் செல்லுங்கள்.",
        badge: "குடை தேவை"
      },
      hot: {
        title: "இன்று வெயில் மற்றும் வெப்பம் அதிகமாக இருக்கும்!",
        subtitle: "நண்பகல் வெயிலைத் தவிர்த்து நிறைய தண்ணீர் குடியுங்கள்.",
        badge: "அதிக வெப்பம்"
      },
      cold: {
        title: "இன்று குளிர் அதிகமாக இருக்கும்!",
        subtitle: "காலை மற்றும் இரவு நேரங்களில் குளிர் நிலவும். கதகதப்பான ஆடைகளை அணியுங்கள்.",
        badge: "குளிர் வானிலை"
      },
      cool: {
        title: "மிதமான குளிர் மற்றும் இதமான வானிலை!",
        subtitle: "மெல்லிய காற்றுடன் இனிமையான நாளாக இருக்கும்.",
        badge: "இதமான குளிர்"
      },
      pleasant: {
        title: "இன்று வானிலை மிகவும் அருமையாகவும் இதமாகவும் இருக்கும்!",
        subtitle: "வெளிப்புற வேலைகள் மற்றும் பயணங்களுக்கு மிகச் சிறந்த நாள்.",
        badge: "அருமையான நாள்"
      },
      normal: {
        title: "இன்று நாள் வழக்கம் போல அமைதியாக இருக்கும்!",
        subtitle: "மழைக்கான வாய்ப்பு இல்லை, இயல்பான வானிலை.",
        badge: "இயல்பான நாள்"
      }
    },
    deciders: {
      umbrella: { title: "குடை தேவையா?", yes: "ஆம், எடுத்துச் செல்லுங்கள்!", maybe: "லேசான தூறல் வாய்ப்பு", no: "இல்லை, தேவையில்லை", clearSky: "தெளிவான வானம்", rainChanceSuffix: "மழை வாய்ப்பு" },
      clothes: { title: "என்ன உடை அணியலாம்?", warm: "ஸ்வெட்டர் அல்லது ஜாக்கெட்", light: "லேசான பருத்தி ஆடைகள்", casual: "வழக்கமான வசதியான உடைகள்" },
      outside: { title: "வெளியே செல்லலாமா?", great: "வெளியே செல்ல நல்ல நேரம்", avoidSun: "நண்பகல் வெயிலைத் தவிர்க்கவும்", checkRain: "வானிலை பார்த்துச் செல்லவும்", wearMask: "முகக்கவசம் அணியுங்கள்", highUv: "அதிக வெயில்", fairAir: "இயல்பான காற்று" },
      air: { title: "காற்றின் தரம்", clean: "சுத்தமான நல்ல காற்று", moderate: "மிதமான தரம்", polluted: "மாசுபட்ட காற்று", safeBreathe: "சுவாசிக்க பாதுகாப்பானது", takePrecautions: "எச்சரிக்கை தேவை" }
    },
    timing: {
      dayLabel: "பகலில்:",
      nightLabel: "இரவில்:",
      engineNote: "இந்திரா வானிலை என்ஜின்"
    }
  },

  te: {
    headerTitle: "ఈ రోజు సరళమైన వాతావరణ సారాంశం",
    headerSubtitle: "సులభమైన మాటల్లో — క్లిష్టమైన వివరాలు లేకుండా స్పష్టమైన సమాచారం",
    verdicts: {
      rain: {
        title: "ఈ రోజు వర్షం పడే అవకాశం ఉంది!",
        subtitle: "బయటకు వెళ్ళేటప్పుడు గొడుగు తప్పకుండా వెంట తీసుకెళ్లండి.",
        badge: "గొడుగు అవసరం"
      },
      hot: {
        title: "ఈ రోజు ఎండ తీవ్రత మరియు వేడి ఎక్కువగా ఉంటుంది!",
        subtitle: "మధ్యాహ్నం ఎండలో తిరగవద్దు, పుష్కలంగా నీరు త్రాగండి.",
        badge: "తీవ్రమైన ఎండ"
      },
      cold: {
        title: "ఈ రోజు చలి ఎక్కువగా ఉంటుంది!",
        subtitle: "ఉదయం, రాత్రి చల్లటి గాలులు వీస్తాయి. వెచ్చని దుస్తులు ధరించండి.",
        badge: "చల్లటి వాతావరణం"
      },
      cool: {
        title: "తేలికపాటి చలితో ఆహ్లాదకరమైన వాతావరణం!",
        subtitle: "పగటిపూట లేత ఎండ, ఆహ్లాదకరమైన గాలులు వీస్తాయి.",
        badge: "ఆహ్లాదకరమైన చలి"
      },
      pleasant: {
        title: "ఈ రోజు వాతావరణం చాలా చక్కగా మరియు ఆహ్లాదకరంగా ఉంటుంది!",
        subtitle: "బయటి పనులు, ప్రయాణాలకు ఎంతో అనుకూలమైన రోజు.",
        badge: "మంచి రోజు"
      },
      normal: {
        title: "ఈ రోజు సాధారణంగా మరియు ప్రశాంతంగా ఉంటుంది!",
        subtitle: "వర్షం ప్రమాదం లేదు, సాధారణ పరిస్థితులు.",
        badge: "సాధారణ రోజు"
      }
    },
    deciders: {
      umbrella: { title: "గొడుగు కావాలా?", yes: "అవును, వెంట తీసుకెళ్లండి!", maybe: "తేలికపాటి జల్లులు", no: "అవసరం లేదు", clearSky: "స్వచ్ఛమైన ఆకాశం", rainChanceSuffix: "వర్ష సూచన" },
      clothes: { title: "ఏ దుస్తులు వేసుకోవాలి?", warm: "వెచ్చని స్వెటర్ లేదా జాకెట్", light: "తేలికపాటి కాటన్ దుస్తులు", casual: "సాధారణ సౌకర్యవంతమైన బట్టలు" },
      outside: { title: "బయటకు వెళ్లడం?", great: "బయటకు వెళ్ళడానికి మంచి సమయం", avoidSun: "మధ్యాహ్నం ఎండను నివారించండి", checkRain: "జాగ్రత్తగా వెళ్ళండి", wearMask: "మాస్క్ ధరించండి", highUv: "తీవ్రమైన ఎండ", fairAir: "సాధారణ గాలి" },
      air: { title: "గాలి నాణ్యత", clean: "స్వచ్ఛమైన గాలి", moderate: "మధ్యస్థ నాణ్యత", polluted: "కాలుష్య గాలి", safeBreathe: "శ్వాసకు అనుకూలం", takePrecautions: "జాగ్రత్త అవసరం" }
    },
    timing: {
      dayLabel: "పగలు:",
      nightLabel: "రాత్రి:",
      engineNote: "ఇంద్రా వెదర్ ఇంజిన్"
    }
  },

  pa: {
    headerTitle: "ਅੱਜ ਦਾ ਸਰਲ ਮੌਸਮ ਸਾਰ",
    headerSubtitle: "ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ — ਬਿਨਾਂ ਕਿਸੇ ਔਖੇ ਅੰਕੜਿਆਂ ਦੇ ਸਿੱਧੀ ਕੰਮ ਦੀ ਗੱਲ",
    verdicts: {
      rain: {
        title: "ਅੱਜ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ!",
        subtitle: "ਦਿਨ ਵਿੱਚ ਮੀਂਹ ਪੈ ਸਕਦਾ ਹੈ। ਘਰੋਂ ਬਾਹਰ ਜਾਣ ਵੇਲੇ ਛਤਰੀ ਜ਼ਰੂਰ ਨਾਲ ਰੱਖੋ।",
        badge: "ਛਤਰੀ ਨਾਲ ਰੱਖੋ"
      },
      hot: {
        title: "ਅੱਜ ਤੇਜ਼ ਧੁੱਪ ਅਤੇ ਗਰਮੀ ਰਹੇਗੀ!",
        subtitle: "ਦੁਪਹਿਰ ਦੀ ਸਿੱਧੀ ਧੁੱਪ ਤੋਂ ਬਚੋ ਅਤੇ ਖੂਬ ਪਾਣੀ ਪੀਓ।",
        badge: "ਕੜਕਦੀ ਧੁੱਪ"
      },
      cold: {
        title: "ਅੱਜ ਕੜਾਕੇ ਦੀ ਠੰਢ ਰਹੇਗੀ!",
        subtitle: "ਸਵੇਰੇ ਅਤੇ ਰਾਤ ਨੂੰ ਠੰਢ ਵਧੇਗੀ। ਗਰਮ ਕੱਪੜੇ ਪਾ ਕੇ ਹੀ ਬਾਹਰ ਨਿਕਲੋ।",
        badge: "ਠੰਢ ਦਾ ਮੌਸਮ"
      },
      cool: {
        title: "ਹਲਕੀ ਠੰਢ ਅਤੇ ਸੁਹਾਵਣਾ ਮੌਸਮ ਰਹੇਗਾ!",
        subtitle: "ਦਿਨ ਵਿੱਚ ਮਿੱਠੀ ਧੁੱਪ ਅਤੇ ਸਵੇਰੇ-ਸ਼ਾਮ ਠੰਢੀਆਂ ਹਵਾਵਾਂ ਚੱਲਣਗੀਆਂ।",
        badge: "ਸੁਹਾਵਣੀ ਠੰਢ"
      },
      pleasant: {
        title: "ਅੱਜ ਮੌਸਮ ਬਹੁਤ ਹੀ ਸੁਹਾਵਣਾ ਰਹੇਗਾ!",
        subtitle: "ਬਾਹਰ ਘੁੰਮਣ ਜਾਂ ਕੰਮ ਕਰਨ ਲਈ ਬਹੁਤ ਵਧੀਆ ਦਿਨ ਹੈ।",
        badge: "ਵਧੀਆ ਦਿਨ"
      },
      normal: {
        title: "ਦਿਨ ਆਮ ਅਤੇ ਸ਼ਾਂਤ ਰਹੇਗਾ!",
        subtitle: "ਮੀਂਹ ਦਾ ਕੋਈ ਖ਼ਤਰਾ ਨਹੀਂ ਹੈ, ਮੌਸਮ ਬਿਲਕੁਲ ਠੀਕ ਰਹੇਗਾ।",
        badge: "ਆਮ ਦਿਨ"
      }
    },
    deciders: {
      umbrella: { title: "ਛਤਰੀ ਚਾਹੀਦੀ ਹੈ?", yes: "ਹਾਂ, ਨਾਲ ਲੈ ਕੇ ਜਾਓ!", maybe: "ਹਲਕੀਆਂ ਫੁਹਾਰਾਂ ਸੰਭਵ", no: "ਨਹੀਂ, ਲੋੜ ਨਹੀਂ", clearSky: "ਅਸਮਾਨ ਸਾਫ਼ ਰਹੇਗਾ", rainChanceSuffix: "ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ" },
      clothes: { title: "ਕੀ ਪਹਿਨੀਏ?", warm: "ਗਰਮ ਸਵੈਟਰ ਜਾਂ ਜੈਕੇਟ", light: "ਹਲਕੇ ਸੂਤੀ ਕੱਪੜੇ", casual: "ਆਰਾਮਦਾਇਕ ਆਮ ਕੱਪੜੇ" },
      outside: { title: "ਬਾਹਰ ਜਾਣਾ?", great: "ਬਾਹਰ ਜਾਣ ਲਈ ਵਧੀਆ ਸਮਾਂ", avoidSun: "ਦੁਪਹਿਰ ਦੀ ਧੁੱਪ ਤੋਂ ਬਚੋ", checkRain: "ਧਿਆਨ ਨਾਲ ਨਿਕਲੋ", wearMask: "ਮਾਸਕ ਲਗਾਓ", highUv: "ਤੇਜ਼ ਧੁੱਪ", fairAir: "ਹਵਾ ਠੀਕ ਹੈ" },
      air: { title: "ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ", clean: "ਸਾਫ਼ ਤੇ ਤਾਜ਼ੀ ਹਵਾ", moderate: "ਦਰਮਿਆਨੀ ਹਵਾ", polluted: "ਪ੍ਰਦੂਸ਼ਿਤ ਹਵਾ", safeBreathe: "ਸਾਹ ਲੈਣ ਲਈ ਸੁਰੱਖਿਅਤ", takePrecautions: "ਸਾਵਧਾਨੀ ਰੱਖੋ" }
    },
    timing: {
      dayLabel: "ਦੁਪਹਿਰੇ:",
      nightLabel: "ਰਾਤ ਨੂੰ:",
      engineNote: "ਇੰਦਰਾ ਮੌਸਮ ਇੰਜਣ"
    }
  },

  es: {
    headerTitle: "Resumen Meteorológico Simple de Hoy",
    headerSubtitle: "En palabras sencillas de uso diario — sin tecnicismos confusos",
    verdicts: {
      rain: {
        title: "¡Se espera lluvia hoy — lleve un paraguas!",
        subtitle: "Habrá precipitaciones a lo largo del día. No olvide su impermeable al salir.",
        badge: "Llevar Paraguas"
      },
      hot: {
        title: "¡Día caluroso y soleado — manténgase hidratado!",
        subtitle: "El calor será fuerte al mediodía. Beba agua y vista ropa fresca y ligera.",
        badge: "Calor Intenso"
      },
      cold: {
        title: "¡Día frío — abríguese bien!",
        subtitle: "Las temperaturas caerán en la mañana y noche. Use ropa de abrigo.",
        badge: "Mucho Frío"
      },
      cool: {
        title: "¡Clima fresco y agradable con brisa suave!",
        subtitle: "Sol placentero con aire fresco al amanecer y anochecer.",
        badge: "Fresco y Agradable"
      },
      pleasant: {
        title: "¡Clima espléndido y muy cómodo hoy!",
        subtitle: "Condiciones ideales para planes al aire libre o trabajar cómodamente.",
        badge: "Día Espléndido"
      },
      normal: {
        title: "¡Tiempo tranquilo y estable todo el día!",
        subtitle: "Temperaturas moderadas sin alertas ni lluvias a la vista.",
        badge: "Tiempo Estable"
      }
    },
    deciders: {
      umbrella: { title: "¿Paraguas?", yes: "¡Sí, llévelo!", maybe: "Llovizna posible", no: "No, no hace falta", clearSky: "Cielo despejado", rainChanceSuffix: "probabilidad de lluvia" },
      clothes: { title: "¿Qué vestir?", warm: "Chaqueta abrigada o suéter", light: "Ropa ligera de algodón", casual: "Ropa informal cómoda" },
      outside: { title: "¿Salir afuera?", great: "Excelente momento para salir", avoidSun: "Evite el sol directo del mediodía", checkRain: "Mire el cielo antes de salir", wearMask: "Use mascarilla", highUv: "Rayos UV altos", fairAir: "Aire aceptable" },
      air: { title: "Calidad del Aire", clean: "Aire limpio y puro", moderate: "Calidad moderada", polluted: "Aire contaminado", safeBreathe: "Seguro para respirar", takePrecautions: "Tome precauciones" }
    },
    timing: {
      dayLabel: "Tarde:",
      nightLabel: "Noche:",
      engineNote: "Analizado por Indra Engine"
    }
  },

  fr: {
    headerTitle: "Résumé Météo Simple d'Aujourd'hui",
    headerSubtitle: "En mots simples du quotidien — sans jargon météorologique",
    verdicts: {
      rain: {
        title: "Pluie prévue aujourd'hui — prenez un parapluie !",
        subtitle: "Des averses sont probables au cours de la journée. Protégez-vous avant de sortir.",
        badge: "Prendre Parapluie"
      },
      hot: {
        title: "Journée chaude et ensoleillée — hydratez-vous bien !",
        subtitle: "Chaleur intense à midi. Évitez l'exposition directe au soleil et buvez de l'eau.",
        badge: "Chaud & Ensoleillé"
      },
      cold: {
        title: "Temps froid aujourd'hui — couvrez-vous bien !",
        subtitle: "Températures en baisse nette le matin et le soir. Portez des vêtements chauds.",
        badge: "Temps Froid"
      },
      cool: {
        title: "Journée fraîche et agréable avec une brise douce !",
        subtitle: "Un beau soleil avec une légère fraîcheur matinale et nocturne.",
        badge: "Frais & Doux"
      },
      pleasant: {
        title: "Météo idéale et très agréable aujourd'hui !",
        subtitle: "Excellentes conditions pour vos activités extérieures ou promenades.",
        badge: "Idéal"
      },
      normal: {
        title: "Temps calme et paisible toute la journée !",
        subtitle: "Conditions stables sans aucun risque de pluie immédiat.",
        badge: "Temps Calme"
      }
    },
    deciders: {
      umbrella: { title: "Parapluie ?", yes: "Oui, à emporter !", maybe: "Bruine possible", no: "Non, pas nécessaire", clearSky: "Ciel dégagé", rainChanceSuffix: "chance de pluie" },
      clothes: { title: "Que porter ?", warm: "Veste chaude ou pull", light: "Vêtements légers en coton", casual: "Tenue décontractée" },
      outside: { title: "Sortir dehors ?", great: "Moment idéal pour sortir", avoidSun: "Évitez le soleil à midi", checkRain: "Surveillez les averses", wearMask: "Portez un masque", highUv: "Indice UV fort", fairAir: "Air convenable" },
      air: { title: "Qualité de l'Air", clean: "Air pur et sain", moderate: "Qualité modérée", polluted: "Air pollué", safeBreathe: "Sain pour respirer", takePrecautions: "Prenez vos précautions" }
    },
    timing: {
      dayLabel: "Journée :",
      nightLabel: "Soir / Nuit :",
      engineNote: "Analysé par Indra Engine"
    }
  },

  de: {
    headerTitle: "Einfache Wetterübersicht für Heute",
    headerSubtitle: "In einfacher Alltagssprache — keine Fachbegriffe, nur praktische Tipps",
    verdicts: {
      rain: {
        title: "Heute ist mit Regen zu rechnen — Regenschirm mitnehmen!",
        subtitle: "Im Tagesverlauf sind Regenschauer wahrscheinlich. Schützen Sie sich unterwegs.",
        badge: "Schirm einpacken"
      },
      hot: {
        title: "Heißer und sonniger Tag — viel trinken!",
        subtitle: "Mittags wird es heiß. Vermeiden Sie pralle Sonne und tragen Sie leichte Kleidung.",
        badge: "Heiß & Sonnig"
      },
      cold: {
        title: "Kaltes Wetter heute — warm anziehen!",
        subtitle: "Morgens und nachts sinken die Temperaturen spürbar. Warme Jacke empfohlen.",
        badge: "Kalt"
      },
      cool: {
        title: "Angenehm kühles Wetter mit frischer Brise!",
        subtitle: "Sonnig, aber morgens und abends spürbar frisch.",
        badge: "Frisch & Kühl"
      },
      pleasant: {
        title: "Wunderbares und sehr angenehmes Wetter!",
        subtitle: "Optimale Bedingungen für Aktivitäten im Freien oder Unternehmungen.",
        badge: "Herrliches Wetter"
      },
      normal: {
        title: "Ruhiges und beständiges Wetter heute!",
        subtitle: "Normale Temperaturen ohne Regenrisiko.",
        badge: "Ruhig"
      }
    },
    deciders: {
      umbrella: { title: "Regenschirm?", yes: "Ja, mitnehmen!", maybe: "Leichter Nieselregen möglich", no: "Nein, nicht nötig", clearSky: "Klarer Himmel", rainChanceSuffix: "Regenwahrscheinlichkeit" },
      clothes: { title: "Was anziehen?", warm: "Warme Jacke oder Pullover", light: "Leichte Baumwollkleidung", casual: "Bequeme Freizeitkleidung" },
      outside: { title: "Draußen sein?", great: "Tolles Wetter für draußen", avoidSun: "Mittagssonne meiden", checkRain: "Wetter beobachten", wearMask: "Maske tragen", highUv: "Starke UV-Strahlung", fairAir: "Gute Luft" },
      air: { title: "Luftqualität", clean: "Saubere & frische Luft", moderate: "Mäßige Qualität", polluted: "Schlechte Luftqualität", safeBreathe: "Unbedenklich", takePrecautions: "Vorsicht geboten" }
    },
    timing: {
      dayLabel: "Tagsüber:",
      nightLabel: "Abends / Nachts:",
      engineNote: "Analysiert von Indra Engine"
    }
  },

  ja: {
    headerTitle: "今日のカンタンお天気まとめ",
    headerSubtitle: "誰でもひと目でわかる日常の言葉 — 専門用語なしの直感ガイド",
    verdicts: {
      rain: {
        title: "今日は雨の予報です — 傘を持ってお出かけを！",
        subtitle: "日中に雨が降る可能性が高いです。外出時は雨具を忘れずに。",
        badge: "傘が必要"
      },
      hot: {
        title: "今日はかなり暑く日差しが強いです — 水分補給を！",
        subtitle: "日中の気温が上がります。直射日光を避け、涼しい服装でお過ごしください。",
        badge: "厳しい暑さ"
      },
      cold: {
        title: "今日は冷え込みます — 暖かい服装で！",
        subtitle: "朝晩は特に冷え込みます。厚手の上着やマフラーを着用してください。",
        badge: "冷え込み"
      },
      cool: {
        title: "過ごしやすい爽やかな陽気です！",
        subtitle: "心地よい日差しと爽やかな風を感じられる一日になります。",
        badge: "爽やか"
      },
      pleasant: {
        title: "今日はお出かけに最適な快適なお天気！",
        subtitle: "外でのアクティビティや仕事が快適に進む素晴らしい一日です。",
        badge: "快適な一日"
      },
      normal: {
        title: "一日を通して穏やかなお天気です！",
        subtitle: "雨の心配はなく、過ごしやすい標準的な天候です。",
        badge: "穏やか"
      }
    },
    deciders: {
      umbrella: { title: "傘は必要？", yes: "はい、持参推奨！", maybe: "折りたたみ傘があると安心", no: "いいえ、不要です", clearSky: "快晴の空模様", rainChanceSuffix: "降水確率" },
      clothes: { title: "おすすめの服装", warm: "暖かいジャケットやセーター", light: "涼しい半袖・綿の服", casual: "快適な普段着" },
      outside: { title: "外出について", great: "お出かけに最適な時間", avoidSun: "昼間の直射日光を避ける", checkRain: "空模様を確認して外出", wearMask: "マスク着用を推奨", highUv: "紫外線が強い", fairAir: "空気良好" },
      air: { title: "空気のきれいさ", clean: "清潔で澄んだ空気", moderate: "標準レベル", polluted: "空気が汚れています", safeBreathe: "呼吸に安心", takePrecautions: "対策が必要" }
    },
    timing: {
      dayLabel: "日中：",
      nightLabel: "夜間：",
      engineNote: "Indra Engine 解析"
    }
  },

  ar: {
    headerTitle: "الملخص اليومي البسيط للطقس",
    headerSubtitle: "بكلمات سهلة وواضحة — دون مصطلحات معقدة، فقط ما يهمك",
    verdicts: {
      rain: {
        title: "من المتوقع هطول أمطار اليوم — احمل معك مظلة!",
        subtitle: "احتمالية هطول أمطار خلال اليوم. تأكد من اصطحاب المظلة عند الخروج.",
        badge: "احمل مظلة"
      },
      hot: {
        title: "يوم حار ومشمس — احرص على شرب الكثير من الماء!",
        subtitle: "الحرارة شديدة خاصة عند الظهيرة. تجنب أشعة الشمس المباشرة وارتد ملابس قطنية خفيفة.",
        badge: "طقس حار"
      },
      cold: {
        title: "طقس بارد اليوم — ارتدِ ملابس دافئة!",
        subtitle: "ستنخفض درجات الحرارة صباحاً ومساءً. ينصح بارتداء معطف دافئ.",
        badge: "طقس بارد"
      },
      cool: {
        title: "طقس لطيف ومنعش مع نسيم عليل!",
        subtitle: "شمس لطيفة ورياح منعشة صباحاً ومساءً.",
        badge: "منعش ولطيف"
      },
      pleasant: {
        title: "الطقس رائع ومثالي جداً اليوم!",
        subtitle: "أجواء ممتازة للخروج والتنزه أو إنجاز الأعمال اليومية.",
        badge: "يوم رائع"
      },
      normal: {
        title: "يوم هادئ ومستقر تماماً!",
        subtitle: "درجات حرارة معتدلة دون خطر للأمطار.",
        badge: "طقس مستقر"
      }
    },
    deciders: {
      umbrella: { title: "هل تحتاج مظلة؟", yes: "نعم، خذها معك!", maybe: "رذاذ خفيف محتمل", no: "لا، لست بحاجة لها", clearSky: "سماء صافية", rainChanceSuffix: "فرصة هطول" },
      clothes: { title: "ماذا ترتدي؟", warm: "سترة أو معطف دافئ", light: "ملابس قطنية خفيفة", casual: "ملابس يومية مريحة" },
      outside: { title: "الخروج في الهواء الطلق؟", great: "وقت ممتاز للخروج", avoidSun: "تجنب شمس الظهيرة", checkRain: "انتبه للأمطار", wearMask: "ارتدِ كمامة واقية", highUv: "أشعة شمس قوية", fairAir: "الهواء مقبول" },
      air: { title: "جودة الهواء", clean: "هواء نقي ومنعش", moderate: "جودة متوسطة", polluted: "هواء ملوث", safeBreathe: "آمن للتنفس", takePrecautions: "توخ الحذر" }
    },
    timing: {
      dayLabel: "الظهيرة:",
      nightLabel: "المساء / الليل:",
      engineNote: "تحليل محرك إندرا للطقس"
    }
  },

  zh: {
    headerTitle: "今日简明天气总结",
    headerSubtitle: "通俗易懂的生活语言 — 没有晦涩的专业术语，直击关键",
    verdicts: {
      rain: {
        title: "今日有雨 — 出门记得带伞！",
        subtitle: "白天有较大概率出现降水，外出请备好雨具。",
        badge: "随身带伞"
      },
      hot: {
        title: "今日天气炎热，阳光充足 — 注意防暑补水！",
        subtitle: "午后气温较高，紫外线强，请尽量避免长时间暴晒。",
        badge: "高温炎热"
      },
      cold: {
        title: "今日天气寒冷 — 请注意保暖添衣！",
        subtitle: "早晚温差大且气温偏低，出门请穿着保暖外套。",
        badge: "注意防寒"
      },
      cool: {
        title: "微风拂面，清爽舒适的一天！",
        subtitle: "阳光温和，早晚稍有凉意，非常舒服。",
        badge: "清爽宜人"
      },
      pleasant: {
        title: "今日天气极其宜人，十分舒适！",
        subtitle: "温度适宜，非常适合户外散步、出行或工作。",
        badge: "极佳天气"
      },
      normal: {
        title: "今日天气平稳温和！",
        subtitle: "没有降雨危险，整体体感平稳。",
        badge: "平稳常态"
      }
    },
    deciders: {
      umbrella: { title: "需要带伞吗？", yes: "是的，建议携带！", maybe: "可能偶有零星细雨", no: "不需要携带", clearSky: "天空晴朗", rainChanceSuffix: "降水概率" },
      clothes: { title: "穿衣建议", warm: "保暖外套或毛衣", light: "轻薄透气棉质衣物", casual: "舒适休闲便服" },
      outside: { title: "外出适宜度", great: "非常适宜外出", avoidSun: "避免正午暴晒", checkRain: "留意天气变化", wearMask: "建议佩戴口罩", highUv: "紫外线较强", fairAir: "空气尚可" },
      air: { title: "空气质量", clean: "空气清新洁净", moderate: "空气质量一般", polluted: "空气有污染", safeBreathe: "呼吸舒适健康", takePrecautions: "外出做好防护" }
    },
    timing: {
      dayLabel: "白天：",
      nightLabel: "夜间：",
      engineNote: "由 Indra 引擎分析"
    }
  },

  ru: {
    headerTitle: "Простой прогноз погоды на сегодня",
    headerSubtitle: "Простыми понятными словами — без лишних терминов, только суть",
    verdicts: {
      rain: {
        title: "Сегодня ожидается дождь — возьмите зонт!",
        subtitle: "В течение дня вероятны осадки. Не забудьте дождевик или зонтик при выходе.",
        badge: "Возьмите зонт"
      },
      hot: {
        title: "Жаркий и солнечный день — пейте больше воды!",
        subtitle: "Днем будет жарко. Избегайте полуденного солнца и надевайте легкую одежду.",
        badge: "Жара и солнце"
      },
      cold: {
        title: "Сегодня холодно — одевайтесь теплее!",
        subtitle: "Утром и ночью температура заметно упадет. Рекомендуется теплая куртка.",
        badge: "Холодная погода"
      },
      cool: {
        title: "Приятная прохлада и свежий ветерок!",
        subtitle: "Мягкое солнце, но утром и вечером ощущается бодрящая свежесть.",
        badge: "Свежо и приятно"
      },
      pleasant: {
        title: "Замечательная и комфортная погода сегодня!",
        subtitle: "Идеальные условия для прогулок, дел на свежем воздухе и поездок.",
        badge: "Отличный день"
      },
      normal: {
        title: "Спокойная и стабильная погода!",
        subtitle: "Умеренная температура, осадков не предвидится.",
        badge: "Без сюрпризов"
      }
    },
    deciders: {
      umbrella: { title: "Нужен зонт?", yes: "Да, обязательно!", maybe: "Возможен мелкий дождь", no: "Нет, не нужен", clearSky: "Ясное небо", rainChanceSuffix: "вероятность осадков" },
      clothes: { title: "Что надеть?", warm: "Теплая куртка или свитер", light: "Легкая дышащая одежда", casual: "Удобная повседневная одежда" },
      outside: { title: "Выход на улицу?", great: "Отличное время для прогулок", avoidSun: "Избегайте солнца в полдень", checkRain: "Следите за тучами", wearMask: "Наденьте маску", highUv: "Высокий УФ-индекс", fairAir: "Нормальный воздух" },
      air: { title: "Качество воздуха", clean: "Чистый и свежий воздух", moderate: "Умеренное качество", polluted: "Загрязненный воздух", safeBreathe: "Безопасно дышать", takePrecautions: "Соблюдайте осторожность" }
    },
    timing: {
      dayLabel: "Днем:",
      nightLabel: "Ночью:",
      engineNote: "Анализ системы Indra"
    }
  },

  pt: {
    headerTitle: "Resumo Simples do Clima de Hoje",
    headerSubtitle: "Em palavras fáceis do dia a dia — sem jargões complicados",
    verdicts: {
      rain: {
        title: "Previsão de chuva para hoje — leve o guarda-chuva!",
        subtitle: "Períodos chuvosos são esperados hoje. Não saia sem proteção.",
        badge: "Leve Guarda-chuva"
      },
      hot: {
        title: "Dia quente e ensolarado — mantenha-se hidratado!",
        subtitle: "O calor será intenso ao meio-dia. Beba bastante água e use roupas frescas.",
        badge: "Calor & Sol"
      },
      cold: {
        title: "Tempo frio hoje — agasalhe-se bem!",
        subtitle: "As temperaturas cairão pela manhã e à noite. Use um bom casaco.",
        badge: "Tempo Frio"
      },
      cool: {
        title: "Clima fresco e agradável com brisa suave!",
        subtitle: "Sol agradável com um friozinho gostoso no início e fim do dia.",
        badge: "Fresco & Gostoso"
      },
      pleasant: {
        title: "Clima maravilhoso e muito confortável hoje!",
        subtitle: "Ótimas condições para atividades ao ar livre ou passeios.",
        badge: "Dia Perfeito"
      },
      normal: {
        title: "Tempo calmo e estável o dia todo!",
        subtitle: "Temperaturas amenas e sem risco imediato de chuva.",
        badge: "Tempo Firme"
      }
    },
    deciders: {
      umbrella: { title: "Precisa de guarda-chuva?", yes: "Sim, leve com você!", maybe: "Possível garoa leve", no: "Não, não precisa", clearSky: "Céu limpo", rainChanceSuffix: "chance de chuva" },
      clothes: { title: "O que vestir?", warm: "Casaco quente ou blusa", light: "Roupas leves de algodão", casual: "Roupas casuais confortáveis" },
      outside: { title: "Sair ao ar livre?", great: "Ótimo momento para sair", avoidSun: "Evite sol direto no almoço", checkRain: "Fique atento ao céu", wearMask: "Use máscara protetora", highUv: "Índice UV alto", fairAir: "Ar razoável" },
      air: { title: "Qualidade do Ar", clean: "Ar limpo e puro", moderate: "Qualidade moderada", polluted: "Ar poluído", safeBreathe: "Seguro para respirar", takePrecautions: "Tome precauções" }
    },
    timing: {
      dayLabel: "Tarde:",
      nightLabel: "Noite:",
      engineNote: "Analisado pelo Motor Indra"
    }
  },

  it: {
    headerTitle: "Sintesi Meteo Semplice di Oggi",
    headerSubtitle: "In parole semplici di tutti i giorni — niente gergo tecnico, solo consigli utili",
    verdicts: {
      rain: {
        title: "Pioggia prevista oggi — porta un ombrello!",
        subtitle: "Possibili rovesci durante la giornata. Non dimenticare l'ombrello uscendo.",
        badge: "Prendi l'ombrello"
      },
      hot: {
        title: "Giornata calda e soleggiata — bevi molta acqua!",
        subtitle: "Caldo intenso a mezzogiorno. Evita il sole cocente e indossa abiti freschi.",
        badge: "Caldo & Soleggiato"
      },
      cold: {
        title: "Giornata fredda — copriti bene!",
        subtitle: "Temperature basse al mattino e alla sera. Indossa una giacca pesante.",
        badge: "Fa Freddo"
      },
      cool: {
        title: "Fresco e piacevole con una leggera brezza!",
        subtitle: "Sole mite con un'aria fresca al mattino e alla sera.",
        badge: "Fresco & Dolce"
      },
      pleasant: {
        title: "Tempo splendido e molto piacevole oggi!",
        subtitle: "Condizioni perfette per passeggiate o impegni all'aperto.",
        badge: "Giornata Ideale"
      },
      normal: {
        title: "Tempo tranquillo e stabile per tutto il giorno!",
        subtitle: "Temperature moderate senza rischi di pioggia.",
        badge: "Stabile"
      }
    },
    deciders: {
      umbrella: { title: "Serve l'ombrello?", yes: "Sì, portalo!", maybe: "Possibile pioggerella", no: "No, non serve", clearSky: "Cielo sereno", rainChanceSuffix: "probabilità di pioggia" },
      clothes: { title: "Cosa indossare?", warm: "Giacca pesante o maglione", light: "Abiti leggeri in cotone", casual: "Abbigliamento comodo" },
      outside: { title: "Uscire all'aperto?", great: "Momento ottimo per uscire", avoidSun: "Evita il sole a mezzogiorno", checkRain: "Controlla il cielo", wearMask: "Usa la mascherina", highUv: "UV elevati", fairAir: "Aria discreta" },
      air: { title: "Qualità dell'Aria", clean: "Aria pulita e fresca", moderate: "Qualità discreta", polluted: "Aria inquinata", safeBreathe: "Sicura per respirare", takePrecautions: "Fai attenzione" }
    },
    timing: {
      dayLabel: "Di giorno:",
      nightLabel: "Di sera / notte:",
      engineNote: "Elaborato da Indra Engine"
    }
  },

  ko: {
    headerTitle: "오늘의 초간단 날씨 요약",
    headerSubtitle: "어려운 기상 용어 없이 일상 언어로 쏙쏙 이해하는 오늘 날씨",
    verdicts: {
      rain: {
        title: "오늘 비 예보가 있습니다 — 우산을 꼭 챙기세요!",
        subtitle: "낮 동안 비가 내릴 가능성이 있습니다. 외출 시 우산을 잊지 마세요.",
        badge: "우산 챙기기"
      },
      hot: {
        title: "오늘은 무덥고 강한 햇빛이 내리쬡니다 — 수분을 충분히 섭취하세요!",
        subtitle: "한낮 더위가 심합니다. 직사광선을 피하고 시원하고 가벼운 옷을 입으세요.",
        badge: "무더위"
      },
      cold: {
        title: "오늘 날씨가 꽤 쌀쌀하고 춥습니다 — 따뜻하게 입으세요!",
        subtitle: "아침과 밤에 기온이 뚝 떨어집니다. 두꺼운 외투를 챙기세요.",
        badge: "추운 날씨"
      },
      cool: {
        title: "선선하고 기분 좋은 바람이 부는 날씨입니다!",
        subtitle: "기분 좋은 햇살과 함께 아침저녁으로 상쾌한 공기를 느낄 수 있습니다.",
        badge: "선선함"
      },
      pleasant: {
        title: "오늘 날씨가 매우 쾌적하고 화창합니다!",
        subtitle: "외출, 산책, 야외 활동을 하기에 더할 나위 없이 좋은 날입니다.",
        badge: "쾌적한 하루"
      },
      normal: {
        title: "하루 종일 평온하고 무난한 날씨입니다!",
        subtitle: "비 걱정 없이 일상 활동을 편안하게 하실 수 있습니다.",
        badge: "무난한 날씨"
      }
    },
    deciders: {
      umbrella: { title: "우산 필요할까요?", yes: "네, 꼭 챙기세요!", maybe: "가벼운 빗방울 가능성", no: "아니요, 필요 없어요", clearSky: "맑은 하늘", rainChanceSuffix: "강수 확률" },
      clothes: { title: "추천 옷차림", warm: "따뜻한 재킷이나 스웨터", light: "시원한 반팔과 면 옷", casual: "편안한 일상복" },
      outside: { title: "외출하기 좋은가요?", great: "외출하기 아주 좋은 날", avoidSun: "한낮 직사광선 주의", checkRain: "외출 전 하늘 확인", wearMask: "마스크 착용 권장", highUv: "자외선 강함", fairAir: "공기 보통" },
      air: { title: "공기 질", clean: "맑고 깨끗한 공기", moderate: "보통 수준", polluted: "공기가 탁함", safeBreathe: "숨쉬기 쾌적함", takePrecautions: "주의 필요" }
    },
    timing: {
      dayLabel: "낮 시간:",
      nightLabel: "저녁 / 밤:",
      engineNote: "Indra Engine 분석"
    }
  },

  tr: {
    headerTitle: "Günün Kolay Hava Durumu Özeti",
    headerSubtitle: "Karışık terimler olmadan, herkesin hemen anlayacağı günlük dilde",
    verdicts: {
      rain: {
        title: "Bugün yağmur bekleniyor — şemsiyenizi yanınıza alın!",
        subtitle: "Gün içinde yağış geçişleri olabilir. Dışarı çıkarken hazırlıklı olun.",
        badge: "Şemsiye Al"
      },
      hot: {
        title: "Sıcak ve güneşli bir gün — bol su için!",
        subtitle: "Öğle saatlerinde güneş yakıcı olacak. İnce pamuklu kıyafetler tercih edin.",
        badge: "Sıcak & Güneşli"
      },
      cold: {
        title: "Bugün hava soğuk — sıkı giyinin!",
        subtitle: "Sabah ve akşam saatlerinde hava oldukça soğuyacak. Kalın mont giyin.",
        badge: "Soğuk Hava"
      },
      cool: {
        title: "Hafif serin ve ferahlatıcı güzel bir hava!",
        subtitle: "Ilık güneş ve sabah-akşam tatlı bir serinlik olacak.",
        badge: "Serin & Tatlı"
      },
      pleasant: {
        title: "Bugün hava son derece keyifli ve güzel!",
        subtitle: "Dışarıda vakit geçirmek veya işlerinizi halletmek için mükemmel bir gün.",
        badge: "Harika Gün"
      },
      normal: {
        title: "Gün boyu sakin ve dengeli bir hava!",
        subtitle: "Yağmur riski yok, normal ve rahat bir gün geçecek.",
        badge: "Sakin Hava"
      }
    },
    deciders: {
      umbrella: { title: "Şemsiye gerekli mi?", yes: "Evet, mutlaka alın!", maybe: "Hafif çiseleme olabilir", no: "Hayır, gerek yok", clearSky: "Gökyüzü açık", rainChanceSuffix: "yağış ihtimali" },
      clothes: { title: "Ne giymeli?", warm: "Kalın mont veya kazak", light: "Hafif pamuklu giysiler", casual: "Rahat günlük kıyafet" },
      outside: { title: "Dışarı çıkmak?", great: "Dışarı çıkmak için harika", avoidSun: "Öğle güneşinden korunun", checkRain: "Hava durumuna bakın", wearMask: "Maske takın", highUv: "Yüksek UV ışını", fairAir: "Hava normal" },
      air: { title: "Hava Kalitesi", clean: "Temiz ve taze hava", moderate: "Orta düzey kalite", polluted: "Hava kirli", safeBreathe: "Nefes almak güvenli", takePrecautions: "Önlem alın" }
    },
    timing: {
      dayLabel: "Öğlen:",
      nightLabel: "Akşam / Gece:",
      engineNote: "Indra Engine tarafından analiz edildi"
    }
  }
};

/**
 * Universal fallback resolver that guarantees every world language receives a meaningful summary.
 */
export function getSummaryLocale(langCode: string): SimpleSummaryLocale {
  const code = (langCode || 'en').toLowerCase().trim();
  
  if (SUMMARY_LOCALES[code]) {
    return SUMMARY_LOCALES[code];
  }

  // Check 2-letter prefix if given full locale like 'en-US' or 'hi-IN'
  const prefix = code.split('-')[0];
  if (SUMMARY_LOCALES[prefix]) {
    return SUMMARY_LOCALES[prefix];
  }

  // Fallback to English
  return SUMMARY_LOCALES['en'];
}
