// Maintained Indian Administrative Dataset: States, Districts & Talukas/Cities with Centroid Coordinates

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const INDIAN_LOCATIONS_DATA = {
  "Maharashtra": {
    lat: 19.7515,
    lon: 75.7139,
    districts: {
      "Pune": {
        lat: 18.5204,
        lon: 73.8567,
        talukas: [
          { name: "Baramati", lat: 18.1512, lon: 74.5771 },
          { name: "Daund", lat: 18.4643, lon: 74.5828 },
          { name: "Indapur", lat: 18.1147, lon: 75.0315 },
          { name: "Haveli", lat: 18.5204, lon: 73.8567 },
          { name: "Shirur", lat: 18.8261, lon: 74.3768 },
          { name: "Junnar", lat: 19.2081, lon: 73.8736 },
          { name: "Ambegaon", lat: 19.0345, lon: 73.9167 },
          { name: "Khed (Rajgurunagar)", lat: 18.8471, lon: 73.9054 },
          { name: "Maval", lat: 18.7533, lon: 73.5414 },
          { name: "Mulshi", lat: 18.5029, lon: 73.5134 },
          { name: "Velhe", lat: 18.2933, lon: 73.6339 },
          { name: "Bhor", lat: 18.1425, lon: 73.8447 },
          { name: "Purandar (Saswad)", lat: 18.2831, lon: 73.9744 }
        ]
      },
      "Satara": {
        lat: 17.6805,
        lon: 73.9984,
        talukas: [
          { name: "Satara", lat: 17.6805, lon: 73.9984 },
          { name: "Karad", lat: 17.2894, lon: 74.1818 },
          { name: "Wai", lat: 17.9497, lon: 73.8906 },
          { name: "Phaltan", lat: 17.9868, lon: 74.4334 },
          { name: "Koregaon", lat: 17.7024, lon: 74.1758 },
          { name: "Khandala", lat: 18.0435, lon: 74.0278 }
        ]
      },
      "Solapur": {
        lat: 17.6599,
        lon: 75.9064,
        talukas: [
          { name: "Solapur North", lat: 17.6599, lon: 75.9064 },
          { name: "Pandharpur", lat: 17.6778, lon: 75.3262 },
          { name: "Barshi", lat: 18.2335, lon: 75.6941 },
          { name: "Malshiras", lat: 17.8483, lon: 74.9126 },
          { name: "Karmala", lat: 18.4117, lon: 75.1972 },
          { name: "Sangole", lat: 17.4384, lon: 75.1947 }
        ]
      },
      "Ahmednagar": {
        lat: 19.0948,
        lon: 74.7480,
        talukas: [
          { name: "Nagar", lat: 19.0948, lon: 74.7480 },
          { name: "Sangamner", lat: 19.5765, lon: 74.2094 },
          { name: "Shrirampur", lat: 19.6200, lon: 74.6548 },
          { name: "Rahata (Shirdi)", lat: 19.7667, lon: 74.4764 },
          { name: "Kopargaon", lat: 19.8887, lon: 74.4795 },
          { name: "Nevasa", lat: 19.5512, lon: 74.9174 }
        ]
      },
      "Kolhapur": {
        lat: 16.7050,
        lon: 74.2433,
        talukas: [
          { name: "Karvir", lat: 16.7050, lon: 74.2433 },
          { name: "Hatkanangle", lat: 16.7461, lon: 74.4447 },
          { name: "Shirol", lat: 16.7417, lon: 74.6044 },
          { name: "Radhanagari", lat: 16.4167, lon: 74.0000 },
          { name: "Kagal", lat: 16.5772, lon: 74.3167 }
        ]
      },
      "Sangli": {
        lat: 16.8524,
        lon: 74.5815,
        talukas: [
          { name: "Miraj", lat: 16.8286, lon: 74.6433 },
          { name: "Walwa (Islampur)", lat: 17.0500, lon: 74.2667 },
          { name: "Tasgaon", lat: 17.0347, lon: 74.6033 },
          { name: "Shirala", lat: 16.9833, lon: 74.1333 }
        ]
      },
      "Nashik": {
        lat: 19.9975,
        lon: 73.7898,
        talukas: [
          { name: "Nashik", lat: 19.9975, lon: 73.7898 },
          { name: "Niphad", lat: 20.0833, lon: 74.1000 },
          { name: "Sinnar", lat: 19.8497, lon: 74.0042 },
          { name: "Malegaon", lat: 20.5539, lon: 74.5283 },
          { name: "Dindori", lat: 20.2000, lon: 73.8333 }
        ]
      },
      "Chhatrapati Sambhajinagar (Aurangabad)": {
        lat: 19.8762,
        lon: 75.3433,
        talukas: [
          { name: "Aurangabad", lat: 19.8762, lon: 75.3433 },
          { name: "Paithan", lat: 19.4833, lon: 75.3833 },
          { name: "Gangapur", lat: 19.7000, lon: 75.0167 },
          { name: "Vaijapur", lat: 19.9333, lon: 74.7333 }
        ]
      },
      "Nagpur": {
        lat: 21.1458,
        lon: 79.0882,
        talukas: [
          { name: "Nagpur Urban", lat: 21.1458, lon: 79.0882 },
          { name: "Nagpur Rural", lat: 21.1200, lon: 79.0500 },
          { name: "Kamthi", lat: 21.2333, lon: 79.2000 },
          { name: "Katol", lat: 21.2667, lon: 78.5833 },
          { name: "Umred", lat: 20.8500, lon: 79.3333 }
        ]
      },
      "Jalgaon": {
        lat: 21.0077,
        lon: 75.5626,
        talukas: [
          { name: "Jalgaon", lat: 21.0077, lon: 75.5626 },
          { name: "Bhusawal", lat: 21.0458, lon: 75.7892 },
          { name: "Chalisgaon", lat: 20.4667, lon: 75.0167 },
          { name: "Pachora", lat: 20.6667, lon: 75.3500 }
        ]
      },
      "Latur": {
        lat: 18.4088,
        lon: 76.5604,
        talukas: [
          { name: "Latur", lat: 18.4088, lon: 76.5604 },
          { name: "Ausa", lat: 18.2500, lon: 76.5000 },
          { name: "Nilanga", lat: 18.1167, lon: 76.7500 },
          { name: "Udgir", lat: 18.3944, lon: 77.1194 }
        ]
      },
      "Nanded": {
        lat: 19.1383,
        lon: 77.3210,
        talukas: [
          { name: "Nanded", lat: 19.1383, lon: 77.3210 },
          { name: "Loha", lat: 18.9500, lon: 77.1167 },
          { name: "Deglur", lat: 18.5500, lon: 77.5833 }
        ]
      },
      "Amravati": {
        lat: 20.9374,
        lon: 77.7796,
        talukas: [
          { name: "Amravati", lat: 20.9374, lon: 77.7796 },
          { name: "Achalpur", lat: 21.2581, lon: 77.5103 },
          { name: "Morshi", lat: 21.3167, lon: 78.0167 }
        ]
      },
      "Thane": {
        lat: 19.2183,
        lon: 72.9781,
        talukas: [
          { name: "Thane", lat: 19.2183, lon: 72.9781 },
          { name: "Kalyan", lat: 19.2437, lon: 73.1355 },
          { name: "Bhiwandi", lat: 19.2813, lon: 73.0483 },
          { name: "Murbad", lat: 19.2500, lon: 73.4000 },
          { name: "Shahapur", lat: 19.4500, lon: 73.3333 }
        ]
      },
      "Raigad": {
        lat: 18.5158,
        lon: 73.1822,
        talukas: [
          { name: "Alibag", lat: 18.6414, lon: 72.8722 },
          { name: "Panvel", lat: 18.9894, lon: 73.1175 },
          { name: "Pen", lat: 18.7333, lon: 73.0833 },
          { name: "Mahad", lat: 18.0833, lon: 73.4167 }
        ]
      }
    }
  },
  "Gujarat": {
    lat: 22.2587,
    lon: 71.1924,
    districts: {
      "Ahmedabad": {
        lat: 23.0225,
        lon: 72.5714,
        talukas: [
          { name: "Daskroi", lat: 23.0225, lon: 72.5714 },
          { name: "Sanand", lat: 22.9833, lon: 72.3833 },
          { name: "Dholka", lat: 22.7167, lon: 72.4667 },
          { name: "Viramgam", lat: 23.1167, lon: 72.0333 }
        ]
      },
      "Anand": {
        lat: 22.5645,
        lon: 72.9289,
        talukas: [
          { name: "Anand", lat: 22.5645, lon: 72.9289 },
          { name: "Petlad", lat: 22.4833, lon: 72.8000 },
          { name: "Khambhat", lat: 22.3167, lon: 72.6167 }
        ]
      },
      "Surat": {
        lat: 21.1702,
        lon: 72.8311,
        talukas: [
          { name: "Choryasi", lat: 21.1702, lon: 72.8311 },
          { name: "Bardoli", lat: 21.1167, lon: 73.1167 },
          { name: "Olpad", lat: 21.3333, lon: 72.7500 }
        ]
      },
      "Vadodara": {
        lat: 22.3072,
        lon: 73.1812,
        talukas: [
          { name: "Vadodara", lat: 22.3072, lon: 73.1812 },
          { name: "Padra", lat: 22.2333, lon: 73.0833 },
          { name: "Karjan", lat: 22.0500, lon: 73.1167 }
        ]
      }
    }
  },
  "Karnataka": {
    lat: 15.3173,
    lon: 75.7139,
    districts: {
      "Bengaluru Rural": {
        lat: 13.2847,
        lon: 77.5671,
        talukas: [
          { name: "Devanahalli", lat: 13.2483, lon: 77.7126 },
          { name: "Doddaballapura", lat: 13.2928, lon: 77.5431 },
          { name: "Hosakote", lat: 13.0697, lon: 77.7981 }
        ]
      },
      "Belagavi": {
        lat: 15.8497,
        lon: 74.4977,
        talukas: [
          { name: "Belagavi", lat: 15.8497, lon: 74.4977 },
          { name: "Chikkodi", lat: 16.4333, lon: 74.6000 },
          { name: "Gokak", lat: 16.1667, lon: 74.8333 }
        ]
      },
      "Mysuru": {
        lat: 12.2958,
        lon: 76.6394,
        talukas: [
          { name: "Mysuru", lat: 12.2958, lon: 76.6394 },
          { name: "Nanjangud", lat: 12.1167, lon: 76.6833 },
          { name: "Hunsur", lat: 12.3167, lon: 76.2833 }
        ]
      }
    }
  },
  "Madhya Pradesh": {
    lat: 22.9734,
    lon: 78.6569,
    districts: {
      "Bhopal": {
        lat: 23.2599,
        lon: 77.4126,
        talukas: [
          { name: "Huzur", lat: 23.2599, lon: 77.4126 },
          { name: "Berasia", lat: 23.6333, lon: 77.4333 }
        ]
      },
      "Indore": {
        lat: 22.7196,
        lon: 75.8577,
        talukas: [
          { name: "Indore", lat: 22.7196, lon: 75.8577 },
          { name: "Mhow", lat: 22.5500, lon: 75.7667 },
          { name: "Sanwer", lat: 22.9833, lon: 75.8333 }
        ]
      },
      "Ujjain": {
        lat: 23.1765,
        lon: 75.7885,
        talukas: [
          { name: "Ujjain", lat: 23.1765, lon: 75.7885 },
          { name: "Nagda", lat: 23.4500, lon: 75.4167 },
          { name: "Mahidpur", lat: 23.4833, lon: 75.6500 }
        ]
      }
    }
  },
  "Uttar Pradesh": {
    lat: 26.8467,
    lon: 80.9462,
    districts: {
      "Lucknow": {
        lat: 26.8467,
        lon: 80.9462,
        talukas: [
          { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
          { name: "Bakshi Ka Talab", lat: 27.0167, lon: 80.9333 },
          { name: "Malihabad", lat: 26.9167, lon: 80.7167 }
        ]
      },
      "Varanasi": {
        lat: 25.3176,
        lon: 82.9739,
        talukas: [
          { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
          { name: "Pindra", lat: 25.5000, lon: 82.8500 }
        ]
      },
      "Kanpur Nagar": {
        lat: 26.4499,
        lon: 80.3319,
        talukas: [
          { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
          { name: "Ghatampur", lat: 26.1500, lon: 80.1667 },
          { name: "Bilhaur", lat: 26.8500, lon: 80.0500 }
        ]
      }
    }
  },
  "Rajasthan": {
    lat: 27.0238,
    lon: 74.2179,
    districts: {
      "Jaipur": {
        lat: 26.9124,
        lon: 75.7873,
        talukas: [
          { name: "Jaipur", lat: 26.9124, lon: 75.7873 },
          { name: "Chomu", lat: 27.1667, lon: 75.7167 },
          { name: "Amber", lat: 26.9855, lon: 75.8507 },
          { name: "Sanganer", lat: 26.8000, lon: 75.7667 }
        ]
      },
      "Jodhpur": {
        lat: 26.2389,
        lon: 73.0243,
        talukas: [
          { name: "Jodhpur", lat: 26.2389, lon: 73.0243 },
          { name: "Bilara", lat: 26.1833, lon: 73.7167 },
          { name: "Osian", lat: 26.7167, lon: 72.9000 }
        ]
      }
    }
  }
};

// Real Indian Banks Catalogue for Loan Advisor
export const INDIAN_BANKS_LIST = [
  "State Bank of India (SBI)",
  "Bank of Baroda",
  "Bank of Maharashtra",
  "Canara Bank",
  "Punjab National Bank (PNB)",
  "Union Bank of India",
  "Indian Bank",
  "Central Bank of India",
  "Indian Overseas Bank",
  "UCO Bank",
  "Bank of India",
  "Punjab & Sind Bank",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Federal Bank",
  "IDBI Bank",
  "Maharashtra Gramin Bank (RRB)",
  "Vidharbha Konkan Gramin Bank (RRB)",
  "Baroda Gujarat Gramin Bank",
  "Karnataka Gramin Bank",
  "Aryavart Bank (UP RRB)",
  "District Central Cooperative Bank (DCCB)",
  "Other Bank / Gramin Cooperative"
];
