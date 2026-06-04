import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables (.env)
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API endpoint for direct quote email submissions to phzyn@phzyn.sa
  app.post("/api/quote", async (req, res) => {
    const language = req.body.language || 'ar';
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
        ticketNumber
      } = req.body;

      if (!fullName || !email || !phone) {
        return res.status(400).json({ 
          success: false, 
          message: language === "ar" ? "الاسم، البريد الإلكتروني ورقم الجوال مطلوبة." : "Name, email and phone number are required." 
        });
      }

      // Format services
      let serviceLabel = serviceType;
      if (serviceType === 'commercial') serviceLabel = language === 'ar' ? 'المحلات التجارية' : 'Retail Stores';
      else if (serviceType === 'office') serviceLabel = language === 'ar' ? 'المكاتب ومقرات العمل' : 'Offices & Workspaces';
      else if (serviceType === 'booth') serviceLabel = language === 'ar' ? 'البوثات والمعارض' : 'Booths & Exhibitions';

      // Format budget
      let budgetLabel = budget;
      if (budget === 'under50k') budgetLabel = language === 'ar' ? 'أقل من 50,000 ريال' : 'Under 50,000 SAR';
      else if (budget === '50k-150k') budgetLabel = language === 'ar' ? '50,000 إلى 150,000 ريال' : '50,000 to 150,000 SAR';
      else if (budget === '150k-500k') budgetLabel = language === 'ar' ? '150,000 إلى 500,000 ريال' : '150,000 to 500,000 SAR';
      else if (budget === 'over500k') budgetLabel = language === 'ar' ? 'أكثر من 500,000 ريال' : 'Over 500,000 SAR';

      // Format timeline
      let timelineLabel = timeline;
      if (timeline === 'urgent') timelineLabel = language === 'ar' ? 'عاجل (أقل من شهر)' : 'Urgent (Under 1 month)';
      else if (timeline === 'normal') timelineLabel = language === 'ar' ? 'متوسط (من شهر إلى 3 أشهر)' : 'Medium (1 to 3 months)';
      else if (timeline === 'flexible') timelineLabel = language === 'ar' ? 'مرن (أكثر من 3 أشهر)' : 'Flexible (Over 3 months)';

      // Code generator fallback
      const finalTicket = ticketNumber || 'PHZ-' + Math.floor(100000 + Math.random() * 900000);

      // Email formatting - Plain Text
      const textBody = `
=============================================
طلب عرض سعر جديد - ${finalTicket}
=============================================

■ البيانات الأساسية للعميل:
الاسم بالكامل: ${fullName}
الشركة / العلامة التجارية: ${companyName || 'لا توجد / شخصي'}
البريد الإلكتروني للعميل: ${email}
رقم الجوال: ${phone}

■ تفاصيل المشروع:
نوع المشروع: ${serviceLabel}
مساحة الموقع: ${areaSize} م² (متر مربع)
الميزانية التقديرية: ${budgetLabel}
الجدول الزمني: ${timelineLabel}

■ تفاصيل ومواصفات إضافية:
${details || 'لا توجد تفاصيل إضافية'}

---------------------------------------------
تم تقديم هذا الطلب تلقائياً من موقع فزين (PHZYN) الإلكتروني.
      `;

      // Email formatting - Clean HTML
      const htmlBody = `
        <div style="direction: rtl; text-align: right; font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <div style="background-color: #10798e; padding: 24px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">PHZYN | فـزيـن</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">طلب دراسة وعرض سعر مشروع جديد</p>
          </div>
          <div style="padding: 24px; background-color: #fcfcfd;">
            <div style="text-align: left; font-size: 11px; color: #a1a1aa; margin-bottom: 20px; font-weight: bold;">
              TICKET REF: ${finalTicket}
            </div>
            
            <h3 style="color: #10798e; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px; margin-top: 0; font-size: 15px;">١. معلومات العميل والاتصال</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 6px 0; color: #71717a; width: 35%; font-size: 13px;">الاسم بالكامل:</td>
                <td style="padding: 6px 0; color: #18181b; font-weight: bold; font-size: 13px;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-size: 13px;">الشركة / العلامة التجارية:</td>
                <td style="padding: 6px 0; color: #18181b; font-size: 13px;">${companyName || 'لا توجد / شخصي'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-size: 13px;">البريد الإلكتروني للعميل:</td>
                <td style="padding: 6px 0; color: #10798e; font-weight: 500; font-size: 13px; direction: ltr; text-align: right;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-size: 13px;">رقم الاتصال:</td>
                <td style="padding: 6px 0; color: #18181b; font-weight: 500; font-size: 13px; direction: ltr; text-align: right;">${phone}</td>
              </tr>
            </table>

            <h3 style="color: #10798e; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px; margin-top: 0; font-size: 15px;">٢. بيانات ومواصفات المشروع</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 6px 0; color: #71717a; width: 35%; font-size: 13px;">نوع المشروع:</td>
                <td style="padding: 6px 0; color: #18181b; font-weight: bold; font-size: 13px;">${serviceLabel}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-size: 13px;">مساحة الموقع:</td>
                <td style="padding: 6px 0; color: #10798e; font-weight: bold; font-size: 13px;">${areaSize} م²</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-size: 13px;">الميزانية التقديرية للعمل:</td>
                <td style="padding: 6px 0; color: #18181b; font-size: 13px;">${budgetLabel}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-size: 13px;">الجدول الزمني المطلوب:</td>
                <td style="padding: 6px 0; color: #18181b; font-size: 13px;">${timelineLabel}</td>
              </tr>
            </table>

            <h3 style="color: #10798e; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px; margin-top: 0; font-size: 15px;">٣. تفاصيل ومواصفات إضافية</h3>
            <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; color: #27272a; font-size: 13px; line-height: 1.6; white-space: pre-wrap; border-right: 4px solid #10798e;">
              ${details || 'لا توجد تفاصيل إضافية'}
            </div>
          </div>
          <div style="background-color: #f4f4f5; text-align: center; padding: 16px; font-size: 11px; color: #71717a; border-top: 1px solid #e4e4e7;">
            تم تقديم هذا الطلب تلقائياً من نظام الموقع لخدمة فزين الذكية.<br/>
            &copy; 2026 شركة فزين للمقاولات والديكور. جميع الحقوق محفوظة.
          </div>
        </div>
      `;

      // Read SMTP configurations from environment
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const senderName = process.env.SMTP_SENDER_NAME || "بوابة فزين | PHZYN Portal";

      // If SMTP is not configured, write to console and log cleanly as fallback
      if (!smtpHost || !smtpUser || !smtpPass) {
        console.warn("\n=== [SMTP WARNING] SMTP variables are not configured in settings ===");
        console.log("Saving mock quote summary directly to system logs:");
        console.log(textBody);
        console.warn("===================================================================\n");
        
        return res.json({ 
          success: true, 
          isMock: true,
          message: language === "ar" 
            ? "تم تسجيل مشروعك بنجاح! تواصل معنا عبر قنواتنا ريثما نقوم بتفعيل مزود البريد التلقائي للشركة." 
            : "Your project ticket was recorded successfully! We will reach out to you shortly." 
        });
      }

      // Initialize nodemailer lazy loader
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // Use true for 465, false for 587/other
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      // Send mail to team phzyn@phzyn.sa
      const info = await transporter.sendMail({
        from: `"${senderName}" <${smtpUser}>`,
        to: "phzyn@phzyn.sa",
        replyTo: email,
        subject: `[${finalTicket}] ${fullName} - طلب عرض سعر - ${serviceLabel}`,
        text: textBody,
        html: htmlBody
      });

      console.log(`Email successfully forwarded to phzyn@phzyn.sa. Message ID: ${info.messageId}`);

      return res.json({
        success: true,
        message: language === "ar" ? "تم إرسال طلبك بنجاح إلى الفريق المختص!" : "Your quote request has been transmitted successfully!"
      });

    } catch (error: any) {
      console.error("Error dispatching email:", error);
      return res.status(500).json({ 
        success: false, 
        message: language === "ar" ? "حدث خطأ غير متوقع أثناء إرسال البريد." : "An error occurred while dispatching the email.",
        error: error.message 
      });
    }
  });

  // Vite development middleware or production build static folder hosting
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK DEV SERVER] Server running on http://localhost:${PORT}`);
  });
}

startServer();
