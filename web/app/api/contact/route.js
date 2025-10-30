// app/api/contact/route.js
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

export async function POST(request) {
  let dbClient;
  try {
    dbClient = await clientPromise;
    const db = dbClient.db(process.env.MONGODB_DB);
    const collection = db.collection('contacts');

    const formData = await request.json();

    if (!formData.email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    // --- Check for Existing Contact ---
    const existingContact = await collection.findOne({ email: formData.email });

    let dbOperationResult;
    let statusCode = 201;
    let responseMessage = 'Submission successful!';
    let shouldSendEmail = false; // Flag to control email sending

    if (existingContact) {
      // --- Handle Existing Contact ---
      if (existingContact.state === 'not_replied') {
        // Request is already pending
        return NextResponse.json(
          { message: 'Request already pending.' },
          { status: 409 } // Conflict
        );
      } else if (existingContact.state === 'spam') {
        // **NEW: Request is marked as spam, block/ignore**
        console.log(`Blocked submission from spam email: ${formData.email}`);
        // Return a generic success to not reveal spam status, or a specific error like 403
        // Let's return 403 Forbidden for clarity on the server, frontend can handle it gently
        return NextResponse.json(
          { message: 'Submission blocked.' },
          { status: 403 } // Forbidden
        );
      } else {
        // State is 'replied' or maybe something else unexpected, update it
        const newCount = (existingContact.count || 0) + 1;
        dbOperationResult = await collection.updateOne(
          { _id: existingContact._id },
          {
            $set: {
              ...formData,
              state: 'not_replied', // Reset state
              count: newCount,
              submittedAt: new Date(),
            }
          }
        );
        if (dbOperationResult.modifiedCount > 0) {
            statusCode = 200; // OK for update
            responseMessage = 'Request updated successfully!';
            shouldSendEmail = true; // Send email for successful update
        } else {
            // Update didn't happen for some reason, treat as error maybe?
            console.warn(`Update failed for existing contact: ${formData.email}`);
            // Let's still proceed but maybe log this
             responseMessage = 'Submission received, but update failed.'; // Or adjust as needed
             statusCode = 500; // Internal server error if update failed unexpectedly
        }
      }
    } else {
      // --- Handle New Contact ---
      const documentToInsert = {
        ...formData,
        state: 'not_replied',
        submittedAt: new Date(),
        count: 1,
      };
      dbOperationResult = await collection.insertOne(documentToInsert);
      if (dbOperationResult.insertedId) {
          shouldSendEmail = true; // Send email for successful insert
      }
    }

    // --- Email Sending (Conditional) ---
    if (shouldSendEmail && process.env.SMTP_HOST) {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: formData.email,
        subject: "We've Received Your Request - Markdown",
        html: `
          <html><body>
            <h1>Hi ${formData.firstName || 'there'},</h1>
            <p>Thank you for contacting Markdown sales!</p>
            <p>We have received your request and will get back to you soon via phone (${formData.phone || 'N/A'}) or email (${formData.email}).</p>
            <p>Best regards,<br/>The Markdown Team</p>
          </body></html>
        `,
      };
      try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully via SMTP to:', formData.email);
      } catch (emailError) {
        console.error('Nodemailer Error:', emailError);
      }
    } else if (!process.env.SMTP_HOST) {
        console.warn("SMTP host not configured. Skipping email sending.");
    }

    // --- Send Final Response ---
    // Ensure we don't send success if the update operation failed internally
    if (statusCode === 500 && responseMessage === 'Submission received, but update failed.') {
         return NextResponse.json(
             { message: 'Failed to update existing submission.' },
             { status: 500 }
         );
    }

    return NextResponse.json(
      {
        message: responseMessage,
        id: existingContact ? existingContact._id : dbOperationResult?.insertedId
      },
      { status: statusCode }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Failed to submit data.', error: error.message },
      { status: 500 }
    );
  }
}