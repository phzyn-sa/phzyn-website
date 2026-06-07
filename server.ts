import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body request parsing
  app.use(express.json());

  // API Endpoint: Send Project Quote Details via SMTP Email
  app.post('/api/send-quote', async (req, res) => {
    try {
      const {
        fullName,
        companyName,
        email,
        phone,
        serviceType,
        areaSize,
        budget,
        timeline,
        details,
        ticketNumber,
      } = req.body;

      // Basic validation
      if (!fullName || !email || !phone) {
        return res.status(400).json({
          error: 'Missing required parameters. Full Name, Email, and Phone are required.',
        });
      }

      // Check for SMTP configuration
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpSenderName = process.env.SMTP_SENDER_NAME || 'PHZYN Project Requests';

      if (!smtpHost || !smtpUser || !smtpPass) {
        console.error('SMTP secrets are missing or incomplete in environment.');
        return res.status(500).json({
          error: 'SMTP configuration is incomplete in the environment variables.',
        });
      }

      // Map service types to reader-friendly Arabic & English labels
      const getServiceLabel = (type: string) => {
        switch (type) {
          case 'commercial': return 'تنفيذ المحلات التجارية (Retail Store)';
          case 'office': return 'تنفيذ المكاتب والشركات (Office Fit-out)';
          case 'booth': return 'تنفيذ البوثات والمعارض (Exhibition Booth)';
          default: return type;
        }
      };

      const getTimelineLabel = (tl: string) => {
        switch (tl) {
          case 'urgent': return 'عاجل (Urgent)';
          case 'normal': return 'طبيعي - من شهر إلى ٣ أشهر (Normal)';
          case 'flexible': return 'مرن - أكثر من ٣ أشهر (Flexible)';
          default: return tl;
        }
      };

      const getBudgetLabel = (bg: string) => {
        switch (bg) {
          case 'under50k': return 'أقل من 50,000 ريال سعودي';
          case '50k-150k': return 'من 50,000 إلى 150,000 ريال سعودي';
          case '150k-500k': return 'من 150,000 إلى 500,000 ريال سعودي';
          case 'over500k': return 'أكثر من 500,000 ريال سعودي';
          default: return bg;
        }
      };

      // Create rich HTML email layout
      const emailHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #1e293b;
              background-color: #f8fafc;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 650px;
              margin: 30px auto;
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #10798e;
              color: #ffffff;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              letter-spacing: -0.025em;
            }
            .header p {
              margin: 8px 0 0 0;
              font-size: 14px;
              opacity: 0.9;
            }
            .content {
              padding: 30px;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              color: #0c5c6d;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 8px;
              margin-top: 0;
              margin-bottom: 20px;
            }
            .grid {
              display: table;
              width: 100%;
              margin-bottom: 25px;
            }
            .row {
              display: table-row;
            }
            .label {
              display: table-cell;
              padding: 10px 0;
              font-weight: 600;
              color: #64748b;
              width: 35%;
              font-size: 14px;
              border-bottom: 1px solid #f1f5f9;
            }
            .value {
              display: table-cell;
              padding: 10px 0;
              color: #0f172a;
              font-size: 14px;
              border-bottom: 1px solid #f1f5f9;
            }
            .details-box {
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px 20px;
              font-size: 14px;
              line-height: 1.6;
              color: #334155;
            }
            .footer {
              background-color: #f1f5f9;
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #64748b;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>طلب مشروع جديد (PHZYN)</h1>
              <p>رقم تذكرة الطلب / Reference Code: <strong>${ticketNumber}</strong></p>
            </div>
            
            <div class="content">
              <h2 class="section-title">١. معلومات العميل والاتصال</h2>
              <div class="grid">
                <div class="row">
                  <div class="label">اسم العميل بالكامل:</div>
                  <div class="value">${fullName}</div>
                </div>
                <div class="row">
                  <div class="label">الجهة أو العلامة التجارية:</div>
                  <div class="value">${companyName || '— (لم يحدد)'}</div>
                </div>
                <div class="row">
                  <div class="label">البريد الإلكتروني:</div>
                  <div class="value" style="direction: ltr; text-align: right;">${email}</div>
                </div>
                <div class="row">
                  <div class="label">رقم الجوال:</div>
                  <div class="value" style="direction: ltr; text-align: right;">${phone}</div>
                </div>
              </div>

              <h2 class="section-title">٢. بيانات المشروع والتنفيذ</h2>
              <div class="grid">
                <div class="row">
                  <div class="label">نوع الخدمة المطلوبة:</div>
                  <div class="value">${getServiceLabel(serviceType)}</div>
                </div>
                <div class="row">
                  <div class="label">مساحة الموقع التقريبية:</div>
                  <div class="value">${areaSize} متر مربع (Sqm)</div>
                </div>
                <div class="row">
                  <div class="label">الميزانية التقريبية:</div>
                  <div class="value">${getBudgetLabel(budget)}</div>
                </div>
                <div class="row">
                  <div class="label">الجدول الزمني المستهدف:</div>
                  <div class="value">${getTimelineLabel(timeline)}</div>
                </div>
              </div>

              ${details ? `
                <h2 class="section-title">٣. المواصفات الإضافية والتعليمات</h2>
                <div class="details-box">
                  ${details.replace(/\n/g, '<br>')}
                </div>
              ` : ''}
            </div>

            <div class="footer">
              تم إرسال هذا الطلب تلقائياً من نظام الموقع الإلكتروني لـ PHZYN
            </div>
          </div>
        </body>
        </html>
      `;

      // Set up standard SMTP NodeMailer transporter
      // Secure option runs true if port is 465, false otherwise.
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, 
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Mail options definition
      const mailOptions = {
        from: `"${smtpSenderName}" <${smtpUser}>`,
        to: 'phzyn@phzyn.sa',
        replyTo: email,
        subject: `طلب مشروع جديد [${ticketNumber}] - ${fullName}`,
        html: emailHtml,
      };

      // Send the mail using Nodemailer
      await transporter.sendMail(mailOptions);
      console.log(`Successfully sent email quote for ticket ${ticketNumber} to phzyn@phzyn.sa`);

      return res.status(200).json({
        success: true,
        ticketNumber,
      });

    } catch (error: any) {
      console.error('Nodemailer SMTP email send failure:', error);
      return res.status(500).json({
        error: 'Technical issue occurred while sending the email. Please double-check SMTP credentials.',
        details: error?.message,
      });
    }
  });

  // Serve static files and mount Vite middleware in development vs production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express application active on http://localhost:${PORT}`);
  });
}

startServer();
