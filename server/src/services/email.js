const nodemailer = require('nodemailer');
let transporter = null;

const initTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: parseInt(process.env.SMTP_PORT, 10) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    console.log('📧 Email transporter initialized (SMTP)');
  } else {
    console.log('📧 No SMTP configured — emails will be logged to console');
  }
};

const sendEmail = async ({ to, subject, html, text }) => {
  const from = process.env.SMTP_FROM || '"Demo Incubation" <no-reply@demo-incubator.com>';
  if (transporter) {
    try {
      const info = await transporter.sendMail({ from, to, subject, html, text });
      console.log(`📧 Email sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`📧 Failed to send email to ${to}:`, error.message);
      return { success: false, error: error.message };
    }
  } else {
    console.log('\n═══════════════════════════════════════');
    console.log('📧 EMAIL (Console — SMTP not configured)');
    console.log(`  To: ${to} | Subject: ${subject}`);
    console.log(text || '(HTML email)');
    console.log('═══════════════════════════════════════\n');
    return { success: true, messageId: 'console-log' };
  }
};

const sendRegistrationAck = async (startup) => {
  return sendEmail({
    to: startup.contact_email,
    subject: 'Application Received — Demo Incubation Centre',
    text: `Dear ${startup.contact_name},\n\nThank you for submitting your application for ${startup.name} to the Demo Incubation Centre.\nYour application is currently under review. Our team will get back to you shortly.\n\nBest regards,\nDemo Incubation Centre\nDemo Foundation`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto"><div style="background:#0D2C54;padding:24px;text-align:center"><h1 style="color:white;margin:0">Demo Incubator</h1></div><div style="padding:32px;background:#fff"><h2 style="color:#0D2C54">Application Received</h2><p>Dear <b>${startup.contact_name}</b>,</p><p>Thank you for submitting your application for <b>${startup.name}</b>.</p><p>We have received your application and it is currently under review.</p><div style="margin-top:24px;padding:16px;background:#f0fdf4;border-left:4px solid #10B981;border-radius:4px"><b>Status:</b> Pending Review</div></div><div style="padding:16px;background:#f2f3f5;text-align:center;font-size:12px;color:#666">Demo Incubation Centre | City, Country</div></div>`,
  });
};

const sendAdminNotification = async (adminEmail, startup) => {
  return sendEmail({
    to: adminEmail,
    subject: `New Application: ${startup.name}`,
    text: `New startup application:\nStartup: ${startup.name}\nIndustry: ${startup.industry}\nStage: ${startup.stage}\nContact: ${startup.contact_name} (${startup.contact_email})\n\nLog in to the dashboard to review.`,
  });
};

const sendPaymentReminder = async (startup, payment) => {
  const balance = (payment.total_amount - payment.amount_paid).toFixed(2);
  return sendEmail({
    to: startup.contact_email,
    subject: `Payment Reminder — ${payment.billing_month}`,
    text: `Dear ${startup.contact_name},\n\nPayment reminder for ${startup.name}.\n\nBilling Period: ${payment.billing_month}\nSeat Charges: ₹${payment.seat_charges}\nAdditional Charges: ₹${payment.additional_charges}${payment.additional_charges_notes ? ' (' + payment.additional_charges_notes + ')' : ''}\nTotal: ₹${payment.total_amount}\nPaid: ₹${payment.amount_paid}\nBalance Due: ₹${balance}\n\nPlease contact Demo Incubator to arrange payment.\n\nBest regards,\nDemo Incubation Centre`,
    html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto"><div style="background:#0D2C54;padding:24px;text-align:center"><h1 style="color:white;margin:0">Demo Incubator</h1></div><div style="padding:32px;background:#fff"><h2 style="color:#0D2C54">Payment Reminder</h2><p>Dear <b>${startup.contact_name}</b>,</p><table style="width:100%;border-collapse:collapse;margin:16px 0"><tr style="background:#f2f3f5"><td style="padding:10px;font-weight:bold">Billing Period</td><td style="padding:10px">${payment.billing_month}</td></tr><tr><td style="padding:10px;font-weight:bold">Seat Charges</td><td style="padding:10px">₹${payment.seat_charges}</td></tr><tr style="background:#f2f3f5"><td style="padding:10px;font-weight:bold">Additional</td><td style="padding:10px">₹${payment.additional_charges}</td></tr><tr><td style="padding:10px;font-weight:bold">Total</td><td style="padding:10px;font-weight:bold">₹${payment.total_amount}</td></tr><tr style="background:#fef2f2"><td style="padding:10px;font-weight:bold;color:#dc2626">Balance Due</td><td style="padding:10px;font-weight:bold;color:#dc2626">₹${balance}</td></tr></table><p>Please contact Demo Incubator to arrange payment.</p></div></div>`,
  });
};

const sendMentoringRequest = async (startupName, contactPerson, description, preferredDates) => {
  return sendEmail({
    to: 'enquiry@demo-incubator.com',
    subject: `Mentoring Request: ${startupName}`,
    text: `Mentoring Session Request\n\nStartup: ${startupName}\nContact: ${contactPerson}\nDescription: ${description}\nPreferred Dates: ${preferredDates}`,
  });
};

module.exports = { initTransporter, sendEmail, sendRegistrationAck, sendAdminNotification, sendPaymentReminder, sendMentoringRequest };
