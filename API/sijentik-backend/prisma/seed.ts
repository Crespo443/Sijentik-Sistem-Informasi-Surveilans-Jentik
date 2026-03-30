import { PrismaClient } from '@prisma/client';

type VillageType = 'DESA' | 'KELURAHAN';

const prisma = new PrismaClient();

// Puskesmas data from Puskemas.md — 27 PKMs across 21 Kecamatan
// Each entry maps a Puskesmas to its correct Kecamatan
const puskesmasData = [
  // Alok: 2 PKMs
  { name: 'PKM Kopeta',     kecamatan: 'Alok' },
  { name: 'PKM Teluk',      kecamatan: 'Alok' },
  // Alok Barat: 1 PKM
  { name: 'PKM Wolomarang', kecamatan: 'Alok Barat' },
  // Alok Timur: 2 PKMs
  { name: 'PKM Beru',       kecamatan: 'Alok Timur' },
  { name: 'PKM Koja Gete',  kecamatan: 'Alok Timur' },
  // Mapitara: 1 PKM
  { name: 'PKM Mapitara',   kecamatan: 'Mapitara' },
  // Bola: 1 PKM
  { name: 'PKM Bola',       kecamatan: 'Bola' },
  // Doreng: 2 PKMs
  { name: 'PKM Habibola',   kecamatan: 'Doreng' },
  { name: 'PKM Wualadu',    kecamatan: 'Doreng' },
  // Hewokloang: 1 PKM
  { name: 'PKM Hewokloang', kecamatan: 'Hewokloang' },
  // Kangae: 1 PKM
  { name: 'PKM Waipare',    kecamatan: 'Kangae' },
  // Kewapante: 1 PKM
  { name: 'PKM Kewapante',  kecamatan: 'Kewapante' },
  // Koting: 1 PKM
  { name: 'PKM Koting',     kecamatan: 'Koting' },
  // Lela: 1 PKM
  { name: 'PKM Nanga',      kecamatan: 'Lela' },
  // Nita: 1 PKM
  { name: 'PKM Nita',       kecamatan: 'Nita' },
  // Magepanda: 1 PKM
  { name: 'PKM Magepanda',  kecamatan: 'Magepanda' },
  // Nelle: 1 PKM
  { name: 'PKM Nelle',      kecamatan: 'Nelle' },
  // Mego: 2 PKMs
  { name: 'PKM Lekebai',    kecamatan: 'Mego' },
  { name: 'PKM Feondari',   kecamatan: 'Mego' },
  // Paga: 1 PKM
  { name: 'PKM Paga',       kecamatan: 'Paga' },
  // Tanawawo: 1 PKM
  { name: 'PKM Wolofeo',    kecamatan: 'Tanawawo' },
  // Palue: 2 PKMs
  { name: 'PKM Palue',      kecamatan: 'Palue' },
  { name: 'PKM Tuanggeo',   kecamatan: 'Palue' },
  // Waigete: 1 PKM
  { name: 'PKM Waigete',    kecamatan: 'Waigete' },
  // Talibura: 2 PKMs
  { name: 'PKM Watubaing',  kecamatan: 'Talibura' },
  { name: 'PKM Boganatar',  kecamatan: 'Talibura' },
  // Waiblama: 1 PKM
  { name: 'PKM Tanarawa',   kecamatan: 'Waiblama' },
];

