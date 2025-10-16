export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", 
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", 
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", 
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

export const stateCityMapping: Record<string, string[]> = {
  "Lagos": ["Ikeja", "Lagos Island", "Surulere", "Yaba", "Ikorodu", "Epe", "Badagry", "Apapa", "Victoria Island", "Lekki"],
  "FCT": ["Abuja", "Gwagwalada", "Kuje", "Bwari", "Kwali", "Abaji"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Eleme", "Okrika", "Bonny", "Degema"],
  "Kano": ["Kano Municipal", "Fagge", "Dala", "Gwale", "Tarauni", "Nassarawa"],
  "Oyo": ["Ibadan", "Ogbomosho", "Oyo", "Iseyin", "Saki", "Igbo-Ora"],
  "Kaduna": ["Kaduna", "Zaria", "Kafanchan", "Kagoro", "Zonkwa"],
  "Edo": ["Benin City", "Auchi", "Ekpoma", "Uromi", "Ubiaja"],
  "Cross River": ["Calabar", "Ikom", "Ugep", "Obudu", "Ogoja"],
  "Delta": ["Warri", "Asaba", "Sapele", "Ughelli", "Agbor"],
  "Enugu": ["Enugu", "Nsukka", "Oji River", "Agbani", "Awgu"],
  "Abia": ["Umuahia", "Aba", "Arochukwu", "Ohafia", "Bende"],
  "Anambra": ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Ihiala"],
  "Imo": ["Owerri", "Orlu", "Okigwe", "Oguta", "Mbaise"],
  "Akwa Ibom": ["Uyo", "Ikot Ekpene", "Eket", "Oron", "Abak"],
  "Bayelsa": ["Yenagoa", "Brass", "Ogbia", "Sagbama", "Nembe"],
  "Benue": ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Vandeikya"],
  "Borno": ["Maiduguri", "Bama", "Biu", "Damboa", "Dikwa"],
  "Ebonyi": ["Abakaliki", "Afikpo", "Onueke", "Ezza", "Ishielu"],
  "Ekiti": ["Ado-Ekiti", "Ikere", "Ijero", "Emure", "Ise"],
  "Gombe": ["Gombe", "Kumo", "Deba", "Nafada", "Billiri"],
  "Jigawa": ["Dutse", "Hadejia", "Gumel", "Birnin Kudu", "Kazaure"],
  "Kebbi": ["Birnin Kebbi", "Argungu", "Jega", "Yauri", "Zuru"],
  "Kogi": ["Lokoja", "Okene", "Kabba", "Idah", "Ankpa"],
  "Kwara": ["Ilorin", "Offa", "Jebba", "Lafiagi", "Pategi"],
  "Nasarawa": ["Lafia", "Keffi", "Akwanga", "Nasarawa", "Doma"],
  "Niger": ["Minna", "Bida", "Kontagora", "Suleja", "Lapai"],
  "Ogun": ["Abeokuta", "Ijebu-Ode", "Sagamu", "Ilaro", "Ota"],
  "Ondo": ["Akure", "Ondo", "Owo", "Ikare", "Ore"],
  "Osun": ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Iwo"],
  "Plateau": ["Jos", "Bukuru", "Pankshin", "Shendam", "Langtang"],
  "Sokoto": ["Sokoto", "Gwadabawa", "Bodinga", "Wurno", "Tambuwal"],
  "Taraba": ["Jalingo", "Wukari", "Bali", "Gembu", "Ibi"],
  "Yobe": ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam"],
  "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka", "Bungudu"],
  "Adamawa": ["Yola", "Jimeta", "Mubi", "Numan", "Ganye"],
};

export const getCitiesByState = (state: string): string[] => {
  return stateCityMapping[state] || [];
};

// Get all cities from all states (for general dropdowns)
export const nigerianCities = Object.values(stateCityMapping).flat().sort();

export const validateCity = (city: string): boolean => {
  return city.length > 0;
};