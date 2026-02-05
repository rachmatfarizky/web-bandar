// Village information and content for Desa Bandar

type LandslidePoint = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  lat: number;
  lng: number;
};
export const villageContent = {
  name: "Desa Bandar",
  district: "Kecamatan Bandar",
  regency: "Kabupaten Pacitan",
  province: "Jawa Timur",
  locationDescription:
    "Desa Bandar berada di Kecamatan Bandar, Kabupaten Pacitan, Jawa Timur. Akses menuju pusat kecamatan sekitar 7 km, dan sekitar 45 km ke pusat Kabupaten Pacitan. Berbatasan langsung dengan Kabupaten Wonogiri di sisi utara.",
  hamlets: ["Krajan", "Salam", "Saren", "Panjing", "Kaliwungu", "Tratas", "Ngagik"],


  // Village leadership
  leadership: {
    headName: "Mawan Nuriyanto, S.T.",
    headMessage:
      "Dengan bangga saya sampaikan bahwa Desa Bandar terus berinovasi untuk memberikan pelayanan terbaik kepada seluruh masyarakat. Komitmen kami adalah transparansi, akuntabilitas, dan kolaborasi dalam setiap keputusan untuk kemajuan bersama.",
  },
};

export const desaBandarMap = {
  center: [-7.9910499, 111.2666172] as [number, number], // Koordinat Desa Bandar, Bandar, Pacitan
  zoom: 10,
};