// Real village data from CSV: Daftar Kelurahan dan Desa di Kabupaten Sikka
const kecamatanData: Array<{
  name: string;
  headName: string;
  phoneNumber: string;
  address: string;
  areaSize: number;
  villages: Array<{ name: string; type: VillageType }>;
}> = [
  {
    name: 'Paga',
    headName: 'Drs. Antonius Paga',
    phoneNumber: '085234001001',
    address: 'Jl. Trans Flores, Paga, Kabupaten Sikka',
    areaSize: 142.5,
    villages: [
      { name: 'Lenandareta', type: 'DESA' },
      { name: 'Masebewa', type: 'DESA' },
      { name: 'Mauloo', type: 'DESA' },
      { name: 'Mbengu', type: 'DESA' },
      { name: 'Paga', type: 'DESA' },
      { name: 'Wolorega', type: 'DESA' },
      { name: 'Wolowiro', type: 'DESA' },
      { name: 'Wolowona', type: 'DESA' },
    ],
  },
  {
    name: 'Mego',
    headName: 'Drs. Agustinus Mego',
    phoneNumber: '085234001002',
    address: 'Jl. Trans Flores, Mego, Kabupaten Sikka',
    areaSize: 198.3,
    villages: [
      { name: 'Bhera', type: 'DESA' },
      { name: 'Dobo', type: 'DESA' },
      { name: "Dobo Nuapu'u", type: 'DESA' },
      { name: 'Gera', type: 'DESA' },
      { name: 'Korobhera', type: 'DESA' },
      { name: 'Kowi', type: 'DESA' },
      { name: 'Liakutu', type: 'DESA' },
      { name: 'Napu', type: 'DESA' },
      { name: 'Parabubu', type: 'DESA' },
      { name: 'Wolodhesa', type: 'DESA' },
    ],
  },
  {
    name: 'Lela',
    headName: 'Drs. Yohanes Lela',
    phoneNumber: '085234001003',
    address: 'Jl. Trans Flores, Lela, Kabupaten Sikka',
    areaSize: 87.2,
    villages: [
      { name: 'Baopaat', type: 'DESA' },
      { name: 'Du', type: 'DESA' },
      { name: 'Hepang', type: 'DESA' },
      { name: 'Iligai', type: 'DESA' },
      { name: 'Kolidetung', type: 'DESA' },
      { name: 'Korowuwu', type: 'DESA' },
      { name: 'Lela', type: 'DESA' },
      { name: 'Sikka', type: 'DESA' },
      { name: 'Watutedang', type: 'DESA' },
    ],
  },
  {
    name: 'Nita',
    headName: 'Drs. Florianus Nita',
    phoneNumber: '085234001004',
    address: 'Jl. Trans Flores, Nita, Kabupaten Sikka',
    areaSize: 103.7,
    villages: [
      { name: 'Bloro', type: 'DESA' },
      { name: 'Ladogahar', type: 'DESA' },
      { name: 'Lusitada', type: 'DESA' },
      { name: 'Mahebora', type: 'DESA' },
      { name: 'Nirangkliung', type: 'DESA' },
      { name: 'Nita', type: 'DESA' },
      { name: 'Nitakloang', type: 'DESA' },
      { name: 'Riit', type: 'DESA' },
      { name: 'Takaplager', type: 'DESA' },
      { name: 'Tebuk', type: 'DESA' },
      { name: 'Tilang', type: 'DESA' },
      { name: 'Wuliwutik', type: 'DESA' },
    ],
  },
  {
    name: 'Alok',
    headName: 'Drs. Petrus Alok',
    phoneNumber: '085234001005',
    address: 'Jl. Ahmad Yani No.1, Maumere, Kabupaten Sikka',
    areaSize: 34.6,
    villages: [
      { name: 'Gunung Sari', type: 'DESA' },
      { name: 'Pemana', type: 'DESA' },
      { name: 'Samparong', type: 'DESA' },
      { name: 'Kabor', type: 'KELURAHAN' },
      { name: 'Kota Uneng', type: 'KELURAHAN' },
      { name: 'Madawat', type: 'KELURAHAN' },
      { name: 'Nangalimang', type: 'KELURAHAN' },
    ],
  },
  {
    name: 'Palue',
    headName: 'Drs. Blasius Palue',
    phoneNumber: '085234001006',
    address: 'Jl. Palue Raya, Palue, Kabupaten Sikka',
    areaSize: 47.8,
    villages: [
      { name: 'Kesokoja', type: 'DESA' },
      { name: 'Ladolaka', type: 'DESA' },
      { name: 'Lidi', type: 'DESA' },
      { name: 'Maluriwu', type: 'DESA' },
      { name: 'Nitunglea', type: 'DESA' },
      { name: 'Reruwairere', type: 'DESA' },
      { name: 'Rokirole', type: 'DESA' },
      { name: 'Tuanggeo', type: 'DESA' },
    ],
  },
  {
    name: 'Nelle',
    headName: 'Drs. Stefanus Nelle',
    phoneNumber: '085234001007',
    address: 'Jl. Trans Flores, Nelle, Kabupaten Sikka',
    areaSize: 92.1,
    villages: [
      { name: 'Manubura', type: 'DESA' },
      { name: 'Nelle Barat', type: 'DESA' },
      { name: 'Nelle Lorang', type: 'DESA' },
      { name: 'Nelle Urang', type: 'DESA' },
      { name: 'Nelle Wutung', type: 'DESA' },
    ],
  },
  {
    name: 'Talibura',
    headName: 'Drs. Gregorius Talibura',
    phoneNumber: '085234001008',
    address: 'Jl. Trans Flores, Talibura, Kabupaten Sikka',
    areaSize: 218.4,
    villages: [
      { name: 'Baang Koor', type: 'DESA' },
      { name: 'Darat Gunung', type: 'DESA' },
      { name: 'Darat Pantai', type: 'DESA' },
      { name: 'Hikong', type: 'DESA' },
      { name: 'Kringa', type: 'DESA' },
      { name: 'Lewomada', type: 'DESA' },
      { name: 'Nangahale', type: 'DESA' },
      { name: 'Nebe', type: 'DESA' },
      { name: 'Ojang', type: 'DESA' },
      { name: 'Talibura', type: 'DESA' },
      { name: 'Timutawa', type: 'DESA' },
      { name: 'Wailamung', type: 'DESA' },
    ],
  },
  {
    name: 'Waigete',
    headName: 'Drs. Hieronymus Waigete',
    phoneNumber: '085234001009',
    address: 'Jl. Trans Flores, Waigete, Kabupaten Sikka',
    areaSize: 163.9,
    villages: [
      { name: 'Aibura', type: 'DESA' },
      { name: 'Egon', type: 'DESA' },
      { name: 'Hoder', type: 'DESA' },
      { name: 'Nangatobong', type: 'DESA' },
      { name: 'Pogon', type: 'DESA' },
      { name: 'Runut', type: 'DESA' },
      { name: 'Wairbleler', type: 'DESA' },
      { name: 'Wairterang', type: 'DESA' },
      { name: 'Watudiran', type: 'DESA' },
    ],
  },
  {
    name: 'Kewapante',
    headName: 'Drs. Liberatus Kewapante',
    phoneNumber: '085234001010',
    address: 'Jl. Trans Flores, Kewapante, Kabupaten Sikka',
    areaSize: 129.5,
    villages: [
      { name: 'Geliting', type: 'DESA' },
      { name: 'Ian Tena', type: 'DESA' },
      { name: 'Kopong', type: 'DESA' },
      { name: 'Namangkewa', type: 'DESA' },
      { name: 'Seusina', type: 'DESA' },
      { name: 'Umagera', type: 'DESA' },
      { name: 'Waiara', type: 'DESA' },
      { name: 'Wairkoja', type: 'DESA' },
    ],
  },
  {
    name: 'Bola',
    headName: 'Drs. Adrianus Bola',
    phoneNumber: '085234001011',
    address: 'Jl. Trans Flores, Bola, Kabupaten Sikka',
    areaSize: 145.2,
    villages: [
      { name: 'Bola', type: 'DESA' },
      { name: 'Hokor', type: 'DESA' },
      { name: 'Ipir', type: 'DESA' },
      { name: 'Umauta', type: 'DESA' },
      { name: 'Wolokoli', type: 'DESA' },
      { name: 'Wolonwalu', type: 'DESA' },
    ],
  },
  {
    name: 'Magepanda',
    headName: 'Drs. Yoseph Magepanda',
    phoneNumber: '085234001012',
    address: 'Jl. Magepanda Raya, Kabupaten Sikka',
    areaSize: 176.8,
    villages: [
      { name: 'Done', type: 'DESA' },
      { name: 'Kolisia', type: 'DESA' },
      { name: 'Kolisia B', type: 'DESA' },
      { name: 'Magepanda', type: 'DESA' },
      { name: 'Reroroja', type: 'DESA' },
    ],
  },
  {
    name: 'Waiblama',
    headName: 'Drs. Hendrikus Waiblama',
    phoneNumber: '085234001013',
    address: 'Jl. Trans Flores, Waiblama, Kabupaten Sikka',
    areaSize: 210.3,
    villages: [
      { name: 'Ilinmedo', type: 'DESA' },
      { name: 'Natarmage', type: 'DESA' },
      { name: 'Pruda', type: 'DESA' },
      { name: 'Tanarawa', type: 'DESA' },
      { name: 'Tua Bao', type: 'DESA' },
      { name: 'Werang', type: 'DESA' },
    ],
  },
  {
    name: 'Alok Barat',
    headName: 'Drs. Servulus Alok Barat',
    phoneNumber: '085234001014',
    address: 'Jl. Alok Barat Raya, Maumere, Kabupaten Sikka',
    areaSize: 28.7,
    villages: [
      { name: 'Hewuli', type: 'DESA' },
      { name: 'Wailiti', type: 'DESA' },
      { name: 'Wolomarang', type: 'DESA' },
      { name: 'Wuring', type: 'DESA' },
    ],
  },
  {
    name: 'Alok Timur',
    headName: 'Drs. Maximilianus Alok Timur',
    phoneNumber: '085234001015',
    address: 'Jl. Alok Timur Raya, Maumere, Kabupaten Sikka',
    areaSize: 31.4,
    villages: [
      { name: 'Kojadoi', type: 'DESA' },
      { name: 'Kojagete', type: 'DESA' },
      { name: 'Lepolima', type: 'DESA' },
      { name: 'Perumaan', type: 'DESA' },
      { name: 'Watugong', type: 'DESA' },
      { name: 'Beru', type: 'KELURAHAN' },
      { name: 'Kota Baru', type: 'KELURAHAN' },
      { name: 'Nangameting', type: 'KELURAHAN' },
      { name: 'Waioti', type: 'KELURAHAN' },
      { name: 'Wairotang', type: 'KELURAHAN' },
    ],
  },
  {
    name: 'Koting',
    headName: 'Drs. Nikolaus Koting',
    phoneNumber: '085234001016',
    address: 'Jl. Trans Flores, Koting, Kabupaten Sikka',
    areaSize: 117.6,
    villages: [
      { name: 'Koting A', type: 'DESA' },
      { name: 'Koting B', type: 'DESA' },
      { name: 'Koting C', type: 'DESA' },
      { name: 'Koting D', type: 'DESA' },
      { name: 'Paubekor', type: 'DESA' },
      { name: 'Ribang', type: 'DESA' },
    ],
  },
  {
    name: 'Tanawawo',
    headName: 'Drs. Leonardus Tanawawo',
    phoneNumber: '085234001017',
    address: 'Jl. Tanawawo Raya, Kabupaten Sikka',
    areaSize: 187.9,
    villages: [
      { name: 'Bu Selatan', type: 'DESA' },
      { name: 'Bu Utara', type: 'DESA' },
      { name: 'Bu', type: 'DESA' },
      { name: 'Watuweti', type: 'DESA' },
      { name: 'Detubinga', type: 'DESA' },
      { name: 'Loke', type: 'DESA' },
      { name: 'Poma', type: 'DESA' },
      { name: 'Renggarasi', type: 'DESA' },
      { name: 'Tuwa', type: 'DESA' },
    ],
  },
  {
    name: 'Hewokloang',
    headName: 'Drs. Paulus Hewokloang',
    phoneNumber: '085234001018',
    address: 'Jl. Hewokloang Raya, Kabupaten Sikka',
    areaSize: 201.2,
    villages: [
      { name: 'Baomekot', type: 'DESA' },
      { name: 'Heopuat', type: 'DESA' },
      { name: 'Hewokloang', type: 'DESA' },
      { name: 'Kajowair', type: 'DESA' },
      { name: 'Munerana', type: 'DESA' },
      { name: 'Rubit', type: 'DESA' },
      { name: 'Wolomapa', type: 'DESA' },
    ],
  },
  {
    name: 'Kangae',
    headName: 'Drs. Metodius Kangae',
    phoneNumber: '085234001019',
    address: 'Jl. Trans Flores, Kangae, Kabupaten Sikka',
    areaSize: 156.4,
    villages: [
      { name: 'Blatatin', type: 'DESA' },
      { name: 'Habi', type: 'DESA' },
      { name: 'Kokowahor', type: 'DESA' },
      { name: 'Langir', type: 'DESA' },
      { name: 'Makendetung', type: 'DESA' },
      { name: 'Tanaduen', type: 'DESA' },
      { name: 'Tekaiku', type: 'DESA' },
      { name: 'Watuliwung', type: 'DESA' },
      { name: 'Watumilok', type: 'DESA' },
    ],
  },
  {
    name: 'Doreng',
    headName: 'Drs. Bonifacius Doreng',
    phoneNumber: '085234001020',
    address: 'Jl. Trans Flores, Doreng, Kabupaten Sikka',
    areaSize: 178.1,
    villages: [
      { name: 'Kloangpopot', type: 'DESA' },
      { name: 'Nenbura', type: 'DESA' },
      { name: 'Waihawa', type: 'DESA' },
      { name: 'Watumerak', type: 'DESA' },
      { name: 'Wogalirit', type: 'DESA' },
      { name: 'Wolomotong', type: 'DESA' },
      { name: 'Wolonterang', type: 'DESA' },
    ],
  },
  {
    name: 'Mapitara',
    headName: 'Drs. Vitalis Mapitara',
    phoneNumber: '085234001021',
    address: 'Jl. Mapitara Raya, Kabupaten Sikka',
    areaSize: 234.6,
    villages: [
      { name: 'Egon Gahar', type: 'DESA' },
      { name: 'Hale', type: 'DESA' },
      { name: 'Hebing', type: 'DESA' },
      { name: 'Natakoli', type: 'DESA' },
    ],
  },
];

