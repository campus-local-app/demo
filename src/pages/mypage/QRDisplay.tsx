interface QRDisplayProps {
  data: string;
  size?: number;
}

export function QRDisplay({ data, size = 200 }: QRDisplayProps) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  return (
    <img
      src={url}
      alt="QR 코드"
      width={size}
      height={size}
      className="rounded-xl shadow-sm"
    />
  );
}
