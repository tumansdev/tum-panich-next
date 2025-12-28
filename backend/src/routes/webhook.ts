import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
const CHANNEL_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

interface LineEvent {
  type: string;
  replyToken?: string;
  source?: {
    userId?: string;
    type: string;
  };
  message?: {
    type: string;
    text?: string;
  };
  postback?: {
    data: string;
  };
}

interface LineWebhookBody {
  events: LineEvent[];
}

/**
 * ตรวจสอบ LINE Signature
 */
function verifySignature(body: string, signature: string): boolean {
  if (!CHANNEL_SECRET) {
    console.warn('LINE_CHANNEL_SECRET not set');
    return false;
  }
  
  const hash = crypto
    .createHmac('SHA256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  
  return hash === signature;
}

/**
 * ส่ง Reply Message (ฟรี ไม่จำกัดจำนวน!)
 */
async function replyMessage(replyToken: string, messages: any[]): Promise<void> {
  if (!CHANNEL_TOKEN) {
    console.warn('LINE_CHANNEL_ACCESS_TOKEN not set');
    return;
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LINE Reply failed:', error);
    } else {
      console.log('LINE Reply sent successfully');
    }
  } catch (error) {
    console.error('LINE Reply error:', error);
  }
}

/**
 * สร้าง Flex Message ต้อนรับ
 */
function createWelcomeFlexMessage() {
  return {
    type: 'flex',
    altText: '🍜 ยินดีต้อนรับสู่ร้านตั้มพานิช!',
    contents: {
      type: 'bubble',
      size: 'mega',
      hero: {
        type: 'image',
        url: 'https://tumpanich.com/images/hero.jpg',
        size: 'full',
        aspectRatio: '16:9',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '🍜 ร้านตั้มพานิช',
            weight: 'bold',
            size: 'xl',
            color: '#a40b0b',
          },
          {
            type: 'text',
            text: 'ก๋วยเตี๋ยวเรือ รสเด็ด สูตรดั้งเดิม',
            size: 'sm',
            color: '#999999',
            margin: 'md',
          },
          {
            type: 'separator',
            margin: 'lg',
          },
          {
            type: 'text',
            text: 'สั่งอาหารผ่าน LINE ได้เลย!',
            size: 'md',
            color: '#111111',
            margin: 'lg',
            wrap: true,
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        spacing: 'md',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#a40b0b',
            action: {
              type: 'uri',
              label: '🛒 สั่งอาหาร',
              uri: 'https://liff.line.me/2008553802-0TOhKu6u',
            },
          },
          {
            type: 'button',
            style: 'secondary',
            action: {
              type: 'uri',
              label: '📞 โทร',
              uri: 'tel:0812345678',
            },
          },
        ],
      },
    },
  };
}

/**
 * จัดการ text message
 */
async function handleTextMessage(event: LineEvent): Promise<void> {
  const text = event.message?.text?.toLowerCase() || '';
  const replyToken = event.replyToken;

  if (!replyToken) return;

  // คำที่ตอบอัตโนมัติ
  if (text.includes('สวัสดี') || text.includes('hello') || text === 'hi') {
    await replyMessage(replyToken, [createWelcomeFlexMessage()]);
  } else if (text.includes('เมนู') || text.includes('สั่ง') || text.includes('อาหาร')) {
    await replyMessage(replyToken, [{
      type: 'text',
      text: '🍜 สั่งอาหารได้ที่นี่เลยค่ะ!\n\n👉 https://liff.line.me/2008553802-0TOhKu6u',
    }]);
  } else if (text.includes('ที่อยู่') || text.includes('แผนที่') || text.includes('ร้าน')) {
    await replyMessage(replyToken, [{
      type: 'text',
      text: '📍 ร้านตั้มพานิช\n🏠 อ.อ่างทอง จ.อ่างทอง\n\n📞 โทร: 081-234-5678\n🕘 เปิด: 07:00 - 19:00 น.',
    }]);
  } else {
    // ข้อความทั่วไป
    await replyMessage(replyToken, [{
      type: 'text',
      text: `สวัสดีค่ะ! ✨\n\nขอบคุณที่ติดต่อร้านตั้มพานิช\nเราจะตอบกลับเร็วที่สุดนะคะ\n\n🍜 สั่งอาหาร: https://liff.line.me/2008553802-0TOhKu6u`,
    }]);
  }
}

/**
 * จัดการ follow event (เมื่อมีคนเพิ่มเพื่อน)
 */
async function handleFollowEvent(event: LineEvent): Promise<void> {
  if (!event.replyToken) return;

  await replyMessage(event.replyToken, [
    createWelcomeFlexMessage(),
    {
      type: 'text',
      text: '🎉 ยินดีต้อนรับสู่ร้านตั้มพานิช!\n\nพิมพ์ "เมนู" เพื่อดูเมนูอาหาร\nหรือกดลิงก์ด้านบนเพื่อสั่งอาหารได้เลยค่ะ 🍜',
    },
  ]);
}

/**
 * Webhook endpoint
 */
router.post('/', async (req: Request, res: Response) => {
  // LINE ส่ง body แบบ raw string สำหรับ verify signature
  const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const signature = req.headers['x-line-signature'] as string;

  // ตรวจสอบ signature (ข้ามถ้ายังไม่ได้ตั้งค่า secret)
  if (CHANNEL_SECRET && !verifySignature(bodyString, signature)) {
    console.warn('Invalid LINE signature');
    return res.status(401).send('Invalid signature');
  }

  const body: LineWebhookBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const events = body.events || [];

  console.log(`Received ${events.length} webhook events`);

  // ประมวลผลแต่ละ event
  for (const event of events) {
    console.log('Event type:', event.type);

    try {
      switch (event.type) {
        case 'message':
          if (event.message?.type === 'text') {
            await handleTextMessage(event);
          }
          break;
        case 'follow':
          await handleFollowEvent(event);
          break;
        case 'postback':
          // Handle postback events if needed
          break;
        default:
          console.log('Unhandled event type:', event.type);
      }
    } catch (error) {
      console.error('Error handling event:', error);
    }
  }

  res.status(200).send('OK');
});

export default router;
