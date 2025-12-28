import { closeLiff, isInLiff } from './liff';
import type liff from '@line/liff';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  options?: Record<string, string>;
}

interface ReceiptData {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryType: 'pickup' | 'delivery';
  deliveryFee?: number;
  customerName: string;
  createdAt: string;
}

/**
 * สร้าง Flex Message ใบเสร็จสวยๆ
 */
export function createReceiptFlexMessage(data: ReceiptData): Parameters<typeof liff.sendMessages>[0][0] {
  const itemContents = data.items.map(item => ({
    type: 'box' as const,
    layout: 'horizontal' as const,
    contents: [
      {
        type: 'text' as const,
        text: `${item.name}${item.options ? ` (${Object.values(item.options).join(', ')})` : ''} x${item.quantity}`,
        size: 'sm' as const,
        color: '#555555',
        flex: 3,
        wrap: true,
      },
      {
        type: 'text' as const,
        text: `฿${(item.price * item.quantity).toLocaleString()}`,
        size: 'sm' as const,
        color: '#111111',
        align: 'end' as const,
        flex: 1,
      },
    ],
    margin: 'md' as const,
  }));

  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = data.deliveryType === 'delivery' ? (data.deliveryFee || 0) : 0;

  return {
    type: 'flex',
    altText: `🧾 ใบเสร็จ #${data.orderId}`,
    contents: {
      type: 'bubble',
      size: 'mega',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: '🍜',
                size: 'xxl',
                flex: 0,
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'ตั้มพานิช',
                    weight: 'bold',
                    size: 'xl',
                    color: '#a40b0b',
                  },
                  {
                    type: 'text',
                    text: 'ใบเสร็จรับเงิน',
                    size: 'sm',
                    color: '#888888',
                  },
                ],
                margin: 'md',
              },
            ],
          },
        ],
        backgroundColor: '#fdf2f2',
        paddingAll: 'lg',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'หมายเลขออเดอร์',
                size: 'xs',
                color: '#888888',
                flex: 1,
              },
              {
                type: 'text',
                text: `#${data.orderId}`,
                size: 'xs',
                color: '#a40b0b',
                weight: 'bold',
                align: 'end',
                flex: 2,
              },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'วันที่',
                size: 'xs',
                color: '#888888',
                flex: 1,
              },
              {
                type: 'text',
                text: new Date(data.createdAt).toLocaleString('th-TH'),
                size: 'xs',
                color: '#555555',
                align: 'end',
                flex: 2,
              },
            ],
            margin: 'sm',
          },
          {
            type: 'separator',
            margin: 'lg',
          },
          {
            type: 'text',
            text: 'รายการสั่งซื้อ',
            weight: 'bold',
            size: 'md',
            color: '#111111',
            margin: 'lg',
          },
          ...itemContents,
          {
            type: 'separator',
            margin: 'lg',
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'ยอดอาหาร',
                size: 'sm',
                color: '#555555',
              },
              {
                type: 'text',
                text: `฿${subtotal.toLocaleString()}`,
                size: 'sm',
                color: '#111111',
                align: 'end',
              },
            ],
            margin: 'lg',
          },
          ...(deliveryFee > 0
            ? [
                {
                  type: 'box' as const,
                  layout: 'horizontal' as const,
                  contents: [
                    {
                      type: 'text' as const,
                      text: 'ค่าจัดส่ง',
                      size: 'sm' as const,
                      color: '#555555',
                    },
                    {
                      type: 'text' as const,
                      text: `฿${deliveryFee.toLocaleString()}`,
                      size: 'sm' as const,
                      color: '#111111',
                      align: 'end' as const,
                    },
                  ],
                  margin: 'sm' as const,
                },
              ]
            : []),
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: 'ยอดรวมทั้งหมด',
                weight: 'bold',
                size: 'lg',
                color: '#a40b0b',
              },
              {
                type: 'text',
                text: `฿${data.totalAmount.toLocaleString()}`,
                weight: 'bold',
                size: 'lg',
                color: '#a40b0b',
                align: 'end',
              },
            ],
            margin: 'lg',
          },
        ],
        paddingAll: 'lg',
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: `${data.deliveryType === 'pickup' ? '🏪 รับที่ร้าน' : '🚗 จัดส่ง'} • ${data.customerName}`,
            size: 'sm',
            color: '#555555',
            align: 'center',
          },
          {
            type: 'text',
            text: '✨ ขอบคุณที่ใช้บริการค่ะ ✨',
            weight: 'bold',
            size: 'md',
            color: '#a40b0b',
            align: 'center',
            margin: 'md',
          },
        ],
        backgroundColor: '#fdf2f2',
        paddingAll: 'lg',
      },
    },
  };
}

/**
 * แสดงข้อความขอบคุณและปิด LIFF
 * หมายเหตุ: liff.sendMessages() ใช้ได้เฉพาะในบริบทแชท (จาก Rich Menu หรือ Keyword)
 * ถ้าเปิด LIFF จาก external browser จะส่งไม่ได้
 */
export async function sendReceiptAndClose(data: ReceiptData): Promise<boolean> {
  if (!isInLiff()) {
    console.log('Not in LIFF, skipping receipt');
    return false;
  }

  try {
    // แสดง alert ขอบคุณ
    alert(`✅ สั่งซื้อสำเร็จ!\n\n🧾 หมายเลขออเดอร์: #${data.orderId}\n💰 ยอดรวม: ฿${data.totalAmount.toLocaleString()}\n\nขอบคุณที่ใช้บริการร้านตั้มพานิช 🍜`);
    
    // ปิด LIFF
    closeLiff();
    return true;
  } catch (error) {
    console.error('Failed to close LIFF:', error);
    return false;
  }
}