async function main() {
  console.log('🧹 Clearing existing data (fresh seed)...');
  await prisma.surveyIntervention.deleteMany();
  await prisma.surveyContainer.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.accessCode.deleteMany();
  await prisma.village.deleteMany();
  await prisma.healthCenter.deleteMany();
  await prisma.district.deleteMany();
  console.log('✅ Database cleared.');

  console.log('🌱 Seeding 21 Kecamatan di Kabupaten Sikka...');

  // Admin access code
  await prisma.accessCode.create({
    data: { code: 'ADMIN123', type: 'ADMIN' },
  });

  const districtMap: Record<string, string> = {};

  for (const kec of kecamatanData) {
    console.log(`  → Kecamatan ${kec.name}`);

    // Create District
    const district = await prisma.district.create({
      data: {
        name: kec.name,
        headName: kec.headName,
        phoneNumber: kec.phoneNumber,
        address: kec.address,
        areaSize: kec.areaSize,
      },
    });
    districtMap[kec.name] = district.id;

    // Create villages (attached to district only)
    await prisma.village.createMany({
      data: kec.villages.map((v) => ({
        name: v.name,
        type: v.type,
        districtId: district.id,
      })),
    });
  }

  console.log(`🌱 Seeding ${puskesmasData.length} Puskesmas...`);

  for (const pkm of puskesmasData) {
    const districtId = districtMap[pkm.kecamatan];
    if (!districtId) continue;

    const shortName = pkm.name.replace('PKM ', '').toUpperCase().substring(0, 5);
    const randomCode = `PKM${shortName}${Math.floor(1000 + Math.random() * 9000)}`;

    const healthCenter = await prisma.healthCenter.create({
      data: {
        districtId: districtId,
        name: pkm.name,
        headName: `dr. ${pkm.name.replace('PKM ', '')} Specialist`,
        phoneNumber: `08${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        address: `Jl. Kesehatan No.${Math.floor(1 + Math.random() * 100)}, ${pkm.name.replace('PKM ', '')}`,
        targetHouses: Math.floor(200 + Math.random() * 600),
      },
    });

    const accessCodeRecord = await prisma.accessCode.create({
      data: {
        code: randomCode,
        type: 'PKM_UNIT',
        healthCenterId: healthCenter.id,
      },
    });

    const districtVillages = await prisma.village.findMany({
      where: { districtId: districtId },
      select: { id: true },
    });

    for (let i = 0; i < 20; i++) {
      const randomVillage = districtVillages[Math.floor(Math.random() * districtVillages.length)];
      
      const surveyDate = new Date();
      surveyDate.setDate(surveyDate.getDate() - (20 - i));

      const lat = -8.62 + (Math.random() * 0.1 - 0.05);
      const lng = 122.21 + (Math.random() * 0.2 - 0.1);

      const survey = await prisma.survey.create({
        data: {
          surveyorName: `Surveyor ${shortName} ${i + 1}`,
          accessCodeId: accessCodeRecord.id,
          villageId: randomVillage.id,
          surveyDate: surveyDate,
          houseOwner: `Warga ${shortName} ${i + 1}`,
          rtRw: `00${Math.floor(Math.random() * 5 + 1)}/00${Math.floor(Math.random() * 5 + 1)}`,
          address: `Jl. Lingkungan ${i + 1}`,
          occupantCount: Math.floor(Math.random() * 5) + 2,
          latitude: lat,
          longitude: lng,
          status: 'SUBMITTED',
          notes: 'Data survey otomatis',
        },
      });

      await prisma.surveyContainer.createMany({
        data: [
          {
            surveyId: survey.id,
            category: 'DAILY',
            containerName: 'Bak Mandi',
            inspectedCount: 2,
            positiveCount: Math.random() > 0.7 ? 1 : 0,
          },
          {
            surveyId: survey.id,
            category: 'NON_DAILY',
            containerName: 'Barang Bekas',
            inspectedCount: 3,
            positiveCount: Math.random() > 0.8 ? 1 : 0,
          }
        ]
      });

      await prisma.surveyIntervention.create({
        data: {
          surveyId: survey.id,
          activityName: 'Abatisasi',
          isDone: Math.random() > 0.5,
        }
      });
    }
  }

  console.log(`✅ Seeding finished! ${kecamatanData.length} kecamatan + ${puskesmasData.length} puskesmas + ${puskesmasData.length * 20} surveys created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
