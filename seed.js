import bcrypt from 'bcryptjs';
import db, { initDB } from './db.js';

export function seedDatabase(force = false) {
  initDB();

  if (!force) {
    const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    if (count > 0) {
      console.log('Database already seeded.');
      return;
    }
  } else {
    db.exec('DELETE FROM bookings; DELETE FROM machines; DELETE FROM users;');
  }

  console.log('Seeding Rural Machinery Booking System database for Farmer & Owner roles...');

  const passHash = bcrypt.hashSync('password123', 10);

  // 1. Users (Farmer & Owner only)
  const insUser = db.prepare(`
    INSERT INTO users (name, phone, village, taluk, district, address, latitude, longitude, preferred_language, business_name, role, password_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const uFarmer = insUser.run(
    'Ravi Kumar',
    '9876543210',
    'Hoskote',
    'Hoskote',
    'Bengaluru Rural',
    'Main Road, Near Anjaneya Temple, Hoskote',
    13.0712,
    77.7983,
    'kn',
    null,
    'FARMER',
    passHash
  );

  const uOwner = insUser.run(
    'Ramesh Kumar',
    '9876543211',
    'Hoskote',
    'Hoskote',
    'Bengaluru Rural',
    'Kisan Machinery Hub, Industrial Area, Hoskote',
    13.0755,
    77.8015,
    'kn',
    'Sri Manjunatha Krishi Seva',
    'OWNER',
    passHash
  );

  const farmerId = uFarmer.lastInsertRowid || 1;
  const ownerId = uOwner.lastInsertRowid || 2;

  // 2. Machines with Maintenance Days and Default Image Fallbacks
  const insMachine = db.prepare(`
    INSERT INTO machines (owner_id, name, type, registration_number, price_per_acre, price_per_hour, village, taluk, district, latitude, longitude, image_url, available, maintenance_day, maintenance_enabled, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const m1 = insMachine.run(
    ownerId,
    'John Deere 5310 PowerPro 55HP Tractor',
    'TRACTOR',
    'KA-53-M-4821',
    1200,
    1000,
    'Hoskote',
    'Hoskote',
    'Bengaluru Rural',
    13.0755,
    77.8015,
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600',
    1,
    0, // Sunday Maintenance
    1,
    4.9
  );

  const m2 = insMachine.run(
    ownerId,
    'CLAAS Crop Tiger 40 Paddy Harvester',
    'HARVESTER',
    'KA-53-H-9012',
    2400,
    2200,
    'Hoskote',
    'Hoskote',
    'Bengaluru Rural',
    13.0755,
    77.8015,
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600',
    1,
    0, // Sunday Maintenance
    1,
    4.8
  );

  const m3 = insMachine.run(
    ownerId,
    'Shaktiman Semi-Champion 7ft Rotavator',
    'ROTAVATOR',
    'KA-53-R-3321',
    850,
    750,
    'Hoskote',
    'Hoskote',
    'Bengaluru Rural',
    13.0755,
    77.8015,
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
    1,
    1, // Monday Maintenance
    1,
    4.7
  );

  // Requirement 2: High quality default sprayer image!
  const m4 = insMachine.run(
    ownerId,
    'Fieldking 600L Tractor Mounted Boom Sprayer',
    'SPRAYER',
    'KA-43-S-1102',
    550,
    500,
    'Malur',
    'Malur',
    'Kolar',
    13.0035,
    77.9405,
    'https://images.unsplash.com/photo-1530267981608-bc70a27e72b2?w=600',
    1,
    6, // Saturday Maintenance
    1,
    4.9
  );

  const m5 = insMachine.run(
    ownerId,
    'National 9-Row Automatic Seed Drill',
    'SEED_DRILL',
    'KA-50-D-7711',
    750,
    700,
    'Devanahalli',
    'Devanahalli',
    'Bengaluru Rural',
    13.2483,
    77.7126,
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600',
    1,
    0, // Sunday Maintenance
    1,
    4.6
  );

  const m1Id = m1.lastInsertRowid || 1;
  const m2Id = m2.lastInsertRowid || 2;
  const m3Id = m3.lastInsertRowid || 3;

  // 3. Bookings
  const insBooking = db.prepare(`
    INSERT INTO bookings (booking_number, farmer_id, machine_id, booking_date, time_slot, acres, work_type, status, total_cost, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insBooking.run(
    'RMB-2026-00124',
    farmerId,
    m2Id,
    '2026-08-15',
    '08:00 AM',
    5.0,
    'Paddy Harvesting',
    'PENDING',
    12000,
    'Urgent harvesting needed before rainfall. Field near lake road.'
  );

  insBooking.run(
    'RMB-2026-00118',
    farmerId,
    m1Id,
    '2026-08-12',
    '06:00 AM',
    4.0,
    'Deep Ploughing',
    'APPROVED',
    4800,
    'Soil preparation for Ragi crop.'
  );

  insBooking.run(
    'RMB-2026-00095',
    farmerId,
    m3Id,
    '2026-08-05',
    '10:00 AM',
    6.0,
    'Rotavating Soil',
    'COMPLETED',
    5100,
    'Completed successfully on time.'
  );

  console.log('Farmer & Owner seeding completed successfully!');
}

if (process.argv[1].endsWith('seed.js')) {
  seedDatabase(true);
}
