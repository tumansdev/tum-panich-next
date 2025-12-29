import { Order } from '../types';

/**
 * ตั้งค่าขนาดกระดาษ 58mm Thermal Printer
 * 58mm = ~32 characters per line (เมื่อใช้ font monospace)
 */
const PAPER_WIDTH = 32;

function divider(char: string = '-'): string {
  return char.repeat(PAPER_WIDTH);
}

function center(text: string): string {
  const padding = Math.max(0, Math.floor((PAPER_WIDTH - text.length) / 2));
  return ' '.repeat(padding) + text;
}

function leftRight(left: string, right: string): string {
  const space = PAPER_WIDTH - left.length - right.length;
  if (space < 1) return left.substring(0, PAPER_WIDTH - right.length - 1) + ' ' + right;
  return left + ' '.repeat(space) + right;
}

/**
 * สร้างเนื้อหาใบเสร็จสำหรับครัว (กระชับ)
 */
export function generateKitchenReceipt(order: Order): string {
  const lines: string[] = [];

  // Header
  lines.push(center('*** ใบสั่งอาหาร ***'));
  lines.push(center(`#${order.id}`));
  lines.push(center(new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })));
  lines.push(divider());

  // Customer
  lines.push(`${order.customerName} | ${order.customerPhone}`);
  
  // Delivery Type
  const deliveryLabels: Record<string, string> = {
    'pickup': '[ รับเอง ]',
    'free-delivery': '[ ส่งฟรี ]',
    'easy-delivery': '[ Easy Delivery ]',
  };
  lines.push(center(deliveryLabels[order.deliveryType] || ''));

  // Address
  if (order.deliveryAddress) {
    const addr = order.deliveryAddress.length > 30 
      ? order.deliveryAddress.substring(0, 30) + '...' 
      : order.deliveryAddress;
    lines.push(addr);
  }
  lines.push(divider('='));

  // Items
  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.productName}`);
    if (item.note) {
      lines.push(`   > ${item.note}`);
    }
  });
  lines.push(divider());

  // Total
  lines.push(leftRight('รวม', `${order.items.length} รายการ`));
  lines.push(leftRight('ยอดเงิน', `${order.totalAmount} บาท`));
  
  // Payment
  const pay = order.paymentMethod === 'promptpay' ? '[โอนแล้ว]' : '[เก็บเงิน]';
  lines.push(center(pay));
  lines.push(divider('='));

  return lines.join('\n');
}

/**
 * พิมพ์ใบเสร็จ (รูปแบบกระชับ)
 */
export function printKitchenOrder(order: Order): void {
  const receiptContent = generateKitchenReceipt(order);
  
  const printWindow = window.open('', '_blank', 'width=300,height=400');
  if (!printWindow) {
    alert('กรุณาอนุญาตให้เปิด popup เพื่อพิมพ์');
    return;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>#${order.id}</title>
  <style>
    @page { size: 58mm auto; margin: 0; }
    @media print {
      html, body { width: 58mm; margin: 0; padding: 2mm; }
    }
    body {
      font-family: monospace;
      font-size: 11px;
      line-height: 1.3;
      margin: 0;
      padding: 2mm;
      width: 54mm;
    }
    pre { margin: 0; font-size: 11px; }
  </style>
</head>
<body>
<pre>${receiptContent}</pre>
<script>
window.onload = function() {
  window.print();
  setTimeout(function() { window.close(); }, 300);
};
</script>
</body>
</html>`);
  printWindow.document.close();
}