// POI (fasilitas / wisata / dll)
export const pointsOfInterest = [
  {
    id: 1,
    name: "Balai Desa Bandar",
    category: "Pemerintahan",
    lat: -7.995060918160807,
    lng: 111.26452944278013,
    address: "Jl. Raya Bandar, Dusun Krajan",
  },
  {
    id: 2,
    name: "Rumah Kepala Desa",
    category: "Pemerintahan",
    lat: -7.99815528158193,
    lng: 111.26514351069571,
    address: "Jl. Raya Bandar, Dusun Krajan",
  },
  {
    id: 3,
    name: "BPD Desa Bandar",
    category: "Pemerintahan",
    lat: -7.995062064179778,
    lng: 111.26449007856012,
    address: "Jl. Raya Bandar, Dusun Krajan",
  },
  {
    id: 38,
    name: "GOR Desa Bandar",
    category: "Pemerintahan",
    lat: -7.99579626996383,
    lng: 111.26391973415853,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 39,
    name: "Bank BRI Unit Desa Bandar",
    category: "Pemerintahan",
    lat: -7.995344438659044,
    lng: 111.26416030871749,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 40,
    name: "UPT TK dan SD Kecamatan Bandar",
    category: "Pemerintahan",
    lat: -7.996767113333315,
    lng: 111.26431456448833,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 41,
    name: "Koramil Bandar",
    category: "Pemerintahan",
    lat: -7.995068792571784,
    lng: 111.26381534359525,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 42,
    name: "KUA Kecamatan Bandar",
    category: "Pemerintahan",
    lat: -7.994833991508614,
    lng: 111.26376221363994,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 43,
    name: "Kantor Kecamatan Bandar",
    category: "Pemerintahan",
    lat: -7.994710074123308,
    lng: 111.26412542134875,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 51,
    name: "Rumah Kasun Krajan",
    category: "Pemerintahan",
    lat: -7.992400901694416,
    lng: 111.26464039787538,
    address: "Jl. Raya Bandar, Dusun Krajan",
  },
  {
    id: 52,
    name: "Rumah Kasun Panjing",
    category: "Pemerintahan",
    lat: -7.991156869363831,
    lng: 111.25717972924761,
    address: "Jl. Bandar-Nawangan, Dusun Panjing",
  },
  {
    id: 53,
    name: "Rumah Kasun Ngagik",
    category: "Pemerintahan",
    lat: -7.9900538510768575,
    lng: 111.27653610187694,
    address: "Dusun Ngagik",
  },
  {
    id: 54,
    name: "Rumah Kasun Kaliwungu",
    category: "Pemerintahan",
    lat: -7.977719026130512,
    lng: 111.24387747987402,
    address: "Dusun Kaliwungu",
  },
  {
    id: 55,
    name: "Rumah Kasun Tratas",
    category: "Pemerintahan",
    lat: -7.977615097620506,
    lng: 111.26199498315584,
    address: "Dusun Tratas",
  },
  {
    id: 56,
    name: "Rumah Kasun Salam",
    category: "Pemerintahan",
    lat: -8.009001309060164,
    lng: 111.27533142925266,
    address: "Dusun Salam",
  },
  {
    id: 57,
    name: "Rumah Kasun Saren",
    category: "Pemerintahan",
    lat: -8.007946565222253,
    lng: 111.25886041875012,
    address: "Dusun Saren",
  },

  // PENDIDIKAN (Education)
  {
    id: 4,
    name: "SD Negeri 1 Desa Bandar",
    category: "Pendidikan",
    lat: -7.998898714831782,
    lng: 111.2650483802692,
    address: "SD Negeri 1 Bandar, Dusun Krajan",

  },
  {
    id: 5,
    name: "SMK Negeri Bandar",
    category: "Pendidikan",
    lat: -7.997424486904818, 
    lng: 111.26367710268308,
    address: "SMK Negeri Bandar, Dusun Krajan",

  },
  {
    id: 6,
    name: "MTs Muhammadiyah Bandar",
    category: "Pendidikan",
    lat: -7.995038622399696,
    lng: 111.2634980837758,
    address: "MTs Muhammadiyah Bandar, Dusun Krajan",

  },
  {
    id: 7,
    name: "SMP Negeri 1 Bandar",
    category: "Pendidikan",
    lat: -7.991399422006073,
    lng: 111.268052708383,
    address: "SMP Negeri 1 Bandar, Dusun Krajan",

  },
  {
    id: 8,
    name: "KB Ceria Bandar",
    category: "Pendidikan",
    lat: -7.9947152026993615,
    lng: 111.2643512213062,
    address: "KB Ceria Bandar, Dusun Krajan",

  },
  {
    id: 9,
    name: "MA Ma'arif Bandar",
    category: "Pendidikan",
    lat: -8.007344529410421,
    lng: 111.26329930022473,
    address: "MA Ma'arif Bandar, Dusun Saren",

  },
  {
    id: 10,
    name: "SD Negeri Bandar 5",
    category: "Pendidikan",
    lat: -7.993839291000704,
    lng: 111.25777471380665,
    address: "SD Negeri Bandar 5, Dusun Panjing",

  },
  {
    id: 11,
    name: "TK Mekar Sari",
    category: "Pendidikan",
    lat: -7.993910479971559,
    lng: 111.25769590806593,
    address: "TK Mekar Sari, Dusun Panjing",

  },
  {
    id: 12,
    name: "TK Bhakti Pertiwi",
    category: "Pendidikan",
    lat: -7.998984070289043, 
    lng: 111.26515337712219,
    address: "TK Bhakti Pertiwi, Dusun Krajan",

  },
  {
    id: 13,
    name: "SD Negeri Bandar 2",
    category: "Pendidikan",
    lat: -7.990079781398874,
    lng: 111.2747471995336,
    address: "SD Negeri Bandar 2, Dusun Ngagik",

  },
  {
    id: 14,
    name: "TK Tunas Nusa Harapan",
    category: "Pendidikan",
    lat: -7.990583754704095,
    lng: 111.27477913075619,
    address: "TK Tunas Nusa Harapan, Dusun Ngagik",

  },
  {
    id: 15,
    name: "KB Dusun Ngagik",
    category: "Pendidikan",
    lat: -7.9907951708213005,
    lng: 111.27461421291301,
    address: "PAUD Dusun Ngagik, Dusun Ngagik",

  },
  {
    id: 16,
    name: "SD Negeri Bandar 3",
    category: "Pendidikan",
    lat: -7.980347570516949,
    lng: 111.25121966694033,
    address: "SD Negeri Bandar 3, Dusun Kaliwungu",

  },
  {
    id: 17,
    name: "KB Pelita Bangsa",
    category: "Pendidikan",
    lat: -7.980469252664821,
    lng: 111.25094833823033,
    address: "KB Pelita Bangsa, Dusun Kaliwungu",

  },
  {
    id: 18,
    name: "Perpustakaan Desa Maju Lancar Bandar",
    category: "Pendidikan",
    lat: -7.994943987470477,
    lng: 111.26424611818365,
    address: "Perpustakaan Desa Maju Lancar Bandar, Dusun Krajan",

  },
  {
    id: 19,
    name: "MA Muhammadiyah Bandar",
    category: "Pendidikan",
    lat: -7.99412189068375,
    lng: 111.26313849210565,
    address: "MA Muhammadiyah Bandar, Dusun Krajan",

  },
  {
    id: 20,
    name: "KB Multi Guna",
    category: "Pendidikan",
    lat: -7.997439439420451,
    lng: 111.25438994613326,
    address: "KB Multi Guna, Dusun Panjing",

  },
  {
    id: 60,
    name: "Pondok Pesantren Al-Ishlah",
    category: "Pendidikan",
    lat: -8.007812934886257,
    lng: 111.26345000998701,
    address: "Pondok Pesantren Al-Ishlah, Dusun Saren",
  },
  {
    id: 61,
    name: "MI Program Khusus Al-Ishlah",
    category: "Pendidikan",
    lat: -8.005466887584356,
    lng: 111.26394344844618,
    address: "MI Program Khusus Al-Ishlah, Dusun Saren",
  },

  // KESEHATAN (Health)
  {
    id: 21,
    name: "Puskesmas Desa Bandar",
    category: "Kesehatan",
    lat: -7.998734222861661,
    lng: 111.26510626552182,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 22,
    name: "Apotek Bandar Farma",
    category: "Kesehatan",
    lat: -7.994427502199187,
    lng: 111.26411424276448,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 46,
    name: "Praktek Dokter Umum dr. Nova",
    category: "Kesehatan",
    lat: -7.994112186542199,
    lng: 111.26399946086319,
    address: "Jl. Raya Bandar, Dusun Krajan",

  },
  {
    id: 47,
    name: "Petshop Bandar",
    category: "Kesehatan",
    lat: -7.994009925009072,
    lng: 111.26280856007048 ,
    address: "Jl. Bandar-Nawangan, Dusun Krajan",

  },

  // TEMPAT IBADAH (Places of Worship)
  {
    id: 23,
    name: "Masjid Besar Baitussalam",
    category: "Ibadah",
    lat: -7.994890844674228,
    lng: 111.26358533937902,
    address: "Masjid Besar Baitussalam, Dusun Krajan",

  },
  {
    id: 24,
    name: "Musholla Al-Hikmah",
    category: "Ibadah",
    lat: -7.992450162723451,
    lng: 111.26423501546317,
    address: "Musholla Al-Hikmah, Dusun Krajan",

  },
  {
    id: 25,
    name: "Musholla Darul Muttaqin",
    category: "Ibadah",
    lat: -7.997509351079207,
    lng: 111.2543589995322,
    address: "Musholla Darul Muttaqin, Dusun Panjing",

  },
  {
    id: 26,
    name: "Masjid Baitul Arqom",
    category: "Ibadah",
    lat: -7.994284152452999,
    lng: 111.25803686753147,
    address: "Masjid Baitul Arqom, Dusun Panjing",

  },
  {
    id: 27,
    name: "Masjid Muhammad Al-Hallabi",
    category: "Ibadah",
    lat: -7.979531495457496,
    lng: 111.25770809384389,
    address: "Masjid Muhammad Al-Hallabi, Dusun Kaliwungu",

  },
  {
    id: 28,
    name: "Masjid Binaulumah",
    category: "Ibadah",
    lat: -7.990348384741666,
    lng: 111.27583224701286,
    address: "Masjid Binaulumah, Dusun Ngagik",

  },
  {
    id: 29,
    name: "Masjid Darul Iqhsan",
    category: "Ibadah",
    lat: -7.990274008146189,
    lng: 111.27801288659482,
    address: "Masjid Darul Iqhsan, Dusun Ngagik",

  },
  {
    id: 30,
    name: "Masjid At-Tawwabu",
    category: "Ibadah",
    lat: -7.989030136203597,
    lng: 111.26386287026592,
    address: "Masjid At-Tawwabu, Dusun Krajan",

  },
  {
    id: 31,
    name: "Masjid Al-Hasan",
    category: "Ibadah",
    lat: -7.982031842171229, 
    lng: 111.26939587186972,
    address: "Masjid Al-Hasan, Dusun Tratas",

  },
  {
    id: 32,
    name: "Masjid Al-Muttaqien",
    category: "Ibadah",
    lat: -8.011100015931223,
    lng: 111.27408803268379,
    address: "Masjid Al-Muttaqien, Dusun Salam",
  },
  {
    id: 33,
    name: "Masjid Darul Huda",
    category: "Ibadah",
    lat: -8.00910855583496,
    lng: 111.27534393175203,
    address: "Masjid Darul Huda, Dusun Salam",

  },
  {
    id: 58,
    name: "Masjid Sumber",
    category: "Ibadah",
    lat: -8.007207486860251,
    lng: 111.26130529153525,
    address: "Masjid Sumber, Dusun Saren",
  },
  {
    id: 59,
    name: "Mushola Al-Falaq",
    category: "Ibadah",
    lat: -8.009134487000642,
    lng: 111.26042846097108,
    address: "Mushola Al-Falaq, Dusun Saren",
  },
  {
    id: 62,
    name: "Masjid Al-Falah",
    category: "Ibadah",
    lat: -8.00312117998908,
    lng: 111.2652182525277,
    address: "Masjid Al-Falah, Dusun Saren",
  },
  {
    id: 63,
    name: "Masjid Al-Huda",
    category: "Ibadah",
    lat: -7.9989005661369195,
    lng: 111.26155941391563,
    address: "Masjid Al-Huda, Dusun Krajan",
  },

  // UMKM & PERDAGANGAN
  {
    id: 34,
    name: "Pasar Ngudirejo",
    category: "UMKM",
    lat: -7.991571937115689,
    lng: 111.26439476439893,
    address: "Pasar Ngudirejo, Dusun Krajan",

  },
  {
    id: 35,
    name: "Pasar Rakyat Bandar",
    category: "UMKM",
    lat: -7.991675699359436,
    lng: 111.26489448499719,
    address: "Pasar Rakyat Bandar, Dusun Krajan",

  },
  {
    id: 36,
    name: "Pasar Hewan Bandar",
    category: "UMKM",
    lat: -7.991513164820268,
    lng: 111.26561205527473,
    address: "Pasar Hewan Bandar, Dusun Krajan",

  },
  {
    id: 37,
    name: "Cafe Malioboro",
    category: "UMKM",
    lat: -7.994404235306685,
    lng: 111.26389360492041,
    address: "Cafe Malioboro, Dusun Krajan",

  },
  {
    id: 44,
    name: "Gandrung Pangan",
    category: "UMKM",
    lat: -7.991325824995831,
    lng: 111.26431799767715,
    address: "Gandrung Pangan, Dusun Krajan",

  },
  {
    id: 45,
    name: "SSC Chicken Steak Bandar",
    category: "UMKM",
    lat: -7.997255269476665,
    lng: 111.26468466888583,
    address: "SSC Chicken Steak Bandar, Dusun Krajan",

  },

  // WISATA (Tourism)
  {
    id: 48,
    name: "Tlaga Mambeg",
    category: "Wisata",
    lat: -7.991387311688042,
    lng: 111.27500313671788,
    address: "Tlaga Mambeg, Dusun Ngagik",

  },
  {
    id: 50,
    name: "Tapak Wali",
    category: "Wisata",
    lat: -7.988901291623457,
    lng: 111.27687696687191,
    address: "Tapak Wali, Dusun Ngagik",

  },

  // HUTAN & AREA HIJAU (Forest & Green Areas)
  {
    id: 49,
    name: "Taman Keanekaragaman Hayati Lereng Gunung Gembes",
    category: "Wisata",
    lat: -7.975697241398372,
    lng: 111.25559923092081,
    address: "Taman Keanekaragaman Hayati Lereng Gunung Gembes, Dusun Kaliwungu",

  },
];
