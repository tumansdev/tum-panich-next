import { Order } from '../types';

/**
 * ตั้งค่าขนาดกระดาษ 58mm Thermal Printer
 * 58mm = ~32 characters per line (เมื่อใช้ font monospace)
 */
const PAPER_WIDTH = 32;

/**
 * สร้างเส้นคั่น
 */
function divider(char: string = '-'): string {
  return char.repeat(PAPER_WIDTH);
}

/**
 * จัดข้อความให้อยู่กึ่งกลาง
 */
function center(text: string): string {
  const padding = Math.max(0, Math.floor((PAPER_WIDTH - text.length) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * จัดข้อความซ้าย-ขวา
 */
function leftRight(left: string, right: string): string {
  const space = PAPER_WIDTH - left.length - right.length;
  if (space < 1) return left.substring(0, PAPER_WIDTH - right.length - 1) + ' ' + right;
  return left + ' '.repeat(space) + right;
}

/**
 * ตัดข้อความยาวให้พอดีกับความกว้างกระดาษ
 */
function wrapText(text: string, maxWidth: number = PAPER_WIDTH): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxWidth) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word.length > maxWidth ? word.substring(0, maxWidth) : word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * สร้างเนื้อหาใบเสร็จสำหรับครัว
 */
export function generateKitchenReceipt(order: Order): string {
  const lines: string[] = [];

  // Header
  lines.push(divider('='));
  lines.push(center('*** ใบสั่งอาหาร ***'));
  lines.push(divider('='));
  lines.push('');

  // Order ID & Time (ตัวใหญ่)
  lines.push(center(`#${order.id}`));
  lines.push(center(new Date(order.createdAt).toLocaleString('th-TH')));
  lines.push('');

  // Customer Info
  lines.push(divider());
  lines.push(`ลูกค้า: ${order.customerName}`);
  lines.push(`โทร: ${order.customerPhone}`);
  
  // Delivery Type
  const deliveryLabels: Record<string, string> = {
    'pickup': '>>> รับที่ร้าน <<<',
    'free-delivery': '>>> ส่งฟรี <<<',
    'easy-delivery': '>>> Easy Delivery <<<',
  };
  lines.push('');
  lines.push(center(deliveryLabels[order.deliveryType] || ''));

  // Address (if delivery)
  if (order.deliveryAddress) {
    lines.push('');
    lines.push('ที่อยู่:');
    wrapText(order.deliveryAddress).forEach(line => lines.push(line));
    if (order.landmark) {
      lines.push(`จุดสังเกต: ${order.landmark}`);
    }
  }

  lines.push('');
  lines.push(divider('='));
  lines.push(center('รายการอาหาร'));
  lines.push(divider('='));
  lines.push('');

  // Items
  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.productName}`);
    if (item.note) {
      lines.push(`   >> ${item.note}`);
    }
  });

  lines.push('');
  lines.push(divider());
  lines.push(leftRight('รวม', `${order.items.length} รายการ`));
  lines.push(leftRight('ยอดเงิน', `฿${order.totalAmount}`));
  lines.push('');

  // Payment
  const paymentLabel = order.paymentMethod === 'promptpay' ? '✓ โอนแล้ว' : '✗ เก็บเงินปลายทาง';
  lines.push(center(paymentLabel));
  lines.push('');

  // Footer
  lines.push(divider('='));
  lines.push('');
  lines.push('');
  lines.push('');

  return lines.join('\n');
}

/**
 * พิมพ์ใบเสร็จ
 * ใช้ browser's print dialog
 */
export function printKitchenOrder(order: Order): void {
  const receiptContent = generateKitchenReceipt(order);
  
  // สร้าง popup window สำหรับ print
  const printWindow = window.open('', '_blank', 'width=300,height=600');
  if (!printWindow) {
    alert('กรุณาอนุญาตให้เปิด popup เพื่อพิมพ์');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ใบสั่งอาหาร #${order.id}</title>
      <style>
        @page {
          size: 58mm auto;
          margin: 0;
        }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.4;
          margin: 0;
          padding: 5mm;
          width: 48mm;
        }
        pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      </style>
    </head>
    <body>
      <pre>${receiptContent}</pre>
      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
