export interface CanvasOptions {
  width: number;
  height: number;
  quality: number;
  showWatermark: boolean;
}

export async function generateTestimonialImage(
  testimonial: any,
  options: CanvasOptions
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = options.width;
  canvas.height = options.height;

  // Set up fonts
  const titleFont = `bold ${Math.floor(options.width * 0.025)}px Inter, sans-serif`;
  const bodyFont = `${Math.floor(options.width * 0.02)}px Inter, sans-serif`;
  const smallFont = `${Math.floor(options.width * 0.015)}px Inter, sans-serif`;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, options.width, options.height);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, "#f8fafc");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, options.width, options.height);

  // Card background
  const cardPadding = options.width * 0.06;
  const cardX = cardPadding;
  const cardY = cardPadding;
  const cardWidth = options.width - (cardPadding * 2);
  const cardHeight = options.height - (cardPadding * 2);
  const cardRadius = 20;

  // Draw card with rounded corners
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
  ctx.fill();
  ctx.shadowColor = "transparent";

  // Header
  const headerY = cardY + 40;
  ctx.fillStyle = "#EF4444";
  ctx.beginPath();
  ctx.roundRect(cardX + 40, headerY, 24, 24, 6);
  ctx.fill();

  // Star icon (simplified)
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("★", cardX + 52, headerY + 17);

  // Header text
  ctx.fillStyle = "#6b7280";
  ctx.font = smallFont;
  ctx.textAlign = "left";
  ctx.fillText("Customer Review", cardX + 80, headerY + 16);

  // Date
  ctx.textAlign = "right";
  ctx.fillText("June 25, 2025", cardX + cardWidth - 40, headerY + 16);

  // Rating stars
  const starsY = headerY + 50;
  const rating = testimonial.rating || 5;
  
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i < rating ? "#fbbf24" : "#d1d5db";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("★", cardX + 40 + (i * 25), starsY);
  }

  // Rating text
  ctx.fillStyle = "#111827";
  ctx.font = titleFont;
  ctx.fillText(`${rating}.0`, cardX + 40 + (5 * 25) + 10, starsY - 2);

  ctx.fillStyle = "#6b7280";
  ctx.font = smallFont;
  const ratingLabel = rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : "Good";
  ctx.fillText(ratingLabel, cardX + 40 + (5 * 25) + 60, starsY - 2);

  // Testimonial content
  const contentY = starsY + 60;
  const maxWidth = cardWidth - 80;
  const content = testimonial.content || "Enter your testimonial content to see it displayed here";
  
  ctx.fillStyle = testimonial.theme === 'glassmorphic' ? "#ffffff" : "#374151";
  ctx.font = bodyFont;
  ctx.textAlign = "left";
  
  // Word wrap
  const words = content.split(" ");
  let line = "";
  let y = contentY;
  const lineHeight = Math.floor(options.width * 0.03);

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, cardX + 40, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, cardX + 40, y);

  // Customer info
  const customerY = y + 60;
  
  // Avatar (simplified circle)
  ctx.fillStyle = "#e5e7eb";
  ctx.beginPath();
  ctx.arc(cardX + 40 + 24, customerY + 24, 24, 0, 2 * Math.PI);
  ctx.fill();

  // Customer name and details
  ctx.fillStyle = testimonial.theme === 'glassmorphic' ? "#ffffff" : "#111827";
  ctx.font = `bold ${Math.floor(options.width * 0.018)}px Inter, sans-serif`;
  ctx.fillText(testimonial.customerName || "Enter customer name", cardX + 40 + 60, customerY + 20);

  ctx.fillStyle = testimonial.theme === 'glassmorphic' ? "#e5e7eb" : "#6b7280";
  ctx.font = smallFont;
  const roleCompany = testimonial.customerRole && testimonial.customerCompany
    ? `${testimonial.customerRole} at ${testimonial.customerCompany}`
    : testimonial.customerRole || testimonial.customerCompany || "Enter role/company";
  ctx.fillText(roleCompany, cardX + 40 + 60, customerY + 40);

  // Helpful indicator
  ctx.textAlign = "right";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("👍 Helpful", cardX + cardWidth - 40, customerY + 30);

  // Footer
  const footerY = customerY + 80;
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, footerY);
  ctx.lineTo(cardX + cardWidth - 40, footerY);
  ctx.stroke();

  ctx.fillStyle = "#6b7280";
  ctx.font = smallFont;
  ctx.textAlign = "left";
  ctx.fillText("Review #7852", cardX + 40, footerY + 25);

  ctx.textAlign = "right";
  ctx.fillText("29 found this helpful • Verified purchase", cardX + cardWidth - 40, footerY + 25);

  // Watermark
  if (options.showWatermark) {
    ctx.fillStyle = "#9ca3af";
    ctx.font = `${Math.floor(options.width * 0.012)}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Powered by TestimonyShot", cardX + cardWidth / 2, footerY + 55);
  }

  return canvas;
}
