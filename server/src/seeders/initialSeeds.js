require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize, Admin, Startup, Member, Attendance, Seat, BoardRoom, Booking, Payment, SupportTicket, Setting } = require('../models');

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...');
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (tables recreated)');

    // ── Admin ──
    await Admin.create({ name: 'Demo Admin', email: 'admin@demo-incubator.com', password: 'admin123' });
    console.log('✅ Admin created (admin@demo-incubator.com / admin123)');

    // ── Settings ──
    await Setting.create({ key: 'monthly_seat_rate', value: '5000', description: 'Monthly rate per seat in INR' });

    // ── Startups ──
    const s1 = await Startup.create({
      name: 'MedPulse AI', industry: 'Health Tech', stage: 'MVP',
      description: 'AI-powered diagnostic tool for early detection of cardiac anomalies using wearable ECG data.',
      year_founded: 2024, website: 'https://medpulse.ai',
      contact_name: 'Dr. Arjun Mehta', contact_designation: 'CEO & Co-Founder',
      contact_email: 'arjun@medpulse.ai', contact_phone: '+91-9876543210',
      contact_linkedin: 'https://linkedin.com/in/arjunmehta',
      team_members_count: 4, resources_needed: JSON.stringify(['Office Space', 'Mentoring', 'Networking']),
      referral_source: 'Event', status: 'Active', onboarding_date: '2025-11-01',
      assigned_seat: 'Zone A', postal_address_active: true, postal_address_since: '2025-11-01',
      notes: 'Strong founding team. Received BIRAC grant.',
    });
    const s2 = await Startup.create({
      name: 'NutriGenix', industry: 'Nutrition', stage: 'Early Revenue',
      description: 'Personalized nutrition planning platform using genetic profiling and microbiome analysis.',
      year_founded: 2023, website: 'https://nutrigenix.in',
      contact_name: 'Priya Sharma', contact_designation: 'Founder',
      contact_email: 'priya@nutrigenix.in', contact_phone: '+91-9123456789',
      team_members_count: 2, resources_needed: JSON.stringify(['Office Space', 'Board Room', 'Grants']),
      referral_source: 'Referral', status: 'Active', onboarding_date: '2025-12-15',
      assigned_seat: 'Zone B', postal_address_active: false,
      notes: 'Series seed funding in progress.',
    });
    const s3 = await Startup.create({
      name: 'BioStent Labs', industry: 'Medical Devices', stage: 'Growth',
      description: 'Biodegradable coronary stents with drug-eluting polymer coating for improved patient outcomes.',
      year_founded: 2022, website: 'https://biostentlabs.com',
      contact_name: 'Karthik Rao', contact_designation: 'CTO',
      contact_email: 'karthik@biostentlabs.com', contact_phone: '+91-9988776655',
      contact_linkedin: 'https://linkedin.com/in/karthikrao',
      team_members_count: 2, resources_needed: JSON.stringify(['Office Space', 'Board Room', 'Mentoring', 'Postal Address']),
      referral_source: 'Website', status: 'Active', onboarding_date: '2025-10-01',
      assigned_seat: 'Zone A', postal_address_active: true, postal_address_since: '2025-10-01',
    });
    console.log('✅ 3 Startups created');

    // ── Members ──
    const members = await Member.bulkCreate([
      { startup_id: s1.id, full_name: 'Dr. Arjun Mehta', role: 'CEO', email: 'arjun@medpulse.ai', phone: '+91-9876543210', date_of_joining: '2025-11-01', status: 'Active', id_card_issued: true, access_card_issued: true, access_card_number: 'AC-001', system_assigned: true, system_id: 'SYS-MP-01', wifi_access_granted: true, wifi_username: 'arjun.mp' },
      { startup_id: s1.id, full_name: 'Sneha Verma', role: 'Lead Data Scientist', email: 'sneha@medpulse.ai', phone: '+91-9876543211', date_of_joining: '2025-11-15', status: 'Active', id_card_issued: true, access_card_issued: true, access_card_number: 'AC-002', system_assigned: true, system_id: 'SYS-MP-02', wifi_access_granted: true, wifi_username: 'sneha.mp' },
      { startup_id: s1.id, full_name: 'Rahul Iyer', role: 'Full Stack Developer', email: 'rahul@medpulse.ai', phone: '+91-9876543212', date_of_joining: '2025-12-01', status: 'Active', id_card_issued: true, access_card_issued: false, wifi_access_granted: true, wifi_username: 'rahul.mp' },
      { startup_id: s1.id, full_name: 'Aisha Khan', role: 'Clinical Research Intern', email: 'aisha@medpulse.ai', phone: '+91-9876543213', date_of_joining: '2026-01-10', status: 'Active', id_card_issued: false, access_card_issued: false },
      { startup_id: s2.id, full_name: 'Priya Sharma', role: 'Founder & CEO', email: 'priya@nutrigenix.in', phone: '+91-9123456789', date_of_joining: '2025-12-15', status: 'Active', id_card_issued: true, access_card_issued: true, access_card_number: 'AC-003', system_assigned: true, system_id: 'SYS-NG-01', wifi_access_granted: true, wifi_username: 'priya.ng' },
      { startup_id: s2.id, full_name: 'Vikram Das', role: 'Bioinformatics Lead', email: 'vikram@nutrigenix.in', phone: '+91-9123456790', date_of_joining: '2026-01-05', status: 'Active', id_card_issued: true, access_card_issued: true, access_card_number: 'AC-004', wifi_access_granted: true, wifi_username: 'vikram.ng' },
      { startup_id: s3.id, full_name: 'Karthik Rao', role: 'CTO', email: 'karthik@biostentlabs.com', phone: '+91-9988776655', date_of_joining: '2025-10-01', status: 'Active', id_card_issued: true, access_card_issued: true, access_card_number: 'AC-005', system_assigned: true, system_id: 'SYS-BL-01', wifi_access_granted: true, wifi_username: 'karthik.bl' },
      { startup_id: s3.id, full_name: 'Meera Nair', role: 'Materials Engineer', email: 'meera@biostentlabs.com', phone: '+91-9988776656', date_of_joining: '2025-10-15', status: 'Active', id_card_issued: true, access_card_issued: true, access_card_number: 'AC-006', system_assigned: true, system_id: 'SYS-BL-02', wifi_access_granted: true, wifi_username: 'meera.bl' },
    ]);
    console.log('✅ 8 Members created');

    // ── Seats (12 seats across 2 zones) ──
    const seatData = [];
    for (let i = 1; i <= 6; i++) seatData.push({ label: `Zone A - Desk ${i}`, zone: 'Zone A' });
    for (let i = 1; i <= 6; i++) seatData.push({ label: `Zone B - Desk ${i}`, zone: 'Zone B' });
    const seats = await Seat.bulkCreate(seatData);
    // Assign seats
    await Seat.update({ status: 'Occupied', startup_id: s1.id, assigned_date: '2025-11-01' }, { where: { id: [seats[0].id, seats[1].id, seats[2].id, seats[3].id] } });
    await Seat.update({ status: 'Occupied', startup_id: s2.id, assigned_date: '2025-12-15' }, { where: { id: [seats[6].id, seats[7].id] } });
    await Seat.update({ status: 'Occupied', startup_id: s3.id, assigned_date: '2025-10-01' }, { where: { id: [seats[4].id, seats[5].id] } });
    console.log('✅ 12 Seats created (8 occupied)');

    // ── Board Rooms ──
    const br1 = await BoardRoom.create({ name: 'Covalence Board Room', capacity: 12, location: '2nd Floor, East Wing' });
    const br2 = await BoardRoom.create({ name: 'Helix Conference Room', capacity: 6, location: '1st Floor, West Wing' });
    console.log('✅ 2 Board Rooms created');

    // ── Bookings (a few sample) ──
    await Booking.bulkCreate([
      { board_room_id: br1.id, startup_id: s1.id, date: '2026-05-19', start_time: '10:00', end_time: '11:30', purpose: 'Investor pitch rehearsal', booked_by: 'Dr. Arjun Mehta' },
      { board_room_id: br2.id, startup_id: s3.id, date: '2026-05-19', start_time: '14:00', end_time: '15:00', purpose: 'Team standup', booked_by: 'Karthik Rao' },
      { board_room_id: br1.id, startup_id: s2.id, date: '2026-05-20', start_time: '09:00', end_time: '10:00', purpose: 'Mentor meeting', booked_by: 'Priya Sharma' },
    ]);
    console.log('✅ Sample bookings created');

    // ── Payments (2 months: April & May 2026) ──
    const rate = 5000;
    await Payment.bulkCreate([
      // April 2026
      { startup_id: s1.id, billing_month: '2026-04', seat_charges: rate * 4, additional_charges: 1200, additional_charges_notes: 'Printing & stationery', total_amount: rate * 4 + 1200, amount_paid: rate * 4 + 1200, payment_date: '2026-04-28', payment_mode: 'Bank Transfer', reference_number: 'TXN-APR-001', status: 'Paid' },
      { startup_id: s2.id, billing_month: '2026-04', seat_charges: rate * 2, additional_charges: 0, total_amount: rate * 2, amount_paid: rate * 2, payment_date: '2026-04-30', payment_mode: 'UPI', reference_number: 'TXN-APR-002', status: 'Paid' },
      { startup_id: s3.id, billing_month: '2026-04', seat_charges: rate * 2, additional_charges: 500, additional_charges_notes: 'Board room extra usage', total_amount: rate * 2 + 500, amount_paid: rate * 2, payment_date: '2026-04-25', payment_mode: 'Cheque', reference_number: 'CHQ-APR-003', status: 'Partial' },
      // May 2026
      { startup_id: s1.id, billing_month: '2026-05', seat_charges: rate * 4, additional_charges: 0, total_amount: rate * 4, amount_paid: 0, status: 'Pending' },
      { startup_id: s2.id, billing_month: '2026-05', seat_charges: rate * 2, additional_charges: 0, total_amount: rate * 2, amount_paid: 0, status: 'Pending' },
      { startup_id: s3.id, billing_month: '2026-05', seat_charges: rate * 2, additional_charges: 0, total_amount: rate * 2, amount_paid: 0, status: 'Pending' },
    ]);
    console.log('✅ 2 months of payment history seeded');

    // ── Sample attendance ──
    const today = new Date().toISOString().split('T')[0];
    await Attendance.bulkCreate([
      { member_id: members[0].id, date: today, time_in: '09:15', time_out: '18:00' },
      { member_id: members[1].id, date: today, time_in: '09:30', time_out: null },
      { member_id: members[4].id, date: today, time_in: '10:00', time_out: '17:30' },
      { member_id: members[6].id, date: today, time_in: '08:45', time_out: null },
    ]);
    console.log('✅ Sample attendance logged');

    // ── Support tickets ──
    await SupportTicket.bulkCreate([
      { startup_id: s1.id, type: 'IT', subject: 'WiFi connectivity issues', description: 'Intermittent WiFi drops in Zone A during afternoons.', status: 'Open' },
      { startup_id: s3.id, type: 'Facilities', subject: 'AC not working in Zone A', description: 'Air conditioning unit near Desk 5-6 is not cooling properly.', status: 'In Progress', notes: 'Maintenance team notified on May 18.' },
    ]);
    console.log('✅ Sample support tickets created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('   Admin login: admin@demo-incubator.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
